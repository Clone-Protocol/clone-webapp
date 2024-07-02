import React, { FC, ReactNode, useState } from 'react'
import { WalletDialogProps, WalletEvmDialog } from '~/components/Wallet/WalletEvmDialog'
import { WalletEvmDialogContext } from '~/hooks/useWalletEvmDialog'

export interface WalletEvmDialogProviderProps extends WalletDialogProps {
	children: ReactNode
}

export const WalletEvmDialogProvider: FC<WalletEvmDialogProviderProps> = ({ children, ...props }) => {
	const [open, setOpen] = useState(false)

	return (
		<WalletEvmDialogContext.Provider
			value={{
				open,
				setOpen,
			}}>
			{children}
			<WalletEvmDialog {...props} />
		</WalletEvmDialogContext.Provider>
	)
}
