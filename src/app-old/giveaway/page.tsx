import { IS_NOT_LOCAL_DEVELOPMENT } from '~/utils/constants'
import { DehydratedState, HydrationBoundary, QueryClient, dehydrate } from '@tanstack/react-query'
import { fetchTicketRanking } from '~/features/Giveaway/TicketRanking.query'
import GiveawayClient from '~/containers/Giveaway/GiveawayClient'

const Giveaway = async () => {
  const queryClient = new QueryClient()

  if (IS_NOT_LOCAL_DEVELOPMENT) {
    console.log('prefetch')
    await queryClient.prefetchQuery({ queryKey: ['tickerRanks'], queryFn: () => fetchTicketRanking() })
  }

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <GiveawayClient />
    </HydrationBoundary>
  )
}

export default Giveaway
