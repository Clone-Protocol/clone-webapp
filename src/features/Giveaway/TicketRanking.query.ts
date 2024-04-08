import { useQuery } from '@tanstack/react-query'
// import { REFETCH_CYCLE } from '~/components/Markets/TradingBox/RateLoadingIndicator'
import { fetchAllUserGiveaway, UserGiveaway } from '~/utils/fetch_netlify'

export const fetchTicketRanking = async () => {
  console.log('fetchRanking')

  let userPoints: UserGiveaway[] = await fetchAllUserGiveaway();

  let result: RankingList[] = []
  userPoints = userPoints.slice(0, 100)
  userPoints.forEach((user, id) => {
    result.push({
      id,
      user: { name: user.name, address: user.user_address },
      totalTickets: user.tickets,
    })
  })

  return result
}

interface GetProps {
  refetchOnMount?: boolean | "always"
  enabled?: boolean
}

export interface RankingList {
  id: number
  user: { name?: string, address: string }
  totalTickets: number
}

export function useTicketRankingQuery({ refetchOnMount, enabled = true }: GetProps) {
  let queryFunc
  try {
    queryFunc = () => fetchTicketRanking()
  } catch (e) {
    console.error(e)
    queryFunc = () => []
  }

  return useQuery({ queryKey: ['tickerRanks'], queryFn: queryFunc, enabled, refetchOnMount })
}
