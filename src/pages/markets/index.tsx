'use client'
import { Box } from '@mui/material'
import { styled } from '@mui/material/styles'
import Container from '@mui/material/Container'
import MarketList from '~/containers/Markets/MarketList'
import PortfolioBalance from '~/components/Markets/PortfolioBalance'
import { useWallet } from '@solana/wallet-adapter-react'
import { MAIN_RPCs } from '~/data/networks'
import { DehydratedState, HydrationBoundary, QueryClient, dehydrate } from '@tanstack/react-query'
import { fetchAssets } from '~/features/Markets/Assets.query'
import { IS_NOT_LOCAL_DEVELOPMENT } from '~/utils/constants'
import { GetStaticProps, InferGetStaticPropsType } from 'next'
import { useSearchParams } from 'next/navigation'
import { fetchCheckReferralCode, fetchLinkReferralCode } from '~/utils/fetch_netlify'
import ReferralTextDialog from '~/components/Points/ReferralTextDialog'
import { useEffect, useState } from 'react'
import ReferralCodePutDialog from '~/components/Points/ReferralCodePutDialog'
import useLocalStorage from '~/hooks/useLocalStorage'
import { IS_COMPLETE_INIT_REFER } from '~/data/localstorage'

//SSR
export const getStaticProps = (async () => {
  const queryClient = new QueryClient()

  if (IS_NOT_LOCAL_DEVELOPMENT) {
    console.log('prefetch')
    await queryClient.prefetchQuery({ queryKey: ['assets'], queryFn: () => fetchAssets({ setShowPythBanner: () => { }, mainCloneClient: null, networkEndpoint: MAIN_RPCs[0].rpc_url }) })
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

const Home = ({ dehydratedState }: InferGetStaticPropsType<typeof getStaticProps>) => {
  const { publicKey, connected } = useWallet()

  //for referral 
  const [isCompleteInitRefer, _] = useLocalStorage(IS_COMPLETE_INIT_REFER, false)
  const params = useSearchParams()
  const refCode = params.get('referralCode')
  const [showReferralTextDialog, setShowReferralTextDialog] = useState(false)
  const [showReferralCodePutDlog, setShowReferralCodePutDlog] = useState(false)
  const [referralStatus, setReferralStatus] = useState(0)

  useEffect(() => {
    if (connected && publicKey) {
      if (refCode) {
        console.log('refCode', refCode)
        fetchLinkReferralCode(publicKey.toString(), parseInt(refCode).toString()).then((res) => {
          console.log('res', res)
          const { status } = res
          setReferralStatus(status)
          setShowReferralCodePutDlog(false)
          setShowReferralTextDialog(true)
        })
      } else {
        fetchCheckReferralCode(publicKey.toString()).then((res) => {
          console.log('res', res)
          if (res.successful) {
            setShowReferralCodePutDlog(true)
          }
        })
      }
    }
  }, [connected, publicKey, refCode])

  return (
    <div>
      <StyledSection>
        <Container>
          {publicKey &&
            <Box>
              <PortfolioBalance />

              <Divider />
            </Box>
          }
          <HydrationBoundary state={dehydratedState}>
            <MarketList />
          </HydrationBoundary>

          <ReferralTextDialog referralStatus={referralStatus} open={showReferralTextDialog} handleClose={() => setShowReferralTextDialog(false)} />
          <ReferralCodePutDialog open={showReferralCodePutDlog && !isCompleteInitRefer} handleClose={() => { setShowReferralCodePutDlog(false); }} />
        </Container>
      </StyledSection>
    </div>
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
const Divider = styled('div')`
	width: 100%;
	height: 1px;
	margin-top: 30px;
	margin-bottom: 30px;
	background-color: ${(props) => props.theme.basis.melrose};
`

export default Home

