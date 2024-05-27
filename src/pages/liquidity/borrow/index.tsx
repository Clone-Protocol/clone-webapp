'use client'
import { StyledSection } from '../index'
import { Box } from '@mui/material'
import BorrowContainer from '~/containers/Liquidity/borrow/new/BorrowContainer'

const Borrow = () => {

  return (
    <StyledSection>
      <Box>
        <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: '10px' }}>
          <BorrowContainer />
        </Box>
      </Box>
    </StyledSection>
  )
}

export default Borrow
