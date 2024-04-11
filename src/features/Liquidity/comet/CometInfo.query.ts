import { useQuery } from '@tanstack/react-query'
import { PublicKey } from '@solana/web3.js'
import { CloneClient, fromCloneScale, fromScale } from 'clone-protocol-sdk/sdk/src/clone'
import { Comet, Oracles, Pools, Status } from 'clone-protocol-sdk/sdk/generated/clone'
import { getHealthScore, getILD } from "clone-protocol-sdk/sdk/src/healthscore"
import { useClone } from '~/hooks/useClone'
import { REFETCH_SHORT_CYCLE } from '~/components/Common/DataLoadingIndicator'
import { assetMapping } from '~/data/assets'
import { useAnchorWallet } from '@solana/wallet-adapter-react'
import { Collateral as StableCollateral, collateralMapping } from '~/data/assets'
import { calculatePoolAmounts } from 'clone-protocol-sdk/sdk/src/utils'
import { AggregatedStats, getAggregatedPoolStats } from '~/utils/assets'
import { fetchUserApy } from '~/utils/fetch_netlify'

export const fetchInfos = async ({ program, userPubKey }: { program: CloneClient, userPubKey: PublicKey | null }) => {
	if (!userPubKey) return
	console.log('fetchInfos :: CometInfo.query')

	let healthScore = 0
	let totalCollValue = 0
	let totalLiquidity = 0
	let hasNoCollateral = false
	let totalApy = 0
	let collaterals: Collateral[] = [];
	let positions: LiquidityPosition[] = [];

	const [userAccountData, poolsData, oraclesData] = await Promise.allSettled([
		program.getUserAccount(), program.getPools(), program.getOracles()
	]);

	if (userAccountData.status === "fulfilled" && poolsData.status === "fulfilled" && oraclesData.status === "fulfilled") {
		const poolStats = await getAggregatedPoolStats(poolsData.value, userPubKey)
		totalApy = (await fetchUserApy(userPubKey.toString(), userAccountData.value.comet.positions.map(p => p.poolIndex))).apy

		const comet = userAccountData.value.comet
		collaterals = extractCollateralInfo(program, comet)
		positions = extractLiquidityPositionsInfo(program, comet, poolsData.value, oraclesData.value, collaterals[0], poolStats)

		collaterals.forEach(c => {
			totalCollValue += c.collAmount * c.collAmountDollarPrice
		});
		positions.forEach(p => {
			totalLiquidity += p.liquidityDollarPrice
		})
		hasNoCollateral = totalCollValue === 0
		healthScore = Math.ceil(getHealthScore(oraclesData.value, poolsData.value, comet, program.clone.collateral).healthScore)
	}

	const result = {
		healthScore,
		totalCollValue,
		totalLiquidity,
		collaterals,
		hasNoCollateral,
		totalApy,
		positions
	}

	return result
}

export interface CometInfoStatus {
	healthScore: number
	totalCollValue: number
	totalLiquidity: number
	totalApy: number
	collaterals: Collateral[]
	hasNoCollateral: boolean
	positions: LiquidityPosition[]
}

interface GetPoolsProps {
	userPubKey: PublicKey | null
	refetchOnMount?: boolean | "always"
	index?: number
	enabled?: boolean
}

export interface Collateral {
	tickerSymbol: string
	tickerIcon: string
	tickerName: string
	collAmount: number
	collAmountDollarPrice: number
}

const extractCollateralInfo = (program: CloneClient, comet: Comet): Collateral[] => {
	const result: Collateral[] = [];
	const onUSDInfo = collateralMapping(StableCollateral.onUSD)
	result.push(
		{
			tickerIcon: onUSDInfo.collateralIcon,
			tickerSymbol: onUSDInfo.collateralSymbol,
			tickerName: onUSDInfo.collateralName,
			collAmount: fromScale(comet.collateralAmount, program.clone.collateral.scale),
			collAmountDollarPrice: 1
		}
	)
	return result;
}

export interface LiquidityPosition {
	tickerSymbol: string
	tickerIcon: string
	tickerName: string
	liquidityDollarPrice: number
	positionIndex: number
	poolIndex: number
	ildValue: number
	ildDollarPrice: number
	rewards: number
	apy: number
	status: Status
}

const extractLiquidityPositionsInfo = (program: CloneClient, comet: Comet, pools: Pools, oracles: Oracles, coll: Collateral, poolStats: AggregatedStats[]): LiquidityPosition[] => {
	const result: LiquidityPosition[] = [];
	const collateral = program.clone.collateral;
	const ildInfo = getILD(collateral, pools, oracles, comet);

	for (let i = 0; i < comet.positions.length; i++) {
		const position = comet.positions[i];
		const poolIndex = Number(position.poolIndex)
		const info = assetMapping(poolIndex);
		const pool = pools.pools[Number(position.poolIndex)];
		const status = pool.status

		const [ildValue, _] = (() => {
			const info = ildInfo[i];
			if (info.onAssetILD > 0) {
				return [info.onAssetILD, false]
			}
			if (info.collateralILD > 0) {
				return [info.collateralILD, true]
			}
			return [0, true]
		})();

		let rewards = 0
		if (ildInfo[i].collateralILD < 0) {
			rewards += (-ildInfo[i]!.collateralILD)
		}
		if (ildInfo[i].onAssetILD < 0) {
			rewards += (-ildInfo[i]!.onAssetILD * ildInfo[i]!.oraclePrice)
		}

		const liquidityDollarPrice = fromScale(position.committedCollateralLiquidity, program.clone.collateral.scale) * 2
		// ildValue is summmed both with onAssetILD and collateralILD
		const ildDollarPrice = (Math.max(0, ildInfo[i].onAssetILD) * ildInfo[i].oraclePrice) + (Math.max(0, ildInfo[i].collateralILD))
		const apy = poolStats[poolIndex].apy

		result.push(
			{
				tickerIcon: info.tickerIcon,
				tickerSymbol: info.tickerSymbol,
				tickerName: info.tickerName,
				liquidityDollarPrice,
				ildValue,
				positionIndex: i,
				poolIndex,
				ildDollarPrice,
				rewards,
				apy,
				status
			} as LiquidityPosition
		)
	}

	return result;
}

export function useCometInfoQuery({ userPubKey, refetchOnMount, enabled = true }: GetPoolsProps) {
	const wallet = useAnchorWallet()
	const { getCloneApp } = useClone()

	if (wallet) {
		return useQuery({
			queryKey: ['cometInfos', wallet, userPubKey],
			queryFn: async () => fetchInfos({ program: await getCloneApp(wallet), userPubKey }),

			refetchOnMount,
			refetchInterval: REFETCH_SHORT_CYCLE,
			refetchIntervalInBackground: true,
			enabled,
		})
	} else {
		return useQuery({
			queryKey: ['cometInfos'],
			queryFn: () => {
				return {
					healthScore: 0,
					totalCollValue: 0,
					totalLiquidity: 0,
					collaterals: [],
					hasNoCollateral: true,
					positions: []
				}
			}
		})
	}
}

export const fetchInitializeCometDetail = async ({ program, index }: { program: CloneClient, index: number }) => {
	const pools = await program.getPools();
	const pool = pools.pools[index];
	const oracles = await program.getOracles()
	const oracle = oracles.oracles[Number(pool.assetInfo.oracleInfoIndex)];
	const usdcOracle = oracles.oracles[Number(program.clone.collateral.oracleInfoIndex)]
	const { poolOnasset, poolCollateral } = calculatePoolAmounts(
		fromCloneScale(pool.collateralIld),
		fromCloneScale(pool.onassetIld),
		fromScale(pool.committedCollateralLiquidity, program.clone.collateral.scale),
		fromScale(oracle.price, oracle.expo) / fromScale(usdcOracle.price, usdcOracle.expo),
		program.clone.collateral
	)
	const price = poolCollateral / poolOnasset
	const tightRange = price * 0.1
	const maxRange = 2 * price
	const centerPrice = price
	const { tickerIcon, tickerName, tickerSymbol, pythSymbol } = assetMapping(index)

	return {
		tickerIcon: tickerIcon,
		tickerName: tickerName,
		tickerSymbol: tickerSymbol,
		pythSymbol,
		price,
		tightRange,
		maxRange,
		centerPrice,
	}
}

const fetchInitCometDetailDefault = () => {
	const { tickerIcon, tickerName, tickerSymbol, pythSymbol } = assetMapping(0)
	return (
		{
			tickerIcon,
			tickerName,
			tickerSymbol,
			pythSymbol,
			price: 1.1,
			tightRange: 0.11,
			maxRange: 2.2,
			centerPrice: 1.1,
		}
	)
}

export function useInitCometDetailQuery({ index, refetchOnMount, enabled = true }: GetPoolsProps) {
	const wallet = useAnchorWallet()
	const { getCloneApp } = useClone()
	if (wallet) {
		return useQuery({
			queryKey: ['initComet', wallet, index],
			queryFn: async () => fetchInitializeCometDetail({ program: await getCloneApp(wallet), index }),
			refetchOnMount,
			enabled
		})
	} else {
		return useQuery({ queryKey: ['initComet'], queryFn: () => { return fetchInitCometDetailDefault() } })
	}
}
