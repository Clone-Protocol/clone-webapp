import { Query, useQuery } from '@tanstack/react-query'
import { FilterTime } from '~/components/Charts/TimeTabs'
import { CLONE_TOKEN_SCALE } from 'clone-protocol-sdk/sdk/src/clone'
import { fetchStatsData, Interval, ResponseValue, generateDates, Filter } from 'src/utils/assets'

export interface ChartElem {
  time: string
  value: number
}

type TimeSeriesValue = { time: string, value: number }

const filterHistoricalData = (data: TimeSeriesValue[], numDays: number): TimeSeriesValue[] => {
  const today = new Date(); // get the current date
  const numMilliseconds = numDays * 86400 * 1000; // calculate the number of milliseconds in the specified number of days
  const historicalDate = new Date(today.getTime() - numMilliseconds); // calculate the historical date

  const filteredData = data.filter(({ time }) => {
    const currentDatetime = new Date(time);
    return currentDatetime >= historicalDate; // include values within the historical range
  });

  return filteredData;
};


type AggregatedData = {
  datetime: string;
  total_liquidity: number;
  trading_volume: number;
  total_trading_fees: number;
  total_treasury_fees: number;
}

const aggregatePoolData = (poolDataArray: ResponseValue[], interval: Interval): AggregatedData[] => {
  const groupedByDtAndPool: Record<string, Record<string, ResponseValue>> = {};

  const setDatetime = (dt: Date) => {
    if (interval === 'hour') {
      dt.setMinutes(0, 0, 0);
    } else {
      dt.setHours(0, 0, 0, 0);
    }
  }
  const getDTKeys = (dt: Date) => {
    setDatetime(dt)
    return dt.toISOString();
  }
  const convertToNumber = (val: string) => {
    return Number(val) * Math.pow(10, -CLONE_TOKEN_SCALE)
  }

  const poolIndices: Set<string> = new Set()
  poolDataArray.forEach(d => poolIndices.add(d.pool_index))

  for (const data of poolDataArray) {
    poolIndices.add(data.pool_index)
    const dt = new Date(data.datetime)
    const datetimeKey = getDTKeys(dt)
    if (!groupedByDtAndPool[datetimeKey]) {
      groupedByDtAndPool[datetimeKey] = {}
    }
    groupedByDtAndPool[datetimeKey][data.pool_index] = data
  }

  const recentLiquidityByPool: Record<string, number> = {}
  poolIndices.forEach((index) => {
    recentLiquidityByPool[index] = 0
  })

  // Create the first entry of the result
  let result: AggregatedData[] = []

  let startingDate = new Date(poolDataArray.at(0)!.datetime);
  setDatetime(startingDate)
  const dates = generateDates(startingDate, interval)

  for (let i = 0; i < dates.length; i++) {

    const currentDate = getDTKeys(dates[i])
    let record: AggregatedData = {
      datetime: currentDate, total_liquidity: 0, trading_volume: 0, total_trading_fees: 0, total_treasury_fees: 0
    }

    const currentGBData = groupedByDtAndPool[currentDate]
    if (!currentGBData) {
      poolIndices.forEach((index) => {
        record.total_liquidity += recentLiquidityByPool[index]
      })
    } else {
      poolIndices.forEach((index) => {
        let data = currentGBData[index]
        if (data) {
          record.total_liquidity += convertToNumber(data.total_liquidity)
          record.trading_volume += convertToNumber(data.trading_volume)
          record.total_trading_fees += convertToNumber(data.total_trading_fees)
          record.total_treasury_fees += convertToNumber(data.total_treasury_fees)
          recentLiquidityByPool[index] = convertToNumber(data.total_liquidity)
        } else {
          record.total_liquidity += recentLiquidityByPool[index]
        }
      })
    }
    result.push(record)
  }

  return result;
}

export const fetchTotalLiquidity = async ({ timeframe }: { timeframe: FilterTime }) => {

  const [daysLookback, filter, interval] = (() => {
    switch (timeframe) {
      case '1y':
        return [365, 'year', 'day']
      case '30d':
        return [30, 'month', 'day']
      case '7d':
        return [7, 'week', 'hour']
      case '24h':
        return [1, 'day', 'hour']
      default:
        throw new Error(`Unexpected timeframe: ${timeframe}`)
    }
  })()

  const rawData = await fetchStatsData(filter as Filter, interval as Interval)
  const aggregatedData = aggregatePoolData(rawData, interval as Interval)
  const chartData = aggregatedData.map(data => { return { time: data.datetime, value: data.total_liquidity } })

  return {
    chartData: filterHistoricalData(chartData, daysLookback)
  }
}

export const fetchTotalVolume = async ({ timeframe }: { timeframe: FilterTime }) => {
  const [daysLookback, filter, interval] = (() => {
    switch (timeframe) {
      case '1y':
        return [365, 'year', 'day']
      case '30d':
        return [30, 'month', 'day']
      case '7d':
        return [7, 'week', 'hour']
      case '24h':
        return [1, 'day', 'hour']
      default:
        throw new Error(`Unexpected timeframe: ${timeframe}`)
    }
  })()

  const rawData = await fetchStatsData(filter as Filter, interval as Interval)
  const aggregatedData = aggregatePoolData(rawData, interval as Interval)
  const chartData = aggregatedData.map(data => { return { time: data.datetime, value: data.trading_volume } })

  return {
    chartData: filterHistoricalData(chartData, daysLookback)
  }
}

interface GetProps {
  timeframe: FilterTime
  refetchOnMount?: boolean | "always"
  enabled?: boolean
}

export function useTotalLiquidityQuery({ timeframe, refetchOnMount, enabled = true }: GetProps) {
  return useQuery({
    queryKey: ['totalLiquidity', timeframe],
    queryFn: () => fetchTotalLiquidity({ timeframe }),
    refetchOnMount,
    enabled
  })
}

export function useTotalVolumeQuery({ timeframe, refetchOnMount, enabled = true }: GetProps) {
  return useQuery({
    queryKey: ['totalVolume', timeframe],
    queryFn: () => fetchTotalVolume({ timeframe }),
    refetchOnMount,
    enabled
  })
}