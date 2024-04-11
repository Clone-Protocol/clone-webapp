import { styled, Box, Stack, Typography } from '@mui/material'
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import IconAlertComet from 'public/images/alert-comet.svg'
import { useEffect, useState } from 'react';
import Image from 'next/image';
import { RISK_RATIO_VAL } from '~/data/riskfactors';

interface Props {
  score?: number
}

const enum HealthScoreType {
  Fair = 'Fair',
  Excellent = 'Excellent',
  Poor = 'Poor'
}

const enum HealthScoreTypeColor {
  Fair = '#fff',
  Excellent = '#4fe5ff',
  Poor = '#ff0084'
}

const HealthscoreView: React.FC<Props> = ({ score }) => {
  const scorePercent = score ? 100 - score : 0

  const [scoreType, setScoreType] = useState(HealthScoreType.Fair)
  const [scoreTypeColor, setScoreTypeColor] = useState(HealthScoreTypeColor.Fair)

  useEffect(() => {
    if (score) {
      if (score < RISK_RATIO_VAL) {
        setScoreType(HealthScoreType.Poor)
        setScoreTypeColor(HealthScoreTypeColor.Poor)
      } else if (score >= RISK_RATIO_VAL && score < 70) {
        setScoreType(HealthScoreType.Fair)
        setScoreTypeColor(HealthScoreTypeColor.Fair)
      } else {
        setScoreType(HealthScoreType.Excellent)
        setScoreTypeColor(HealthScoreTypeColor.Excellent)
      }
    }
  }, [score])

  return (
    <Box>
      <Stack direction="row" height='56px'>

        {score &&
          <Box sx={{ color: scoreTypeColor }}>
            <Stack direction='row' alignItems='center' gap={1} mt='8px'>
              {scoreType === HealthScoreType.Poor &&
                <Image src={IconAlertComet} alt='alert' width={15} height={14} />
              }
              <Typography variant='h2'>{Math.floor(score)}</Typography>
            </Stack>
          </Box>
        }
        <Box display='flex' height='100%'>
          <PlayArrowIcon sx={{ width: '12px', height: '12px', position: 'relative', top: `calc(${scorePercent}% - 6px)` }} />
          <ScoreBar />
          <Box height='100%'>
            <Box sx={{ position: 'relative', top: '-10px', left: '5px' }}><Typography variant='p_sm'>100 (Excellent)</Typography></Box>
            <Box sx={{ position: 'relative', top: '13px', left: '5px' }}><Typography variant='p_sm'>0 (Poor)</Typography></Box>
          </Box>
        </Box>
      </Stack >
    </Box >
  )
}

const ScoreBar = styled(Box)`
  width: 4px;
  height: 100%;
  background-image: linear-gradient(to top, #ff006b, #4fe5ff);
`

export default HealthscoreView
