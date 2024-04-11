import { Box, Paper, Stack, Typography } from '@mui/material'
import React, { useState } from 'react'
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
import { useBorrowDetailQuery } from '~/features/Liquidity/borrow/BorrowPosition.query'
import { useWallet } from '@solana/wallet-adapter-react'

const BorrowContainer = () => {
  const { publicKey } = useWallet()
  const [assetIndex, setAssetIndex] = useState(0)
  const [borrowAsset, setBorrowAsset] = useState(ASSETS[0])

  const { data: borrowDetail } = useBorrowDetailQuery({
    userPubKey: publicKey,
    index: assetIndex,
    refetchOnMount: "always",
    enabled: publicKey != null
  })

  const handleChooseAssetIndex = (index: number) => {
    setAssetIndex(index)
    setBorrowAsset(ASSETS[index])
  }

  return borrowAsset ? (
    <StyledBox>
      <Stack direction='row' spacing={3} justifyContent="center">
        <Box>
          <a href="https://docs.clone.so/clone-mainnet-guide/clone-liquidity-or-for-lps/borrowing" target="_blank" rel="noreferrer">
            <TipMsg><Image src={InfoIcon} alt='info' /> <Typography variant='p' ml='5px' sx={{ cursor: 'pointer' }}>You are able to borrow any clAsset by providing sufficient collateral. Click to learn more.</Typography></TipMsg>
          </a>
          <LeftBoxWrapper>
            <Box paddingY='10px'>
              <BorrowPanel assetIndex={assetIndex} borrowDetail={borrowDetail} onChooseAssetIndex={handleChooseAssetIndex} />
            </Box>
          </LeftBoxWrapper>
        </Box>

        <RightBoxWrapper>
          <StickyBox>
            <PriceChart assetData={borrowAsset} publicKey={publicKey} isOraclePrice={true} priceTitle='Oracle Price' />
            {borrowDetail && <PositionAnalytics price={borrowDetail.oPrice} tickerSymbol={borrowAsset.tickerSymbol} />}
          </StickyBox>
        </RightBoxWrapper>
      </Stack>
    </StyledBox>
  ) : <></>
}

const StyledBox = styled(Paper)`
	font-size: 14px;
	font-weight: 500;
	text-align: center;
	color: #fff;
	border-radius: 8px;
	text-align: left;
	background: #000;
`
const LeftBoxWrapper = styled(Box)`
	width: 600px; 
	padding: 8px 22px;
	border: solid 1px ${(props) => props.theme.basis.jurassicGrey};
  margin-top: 23px;
	margin-bottom: 25px;
`
const RightBoxWrapper = styled(Box)`
	width: 450px;
	padding: 20px;
`
const StickyBox = styled(Box)`
  position: sticky;
  top: 100px;
`
export default withSuspense(BorrowContainer, <LoadingProgress />)
