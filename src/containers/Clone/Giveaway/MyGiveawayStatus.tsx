import { styled } from '@mui/system'
import { Box, Button, Stack, Theme, Typography, useMediaQuery } from '@mui/material'
import { useWallet } from '@solana/wallet-adapter-react'
import { BlackDefault, OpaqueDefault } from '~/components/Common/OpaqueArea'
import { useWalletDialog } from '~/hooks/useWalletDialog'
import { formatLocaleAmount } from '~/utils/numbers'
import { LoadingProgress } from '~/components/Common/Loading'
import withSuspense from '~/hocs/withSuspense'
import { useGiveawayStatusQuery } from '~/features/Giveaway/GiveawayStatus.query'
import TrophyGold from 'public/images/giveaway/trophy-gold.svg'
import TrophySilver from 'public/images/giveaway/trophy-silver.svg'
import TrophyBronze from 'public/images/giveaway/trophy-bronze.svg'
import Image from 'next/image'

const MyGiveawayStatus = () => {
  const { publicKey } = useWallet()
  const { setOpen } = useWalletDialog()
  const isMobileOnSize = useMediaQuery((theme: Theme) => theme.breakpoints.down('md'))

  const { data: infos } = useGiveawayStatusQuery({
    userPubKey: publicKey,
    refetchOnMount: true,
    enabled: publicKey != null
  })

  return (
    <Wrapper sx={{ alignItems: { xs: 'flex-start', md: 'center' } }}>
      <Stack direction='row' gap='12px' flexWrap={'wrap'} width='100%' justifyContent='center' mt='18px'>
        <BorderBox width={isMobileOnSize ? '100%' : '150px'} height='92px' position='relative'>
          <Box display='flex' justifyContent='center' alignItems='center'>
            <Typography variant='p'>Grand Prize</Typography>
          </Box>
          <StatusValue1>
            <Image src={TrophyGold} alt='TrophyGold' />
            <Typography variant='p_lg'>
              {formatLocaleAmount(200000)} pts
            </Typography>
          </StatusValue1>
        </BorderBox>
        <BorderBox width={isMobileOnSize ? '100%' : '150px'} height='92px' position='relative'>
          <Box display='flex' justifyContent='center' alignItems='center'>
            <Typography variant='p'>Draw #2</Typography>
          </Box>
          <StatusValue2>
            <Image src={TrophySilver} alt='TrophySilver' />
            <Typography variant='p_lg'>
              {formatLocaleAmount(50000)} pts
            </Typography>
          </StatusValue2>
        </BorderBox>
        <BorderBox width={isMobileOnSize ? '100%' : '150px'} height='92px'>
          <Box display='flex' justifyContent='center' alignItems='center'>
            <Typography variant='p'>Draw #3</Typography>
          </Box>
          <StatusValue3>
            <Image src={TrophyBronze} alt='TrophyBronze' />
            <Typography variant='p_lg'>
              {formatLocaleAmount(20000)} pts
            </Typography>
          </StatusValue3>
        </BorderBox>
      </Stack>
      <Stack direction='row' justifyContent='center' width='100%' mt='23px'>
        <BorderBox width={isMobileOnSize ? '100%' : '474px'} height='104px' position='relative'>
          <Box display='flex' justifyContent='center' alignItems='center'>
            <Typography variant='p'>Your Tickets</Typography>
          </Box>
          <StatusValue>
            <Typography variant='p_xlg' fontWeight={500}>
              {infos?.totalTickets ? formatLocaleAmount(infos.totalTickets) : '0'}
            </Typography>
          </StatusValue>
        </BorderBox>
      </Stack>
      {!publicKey && <>
        {isMobileOnSize ? <BlackDefault /> : <OpaqueDefault />}
        <Box position='absolute' top='20px' marginY='55px' left="0px" right="0px" marginX='auto'>
          <Box display='flex' justifyContent='center'>
            <ConnectWallet onClick={() => setOpen(true)}><Typography variant='p_xlg'>Connect Wallet</Typography></ConnectWallet>
          </Box>
        </Box>
      </>}
    </Wrapper>
  )

}

const Wrapper = styled(Box)`
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin-bottom: 22px;
  padding: 0px 28px;
`
const StatusValue = styled(Box)`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 7px;
  margin-top: 17px;
`
const StatusValue1 = styled(StatusValue)`
  background-image: linear-gradient(147deg, #ffc700 5%, #ffe99b 28%, #ffeaa1 65%, #ffd600 89%);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
`
const StatusValue2 = styled(StatusValue)`
  background-image: linear-gradient(150deg, #999 1%, #fff 41%, #cbcbcb 67%, #8d8d8d 93%);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
`
const StatusValue3 = styled(StatusValue)`
  background-image: linear-gradient(150deg, #ff974b -1%, #ffbf85 18%, #ffd4ab 39%, #fff0e2 67%, #ffb571 94%);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
`
const BorderBox = styled(Box)`
  border-radius: 10px;
  border: solid 1px rgba(255, 255, 255, 0.1);
  padding-top: 14px;
  padding-bottom: 22px;
`
const ConnectWallet = styled(Button)`
  width: 236px;
  height: 52px;
  object-fit: contain;
  border-radius: 10px;
  border: solid 1px ${(props) => props.theme.basis.melrose};
  background-color: #000;
  color: #fff;
  &:hover {
    background-color: #000;
    border-color: ${(props) => props.theme.basis.lightSlateBlue}};
  }
`

export default withSuspense(MyGiveawayStatus, <LoadingProgress />)