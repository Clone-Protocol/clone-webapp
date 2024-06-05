import { CloneClient, fromCloneScale, fromScale } from "clone-protocol-sdk/sdk/src/clone"
import { Pools, Status } from "clone-protocol-sdk/sdk/generated/clone";
import { MAX_POOLS_FOR_SHOW, assetMapping } from "~/data/assets";
import { PythHttpClient, getPythProgramKeyForCluster } from "@pythnetwork/client"
import { Connection, PublicKey } from "@solana/web3.js"
import { fetchBorrowStats, BorrowStats, fetchPoolApy, fetchUserApy, fetchPoolAnalytics } from "./fetch_netlify";
import { IS_DEV } from "~/data/networks";

export type Interval = 'day' | 'hour';
export type Filter = 'day' | 'week' | 'month' | 'year';

export const getiAssetInfos = async (connection: Connection, program: CloneClient): Promise<{ status: Status, poolIndex: number, poolPrice: number, liquidity: number }[]> => {
  const pythClient = new PythHttpClient(connection, new PublicKey(getPythProgramKeyForCluster(IS_DEV ? "devnet" : "mainnet-beta")));
  const data = await pythClient.getData();
  const pools = await program.getPools();
  const oracles = await program.getOracles();

  const iassetInfo = [];
  for (let poolIndex = 0; poolIndex < MAX_POOLS_FOR_SHOW; poolIndex++) {
    const pool = pools.pools[poolIndex];
    const status = pool.status
    const oracle = oracles.oracles[Number(pool.assetInfo.oracleInfoIndex)];
    const pythUsdcOraclePrice = data.productPrice.get("Crypto.USDC/USD")?.aggregate.price!
    const committedCollateral = fromScale(pool.committedCollateralLiquidity, program.clone.collateral.scale)
    const poolCollateralIld = fromScale(pool.collateralIld, program.clone.collateral.scale)
    const poolOnassetIld = fromCloneScale(pool.onassetIld)
    const { pythSymbol } = assetMapping(poolIndex)
    const rescaleFactor = Math.pow(10, oracle.rescaleFactor)
    const oraclePrice = rescaleFactor * data.productPrice.get(pythSymbol)?.aggregate.price! / pythUsdcOraclePrice;
    const poolPrice = (committedCollateral - poolCollateralIld) / (committedCollateral / oraclePrice - poolOnassetIld)
    const liquidity = committedCollateral * 2;
    iassetInfo.push({ status, poolIndex, poolPrice, liquidity, oraclePrice });
  }
  return iassetInfo;
}

export type AggregatedStats = {
  volumeUSD: number,
  fees: number,
  previousVolumeUSD: number,
  previousFees: number,
  liquidityUSD: number,
  previousLiquidity: number
  apy: number
}

export const getAggregatedPoolStats = async (pools: Pools, userAddressForApy?: PublicKey): Promise<AggregatedStats[]> => {
  // If userAddressForApy is passed the APY will be of the user's pool APY
  let result = pools.pools.map((pool) => {
    return {
      volumeUSD: 0, fees: 0, previousVolumeUSD: 0, previousFees: 0,
      liquidityUSD: fromScale(pool.committedCollateralLiquidity, 6) * 2,
      previousLiquidity: 0, apy: 0
    }
  });

  let analytics = await fetchPoolAnalytics();

  analytics.forEach((item) => {
    result[item.pool_index].volumeUSD = item.current_volume
    result[item.pool_index].previousVolumeUSD = item.previous_volume
    result[item.pool_index].fees = item.current_fees
    result[item.pool_index].previousFees = item.previous_fees
    result[item.pool_index].previousLiquidity = item.previous_liquidity
  })

  if (userAddressForApy) {
    const poolIndices: number[] = []
    pools.pools.forEach((_, index) => { poolIndices.push(index) })
    const userApyData = await fetchUserApy(userAddressForApy.toString(), poolIndices)
    userApyData.poolApy.forEach((apy, index) => {
      result[index].apy = apy
    })

  } else {
    const apyData = await fetchPoolApy();

    apyData.forEach((item) => {
      try {
        result[Number(item.pool_index)].apy = item.apy_24hr ?? 0
      } catch (e) {
        console.error('error', e)
      }
    })
  }

  return result
}


type BorrowResult = { currentAmount: number, previousAmount: number, currentTVL: number, previousTVL: number }


export const fetchBorrowData = async (numPools: number): Promise<BorrowResult[]> => {
  const rawData = await fetchBorrowStats()
  let result: BorrowResult[] = []
  for (let i = 0; i < numPools; i++) {
    result.push(
      parseBorrowData(rawData.filter((data) => Number(data.pool_index) === i))
    )
  }
  return result;
}

const parseBorrowData = (data: BorrowStats[]): BorrowResult => {
  if (data.length === 0) {
    return { currentAmount: 0, previousAmount: 0, currentTVL: 0, previousTVL: 0 }
  } else if (data.length === 1) {
    const latestEntry = data[0]
    const currentAmount = fromCloneScale(latestEntry.cumulative_borrowed_delta)
    const currentTVL = fromScale(latestEntry.cumulative_collateral_delta, 6)
    const latestEntryDate = new Date(latestEntry.time_interval)
    const now = new Date();
    const hoursElapsed = (now.getTime() - latestEntryDate.getTime()) / 3600000
    if (hoursElapsed <= 24) {
      return { currentAmount, previousAmount: 0, currentTVL, previousTVL: 0 }
    } else {
      return { currentAmount, previousAmount: currentAmount, currentTVL, previousTVL: currentTVL }
    }
  } else {
    // Should only be two entries.
    const firstEntry = data[0]
    const previousAmount = fromCloneScale(firstEntry.cumulative_borrowed_delta)
    const previousTVL = fromScale(firstEntry.cumulative_collateral_delta, 6)
    const latestEntry = data.at(-1)!
    const currentAmount = fromCloneScale(latestEntry.cumulative_borrowed_delta)
    const currentTVL = fromScale(latestEntry.cumulative_collateral_delta, 6)
    return { currentAmount, previousAmount, currentTVL, previousTVL }
  }
}