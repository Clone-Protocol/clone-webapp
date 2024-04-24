import { Box, Button, Stack, Typography } from '@mui/material'
import { styled } from '@mui/material/styles'
import Image from 'next/image'
import LogosClone from 'public/images/staking/logos-clone-mini.svg'

const Stake = () => {

  return (
    <Wrapper>
      <Stack direction='row' alignItems='center' gap={1} mb='15px'>
        <Image src={LogosClone} alt='logos' />
        <Typography variant='p_xlg'>CLN</Typography>
      </Stack>
      <StakeBox mb='20px'>
        <Typography variant='p_lg' color='#8988a3'>Your CLN</Typography>
        <Typography variant='h3' fontWeight={500} color='#fff'>15,000.34</Typography>
      </StakeBox>
      <Stack direction='row' alignItems='center' gap={1}>
        <DepositButton><Typography variant='p'>Deposit</Typography></DepositButton>
        <WithdrawButton><Typography variant='p' color='#8988a3'>Withdraw</Typography></WithdrawButton>
      </Stack>
    </Wrapper>
  )
}

const Wrapper = styled(Box)`
  width: 271px;
  height: 247px;
  padding: 25px 23px;
  border-radius: 10px;
  background: ${(props) => props.theme.basis.backInBlack};
`
const StakeBox = styled(Box)`
  width: 225px;
  height: 100px;
  border-radius: 10px;
  padding: 10px 28px;
  line-height: 40px;
  background-color: ${(props) => props.theme.basis.nobleBlack};
`
const DepositButton = styled(Button)`
  width: 88px;
  height: 37px;
  border-radius: 10px;
  background-image: linear-gradient(108deg, #b5fdf9 2%, #c4b5fd 93%);
  &:hover {
    opacity: 0.8;
  }
`
const WithdrawButton = styled(Button)`
  width: 88px;
  height: 37px;
  border-radius: 10px;
  background: transparent;
  &:hover {
    background: transparent;
    opacity: 0.8;
  }
`

export default Stake