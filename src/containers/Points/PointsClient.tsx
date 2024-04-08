'use client'
import { StyledSection } from '~/components/Layout'
import { Container, Box, Typography, Stack } from '@mui/material'
import Image from 'next/image'
import LearnMoreIcon from 'public/images/learn-more.svg'
import MyPointStatus from '~/containers/Points/MyPointStatus'
import RankingList from '~/containers/Points/RankingList'

const PointsClient = async () => {

  return (
    <StyledSection sx={{ overflowX: 'hidden' }}>
      <Container>
        <Box sx={{ paddingX: { xs: '0px', md: '20px' }, paddingTop: '10px' }}>
          <Box><Typography fontSize='20px' fontWeight={500}>Points: Season 1</Typography></Box>
          <Stack direction='row' alignItems='center' gap={1}>
            <Typography variant='p' color='#66707e'>Earn points by participating in Clone ecosystem.</Typography>
            <a href="https://docs.clone.so/clone-mainnet-guide/points-program/season-1" target='_blank'>
              <Box display='flex' color='#c4b5fd' sx={{ cursor: 'pointer', ':hover': { color: '#8070ad' }, whiteSpace: 'nowrap' }}>
                <Typography variant='p' mr='3px'>Learn more</Typography>
                <Image src={LearnMoreIcon} alt='learnMore' />
              </Box>
            </a>
          </Stack>
          <Box mt='10px'>
            <MyPointStatus />

            <RankingList />
          </Box>
        </Box>
      </Container>
    </StyledSection>
  )
}

export default PointsClient
