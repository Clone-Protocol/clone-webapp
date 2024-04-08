import React from 'react'
import { Box, Dialog, DialogContent, Typography, Stack } from '@mui/material'
import { styled } from '@mui/material/styles'
import { FadeTransition } from '~/components/Common/Dialog'
import Image from 'next/image'
import OctagonIcon from 'public/images/alert-octagon-outline.svg'
import HomeIcon from 'public/images/mobile/home.svg'
import TwitterIcon from 'public/images/mobile/twitter.svg'
import DiscordIcon from 'public/images/mobile/discord.svg'
import { DISCORD_URL, OFFICIAL_WEB, TWITTER_URL } from '~/data/social'

const MobileWarningDialog = ({ open, handleClose }: { open: boolean, handleClose: () => void }) => {
  return (
    <>
      <Dialog open={open} TransitionComponent={FadeTransition}>
        <DialogContent sx={{ backgroundColor: '#040414', width: '324px', padding: '15px', border: '1px solid #414166', borderRadius: '15px' }}>
          <BoxWrapper>
            <Image src={OctagonIcon} width={55} height={55} alt='octagon' />

            <Box maxWidth='270px' lineHeight={1} margin='0 auto' mt='15px'><Typography variant='p_lg'>Unleash the power of Clone Markets web app from larger screen</Typography></Box>
            <Box width='251px' lineHeight={1} margin='0 auto' mt='15px' textAlign='center'>
              <Typography variant='p' color='#989898'>
                Clone Markets web app is not yet optimized for smaller screens. For most optimal experience, please enlarge your screen or visit us from a device with a larger screen.
              </Typography>
            </Box>
            <ProceedButton onClick={handleClose}>
              <Typography variant='p'>Proceed Anyways</Typography>
            </ProceedButton>
            <Stack direction='row' justifyContent='center' gap={2} mt='30px'>
              <a href={OFFICIAL_WEB} target="_blank" rel="noreferrer"><Image src={HomeIcon} alt='home' /></a>
              <a href={TWITTER_URL} target="_blank" rel="noreferrer"><Image src={TwitterIcon} alt='twitter' /></a>
              <a href={DISCORD_URL} target="_blank" rel="noreferrer"><Image src={DiscordIcon} alt='discord' /></a>
            </Stack>
          </BoxWrapper>
        </DialogContent>
      </Dialog>
    </>
  )
}


const BoxWrapper = styled(Box)`
  padding: 20px; 
  color: #fff; 
  width: 100%;
  text-align: center;
  overflow: hidden;
`
const ProceedButton = styled(Box)`
  cursor: pointer;
  margin: 20px 0px;
  color: ${(props) => props.theme.basis.melrose};
  text-decoration: underline;
  &:hover {
    color: ${(props) => props.theme.basis.lightSlateBlue};
  }
`

export default MobileWarningDialog

