import { Typography, Stack, Box, Button } from '@mui/material'
import { styled } from '@mui/material/styles'
import Image from 'next/image'
import PrimaryIcon from 'public/images/icons-badge.svg'
import { useSetAtom } from 'jotai'
import { mintUSDi } from '~/features/globalAtom'
import { NETWORK_NAME, ON_USD_NAME } from '~/utils/constants'

const GetUSDiBadge: React.FC = () => {
  const setMintUsdi = useSetAtom(mintUSDi)
  return <StyledStack direction='row' justifyContent='center' alignItems='center' spacing={3}>
    <Image src={PrimaryIcon} alt='primary' />
    <Box>
      <Typography variant='p_lg'>Get {ON_USD_NAME} from the {NETWORK_NAME} faucet to start liquidity app experience on {NETWORK_NAME}. On mainnet, you will be using USDC in place of {ON_USD_NAME}.</Typography>
    </Box>
    <GetButton onClick={() => setMintUsdi(true)}><Typography variant='p'>Get {ON_USD_NAME}</Typography></GetButton>
  </StyledStack>
}

const StyledStack = styled(Stack)`
  width: 100%;
  height: 74px;
  color: #fff;
  border-radius: 10px;
  background-color: ${(props) => props.theme.basis.darkNavy};
`

const GetButton = styled(Button)`
  width: 125px;
  height: 39px;
  flex-grow: 0;
  padding: 8px 4px 8px 5px;
  border-radius: 5px;
  color: #fff;
  background-color: ${(props) => props.theme.basis.jurassicGrey};
  border: solid 1px ${(props) => props.theme.basis.jurassicGrey};

  &:hover {
    background: transparent;
		border: solid 1px ${(props) => props.theme.basis.gloomyBlue};
	}
`

export default GetUSDiBadge
