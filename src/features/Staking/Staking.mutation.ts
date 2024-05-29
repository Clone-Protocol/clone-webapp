import { PublicKey, TransactionInstruction } from '@solana/web3.js'
import { BN, AnchorProvider } from "@coral-xyz/anchor"
import { useClone } from '~/hooks/useClone'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { CloneClient } from 'clone-protocol-sdk/sdk/src/clone'
import { useAnchorWallet } from '@solana/wallet-adapter-react'
import { funcNoWallet } from '~/features/baseQuery'
import { TransactionStateType, useTransactionState } from "~/hooks/useTransactionState"
import { CLN_TOKEN_SCALE, createDepositStakeIx, createWithdrawStakeIx, getStakingAccount } from '~/utils/staking'
import { sendAndConfirm } from '~/utils/tx_helper'
import { useAtomValue } from 'jotai';
import { priorityFee } from '~/features/globalAtom';
import { FeeLevel } from '~/data/networks'

export const callStaking = async ({ program, userPubKey, setTxState, data, feeLevel }: CallProps) => {
  if (!userPubKey) throw new Error('no user public key')

  console.log('staking input data', data)

  const { stakeAmount, isDeposit } = data

  const scaledStakeAmount = new BN(Math.floor(stakeAmount * Math.pow(10, CLN_TOKEN_SCALE)))
  let ixns: TransactionInstruction[] = [];

  if (isDeposit) {
    ixns.push(
      ...createDepositStakeIx(userPubKey, scaledStakeAmount)
    )
  } else {
    const stakingAccount = await getStakingAccount(userPubKey, program.provider.connection)
    const currentStakedAmount = new BN(stakingAccount.stakedTokens)
    const withdrawAmount = currentStakedAmount.lte(scaledStakeAmount) ? currentStakedAmount : scaledStakeAmount
    const innerIxs = createWithdrawStakeIx(userPubKey, withdrawAmount)
    ixns.push(
      ...innerIxs
    )
  }

  console.log('ixns', ixns)

  const result = await sendAndConfirm(program.provider as AnchorProvider, ixns, setTxState, feeLevel)
  return {
    result
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
  feeLevel: FeeLevel
}
export function useStakingMutation(userPubKey: PublicKey | null) {
  const queryClient = useQueryClient()
  const wallet = useAnchorWallet()
  const { getCloneApp } = useClone()
  const { setTxState } = useTransactionState()
  const feeLevel = useAtomValue(priorityFee)

  if (wallet) {
    return useMutation({
      mutationFn: async (data: StakingFormData) => callStaking({ program: await getCloneApp(wallet), userPubKey, setTxState, data, feeLevel }),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['stakingInfo'] })

        // setTimeout(() => {
        // 	queryClient.invalidateQueries({ queryKey: ['stakingInfo'] })
        // }, 3500)
      }
    })
  } else {
    return useMutation({ mutationFn: (_: StakingFormData) => funcNoWallet() })
  }
}
