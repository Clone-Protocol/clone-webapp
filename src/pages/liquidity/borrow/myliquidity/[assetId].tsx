'use client'
import { StyledSection } from '../../index'
import { useRouter } from 'next/router'
import ManageBorrow from '~/containers/Liquidity/borrow/manage/ManageBorrow'

const Manage = () => {
  const router = useRouter()

  return (
    <StyledSection>
      <ManageBorrow assetId={router.query.assetId} />
    </StyledSection>
  )
}

export default Manage
