import React, { useState } from 'react'
import { Box, Button, Dialog, DialogContent, Stack, Typography } from '@mui/material'
import { styled } from '@mui/material/styles'
import { FadeTransition } from '~/components/Common/Dialog'
import { CloseButton } from '../Common/CommonButtons'
import BridgeIcon from 'public/images/debug-step-over.svg'
import Image from 'next/image'
import PoweredByDebridge from 'public/images/powered_by_debridge.svg'
import DebridgeWidget from './DebridgeWidget'

const BridgeDialog = ({ open, handleClose }: { open: boolean, handleClose: () => void }) => {
  const [isInitStep, setIsInitStep] = useState(true)

  const close = () => {
    setIsInitStep(true)
    handleClose()
  }

  return (
    <>
      <Dialog open={open} onClose={close} TransitionComponent={FadeTransition} sx={{ overflowX: 'hidden' }}>
        <DialogContent sx={{ backgroundColor: '#080018', borderRadius: '10px', paddingY: '15px', paddingX: '0px', height: isInitStep ? '500px' : '540px', overflow: 'hidden', width: { xs: '100%', md: '340px' } }}>
          <BoxWrapper>
            <Box position='absolute' top='0px' width='100%' paddingTop='15px' zIndex={999} sx={{ backgroundColor: '#080018' }}>
              <Stack direction='row' justifyContent='space-between' >
                {isInitStep ?
                  <TitleBox ml='25px' mt='10px'><Typography variant='p_lg'>Bridge</Typography></TitleBox>
                  :
                  <Box></Box>
                }

                <Box mr='15px'>
                  <CloseButton handleClose={close} />
                </Box>
              </Stack>
            </Box>

            {isInitStep ?
              <>
                <Box mt='80px'><Image src={BridgeIcon} alt='icStatus' /></Box>

                <Box lineHeight={1} m='0 auto' my='12px' maxWidth='290px'>
                  <Typography variant='p_lg'>
                    Bridge your funds to Solana and dive into multi-chain trading experience with Clone.
                  </Typography>
                </Box>

                <BridgeButton onClick={() => setIsInitStep(false)}><Typography variant='p_xlg'>Bridge now</Typography></BridgeButton>

                <Box mt='50px'><Image src={PoweredByDebridge} alt='powered_by_pyth' /></Box>
              </>
              :
              <Box mt='10px'>
                <DebridgeWidget />
              </Box>
            }
          </BoxWrapper>
        </DialogContent>
      </Dialog>
    </>
  )
}


const BoxWrapper = styled(Box)`
  padding: 12px 0px; 
  color: #fff;
  text-align: center;
  overflow-x: hidden;
`
const TitleBox = styled(Box)`
  width: 100px;
  height: 36px;
  border-radius: 5px;
  border: solid 1px #c4b5fd;
  display: flex;
  align-items: center;
  justify-content: center;
`
const BridgeButton = styled(Button)`
  width: 213px;
  height: 44px;
  color: #000;
  margin-top: 12px;
  margin-bottom: 15px;
  border-radius: 10px;
  background: ${(props) => props.theme.basis.melrose};
  &:hover {
    background: ${(props) => props.theme.basis.lightSlateBlue};
  }
`
export default BridgeDialog

