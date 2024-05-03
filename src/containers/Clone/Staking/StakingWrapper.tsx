import { LoadingProgress } from "~/components/Common/Loading"
import withSuspense from "~/hocs/withSuspense"
import { styled } from '@mui/material/styles'
import { Box, Stack, Theme, useMediaQuery } from "@mui/material"
import Stake from "./Stake"
import MyLevel from "./MyLevel"
import BenefitLevels from "./BenefitLevels"
import { useCurrentLevelQuery } from "~/features/Staking/StakingInfo.query"
import { useWallet } from "@solana/wallet-adapter-react"


const StakingWrapper = () => {
  const isMobileOnSize = useMediaQuery((theme: Theme) => theme.breakpoints.down('md'))
  // const [currLevel, setCurrLevel] = useState(3)
  const { publicKey } = useWallet()

  const { data: levelData, refetch } = useCurrentLevelQuery({
    userPubKey: publicKey,
    refetchOnMount: "always",
    enabled: publicKey != null
  })

  return (
    <Wrapper>
      <Stack direction={isMobileOnSize ? 'column' : 'row'} justifyContent='center' alignItems={isMobileOnSize ? 'center' : 'flex-start'} gap='25px' mb='25px'>
        <Stake />
        <MyLevel levelData={levelData} />
      </Stack>
      <BenefitLevels levelData={levelData} />
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