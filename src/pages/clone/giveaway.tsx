'use client'
import { StyledSection } from '~/components/Layout'
import { Container, Box, Typography, Stack } from '@mui/material'
import Image from 'next/image'
import LearnMoreIcon from 'public/images/learn-more.svg'
// import { DehydratedState, Hydrate, QueryClient, dehydrate } from '@tanstack/react-query'
import { IS_NOT_LOCAL_DEVELOPMENT } from '~/utils/constants'
import { GetStaticProps, InferGetStaticPropsType } from 'next'
import { DehydratedState, HydrationBoundary, QueryClient, dehydrate } from '@tanstack/react-query'
import TicketRankingList from '~/containers/Giveaway/TicketRankingList'
import { fetchTicketRanking } from '~/features/Giveaway/TicketRanking.query'
import MyGiveawayStatus from '~/containers/Giveaway/MyGiveawayStatus'

//SSR
export const getStaticProps = (async () => {
  const queryClient = new QueryClient()

  if (IS_NOT_LOCAL_DEVELOPMENT) {
    console.log('prefetch')
    await queryClient.prefetchQuery({ queryKey: ['tickerRanks'], queryFn: () => fetchTicketRanking() })
  }

  return {
    props: {
      dehydratedState: dehydrate(queryClient),
      //cached time
      revalidate: 30,
    },
  }
}) satisfies GetStaticProps<{
  dehydratedState: DehydratedState,
}>

const Giveaway = ({ dehydratedState }: InferGetStaticPropsType<typeof getStaticProps>) => {

  return (
    <StyledSection sx={{ overflowX: 'hidden' }}>
      <Container>
        <Box sx={{ paddingX: { xs: '0px', md: '20px' }, paddingTop: '10px' }}>
          <Box><Typography fontSize='20px' fontWeight={500}>Cloner Classic Giveaway</Typography></Box>
          <Stack direction='row' alignItems='center' gap={1}>
            <Typography variant='p' color='#66707e'>Enter into Point giveaway just by interacting with Clone</Typography>
            <a href="https://docs.clone.so/clone-mainnet-guide/points-program/season-1/cloner-classic-giveaway" target='_blank'>
              <Box display='flex' color='#c4b5fd' sx={{ cursor: 'pointer', ':hover': { color: '#8070ad' }, whiteSpace: 'nowrap' }}>
                <Typography variant='p' mr='3px'>Learn more</Typography>
                <Image src={LearnMoreIcon} alt='learnMore' />
              </Box>
            </a>
          </Stack>
          <Box my='30px'>
            <MyGiveawayStatus />

            <HydrationBoundary state={dehydratedState}>
              <Box display='flex' justifyContent='center'>
                <TicketRankingList />
              </Box>
            </HydrationBoundary>
          </Box>
        </Box>
      </Container>
    </StyledSection>
  )
}

export default Giveaway
