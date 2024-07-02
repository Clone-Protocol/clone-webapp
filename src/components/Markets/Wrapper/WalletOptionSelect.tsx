import { Box, Typography, Stack } from '@mui/material'
import { styled } from '@mui/material/styles'
import { LoadingProgress } from '~/components/Common/Loading'
import { useSnackbar } from 'notistack'
import withSuspense from '~/hocs/withSuspense'
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { useDisconnect } from 'wagmi'
import { useWalletEvmDialog } from '~/hooks/useWalletEvmDialog'


const WalletOptionSelect = ({ address, onClose }: { address: string, onClose: () => void }) => {
  const { enqueueSnackbar } = useSnackbar()
  const { setOpen } = useWalletEvmDialog()
  const { disconnect } = useDisconnect()

  const handleChangeWallet = async () => {
    setOpen(true)
    onClose && onClose()
  }

  const handleDisconnect = async () => {
    await disconnect()
    enqueueSnackbar('Wallet disconnected')
    onClose && onClose()
  }

  return <WalletWrapper>
    <CopyToClipboard text={address?.toString()}
      onCopy={() => enqueueSnackbar('Wallet address copied')}>
      <RowBox>
        <Typography variant='p'>Copy address</Typography>
      </RowBox>
    </CopyToClipboard>
    <RowBox onClick={handleChangeWallet}>
      <Typography variant='p'>Change wallet</Typography>
    </RowBox>
    <RowBox onClick={handleDisconnect}>
      <Typography variant='p'>Disconnect</Typography>
    </RowBox>
  </WalletWrapper>
}

export default withSuspense(WalletOptionSelect, <LoadingProgress />)

const WalletWrapper = styled(Stack)`
	width: 129px;
	background-color: #161616;
	border-radius: 5px;
  border: solid 1px #4f4f4f;
	z-index: 99;
`
const RowBox = styled(Box)`
  display: flex;
  align-items: center;
  height: 36px;
  cursor: pointer;
  padding: 10px;
  &:hover {
    background-color: #2a2a2a;
  }
  &:not(:last-child) {
    border-bottom: 1px solid #4f4f4f;
  }
  &:first-child {
    border-top-left-radius: 5px;
    border-top-right-radius: 5px;
  }
  &:last-child {
    border-bottom-left-radius: 5px;
    border-bottom-right-radius: 5px;
  }
`