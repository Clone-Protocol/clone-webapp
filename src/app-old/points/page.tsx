import { IS_NOT_LOCAL_DEVELOPMENT } from '~/utils/constants'
import { fetchRanking } from '~/features/Points/Ranking.query'
import { HydrationBoundary, QueryClient, dehydrate } from '@tanstack/react-query'
import PointsClient from '~/containers/Points/PointsClient'

const Points = async () => {

  // const queryClient = new QueryClient()

  // if (IS_NOT_LOCAL_DEVELOPMENT) {
  //   console.log('prefetch')
  //   await queryClient.prefetchQuery({ queryKey: ['ranks'], queryFn: () => fetchRanking() })
  // }

  return (
    // <HydrationBoundary state={dehydrate(queryClient)}>
    <PointsClient />
    // </HydrationBoundary>
  )
}

export default Points
