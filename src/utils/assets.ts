import { CLONE_TOKEN_SCALE, CloneClient, fromCloneScale, fromScale } from "clone-protocol-sdk/sdk/src/clone"
import { StatsData, fetchOHLCV, fetchStatsData as netlifyFetchStatsData } from "./fetch_netlify";
import { assetMapping } from "~/data/assets";
import { PythHttpClient, getPythProgramKeyForCluster } from "@pythnetwork/client"
import { Connection, PublicKey } from "@solana/web3.js"
import { Status } from "clone-protocol-sdk/sdk/generated/clone";
import { IS_DEV } from "~/data/networks";

export type Interval = 'day' | 'hour';
export type Filter = 'day' | 'week' | 'month' | 'year';

export type ResponseValue = {
  datetime: string;
  pool_index: string;
  total_liquidity: string;
  trading_volume: string;
  total_trading_fees: string;
  total_treasury_fees: string;
};

export const generateDates = (start: Date, interval: Interval): Date[] => {
  const currentDate = new Date(start.getTime()); // Create a new date object to avoid mutating the original
  const dates = [new Date(currentDate)]; // Include the start date in the array
  const now = new Date(); // Get current timestamp

  while (currentDate < now) {
    if (interval === 'hour') {
      currentDate.setHours(currentDate.getHours() + 1);
    } else if (interval === 'day') {
      currentDate.setDate(currentDate.getDate() + 1);
    }

    // Only add the date if it's before the current time
    if (currentDate < now) {
      dates.push(new Date(currentDate)); // Create a new date object to avoid references to the same object
    }
  }
  return dates;
}

export const fetchStatsData = async (filter: Filter, interval: Interval): Promise<StatsData[]> => {
  const response = await netlifyFetchStatsData(interval, filter)
  return response as StatsData[]
}


export const getiAssetInfos = async (connection: Connection, program: CloneClient): Promise<{ status: Status, poolIndex: number, poolPrice: number, liquidity: number }[]> => {
  const pythClient = new PythHttpClient(connection, new PublicKey(getPythProgramKeyForCluster(IS_DEV ? "devnet" : "mainnet-beta")));
  const data = await pythClient.getData();
  const pools = await program.getPools();
  const oracles = await program.getOracles();

  const iassetInfo = [];
  for (let poolIndex = 0; poolIndex < Number(pools.pools.length); poolIndex++) {
    const pool = pools.pools[poolIndex];
    const status = pool.status
    const oracle = oracles.oracles[Number(pool.assetInfo.oracleInfoIndex)];
    const committedCollateral = fromScale(pool.committedCollateralLiquidity, program.clone.collateral.scale)
    const poolCollateralIld = fromScale(pool.collateralIld, program.clone.collateral.scale)
    const poolOnassetIld = fromCloneScale(pool.onassetIld)
    const { pythSymbol } = assetMapping(poolIndex)
    const rescaleFactor = Math.pow(10, oracle.rescaleFactor)
    const oraclePrice = rescaleFactor * (data.productPrice.get(pythSymbol)?.aggregate.price ?? fromScale(oracle.price, oracle.expo));
    const poolPrice = (committedCollateral - poolCollateralIld) / (committedCollateral / oraclePrice - poolOnassetIld)
    const liquidity = committedCollateral * 2;
    iassetInfo.push({ status, poolIndex, poolPrice, liquidity });
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
}

export const fetch24hourVolume = async () => {
  let data = await fetchOHLCV("hour", "month");

  let result: Map<number, number> = new Map()
  const now = new Date()
  const isWithin24hrs = (date: Date) => {
    return (date.getTime() >= (now.getTime() - 86400000))
  }
  const conversion = Math.pow(10, -CLONE_TOKEN_SCALE)
  data.forEach((response) => {
    if (!isWithin24hrs(new Date(response.time_interval))) {
      return;
    }
    const poolIndex = Number(response.pool_index)
    result.set(poolIndex, (result.get(poolIndex) ?? 0) + Number(response.volume) * conversion)
  })
  return result
}