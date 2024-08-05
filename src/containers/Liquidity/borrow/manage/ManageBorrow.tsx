import React, { useEffect, useState } from 'react'
import { Stack, Box, Typography, useMediaQuery, Theme } from '@mui/material'
import { styled } from '@mui/material/styles'
import { useWallet } from '@solana/wallet-adapter-react'
import { TabPanelForEdit, StyledTabs, CommonTab } from '~/components/Common/StyledTab'
import { LoadingSkeleton } from '~/components/Common/Loading'
import withSuspense from '~/hocs/withSuspense'
import EditPanel from '~/containers/Liquidity/borrow/manage/EditPanel'
import ClosePanel from '~/containers/Liquidity/borrow/manage/ClosePanel'
import { useBorrowPositionQuery } from '~/features/Liquidity/borrow/BorrowPosition.query'
import PriceChart from '~/components/Liquidity/overview/PriceChart'
import PositionAnalytics from '~/components/Liquidity/borrow/PositionAnalytics'
import { GoBackButton, ShowChartBtn } from '~/components/Common/CommonButtons'
import { useRouter } from 'next/navigation'

const ManageBorrow = ({ assetId }: { assetId: string }) => {
  const { publicKey } = useWallet()
  const router = useRouter()
  const [tab, setTab] = useState(0)
  const [showEditRepay, setShowEditRepay] = useState(false)
  const [showWithdrawCollateral, setShowWithdrawCollateral] = useState(false)
  const isMobileOnSize = useMediaQuery((theme: Theme) => theme.breakpoints.down('md'))
  const [showChart, setShowChart] = useState(true)
  const handleChangeTab = (event: React.SyntheticEvent, newValue: number) => {
    setTab(newValue)
    setShowEditRepay(false)
    setShowWithdrawCollateral(false)
  }

  const borrowIndex = parseInt(assetId)

  const { data: borrowDetail, refetch } = useBorrowPositionQuery({
    userPubKey: publicKey,
    index: borrowIndex,
    refetchOnMount: "always"
  });

  useEffect(() => {
    if (!isMobileOnSize) {
      setShowChart(true)
    } else {
      setShowChart(false)
    }
  }, [isMobileOnSize])

  const toggleShowTrading = () => {
    setShowChart(!showChart)
  }

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
    <>
      <Stack width='100%' direction={isMobileOnSize ? 'column' : 'row'} spacing={isMobileOnSize ? 0 : 9} justifyContent="center" alignItems={isMobileOnSize ? "center" : ""}>
        <LeftBoxWrapper width={isMobileOnSize ? "100%" : "600px"} height='100%' overflow={isMobileOnSize ? 'auto' : 'hidden'} position={isMobileOnSize ? 'fixed' : 'relative'} top={isMobileOnSize ? '85px' : 'inherit'}>
          <GoBackButton onClick={() => router.back()}><Typography variant='p'>{'<'} Go back</Typography></GoBackButton>
          <Box mt='5px' mb='25px'><Typography variant='h3' fontWeight={500}>Manage Borrow Position</Typography></Box>
          <Box mt='21px'>
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
          </Box>
        </LeftBoxWrapper>

        {showChart &&
          <RightBoxWrapper width={isMobileOnSize ? '100%' : '472px'} bgcolor={isMobileOnSize ? '#0f0e14' : 'transparent'} py={isMobileOnSize ? '0px' : '8px'} zIndex={99}>
            <StickyBox top={isMobileOnSize ? '0px' : '100px'} px={isMobileOnSize ? '15px' : '0px'} py='10px'>
              <PriceChart assetIndex={borrowDetail.poolIndex} publicKey={publicKey} priceTitle='Oracle Price' />
              <PositionAnalytics price={borrowDetail.price} tickerSymbol={borrowDetail.tickerSymbol} />
            </StickyBox>
          </RightBoxWrapper>
        }
      </Stack>

      {isMobileOnSize && <ShowChartBtn onClick={() => toggleShowTrading()}>{showChart ? 'Hide Chart' : 'Show Chart'}</ShowChartBtn>}
    </>
  ) : <></>
}

const LeftBoxWrapper = styled(Box)`
  padding: 8px 10px;
`
const RightBoxWrapper = styled(Box)`
  height: 100vh;
  padding-bottom: 55px;
`
const StickyBox = styled(Box)`
  position: sticky;
  width: 100%;
`

export default withSuspense(ManageBorrow, <LoadingSkeleton />)
