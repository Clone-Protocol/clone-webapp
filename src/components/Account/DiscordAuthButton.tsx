import { Box, Button, Typography } from '@mui/material';
import { useAtomValue } from 'jotai';
import React from 'react';
import { styled } from '@mui/material/styles'
import { discordUsername } from '~/features/globalAtom';

const DiscordAuthButton = () => {
  const discordUsernameValue = useAtomValue(discordUsername)

  const discordLogin = async () => {
    const url = process.env.NEXT_PUBLIC_DISCORD_OAUTH_URL || '';

    window.location.href = url;
  };

  return !discordUsernameValue ?
    <LinkButton onClick={discordLogin}>
      <Typography variant='p_sm'>Link your Discord account </Typography><Typography variant='p_lg'>+</Typography>
    </LinkButton>
    : <Box><Typography variant='p_sm' color='#c4b5fd'>Signed with Discord</Typography></Box>
};

const LinkButton = styled(Button)`
  display: flex;
  gap: 5px;
  align-items: center;
  border-radius: 5px;
  background-color: rgba(255, 255, 255, 0.07);
  width: 170px;
  height: 24px;
  padding: 6px 15px;
  color: #c4b5fd;
  font-size: 10px;
  &:hover {
    background-color: rgba(255, 255, 255, 0.14);
  }
`

export default DiscordAuthButton;