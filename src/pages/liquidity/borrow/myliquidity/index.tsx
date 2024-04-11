'use client'
import { StyledSection } from '../../index'
import { Container } from '@mui/material'
import BorrowPositions from '~/containers/Liquidity/borrow/manage/BorrowPositions'

const Borrow = () => {
  return (
    <StyledSection>
      <Container>
        <BorrowPositions />
      </Container>
    </StyledSection>
  )
}

export default Borrow
