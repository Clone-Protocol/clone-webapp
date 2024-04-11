import { useQuery } from "@tanstack/react-query"
import { FilterTime } from "~/components/Charts/TimeTabs"
import { Interval } from "src/utils/assets"
import {
  fetchTotalCumulativeVolume,
  fetchTotalLiquidity as netlifyFetchTotalLiquidity,
} from "src/utils/fetch_netlify"
import { Pools } from "clone-protocol-sdk/sdk/generated/clone"
import { useAtomValue } from "jotai"
import { cloneClient, rpcEndpoint } from "../globalAtom"
import { CloneClient } from "clone-protocol-sdk/sdk/src/clone"
import { getCloneClient } from "../baseQuery"

export interface ChartElem {
  time: string
  value: number
}

type TimeSeriesValue = { time: string; value: number }

const getTimeFrames = (timeframe: FilterTime): [number, string, string, number] => {
  switch (timeframe) {
    case "1y":
      return [365, "year", "day" as Interval, 86400000]
    case "30d":
      return [30, "month", "day" as Interval, 86400000]
    case "7d":
      return [7, "week", "hour" as Interval, 3600000]
    case "24h":
      return [1, "day", "hour" as Interval, 3600000]
    default:
      throw new Error(`Unexpected timeframe: ${timeframe}`)
  }
}

export const fetchTotalLiquidity = async ({
  mainCloneClient,
  timeframe,
  networkEndpoint,
}: {
  mainCloneClient?: CloneClient | null
  timeframe: FilterTime
  networkEndpoint: string
}) => {
  let program
  if (mainCloneClient) {
    program = mainCloneClient
  } else {
    const { cloneClient: cloneProgram } = await getCloneClient(networkEndpoint)
    program = cloneProgram
  }

  const [_, filter, interval, intervalMs] = getTimeFrames(timeframe)
  const aggregatedData = await netlifyFetchTotalLiquidity(interval, filter)
  const dataMap = new Map<number, number>()
  aggregatedData.forEach((item) => {
    dataMap.set(new Date(item.time_interval).getTime(), 2 * item.total_liquidity * Math.pow(10, -6))
  })

  const now = new Date()
  const currentIntervalDt = new Date(now.getTime() - (now.getTime() % intervalMs))
  const startDate = new Date(aggregatedData[0].time_interval)

  let chartData = backfillWithZeroValue(startDate, currentIntervalDt, intervalMs)
  let currentValue = 0
  for (const item of chartData) {
    const value = dataMap.get(new Date(item.time).getTime())
    if (value) {
      currentValue = value
    }
    item.value = currentValue
  }
  // Fetch latest record
  // const connection = new Connection(networkEndpoint, 'confirmed')
  const connection = program.provider.connection
  const poolAddress = program.getPoolsAddress()
  const pools = await Pools.fromAccountAddress(connection, poolAddress)
  let latestLiquidity = 0
  pools.pools.forEach((pool) => {
    latestLiquidity += pool.committedCollateralLiquidity * Math.pow(10, -6) * 2
  })
  chartData.push({ time: now.toISOString(), value: latestLiquidity })

  const sumAllValue = chartData.reduce((a, b) => a + b.value, 0)
  const allValues = chartData.map((elem) => elem.value!)
  const maxValue = Math.floor(Math.max(...allValues))
  const minValue = Math.floor(Math.min(...allValues))

  return {
    chartData,
    maxValue,
    minValue,
    sumAllValue,
  }
}

export const fetchTotalVolume = async ({ timeframe }: { timeframe: FilterTime }) => {
  const [daysLookback, filter, interval, intervalMs] = getTimeFrames(timeframe)
  const nowInMs = new Date().getTime()
  const lookbackInMs = nowInMs - daysLookback * 86400000

  const aggregatedData = (await fetchTotalCumulativeVolume(interval)).map((item) => {
    return {
      ms: new Date(item.time_interval).getTime(),
      cumulativeVolume: item.cumulative_volume,
    }
  })

  let chartData: TimeSeriesValue[] = []

  let currentVolume = 0
  let currentTimeMs = lookbackInMs
  for (let i = 0; i < aggregatedData.length; i++) {
    const item = aggregatedData[i]
    while (currentTimeMs < item.ms) {
      chartData.push({ time: new Date(currentTimeMs).toISOString(), value: currentVolume })
      currentTimeMs += intervalMs
    }
    currentVolume = item.cumulativeVolume
  }

  while (currentTimeMs < nowInMs) {
    chartData.push({ time: new Date(currentTimeMs).toISOString(), value: currentVolume })
    currentTimeMs += intervalMs
  }

  const sumAllValue = chartData.reduce((a, b) => a + b.value, 0)
  const allValues = chartData.map((elem) => elem.value!)
  const maxValue = Math.floor(Math.max(...allValues))
  const minValue = Math.floor(Math.min(...allValues))

  return {
    chartData,
    maxValue,
    minValue,
    sumAllValue,
  }
}

export const fetchCurrentTVL = async ({
  mainCloneClient,
  networkEndpoint,
}: {
  mainCloneClient: CloneClient
  networkEndpoint: string
}) => {
  let program
  if (mainCloneClient) {
    program = mainCloneClient
  } else {
    const { cloneClient: cloneProgram } = await getCloneClient(networkEndpoint)
    program = cloneProgram
  }
  const vault = program.clone.collateral.vault
  const tvl = (await program.provider.connection.getTokenAccountBalance(vault, "confirmed")).value
    .uiAmount!
  return tvl
}

const backfillWithZeroValue = (start: Date, end: Date, intervalMs: number): TimeSeriesValue[] => {
  const value = 0
  let result = [{ time: start.toISOString(), value }]
  let currentDate = start
  while (currentDate.getTime() < end.getTime()) {
    currentDate = new Date(currentDate.getTime() + intervalMs)
    result.push({ time: currentDate.toISOString(), value })
  }

  return result
}

interface GetProps {
  timeframe: FilterTime
  refetchOnMount?: boolean | "always"
  enabled?: boolean
}

export function useTotalLiquidityQuery({ timeframe, refetchOnMount, enabled = true }: GetProps) {
  const mainCloneClient = useAtomValue(cloneClient)
  const networkEndpoint = useAtomValue(rpcEndpoint)
  return useQuery({
    queryKey: ["totalLiquidity", timeframe],
    queryFn: () => fetchTotalLiquidity({ mainCloneClient, timeframe, networkEndpoint }),
    refetchOnMount,
    enabled,
  })
}

export function useTotalVolumeQuery({ timeframe, refetchOnMount, enabled = true }: GetProps) {
  return useQuery({
    queryKey: ["totalVolume", timeframe],
    queryFn: () => fetchTotalVolume({ timeframe }),
    refetchOnMount,
    enabled,
  })
}

export function useTotalValueLockedQuery({ timeframe, refetchOnMount, enabled = true }: GetProps) {
  const mainCloneClient = useAtomValue(cloneClient)!
  const networkEndpoint = useAtomValue(rpcEndpoint)

  return useQuery({
    queryKey: ["totalValueLocked"],
    queryFn: () => fetchCurrentTVL({ mainCloneClient, networkEndpoint }),
    refetchOnMount,
    enabled,
  })
}
