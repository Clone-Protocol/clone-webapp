import { LoadingProgress } from "~/components/Common/Loading"
import withSuspense from "~/hocs/withSuspense"
import { styled } from '@mui/material/styles'
import { Box, Stack } from "@mui/material"
import Stake from "./Stake"


const StakingWrapper = () => {


  return (
    <Wrapper>
      <Stack direction='row' gap={2}>
        <Stake />
      </Stack>
    </Wrapper>
  )
}

const Wrapper = styled(Box)`
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 12px 28px;
`

export default withSuspense(StakingWrapper, <LoadingProgress />)