import { Box, Typography } from '@mui/material'
import { styled } from '@mui/system'

export enum PointMultiplier {
  OneTwo = 0,
  OneFour = 1,
  OneSix = 2,
}

export const PointTextForPyth = ({ pythPointTier }: { pythPointTier: number | undefined }) => {
  if (pythPointTier === PointMultiplier.OneTwo) {
    return <BoxWrapper><MultiplierBox sx={{ backgroundImage: 'linear-gradient(102deg, #e6dafe 3%, #8649ff 96%)' }}><Typography variant='p_lg' fontWeight={800}>1.2x</Typography></MultiplierBox></BoxWrapper>
  } else if (pythPointTier === PointMultiplier.OneFour) {
    return <BoxWrapper><MultiplierBox sx={{ backgroundImage: 'linear-gradient(102deg, #e6dafe 3%, #49beff 96%)' }}><Typography variant='p_lg' fontWeight={800}>1.4x</Typography></MultiplierBox></BoxWrapper>
  } else if (pythPointTier === PointMultiplier.OneSix) {
    return <BoxWrapper><MultiplierBox sx={{ backgroundImage: 'linear-gradient(102deg, #e6dafe 3%, #49ffb3 96%)' }}><Typography variant='p_lg' fontWeight={800}>1.6x</Typography></MultiplierBox></BoxWrapper>
  } else {
    return <></>
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