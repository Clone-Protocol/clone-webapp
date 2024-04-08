import safeJsonStringify from 'safe-json-stringify';
import { Box, Stack, Theme, useMediaQuery } from '@mui/material'
import { styled } from '@mui/material/styles'
import { ASSETS, AssetTickers, DEFAULT_ASSET_ID } from '~/data/assets'
import { DehydratedState, HydrationBoundary, QueryClient, dehydrate } from '@tanstack/react-query'
import { IS_NOT_LOCAL_DEVELOPMENT } from '~/utils/constants'
import { fetchMarketDetail } from '~/features/Markets/MarketDetail.query'
import { DEV_RPCs, IS_DEV, MAIN_RPCs } from '~/data/networks'
import { GetStaticPaths, GetStaticProps, InferGetStaticPropsType } from 'next'
import TradeClient from '~/containers/Markets/TradeClient';

//SSR
export const generateStaticParams = (async () => {
  const paths = ASSETS.map((asset) => ({
    params: { assetTicker: asset.ticker },
  }))
  return {
    paths,
    fallback: true,
  }
}) satisfies GetStaticPaths

const AssetPage = async () => {
  let assetId = DEFAULT_ASSET_ID
  // if (AssetTickers[assetTicker as keyof typeof AssetTickers]) {
  //   assetId = AssetTickers[assetTicker as keyof typeof AssetTickers]
  // }
  const queryClient = new QueryClient()

  if (IS_NOT_LOCAL_DEVELOPMENT) {
    console.log('prefetch')
    await queryClient.prefetchQuery({ queryKey: ['marketDetail', assetId], queryFn: () => fetchMarketDetail({ index: assetId, mainCloneClient: null, networkEndpoint: IS_DEV ? DEV_RPCs[0].rpc_url : MAIN_RPCs[0].rpc_url }) })
  }

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <TradeClient />
    </HydrationBoundary>
  )
}

const StyledSection = styled('section')`
	${(props) => props.theme.breakpoints.up('md')} {
		padding-top: 100px;
	}
	${(props) => props.theme.breakpoints.down('md')} {
		padding: 70px 0px 110px 0px;
	}
`

const ShowTradingBtn = styled(Box)`
  position: fixed;
  bottom: 50px;
  width: 95%;
  height: 36px;
  color: #fff;
	border-radius: 10px;
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 10px;
  cursor: pointer;
  border: solid 1px ${(props) => props.theme.basis.portGore};
  background: ${(props) => props.theme.basis.royalPurple};
	&:hover {
		background: ${(props) => props.theme.basis.royalPurple};
    border: solid 1px ${(props) => props.theme.basis.melrose};
  }
`

export default AssetPage
