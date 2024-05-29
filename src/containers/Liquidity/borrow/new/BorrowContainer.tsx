import { Box, Paper, Stack, Theme, Typography, useMediaQuery } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { styled } from '@mui/material/styles'
import { LoadingProgress } from '~/components/Common/Loading'
import withSuspense from '~/hocs/withSuspense'
import BorrowPanel from './BorrowPanel'
import PriceChart from '~/components/Liquidity/overview/PriceChart'
import PositionAnalytics from '~/components/Liquidity/borrow/PositionAnalytics'
import { ASSETS } from '~/data/assets'
import Image from 'next/image'
import InfoIcon from 'public/images/info-icon.svg'
import TipMsg from '~/components/Common/TipMsg'
import { useRouter } from 'next/navigation'
import { useBorrowDetailQuery } from '~/features/Liquidity/borrow/BorrowPosition.query'
import { useWallet } from '@solana/wallet-adapter-react'
import { ShowChartBtn } from '~/components/Common/CommonButtons'
import { GoBackButton } from '~/components/Common/CommonButtons'

const BorrowContainer = () => {
  const { publicKey } = useWallet()
  const [assetIndex, setAssetIndex] = useState(0)
  const [borrowAsset, setBorrowAsset] = useState(ASSETS[0])
  const isMobileOnSize = useMediaQuery((theme: Theme) => theme.breakpoints.down('md'))
  const [showChart, setShowChart] = useState(true)
  const router = useRouter()

  const { data: borrowDetail } = useBorrowDetailQuery({
    userPubKey: publicKey,
    index: assetIndex,
    refetchOnMount: "always",
    enabled: publicKey != null
  })

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

  const handleChooseAssetIndex = (index: number) => {
    setAssetIndex(index)
    setBorrowAsset(ASSETS[index])
  }

  return borrowAsset ? (
    <>
      <Stack width='100%' direction={isMobileOnSize ? 'column' : 'row'} spacing={isMobileOnSize ? 0 : 9} justifyContent="center" alignItems={isMobileOnSize ? "center" : ""}>
        <LeftBoxWrapper width={isMobileOnSize ? "100%" : "600px"} height='100%' overflow={isMobileOnSize ? 'auto' : 'hidden'} position={isMobileOnSize ? 'fixed' : 'relative'} top={isMobileOnSize ? '85px' : 'inherit'}>
          <GoBackButton onClick={() => router.back()}><Typography variant='p'>{'<'} Go back</Typography></GoBackButton>
          <Box mb='8px'><Typography fontSize='20px' fontWeight={500}>New Borrow Position</Typography></Box>
          <a href="https://docs.clone.so/clone-mainnet-guide/clone-liquidity-or-for-lps/borrowing" target="_blank" rel="noreferrer">
            <TipMsg><Image src={InfoIcon} alt='info' /> <Typography variant='p' ml='5px' sx={{ cursor: 'pointer' }}>You are able to borrow any clAsset by providing sufficient collateral. Click to learn more.</Typography></TipMsg>
          </a>
          <BoxWrapper mb={isMobileOnSize ? '150px' : '0px'}>
            <Box py='10px'>
              <BorrowPanel assetIndex={assetIndex} borrowDetail={borrowDetail} onChooseAssetIndex={handleChooseAssetIndex} />
            </Box>
          </BoxWrapper>
        </LeftBoxWrapper>

        {showChart &&
          <RightBoxWrapper width={isMobileOnSize ? '100%' : '450px'} bgcolor={isMobileOnSize ? '#0f0e14' : 'transparent'} py={isMobileOnSize ? '0px' : '8px'} zIndex={99}>
            <StickyBox top={isMobileOnSize ? '0px' : '100px'} px={isMobileOnSize ? '15px' : '0px'} py='10px'>
              <PriceChart assetData={borrowAsset} publicKey={publicKey} isOraclePrice={true} priceTitle='Oracle Price' />
              {borrowDetail && <PositionAnalytics price={borrowDetail.oPrice} tickerSymbol={borrowAsset.tickerSymbol} />}
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
const BoxWrapper = styled(Box)`
  background: ${(props) => props.theme.basis.backInBlack};
  border-radius: 10px;
  margin-top: 23px;
  padding: 8px 22px;
`
const RightBoxWrapper = styled(Box)`
  height: 100vh;
  padding-bottom: 55px;
`
const StickyBox = styled(Box)`
  position: sticky;
  width: 100%;
`
export default withSuspense(BorrowContainer, <LoadingProgress />)
