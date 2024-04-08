import React, { FC, ReactNode, useEffect } from 'react'
import { AnchorWallet } from '@solana/wallet-adapter-react'
import { CloneContext } from '~/hooks/useClone'
import { CloneClient } from "clone-protocol-sdk/sdk/src/clone"
import { useAtomValue, useAtom } from 'jotai'
import { cloneClient, connectedPubKey, rpcEndpoint } from '~/features/globalAtom'
import { CreateAccountDialogStates } from '~/utils/constants'
import { createAccountDialogState } from '~/features/globalAtom'
import { getCloneClient } from '~/features/baseQuery'

export interface CloneProviderProps {
	children: ReactNode
}

export const CloneProvider: FC<CloneProviderProps> = ({ children, ...props }) => {
	const networkEndpoint = useAtomValue(rpcEndpoint)
	const createAccountStatus = useAtomValue(createAccountDialogState)
	const [mainCloneClient, setMainCloneClient] = useAtom(cloneClient)
	const [mainConnectedPubKey, setMainConnectedPubKey] = useAtom(connectedPubKey)
	const getCloneApp = async (wallet: AnchorWallet | undefined, force?: boolean): Promise<CloneClient> => {
		let isChangePubKey = false
		if (!force) {
			if (!wallet) {
				throw Error('not detect wallet')
			}
			if (createAccountStatus !== CreateAccountDialogStates.Closed) {
				throw Error('the account is not initialized')
			}

			if (wallet.publicKey.toString() !== mainConnectedPubKey) {
				isChangePubKey = true
				setMainConnectedPubKey(wallet.publicKey.toString())
			}
		}

		let clone
		if (!mainCloneClient || isChangePubKey) {
			console.log('networkEndpoint', networkEndpoint)
			const { cloneClient } = await getCloneClient(networkEndpoint, wallet)
			clone = cloneClient
			setMainCloneClient(clone)
		} else {
			clone = mainCloneClient
		}
		return clone
	}

	// when networkEndpoint changes, reset the cloneClient
	useEffect(() => {
		if (networkEndpoint) {
			setMainCloneClient(null)
		}
	}, [networkEndpoint])

	return (
		<CloneContext.Provider
			value={{
				getCloneApp,
			}}>
			{children}
		</CloneContext.Provider>
	)
}
