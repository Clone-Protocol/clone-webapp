import React, { useState } from 'react'
import { Stack, Box, Typography } from '@mui/material'
import { styled } from '@mui/system'
import { useWallet } from '@solana/wallet-adapter-react'
import { TabPanelForEdit, StyledTabs, CommonTab } from '~/components/Common/StyledTab'
import { LoadingProgress } from '~/components/Common/Loading'
import withSuspense from '~/hocs/withSuspense'
import EditPanel from '~/containers/Liquidity/borrow/manage/EditPanel'
import ClosePanel from '~/containers/Liquidity/borrow/manage/ClosePanel'
import { useBorrowPositionQuery } from '~/features/Liquidity/borrow/BorrowPosition.query'
import PriceChart from '~/components/Liquidity/overview/PriceChart'
import PositionAnalytics from '~/components/Liquidity/borrow/PositionAnalytics'
import { GoBackButton } from '~/components/Common/CommonButtons'
import { useRouter } from 'next/navigation'

const ManageBorrow = ({ assetId }: { assetId: string }) => {
  const { publicKey } = useWallet()
  const router = useRouter()
  const [tab, setTab] = useState(0)
  const [showEditRepay, setShowEditRepay] = useState(false)
  const [showWithdrawCollateral, setShowWithdrawCollateral] = useState(false)
  const handleChangeTab = (event: React.SyntheticEvent, newValue: number) => {
    setTab(newValue)
    setShowEditRepay(false)
    setShowWithdrawCollateral(false)
  }

  const borrowIndex = parseInt(assetId)

  const { data: borrowDetail, refetch } = useBorrowPositionQuery({
    userPubKey: publicKey,
    index: borrowIndex,
    refetchOnMount: "always",
    enabled: publicKey != null
  });

  const moveRepayPosition = () => {
    setTab(0)
    setShowWithdrawCollateral(false)
    setShowEditRepay(true)
  }

  const moveWithdrawCollateral = () => {
    setTab(0)
    setShowEditRepay(false)
    setShowWithdrawCollateral(true)
  }

  return borrowDetail ? (
    <Stack direction='row' spacing={3} justifyContent="center">
      <Box>
        <GoBackButton onClick={() => router.back()}><Typography variant='p'>{'<'} Go back</Typography></GoBackButton>
        <Box mt='5px' mb='25px'><Typography variant='h3' fontWeight={500}>Manage Borrow Position</Typography></Box>
        <LeftBoxWrapper mt='21px'>
          <StyledTabs value={tab} onChange={handleChangeTab}>
            <CommonTab value={0} label="Manage" />
            <CommonTab value={1} label="Close" />
          </StyledTabs>
          <TabPanelForEdit value={tab} index={0}>
            <EditPanel assetId={assetId} borrowDetail={borrowDetail} showRepayPosition={showEditRepay} showWithdrawCollateral={showWithdrawCollateral} onRefetchData={() => refetch()} />
          </TabPanelForEdit>
          <TabPanelForEdit value={tab} index={1}>
            <ClosePanel borrowDetail={borrowDetail} onMoveRepayPosition={moveRepayPosition} onMoveWithdrawCollateral={moveWithdrawCollateral} />
          </TabPanelForEdit>
        </LeftBoxWrapper>
      </Box>
      <RightBoxWrapper>
        <StickyBox>
          <PriceChart assetData={borrowDetail} publicKey={publicKey} isOraclePrice={true} priceTitle='Oracle Price' />
          <PositionAnalytics price={borrowDetail.price} tickerSymbol={borrowDetail.tickerSymbol} />
        </StickyBox>
      </RightBoxWrapper>
    </Stack>
  ) : <></>
}

const LeftBoxWrapper = styled(Box)`
	width: 600px;
	margin-bottom: 25px;
`
const RightBoxWrapper = styled(Box)`
	width: 472px;
	padding: 20px;
`
const StickyBox = styled(Box)`
  position: sticky;
  top: 100px;
`

export default withSuspense(ManageBorrow, <LoadingProgress />)
