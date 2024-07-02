import React, { useState } from 'react'
import { TransactionStateContext, TransactionState } from '~/hooks/useTransactionState'
import TransactionEvmStateSnackbar from '~/components/Common/TransactionEvmStateSnackbar'

export const TransactionEvmStateProvider = ({ children, ...props }: any) => {
  const [txState, setTxState] = useState({
    state: TransactionState.INIT,
    txHash: '',
    networkName: 'Arbitrum One',
    networkScanUrl: 'https://status.arbitrum.io/',
  })

  return (
    <TransactionStateContext.Provider
      value={{
        txState,
        setTxState,
      }}>
      {children}

      {txState.state !== TransactionState.INIT &&
        <TransactionEvmStateSnackbar txState={txState.state} txHash={txState.txHash} networkName={txState.networkName} networkScanUrl={txState.networkScanUrl} open={true} handleClose={() => { setTxState({ state: TransactionState.INIT, txHash: '', networkName: '', networkScanUrl: '' }) }} />
      }
    </TransactionStateContext.Provider>
  )
}
