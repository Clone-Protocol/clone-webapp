import React from 'react'
import { Box, Button, Dialog, DialogContent, Stack, Typography } from '@mui/material'
import { styled } from '@mui/material/styles'
import { FadeTransition } from '~/components/Common/Dialog'
import { CloseButton } from './CommonButtons'
import { DISCORD_URL, TWITTER_URL } from '~/data/social'
import TwitterIcon from 'public/images/more/icon-twitter-white.svg'
import DiscordIcon from 'public/images/more/icon-discord-white.svg'
import Image from 'next/image'
import { IS_COMPLETE_WHITELISTED } from '~/data/localstorage'
import useLocalStorage from '~/hooks/useLocalStorage'

const WhitelistDialog = ({ open, isWhitelisted, handleClose }: { open: boolean, isWhitelisted: boolean, handleClose: () => void }) => {
  const [_, setIsCompleteWhitelisted] = useLocalStorage(IS_COMPLETE_WHITELISTED, false)

  const enter = () => {
    setIsCompleteWhitelisted(true)
    handleClose && handleClose()
  }

  return (
    <>
      <Dialog open={open} onClose={handleClose} TransitionComponent={FadeTransition} maxWidth={463}>
        <DialogContent sx={{ backgroundColor: '#080018', borderRadius: '10px', padding: '15px', width: { xs: '100%', md: '463px' } }}>
          <BoxWrapper>
            {!isWhitelisted ?
              <>
                <Box mb="21px"><Typography fontSize='24px' fontWeight={600} color='#c4b5fd'>Not a Whitelisted Wallet</Typography></Box>

                <Box lineHeight={1} my='20px'>
                  <Typography variant='p_lg' lineHeight={1.7}>
                    Unfortunately, this wallet is not whitelisted for private mainnet. Please try a different wallet or follow our socials for the latest updates on our public mainnet launch.
                  </Typography>
                </Box>

                <Stack direction='row' justifyContent='center' gap={2} mt='15px' mb='10px'>
                  <a href={TWITTER_URL} target="_blank" rel="noreferrer"><Image src={TwitterIcon} alt='twitter' /></a>
                  <a href={DISCORD_URL} target="_blank" rel="noreferrer"><Image src={DiscordIcon} alt='discord' /></a>
                </Stack>
              </>
              :
              <>
                <Box mb="21px"><Typography fontSize='24px' fontWeight={600} color='#c4b5fd'>Congratulations!</Typography></Box>

                <Box lineHeight={1} my='20px'>
                  <Typography variant='p_lg' lineHeight={1.7}>
                    Your wallet has been whitelisted for private mainnet access.
                  </Typography>
                </Box>

                <EnterButton onClick={() => enter()}><Typography variant='p_xlg'>Enter Private Mainnet</Typography></EnterButton>
              </>
            }

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
  padding: 10px 
  color: #fff;
  text-align: center;
`
const EnterButton = styled(Button)`
  width: 100%;
  height: 52px;
  color: #000;
  margin-top: 10px;
  margin-bottom: 15px;
  border-radius: 10px;
  background: ${(props) => props.theme.basis.melrose};
  &:hover {
    background: ${(props) => props.theme.basis.lightSlateBlue};
  }
`
export default WhitelistDialog

