'use client'
import React, { FC, ReactNode, useState } from 'react'
import { WalletDialogContext } from '~/hooks/useWalletDialog'
import { WalletDialog, WalletDialogProps } from '~/components/Wallet/WalletDialog'

export interface WalletDialogProviderProps extends WalletDialogProps {
	children: ReactNode
}

export const WalletDialogProvider: FC<WalletDialogProviderProps> = ({ children, ...props }) => {
	const [open, setOpen] = useState(false)

	return (
		<WalletDialogContext.Provider
			value={{
				open,
				setOpen,
			}}>
			{children}
			<WalletDialog {...props} />
		</WalletDialogContext.Provider>
	)
}
