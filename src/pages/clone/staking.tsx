import { Box } from "@mui/material"
import { styled } from '@mui/material/styles'

const Staking = () => {
  return (
    <StyledSection>
      <Box sx={{ maxWidth: '1270px' }} margin='0 auto'>
        <h2>Staking</h2>
      </Box>
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
