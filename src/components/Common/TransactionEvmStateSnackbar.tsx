import React, { useState } from 'react'
import { Box, styled, Typography, Snackbar, CircularProgress, Stack } from '@mui/material'
import SuccessIcon from 'public/images/check-mark-icon.svg'
import FailureIcon from 'public/images/failure-mark-icon.svg'
import CloseIcon from 'public/images/close.svg'
import Image from 'next/image'
import { TransactionState } from '~/hooks/useTransactionState'
import Slide from '@mui/material/Slide';
import 'animate.css'
import { makeStyles } from '@mui/styles'

const getTxnURL = (networkScanUrl: string, txnHash: string) => {
  return `${networkScanUrl}/tx/${txnHash}`
}

const SuccessFailureWrapper = ({ isSuccess, txHash, networkName, networkScanUrl }: { isSuccess: boolean, txHash: string, networkName: string, networkScanUrl: string }) => {
  const txStatusColor = isSuccess ? '#4fe5ff' : '#ff0084'
  return (<Stack direction='row' alignItems='center'>
    <Image src={isSuccess ? SuccessIcon : FailureIcon} alt='icStatus' />
    <Box lineHeight={1.2}>
      <StatusBox mt='6px'><Typography variant='p'>{networkName} Network</Typography></StatusBox>
      <Box mt='6px'><Typography variant='p_xlg'>Transaction {isSuccess ? 'complete' : 'failed'}</Typography></Box>
      {!isSuccess && <Box mt='6px'><Typography variant='p' color='#989898'>Something went wrong. Please try again.</Typography></Box>}

      {isSuccess &&
        <Box mt='5px' mb='10px' sx={{ textDecoration: 'underline', color: txStatusColor }}>
          <a href={getTxnURL(networkScanUrl, txHash)} target='_blank' rel="noreferrer"><Typography variant='p' color={txStatusColor}>{'View Transaction'}</Typography></a>
        </Box>
      }
      {!isSuccess &&
        <Stack direction='row' gap={1} my='6px'>
          <a href="https://discord.gg/BXAeVWdmmD" target='_blank' rel="noreferrer"><FailedStatusBox> <Typography variant='p'>Discord</Typography></FailedStatusBox></a>
          <a href={networkScanUrl} target='_blank' rel="noreferrer"><FailedStatusBox> <Typography variant='p'>{networkName} Status</Typography></FailedStatusBox></a>
        </Stack>
      }
    </Box>
  </Stack>)
}

const useCircleStyles = makeStyles(() => ({
  circle: {
    stroke: "url(#linearColors)",
  },
}));


const ConfirmingWrapper = ({ txState = TransactionState.PENDING, txHash, isFocus, networkName, networkScanUrl }: { txState?: TransactionState, txHash: string, isFocus: boolean, networkName: string, networkScanUrl: string }) => {
  const classes = useCircleStyles({});
  const [longTimeStatus, setLongTimeStatus] = useState<JSX.Element>()
  const StatusWrap = (<LongTimeStatus><Typography variant='p'>This transaction is taking unusually long.</Typography></LongTimeStatus>)
  setTimeout(() => {
    setLongTimeStatus(StatusWrap)
  }, 20000)

  return (
    <ConfirmBoxWrapper className={isFocus ? 'animate__animated animate__shakeX' : ''}>
      <Stack direction='row' alignItems='center' spacing={2}>
        <Box display='flex' alignItems='center'>
          <svg width="8" height="6">
            <linearGradient id="linearColors" x1="0" y1="0" x2="1" y2="1">
              <stop offset="25%" stopColor="#6cb8ff" />
              <stop offset="90%" stopColor="rgba(0, 133, 255, 0)" />
            </linearGradient>
          </svg>
          <CircularProgress classes={{ circle: classes.circle }} size={36} thickness={5} />
        </Box>
        <Box>
          <StatusBox><Typography variant='p'>{networkName} Network</Typography></StatusBox>
          <Box><Typography variant='p_xlg'>{txState === TransactionState.PENDING ? 'Confirming transaction...' : 'Preparing transaction...'}</Typography></Box>
          {txState === TransactionState.PENDING &&
            <Box my='6px' lineHeight={1.1}>
              <Box sx={{ textDecoration: 'underline', color: '#4fe5ff' }}><a href={getTxnURL(networkScanUrl, txHash)} target='_blank' rel="noreferrer"><Typography variant='p' color='#4fe5ff'>View Transaction</Typography></a></Box>
            </Box>
          }
        </Box>
      </Stack>
      {txState === TransactionState.PENDING && longTimeStatus}
    </ConfirmBoxWrapper>
  )
}

const TransactionEvmStateSnackbar = ({ txState, txHash, networkName, networkScanUrl, open, handleClose }: { txState: TransactionState, txHash: string, networkName: string, networkScanUrl: string, open: boolean, handleClose: () => void }) => {
  const [isFocusWarning, setIsFocusWarning] = useState(false)

  const isPending = txState === TransactionState.PENDING || txState === TransactionState.PRE_PENDING
  const hideDuration = txState === TransactionState.PENDING ? 60000 : 6000

  return (
    <Box zIndex={999999}>
      {isPending && <BackLayer onClick={() => setIsFocusWarning(true)} />}
      <Slide direction="left" in={true} mountOnEnter unmountOnExit>
        <Snackbar open={open} autoHideDuration={hideDuration} onClose={isPending ? () => { } : handleClose}>
          <Box>
            {txState === TransactionState.SUCCESS &&
              <BoxWrapper sx={{ border: '1px solid #4fe5ff' }}>
                <CloseButton onClick={handleClose}><Image src={CloseIcon} alt='close' /></CloseButton>
                <SuccessFailureWrapper isSuccess={true} txHash={txHash} networkName={networkName} networkScanUrl={networkScanUrl} />
              </BoxWrapper>
            }
            {txState === TransactionState.FAIL &&
              <BoxWrapper sx={{ border: '1px solid #ff0084' }}>
                <CloseButton onClick={handleClose}><Image src={CloseIcon} alt='close' /></CloseButton>
                <SuccessFailureWrapper isSuccess={false} txHash={txHash} networkName={networkName} networkScanUrl={networkScanUrl} />
              </BoxWrapper>
            }
            {isPending &&
              <ConfirmingWrapper txState={txState} txHash={txHash} networkName={networkName} networkScanUrl={networkScanUrl} isFocus={isFocusWarning} />
            }
          </Box>
        </Snackbar>
      </Slide>
    </Box>
  )
}

const BackLayer = styled('div')`
  width: 100%;
  height: 100%;
  position: fixed;
  top: 0;
  left: 0;
  background: transparent;
`

const BoxWrapper = styled(Box)`
  width: 330px;
  display: flex;
  position: relative;
  align-items: center;
  border-radius: 10px;
  padding: 12px 0px;
  background: #000;
`
const CloseButton = styled(Box)`
  position: absolute;
  right: 10px;
  top: 10px;
  cursor: pointer;
`
const StatusBox = styled(Box)`
  width: 165px;
  height: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 5px;
  background-color: ${(props) => props.theme.basis.shadowGloom};
`
const ConfirmBoxWrapper = styled(Box)`
  width: 330px;
  border-radius: 10px;
  padding: 17px 10px;
  background: #000;
  border: 1px solid ${(props) => props.theme.basis.shadowGloom};
`
const LongTimeStatus = styled(Box)`
  display: flex;
  align-items: center;
  height: 32px;
  padding: 12px 18px;
  color: ${(props) => props.theme.basis.warningOrange};
  margin: 0px 10px;
  margin-top: 8px;
  border-radius: 5px;
  background-color: rgba(255, 141, 78, 0.1);
  line-height: 1;
  a {
    color: ${(props) => props.theme.basis.warningOrange};
    text-decoration: underline;
  }
`
export const FailedStatusBox = styled(Box)`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 5px;
  padding: 5px;
  border-radius: 5px;
  background-color: rgba(255, 255, 255, 0.1);
  cursor: pointer;
  font-size: 12px;
  font-weight: 500;
  color: #989898;
  &:hover {
    background-color: rgba(255, 255, 255, 0.15);
  }
`

export default TransactionEvmStateSnackbar

