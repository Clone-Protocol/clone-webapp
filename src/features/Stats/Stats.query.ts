import { useQuery } from '@tanstack/react-query'
import { ArbitrageStats, fetchArbitrageStats } from '~/utils/fetch_netlify'

export const fetchStats = async () => {
  console.log('fetchStats')

  let result: ArbitrageStats[] = await fetchArbitrageStats();

  return result
}

interface GetProps {
  refetchOnMount?: boolean | "always"
  enabled?: boolean
}

export function useStatsQuery({ refetchOnMount, enabled = true }: GetProps) {
  let queryFunc
  try {
    queryFunc = () => fetchStats()
  } catch (e) {
    console.error(e)
    queryFunc = () => []
  }

  return useQuery({ queryKey: ['stats'], queryFn: queryFunc, enabled, refetchOnMount })
}
