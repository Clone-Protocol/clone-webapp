import React from 'react'
import { Box, Stack, Typography } from '@mui/material'
import { styled } from '@mui/material/styles'
import InfoTooltip from '~/components/Common/InfoTooltip'
import { TooltipTexts } from '~/data/tooltipTexts'
import Image from 'next/image'
import { PositionInfo as BorrowDetail } from '~/features/Liquidity/borrow/BorrowPosition.query'
import { LoadingProgress } from '~/components/Common/Loading'
import withSuspense from '~/hocs/withSuspense'
import { SubmitButton } from "~/components/Common/CommonButtons"
import CheckIcon from 'public/images/liquidity/check-icon.svg'
import { ON_USD } from '~/utils/constants'
import { formatLocaleAmount } from '~/utils/numbers'

const ClosePanel = ({ borrowDetail, onMoveRepayPosition, onMoveWithdrawCollateral }: { borrowDetail: BorrowDetail, onMoveRepayPosition: () => void, onMoveWithdrawCollateral: () => void }) => {
  const canCloseComet = borrowDetail.borrowedOnasset === 0

  return (
    <BoxWithBorder>
      <Box mt='24px'>
        <Box>
          <Typography variant='p_lg'>Step 1: Repay full borrowed amount</Typography>
          <InfoTooltip title={TooltipTexts.repayFullBorrow} color="#8988a3" />
        </Box>
        <StackWithBorder direction='row' justifyContent='space-between'>
          <Typography variant='p_lg'>
            {formatLocaleAmount(Number(borrowDetail.borrowedOnasset), 6)} {borrowDetail.tickerSymbol}
          </Typography>

          {canCloseComet ?
            <Stack direction='row' gap={1} alignItems='center'>
              <Image src={CheckIcon} alt='check' />
              <Typography variant="p">None Remaining</Typography>
            </Stack>
            :
            <GoButton onClick={onMoveRepayPosition}><Typography variant="p">Repay</Typography></GoButton>
          }
        </StackWithBorder>
      </Box>

      <Box>
        <Box>
          <Typography variant='p_lg'>Step 2 (Final Step): Withdraw entire collateral</Typography>
          <InfoTooltip title={TooltipTexts.withdrawEntire} color="#8988a3" />
        </Box>
        <StackWithBorder direction='row' justifyContent='space-between'>
          <Typography variant='p_lg'>
            {formatLocaleAmount(Number(borrowDetail.collateralAmount))} {ON_USD}
          </Typography>

          <GoButton onClick={onMoveWithdrawCollateral} disabled={!canCloseComet}><Typography variant="p" noWrap>{canCloseComet ? 'Withdraw Collateral' : 'Withdraw'}</Typography></GoButton>
        </StackWithBorder>
      </Box>
    </BoxWithBorder>
  )
}

const BoxWithBorder = styled(Box)`
  background: ${(props) => props.theme.basis.backInBlack};
  border-radius: 10px;
  border: solid 1px ${(props) => props.theme.basis.jurassicGrey};
  padding: 0px 24px;
`
const StackWithBorder = styled(Stack)`
  width: 100%;
  height: 60px;
  margin-top: 5px;
  margin-bottom: 20px;
  border-radius: 10px;
  align-items: center;
  gap: 10px;
  padding: 18px 15px;
  border: solid 1px ${(props) => props.theme.basis.plumFuzz};
`
const GoButton = styled(SubmitButton)`
  width: 160px;
  height: 40px;
  text-wrap: nowrap;
`

export default withSuspense(ClosePanel, <LoadingProgress />)
