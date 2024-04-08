'use client'
import { WalletAdapterNetwork, WalletError } from '@solana/wallet-adapter-base'
import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react'
import {
	PhantomWalletAdapter,
	SolflareWalletAdapter,
	TorusWalletAdapter,
} from '@solana/wallet-adapter-wallets'
import { WalletDialogProvider } from '~/hocs/WalletDialogProvider'
import { CloneProvider } from '~/hocs/CloneProvider'
import React, { FC, ReactNode, useMemo } from 'react'
import { useAtomValue } from 'jotai'
import { rpcEndpoint } from '~/features/globalAtom'

const ClientWalletProvider: FC<{ children: ReactNode }> = ({ children }) => {
	const network = WalletAdapterNetwork.Devnet //IS_DEV ? WalletAdapterNetwork.Devnet : WalletAdapterNetwork.Mainnet
	const rpcUrl = useAtomValue(rpcEndpoint)

	// MEMO: it can connect custom RPC endpoint
	// useMemo(() => {
	// 	const endpointUrl = clusterApiUrl(network)
	// 	setRpcUrl(endpointUrl)
	// }, [network])

	const wallets = useMemo(
		() => [
			new PhantomWalletAdapter(),
			new SolflareWalletAdapter({ network }),
			new TorusWalletAdapter(),
		],
		[network]
	)

	const onError = (error: WalletError) => {
		// enqueueSnackbar(error.message ? `${error.name}: ${error.message}` : error.name, { variant: 'error' })
		console.log('walletError', error)
	}

	return (
		<ConnectionProvider endpoint={rpcUrl}>
			<WalletProvider wallets={wallets} onError={onError} autoConnect>
				<CloneProvider>
					<WalletDialogProvider>{children}</WalletDialogProvider>
				</CloneProvider>
			</WalletProvider>
		</ConnectionProvider>
	)
}
export default ClientWalletProvider
