'use client'
import Image from 'next/image'
import { StyledSection } from './index'
import LearnMoreIcon from 'public/images/learn-more.svg'
import { Container, Box, Typography, Stack } from '@mui/material'
import TradingBox from '~/containers/Markets/Wrapper/TradingBox'
import WagmiWrapper from '~/hocs/WagmiWrapper'

const Wrapper = () => {

  return (
    <StyledSection>
      <Container>
        <Box px='20px'>
          <Box><Typography fontSize='20px' fontWeight={500}>Wrapper</Typography></Box>
          <Stack direction='row' alignItems='center' gap={1}>
            <Typography variant='p' color='#8988a3'>The Wrapper enables any user to mint a wrapped token.</Typography>
            <a href="https://docs.clone.so/clone-mainnet-guide/clone-liquidity-or-for-lps/wrapper" target='_blank'>
              <Box display='flex' color='#c4b5fd' sx={{ cursor: 'pointer', ':hover': { color: '#8070ad' }, whiteSpace: 'nowrap' }}>
                <Typography variant='p' mr='3px'>Learn more</Typography>
                <Image src={LearnMoreIcon} alt='learnMore' />
              </Box>
            </a>
          </Stack>
          <Box mt='60px' display='flex' justifyContent='center'>
            <WagmiWrapper>
              <TradingBox />
            </WagmiWrapper>
          </Box>
        </Box>
      </Container>
    </StyledSection>
  )
}

export default Wrapper
