import { useQuery } from '@tanstack/react-query'
import { PublicKey } from '@solana/web3.js'
import { CloneClient, fromCloneScale, fromScale } from 'clone-protocol-sdk/sdk/src/clone'
import { ASSETS, assetMapping } from 'src/data/assets'
import { useClone } from '~/hooks/useClone'
import { getHealthScore, getILD } from "clone-protocol-sdk/sdk/src/healthscore"
import { useAnchorWallet } from '@solana/wallet-adapter-react'
import { REFETCH_CYCLE } from '~/components/Common/DataLoadingIndicator'
import { fetchBalance } from '~/features/Liquidity/borrow/Balance.query'
import { calculatePoolAmounts } from 'clone-protocol-sdk/sdk/src/utils'
import { Comet, Pools, Status } from 'clone-protocol-sdk/sdk/generated/clone'
import { fetchPythOraclePrices } from '~/utils/pyth'
import { AnchorProvider } from '@coral-xyz/anchor'

export const fetchLiquidityDetail = async ({
	program,
	userPubKey,
	index,
}: {
	program: CloneClient
	userPubKey: PublicKey | null
	index: number
}) => {
	if (!userPubKey) return

	console.log('fetchLiquidityDetail :: LiquidityPosition.query',)

	const [poolsData, oraclesData, userAccountData] = await Promise.allSettled([
		program.getPools(), program.getOracles(), program.getUserAccount()
	]);

	if (poolsData.status === 'rejected' || oraclesData.status === 'rejected' || userAccountData.status === 'rejected')
		return;

	const pythOraclePrices = await fetchPythOraclePrices(program.provider as AnchorProvider, oraclesData.value)

	const pools = poolsData.value
	const pool = pools.pools[index]
	if (!pool) return;

	const assetId = index
	const { tickerIcon, tickerName, tickerSymbol } = assetMapping(assetId)
	const oraclePrice = pythOraclePrices[pool.assetInfo.oracleInfoIndex];
	const status = pool.status

	const { poolCollateral, poolOnasset } = calculatePoolAmounts(
		fromCloneScale(pool.collateralIld),
		fromCloneScale(pool.onassetIld),
		fromScale(pool.committedCollateralLiquidity, program.clone.collateral.scale),
		oraclePrice,
		program.clone.collateral
	)
	const price = poolCollateral / poolOnasset

	let totalCollValue = 0
	let totalHealthScore = 0
	let effCollValue = 0
	let comet;
	let hasNoCollateral = false
	let hasAlreadyPool = false
	let hasFullPool = false
	if (userAccountData.status === 'fulfilled') {
		comet = userAccountData.value.comet
		totalCollValue = fromScale(comet.collateralAmount, program.clone.collateral.scale)
		const { healthScore, effectiveCollateralValue } = getHealthScore(oraclesData.value, pools, comet, program.clone.collateral, pythOraclePrices)
		totalHealthScore = healthScore
		effCollValue = effectiveCollateralValue
		hasNoCollateral = totalCollValue === 0

		if (comet.positions.length >= ASSETS.length) {
			hasFullPool = true
		} else {
			for (let i = 0; i < Number(comet.positions.length); i++) {
				const poolIndex = Number(comet.positions[i].poolIndex)
				if (assetId === poolIndex) {
					hasAlreadyPool = true
					break;
				}
			}
		}
	}

	return {
		tickerIcon: tickerIcon,
		tickerName: tickerName,
		tickerSymbol: tickerSymbol,
		status,
		price,
		totalCollValue,
		totalHealthScore,
		pools: poolsData.value,
		comet,
		hasNoCollateral,
		hasAlreadyPool,
		hasFullPool,
		oraclePrice,
		effectiveCollateralValue: effCollValue
	}
}

export interface PositionInfo {
	tickerIcon: string
	tickerName: string
	tickerSymbol: string
	status: Status
	price: number
	totalCollValue: number
	totalHealthScore: number
	pools: Pools,
	comet: Comet | undefined
	hasNoCollateral: boolean
	hasAlreadyPool: boolean
	hasFullPool: boolean
	oraclePrice: number
	effectiveCollateralValue: number
}

interface GetProps {
	userPubKey: PublicKey | null
	index: number
	refetchOnMount?: boolean | "always"
	enabled?: boolean
}

export function useLiquidityDetailQuery({ userPubKey, index, refetchOnMount, enabled = true }: GetProps) {
	const wallet = useAnchorWallet()
	const { getCloneApp } = useClone()
	// console.log('useLiquidityDetailQuery start')
	if (wallet) {
		return useQuery({
			queryKey: ['liquidityPosition', wallet, userPubKey, index],
			queryFn: async () => fetchLiquidityDetail({ program: await getCloneApp(wallet), userPubKey, index }),
			refetchOnMount,
			refetchInterval: REFETCH_CYCLE,
			refetchIntervalInBackground: true,
			enabled,
		})
	} else {
		return useQuery({ queryKey: ['liquidityPosition'], queryFn: () => { return null } })
	}
}


export const fetchCloseLiquidityPosition = async ({
	program,
	userPubKey,
	index,
}: {
	program: CloneClient
	userPubKey: PublicKey | null
	index: number
}) => {
	if (!userPubKey) return

	console.log('fetchCloseLiquidityPosition :: LiquidityPosition.query')

	const [poolsData, oraclesData, accountData] = await Promise.allSettled([program.getPools(), program.getOracles(), program.getUserAccount()])

	if (poolsData.status === 'rejected' || oraclesData.status === 'rejected' || accountData.status === 'rejected') return

	const pools = poolsData.value
	const oracles = oraclesData.value
	const comet = accountData.value.comet
	const collateral = program.clone.collateral
	const position = comet.positions[index]
	const poolIndex = Number(position.poolIndex)
	const pool = pools.pools[poolIndex]
	const onassetMint = pool.assetInfo.onassetMint

	const balance = await fetchBalance({
		program,
		userPubKey,
		index: poolIndex,
	})

	const { onAssetILD, collateralILD, oraclePrice } = getILD(collateral, pools, oracles, comet)[index];
	const assetId = poolIndex
	const { tickerIcon, tickerName, tickerSymbol } = assetMapping(assetId)
	const committedCollateralLiquidity = fromScale(position.committedCollateralLiquidity, collateral.scale)
	const { poolCollateral, poolOnasset } = calculatePoolAmounts(
		fromScale(pool.collateralIld, collateral.scale),
		fromCloneScale(pool.onassetIld),
		committedCollateralLiquidity,
		oraclePrice,
		collateral
	)
	const price = poolCollateral / poolOnasset

	const prevHealthScore = getHealthScore(oracles, pools, comet, program.clone.collateral).healthScore
	const totalCollateralAmount = fromScale(comet.collateralAmount, collateral.scale)

	const ildDebtNotionalValue = Math.max(collateralILD, 0) + Math.max(onAssetILD * oraclePrice, 0)
	const healthScoreIncrease = (
		fromScale(pool.assetInfo.ilHealthScoreCoefficient, 2) * ildDebtNotionalValue +
		committedCollateralLiquidity * fromScale(pool.assetInfo.positionHealthScoreCoefficient, 2)
	) / totalCollateralAmount
	const healthScore = prevHealthScore + healthScoreIncrease
	const isValidToClose = balance?.onusdVal! >= collateralILD && balance?.onassetVal! >= onAssetILD

	return {
		tickerIcon,
		tickerName,
		tickerSymbol,
		price,
		pools,
		comet,
		healthScore,
		prevHealthScore,
		collateralILD,
		onassetILD: onAssetILD,
		oraclePrice,
		ildDebtNotionalValue,
		onassetVal: balance?.onassetVal!,
		onusdVal: balance?.onusdVal!,
		isValidToClose,
		onassetMint,
		committedCollateralLiquidity,
		totalCollateralAmount
	}
}

export interface CloseLiquidityPositionInfo {
	tickerIcon: string
	tickerName: string
	tickerSymbol: string
	price: number
	pools: Pools
	comet: Comet | undefined
	healthScore: number
	prevHealthScore: number
	collateralILD: number
	onassetILD: number
	oraclePrice: number
	ildDebtNotionalValue: number
	onassetVal: number
	collateralVal: number
	isValidToClose: boolean
	onassetMint: PublicKey
	committedCollateralLiquidity: number
	totalCollateralAmount: number
}

export function useLiquidityPositionQuery({ userPubKey, index, refetchOnMount, enabled = true }: GetProps) {
	const wallet = useAnchorWallet()
	const { getCloneApp } = useClone()

	if (wallet) {
		return useQuery({
			queryKey: ['closeLiquidityPosition', wallet, userPubKey, index],
			queryFn: async () => fetchCloseLiquidityPosition({ program: await getCloneApp(wallet), userPubKey, index }),
			refetchOnMount,
			refetchInterval: REFETCH_CYCLE,
			refetchIntervalInBackground: true,
			enabled,
		})
	} else {
		return useQuery({ queryKey: ['closeLiquidityPosition'], queryFn: () => { return null } })
	}
}


