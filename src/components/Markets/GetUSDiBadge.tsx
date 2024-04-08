import { Typography, Stack, Box, Button, Theme, useMediaQuery } from '@mui/material'
import { styled } from '@mui/material/styles'
import Image from 'next/image'
import PrimaryIcon from 'public/images/icons-badge.svg'
import { useSetAtom } from 'jotai'
import { mintUSDi } from '~/features/globalAtom'
import { NETWORK_NAME, ON_USD_NAME } from '~/utils/constants'

const GetUSDiBadge: React.FC = () => {
  const setMintUsdi = useSetAtom(mintUSDi)
  const isMobileOnSize = useMediaQuery((theme: Theme) => theme.breakpoints.down('md'))

  return <StyledStack direction={isMobileOnSize ? 'column' : 'row'} justifyContent='center' alignItems='center' spacing={isMobileOnSize ? 1 : 2} textAlign={isMobileOnSize ? 'center' : 'left'}>
    <Box sx={{ display: { xs: 'none', md: 'block' } }}><Image src={PrimaryIcon} alt='primary' /></Box>
    <Box>
      <Typography variant='p_lg'>Get {ON_USD_NAME} from the {NETWORK_NAME} faucet to start trading on {NETWORK_NAME}. On mainnet, you will be able to trade using USDC.</Typography>
    </Box>
    <GetButton onClick={() => setMintUsdi(true)}><Typography variant='p'>Get {ON_USD_NAME}</Typography></GetButton>
  </StyledStack>
}

const StyledStack = styled(Stack)`
  width: 100%;
  padding: 10px 15px;
  // height: 74px;
  color: ${(props) => props.theme.basis.melrose};
  border-radius: 10px;
  background-color: rgba(196, 181, 253, 0.1);
`

const GetButton = styled(Button)`
  width: 125px;
  height: 39px;
  flex-grow: 0;
  padding: 8px 4px 8px 5px;
  border-radius: 100px;
  color: #000;
  background-color: ${(props) => props.theme.basis.melrose};

  &:hover {
		background-color: ${(props) => props.theme.basis.lightSlateBlue};

		// &::before {
		// 	content: "";
		// 	position: absolute;
		// 	top: 0;
		// 	left: 0;
		// 	right: 0;
		// 	bottom: 0;
		// 	border-radius: 100px;
		// 	border: 1px solid transparent;
		// 	background: ${(props) => props.theme.gradients.light} border-box;
		// 	-webkit-mask:
		// 		linear-gradient(#fff 0 0) padding-box, 
		// 		linear-gradient(#fff 0 0);
		// 	-webkit-mask-composite: destination-out;
		// 	mask-composite: exclude;
		// }
	}
`

export default GetUSDiBadge
