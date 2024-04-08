import { useQuery } from '@tanstack/react-query'
import { PublicKey } from '@solana/web3.js'
// import { REFETCH_CYCLE } from '~/components/Markets/TradingBox/RateLoadingIndicator'
import { useAnchorWallet } from '@solana/wallet-adapter-react'
import { fetchUserGiveaway, UserGiveaway } from '~/utils/fetch_netlify'


export const fetchTicketRanking = async ({ userPubKey }: { userPubKey: PublicKey | null }) => {
  if (!userPubKey) return null

  console.log('fetchStatus')
  const userGiveaways: UserGiveaway[] = await fetchUserGiveaway(userPubKey.toString())

  if (userGiveaways.length === 0) return null

  const userGiveaway = userGiveaways[0]

  return {
    totalTickets: userGiveaway.tickets,
  }
}

interface GetProps {
  userPubKey: PublicKey | null
  refetchOnMount?: boolean | "always"
  enabled?: boolean
}

export interface Status {
  totalTickets: number
}

export function useGiveawayStatusQuery({ userPubKey, refetchOnMount, enabled = true }: GetProps) {
  const wallet = useAnchorWallet()

  if (wallet) {
    return useQuery({
      queryKey: ['gaStatusData', wallet, userPubKey],
      queryFn: async () => fetchTicketRanking({ userPubKey }),
      refetchOnMount,
      // refetchInterval: REFETCH_CYCLE,
      // refetchIntervalInBackground: true,
      enabled
    })
  } else {
    return useQuery({
      queryKey: ['gaStatusData'],
      queryFn: () => { return null }
    })
  }
}