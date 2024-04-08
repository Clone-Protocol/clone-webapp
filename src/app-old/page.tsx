import { DEV_RPCs, IS_DEV, MAIN_RPCs } from '~/data/networks'
import { HydrationBoundary, QueryClient, dehydrate } from '@tanstack/react-query'
import { fetchAssets } from '~/features/Markets/Assets.query'
import { IS_NOT_LOCAL_DEVELOPMENT } from '~/utils/constants'
import MainClient from '~/containers/Index/MainClient'

const Home = async () => {
  const queryClient = new QueryClient()

  if (IS_NOT_LOCAL_DEVELOPMENT) {
    console.log('prefetch')
    await queryClient.prefetchQuery({ queryKey: ['assets'], queryFn: () => fetchAssets({ setShowPythBanner: () => { }, mainCloneClient: null, networkEndpoint: IS_DEV ? DEV_RPCs[0].rpc_url : MAIN_RPCs[0].rpc_url }) })
  }

  return (
    <div>
      <HydrationBoundary state={dehydrate(queryClient)}>
        <MainClient />
      </HydrationBoundary>
    </div>
  )
}

export default Home
