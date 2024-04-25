import { LoadingProgress } from "~/components/Common/Loading"
import withSuspense from "~/hocs/withSuspense"
import { styled } from '@mui/material/styles'
import { Box, Stack } from "@mui/material"
import Stake from "./Stake"
import MyLevel from "./MyLevel"
import BenefitLevels from "./BenefitLevels"


const StakingWrapper = () => {


  return (
    <Wrapper>
      <Stack direction='row' gap={2} mb='25px'>
        <Stake />
        <MyLevel />
      </Stack>
      <BenefitLevels />
    </Wrapper>
  )
}

const Wrapper = styled(Box)`
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 22px 28px;
`

export default withSuspense(StakingWrapper, <LoadingProgress />)