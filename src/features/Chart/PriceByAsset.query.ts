import { useQuery, useSuspenseQuery } from '@tanstack/react-query'
import { ChartElem } from './Liquidity.query'
import { FilterTime } from '~/components/Charts/TimeTabs'
import { Range, fetchPythPriceHistory, getPythOraclePrices } from '~/utils/pyth'
import { assetMapping } from 'src/data/assets'
import { useAtomValue } from 'jotai'
import { rpcEndpoint } from '../globalAtom'
import { Connection } from '@solana/web3.js'
import { useWallet } from '@solana/wallet-adapter-react'

export const fetchOraclePriceHistory = async ({ assetIndex, timeframe, pythSymbol, networkEndpoint }: { assetIndex: number, timeframe: FilterTime, pythSymbol: string | undefined, networkEndpoint: string | undefined }) => {
  if (!pythSymbol) return null

  console.log('fetchOraclePriceHistory')

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

  const { scalingFactor } = assetMapping(assetIndex)
  const history = await fetchPythPriceHistory(pythSymbol, range);
  if (history.length === 0) {
    return {
      chartData: [],
      currentPrice: 0,
      rateOfPrice: 0,
      percentOfRate: 0,
      maxValue: 0,
      minValue: 0
    }
  }

  chartData = history.map((data) => {
    return { time: data.timestamp, value: rescaleFactor * data.price }
  })

  if (networkEndpoint) {
    const oraclePrices = await getPythOraclePrices(new Connection(networkEndpoint))
    const currentOraclePrice = rescaleFactor * oraclePrices.get(pythSymbol)! / oraclePrices.get("Crypto.USDC/USD")!;
    chartData.push({ time: new Date().toISOString(), value: currentOraclePrice })
  }

  const allValues = chartData.map(elem => elem.value!)
  const maxValue = Math.floor(Math.max(...allValues))
  const minValue = Math.floor(Math.min(...allValues))

  const lastEntry = chartData[chartData.length - 1];
  const firstEntry = chartData[0]
  const previous24hrPrice = firstEntry.value * scalingFactor

  currentPrice = lastEntry.value * scalingFactor;
  rateOfPrice = currentPrice - previous24hrPrice
  percentOfRate = 100 * rateOfPrice / previous24hrPrice

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
  refetchOnMount?: boolean | "always"
  enabled?: boolean
}

export function usePriceHistoryQuery({ assetIndex, timeframe, pythSymbol, refetchOnMount }: GetProps) {
  const { connected } = useWallet()
  const networkEndpoint = useAtomValue(rpcEndpoint)

  if (connected) {
    return useSuspenseQuery({
      queryKey: ['oraclePriceHistory', timeframe, pythSymbol],
      queryFn: () => fetchOraclePriceHistory({ assetIndex, timeframe, pythSymbol, networkEndpoint }),
      refetchOnMount,
    })
  } else {
    return useSuspenseQuery({
      queryKey: ['oraclePriceHistory'],
      queryFn: () => ({ chartData: [], currentPrice: 0, rateOfPrice: 0, percentOfRate: 0, maxValue: 0, minValue: 0 }),
    })
  }
}



