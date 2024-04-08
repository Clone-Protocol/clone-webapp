import React, { useState } from 'react'
import { Box, Button, Stack, Typography, Dialog, CircularProgress } from '@mui/material'
import { styled } from '@mui/material/styles'
import { CloseButton } from '../Common/CommonButtons'
import OtpInput from 'react-otp-input';
import { FadeTransition } from '../Common/Dialog';
import { fetchLinkReferralCode } from '~/utils/fetch_netlify';
import { useWallet } from '@solana/wallet-adapter-react';
import useLocalStorage from '~/hooks/useLocalStorage'
import { IS_COMPLETE_INIT_REFER } from '~/data/localstorage';
// import RocketPromoteIcon from 'public/images/points-rocket.svg'
// import Image from 'next/image'

const ReferralCodePutDialog = ({ open, handleClose }: { open: boolean, handleClose: () => void }) => {
  const { publicKey, disconnect } = useWallet()
  const [referralCode, setReferralCode] = useState('')
  const [showReferral, setShowReferral] = useState(false)
  const [doneReferral, setDoneReferral] = useState(false)
  const [isLinkingRefCode, setIsLinkingRefCode] = useState(false)
  const [showInvalidCode, setShowInvalidCode] = useState(false)
  const [_, setIsCompleteInitRefer] = useLocalStorage(IS_COMPLETE_INIT_REFER, false)

  const linkReferralCode = async () => {
    if (publicKey && referralCode) {

      setIsLinkingRefCode(true)
      setShowInvalidCode(false)
      try {
        const res = await fetchLinkReferralCode(publicKey.toString(), parseInt(referralCode).toString())
        const { status } = res
        //// 0 - referral successful or // 2 - already used a referral code, 
        if (status === 0 || status === 2) {
          setDoneReferral(true)
          setIsCompleteInitRefer(true)

          setTimeout(() => {
            handleClose()
          }, 1200)
        } else {
          setShowInvalidCode(true)
        }
        console.log('s', status)
      } catch (e) {
        console.error('e', e)
        setShowInvalidCode(true)
      } finally {
        setIsLinkingRefCode(false)
      }
    }
  }

  const clickNo = async () => {
    setIsCompleteInitRefer(true)
    handleClose()
  }

  const closeDialog = async () => {
    setShowReferral(false)
    handleClose()
    disconnect()
  }

  return (
    <Dialog open={open} TransitionComponent={FadeTransition}>
      <BoxWrapper sx={{ width: { xs: '100%', md: '290px' }, paddingTop: { xs: '30px', md: '20px' } }}>
        {!showReferral ?
          <Box>
            <Box><Typography variant='p_xlg' color='#c4b5fd'>Welcome to Clone!</Typography></Box>
            <Box my='20px'><Typography variant='p'>Before you go, did anyone refer you?</Typography></Box>

            <Stack direction='row' justifyContent='center' gap={1}>
              <YesButton onClick={() => setShowReferral(true)}><Typography variant='p'>Yes</Typography></YesButton>
              <NoButton onClick={clickNo}><Typography variant='p'>No</Typography></NoButton>
            </Stack>
          </Box>
          :
          <Box height='100%' display='flex' flexDirection='column' justifyContent='center' alignItems='center'>
            {!doneReferral ?
              <Box display='flex' flexDirection='column' justifyContent='center' alignItems='center'>
                <Box mb='16px'><Typography variant='p'>Enter their referral code:</Typography></Box>
                <Stack direction='row' gap={1}>
                  <OtpBox>
                    {isLinkingRefCode ?
                      <Box display='flex' justifyContent='center' alignItems='center' height='100%'>
                        <Box sx={{ width: '32px', height: '30px', display: 'flex', justifyContent: 'center', alignItems: 'center', backgroundColor: '#1c1c1c', borderRadius: '10px' }}><CircularProgress sx={{ color: '#c4b5fd' }} size={15} thickness={4} /></Box>
                      </Box>
                      :
                      <OtpInput
                        value={referralCode}
                        onChange={setReferralCode}
                        numInputs={6}
                        renderSeparator={<span style={{ width: '4px' }}></span>}
                        renderInput={(props) => <CustomOtpInputComp {...props} type='number' placeholder='_' />}
                      />
                    }
                  </OtpBox>
                  {referralCode.length === 6 && <YesButton onClick={() => linkReferralCode()}><Typography variant='p'>Save</Typography></YesButton>}
                </Stack>

                {showInvalidCode && <Box><Typography variant='p_sm' color='#ff8d4e'>Invalid code</Typography></Box>}
              </Box>
              :
              <Box><Typography variant='p_xlg' color='#c4b5fd'>Enjoy Clone!</Typography></Box>
            }
          </Box>
        }
        <Box sx={{ position: 'absolute', right: '10px', top: '10px' }}>
          <CloseButton handleClose={closeDialog} />
        </Box>
      </BoxWrapper>
    </Dialog>
  )
}


const BoxWrapper = styled(Box)`
  height: 203px;
  position: relative;
  color: #fff; 
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 12px;
  text-align: center;
  border-radius: 10px;
  background-color: #080018;
  padding: 20px;
  z-index: 99999;
`
const YesButton = styled(Box)`
  width: 49px;
  height: 33px;
  display: flex;
  align-items: center;
  justify-content: center;
  color:#000;
  cursor: pointer;
  border-radius: 10px;
  background-color: #c4b5fd;
  &:hover {
    background-color: #8070ad;
  }
`
const NoButton = styled(Box)`
  width: 49px ;
  height: 33px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color:#000;
  border-radius: 10px;
  background-color: rgba(98, 98, 98, 0.15);
  color: rgba(255, 255, 255, 0.6);
  &:hover {
    background-color: rgba(255, 255, 255, 0.1);
    color: #fff;
  }
`
const OtpBox = styled(Box)`
  display: flex;
  justify-content: center;
  border: solid 1px #8070ad;
  border-radius: 10px;
  padding: 5px;
  width: 136px;
  height: 33px;
`
const CustomOtpInputComp = styled('input')`
  background-color: transparent;
  border: none;
  caret-color: transparent;
  outline: none;
  height: 100%;
  text-align: center;
  font-size: 16px;
  font-weight: 500;
  color: #fff;
`

export default ReferralCodePutDialog

