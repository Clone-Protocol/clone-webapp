'use client'
import Image from 'next/image'
import { StyledSection } from './index'
import LearnMoreIcon from 'public/images/learn-more.svg'
import { Container, Box, Typography, Stack } from '@mui/material'
import TradingBox from '~/containers/Wrapper/TradingBox'

const Wrapper = () => {

  return (
    <StyledSection>
      <Container>
        <Box px='20px'>
          <Box><Typography fontSize='20px' fontWeight={500}>Wrapper</Typography></Box>
          <Stack direction='row' alignItems='center' gap={1}>
            <Typography variant='p' color='#66707e'>The Wrapper enables any user to mint clAssets in exchange for bridged assets in order to arbitrage on Clone.</Typography>
            <a href="https://docs.clone.so/clone-mainnet-guide/clone-liquidity-or-for-lps/wrapper" target='_blank'>
              <Box display='flex' color='#b5fdf9' sx={{ cursor: 'pointer', ":hover": { color: '#4fe5ff' } }}>
                <Typography variant='p' mr='3px'>Learn more</Typography>
                <Image src={LearnMoreIcon} alt='learnMore' />
              </Box>
            </a>
          </Stack>
          <Box mt='60px' display='flex' justifyContent='center'>
            <TradingBox />
          </Box>
        </Box>
      </Container>
    </StyledSection>
  )
}

export default Wrapper
