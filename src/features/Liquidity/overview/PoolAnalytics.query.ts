import { useQuery } from '@tanstack/react-query'
import { CloneClient } from "clone-protocol-sdk/sdk/src/clone"
import { useClone } from '~/hooks/useClone'
import { assetMapping } from '~/data/assets'
import { REFETCH_CYCLE } from '~/components/Common/DataLoadingIndicator'
import { useAnchorWallet } from '@solana/wallet-adapter-react'
import { getAggregatedPoolStats, fetchBorrowData } from '~/utils/assets'

export const fetchPoolAnalytics = async ({ tickerSymbol, program }: { tickerSymbol: string, program: CloneClient }) => {
  console.log('fetchPoolAnalytics')

  const pools = await program.getPools()
  const poolStats = await getAggregatedPoolStats(pools);
  const calcPctGain = (current: number, prev: number) => {
    return 100 * (current - prev) / prev
  }

  const borrowData = await fetchBorrowData(Number(pools.pools.length))

  for (let poolIndex = 0; poolIndex < pools.pools.length; poolIndex++) {
    const info = assetMapping(poolIndex)
    if (tickerSymbol === info.tickerSymbol) {
      const stats = poolStats[poolIndex]
      const borrowedStats = borrowData[poolIndex]

      return {
        totalLiquidity: stats.liquidityUSD,
        liquidityGain: stats.liquidityUSD - stats.previousLiquidity,
        liquidityGainPct: calcPctGain(stats.liquidityUSD, stats.previousLiquidity),
        tradingVol24h: stats.volumeUSD,
        tradingVolGain: stats.volumeUSD - stats.previousVolumeUSD,
        tradingVolGainPct: calcPctGain(stats.volumeUSD, stats.previousVolumeUSD),
        feeRevenue24hr: stats.fees,
        feeRevenueGain: stats.fees - stats.previousFees,
        feeRevenueGainPct: calcPctGain(stats.fees, stats.previousFees),
        avgAPY24hr: stats.apy,
        currentAmountBorrowed: borrowedStats.currentAmount,
        currentTVL: borrowedStats.currentTVL,
        amountBorrowedRate: calcPctGain(borrowedStats.currentAmount, borrowedStats.previousAmount),
        tvlRate: calcPctGain(borrowedStats.currentTVL, borrowedStats.previousTVL)
      }
    }
  }
  throw Error(`Invalid ticker symbol: ${tickerSymbol}!`)
}

interface GetAssetsProps {
  tickerSymbol: string
  refetchOnMount?: boolean | "always"
  enabled?: boolean
}

export function usePoolAnalyticsQuery({ tickerSymbol, refetchOnMount, enabled = true }: GetAssetsProps) {
  const wallet = useAnchorWallet()
  const { getCloneApp } = useClone()

  if (wallet) {
    return useQuery({
      queryKey: ['poolAnalytics', tickerSymbol],
      queryFn: async () => fetchPoolAnalytics({ tickerSymbol, program: await getCloneApp(wallet) }),
      refetchOnMount,
      refetchInterval: REFETCH_CYCLE,
      refetchIntervalInBackground: true,
      enabled
    })
  } else {
    return useQuery({ queryKey: ['poolAnalytics'], queryFn: () => { return null } })
  }
}
