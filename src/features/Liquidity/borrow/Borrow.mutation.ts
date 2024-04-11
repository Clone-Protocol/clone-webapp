import { PublicKey, TransactionInstruction } from '@solana/web3.js'
import { QueryClient, useMutation, useQueryClient } from '@tanstack/react-query'
import { CloneClient, toCloneScale, toScale } from 'clone-protocol-sdk/sdk/src/clone'
import * as anchor from "@coral-xyz/anchor";
import { useClone } from '~/hooks/useClone'
import { getAssociatedTokenAddress, createAssociatedTokenAccountInstruction } from '@solana/spl-token'
import { getTokenAccount, getCollateralAccount } from '~/utils/token_accounts'
import { useAnchorWallet } from '@solana/wallet-adapter-react';
import { funcNoWallet } from '~/features/baseQuery';
import { TransactionStateType, useTransactionState } from "~/hooks/useTransactionState"
import { sendAndConfirm } from '~/utils/tx_helper';
import { useAtomValue } from 'jotai';
import { priorityFee } from '~/features/globalAtom';
import { FeeLevel } from '~/data/networks';

export const callClose = async ({ program, userPubKey, setTxState, data, feeLevel }: CallCloseProps) => {
	if (!userPubKey) throw new Error('no user public key')

	const { borrowIndex } = data

	console.log('close input data', data)

	const userAccount = await program.getUserAccount();
	const borrowPositions = userAccount.borrows
	const oracles = await program.getOracles()
	const collateralAssociatedTokenAccount = await getCollateralAccount(program)
	const mintPosition = borrowPositions[borrowIndex];

	const ixnCalls = [
		program.updatePricesInstruction(oracles),
		program.withdrawCollateralFromBorrowInstruction(
			borrowIndex,
			collateralAssociatedTokenAccount.address,
			new anchor.BN(mintPosition.collateralAmount)
		)
	]

	const ixns = await Promise.all(ixnCalls)
	await sendAndConfirm(program.provider, ixns, setTxState, feeLevel)

	return {
		result: true,
	}
}

type CloseFormData = {
	borrowIndex: number
}
interface CallCloseProps {
	program: CloneClient
	userPubKey: PublicKey | null
	setTxState: (state: TransactionStateType) => void
	data: CloseFormData
	feeLevel: FeeLevel
}
export function useCloseMutation(userPubKey: PublicKey | null) {
	const queryClient = useQueryClient()
	const wallet = useAnchorWallet()
	const { getCloneApp } = useClone()
	const { setTxState } = useTransactionState()
	const feeLevel = useAtomValue(priorityFee)

	if (wallet) {
		return useMutation({
			mutationFn: async (data: CloseFormData) => callClose({ program: await getCloneApp(wallet), userPubKey, setTxState, data, feeLevel }),
			onSuccess: () => {
				queryClient.invalidateQueries({ queryKey: ['borrowAssets'] })
			}
		})
	} else {
		return useMutation({ mutationFn: (_: CloseFormData) => funcNoWallet() })
	}
}

export const callEditCollateral = async ({ program, userPubKey, setTxState, data, feeLevel, queryClient }: CallEditProps) => {
	if (!userPubKey) throw new Error('no user public key')

	const { borrowIndex, collateralAmount, editType } = data

	if (!collateralAmount) throw new Error('no collateral amount')

	// console.log('edit input data', data)

	const collateralAssociatedTokenAccount = await getCollateralAccount(program)
	const oracles = await program.getOracles()

	let result: { result: boolean, msg: string };
	const ixnCalls: TransactionInstruction[] = []
	ixnCalls.push(program.updatePricesInstruction(oracles))

	/// Deposit
	if (editType === 0) {
		ixnCalls.push(
			program.addCollateralToBorrowInstruction(
				borrowIndex,
				collateralAssociatedTokenAccount.address,
				toScale(collateralAmount, program.clone.collateral.scale),
			)
		)

		result = {
			result: true,
			msg: 'added collateral to borrow',
		}
	} else {
		/// Withdraw
		const onusdAssociatedToken = await getAssociatedTokenAddress(
			program.clone.collateral.mint,
			program.provider.publicKey!
		)
		if (collateralAssociatedTokenAccount === undefined) {
			ixnCalls.push(
				createAssociatedTokenAccountInstruction(
					program.provider.publicKey!,
					onusdAssociatedToken,
					program.provider.publicKey!,
					program.clone.collateral.mint
				)
			)
		}
		ixnCalls.push(
			program.withdrawCollateralFromBorrowInstruction(
				borrowIndex,
				onusdAssociatedToken,
				toScale(collateralAmount, program.clone.collateral.scale),
			)
		)

		result = {
			result: true,
			msg: 'withdraw collateral from borrow',
		}
	}

	const ixns = await Promise.all(ixnCalls)

	//socket handler
	const subscriptionId = program.provider.connection.onAccountChange(
		collateralAssociatedTokenAccount.address,
		async (updatedAccountInfo) => {
			console.log("Updated account info: ", updatedAccountInfo)

			//if success, invalidate query
			queryClient.invalidateQueries({ queryKey: ['borrowPosition'] })
			setTimeout(() => {
				queryClient.invalidateQueries({ queryKey: ['borrowPosition'] })
			}, 3000)

			await program.provider.connection.removeAccountChangeListener(subscriptionId);
		},
		"confirmed"
	)
	console.log('Starting web socket, subscription ID: ', subscriptionId);

	await sendAndConfirm(program.provider, ixns, setTxState, feeLevel)

	return result;
}

export const callEditBorrow = async ({ program, userPubKey, setTxState, data, feeLevel, queryClient }: CallEditProps) => {
	if (!userPubKey) throw new Error('no user public key')

	const { borrowIndex, borrowAmount, editType } = data

	if (!borrowAmount) throw new Error('no borrow more amount')

	// console.log('edit input data', data)
	const userAccount = await program.getUserAccount()
	const pools = await program.getPools()
	const oracles = await program.getOracles()
	const borrowPositions = userAccount.borrows
	const borrowPosition = borrowPositions[borrowIndex];
	const assetInfo = pools.pools[borrowPosition.poolIndex].assetInfo

	const onassetTokenAccountInfo = await getTokenAccount(
		assetInfo.onassetMint,
		program.provider.publicKey!,
		program.provider.connection
	)

	let result: { result: boolean, msg: string };
	const ixnCalls: TransactionInstruction[] = []
	ixnCalls.push(program.updatePricesInstruction(oracles))

	const associatedToken = await getAssociatedTokenAddress(
		assetInfo.onassetMint,
		program.provider.publicKey!
	)
	if (!onassetTokenAccountInfo.isInitialized) {
		ixnCalls.push(
			createAssociatedTokenAccountInstruction(
				program.provider.publicKey!,
				associatedToken,
				program.provider.publicKey!,
				assetInfo.onassetMint
			)
		)
	}

	/// Borrow more
	if (editType === 0) {
		ixnCalls.push(
			program.borrowMoreInstruction(
				pools,
				userAccount,
				onassetTokenAccountInfo.address,
				toCloneScale(borrowAmount),
				borrowIndex,

			)
		)

		result = {
			result: true,
			msg: 'withdraw borrow amount from borrow',
		}
	} else {
		ixnCalls.push(
			program.payBorrowDebtInstruction(
				pools,
				userAccount,
				associatedToken,
				toCloneScale(borrowAmount),
				borrowIndex
			)
		)

		result = {
			result: true,
			msg: 'added borrow amount to borrow',
		}
	}

	const ixns = await Promise.all(ixnCalls)

	//socket handler
	const subscriptionId = program.provider.connection.onAccountChange(
		program.getUserAccountAddress(),
		async (updatedAccountInfo) => {
			console.log("Updated account info: ", updatedAccountInfo)

			//if success, invalidate query
			queryClient.invalidateQueries({ queryKey: ['borrowPosition'] })
			setTimeout(() => {
				queryClient.invalidateQueries({ queryKey: ['borrowPosition'] })
			}, 3000)

			await program.provider.connection.removeAccountChangeListener(subscriptionId);
		},
		"confirmed"
	)
	console.log('Starting web socket, subscription ID: ', subscriptionId);

	await sendAndConfirm(program.provider, ixns, setTxState, feeLevel)

	return result
}

type EditFormData = {
	borrowIndex: number
	collateralAmount?: number
	borrowAmount?: number
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
export function useEditCollateralMutation(userPubKey: PublicKey | null) {
	const queryClient = useQueryClient()
	const wallet = useAnchorWallet()
	const { getCloneApp } = useClone()
	const { setTxState } = useTransactionState()
	const feeLevel = useAtomValue(priorityFee)

	if (wallet) {
		return useMutation({
			mutationFn: async (data: EditFormData) => callEditCollateral({ program: await getCloneApp(wallet), userPubKey, setTxState, data, feeLevel, queryClient }),
			onSuccess: () => {
				// queryClient.invalidateQueries({ queryKey: ['borrowPosition'] })

				// // hacky retry
				// setTimeout(() => {
				// 	queryClient.invalidateQueries({ queryKey: ['borrowPosition'] })
				// }, 3000)
			}
		})
	} else {
		return useMutation({ mutationFn: (_: EditFormData) => funcNoWallet() })
	}

}
export function useEditBorrowMutation(userPubKey: PublicKey | null) {
	const queryClient = useQueryClient()
	const wallet = useAnchorWallet()
	const { getCloneApp } = useClone()
	const { setTxState } = useTransactionState()
	const feeLevel = useAtomValue(priorityFee)

	if (wallet) {
		return useMutation({
			mutationFn: async (data: EditFormData) => callEditBorrow({ program: await getCloneApp(wallet), userPubKey, setTxState, data, feeLevel, queryClient }),
			onSuccess: () => {
				// queryClient.invalidateQueries({ queryKey: ['borrowPosition'] })

				// // hacky retry
				// setTimeout(() => {
				// 	queryClient.invalidateQueries({ queryKey: ['borrowPosition'] })
				// }, 3000)
			}
		})
	} else {
		return useMutation({ mutationFn: (_: EditFormData) => funcNoWallet() })
	}
}

export const callBorrow = async ({ program, userPubKey, setTxState, data, feeLevel }: CallBorrowProps) => {
	if (!userPubKey) throw new Error('no user public key')

	console.log('borrow input data', data)

	const { onassetIndex, onassetAmount, collateralAmount } = data

	const pools = await program.getPools()
	const oracles = await program.getOracles()
	const pool = pools.pools[onassetIndex]

	const onassetTokenAccountInfo = await getTokenAccount(
		pool.assetInfo.onassetMint,
		program.provider.publicKey!,
		program.provider.connection
	)

	const ixnCalls: TransactionInstruction[] = []

	if (!onassetTokenAccountInfo.isInitialized) {
		ixnCalls.push(
			createAssociatedTokenAccountInstruction(
				userPubKey,
				onassetTokenAccountInfo.address,
				userPubKey,
				pool.assetInfo.onassetMint,
			)
		)
	}

	const mockUSDCTokenAccountInfo = await getCollateralAccount(program)
	ixnCalls.push(program.updatePricesInstruction(oracles))
	ixnCalls.push(
		program.initializeBorrowPositionInstruction(
			pools,
			mockUSDCTokenAccountInfo.address,
			onassetTokenAccountInfo.address,
			toCloneScale(onassetAmount),
			toScale(collateralAmount, program.clone.collateral.scale),
			onassetIndex
		)
	)
	await sendAndConfirm(program.provider, ixnCalls, setTxState, feeLevel)

	return {
		result: true
	}
}

type BorrowFormData = {
	onassetIndex: number
	collateralAmount: number
	onassetAmount: number
}
interface CallBorrowProps {
	program: CloneClient
	userPubKey: PublicKey | null
	setTxState: (state: TransactionStateType) => void
	data: BorrowFormData
	feeLevel: FeeLevel
}
export function useBorrowMutation(userPubKey: PublicKey | null) {
	const queryClient = useQueryClient()
	const wallet = useAnchorWallet()
	const { getCloneApp } = useClone()
	const { setTxState } = useTransactionState()
	const feeLevel = useAtomValue(priorityFee)

	if (wallet) {
		return useMutation({
			mutationFn: async (data: BorrowFormData) => callBorrow({ program: await getCloneApp(wallet), userPubKey, setTxState, data, feeLevel }),
			onSuccess: () => {
				queryClient.invalidateQueries({ queryKey: ['cometBalance'] })
			}
		})
	} else {
		return useMutation({ mutationFn: (_: BorrowFormData) => funcNoWallet() })
	}
}
