import Close from '@mui/icons-material/Close'
import ExpandLess from '@mui/icons-material/ExpandLess'
import ExpandMore from '@mui/icons-material/ExpandMore'
import {
	Box,
	Button,
	Collapse,
	Dialog,
	DialogContent,
	DialogProps,
	DialogTitle,
	IconButton,
	List,
	Theme,
	Typography,
} from '@mui/material'
import { styled } from '@mui/material/styles'
import { WalletName } from '@solana/wallet-adapter-base'
import { useWallet } from '@solana/wallet-adapter-react'
import React, { FC, ReactElement, SyntheticEvent, useCallback, useEffect, useMemo, useState } from 'react'
import { useWalletDialog } from '~/hooks/useWalletDialog'
import { WalletListItem } from './WalletListItem'
import { useSnackbar } from 'notistack'

const RootDialog = styled(Dialog)(({ theme }: { theme: Theme }) => ({
	zIndex: 999999,
	'& .MuiDialog-paper': {
		width: 400,
		margin: 0,
		color: '#fff',
		background: '#10141f',
		boxShadow: '0 8px 20px rgb(0 0 0 / 60%)',
		borderRadius: '10px'
	},
	'& .MuiDialogTitle-root': {
		background: '#10141f',
		lineHeight: theme.spacing(5),
		textAlign: 'center',
		'& .MuiIconButton-root': {
			padding: theme.spacing(),
			marginRight: theme.spacing(-1),
			color: '#777',
			'&:hover': {
				color: '#fff'
			}
		},
	},
	'& .MuiDialogContent-root': {
		marginTop: 25,
		padding: 0,
		'& .MuiCollapse-root': {
			'& .MuiList-root': {
				background: '#10141f',
			},
		},
		'& .MuiList-root': {
			background: '#10141f',
			padding: 0,
		},
		'& .MuiListItem-root': {
			'&:hover': {
				background: '#2d3858'
			},
			padding: 0,
			'& .MuiButton-endIcon': {
				margin: 0,
			},
			'& .MuiButton-root': {
				background: '#10141f',
				color: '#f1f1f1',
				flexGrow: 1,
				justifyContent: 'space-between',
				padding: theme.spacing(1, 3),
				borderRadius: undefined,
				fontSize: '1rem',
				fontWeight: 400,

				'&:hover': {
					background: '#2d3858'
				},
			},
			'& .MuiSvgIcon-root': {
				color: theme.palette.grey[500],
			},
		},
	},
}))

export interface WalletDialogProps extends Omit<DialogProps, 'title' | 'open'> {
	featuredWallets?: number
	title?: ReactElement
}

export const WalletDialog: FC<WalletDialogProps> = ({
	title = 'Connect a wallet on Solana to continue',
	featuredWallets = 1,
	onClose,
	...props
}) => {
	const { wallets, select, connecting, connected } = useWallet()
	const { open, setOpen } = useWalletDialog()
	const { enqueueSnackbar } = useSnackbar()
	const [walletClicked, setWalletClicked] = useState(false)
	const [expanded, setExpanded] = useState(false)

	useEffect(() => {
		if (walletClicked) {
			if (connected) {
				enqueueSnackbar('Wallet Connected')
			}
			setWalletClicked(false)
		}
	}, [connecting, connected])

	const [featured, more] = useMemo(
		() => {
			const braveWalletIdx = wallets.findIndex(wallet => wallet.adapter.name === 'Brave Wallet')
			// for brave browser
			if (braveWalletIdx !== -1) {
				const braveWalletObj = wallets[braveWalletIdx]
				const newWallets = wallets.filter((wallet, idx) => idx !== braveWalletIdx)
				newWallets.push(braveWalletObj)
				return [newWallets.slice(0, featuredWallets), newWallets.slice(featuredWallets)]
			} else {
				return [wallets.slice(0, featuredWallets), wallets.slice(featuredWallets)]
			}
		},
		[wallets, featuredWallets]
	)

	const handleClose = useCallback(
		(event: SyntheticEvent, reason?: 'backdropClick' | 'escapeKeyDown') => {
			if (onClose) onClose(event, reason!)
			if (!event.defaultPrevented) setOpen(false)
		},
		[setOpen, onClose]
	)

	const handleWalletClick = useCallback(
		(event: SyntheticEvent, walletName: WalletName) => {
			select(walletName)
			handleClose(event)
			setWalletClicked(true)
		},
		[select, handleClose]
	)

	const handleExpandClick = useCallback(() => setExpanded(!expanded), [setExpanded, expanded])

	return (
		<RootDialog open={open} onClose={handleClose} {...props}>
			<DialogTitle>
				<Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
					<IconButton onClick={handleClose} size="large">
						<Close />
					</IconButton>
				</Box>
				<Box sx={{ margin: '0 auto', width: '250px' }}>
					<Typography variant='h4'>{title}</Typography>
				</Box>
			</DialogTitle>
			<DialogContent>
				<List>
					{featured.map((wallet) => (
						<WalletListItem
							key={wallet.adapter.name}
							onClick={(event) => handleWalletClick(event, wallet.adapter.name)}
							wallet={wallet}
						/>
					))}
					{more.length ? (
						<>
							<Collapse in={expanded} timeout="auto" unmountOnExit>
								<List>
									{more.map((wallet) => (
										<WalletListItem
											key={wallet.adapter.name}
											onClick={(event) => handleWalletClick(event, wallet.adapter.name)}
											wallet={wallet}
										/>
									))}
								</List>
							</Collapse>
							<Box sx={{ display: 'flex', justifyContent: 'end', marginTop: '15px', marginBottom: '15px' }}>
								<Button sx={{ color: '#fff', fontWeight: 'bold', background: '#10141f', ':hover': { background: '#2d3858' } }} onClick={handleExpandClick}>
									{expanded ? 'Less' : 'More'} options
									{expanded ? <ExpandLess /> : <ExpandMore />}
								</Button>
							</Box>
						</>
					) : null}
				</List>
			</DialogContent>
		</RootDialog>
	)
}
