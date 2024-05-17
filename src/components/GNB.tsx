'use client'
import React, { useCallback, useEffect, useState } from 'react'
import Image from 'next/image'
import logoIcon from 'public/images/logos-clone.svg'
import logoMIcon from 'public/images/clone_icon.svg'
import walletIcon from 'public/images/gnb-wallet.svg'
import SettingsIcon from 'public/images/buttons-more-menu-settings.svg'
import { Button, Toolbar, Container, Box, AppBar, Typography, Theme, useMediaQuery, Stack } from '@mui/material'
import { styled } from '@mui/material/styles'
import { withCsrOnly } from '~/hocs/CsrOnly'
import { useWallet, useAnchorWallet } from '@solana/wallet-adapter-react'
import { shortenAddress } from '~/utils/address'
import { useWalletDialog } from '~/hooks/useWalletDialog'
import { useAtom, useAtomValue, useSetAtom } from 'jotai'
import { NaviMenu, SubNaviMenu } from './NaviMenu'
import { isFetchingReferralCode } from '~/features/globalAtom'
import dynamic from 'next/dynamic'
import MoreMenu from './Common/MoreMenu'
import WalletSelectBox from './Common/WalletSelectBox'
import SettingDialog from './Common/SettingDialog'
import TempWarningMsg from '~/components/Common/TempWarningMsg'
import { fetchGeoBlock } from '~/utils/fetch_netlify'
import { CreateAccountDialogStates } from '~/utils/constants'
import { createAccountDialogState, declinedAccountCreationState, isCreatingAccountState, showReferralCodeDlog } from '~/features/globalAtom'
import { useCurrentLevelQuery } from '~/features/Staking/StakingInfo.query'
import ClnWidget from './Staking/ClnWidget'
import CreateAccountSetupDialog from './Account/CreateAccountSetupDialog'
import useInitialized from '~/hooks/useInitialized'
import { useCreateAccount } from '~/hooks/useCreateAccount'

const GNB: React.FC = () => {
	const isMobileOnSize = useMediaQuery((theme: Theme) => theme.breakpoints.down('md'))

	return (
		<>
			<NavPlaceholder />
			<StyledAppBar position="static">
				<TempWarningMsg />
				<StyledContainer maxWidth={false}>
					<Toolbar disableGutters sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mx: '24px' }}>
						<Stack direction='row' alignItems='center'>
							{isMobileOnSize ?
								<a href="/"><Image src={logoMIcon} width={25} height={25} alt="clone" style={{ marginTop: '4px' }} /></a>
								:
								<a href="/"><Image src={logoIcon} width={73} height={24} alt="clone" /></a>
							}
							<div style={{ width: '1px', height: '31px', marginLeft: isMobileOnSize ? '4px' : '23px', marginRight: isMobileOnSize ? '6px' : '23px', backgroundColor: '#201c27' }} />
							<NaviMenu />
						</Stack>
						<Box>
							<RightMenu />
						</Box>
					</Toolbar>
					<SubNaviMenu />
				</StyledContainer>
			</StyledAppBar>
		</>
	)
}

export default withCsrOnly(GNB)

const RightMenu: React.FC = () => {
	const isMobileOnSize = useMediaQuery((theme: Theme) => theme.breakpoints.down('md'))
	const { connecting, connected, publicKey, connect, disconnect } = useWallet()
	const wallet = useAnchorWallet()
	const { setOpen } = useWalletDialog()
	const [openSettingDlog, setOpenSettingDlog] = useState(false)
	const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
	const [showClnWidget, setShowClnWidget] = useState(false)
	const [showWalletSelectPopup, setShowWalletSelectPopup] = useState(false)
	const [showGeoblock, setShowGeoblock] = useState(false)

	//for creating account
	const [createAccountDialogStatus, setCreateAccountDialogStatus] = useAtom(createAccountDialogState)
	const setDeclinedAccountCreation = useSetAtom(declinedAccountCreationState)
	const setIsCreatingAccount = useSetAtom(isCreatingAccountState)

	const GeoblockDialog = dynamic(() => import('~/components/Common/GeoblockDialog'), { ssr: false })

	const { data: levelData } = useCurrentLevelQuery({
		userPubKey: publicKey,
		refetchOnMount: true,
		enabled: publicKey != null
	})

	// validate geoblock if connected
	useEffect(() => {
		const validateGeoblock = async () => {
			if (connected && publicKey) {
				const geoblock = await fetchGeoBlock()

				if (!geoblock.result) {
					setShowGeoblock(true)
					disconnect()
				}
			}
		}
		validateGeoblock()
	}, [connected, publicKey])

	// create the account when the user clicks the create account button
	const handleCreateAccount = () => {
		setIsCreatingAccount(true)
	}

	const closeAccountSetupDialog = async () => {
		setCreateAccountDialogStatus(CreateAccountDialogStates.Closed)
		setDeclinedAccountCreation(true)
		await disconnect()
	}

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

	const handleMoreClick = useCallback((event: React.MouseEvent<HTMLElement>) => {
		setAnchorEl(event.currentTarget);
	}, [])

	return (
		<>
			<CreateAccountSetupDialog
				state={createAccountDialogStatus}
				handleCreateAccount={handleCreateAccount}
				handleClose={closeAccountSetupDialog} />

			<Box display="flex" alignItems='center'>
				<HeaderButton sx={{ display: { xs: 'none', sm: 'flex' }, width: { xs: '36px', sm: '42px' }, height: { xs: '30px', sm: '34px' }, fontSize: '18px', fontWeight: 'bold', paddingBottom: '20px' }} onClick={handleMoreClick}>...</HeaderButton>
				<HeaderButton sx={{ width: { xs: '36px', sm: '42px' }, height: { xs: '30px', sm: '34px' } }} onClick={() => setOpenSettingDlog(true)}><Image src={SettingsIcon} alt="settings" /></HeaderButton>
				<Box>
					{connected && <ClnButton sx={{ display: { xs: 'none', sm: 'block' }, width: { xs: '34px', sm: '39px' }, height: { xs: '30px', sm: '34px' } }} onClick={() => setShowClnWidget(true)}>C{levelData ? levelData.currentLevel + 1 : 1}</ClnButton>}
					<ClnWidget show={showClnWidget} levelData={levelData} onHide={() => setShowClnWidget(false)} />
				</Box>
				<MoreMenu anchorEl={anchorEl} onClose={() => setAnchorEl(null)} />
				<Box>
					{!connected ?
						<ConnectButton
							sx={{ height: { xs: '30px', sm: '34px' } }}
							onClick={handleWalletClick}
						>
							<Typography variant='p_lg'>{connecting ? 'Connecting...' : isMobileOnSize ? 'Connect' : 'Connect Wallet'}</Typography>
						</ConnectButton>
						:
						<ConnectedButton sx={{ width: { xs: '90px', sm: '120px' }, height: { xs: '30px', sm: '34px' } }} onClick={handleWalletClick} startIcon={publicKey ? <Image src={walletIcon} alt="wallet" /> : <></>}>
							<Typography variant='p'>{isMobileOnSize ? publicKey!.toString().slice(0, 4) + '...' : shortenAddress(publicKey!.toString(), 10, 4)}</Typography>
						</ConnectedButton>
					}
					<WalletSelectBox show={showWalletSelectPopup} levelData={levelData} onHide={() => setShowWalletSelectPopup(false)} />
				</Box>
			</Box>

			<SettingDialog open={openSettingDlog} handleClose={() => setOpenSettingDlog(false)} />

			{showGeoblock && <GeoblockDialog open={showGeoblock} handleClose={() => setShowGeoblock(false)} />}
		</>
	)
}
const StyledContainer = styled(Container)`
	padding-left: 0px !important;
	padding-right: 0px !important;
`

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
	min-width: 36px;
	height: 34px;
	padding: 8px;
	background: ${(props) => props.theme.basis.backInBlack};
	color: ${(props) => props.theme.basis.textRaven};
	margin-left: 10px;
	border-radius: 10px;
	&:hover {
  	background-color: rgba(196, 181, 253, 0.1);
	}
`
const ClnButton = styled(HeaderButton)`
	min-width: 34px;
	border: solid 1px #b5fdf9;
	color: #b5fdf9; 
`
const ConnectButton = styled(Button)`
	padding: 9px;
	margin-left: 10px;
	color: #c5c7d9;
	width: 142px;
	height: 34px;
	border-radius: 10px;
	border: 1px solid ${(props) => props.theme.basis.melrose};
	&:hover {
		background-color: transparent;
		border-color: ${(props) => props.theme.basis.lightSlateBlue};
  }
`
const ConnectedButton = styled(Button)`
	height: 34px;
	padding: 9px;
	margin-left: 10px;
	color: #fff;
	border-radius: 10px;
	border: solid 1px ${(props) => props.theme.basis.portGore};
  background: ${(props) => props.theme.basis.royalPurple};
	&:hover {
		background: ${(props) => props.theme.basis.royalPurple};
    border: solid 1px ${(props) => props.theme.basis.melrose};
  }
`
