import React from 'react'
import { Box, styled, Typography, Button, Dialog } from '@mui/material'
import { CreateAccountDialogStates, NETWORK_NAME } from '~/utils/constants'
import { CloseButton } from '../Common/CommonButtons'
import { useAtomValue } from 'jotai'
import { isCreatingAccountState } from '~/features/globalAtom'
import { LoadingButton } from '../Common/Loading'
import { useWallet } from '@solana/wallet-adapter-react'


interface CreateAccountSetupScreenProps {
  state: CreateAccountDialogStates
  handleCreateAccount: () => void
  handleClose: () => void
}
const CreateAccountSetupDialog: React.FC<CreateAccountSetupScreenProps> = ({
  state,
  handleCreateAccount,
  handleClose
}) => {
  const { connected } = useWallet()
  const isCreatingAccount = useAtomValue(isCreatingAccountState)

  const shouldDialogOpen = (): boolean => {
    return connected && (state === CreateAccountDialogStates.Initial || state === CreateAccountDialogStates.Reminder)
  }

  return (
    <Dialog open={shouldDialogOpen()} maxWidth={474} sx={{ boxShadow: 'none' }}>
      <Box width='474px' sx={{ backgroundColor: '#000916', borderRadius: '10px', position: 'relative', padding: '25px' }}>
        <BoxWrapper>
          <TextHead>Welcome! Lets get you started.</TextHead>
          <Box mt='15px' display='flex' justifyContent='center'>
            <div style={{ width: '360px', overflow: 'hidden', borderRadius: '10px' }}>
              <video id="video" autoPlay loop muted width='360px'>
                <source src="/videos/clone_liquidity.mp4" type="video/mp4" />
                <source src="/videos/clone_liquidity.ogv" type="video/ogg" />
              </video>
            </div>
          </Box>
          <TxtBox my='20px' lineHeight={1}>
            <Typography variant='p'>Open your Clone Liquidity account on Solana Network by pressing the button below. A wallet popup will appear, requesting a transaction. Note that Solana Network requires a one-time fee of </Typography><Typography variant='p' color='#4fe5ff'>~0.07 SOL</Typography><Typography variant='p'> for the best experience with Clone Liquidity. The fee is paid to Solana Network, not Clone Protocol.</Typography>
          </TxtBox>
          {isCreatingAccount ?
            <Box display='flex' justifyContent='center' my='10px'>
              <LoadingButton width='206px' height='42px' buttonTxt='Creating Account...' />
            </Box>
            :
            <EnterButton onClick={handleCreateAccount} disabled={isCreatingAccount}><Typography variant='p_lg'>Open {NETWORK_NAME} Account</Typography></EnterButton>
          }
        </BoxWrapper>
        <Box sx={{ position: 'absolute', right: '10px', top: '10px' }}>
          <CloseButton handleClose={handleClose} />
        </Box>
      </Box>
    </Dialog>
  )
}

const BoxWrapper = styled(Box)`
  width: 402px;
  color: #fff;
  margin: 0 auto;
`
const TextHead = styled(Box)`
  font-size: 20px;
  font-weight: 600;
  text-align: center;
  margin-top: 10px;
  color: ${(props) => props.theme.basis.skylight};
`
const TxtBox = styled(Box)`
  background-color: rgba(255, 255, 255, 0.05);
  padding: 10px;
  border-radius: 10px;
  color: rgba(255, 255, 255, 0.8);
`
const EnterButton = styled(Button)`
  width: 206px;
  height: 42px;
  color: #000;
  display: flex;
  justify-content: center;
  margin: 0 auto;
  margin-top: 10px;
  margin-bottom: 10px;
  background: ${(props) => props.theme.basis.liquidityBlue};
  &:hover {
    background: ${(props) => props.theme.basis.gloomyBlue};
  }
`

export default CreateAccountSetupDialog

