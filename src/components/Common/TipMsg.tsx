import Slide from '@mui/material/Slide';
import { styled, Box } from '@mui/material'

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
	text-align: center;
	background-color: ${(props) => props.theme.basis.darkNavy};
	color: rgba(255, 255, 255, 0.8);
	border-radius: 5px;
	height: 38px;
	&:hover {
    background-color: ${(props) => props.theme.basis.jurassicGrey};
  }
`

export default TipMsg
