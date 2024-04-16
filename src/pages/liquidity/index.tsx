'use client'
import { styled } from '@mui/material/styles'
import { Box } from '@mui/material'
import GetUSDiBadge from '~/components/Liquidity/overview/GetUSDiBadge'
import MainChart from '~/containers/Liquidity/overview/MainChart'
import AssetList from '~/containers/Liquidity/overview/AssetList'
import { useWallet } from '@solana/wallet-adapter-react'
import { DEV_RPCs, IS_DEV, MAIN_RPCs } from '~/data/networks'
import { DehydratedState, HydrationBoundary, QueryClient, dehydrate } from '@tanstack/react-query'
import { IS_NOT_LOCAL_DEVELOPMENT } from '~/utils/constants'
import { fetchAssets } from '~/features/Liquidity/overview/Assets.query'
import { GetStaticProps, InferGetStaticPropsType } from 'next'
import { fetchTotalVolume } from '~/features/Chart/Liquidity.query'

//SSR
export const getStaticProps = (async () => {
  const queryClient = new QueryClient()

  if (IS_NOT_LOCAL_DEVELOPMENT) {
    console.log('prefetch')
    await queryClient.prefetchQuery({ queryKey: ['totalVolume'], queryFn: () => fetchTotalVolume({ timeframe: '30d' }) })
    await queryClient.prefetchQuery({ queryKey: ['assets'], queryFn: () => fetchAssets({ setShowPythBanner: () => { }, mainCloneClient: null, networkEndpoint: IS_DEV ? DEV_RPCs[0].rpc_url : MAIN_RPCs[0].rpc_url }) })
  }

  return {
    props: {
      dehydratedState: dehydrate(queryClient),
      //cached time
      revalidate: 12,
    },
  }
}) satisfies GetStaticProps<{
  dehydratedState: DehydratedState
}>

const Overview = ({ dehydratedState }: InferGetStaticPropsType<typeof getStaticProps>) => {
  const { publicKey } = useWallet()

  return (
    <StyledSection>
      <Box sx={{ maxWidth: '1270px' }} margin='0 auto'>
        {IS_DEV && publicKey &&
          <GetUSDiBadge />
        }
        <Box mt='25px'>
          <Box mb='19px'>
            <MainChart />
          </Box>
          <HydrationBoundary state={dehydratedState}>
            <AssetList />
          </HydrationBoundary>
        </Box>
      </Box>
    </StyledSection>
  )
}

export const StyledSection = styled('section')`
  max-width: 1085px;
	margin: 0 auto;
  padding-bottom: 20px;
	${(props) => props.theme.breakpoints.up('md')} {
		padding-top: 130px;
	}
	${(props) => props.theme.breakpoints.down('md')} {
		padding: 110px 0px;
	}
`

export default Overview
