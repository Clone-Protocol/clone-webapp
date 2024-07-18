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
import { useRouter, useSearchParams } from 'next/navigation'
import { fetchCheckReferralCode, fetchLinkReferralCode, fetchLinkDiscordAccess, fetchLinkDiscordAccessLedger } from '~/utils/fetch_netlify'
import ReferralTextDialog from '~/components/Points/ReferralTextDialog'
import { useEffect, useState } from 'react'
import ReferralCodePutDialog from '~/components/Points/ReferralCodePutDialog'
import useLocalStorage from '~/hooks/useLocalStorage'
import { IS_COMPLETE_INIT_REFER, IS_CONNECT_LEDGER } from '~/data/localstorage'
import { useSetAtom, useAtomValue } from 'jotai'
import { discordUsername, rpcEndpoint } from '~/features/globalAtom'
import { bs58 } from '@coral-xyz/anchor/dist/cjs/utils/bytes'
import { LinkDiscordAccessStatus, generateDiscordLinkMessage } from 'functions/link-discord-access/link-discord-access'
import { useSnackbar } from 'notistack'
import { getCloneClient } from '~/features/baseQuery'
import { generateDiscordLinkRawMessage } from 'functions/link-discord-access-ledger/link-discord-access-ledger'
import { buildAuthTx } from '~/utils/ledger'

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
  const { publicKey, connected, signMessage, signTransaction } = useWallet()
  const { enqueueSnackbar } = useSnackbar()
  const router = useRouter()

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

  //for discord accesstoken
  const networkEndpoint = useAtomValue(rpcEndpoint)
  const setDiscordUsername = useSetAtom(discordUsername)
  const discordAccessToken = params.get('accessToken')
  const [isConnectLedger, setIsConnectLedger] = useLocalStorage(IS_CONNECT_LEDGER, false)
  useEffect(() => {
    const signAccessToken = async () => {
      if (publicKey && discordAccessToken && signMessage) {
        try {
          let signature

          if (!isConnectLedger) {
            signature = await signMessage(generateDiscordLinkMessage(discordAccessToken))
          } else {
            console.log('ledger mode')
            const tx = await buildAuthTx(generateDiscordLinkRawMessage(discordAccessToken));
            tx.feePayer = publicKey;
            const { cloneClient: cloneProgram } = await getCloneClient(networkEndpoint)
            tx.recentBlockhash = (await cloneProgram?.provider.connection.getLatestBlockhash()).blockhash

            const signedTx = await signTransaction!(tx);
            signature = signedTx.serialize();
          }
          console.log('s', signature)

          if (signature) {
            const { result }: { result: LinkDiscordAccessStatus } = isConnectLedger ? await fetchLinkDiscordAccessLedger(
              publicKey.toString(), bs58.encode(signature), discordAccessToken
            ) : await fetchLinkDiscordAccess(
              publicKey.toString(), bs58.encode(signature), discordAccessToken
            )

            setIsConnectLedger(false)

            if (result === LinkDiscordAccessStatus.SUCCESS) {
              enqueueSnackbar('Successfully linked', { variant: 'success' })
              setDiscordUsername('signed')
            } else if (result === LinkDiscordAccessStatus.ADDRESS_ALREADY_LINKED) {
              enqueueSnackbar('Address already linked', { variant: 'warning' })
              setDiscordUsername('signed')
            } else {
              enqueueSnackbar('Failed to sign message', { variant: 'error' })
            }
          }
        } catch (e) {
          console.error('e', e)
          enqueueSnackbar('Failed to sign message', { variant: 'error' })
        } finally {
          router.replace('/')
        }
      }
    }
    signAccessToken()
  }, [discordAccessToken, signMessage])

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

