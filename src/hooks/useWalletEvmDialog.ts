import { createContext, useContext } from 'react'

export interface WalletEvmDialogContextState {
  open: boolean
  setOpen: (open: boolean) => void
}

export const WalletEvmDialogContext = createContext<WalletEvmDialogContextState>({} as WalletEvmDialogContextState)

export function useWalletEvmDialog(): WalletEvmDialogContextState {
  return useContext(WalletEvmDialogContext)
}
