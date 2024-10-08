import { PublicKey, TransactionInstruction } from '@solana/web3.js'
import { useClone } from '~/hooks/useClone'
import { QueryClient, useMutation, useQueryClient } from '@tanstack/react-query'
import { CloneClient, toScale } from 'clone-protocol-sdk/sdk/src/clone'
import { useAnchorWallet } from '@solana/wallet-adapter-react'
import { funcNoWallet } from '~/features/baseQuery'
import { TransactionStateType, useTransactionState } from "~/hooks/useTransactionState"
import { sendAndConfirm } from '~/utils/tx_helper';
import { useAtomValue } from 'jotai'
import { priorityFee } from '~/features/globalAtom'
import { FeeLevel } from '~/data/networks'
import { createAssociatedTokenAccountIdempotentInstruction, getAssociatedTokenAddressSync } from '@solana/spl-token'

export const callEdit = async ({ program, userPubKey, setTxState, data, feeLevel, queryClient }: CallEditProps) => {
	if (!userPubKey) throw new Error('no user public key')

	// console.log('edit input data', data)
	const collateralTokenAccountAddress = getAssociatedTokenAddressSync(
		program.clone.collateral.mint, userPubKey, true
	)

	const { collAmount, editType } = data
	const oracles = await program.getOracles();

	const ixns: TransactionInstruction[] = [program.updatePricesInstruction(oracles)];
	if (editType === 0) {
		ixns.push(
			program.addCollateralToCometInstruction(
				collateralTokenAccountAddress,
				toScale(collAmount, program.clone.collateral.scale)
			))
	} else {
		ixns.push(
			createAssociatedTokenAccountIdempotentInstruction(
				userPubKey,
				collateralTokenAccountAddress,
				userPubKey,
				program.clone.collateral.mint
			),
			program.withdrawCollateralFromCometInstruction(
				collateralTokenAccountAddress,
				toScale(collAmount, program.clone.collateral.scale)
			))
	}

	//socket handler
	const subscriptionId = program.provider.connection.onAccountChange(
		collateralTokenAccountAddress,
		async (updatedAccountInfo) => {
			console.log("Updated account info: ", updatedAccountInfo)

			//if success, invalidate query
			queryClient.invalidateQueries({ queryKey: ['editCollateral'] })
			queryClient.invalidateQueries({ queryKey: ['cometInfos'] })

			setTimeout(() => {
				queryClient.invalidateQueries({ queryKey: ['editCollateral'] })
				queryClient.invalidateQueries({ queryKey: ['cometInfos'] })
			}, 3500)

			await program.provider.connection.removeAccountChangeListener(subscriptionId);
		},
		"confirmed"
	)
	console.log('Starting web socket, subscription ID: ', subscriptionId);

	await sendAndConfirm(program.provider, ixns, setTxState, feeLevel)

	return {
		result: true
	}
}

type EditFormData = {
	collAmount: number
	editType: number
}
interface CallEditProps {
	program: CloneClient
	userPubKey: PublicKey | null
	setTxState: (state: TransactionStateType) => void
	data: EditFormData
	feeLevel: FeeLevel
	queryClient: QueryClient
}
export function useCollateralMutation(userPubKey: PublicKey | null) {
	const queryClient = useQueryClient()
	const wallet = useAnchorWallet()
	const { getCloneApp } = useClone()
	const { setTxState } = useTransactionState()
	const feeLevel = useAtomValue(priorityFee)

	if (wallet) {
		return useMutation({
			mutationFn: async (data: EditFormData) => callEdit({ program: await getCloneApp(wallet), userPubKey, setTxState, data, feeLevel, queryClient }),
			onSuccess: () => {
				// queryClient.invalidateQueries({ queryKey: ['editCollateral'] })
				// queryClient.invalidateQueries({ queryKey: ['cometInfos'] })

				// setTimeout(() => {
				// 	queryClient.invalidateQueries({ queryKey: ['editCollateral'] })
				// 	queryClient.invalidateQueries({ queryKey: ['cometInfos'] })
				// }, 3500)
			}
		})
	} else {
		return useMutation({ mutationFn: (_: EditFormData) => funcNoWallet() })
	}
}
