import React from 'react'
import { Box, Dialog, DialogContent, Typography } from '@mui/material'
import { styled } from '@mui/material/styles'
import { FadeTransition } from '~/components/Common/Dialog'
import { CloseButton } from './CommonButtons'

const GeoblockDialog = ({ open, handleClose }: { open: boolean, handleClose: () => void }) => {
  return (
    <>
      <Dialog open={open} onClose={handleClose} TransitionComponent={FadeTransition} maxWidth={350}>
        <DialogContent sx={{ backgroundColor: '#080018', border: '1px solid #414166', borderRadius: '10px', padding: '15px', width: { xs: '100%', md: '350px' } }}>
          <BoxWrapper>
            <Box mb="21px"><Typography variant='p_xlg' fontWeight={500}>Restricted Territory</Typography></Box>

            <Box width='290px' lineHeight={1} my='20px'>
              <Typography variant='p'>
                You are accessing Clone Markets UI from a restricted territory. Unfortunately, this means you will not be allowed to connect your wallet and use Clone Protocol.
              </Typography>
            </Box>

            <Box><Typography variant='p'>More on </Typography><a href="https://docs.clone.so/legal-and-regulations/terms-of-use" target="_blank" rel="noreferrer"><Typography variant='p' color='#c4b5fd'>Clone Terms of Use.</Typography></a></Box>

            <Box sx={{ position: 'absolute', right: '10px', top: '10px' }}>
              <CloseButton handleClose={handleClose} />
            </Box>
          </BoxWrapper>
        </DialogContent>
      </Dialog>
    </>
  )
}


const BoxWrapper = styled(Box)`
  padding: 10px 15px; 
  color: #fff;
`
export default GeoblockDialog

