import { PublicKey } from '@solana/web3.js'
import { useClone } from '~/hooks/useClone'
import { useMutation } from '@tanstack/react-query'
import { CloneClient } from 'clone-protocol-sdk/sdk/src/clone'
import { useAnchorWallet } from '@solana/wallet-adapter-react'
import { funcNoWallet } from '~/features/baseQuery'
import { TransactionStateType, useTransactionState } from "~/hooks/useTransactionState"

export const callStaking = async ({ program, userPubKey, setTxState, data }: CallProps) => {
  if (!userPubKey) throw new Error('no user public key')

  console.log('staking input data', data)

  const { stakeAmount, isDeposit } = data


  return {
    result: true
  }
}

type StakingFormData = {
  stakeAmount: number
  isDeposit: boolean
}
interface CallProps {
  program: CloneClient
  userPubKey: PublicKey | null
  setTxState: (state: TransactionStateType) => void
  data: StakingFormData
}
export function useStakingMutation(userPubKey: PublicKey | null) {
  const wallet = useAnchorWallet()
  const { getCloneApp } = useClone()
  const { setTxState } = useTransactionState()

  if (wallet) {
    return useMutation({
      mutationFn: async (data: StakingFormData) => callStaking({ program: await getCloneApp(wallet), userPubKey, setTxState, data }),
      onSuccess: () => {
        // queryClient.invalidateQueries({ queryKey: ['editCollateral'] })

        // setTimeout(() => {
        // 	queryClient.invalidateQueries({ queryKey: ['editCollateral'] })
        // }, 3500)
      }
    })
  } else {
    return useMutation({ mutationFn: (_: StakingFormData) => funcNoWallet() })
  }
}
