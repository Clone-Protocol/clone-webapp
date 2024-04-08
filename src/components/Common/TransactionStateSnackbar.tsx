import React, { useState } from 'react'
import { Box, Stack, Typography, Snackbar, CircularProgress } from '@mui/material'
import { styled } from '@mui/material/styles'
import RetryIcon from 'public/images/icon-retry.svg'
import SuccessIcon from 'public/images/check-mark-icon.svg'
import FailureIcon from 'public/images/failure-mark-icon.svg'
import CloseIcon from 'public/images/close-round.svg'
import SupportDiscordIcon from 'public/images/support-button-discord.svg'
import Image from 'next/image'
import { TransactionState } from '~/hooks/useTransactionState'
import Slide from '@mui/material/Slide';
import 'animate.css'
import { makeStyles } from '@mui/styles'
import { getTxnURL } from '~/data/networks'

const SuccessFailureWrapper = ({ isSuccess, txHash, retry }: { isSuccess: boolean, txHash: string, retry?: () => void }) => {
  const txStatusColor = isSuccess ? '#c4b5fd' : '#ff0084'
  return (<Stack direction='row' alignItems='center'>
    <Box><Image src={isSuccess ? SuccessIcon : FailureIcon} alt='icStatus' /></Box>
    <Box lineHeight={1.2}>
      <Box mt='6px'><Typography variant='p_xlg'>Transaction {isSuccess ? 'complete' : 'failed'}</Typography></Box>
      {!isSuccess && <Box mt='6px'><Typography variant='p' color='#989898'>Something went wrong. Please try again.</Typography></Box>}

      {isSuccess ?
        <Box mt='5px' mb='10px' sx={{ textDecoration: 'underline', color: txStatusColor }}>
          <a href={getTxnURL(txHash)} target='_blank' rel="noreferrer"><Typography variant='p' color={txStatusColor}>{'View Transaction'}</Typography></a>
        </Box>
        :
        <Stack direction='row' alignItems='center' gap={1} my='6px'>
          <FailedStatusBox sx={{ ':hover': { boxShadow: '0 0 0 0.5px #fff' } }} onClick={() => retry && retry()}><Image src={RetryIcon} alt='retry' /> <Typography variant='p' color='#fff'>Retry</Typography></FailedStatusBox>
          <a href="https://discord.gg/BXAeVWdmmD" target='_blank' rel="noreferrer"><FailedStatusBox><Image src={SupportDiscordIcon} alt='discord' /> <Typography variant='p'>Discord</Typography></FailedStatusBox></a>
          <a href="https://status.solana.com/" target='_blank' rel="noreferrer"><FailedStatusBox><Typography variant='p'>Solana Status</Typography></FailedStatusBox></a>
        </Stack>
      }
    </Box>
  </Stack>)
}

const RetryWrapper = ({ retry }: { retry?: () => void }) => {
  return (<Stack direction='row' alignItems='center'>
    <Box><Image src={FailureIcon} alt='icStatus' /></Box>
    <Box lineHeight={1.2}>
      <Box mt='6px'><Typography variant='p_xlg'>Please try again</Typography></Box>
      <Box mt='6px' maxWidth='232px'><Typography variant='p' color='#989898' lineHeight={1}>It seems your transaction has failed due to high congestion on Solana, click below to retry, or consider increasing your prioritization fees in settings.</Typography></Box>
      <Stack direction='row' gap={1} my='6px'>
        <FailedStatusBox sx={{ ':hover': { boxShadow: '0 0 0 0.5px #fff' } }} onClick={() => retry && retry()}><Image src={RetryIcon} alt='retry' /> <Typography variant='p' color='#fff'>Retry</Typography></FailedStatusBox>
        <a href="https://discord.gg/BXAeVWdmmD" target='_blank' rel="noreferrer"><FailedStatusBox><Image src={SupportDiscordIcon} alt='discord' /> <Typography variant='p'>Discord</Typography></FailedStatusBox></a>
        <a href="https://status.solana.com/" target='_blank' rel="noreferrer"><FailedStatusBox><Typography variant='p'>Solana Status</Typography></FailedStatusBox></a>
      </Stack>
    </Box>
  </Stack>)
}

const useCircleStyles = makeStyles(() => ({
  circle: {
    stroke: "url(#linearColors)",
  },
}));

const ConfirmingWrapper = ({ txState = TransactionState.PENDING, txHash, isFocus }: { txState?: TransactionState, txHash: string, isFocus: boolean }) => {
  const classes = useCircleStyles({});
  const [longTimeStatus, setLongTimeStatus] = useState<JSX.Element>()
  const StatusWrap = (<LongTimeStatus><Typography variant='p'>This transaction is taking longer than usual. </Typography></LongTimeStatus>)
  setTimeout(() => {
    setLongTimeStatus(StatusWrap)
  }, 20000)

  return (
    <ConfirmBoxWrapper className={isFocus ? 'animate__animated animate__shakeX' : ''}>
      <Stack direction='row' alignItems='center' spacing={2}>
        <Box display='flex' alignItems='center'>
          <svg width="8" height="6">
            <linearGradient id="linearColors" x1="0" y1="0" x2="1" y2="1">
              <stop offset="25%" stopColor="#c4b5fd" />
              <stop offset="90%" stopColor="rgba(66,0,255, 0.0)" />
            </linearGradient>
          </svg>
          <CircularProgress classes={{ circle: classes.circle }} size='36px' thickness={5} />
        </Box>
        <Box>
          <Box><Typography variant='p_xlg'>{txState === TransactionState.PENDING ? 'Confirming transaction...' : 'Preparing transaction...'}</Typography></Box>
          {txState === TransactionState.PENDING &&
            <Box my='6px' lineHeight={1.1}>
              <Box sx={{ textDecoration: 'underline', color: '#c4b5fd' }}><a href={getTxnURL(txHash)} target='_blank' rel="noreferrer"><Typography variant='p' color='#c4b5fd'>View Transaction</Typography></a></Box>
            </Box>
          }
        </Box>
      </Stack>
      {txState === TransactionState.PENDING && longTimeStatus}
    </ConfirmBoxWrapper >
  )
}

const TransactionStateSnackbar = ({ txState, txHash, retry, open, handleClose }: { txState: TransactionState, txHash: string, retry?: () => void, open: boolean, handleClose: () => void }) => {
  const [isFocusWarning, setIsFocusWarning] = useState(false)
  // console.log('txState', txState)

  const isPending = txState === TransactionState.PENDING
  const hideDuration = isPending ? 60000 : 7000

  return (
    <Box zIndex={999999}>
      {/* {txState === TransactionState.PENDING && <BackLayer onClick={() => setIsFocusWarning(true)} />} */}
      <Slide direction="left" in={true} mountOnEnter unmountOnExit>
        <Snackbar open={open} autoHideDuration={hideDuration} onClose={isPending ? () => { } : handleClose} sx={{ display: 'flex', justifyContent: { xs: 'center', md: 'flex-start' } }}>
          <Box>
            {txState === TransactionState.SUCCESS &&
              <BoxWrapper sx={{ border: '1px solid #c4b5fd' }}>
                <CloseButton onClick={handleClose}><Image src={CloseIcon} alt='close' /></CloseButton>
                <SuccessFailureWrapper isSuccess={true} txHash={txHash} />
              </BoxWrapper>
            }
            {txState === TransactionState.FAIL &&
              <BoxWrapper sx={{ border: '1px solid #ff0084' }}>
                <CloseButton onClick={handleClose}><Image src={CloseIcon} alt='close' /></CloseButton>
                <SuccessFailureWrapper isSuccess={false} txHash={txHash} retry={retry} />
              </BoxWrapper>
            }
            {txState === TransactionState.EXPIRED &&
              <BoxWrapper sx={{ border: '1px solid #ff0084' }}>
                <CloseButton onClick={handleClose}><Image src={CloseIcon} alt='close' /></CloseButton>
                <RetryWrapper retry={retry} />
              </BoxWrapper>
            }
            {isPending &&
              <ConfirmingWrapper txState={txState} txHash={txHash} isFocus={isFocusWarning} />
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

const ConfirmBoxWrapper = styled(Box)`
  width: 330px;
  border-radius: 10px;
  padding: 17px 10px;
  box-shadow: 0 0 32px 4px rgba(167, 108, 242, 0.25);
  border: solid 1px ${(props) => props.theme.basis.lightSlateBlue};
  background: #000;
`
const LongTimeStatus = styled(Box)`
  display: flex;
  align-items: center;
  height: 32px;
  background-color: rgba(255, 141, 78, 0.1);
  border-radius: 5px;
  margin: 0px 10px;
  padding: 12px 18px;
  color: ${(props) => props.theme.palette.warning.main};
  margin-top: 8px;
  line-height: 1;
  a {
    color: ${(props) => props.theme.palette.warning.main};
    text-decoration: underline;
  }
`
export const FailedStatusBox = styled(Box)`
  height: 27px;
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

export default TransactionStateSnackbar

