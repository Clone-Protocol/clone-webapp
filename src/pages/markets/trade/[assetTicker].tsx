'use client'
import safeJsonStringify from 'safe-json-stringify';
import { styled } from '@mui/material/styles'
import { ASSETS, AssetTickers, DEFAULT_ASSET_ID } from '~/data/assets'
import { DehydratedState, HydrationBoundary, QueryClient, dehydrate } from '@tanstack/react-query'
import { IS_NOT_LOCAL_DEVELOPMENT } from '~/utils/constants'
import { fetchDefaultBalance, fetchMarketDetail } from '~/features/Markets/MarketDetail.query'
import { MAIN_RPCs } from '~/data/networks'
import { GetStaticPaths, GetStaticProps, InferGetStaticPropsType } from 'next'
import MarketContainer from '~/containers/Markets/MarketContainer';

//SSR
export const getStaticPaths = (async () => {
  const paths = ASSETS.map((asset) => ({
    params: { assetTicker: asset.ticker },
  }))
  return {
    paths,
    fallback: true,
  }
}) satisfies GetStaticPaths

export const getStaticProps = (async (context: any) => {
  const assetTicker = context.params.assetTicker

  let assetId = DEFAULT_ASSET_ID
  if (AssetTickers[assetTicker as keyof typeof AssetTickers]) {
    assetId = AssetTickers[assetTicker as keyof typeof AssetTickers]
  }
  const queryClient = new QueryClient()

  if (IS_NOT_LOCAL_DEVELOPMENT) {
    console.log('prefetch')
    await queryClient.prefetchQuery({ queryKey: ['marketDetail', assetId], queryFn: () => fetchMarketDetail({ index: assetId, mainCloneClient: null, networkEndpoint: MAIN_RPCs[0].rpc_url }) })
    await queryClient.prefetchQuery({ queryKey: ["defaultBalance", assetId], queryFn: () => fetchDefaultBalance({ index: assetId, mainCloneClient: null, networkEndpoint: MAIN_RPCs[0].rpc_url }) })
  }

  return {
    props: {
      dehydratedState: JSON.parse(safeJsonStringify(dehydrate(queryClient))),
      //cached time
      revalidate: 12,
      assetId
    },
  }
}) satisfies GetStaticProps<{
  dehydratedState: DehydratedState
  assetId: number
}>

const AssetPage = ({ dehydratedState, assetId }: InferGetStaticPropsType<typeof getStaticProps>) => {

  return (
    <StyledSection
      sx={{
        backgroundColor: '#0f0e14',
      }}>
      <HydrationBoundary state={dehydratedState}>
        <MarketContainer assetId={assetId} />
      </HydrationBoundary>
    </StyledSection>
  )
}

const StyledSection = styled('section')`
	${(props) => props.theme.breakpoints.up('md')} {
		padding-top: 120px;
	}
	${(props) => props.theme.breakpoints.down('md')} {
		padding: 70px 0px 110px 0px;
	}
`

export default AssetPage
