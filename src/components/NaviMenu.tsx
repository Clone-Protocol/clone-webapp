import { usePathname } from 'next/navigation'
import { List, ListItemButton, Box, Fade, Typography, Stack } from '@mui/material'
import { styled } from '@mui/material/styles'
import Link from 'next/link'
import CometIcon from 'public/images/menu/comet.svg'
import BorrowIcon from 'public/images/menu/borrow.svg'
import HubIcon from 'public/images/menu/hub.svg'
import PointsIcon from 'public/images/menu/points.svg'
import PortfolioIcon from 'public/images/menu/portfolio.svg'
import StakingIcon from 'public/images/menu/staking.svg'
import SwapIcon from 'public/images/menu/swap.svg'
import WrapperIcon from 'public/images/menu/wrapper.svg'
import Image from 'next/image'
import { CloneTokenDir, RootLiquidityDir, RootMarketsDir, RouteDir } from '~/utils/constants'

const CommonMenu = () => {
  const pathname = usePathname()
  return (
    <List component="nav" sx={{ display: 'flex', padding: 0, gap: '3px' }}>
      <Link href={RootMarketsDir}>
        <NaviButton className={pathname?.startsWith(RootMarketsDir) ? 'selected' : ''}>
          <Typography variant='p_lg'>Trade</Typography>
        </NaviButton>
      </Link>
      <Link href={RouteDir.LIQUIDITY_LIST}>
        <NaviButton className={pathname?.startsWith(RootLiquidityDir) ? 'selected' : ''}>
          <Typography variant='p_lg'>Liquidity</Typography>
        </NaviButton>
      </Link>
      <Link href={RouteDir.POINTS}>
        <NaviButton className={pathname?.startsWith(CloneTokenDir) ? 'selected' : ''}>
          <Typography variant='p_lg'>Clone</Typography>
        </NaviButton>
      </Link>
    </List>
  )
}

const NaviButton = styled(ListItemButton)`
  height: 36px;
  border-radius: 5px;
  color: ${(props) => props.theme.basis.textRaven};
  &:hover {
    border-radius: 5px;
    background-color: rgba(196, 181, 253, 0.1);
  }
  &.selected {
    color: ${(props) => props.theme.basis.melrose};
    background: ${(props) => props.theme.basis.raisinBlack};
    padding: 10px 15px;
    border-radius: 10px;
    transition: all 0.3s ease 0.2s;
  }
`


export const NaviMenu = () => {
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
  height: 100%;
  color: ${(props) => props.theme.basis.textRaven};
  &:hover {
    border-radius: 5px;
    background-color: rgba(196, 181, 253, 0.1);
  }
  &.selected {
    color: ${(props) => props.theme.basis.melrose};
    background: #000;
    border-bottom: 1px solid ${(props) => props.theme.basis.melrose};
    transition: all 0.3s ease 0.2s;
  }
`

export const SubNaviMenu = () => {
  const pathname = usePathname()
  return (
    <List component="nav" sx={{ display: 'flex', justifyContent: 'center', padding: 0, height: '54px', background: '#0f0e14', borderBottom: '1px solid #201c27' }}>
      {pathname?.startsWith(RootMarketsDir) &&
        <Stack direction='row' alignItems='center' justifyContent='center'>
          <Link href={RouteDir.TRADE_LIST}>
            <StyledListItemButton className={pathname === RouteDir.TRADE_LIST || pathname?.startsWith(RouteDir.TRADE) ? 'selected' : ''}>
              <Image src={SwapIcon} alt='swap' />
              <Typography variant='p_lg' ml='3px'>Swap</Typography>
            </StyledListItemButton>
          </Link>
          <Link href={RouteDir.PORTFOLIO}>
            <StyledListItemButton className={pathname?.startsWith(RouteDir.PORTFOLIO) ? 'selected' : ''}>
              <Image src={PortfolioIcon} alt='portfolio' />
              <Typography variant='p_lg' ml='3px'>Portfolio</Typography>
            </StyledListItemButton>
          </Link>
          <Link href={RouteDir.WRAPPER}>
            <StyledListItemButton className={pathname?.startsWith(RouteDir.WRAPPER) ? 'selected' : ''}>
              <Image src={WrapperIcon} alt='wrapper' />
              <Typography variant='p_lg' ml='3px'>Wrapper</Typography>
            </StyledListItemButton>
          </Link>
        </Stack>
      }
      {pathname?.startsWith(RootLiquidityDir) &&
        <Stack direction='row' alignItems='center' justifyContent='center'>
          <Link href={RouteDir.LIQUIDITY_LIST}>
            <StyledListItemButton className={pathname === RouteDir.LIQUIDITY_LIST ? 'selected' : ''}>
              <Image src={HubIcon} alt='hub' />
              <Typography variant='p_lg' ml='3px'>Hub</Typography>
            </StyledListItemButton>
          </Link>
          <Link href={RouteDir.MY_COMET}>
            <StyledListItemButton className={pathname?.startsWith(RouteDir.MY_COMET) ? 'selected' : ''}>
              <Image src={CometIcon} alt='comet' />
              <Typography variant='p_lg' ml='3px'>Comet</Typography>
            </StyledListItemButton>
          </Link>
          <Link href={RouteDir.MY_BORROW}>
            <StyledListItemButton className={pathname?.startsWith(RouteDir.MY_BORROW) ? 'selected' : ''}>
              <Image src={BorrowIcon} alt='borrow' />
              <Typography variant='p_lg' ml='3px'>Borrow</Typography>
            </StyledListItemButton>
          </Link>
        </Stack>
      }
      {pathname?.startsWith(CloneTokenDir) &&
        <Stack direction='row' alignItems='center' justifyContent='center'>
          <Link href={RouteDir.POINTS}>
            <StyledListItemButton className={pathname?.startsWith(RouteDir.POINTS) ? 'selected' : ''}>
              {/* {pathname?.startsWith(RouteDir.POINTS) ? <Image src={PointsStarIconOn} alt='points' /> : <Image src={PointsStarIconOff} alt='points' />} */}
              <Image src={PointsIcon} alt='points' />
              <Typography variant="p_lg" ml='3px'>Points</Typography>
            </StyledListItemButton>
          </Link>
          <Link href={RouteDir.Staking}>
            <StyledListItemButton className={pathname?.startsWith(RouteDir.Staking) ? 'selected' : ''}>
              {/* {pathname?.startsWith(RouteDir.Staking) ? <Image src={PointsStarIconOn} alt='points' /> : <Image src={PointsStarIconOff} alt='points' />} */}
              <Image src={StakingIcon} alt='staking' />
              <Typography variant="p_lg" ml='3px'>Staking</Typography>
            </StyledListItemButton>
          </Link>
        </Stack>
      }
    </List>
  )
}


