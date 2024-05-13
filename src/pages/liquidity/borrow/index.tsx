'use client'
import { StyledSection } from '../index'
import { Container, Box, Typography } from '@mui/material'
import { useRouter } from 'next/navigation'
import { GoBackButton } from '~/components/Common/CommonButtons'
import BorrowContainer from '~/containers/Liquidity/borrow/new/BorrowContainer'

const Borrow = () => {
  const router = useRouter()

  return (
    <StyledSection>
      <Container>
        <Box>
          <GoBackButton onClick={() => router.back()}><Typography variant='p'>{'<'} Go back</Typography></GoBackButton>
          <Box><Typography fontSize='20px' fontWeight={500}>New Borrow Position</Typography></Box>
          <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: '10px' }}>
            <BorrowContainer />
          </Box>
        </Box>
      </Container>
    </StyledSection>
  )
}

export default Borrow
