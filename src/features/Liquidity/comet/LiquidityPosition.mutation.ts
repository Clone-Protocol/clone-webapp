import { PublicKey, TransactionInstruction } from '@solana/web3.js'
import { useClone } from '~/hooks/useClone'
import { QueryClient, useMutation, useQueryClient } from '@tanstack/react-query'
import { CloneClient, toCloneScale, toScale } from 'clone-protocol-sdk/sdk/src/clone'
import { useAnchorWallet } from '@solana/wallet-adapter-react'
import { funcNoWallet } from '~/features/baseQuery'
import { TransactionStateType, useTransactionState } from "~/hooks/useTransactionState"
import { sendAndConfirm } from '~/utils/tx_helper';
import { getTokenAccount, getCollateralAccount } from '~/utils/token_accounts'
import { getAssociatedTokenAddress, createAssociatedTokenAccountInstruction, createAssociatedTokenAccountIdempotentInstruction, getAssociatedTokenAddressSync } from "@solana/spl-token"
import { PaymentType } from 'clone-protocol-sdk/sdk/generated/clone'
import { useAtomValue } from 'jotai'
import { priorityFee } from '~/features/globalAtom'
import { FeeLevel } from '~/data/networks'
import { BN } from "@coral-xyz/anchor"

export const callNew = async ({ program, userPubKey, setTxState, data, feeLevel }: CallNewProps) => {
	if (!userPubKey) throw new Error('no user public key')

	console.log('new input data', data)

	const { changeAmount, poolIndex } = data
	const oracles = await program.getOracles();

	const ixnCalls = [
		program.updatePricesInstruction(oracles),
		program.addLiquidityToCometInstruction(toScale(changeAmount, program.clone.collateral.scale), poolIndex)
	]
	const ixns = await Promise.all(ixnCalls)
	const result = await sendAndConfirm(program.provider, ixns, setTxState, feeLevel)

	return {
		result
	}
}

type NewFormData = {
	poolIndex: number
	changeAmount: number
}
interface CallNewProps {
	program: CloneClient
	userPubKey: PublicKey | null
	setTxState: (state: TransactionStateType) => void
	data: NewFormData
	feeLevel: FeeLevel
}
export function useNewPositionMutation(userPubKey: PublicKey | null) {
	const wallet = useAnchorWallet()
	const { getCloneApp } = useClone()
	const { setTxState } = useTransactionState()
	const feeLevel = useAtomValue(priorityFee)

	if (wallet) {
		return useMutation({
			mutationFn: async (data: NewFormData) => callNew({ program: await getCloneApp(wallet), userPubKey, setTxState, data, feeLevel })
		})
	} else {
		return useMutation({ mutationFn: (_: NewFormData) => funcNoWallet() })
	}
}


export const callEdit = async ({ program, userPubKey, setTxState, data, feeLevel, queryClient }: CallEditProps) => {
	if (!userPubKey) throw new Error('no user public key')

	// console.log('edit input data', data)

	const [userAccountData, poolsData, collateralAccountResult] = await Promise.allSettled([
		program.getUserAccount(),
		program.getPools(),
		getCollateralAccount(program)
	])

	if (
		userAccountData.status === 'rejected' ||
		poolsData.status === 'rejected' ||
		collateralAccountResult.status === 'rejected'
	) {
		throw new Error('Failed to fetch data!')
	}

	const { positionIndex, changeAmount, editType } = data
	const comet = userAccountData.value.comet
	const cometPosition = comet.positions[positionIndex]
	const poolIndex = cometPosition.poolIndex
	const oracles = await program.getOracles();

	const ixnCalls = [program.updatePricesInstruction(oracles)]
	if (editType === 0) {
		//deposit
		ixnCalls.push(program.addLiquidityToCometInstruction(toScale(changeAmount, program.clone.collateral.scale), poolIndex))
	} else {
		//withdraw
		ixnCalls.push(
			program.withdrawLiquidityFromCometInstruction(
				toScale(changeAmount, program.clone.collateral.scale),
				positionIndex
			))
	}

	const ixns = await Promise.all(ixnCalls)

	//socket handler
	const subscriptionId = program.provider.connection.onAccountChange(
		program.getPoolsAddress(),
		async (updatedAccountInfo) => {
			console.log("Updated account info: ", updatedAccountInfo)

			//if success, invalidate query
			queryClient.invalidateQueries({ queryKey: ['cometInfos'] })
			queryClient.invalidateQueries({ queryKey: ['liquidityPosition'] })
			//hacky retry query
			setTimeout(() => {
				queryClient.invalidateQueries({ queryKey: ['liquidityPosition'] })
			}, 3000)

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
	positionIndex: number
	changeAmount: number
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
export function useEditPositionMutation(userPubKey: PublicKey | null) {
	const queryClient = useQueryClient()
	const wallet = useAnchorWallet()
	const { getCloneApp } = useClone()
	const { setTxState } = useTransactionState()
	const feeLevel = useAtomValue(priorityFee)

	if (wallet) {
		return useMutation({
			mutationFn: async (data: EditFormData) => callEdit({ program: await getCloneApp(wallet), userPubKey, setTxState, data, feeLevel, queryClient }),
			onSuccess: () => {
				// queryClient.invalidateQueries({ queryKey: ['cometInfos'] })
				// queryClient.invalidateQueries({ queryKey: ['liquidityPosition'] })

				// //hacky retry query
				// setTimeout(() => {
				// 	queryClient.invalidateQueries({ queryKey: ['liquidityPosition'] })
				// }, 3000)
			}
		})
	} else {
		return useMutation({ mutationFn: (_: EditFormData) => funcNoWallet() })
	}
}

export const callPayILD = async ({ program, userPubKey, setTxState, data, feeLevel }: CallPayILDProps) => {
	if (!userPubKey) throw new Error('no user public key')

	const [onassetAssociatedTokenAddress, collateralAssociatedTokenAddress] = [
		getAssociatedTokenAddressSync(
			data.onassetMint,
			program.provider.publicKey!,
		),
		getAssociatedTokenAddressSync(
			program.clone.collateral.mint,
			program.provider.publicKey!,
		)
	];

	const pools = await program.getPools()
	const oracles = await program.getOracles();
	const userAccount = await program.getUserAccount()

	// Pay ILD
	const ixnCalls: TransactionInstruction[] = [
		program.updatePricesInstruction(oracles)
	]

	if (toCloneScale(data.onassetILD).gt(new BN(0))) {
		ixnCalls.push(
			createAssociatedTokenAccountIdempotentInstruction(
				program.provider.publicKey!,
				collateralAssociatedTokenAddress,
				program.provider.publicKey!,
				program.clone.collateral.mint,
			),
			program.payCometILDInstruction(
				pools,
				userAccount,
				data.positionIndex,
				toCloneScale(data.ildAssetAmount),
				PaymentType.Onasset,
				onassetAssociatedTokenAddress,
				collateralAssociatedTokenAddress,
			)
		)
	}

	const collateralILD = toScale(data.collateralILD, program.clone.collateral.scale)
	if (collateralILD.gt(new BN(0))) {
		ixnCalls.push(
			createAssociatedTokenAccountIdempotentInstruction(
				program.provider.publicKey!,
				onassetAssociatedTokenAddress,
				program.provider.publicKey!,
				data.onassetMint,
			),
			program.payCometILDInstruction(
				pools,
				userAccount,
				data.positionIndex,
				collateralILD,
				PaymentType.CollateralFromWallet,
				onassetAssociatedTokenAddress,
				collateralAssociatedTokenAddress,
			)
		)
	}
	await sendAndConfirm(program.provider, ixnCalls, setTxState, feeLevel)

	return {
		result: true
	}
}
type PayILDFormData = CloseFormData & {
	ildAssetAmount: number
	ildCollAmount: number
}
interface CallPayILDProps extends CallCloseProps {
	data: PayILDFormData
}
export function usePayILDMutation(userPubKey: PublicKey | null) {
	const queryClient = useQueryClient()
	const wallet = useAnchorWallet()
	const { getCloneApp } = useClone()
	const { setTxState } = useTransactionState()
	const feeLevel = useAtomValue(priorityFee)

	if (wallet) {
		return useMutation({
			mutationFn: async (data: PayILDFormData) => callPayILD({ program: await getCloneApp(wallet), userPubKey, setTxState, data, feeLevel }),
			onSuccess: () => {
				queryClient.invalidateQueries({ queryKey: ['cometInfos'] })
				queryClient.invalidateQueries({ queryKey: ['liquidityPosition'] })
				queryClient.invalidateQueries({ queryKey: ['closeLiquidityPosition'] })

				//hacky retry query
				setTimeout(() => {
					queryClient.invalidateQueries({ queryKey: ['closeLiquidityPosition'] })
				}, 3000)
			}
		})
	} else {
		return useMutation({ mutationFn: (_: PayILDFormData) => funcNoWallet() })
	}
}

export const callRewards = async ({ program, userPubKey, setTxState, data, feeLevel }: CallCloseProps) => {
	if (!userPubKey) throw new Error('no user public key')

	const [onassetAssociatedTokenAddress, collateralAssociatedTokenAddress] = [
		getAssociatedTokenAddressSync(
			data.onassetMint,
			program.provider.publicKey!,
		),
		getAssociatedTokenAddressSync(
			program.clone.collateral.mint,
			program.provider.publicKey!,
		)
	];

	const pools = await program.getPools()
	const oracles = await program.getOracles();
	const userAccount = await program.getUserAccount()

	// Pay ILD
	const ixnCalls: TransactionInstruction[] = [
		program.updatePricesInstruction(oracles),
		createAssociatedTokenAccountIdempotentInstruction(
			program.provider.publicKey!,
			onassetAssociatedTokenAddress,
			program.provider.publicKey!,
			data.onassetMint,
		),
		createAssociatedTokenAccountIdempotentInstruction(
			program.provider.publicKey!,
			collateralAssociatedTokenAddress,
			program.provider.publicKey!,
			program.clone.collateral.mint,
		),
	]

	ixnCalls.push(
		program.collectLpRewardsInstruction(
			pools,
			userAccount,
			collateralAssociatedTokenAddress,
			onassetAssociatedTokenAddress,
			data.positionIndex
		)
	)
	await sendAndConfirm(program.provider, ixnCalls, setTxState, feeLevel)

	return {
		result: true
	}
}

export function useRewardsMutation(userPubKey: PublicKey | null) {
	const queryClient = useQueryClient()
	const wallet = useAnchorWallet()
	const { getCloneApp } = useClone()
	const { setTxState } = useTransactionState()
	const feeLevel = useAtomValue(priorityFee)

	if (wallet) {
		return useMutation({
			mutationFn: async (data: CloseFormData) => callRewards({ program: await getCloneApp(wallet), userPubKey, setTxState, data, feeLevel }),
			onSuccess: () => {
				queryClient.invalidateQueries({ queryKey: ['cometInfos'] })
				queryClient.invalidateQueries({ queryKey: ['liquidityPosition'] })
				queryClient.invalidateQueries({ queryKey: ['closeLiquidityPosition'] })

				//hacky retry query
				setTimeout(() => {
					queryClient.invalidateQueries({ queryKey: ['closeLiquidityPosition'] })
				}, 3000)
			}
		})
	} else {
		return useMutation({ mutationFn: (_: CloseFormData) => funcNoWallet() })
	}
}

export const callClose = async ({ program, userPubKey, setTxState, data, feeLevel }: CallCloseProps) => {
	if (!userPubKey) throw new Error('no user public key')

	const [onassetAssociatedToken] = await Promise.all([
		getTokenAccount(
			data.onassetMint,
			program.provider.publicKey!,
			program.provider.connection
		)
	])

	let onassetAssociatedTokenAddress = onassetAssociatedToken.address
	const oracles = await program.getOracles();

	// withdraw all liquidity
	const ixnCalls: TransactionInstruction[] = [
		program.updatePricesInstruction(oracles)
	]

	if (!onassetAssociatedToken) {
		const ata = await getAssociatedTokenAddress(
			data.onassetMint,
			program.provider.publicKey!
		)
		onassetAssociatedTokenAddress = ata
		ixnCalls.push(
			createAssociatedTokenAccountInstruction(
				program.provider.publicKey!,
				ata,
				program.provider.publicKey!,
				data.onassetMint,
			)
		)
	}

	ixnCalls.push(
		program.removeCometPositionInstruction(data.positionIndex)
	)
	await sendAndConfirm(program.provider, ixnCalls, setTxState, feeLevel)

	return {
		result: true
	}
}

type CloseFormData = {
	positionIndex: number
	onassetILD: number
	collateralILD: number
	collateralBalance: number
	onassetBalance: number
	onassetMint: PublicKey
	committedCollateralLiquidity: number
}
interface CallCloseProps {
	program: CloneClient
	userPubKey: PublicKey | null
	setTxState: (state: TransactionStateType) => void
	data: CloseFormData
	feeLevel: FeeLevel
}
export function useClosePositionMutation(userPubKey: PublicKey | null) {
	const queryClient = useQueryClient()
	const wallet = useAnchorWallet()
	const { getCloneApp } = useClone()
	const { setTxState } = useTransactionState()
	const feeLevel = useAtomValue(priorityFee)

	if (wallet) {
		return useMutation({
			mutationFn: async (data: CloseFormData) => callClose({ program: await getCloneApp(wallet), userPubKey, setTxState, data, feeLevel }),
			onSuccess: () => {
				// queryClient.invalidateQueries({ queryKey: ['cometInfos'] })
			}
		})
	} else {
		return useMutation({ mutationFn: (_: CloseFormData) => funcNoWallet() })
	}
}

