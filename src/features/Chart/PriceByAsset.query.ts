import { Query, useQuery } from '@tanstack/react-query'
import { ChartElem } from './Liquidity.query'
import { fetchPythPriceHistory, Range } from '~/utils/pyth'
import { FilterTime } from '~/components/Charts/TimeTabs'
import { useAtomValue } from 'jotai'
import { rpcEndpoint } from '~/features/globalAtom'
import { Connection } from '@solana/web3.js'
import { getPythOraclePrices } from '~/utils/pyth'

// type TimeSeriesValue = { time: string, value: number }
// const filterHistoricalData = (data: TimeSeriesValue[], numDays: number): TimeSeriesValue[] => {
//   const today = new Date(); // get the current date
//   const numMilliseconds = numDays * 86400 * 1000; // calculate the number of milliseconds in the specified number of days
//   const historicalDate = new Date(today.getTime() - numMilliseconds); // calculate the historical date

//   const filteredData = data.filter(({ time }) => {
//     const currentDatetime = new Date(time);
//     return currentDatetime >= historicalDate; // include values within the historical range
//   });

//   return filteredData;
// };

export const fetchOraclePriceHistory = async ({ timeframe, pythSymbol, networkEndpoint }: { timeframe: FilterTime, pythSymbol: string | undefined, networkEndpoint: string | undefined }) => {
  if (!pythSymbol) return null

  let chartData = []
  let currentPrice
  let rateOfPrice
  let percentOfRate

  const range: Range = (() => {
    switch (timeframe) {
      case '1y':
        return "1Y"
      case '30d':
        return "1M"
      case '7d':
        return "1W"
      case '24h':
        return "1D"
      default:
        throw new Error(`Unexpected timeframe: ${timeframe}`)
    }
  })()

  const rescaleFactor = pythSymbol === "Crypto.PEPE/USD" ? 1_000_000 : 1

  const pythHistoricalData = await fetchPythPriceHistory(pythSymbol, range)
  if (pythHistoricalData.length === 0) {
    return {
      chartData: [],
      currentPrice: 0,
      rateOfPrice: 0,
      percentOfRate: 0,
      maxValue: 0,
      minValue: 0
    }
  }

  chartData = pythHistoricalData.map((item) => {
    return { time: item.timestamp, value: rescaleFactor * item.price }
  })

  if (networkEndpoint) {
    const oraclePrices = await getPythOraclePrices(new Connection(networkEndpoint))
    const currentOraclePrice = rescaleFactor * oraclePrices.get(pythSymbol)! / oraclePrices.get("Crypto.USDC/USD")!;
    chartData.push({ time: new Date().toISOString(), value: currentOraclePrice })
  }

  const allValues = chartData.map(elem => elem.value!)
  const maxValue = Math.max(...allValues)
  const minValue = Math.min(...allValues)

  const lastEntry = chartData[chartData.length - 1];

  let previousPrice = chartData[0].value
  currentPrice = lastEntry.value;
  rateOfPrice = currentPrice - previousPrice
  percentOfRate = 100 * rateOfPrice / previousPrice

  return {
    chartData,
    currentPrice,
    rateOfPrice,
    percentOfRate,
    maxValue,
    minValue
  }
}

export interface PriceHistory {
  chartData: ChartElem[]
  currentPrice: number
  rateOfPrice: number
  percentOfRate: number
  maxValue: number
  minValue: number
}

interface GetProps {
  timeframe: FilterTime
  pythSymbol: string | undefined
  isOraclePrice?: boolean
  refetchOnMount?: boolean | "always"
  enabled?: boolean
}

export function usePriceHistoryQuery({ timeframe, pythSymbol, refetchOnMount, enabled = true }: GetProps) {
  const networkEndpoint = useAtomValue(rpcEndpoint)
  return useQuery({
    queryKey: ['oraclePriceHistory', timeframe, pythSymbol],
    queryFn: () => fetchOraclePriceHistory({ timeframe, pythSymbol, networkEndpoint }),
    refetchOnMount,
    enabled
  })
}



