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
    <BoxWithBorder sx={{ padding: { xs: '10px', md: '24px' } }}>
      {Number(positionInfo.borrowedOnasset) > 0 &&
        <Box>
          <Stack direction='row' gap={3}>
            <ValueBox width='220px' sx={{ padding: { xs: '8px 12px', md: '8px 30px' } }}>
              <Box mb='6px'><Typography variant='p'>Borrowed clAsset</Typography></Box>
              <Box display="flex" alignItems='center'>
                <Image src={positionInfo.tickerIcon} width={28} height={28} alt={positionInfo.tickerSymbol!} />
                <Typography variant="h4" ml='10px'>
                  {positionInfo.tickerSymbol}
                </Typography>
              </Box>
            </ValueBox>
            <ValueBox width='300px' sx={{ padding: { xs: '8px 10px', md: '8px 30px' } }}>
              <Box mb='6px'>
                <Typography variant='p'>Collateral Ratio</Typography>
                <InfoTooltip title={TooltipTexts.borrowedCollRatio} color='#8988a3' />
              </Box>
              <Stack direction='row' gap={1} alignItems='center'>
                <Typography variant='h3'>{positionInfo.collateralRatio.toFixed(2)}%</Typography>
                <Typography variant='p_lg' color='#8988a3'>(min {positionInfo.minCollateralRatio}%)</Typography>
              </Stack>
            </ValueBox>
          </Stack>

          <Box my='15px'><Typography variant='p_lg'>Borrowed Amount</Typography></Box>
          <EditRowBox>
            <Stack width='100%' direction='row' justifyContent='space-between' alignItems='center' padding='14px'>
              <Box textAlign='left'>
                <Box><Typography fontSize='26px'>{formatLocaleAmount(Number(positionInfo.borrowedOnasset), 5)}</Typography></Box>
                <Box mt='-5px'><Typography variant='p' color='#8988a3'>${formatLocaleAmount(borrowedDollarPrice)}</Typography></Box>
              </Box>
              <TickerBox display="flex" alignItems='center'>
                <Image src={positionInfo.tickerIcon} width={22} height={22} alt={positionInfo.tickerSymbol!} />
                <Typography variant="h4" ml='3px'>
                  {positionInfo.tickerSymbol}
                </Typography>
              </TickerBox>
            </Stack>
            {isEditBorrowHover &&
              <Box position='absolute' width='94%' height='100%' display='flex' justifyContent='center' alignItems='center' sx={{ background: 'rgba(0,0,0,0.7)', borderTopLeftRadius: '10px', borderBottomLeftRadius: '10px' }}>
                <Typography variant='p_lg'>Manage Borrowed Amount</Typography>
              </Box>
            }
            <EditBox sx={isEditBorrowHover ? { background: '#343440' } : {}} onClick={onShowBorrowMore} onMouseOver={() => setIsEditBorrowHover(true)} onMouseLeave={() => setIsEditBorrowHover(false)}>
              <Image src={RightArrowIcon} alt='edit' />
            </EditBox>
          </EditRowBox>
        </Box>
      }

      <Box my='15px'><Typography variant='p_lg'>Collateral Amount</Typography></Box>
      <EditRowBox>
        <Stack width='100%' direction='row' justifyContent='space-between' alignItems='center' padding='14px'>
          <Box textAlign='left'>
            <Box><Typography fontSize='26px'>{formatLocaleAmount(Number(positionInfo.collateralAmount), 5)}</Typography></Box>
            <Box mt='-5px'><Typography variant='p' color='#8988a3'>${formatLocaleAmount(Number(positionInfo.collateralAmount))}</Typography></Box>
          </Box>
          <TickerBox display="flex" alignItems='center'>
            <Image src={collateralMapping(Collateral.onUSD).collateralIcon} width={22} height={22} alt={'dev-usd'} />
            <Typography variant="h4" ml='3px'>
              {ON_USD}
            </Typography>
          </TickerBox>
        </Stack>
        {isEditCollHover &&
          <Box position='absolute' width='94%' height='100%' display='flex' justifyContent='center' alignItems='center' sx={{ background: 'rgba(0,0,0,0.7)', borderTopLeftRadius: '10px', borderBottomLeftRadius: '10px' }}>
            <Typography variant='p_lg'>Manage Collateral</Typography>
          </Box>
        }
        <EditBox sx={isEditCollHover ? { background: '#343440' } : {}} onClick={onShowEditForm} onMouseOver={() => setIsEditCollHover(true)} onMouseLeave={() => setIsEditCollHover(false)}>
          <Image src={RightArrowIcon} alt='edit' />
        </EditBox>
      </EditRowBox>
    </BoxWithBorder >
  ) : (
    <></>
  )
}

const ValueBox = styled(Box)`
  display: flex;
  flex-direction: column;
  height: 78px;
  border-radius: 10px;
  line-height: 24px;
  background-color: #0a080f;
  text-wrap: nowrap;
`
const BoxWithBorder = styled(Box)`
  background: ${(props) => props.theme.basis.backInBlack};
  border-radius: 10px;
`
const EditRowBox = styled(Box)`
  position: relative;
  display: flex; 
  width: 100%;
  height: 80px; 
  margin-bottom: 9px;
  border: 1px solid ${(props) => props.theme.basis.plumFuzz};
  border-radius: 10px;
`
const EditBox = styled(Box)`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 30px;
  cursor: pointer;
  background: ${(props) => props.theme.basis.plumFuzz};
  border-top-right-radius: 9px;
  border-bottom-right-radius: 9px;
`
const TickerBox = styled(Box)`
  border-radius: 100px;
  padding: 3px 10px 3px 5px;
`

export default withCsrOnly(PositionInfo)
