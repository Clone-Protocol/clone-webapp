import { Box, Button, Stack, Theme, Typography, useMediaQuery } from '@mui/material'
import { styled } from '@mui/material/styles'
import Image from 'next/image'
import LogosClone from 'public/images/staking/logos-clone-mini.svg'
import { useWallet } from '@solana/wallet-adapter-react'

const Stake = () => {
  const isMobileOnSize = useMediaQuery((theme: Theme) => theme.breakpoints.down('md'))
  const { publicKey } = useWallet()

  return (
    <Wrapper width={isMobileOnSize ? '100%' : '271px'} height={publicKey ? '247px' : '200px'} padding={isMobileOnSize ? '25px 33px' : '25px 23px'}>
      <Stack direction='row' alignItems='center' gap={1} mb='15px'>
        <Image src={LogosClone} alt='logos' />
        <Typography variant='p_xlg'>CLN</Typography>
      </Stack>
      <StakeBox width={isMobileOnSize ? '100%' : '225px'}>
        <Typography variant='p_lg' color='#8988a3'>Your CLN</Typography>
        {publicKey ?
          <Typography variant='h3' fontWeight={500} color='#fff'>15,000.34</Typography>
          :
          <Typography variant='h3' fontWeight={500} color='#8988a3'>-</Typography>
        }
      </StakeBox>
      {publicKey &&
        <Stack direction='row' alignItems='center' gap={1} mt='20px'>
          <DepositButton><Typography variant='p'>Deposit</Typography></DepositButton>
          <WithdrawButton><Typography variant='p' color='#8988a3'>Withdraw</Typography></WithdrawButton>
        </Stack>
      }
    </Wrapper>
  )
}

const Wrapper = styled(Box)`
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 25px 23px;
  border-radius: 10px;
  background: ${(props) => props.theme.basis.backInBlack};
`
const StakeBox = styled(Box)`
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