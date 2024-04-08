import Slider from '@mui/material/Slider'
import { Box, Typography } from '@mui/material'
import { styled } from '@mui/material/styles'

interface Props {
  percent: number
}

const PercentSlider: React.FC<Props> = ({ percent }) => {

  const CustomSlider = styled(Slider)(({ theme }) => ({
    color: '#0038ff',
    width: 190,
    height: 4,
    '& .MuiSlider-track': {
      height: 8,
      border: 0,
      background: '#fff',
    },
    '& .MuiSlider-rail': {
      color: theme.palette.mode === 'dark' ? '#2c2c2c' : '#2c2c2c',
      opacity: theme.palette.mode === 'dark' ? undefined : 1,
      height: 8,
    },
    '& .MuiSlider-thumb[data-index="0"]': {
      display: 'none'
    }
  }))

  return (
    <Box lineHeight={0.4}>
      <CustomSlider
        min={0}
        max={100}
        step={1}
        disableSwap
        valueLabelDisplay="off"
        value={percent}
      />
      <Box><Typography variant='p_lg'>{percent.toFixed(2)}%</Typography></Box>
    </Box>
  )
}

export default PercentSlider