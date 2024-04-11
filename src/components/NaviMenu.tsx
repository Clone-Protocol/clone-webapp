import { usePathname } from 'next/navigation'
import { List, ListItemButton, Box, Fade, Typography } from '@mui/material'
import { styled } from '@mui/material/styles'
import Link from 'next/link'
// import { PointsStarIconOff, PointsStarIconOn } from './Common/SvgIcons'
import TrophyIconOff from 'public/images/trophy-off.svg'
import TrophyIconOn from 'public/images/trophy-on.svg'
import PointsStarIconOn from 'public/images/points-stars-on.svg'
import PointsStarIconOff from 'public/images/points-stars-off.svg'
import Image from 'next/image'
import { RouteMarkets } from '~/utils/constants'

const CommonMenu = () => {
  const pathname = usePathname()
  return (
    <List component="nav" sx={{ display: 'flex', padding: 0 }}>
      {/* <Link href="/">
        <StyledListItemButton className={pathname === '/' ? 'selected' : ''}>
          <Typography variant='p_lg'>Home</Typography>
        </StyledListItemButton>
      </Link> */}
      <Link href={RouteMarkets.TRADE_LIST}>
        <StyledListItemButton className={pathname === RouteMarkets.TRADE_LIST || pathname?.startsWith(RouteMarkets.TRADE) ? 'selected' : ''}>
          <Typography variant='p_lg'>Trade</Typography>
        </StyledListItemButton>
      </Link>
      <Link href={RouteMarkets.PORTFOLIO}>
        <StyledListItemButton className={pathname?.startsWith(RouteMarkets.PORTFOLIO) ? 'selected' : ''}>
          <Typography variant='p_lg'>Portfolio</Typography>
        </StyledListItemButton>
      </Link>
      <Link href={RouteMarkets.POINTS}>
        <StyledPointsItemButton className={pathname?.startsWith(RouteMarkets.POINTS) ? 'selected' : ''}>
          <ColoredText className={pathname?.startsWith(RouteMarkets.POINTS) ? 'selected' : ''}><Typography variant="p_lg" mr='3px'>Points</Typography></ColoredText>
          {pathname?.startsWith(RouteMarkets.POINTS) ? <Image src={PointsStarIconOn} alt='points' /> : <Image src={PointsStarIconOff} alt='points' />}
        </StyledPointsItemButton>
      </Link>
      <Link href={RouteMarkets.GIVEAWAY}>
        <StyledGiveawayItemButton className={pathname?.startsWith(RouteMarkets.GIVEAWAY) ? 'selected' : ''}>
          {pathname?.startsWith(RouteMarkets.GIVEAWAY) ? <Image src={TrophyIconOn} alt='giveaway' /> : <Image src={TrophyIconOff} alt='giveaway' />}
        </StyledGiveawayItemButton>
      </Link>
    </List>
  )
}

const NaviMenu = () => {
  return (
    <CommonMenu />
  )
}

export const MobileNaviMenu = () => {
  return (
    <Fade in timeout={1500}>
      <Box display='flex' height='48px' mx='7px' justifyContent='center' bgcolor="#000" borderRadius='20px' border='solid 1px #343441' mb='10px'>
        <CommonMenu />
      </Box>
    </Fade>
  )
}

const StyledListItemButton = styled(ListItemButton)`
  height: 45px;
  margin-left: 8px;
  margin-right: 8px;
  border-radius: 5px;
  color: ${(props) => props.theme.basis.textRaven};
  &:hover {
    border-radius: 5px;
    background-color: rgba(196, 181, 253, 0.1);
  }
  &.selected {
    color: #fff;
    transition: all 0.3s ease 0.2s;
  }
`
const StyledPointsItemButton = styled(StyledListItemButton)`
  &:hover {
    background-color: transparent;
    background-image: linear-gradient(to right, #1c1704 49%, #03181c 97%);
  }
`
const StyledGiveawayItemButton = styled(StyledListItemButton)`
  &:hover {
    background-color: transparent;
    background-image: linear-gradient(124deg, #312b12 -4%, #1a0c25 100%)
  }
`
const ColoredText = styled('div')`
  background-image: linear-gradient(to right, #a58e35 31%, #26869a 88%);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  &.selected {
    background-image: linear-gradient(106deg, #fbdc5f 42%, #3dddff 89%);
  }
`

export default NaviMenu