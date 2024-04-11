import { Box, Stack, Typography } from '@mui/material'
import { withCsrOnly } from '~/hocs/CsrOnly'
import { styled } from '@mui/system'
import { PositionInfo as PI } from '~/features/Liquidity/borrow/BorrowPosition.query'
import Image from 'next/image'
import RightArrowIcon from 'public/images/liquidity/right-arrow.svg'
import { useState } from 'react'
import { ON_USD } from '~/utils/constants'
import { Collateral, collateralMapping } from '~/data/assets'
import InfoTooltip from '~/components/Common/InfoTooltip'
import { TooltipTexts } from '~/data/tooltipTexts'
import { formatLocaleAmount } from '~/utils/numbers'

interface Props {
  positionInfo: PI
  onShowEditForm: () => void
  onShowBorrowMore: () => void
}

const PositionInfo: React.FC<Props> = ({ positionInfo, onShowEditForm, onShowBorrowMore }) => {
  const [isEditCollHover, setIsEditCollHover] = useState(false)
  const [isEditBorrowHover, setIsEditBorrowHover] = useState(false)

  const borrowedDollarPrice = Number(positionInfo.borrowedOnasset) * positionInfo.price

  return positionInfo ? (
    <BoxWithBorder>
      {Number(positionInfo.borrowedOnasset) > 0 &&
        <Box>
          <Stack direction='row' gap={3}>
            <ValueBox width='220px'>
              <Box mb='6px'><Typography variant='p'>Borrowed clAsset</Typography></Box>
              <Box display="flex" alignItems='center'>
                <Image src={positionInfo.tickerIcon} width={28} height={28} alt={positionInfo.tickerSymbol!} />
                <Typography variant="h4" ml='10px'>
                  {positionInfo.tickerSymbol}
                </Typography>
              </Box>
            </ValueBox>
            <ValueBox width='300px'>
              <Box mb='6px'>
                <Typography variant='p'>Collateral Ratio</Typography>
                <InfoTooltip title={TooltipTexts.borrowedCollRatio} color='#66707e' />
              </Box>
              <Stack direction='row' gap={1} alignItems='center'>
                <Typography variant='h3'>{positionInfo.collateralRatio.toFixed(2)}%</Typography>
                <Typography variant='p_lg' color='#66707e'>(min {positionInfo.minCollateralRatio}%)</Typography>
              </Stack>
            </ValueBox>
          </Stack>

          <Box my='15px'><Typography variant='p_lg'>Borrowed Amount</Typography></Box>
          <EditRowBox sx={isEditBorrowHover ? { background: '#1b1b1b' } : {}}>
            <Stack width='100%' direction='row' justifyContent='space-between' alignItems='center' padding='14px'>
              <Box textAlign='left'>
                <Box><Typography fontSize='26px'>{formatLocaleAmount(Number(positionInfo.borrowedOnasset), 5)}</Typography></Box>
                <Box mt='-5px'><Typography variant='p' color='#66707e'>${formatLocaleAmount(borrowedDollarPrice)}</Typography></Box>
              </Box>
              <TickerBox display="flex" alignItems='center'>
                <Image src={positionInfo.tickerIcon} width={22} height={22} alt={positionInfo.tickerSymbol!} />
                <Typography variant="h4" ml='3px'>
                  {positionInfo.tickerSymbol}
                </Typography>
              </TickerBox>
            </Stack>
            <EditBox onClick={onShowBorrowMore} onMouseOver={() => setIsEditBorrowHover(true)} onMouseLeave={() => setIsEditBorrowHover(false)}>
              <Image src={RightArrowIcon} alt='edit' />
            </EditBox>
          </EditRowBox>
        </Box>
      }

      <Box my='15px'><Typography variant='p_lg'>Collateral Amount</Typography></Box>
      <EditRowBox sx={isEditCollHover ? { background: '#1b1b1b' } : {}}>
        <Stack width='100%' direction='row' justifyContent='space-between' alignItems='center' padding='14px'>
          <Box textAlign='left'>
            <Box><Typography fontSize='26px'>{formatLocaleAmount(Number(positionInfo.collateralAmount), 5)}</Typography></Box>
            <Box mt='-5px'><Typography variant='p' color='#66707e'>${formatLocaleAmount(Number(positionInfo.collateralAmount))}</Typography></Box>
          </Box>
          <TickerBox display="flex" alignItems='center'>
            <Image src={collateralMapping(Collateral.onUSD).collateralIcon} width={22} height={22} alt={'dev-usd'} />
            <Typography variant="h4" ml='3px'>
              {ON_USD}
            </Typography>
          </TickerBox>
        </Stack>
        <EditBox onClick={onShowEditForm} onMouseOver={() => setIsEditCollHover(true)} onMouseLeave={() => setIsEditCollHover(false)}>
          <Image src={RightArrowIcon} alt='edit' />
        </EditBox>
      </EditRowBox>
    </BoxWithBorder>
  ) : (
    <></>
  )
}

const ValueBox = styled(Box)`
  display: flex;
  flex-direction: column;
  height: 78px;
  padding: 8px 30px;
  border-radius: 10px;
  line-height: 24px;
  background-color: ${(props) => props.theme.basis.jurassicGrey};
`
const BoxWithBorder = styled(Box)`
  border: solid 1px ${(props) => props.theme.basis.jurassicGrey};
  padding: 24px;
`
const EditRowBox = styled(Box)`
  display: flex; 
  width: 100%;
  height: 80px; 
  margin-bottom: 9px;
  border: 1px solid ${(props) => props.theme.basis.shadowGloom};
  border-radius: 6px;
`
const EditBox = styled(Box)`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 30px;
  cursor: pointer;
  background: ${(props) => props.theme.basis.shadowGloom};
  border-top-right-radius: 5px;
  border-bottom-right-radius: 5px;
`
const TickerBox = styled(Box)`
  background: ${(props) => props.theme.basis.darkNavy};
  border-radius: 100px;
  padding: 3px 10px 3px 5px;
`

export default withCsrOnly(PositionInfo)
