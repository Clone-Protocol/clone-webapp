'use client'
import { createContext, useContext } from 'react'

export enum TransactionState {
  INIT,
  PENDING,
  SUCCESS,
  FAIL,
  EXPIRED,
}

export type TransactionStateType = {
  state: TransactionState,
  txHash: string
  retry?: () => void
}

export interface TransactionStateContextState {
  txState: TransactionStateType
  setTxState: (state: TransactionStateType) => void
}

export const TransactionStateContext = createContext<TransactionStateContextState>({} as TransactionStateContextState)

export function useTransactionState(): TransactionStateContextState {
  return useContext(TransactionStateContext)
}
