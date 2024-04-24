import { Box, Container } from "@mui/material"
import { styled } from '@mui/material/styles'
import StakingWrapper from "~/containers/Clone/Staking/StakingWrapper"

const Staking = () => {
  return (
    <StyledSection>
      <Container>
        <Box sx={{ paddingX: { xs: '0px', md: '20px' }, paddingTop: '10px' }}>
          <StakingWrapper />
        </Box>
      </Container>
    </StyledSection>
  )
}

export const StyledSection = styled('section')`
  max-width: 1085px;
	margin: 0 auto;
  padding-bottom: 20px;
	${(props) => props.theme.breakpoints.up('md')} {
		padding-top: 110px;
	}
	${(props) => props.theme.breakpoints.down('md')} {
		padding: 110px 0px;
	}
`

export default Staking
