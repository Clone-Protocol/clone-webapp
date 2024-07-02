import { Button, ListItem, ListItemProps } from '@mui/material'
import { Wallet } from '@solana/wallet-adapter-react'
import React, { FC, MouseEventHandler } from 'react'
import { WalletIcon } from './WalletIcon'
import { Connector } from 'wagmi'
import Image from 'next/image'

interface WalletListItemProps extends Omit<ListItemProps, 'onClick' | 'button'> {
	onClick: MouseEventHandler<HTMLButtonElement>
	wallet: Wallet
}

export const WalletListItem: FC<WalletListItemProps> = ({ onClick, wallet, ...props }) => {
	return (
		<ListItem {...props}>
			<Button onClick={onClick} endIcon={<WalletIcon wallet={wallet} />} sx={{ borderRadius: '0' }}>
				<div style={{ fontSize: '18px', fontWeight: '600' }}>{wallet.adapter.name}</div>
			</Button>
		</ListItem>
	)
}

interface WalletEvmListItemProps extends Omit<ListItemProps, 'onClick' | 'button'> {
	onClick: MouseEventHandler<HTMLButtonElement>
	connector: Connector
}
export const WalletEvmListItem: FC<WalletEvmListItemProps> = ({ onClick, connector, ...props }) => {
	return (
		<ListItem {...props}>
			<Button onClick={onClick} endIcon={connector.icon && <img width={20} height={20} src={connector.icon} alt={connector.name} />} sx={{ borderRadius: '0' }}>
				<div style={{ fontSize: '18px', fontWeight: '600' }}>{connector.name}</div>
			</Button>
		</ListItem>
	)
}
