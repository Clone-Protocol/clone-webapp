import { styled } from '@mui/material/styles'
import { Box, Button, Stack, Typography } from '@mui/material'
import HealthscoreView from '~/components/Liquidity/comet/HealthscoreView'
import { CometInfoStatus } from '~/features/Liquidity/comet/CometInfo.query'
import { OpaqueDefault } from '~/components/Common/OpaqueArea'
import InfoTooltip from '~/components/Common/InfoTooltip'
import { TooltipTexts } from '~/data/tooltipTexts'
import { useWallet } from '@solana/wallet-adapter-react'
import { formatLocaleAmount } from '~/utils/numbers'

const CometLiquidityStatus = ({ infos }: { infos: CometInfoStatus | undefined }) => {
  const { publicKey } = useWallet()

  return (
    <Wrapper>
      <Stack direction='row' gap={16}>
        <Box>
          <Box display='flex' justifyContent='center' alignItems='center'>
            <Typography variant='p'>Health Score</Typography>
            <InfoTooltip title={TooltipTexts.cometdHealthScore} color='#8988a3' />
          </Box>
          <Box mt='15px'>
            <HealthscoreView score={infos && infos.healthScore ? infos.healthScore : 0} />
          </Box>
        </Box>
        <Box>
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
        <Box>
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
        <Box>
          <Box display='flex' justifyContent='center' alignItems='center'>
            <Typography variant='p'>My APR</Typography>
            <InfoTooltip title={TooltipTexts.yourApy} color='#8988a3' />
          </Box>
          <StatusValue>
            {(infos && infos.positions.length > 0 && !isNaN(infos.totalApy)) &&
              <Box>
                {infos.totalApy > 0 ?
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
  margin-top: 16px;
  margin-bottom: 28px;
  padding: 12px 28px;
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
  background-color: #000e22;
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