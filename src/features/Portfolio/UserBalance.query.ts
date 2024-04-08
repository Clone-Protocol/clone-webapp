import { QueryObserverOptions, useQuery } from '@tanstack/react-query'
import { PublicKey } from '@solana/web3.js'
import { CloneClient, fromScale, fromCloneScale } from 'clone-protocol-sdk/sdk/src/clone'
import { useClone } from '~/hooks/useClone'
import { assetMapping, AssetType } from '~/data/assets'
import { REFETCH_CYCLE, REFETCH_SHORT_CYCLE } from '~/components/Markets/TradingBox/RateLoadingIndicator'
import { getTokenAccount } from '~/utils/token_accounts'
import { useAnchorWallet } from '@solana/wallet-adapter-react';
import { getCollateralAccount } from "~/utils/token_accounts"
import { calculatePoolAmounts } from "clone-protocol-sdk/sdk/src/utils"
import { fetchPythPriceHistory, getPythOraclePrices } from '~/utils/pyth'
import { Status } from 'clone-protocol-sdk/sdk/generated/clone'
import { DEFAULT_ALL_INDEX, STABLE_COIN_INDEX } from './filterAtom'

const fetchOnassetBalance = async (onassetMint: PublicKey, program: CloneClient) => {
	const onassetAssociatedTokenAccount = await getTokenAccount(
		onassetMint, program.provider.publicKey!, program.provider.connection
	);
	if (onassetAssociatedTokenAccount.isInitialized) {
		const balance = await program.provider.connection.getTokenAccountBalance(onassetAssociatedTokenAccount.address, "processed");
		return balance.value.uiAmount!;
	} else {
		return 0;
	}
}

export const fetchUserTotalBalance = async ({ program, userPubKey }: { program: CloneClient, userPubKey: PublicKey | null }) => {
	if (!userPubKey) return []

	console.log('fetchUserTotalBalance')

	let onusdVal = 0.0
	const devnetConversionFactor = Math.pow(10, -program.clone.collateral.scale)
	const collateralAssociatedTokenAccount = await getCollateralAccount(program);
	if (collateralAssociatedTokenAccount.isInitialized) {
		const onusdBalance = await program.provider.connection.getTokenAccountBalance(collateralAssociatedTokenAccount.address, "processed");
		onusdVal = Number(onusdBalance.value.amount) * devnetConversionFactor;
	}

	const pools = await program.getPools();
	const oracles = await program.getOracles();
	const priceMap = await getPythOraclePrices(program.provider.connection);

	const balanceQueries = [];
	for (let i = 0; i < Number(pools.pools.length); i++) {
		balanceQueries.push(
			fetchOnassetBalance(pools.pools[i].assetInfo.onassetMint, program)
		)
	}

	const onassetBalancesResult = await Promise.allSettled(balanceQueries);
	const result = []
	const collateralScale = program.clone.collateral.scale
	for (let i = 0; i < Number(pools.pools.length); i++) {
		const pool = pools.pools[i]
		const oracle = oracles.oracles[pool.assetInfo.oracleInfoIndex]
		const rescaleFactor = Math.pow(10, oracle.rescaleFactor)
		const { poolCollateral, poolOnasset } = calculatePoolAmounts(
			fromScale(pool.collateralIld, collateralScale),
			fromCloneScale(pool.onassetIld),
			fromScale(pool.committedCollateralLiquidity, collateralScale),
			rescaleFactor * priceMap.get(assetMapping(i).pythSymbol)! / priceMap.get("Crypto.USDC/USD")!,
			program.clone.collateral
		)
		const price = poolCollateral / poolOnasset
		const balanceQueryResult = onassetBalancesResult[i];
		const assetBalance = balanceQueryResult.status === "fulfilled" ? balanceQueryResult.value : 0;
		if (assetBalance > 0) {
			result.push({
				id: i,
				onusdBalance: price * assetBalance,
			})
		}
	}

	const totalBalance = onusdVal + result.reduce((prev, curr) => {
		return prev + curr.onusdBalance
	}, 0)

	return totalBalance
}

export function useUserTotalBalanceQuery({ userPubKey, refetchOnMount, enabled = true }: GetAssetsProps) {
	const wallet = useAnchorWallet()
	const { getCloneApp } = useClone()

	if (wallet) {
		return useQuery({
			queryKey: ['userTotalBalance', wallet, userPubKey],
			queryFn: async () => fetchUserTotalBalance({ program: await getCloneApp(wallet), userPubKey }),
			refetchOnMount,
			refetchInterval: REFETCH_CYCLE,
			refetchIntervalInBackground: true,
			enabled,
		})
	} else {
		return useQuery({
			queryKey: ['userTotalBalance'], queryFn: () => []
		})
	}
}


export const fetchUserBalance = async ({ program, userPubKey }: { program: CloneClient, userPubKey: PublicKey | null }) => {
	if (!userPubKey) return []

	console.log('fetchUserBalance')
	const pools = await program.getPools();
	const oracles = await program.getOracles();
	const priceMap = await getPythOraclePrices(program.provider.connection);

	const balanceQueries = [];
	for (let i = 0; i < Number(pools.pools.length); i++) {
		balanceQueries.push(
			fetchOnassetBalance(pools.pools[i].assetInfo.onassetMint, program)
		)
	}
	const onassetBalancesResult = await Promise.allSettled(balanceQueries);
	const result: BalanceList[] = []
	const collateralScale = program.clone.collateral.scale
	for (let i = 0; i < Number(pools.pools.length); i++) {
		const { tickerName, tickerSymbol, tickerIcon, assetType, pythSymbol } = assetMapping(i)
		const pool = pools.pools[i]
		const oracle = oracles.oracles[pool.assetInfo.oracleInfoIndex]
		const rescaleFactor = Math.pow(10, oracle.rescaleFactor);
		const { poolCollateral, poolOnasset } = calculatePoolAmounts(
			fromScale(pool.collateralIld, collateralScale),
			fromCloneScale(pool.onassetIld),
			fromScale(pool.committedCollateralLiquidity, collateralScale),
			rescaleFactor * priceMap.get(assetMapping(i).pythSymbol)! / priceMap.get("Crypto.USDC/USD")!,
			program.clone.collateral
		)
		const price = poolCollateral / poolOnasset
		const balanceQueryResult = onassetBalancesResult[i];
		const assetBalance = balanceQueryResult.status === "fulfilled" ? balanceQueryResult.value : 0;

		// calculate change 24h
		const priceData = await fetchPythPriceHistory(
			pythSymbol, '1D'
		)
		const openPrice = priceData[0] ? Number(priceData[0].price) : 0
		const closePrice = priceData[0] ? Number(priceData.at(-1)!.price) : 0
		const change24h = priceData[0] ? (closePrice / openPrice - 1) * 100 : 0

		if (assetBalance > 0) {
			result.push({
				id: i,
				tickerName,
				tickerSymbol,
				tickerIcon,
				price,
				changePercent: change24h,
				assetType: assetType,
				assetBalance,
				onusdBalance: price * assetBalance,
				status: pool.status
			})
		}
	}

	//set percent val for each asset
	const totalBalance = result.reduce((prev, curr) => {
		return prev + curr.onusdBalance
	}, 0)
	result.forEach((asset) => {
		asset.percentVal = totalBalance > 0 ? asset.onusdBalance * 100 / totalBalance : 0
	})
	result.sort((a, b) => {
		return a.percentVal! < b.percentVal! ? 1 : -1
	})

	return result
}

interface GetAssetsProps {
	userPubKey: PublicKey | null
	selectedFilter?: number
	refetchOnMount?: boolean | "always"
	enabled?: boolean
}

export interface BalanceList {
	id: number
	tickerName: string
	tickerSymbol: string
	tickerIcon: string
	price: number
	changePercent: number
	assetType: number
	assetBalance: number
	onusdBalance: number
	percentVal?: number
	status: Status
}

export function useUserBalanceQuery({ userPubKey, selectedFilter, refetchOnMount, enabled = true }: GetAssetsProps) {
	const wallet = useAnchorWallet()
	const { getCloneApp } = useClone()

	if (wallet) {
		return useQuery({
			queryKey: ['userBalance', wallet, userPubKey],
			queryFn: async () => fetchUserBalance({ program: await getCloneApp(wallet), userPubKey }),
			refetchOnMount,
			refetchInterval: REFETCH_SHORT_CYCLE,
			refetchIntervalInBackground: true,
			enabled,
			select: (assets) => assets.filter((asset) => {
				if (selectedFilter === DEFAULT_ALL_INDEX) {
					return asset.assetType === AssetType.Crypto
				} else if (selectedFilter !== STABLE_COIN_INDEX) {
					return asset.id === selectedFilter
				}
				return true;
			})
		})
	} else {
		return useQuery({
			queryKey: ['userBalance'],
			queryFn: () => []
		})
	}
}
