import Slide from '@mui/material/Slide';
import { Box } from '@mui/material'
import { styled } from '@mui/material/styles'

const TipMsg: React.FC = ({ children }: { children?: React.ReactNode }) => {
	return (
		<Slide direction="down" in={true} mountOnEnter unmountOnExit>
			<StyledBox>{children}</StyledBox>
		</Slide>
	)
}

const StyledBox = styled(Box)`
	display: flex;
	justify-content: center;
	align-items: center;
	font-size: 12px;
	font-weight: 500;
	padding-left: 10px;
	padding-right: 10px;
	background-color: ${(props) => props.theme.basis.revolver};
	color: ${(props) => props.theme.basis.melrose};
	border-radius: 10px;
	height: 38px;
	&:hover {
    background-color: ${(props) => props.theme.basis.nobleBlack};
  }
`

export default TipMsg
