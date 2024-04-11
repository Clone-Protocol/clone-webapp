'use client'
import { StyledSection } from '../../index'
import { Container } from '@mui/material'
import { useRouter } from 'next/router'
import ManageBorrow from '~/containers/Liquidity/borrow/manage/ManageBorrow'

const Manage = () => {
  const router = useRouter()

  return (
    <StyledSection>
      <Container>
        <ManageBorrow assetId={router.query.assetId} />
      </Container>
    </StyledSection>
  )
}

export default Manage
