import { Box, Typography } from '@mui/material'
import { styled } from '@mui/material/styles'


export const PointTextForBonus = ({ multipleTier }: { multipleTier: number | undefined }) => {
  if (multipleTier === 1.2) {
    return <BoxWrapper><MultiplierBox sx={{ backgroundImage: 'linear-gradient(102deg, #e6dafe 3%, #8649ff 96%)' }}><Typography variant='p_lg' fontWeight={800}>1.2x</Typography></MultiplierBox></BoxWrapper>
  } else if (multipleTier === 1.4) {
    return <BoxWrapper><MultiplierBox sx={{ backgroundImage: 'linear-gradient(102deg, #e6dafe 3%, #49beff 96%)' }}><Typography variant='p_lg' fontWeight={800}>1.4x</Typography></MultiplierBox></BoxWrapper>
  } else if (multipleTier === 1.6) {
    return <BoxWrapper><MultiplierBox sx={{ backgroundImage: 'linear-gradient(102deg, #e6dafe 3%, #49ffb3 96%)' }}><Typography variant='p_lg' fontWeight={800}>1.6x</Typography></MultiplierBox></BoxWrapper>
  } else if (multipleTier === 1.8) {
    return <BoxWrapper><MultiplierBox sx={{ backgroundImage: 'linear-gradient(102deg, #e6dafe 3%, #fbff49 96%)' }}><Typography variant='p_lg' fontWeight={800}>1.8x</Typography></MultiplierBox></BoxWrapper>
  } else if (multipleTier === 2) {
    return <BoxWrapper><MultiplierBox sx={{ backgroundImage: 'linear-gradient(102deg, #e6dafe 3%, #fb49ff 96%)' }}><Typography variant='p_lg' fontWeight={800}>2.0x</Typography></MultiplierBox></BoxWrapper>
  } else if (multipleTier === 2.2) {
    return <BoxWrapper><MultiplierBox sx={{ backgroundImage: 'linear-gradient(102deg, #e6dafe 3%, #ff4949 96%)' }}><Typography variant='p_lg' fontWeight={800}>2.2x</Typography></MultiplierBox></BoxWrapper>
  }
}

const BoxWrapper = styled(Box)`
  width: 42px;
  height: 27px;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  gap: 10px;
  padding: 5px 7px;
  border-radius: 5px;
  background-color: #0f0f0f;
`

const MultiplierBox = styled(Box)`
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
`