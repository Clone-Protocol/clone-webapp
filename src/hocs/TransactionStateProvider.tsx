'use client'
import React, { FC, ReactNode, useState } from 'react'
import { TransactionStateContext, TransactionState, TransactionStateType } from '~/hooks/useTransactionState'
import TransactionStateSnackbar from '~/components/Common/TransactionStateSnackbar'

export const TransactionStateProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [txState, setTxState] = useState<TransactionStateType>({
    state: TransactionState.INIT,
    txHash: '',
  })

  return (
    <TransactionStateContext.Provider
      value={{
        txState,
        setTxState,
      }}>
      {children}

      {txState.state !== TransactionState.INIT &&
        <TransactionStateSnackbar txState={txState.state} txHash={txState.txHash} retry={txState.retry} open={true} handleClose={() => { setTxState({ state: TransactionState.INIT, txHash: '' }) }} />
      }
    </TransactionStateContext.Provider>
  )
}
