import { useQuery } from '@tanstack/react-query'
import { ChartElem } from './Liquidity.query'
import { FilterTime } from '~/components/Charts/TimeTabs'
import { Range, fetchPythPriceHistory } from '~/utils/pyth'
import { getDailyPoolPrices30Day } from '~/utils/assets'
import { useAtomValue } from 'jotai'
import { rpcEndpoint } from '~/features/globalAtom'
import { assetMapping } from '~/data/assets'

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

export const fetchOraclePriceHistory = async ({ assetIndex, timeframe, pythSymbol, networkEndpoint }: { assetIndex: number, timeframe: FilterTime, pythSymbol: string | undefined, networkEndpoint: string | undefined }) => {
  if (!pythSymbol) return null

  let chartData = []
  let currentPrice
  let rateOfPrice
  let percentOfRate

  // MEMO: Always use oracle until we fix the indexing.
  isOraclePrice = true

  // oracle price:
  if (isOraclePrice) {
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

    const { scalingFactor } = assetMapping(assetIndex)
    const history = await fetchPythPriceHistory(pythSymbol, range);

    chartData = history.map((data) => {
      return { time: data.timestamp, value: data.price }
    })

    const lastEntry = chartData[chartData.length - 1];
    const firstEntry = chartData[0]
    const previous24hrPrice = firstEntry.value * scalingFactor

    currentPrice = lastEntry.value * scalingFactor;
    rateOfPrice = currentPrice - previous24hrPrice
    percentOfRate = 100 * rateOfPrice / previous24hrPrice
  } else {
    // Get pool index from pythSymbol
    let poolIndex = (() => {
      for (let i = 0; i < ASSETS.length; i++) {
        if (ASSETS[i].pythSymbol === pythSymbol) {
          return i;
        }
      }
      throw new Error(`Couldn't find pool index for ${pythSymbol}`)
    })()

    chartData = await getDailyPoolPrices30Day(
      poolIndex,
    )
  }

  const allValues = chartData.map(elem => elem.value!)
  const maxValue = Math.floor(Math.max(...allValues))
  const minValue = Math.floor(Math.min(...allValues))

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
  assetIndex: number
  timeframe: FilterTime
  pythSymbol: string | undefined
  isOraclePrice?: boolean
  refetchOnMount?: boolean | "always"
  enabled?: boolean
}

export function usePriceHistoryQuery({ assetIndex, timeframe, pythSymbol, refetchOnMount, enabled = true }: GetProps) {
  const networkEndpoint = useAtomValue(rpcEndpoint)
  return useQuery({
    queryKey: ['oraclePriceHistory', timeframe, pythSymbol],
    queryFn: () => fetchOraclePriceHistory({ assetIndex, timeframe, pythSymbol, networkEndpoint }),
    refetchOnMount,
    enabled
  })
}



