import { LoadingProgress } from "~/components/Common/Loading"
import withSuspense from "~/hocs/withSuspense"
import { styled } from '@mui/material/styles'
import { Box, Stack, Theme, useMediaQuery } from "@mui/material"
import Stake from "./Stake"
import MyLevel from "./MyLevel"
import BenefitLevels from "./BenefitLevels"
import { useState } from "react"


const StakingWrapper = () => {
  const isMobileOnSize = useMediaQuery((theme: Theme) => theme.breakpoints.down('md'))
  const [currLevel, setCurrLevel] = useState(3)

  return (
    <Wrapper>
      <Stack direction={isMobileOnSize ? 'column' : 'row'} justifyContent='center' alignItems={isMobileOnSize ? 'center' : 'flex-start'} gap='25px' mb='25px'>
        <Stake />
        <MyLevel currLevel={currLevel} />
      </Stack>
      <BenefitLevels currLevel={currLevel} />
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