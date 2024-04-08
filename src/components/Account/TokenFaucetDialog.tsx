import { Box, Dialog, DialogContent, Stack, Typography } from '@mui/material'
import { styled } from '@mui/material/styles'
import { FadeTransition } from '~/components/Common/Dialog'
import Image from 'next/image'
import ConnectWalletIcon from 'public/images/icons-connect-wallet.svg'
import WalletIcon from 'public/images/wallet-icon.svg'
import ArrowOutwardIcon from 'public/images/arrow-outward-icon.svg'
import infoOutlineIcon from 'public/images/info-outline.svg'
import { CloseButton } from '../Common/CommonButtons'
import { NETWORK_NAME, ON_USD_NAME } from '~/utils/constants'

const TokenFaucetDialog = ({ open, isConnect, connectWallet, onGetUsdiClick, onHide }: { open: boolean, isConnect: boolean, connectWallet: () => void, onGetUsdiClick: () => void, onHide: () => void }) => {

  return (
    <>
      <Dialog open={open} onClose={onHide} TransitionComponent={FadeTransition}>
        <DialogContent sx={{ backgroundColor: '#080018', border: '1px solid #414166', borderRadius: '20px', maxWidth: '375px', padding: '15px' }}>
          <BoxWrapper>
            <Box mb="21px"><Typography variant='h3' fontWeight={500}>{NETWORK_NAME} Token Faucet</Typography></Box>
            <a href="https://faucet.solana.com/" target="_blank" rel="noreferrer">
              <LinkBox>
                <Stack direction='row' justifyContent='space-between' alignItems='center' width='100%'>
                  <Stack direction='row' spacing={2} alignItems='center'>
                    <Image src={'/images/assets/on-sol.svg'} width={27} height={27} alt='sol' />
                    <Typography variant='p_lg'>{NETWORK_NAME} SOL</Typography>
                  </Stack>
                  <Image src={ArrowOutwardIcon} alt='arrowOut' />
                </Stack>
              </LinkBox>
            </a>
            <LinkBox my="12px" onClick={onGetUsdiClick}>
              <Stack direction='row' justifyContent='space-between' alignItems='center' width='100%'>
                <Stack direction='row' spacing={2} alignItems='center'>
                  <Image src={'/images/assets/on-usd.svg'} width={27} height={27} alt='usd' />
                  <Typography variant='p_lg' color={isConnect ? '#fff' : '#8988a3'}>{ON_USD_NAME} ($100)</Typography>
                </Stack>
                <Box>
                  {
                    isConnect ? (
                      <Stack direction='row' alignItems='center'>
                        <Image src={WalletIcon} alt="wallet" />
                      </Stack>
                    ) : (
                      <Stack direction='row' alignItems='center' onClick={connectWallet} sx={{ cursor: 'pointer' }}>
                        <Image src={ConnectWalletIcon} alt="wallet" />
                        <Box width='44px' lineHeight={0.7} ml='5px'><Typography variant='p_sm' color='#fffc72'>Connect Wallet</Typography></Box>
                      </Stack>
                    )
                  }
                </Box>
              </Stack>
            </LinkBox>
            <InfoBox mb="12px">
              <Image src={infoOutlineIcon} alt="info" width={18} />
              <Typography variant='p' ml='12px' maxWidth='278px'>
                You need {NETWORK_NAME} SOL in your wallet before you can claim {ON_USD_NAME}.
              </Typography>
            </InfoBox>
            <a href="https://www.alchemy.com/overviews/solana-devnet" target="_blank" rel="noreferrer">
              <InfoSelectableBox sx={{ cursor: 'pointer' }}>
                <Image src={infoOutlineIcon} alt="info" width={18} />
                <Typography variant='p' ml='12px' maxWidth='278px'>
                  The Solana {NETWORK_NAME} is a safe playground for developers, users, and validators to test applications at no risk. Click this box to learn more.
                </Typography>
              </InfoSelectableBox>
            </a>

            <Box sx={{ position: 'absolute', right: '10px', top: '10px' }}>
              <CloseButton handleClose={onHide} />
            </Box>
          </BoxWrapper>
        </DialogContent>
      </Dialog>
    </>
  )
}

const BoxWrapper = styled(Box)`
  color: #fff;
  width: 100%;
  overflow-x: hidden;
`
const LinkBox = styled(Box)`
  display: flex;
  align-items: center; 
  width: 100%;
  height: 54px;
  padding: 10px 20px;
  border-radius: 10px;
  border: solid 1px ${(props) => props.theme.basis.portGore};
  background: ${(props) => props.theme.basis.royalPurple};
  color: #fff;
  cursor: pointer;
  &:hover {
    border-color: ${(props) => props.theme.basis.melrose};
  }
`
const InfoBox = styled(Box)`
  width: 100%;
  display: flex;
  align-items: center;
  padding: 10px 20px;
  line-height: 1.33;
  border-radius: 10px;
  border: solid 1px ${(props) => props.theme.basis.portGore};
  color: ${(props) => props.theme.basis.textRaven};
`
const InfoSelectableBox = styled(InfoBox)`
  &:hover {
    border: solid 1px ${(props) => props.theme.basis.melrose};
  }
`

export default TokenFaucetDialog