import { Box, Slider, Stack, Typography, styled } from '@mui/material'
import { formatLocaleAmount } from '~/utils/numbers'

interface Props {
  min?: number
  max?: number
  ratio: number
  currentRatio: number
  disableHandleRatio?: boolean
  onChangeRatio?: (newRatio: number) => void
}

const StyledSlider = styled(Slider)(({ theme }) => ({
  color: '#FFF',
  height: 5,
  marginTop: '13px',
  '& .MuiSlider-thumb': {
    zIndex: 30,
    height: 20,
    width: 20,
    backgroundColor: '#fff',
    border: '3px solid #fff',
    '&:hover': {
      boxShadow: '0 0 0 8px rgba(58, 133, 137, 0.16)',
    },
  },
  '& .MuiSlider-track': {
    zIndex: 10,
    height: 5,
    border: 'none',
    background: 'linear-gradient(to right, #fff 51%, #ff0084 400px)'
  },
  '& .MuiSlider-valueLabel': {
    fontSize: '14px',
    fontWeight: '500',
    width: '58px',
    height: '26px',
    padding: '4px 8px',
    border: 'solid 1px #fff',
    borderRadius: '4px',
    backgroundColor: 'transparent',
    '&:before': { display: 'none' },
  },
  '& .MuiSlider-rail': {
    zIndex: 10,
    color: '#414e66',
    height: 5,
  },
}))

const EditLiquidityRatioSlider: React.FC<Props> = ({ min = 0, max = 100, ratio, currentRatio, disableHandleRatio = false, onChangeRatio }) => {
  const valueLabelFormat = (value: number) => {
    return `${formatLocaleAmount(value, 2)}%`
  }

  const handleChangeMintRatio = (event: Event, newValue: number | number[]) => {
    if (typeof newValue === 'number') {
      onChangeRatio && onChangeRatio(newValue)
    }
  }

  return (
    <Box>
      <Stack direction='row' alignItems='center' justifyContent='center' p='12px'>
        <Box width='100%'>
          <StyledSlider
            sx={{
              '& .MuiSlider-track': {
                background: `linear-gradient(to right, #fff 51%, #ff0084 400px);`
              }
            }}
            value={ratio}
            min={min}
            step={1}
            max={max}
            disabled={disableHandleRatio}
            valueLabelFormat={valueLabelFormat}
            onChange={handleChangeMintRatio}
            valueLabelDisplay="on"
          />
          <PrevBox sx={{ left: `calc(${currentRatio.toFixed(1)}% - 30px)` }}>
            <Pointer>▲</Pointer>
            <FixValueLabel><Typography variant='p_lg'>{formatLocaleAmount(currentRatio, 2)}%</Typography></FixValueLabel>
            <Box mt='-4px'><Typography variant='p' color='#66707e'>Current</Typography></Box>
          </PrevBox>
        </Box>
      </Stack>
    </Box>
  )
}

const PrevBox = styled(Box)`
  position: relative; 
  width: 58px;
  text-align: center;
  top: -20px;
  z-index: 20;
`
const Pointer = styled(Box)`
  color: ${(props) => props.theme.basis.slug};
  height: 17px;
`
const FixValueLabel = styled(Box)`
  width: 100%;
  height: 26px;
  border: solid 1px ${(props) => props.theme.basis.slug};
  border-radius: 4px;
  line-height: 20px;
  color: ${(props) => props.theme.basis.slug};
`
// const FormBox = styled(Box)`
//   height: 63px; 
//   padding: 12px;
// `
// const BottomBox = styled(Box)`
//   height: 30px;
//   text-align: center;
//   border-top: 1px solid ${(props) => props.theme.boxes.blackShade};
// `
// const InputAmount = styled(`input`)`
//   max-width: 100px;
//   margin-left: 10px;
//   text-align: right;
//   border: 0px;
//   background-color: ${(props) => props.theme.boxes.blackShade};
//   font-size: 17.3px;
//   font-weight: 500;
// `
// const MintAmount = styled('div')`
//   font-size: 12px; 
//   font-weight: 500;
//   text-align: right; 
//   color: ${(props) => props.theme.palette.text.secondary}; 
// `
export default EditLiquidityRatioSlider
