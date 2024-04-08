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
  const [showTrading, setShowTrading] = useState(false)

  const toggleShowTrading = () => {
    setShowTrading(!showTrading)
  }

  useEffect(() => {
    if (!isMobileOnSize) {
      setShowTrading(false)
    }
  }, [isMobileOnSize])

  const isShowTradingBox = showTrading || !isMobileOnSize

  return (
    <div>
      <StyledSection
        sx={{
          backgroundColor: '#000',
        }}>
        <Stack direction={isMobileOnSize ? 'column' : 'row'} gap={1} justifyContent="center" alignItems={isMobileOnSize ? "center" : ""}>
          <Box minWidth={isMobileOnSize ? '360px' : '750px'}>
            <HydrationBoundary state={dehydratedState}>
              <MarketDetail assetId={assetId} />
            </HydrationBoundary>
          </Box>
          <Box width={showTrading ? '100%' : '360px'} height='100%' overflow={showTrading ? 'auto' : 'hidden'} display={showTrading ? 'flex' : 'block'} justifyContent={showTrading ? 'center' : ''} position={showTrading ? 'fixed' : 'relative'} bgcolor={showTrading ? '#000' : 'transparent'} top={showTrading ? '45px' : 'inherit'} mb={showTrading ? '180px' : '0px'}>
            {isShowTradingBox && <TradingBox assetId={assetId} />}
          </Box>
        </Stack>
      </StyledSection>
      <Box display={isMobileOnSize ? 'block' : 'none'}><ShowTradingBtn onClick={() => toggleShowTrading()}>{showTrading ? 'Hide Swap' : 'Swap'}</ShowTradingBtn></Box>
    </div>
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
