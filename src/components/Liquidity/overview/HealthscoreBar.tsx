import { styled, Box, Typography } from '@mui/material'

interface Props {
  score?: number
  prevScore?: number
  hasRiskScore?: boolean
  hiddenThumbTitle?: boolean
  hideIndicator?: boolean
  width: number
}

const HealthscoreBar: React.FC<Props> = ({ score, prevScore, hasRiskScore = false, hiddenThumbTitle = false, hideIndicator = false, width = 490 }) => {
  if (score && score > 100) score = 100
  const scorePoint = score ? width * score / 100 - 10 : -10
  const prevScorePoint = prevScore ? width * prevScore / 100 - 10 : -10
  return (
    <Box sx={{ width, margin: '0 auto' }}>
      {score && score >= 0 ?
        <Box py='6px'>
          <Box sx={{ paddingLeft: `${scorePoint}px` }}>
            {!hiddenThumbTitle && <Box sx={{ marginLeft: '-5px' }}><Typography variant='p_sm'>New</Typography></Box>}
            <ScorePointer>
              <Box display='flex' justifyContent='center'><Typography variant='p_lg' color={hasRiskScore ? '#ff0084' : ''}>{score && !isNaN(score) ? Math.floor(score) : 0}</Typography></Box>
            </ScorePointer >
          </Box >
          <Box width='100%' margin='0 auto'>
            <ScoreBar />
            {!hideIndicator && <Box display="flex" justifyContent='space-between' color='#66707e'>
              <Box><Typography variant='p_sm'>0 (Poor)</Typography></Box>
              <Box><Typography variant='p_sm'>(Excellent) 100</Typography></Box>
            </Box>}
          </Box>
          {
            prevScore &&
            <PrevBox sx={{ paddingLeft: `${prevScorePoint}px` }}>
              <IndicatorBox>▲</IndicatorBox>
              <FixValueLabel><Typography variant='p'>{prevScore?.toFixed(0)}</Typography></FixValueLabel>
              <Box ml='-12px' mt='-4px'><Typography variant='p_sm' color='#989898'>Current</Typography></Box>
            </PrevBox>
          }
        </Box>
        :
        <Box py='6px'>
          <Box width='100%' margin='0 auto'>
            <ScoreBar />
            <Box display="flex" justifyContent='space-between' color='#66707e'>
              <Box><Typography variant='p_sm'>0 (Poor)</Typography></Box>
              <Box><Typography variant='p_sm'>(Excellent) 100</Typography></Box>
            </Box>
          </Box>
        </Box>
      }
    </Box >
  )
}

const BoxWithBorder = styled(Box)`
  border: solid 1px ${(props) => props.theme.boxes.greyShade};
  padding: 15px 18px;
  margin-top: 16px;
`
const ScorePointer = styled(Box)`
  margin-left: -9px;
  margin-right: -9px;
  width: 34px;
  height: 26px;
  padding: 2px 6px;
  border: solid 1px #fff;
  border-radius: 4px;
  margin-bottom: 13px;
  font-size: 12px;
  font-weight: 500;
  &::after {
    content: '▼';
    position: relative;
    left: 4px;
    top: -2px;
  }
`
const ScoreBar = styled(Box)`
  width: 100%;
  height: 4px;
  background-image: ${(props) => props.theme.gradients.healthscore};
`
const IndicatorBox = styled(Box)`
  font-size: 12px;
  font-weight: 500;
  margin-left: 2px;
  margin-bottom: -5px;
  color: ${(props) => props.theme.palette.text.secondary};
`
const PrevBox = styled(Box)`
  z-index: 20;
`
const FixValueLabel = styled(Box)`
  width: 34px;
  height: 28px;
  display: flex;
  justify-content: center;
  padding: 4px 8px;
  margin-left: -10px;
  border: solid 1px ${(props) => props.theme.palette.text.secondary};
  text-align: center;
  font-size: 12px;
  font-weight: 500;
  color: ${(props) => props.theme.palette.text.secondary};
`

export default HealthscoreBar
