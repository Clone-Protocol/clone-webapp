'use client'
import React, { useState, useEffect } from 'react'
import safeJsonStringify from 'safe-json-stringify';
import { Box, Stack, Theme, useMediaQuery } from '@mui/material'
import { styled } from '@mui/material/styles'
import MarketDetail from '~/containers/Markets/MarketDetail'
import TradingBox from '~/containers/Markets/TradingBox'
import { ASSETS, AssetTickers, DEFAULT_ASSET_ID } from '~/data/assets'
import { DehydratedState, HydrationBoundary, QueryClient, dehydrate } from '@tanstack/react-query'
import { IS_NOT_LOCAL_DEVELOPMENT } from '~/utils/constants'
import { fetchMarketDetail } from '~/features/Markets/MarketDetail.query'
import { DEV_RPCs, IS_DEV, MAIN_RPCs } from '~/data/networks'
import { GetStaticPaths, GetStaticProps, InferGetStaticPropsType } from 'next'
import ChartSwitch from '~/components/Markets/TradingBox/ChartSwitch';
import { LoadingSkeleton } from '~/components/Common/Loading';

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
    await queryClient.prefetchQuery({ queryKey: ['marketDetail', assetId], queryFn: () => fetchMarketDetail({ index: assetId, mainCloneClient: null, networkEndpoint: IS_DEV ? DEV_RPCs[0].rpc_url : MAIN_RPCs[0].rpc_url }) })
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
  const isMobileOnSize = useMediaQuery((theme: Theme) => theme.breakpoints.down('md'))
  const [showChart, setShowChart] = useState(false)

  const toggleShowTrading = () => {
    setShowChart(!showChart)
  }

  useEffect(() => {
    if (!isMobileOnSize) {
      setShowChart(false)
    }
  }, [isMobileOnSize])

  const isShowChart = showChart

  return (
    <div>
      <StyledSection
        sx={{
          backgroundColor: '#0f0e14',
        }}>
        <Stack direction={isMobileOnSize ? 'column' : 'row'} gap={5} justifyContent="center" alignItems={isMobileOnSize ? "center" : ""}>
          {isShowChart &&
            <Box minWidth={isMobileOnSize ? '360px' : '750px'} width={isMobileOnSize ? '100%' : '750px'} bgcolor={isMobileOnSize ? '#0f0e14' : 'transparent'} zIndex={99}>
              <HydrationBoundary state={dehydratedState}>
                <MarketDetail assetId={assetId} />
              </HydrationBoundary>
            </Box>
          }
          <Box width={isMobileOnSize ? '100%' : '420px'} height='100%' overflow={isMobileOnSize ? 'auto' : 'hidden'} position={isMobileOnSize ? 'fixed' : 'relative'} display={isMobileOnSize ? 'flex' : 'block'} justifyContent={isMobileOnSize ? 'center' : ''} top={isMobileOnSize ? '85px' : 'inherit'} mt='24px' mb={isMobileOnSize ? '180px' : '0px'}>
            {!isMobileOnSize && <ChartSwitch onChange={() => toggleShowTrading()} checked={showChart} />}
            <TradingBox assetId={assetId} />
          </Box>
        </Stack>
      </StyledSection>
      <Box display={isMobileOnSize ? 'block' : 'none'}><ShowTradingBtn onClick={() => toggleShowTrading()}>{showChart ? 'Hide Chart' : 'Show Chart'}</ShowTradingBtn></Box>
    </div>
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

const ShowTradingBtn = styled(Box)`
  position: fixed;
  bottom: 15px;
  width: 95%;
  height: 36px;
  color: #fff;
	border-radius: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 10px;
  z-index: 9999999;
  cursor: pointer;
  border: solid 1px ${(props) => props.theme.basis.plumFuzz};
  background: ${(props) => props.theme.basis.backInBlack};
	&:hover {
		background: ${(props) => props.theme.basis.backInBlack};
    border: solid 1px ${(props) => props.theme.basis.melrose};
  }
`

export default AssetPage
