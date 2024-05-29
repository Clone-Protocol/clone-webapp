import { styled } from '@mui/material/styles'
import { Box, Stack, Theme, Typography, useMediaQuery } from '@mui/material'
import { useStatusQuery } from '~/features/Liquidity/borrow/Status.query'
import { useWallet } from '@solana/wallet-adapter-react'
import { TooltipTexts } from '~/data/tooltipTexts'
import InfoTooltip from '~/components/Common/InfoTooltip'
import { formatLocaleAmount } from '~/utils/numbers'

const BorrowLiquidityStatus = ({ hasNoPosition = true }: { hasNoPosition: boolean }) => {
  const { publicKey } = useWallet()
  const isMobileOnSize = useMediaQuery((theme: Theme) => theme.breakpoints.down('md'))
  const { data: status } = useStatusQuery({
    userPubKey: publicKey,
    refetchOnMount: "always",
    enabled: publicKey != null
  })

  return (
    <Wrapper p={isMobileOnSize ? '12px 5px' : '12px 75px'}>
      <Stack direction='row' gap={isMobileOnSize ? 6 : 10}>
        <Box width='180px'>
          <Box display='flex' justifyContent='center' alignItems='center'>
            <Typography variant='p' color={!hasNoPosition ? '#fff' : 'rgba(255, 255, 255, 0.3)'} whiteSpace={'nowrap'}>Borrowed Amount</Typography>
            <InfoTooltip title={TooltipTexts.borrowedAmount} color={!hasNoPosition ? '#8988a3' : '#66707e'} />
          </Box>
          <StatusValue>
            {status && status.statusValues &&
              <Typography variant='p_xlg'>
                {
                  status.statusValues.totalBorrowLiquidity > 0 ?
                    `$${formatLocaleAmount(status.statusValues.totalBorrowLiquidity)}`
                    : ''
                }
              </Typography>
            }
          </StatusValue>
        </Box>
        <Box width='180px'>
          <Box display='flex' justifyContent='center' alignItems='center'>
            <Typography variant='p' color={!hasNoPosition ? '#fff' : 'rgba(255, 255, 255, 0.3)'} whiteSpace={'nowrap'}>Collateral in Borrow Positions</Typography>
            <InfoTooltip title={TooltipTexts.collateralInBorrow} color={!hasNoPosition ? '#8988a3' : '#66707e'} />
          </Box>
          <StatusValue>
            {status && status.statusValues &&
              <Typography variant='p_xlg'>
                {
                  status.statusValues.totalBorrowCollateralVal > 0 ?
                    `$${formatLocaleAmount(status.statusValues.totalBorrowCollateralVal)}`
                    : ''
                }
              </Typography>
            }
          </StatusValue>
        </Box>
      </Stack>
    </Wrapper>
  )

}

const Wrapper = styled(Box)`
  position: relative;
  height: 120px;
  margin-top: 16px;
  margin-bottom: 28px;
  border-radius: 10px;
  border: solid 1px ${(props) => props.theme.basis.plumFuzz};
`
const StatusValue = styled(Box)`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 80px;
`

export default BorrowLiquidityStatus