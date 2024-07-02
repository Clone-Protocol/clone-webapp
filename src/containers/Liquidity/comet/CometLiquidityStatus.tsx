import { styled } from '@mui/material/styles'
import { Box, Button, Skeleton, Stack, Theme, Typography, useMediaQuery } from '@mui/material'
import HealthscoreView from '~/components/Liquidity/comet/HealthscoreView'
import { CometInfoStatus } from '~/features/Liquidity/comet/CometInfo.query'
import { OpaqueDefault } from '~/components/Common/OpaqueArea'
import InfoTooltip from '~/components/Common/InfoTooltip'
import { TooltipTexts } from '~/data/tooltipTexts'
import { useWallet } from '@solana/wallet-adapter-react'
import { formatLocaleAmount } from '~/utils/numbers'

const CometLiquidityStatus = ({ infos, totalApy }: { infos: CometInfoStatus | undefined, totalApy?: number }) => {
  const { publicKey } = useWallet()
  const isMobileOnSize = useMediaQuery((theme: Theme) => theme.breakpoints.down('md'))

  return (
    <Wrapper>
      <Stack direction='row' gap={isMobileOnSize ? 6 : 12} flexWrap='wrap' justifyContent={isMobileOnSize ? 'center' : ''}>
        <Box width='140px'>
          <Box display='flex' justifyContent='center' alignItems='center'>
            <Typography variant='p'>Health Score</Typography>
            <InfoTooltip title={TooltipTexts.cometdHealthScore} color='#8988a3' />
          </Box>
          <Box mt='15px'>
            <HealthscoreView score={infos && infos.healthScore ? infos.healthScore : 0} />
          </Box>
        </Box>
        <Box width='140px'>
          <Box display='flex' justifyContent='center' alignItems='center'>
            <Typography variant='p'>My Liquidity</Typography>
            <InfoTooltip title={TooltipTexts.totalLiquidity} color='#8988a3' />
          </Box>
          <StatusValue>
            <Typography variant='p_xlg'>
              {infos && infos.totalLiquidity > 0 ? `$${formatLocaleAmount(infos.totalLiquidity)}` : '$0'}
            </Typography>
          </StatusValue>
        </Box>
        <Box width='140px'>
          <Box display='flex' justifyContent='center' alignItems='center'>
            <Typography variant='p'>My Collateral</Typography>
            <InfoTooltip title={TooltipTexts.totalCollateralValue} color='#8988a3' />
          </Box>
          <StatusValue>
            <Typography variant='p_xlg'>
              {infos && infos.totalCollValue > 0 ? `$${formatLocaleAmount(infos.totalCollValue)}` : '0'}
            </Typography>
          </StatusValue>
        </Box>
        <Box width='140px'>
          <Box display='flex' justifyContent='center' alignItems='center'>
            <Typography variant='p'>My APR</Typography>
            <InfoTooltip title={TooltipTexts.yourApy} color='#8988a3' />
          </Box>
          <StatusValue>
            {(infos && infos.positions.length > 0) &&
              totalApy ?
              <Box>
                {totalApy > 0 ?
                  <Box color='#c4b5fd'>
                    <Box display='flex' justifyContent='center' alignItems='center'>
                      <Typography variant='p_xlg'>{infos.totalApy >= 0.01 ? `+${infos.totalApy?.toFixed(2)}` : '<0.01'}%</Typography>
                    </Box>
                  </Box>
                  :
                  <Box color='white'>
                    <Box display='flex' alignItems='center'>
                      <Typography variant='p_xlg'>{'0.00'}%</Typography>
                    </Box>
                  </Box>
                }
              </Box>
              :
              <Skeleton variant='rectangular' width={70} height={20} />
            }
          </StatusValue>
        </Box>
      </Stack >
      {!publicKey && <OpaqueDefault />}
      {publicKey && infos && infos.hasNoCollateral &&
        <Box>
          <ViewVideoBox><Typography variant='p'>New to Comets?</Typography><a href="https://vimeo.com/918532309?share=copy" target='_blank'><WatchButton>Watch Tutorial</WatchButton></a></ViewVideoBox>
          <OpaqueDefault />
        </Box>
      }
    </Wrapper>
  )

}

const Wrapper = styled(Box)`
  position: relative;
  margin-top: 25px;
  margin-bottom: 28px;
  padding: 12px 32px;
  border-radius: 10px;
  border: solid 1px ${(props) => props.theme.basis.plumFuzz};
`
const StatusValue = styled(Box)`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 80px;
`
const ViewVideoBox = styled(Box)`
  position: absolute;
  left: calc(50% - 193px / 2);
  top: 30px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 193px;
  height: 79px;
  padding: 12px 22px 11px;
  border-radius: 10px;
  background-color: ${(props) => props.theme.basis.nobleBlack};
  z-index: 999;
`
const WatchButton = styled(Button)`
  width: 149px;
  height: 32px;
  margin: 8px 0 0;
  padding: 8px 33px;
  border-radius: 5px;
  background-color: #c4b5fd;
  font-size: 12px;
  font-weight: 500;
`
export default CometLiquidityStatus