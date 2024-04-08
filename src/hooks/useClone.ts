'use client'
import { createContext, useContext } from 'react'
import { CloneClient } from "clone-protocol-sdk/sdk/src/clone"
import { AnchorWallet } from '@solana/wallet-adapter-react'

export interface CloneContextState {
	getCloneApp: (wallet: AnchorWallet | undefined, force?: boolean) => Promise<CloneClient>
}

export const CloneContext = createContext<CloneContextState>({} as CloneContextState)

export function useClone(): CloneContextState {
	return useContext(CloneContext)
}
