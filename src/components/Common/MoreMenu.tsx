import { Typography, Box, Stack, Divider } from '@mui/material'
import { styled } from '@mui/material/styles'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import Image from 'next/image'
import HomeIcon from 'public/images/more/home.svg'
import TwitterIcon from 'public/images/more/twitter.svg'
import DiscordIcon from 'public/images/more/discord.svg'
import HomeHoverIcon from 'public/images/more/home-hover.svg'
import TwitterHoverIcon from 'public/images/more/twitter-hover.svg'
import DiscordHoverIcon from 'public/images/more/discord-hover.svg'
import ShareLinkIcon from 'public/images/more/call-made.svg'
import { useState } from 'react'
import { CAREER_URL, DISCORD_URL, DOCS_URL, LIQUIDITY_APP, OFFICIAL_WEB, TWITTER_URL, AUDIT_URL, TERMS_URL } from '~/data/social'
import { IS_DEV } from '~/data/networks'
import { NETWORK_NAME } from '~/utils/constants'
// import { NETWORK_NAME } from '~/utils/constants'

interface Props {
  anchorEl: null | HTMLElement
  onShowTokenFaucet: () => void
  onClose?: () => void
}

const MenuIcon = ({ srcImage, hoverImage, alt }: { srcImage: string, hoverImage: string, alt: string }) => {
  const [isHovering, setIsHovering] = useState(false)

  return <Box sx={{ cursor: 'pointer' }}><Image src={isHovering ? hoverImage : srcImage} alt={alt} onMouseEnter={() => setIsHovering(true)} onMouseLeave={() => setIsHovering(false)} /></Box>
}
const MoreMenu: React.FC<Props> = ({ anchorEl, onShowTokenFaucet, onClose }) => {
  const open = Boolean(anchorEl);

  return <Menu
    anchorEl={anchorEl}
    id="account-menu"
    open={open}
    onClose={onClose}
    onClick={onClose}
    transitionDuration={0}
    PaperProps={{
      elevation: 0,
      sx: {
        overflow: 'visible',
        mt: 1.5,
        transition: 'none',
        transitionDuration: 0,
        background: '#080018',
        color: '#fff',
        border: '1px solid #414166',
        borderRadius: '10px'
      },
    }}
    MenuListProps={{ sx: { pt: 0, pb: '15px' } }}
    transformOrigin={{ horizontal: 'right', vertical: 'top' }}
    anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
  >
    {IS_DEV &&
      <StyledMenuItem onClick={onShowTokenFaucet}>
        <HoverStack direction='row' alignItems='center'>
          <Box width='184px'>
            <Box><Typography variant='p'>Token Faucet</Typography></Box>
            <Box><Typography variant='p_sm' color='#8988a3'>Get started on Solana {NETWORK_NAME}</Typography></Box>
          </Box>
        </HoverStack>
      </StyledMenuItem>
    }
    <a href={DOCS_URL} target='_blank' rel="noreferrer">
      <StyledMenuItem>
        <HoverStack direction='row' alignItems='center'>
          <Box width='184px'>
            <Stack direction='row' justifyContent='space-between' alignItems='center'><Typography variant='p'>Docs</Typography></Stack>
            <Box><Typography variant='p_sm' color='#989898'>Learn more about Clone Protocol</Typography></Box>
          </Box>
        </HoverStack>
      </StyledMenuItem>
    </a>
    <a href={LIQUIDITY_APP} target='_blank' rel="noreferrer">
      <StyledMenuItem>
        <HoverStack direction='row' alignItems='center'>
          <Box width='184px'>
            <Stack direction='row' justifyContent='space-between' alignItems='center'><Typography variant='p'>{IS_DEV && 'Devnet'} Clone Liquidity</Typography></Stack>
            <Box><Typography variant='p_sm' color='#989898'>Provide liquidity on Clone using comets</Typography></Box>
          </Box>
        </HoverStack>
      </StyledMenuItem>
    </a>
    <a href={CAREER_URL} target='_blank' rel="noreferrer">
      <StyledMenuItem>
        <HoverStack direction='row' alignItems='center'>
          <Box width='184px'>
            <Stack direction='row' justifyContent='space-between' alignItems='center'><Typography variant='p'>Opportunities</Typography></Stack>
            <Box><Typography variant='p_sm' color='#989898'>Wanna be a pioneer of DeFi?</Typography></Box>
          </Box>
        </HoverStack>
      </StyledMenuItem>
    </a>
    <StyledDivider />
    <a href={AUDIT_URL} target='_blank' rel="noreferrer">
      <LinkStack direction='row' alignItems='center' gap={1}>
        <Typography variant='p_sm'>Audit Report</Typography>
        <Image src={ShareLinkIcon} alt='audit' />
      </LinkStack>
    </a>
    <a href={TERMS_URL} target='_blank' rel="noreferrer">
      <LinkStack direction='row' alignItems='center' gap={1}>
        <Typography variant='p_sm'>Terms of Use</Typography>
        <Image src={ShareLinkIcon} alt='audit' />
      </LinkStack>
    </a>
    <Stack direction='row' gap={2} justifyContent='center' mt='15px'>
      <a href={OFFICIAL_WEB} target="_blank" rel="noreferrer"><MenuIcon srcImage={HomeIcon} hoverImage={HomeHoverIcon} alt="home" /></a>
      <a href={TWITTER_URL} target="_blank" rel="noreferrer"><MenuIcon srcImage={TwitterIcon} hoverImage={TwitterHoverIcon} alt="twitter" /></a>
      <a href={DISCORD_URL} target="_blank" rel="noreferrer"><MenuIcon srcImage={DiscordIcon} hoverImage={DiscordHoverIcon} alt="discord" /></a>
    </Stack>
  </Menu>
}

const StyledMenuItem = styled(MenuItem)`
  display: flex;
  width: 220px;
  height: 50px;
  line-height: 12px;
  color: #fff;
  padding: 0 !important;
`
const HoverStack = styled(Stack)`
  width: 100%;
  height: 100%;
  padding: 6px 20px;
  &:hover {
    background-color: rgba(255, 255, 255, 0.1);
  }
`
const StyledDivider = styled(Divider)`
  background-color: rgba(255, 255, 255, 0.1);
  width: 192px;
  height: 1px;
  margin: 0 auto;
`
const LinkStack = styled(Stack)`
  width: 194px;
  height: 24px;
  color: #989898;
  margin-top: 8px;
  margin-left: 11px;
  padding: 6px 9px;
  border-radius: 5px;
  &:hover {
    background-color: rgba(255, 255, 255, 0.1);
  }
`

export default MoreMenu;