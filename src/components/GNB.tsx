'use client'
import React, { useCallback, useEffect, useState } from 'react'
import Image from 'next/image'
import logoIcon from 'public/images/logo-markets.svg'
import logoIconDevnet from 'public/images/logo-markets-devnet.png'
import logoMIcon from 'public/images/clone_icon.svg'
import walletIcon from 'public/images/gnb-wallet.svg'
import SettingsIcon from 'public/images/buttons-more-menu-settings.svg'
import { Button, Toolbar, Container, Box, AppBar, Typography, Theme, useMediaQuery } from '@mui/material'
import { styled } from '@mui/material/styles'
import { withCsrOnly } from '~/hocs/CsrOnly'
import { useWallet, useAnchorWallet } from '@solana/wallet-adapter-react'
import { shortenAddress } from '~/utils/address'
import { useWalletDialog } from '~/hooks/useWalletDialog'
import { useSetAtom } from 'jotai'
import NaviMenu, { MobileNaviMenu } from './NaviMenu'
import { mintUSDi } from '~/features/globalAtom'
import dynamic from 'next/dynamic'
import useFaucet from '~/hooks/useFaucet'
import TokenFaucetDialog from './Account/TokenFaucetDialog'
// import { isMobile } from 'react-device-detect';
import MoreMenu from './Common/MoreMenu'
import WalletSelectBox from './Common/WalletSelectBox'
// import { NETWORK_NAME } from '~/utils/constants'
import SettingDialog from './Common/SettingDialog'
import TempWarningMsg from '~/components/Common/TempWarningMsg'
import { IS_DEV } from '~/data/networks'
import { fetchGeoBlock } from '~/utils/fetch_netlify'
import { NETWORK_NAME } from '~/utils/constants'
// import useLocalStorage from '~/hooks/useLocalStorage'
// import { IS_COMPLETE_WHITELISTED } from '~/data/localstorage'


const GNB: React.FC = () => {
	// const [mobileNavToggle, setMobileNavToggle] = useState(false)
	const isMobileOnSize = useMediaQuery((theme: Theme) => theme.breakpoints.down('md'))

	return (
		<>
			<NavPlaceholder />
			<StyledAppBar position="static">
				<TempWarningMsg />
				<Container maxWidth={false}>
					<Toolbar disableGutters sx={{ display: 'flex', justifyContent: 'space-between' }}>
						{isMobileOnSize ?
							<a href="/"><Image src={logoMIcon} width={46} height={46} alt="clone" /></a>
							:
							<a href="/"><Image src={IS_DEV ? logoIconDevnet : logoIcon} width={IS_DEV ? 121 : 100} height={IS_DEV ? 25 : 26} alt="clone" /></a>
						}
						<Box ml='60px' sx={{ display: { xs: 'none', sm: 'inherit' } }}>
							<NaviMenu />
						</Box>
						<Box>
							<RightMenu />
						</Box>

						{/* <Box sx={{ marginLeft: 'auto', display: { xs: 'flex', sm: 'none' } }}>
							<IconButton sx={{ color: 'white' }} onClick={handleMobileNavBtn}>
								{mobileNavToggle ? <CloseIcon /> : <MenuIcon />}
							</IconButton>
						</Box> */}
						<Box sx={{ display: { xs: 'block', sm: 'none' }, position: 'fixed', bottom: '0px', left: '0px', width: '100%', zIndex: '999' }}>
							<MobileNaviMenu />
						</Box>
					</Toolbar>
				</Container>
			</StyledAppBar>
		</>
	)
}

export default withCsrOnly(GNB)

const RightMenu: React.FC = () => {
	const { connecting, connected, publicKey, connect, disconnect } = useWallet()
	const wallet = useAnchorWallet()
	const { setOpen } = useWalletDialog()
	const [openTokenFaucet, setOpenTokenFaucet] = useState(false)
	const [openSettingDlog, setOpenSettingDlog] = useState(false)
	const setMintUsdi = useSetAtom(mintUSDi)
	const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
	const [showWalletSelectPopup, setShowWalletSelectPopup] = useState(false)
	const [showGeoblock, setShowGeoblock] = useState(false)
	// const [showWhitelist, setShowWhitelist] = useState(false)
	// const [isWhitelisted, setIsWhitelisted] = useState(false)
	// const [isCompleteWhitelisted, setIsCompleteWhitelisted] = useLocalStorage(IS_COMPLETE_WHITELISTED, false)

	const GeoblockDialog = dynamic(() => import('~/components/Common/GeoblockDialog'), { ssr: false })
	// const WhitelistDialog = dynamic(() => import('~/components/Common/WhitelistDialog'), { ssr: false })

	useFaucet()

	// validate geoblock if connected
	useEffect(() => {
		const validateGeoblock = async () => {
			if (connected && publicKey) {
				const geoblock = await fetchGeoBlock()

				if (!geoblock.result) {
					setShowGeoblock(true)
					disconnect()
				} else {
					// validate whitelist
					// if (geoblock.whitelistAddr?.includes(publicKey.toString())) {
					// 	console.log('whitelisted')
					// 	setIsWhitelisted(true)
					// 	if (!isCompleteWhitelisted) {
					// 		setShowWhitelist(true)
					// 	}
					// } else {
					// 	console.log('no whitelisted')
					// 	setIsWhitelisted(false)
					// 	setShowWhitelist(true)
					// 	disconnect()
					// 	setIsCompleteWhitelisted(false)
					// }
				}
			}
		}
		validateGeoblock()
	}, [connected, publicKey])

	const handleWalletClick = async () => {
		try {
			if (!connected) {
				if (!wallet) {
					// validate geoblock
					const geoblock = await fetchGeoBlock()

					if (geoblock.result) {
						setOpen(true)
					} else {
						setShowGeoblock(true)
					}
				} else {
					connect()
				}
				setShowWalletSelectPopup(false)
			} else {
				setShowWalletSelectPopup(!showWalletSelectPopup)
			}
		} catch (error) {
			console.log('Error connecting to the wallet: ', error)
		}
	}

	const handleGetUsdiClick = useCallback(() => {
		setMintUsdi(true)
	}, [setMintUsdi])

	const handleMoreClick = useCallback((event: React.MouseEvent<HTMLElement>) => {
		setAnchorEl(event.currentTarget);
	}, [])

	return (
		<>
			<Box display="flex">
				{IS_DEV &&
					<HeaderButton sx={{ display: { xs: 'none', sm: 'block' } }} onClick={() => setOpenTokenFaucet(true)}>
						<Typography variant='p'>{NETWORK_NAME} Faucet</Typography>
					</HeaderButton>
				}
				<HeaderButton sx={{ fontSize: '18px', fontWeight: 'bold', paddingBottom: '20px' }} onClick={handleMoreClick}>...</HeaderButton>
				<HeaderButton onClick={() => setOpenSettingDlog(true)}><Image src={SettingsIcon} alt="settings" /></HeaderButton>
				<MoreMenu anchorEl={anchorEl} onShowTokenFaucet={() => setOpenTokenFaucet(true)} onClose={() => setAnchorEl(null)} />
				<Box>
					{!connected ?
						<ConnectButton
							onClick={handleWalletClick}
						// disabled={connecting}
						>
							<Typography variant='p_lg'>{connecting ? 'Connecting...' : 'Connect Wallet'}</Typography>
						</ConnectButton>
						:
						<ConnectedButton onClick={handleWalletClick} startIcon={publicKey ? <Image src={walletIcon} alt="wallet" /> : <></>}>
							<Typography variant='p'>{publicKey && shortenAddress(publicKey.toString())}</Typography>
						</ConnectedButton>
					}
					<WalletSelectBox show={showWalletSelectPopup} onHide={() => setShowWalletSelectPopup(false)} />
				</Box>
			</Box>

			<SettingDialog open={openSettingDlog} handleClose={() => setOpenSettingDlog(false)} />

			<TokenFaucetDialog
				open={openTokenFaucet}
				isConnect={connected}
				connectWallet={handleWalletClick}
				onGetUsdiClick={handleGetUsdiClick}
				onHide={() => setOpenTokenFaucet(false)}
			/>
			{/* <WhitelistDialog open={showWhitelist} isWhitelisted={isWhitelisted} handleClose={() => setShowWhitelist(false)} /> */}
			{showGeoblock && <GeoblockDialog open={showGeoblock} handleClose={() => setShowGeoblock(false)} />}
		</>
	)
}

const StyledAppBar = styled(AppBar)`
	z-index: 900;
	background-color: #000;
	position: fixed;
	top: 0px;
	left: 0px;
	.MuiContainer-root,
	.MuiTabs-flexContainer {
		${(props) => props.theme.breakpoints.up('md')} {
			height: 80px;
		}
		${(props) => props.theme.breakpoints.down('md')} {
			height: 65px;
		}
	}
	&.mobile-on .MuiContainer-root {
		background-color: #3a3a3a;
		border-radius: 0px 0px 20px 20px;
	}
	&.scrolled:not(.mobile-on) {
		background: rgba(255, 255, 255, 0.1);
		backdrop-filter: blur(20px);
		border-radius: 20px;
	}
`
const NavPlaceholder = styled('div')`
	${(props) => props.theme.breakpoints.up('md')} {
		height: 80px;
	}
	${(props) => props.theme.breakpoints.down('md')} {
		height: 65px;
	}
`
const HeaderButton = styled(Button)`
	padding: 8px;
	color: rgb(137, 136, 163);
	margin-left: 6px;
	height: 42px;
	border-radius: 10px;
	&:hover {
		border-radius: 10px;
  	background-color: rgba(196, 181, 253, 0.1);
	}
`
const ConnectButton = styled(Button)`
	padding: 9px;
	margin-left: 16px;
	color: #fff;
	width: 140px;
	height: 42px;
	border-radius: 10px;
	box-shadow: 0 0 10px 0 #6d5887;
	border: 1px solid ${(props) => props.theme.basis.melrose};
	&:hover {
		background-color: transparent;
		border-color: ${(props) => props.theme.basis.lightSlateBlue};
  }
`
// const ConnectButtonOld = styled(Button)`
// 	padding: 9px;
// 	margin-left: 8px;
// 	color: #fff;
// 	width: 142px;
// 	height: 42px;
// 	border-radius: 10px;
// 	box-shadow: 0 0 10px 0 #6d5887;
// 	background: linear-gradient(to bottom, ${(props) => props.theme.basis.royalPurple}, ${(props) => props.theme.basis.royalPurple}), linear-gradient(to right, #ed25c1 0%, #a74fff 16%, #f096ff 34%, #fff 50%, #ff96e2 68%, #874fff 83%, #4d25ed, #4d25ed);
// 	&::before {
//     content: "";
//     position: absolute;
//     top: 0;
//     left: 0;
//     right: 0;
//     bottom: 0;
//     border-radius: 10px;
//     border: 1px solid transparent;
//     background: ${(props) => props.theme.gradients.light} border-box;
//     -webkit-mask:
//       linear-gradient(#fff 0 0) padding-box, 
//       linear-gradient(#fff 0 0);
//     -webkit-mask-composite: destination-out;
//     mask-composite: exclude;
//   }
// 	&:hover {
// 		&::before {
// 			background: linear-gradient(to right, #8e1674 0%, #642f99 16%, #905a99 34%, #999 50%, #995a88 68%, #512f99 83%, #2e168e) border-box;
// 		}
//   }
// `
const ConnectedButton = styled(Button)`
	width: 140px;
	height: 42px;
	padding: 9px;
	margin-left: 16px;
	color: #fff;
	border-radius: 10px;
	border: solid 1px ${(props) => props.theme.basis.portGore};
  background: ${(props) => props.theme.basis.royalPurple};
	&:hover {
		background: ${(props) => props.theme.basis.royalPurple};
    border: solid 1px ${(props) => props.theme.basis.melrose};
  }
`
