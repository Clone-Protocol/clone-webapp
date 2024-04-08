import { PublicKey, TransactionInstruction } from '@solana/web3.js'
import { CloneClient, toCloneScale, toScale } from 'clone-protocol-sdk/sdk/src/clone'
import { QueryClient, useMutation, useQueryClient } from '@tanstack/react-query'
import { useClone } from '~/hooks/useClone'
import { getCollateralAccount, getTokenAccount } from '~/utils/token_accounts'
import { createAssociatedTokenAccountInstruction } from "@solana/spl-token";
import { useAnchorWallet } from '@solana/wallet-adapter-react';
import { TransactionStateType, useTransactionState } from "~/hooks/useTransactionState"
import { funcNoWallet } from '../baseQuery';
import { sendAndConfirm } from '~/utils/tx_helper'
import { useAtomValue } from 'jotai'
import { priorityFee } from '../globalAtom'
import { FeeLevel } from '~/data/networks'
import { AnchorProvider } from '@coral-xyz/anchor'

export const callTrading = async ({
	program,
	userPubKey,
	setTxState,
	data,
	feeLevel,
	retryFunc,
	queryClient
}: CallTradingProps) => {
	if (!userPubKey) throw new Error('no user public key')

	console.log('callTrading')

	let {
		quantity,
		quantityIsCollateral,
		quantityIsInput,
		poolIndex,
		slippage,
	} = data
	quantity = Number(quantity)

	const pools = await program.getPools();
	const oracles = await program.getOracles();
	const pool = pools.pools[poolIndex]

	let ixns: TransactionInstruction[] = []

	let collateralTokenAccountInfo = await getCollateralAccount(program);
	let onassetTokenAccountInfo = await getTokenAccount(pool.assetInfo.onassetMint, userPubKey, program.provider.connection);
	let treasuryCollateralAssociatedTokenInfo = await getTokenAccount(
		program.clone.collateral.mint,
		program.clone.treasuryAddress,
		program.provider.connection
	);
	let treasuryOnassetAssociatedTokenInfo = await getTokenAccount(
		pool.assetInfo.onassetMint,
		program.clone.treasuryAddress,
		program.provider.connection
	);

	const userIsTreasury = program.clone.treasuryAddress.equals(userPubKey);

	// If user is the treasury, skip the checks for associated token accounts
	if (!userIsTreasury) {
		if (!collateralTokenAccountInfo.isInitialized) {
			ixns.push(
				createAssociatedTokenAccountInstruction(
					userPubKey,
					collateralTokenAccountInfo.address,
					userPubKey,
					program.clone.collateral.mint,
				)
			)
		}
		if (!onassetTokenAccountInfo.isInitialized) {
			ixns.push(
				createAssociatedTokenAccountInstruction(
					userPubKey,
					onassetTokenAccountInfo.address,
					userPubKey,
					pool.assetInfo.onassetMint,
				)
			)
		}
	}
	// If treasury doesn't have associated token accounts, create them
	if (!treasuryCollateralAssociatedTokenInfo.isInitialized) {
		ixns.push(
			createAssociatedTokenAccountInstruction(
				userPubKey,
				treasuryCollateralAssociatedTokenInfo.address,
				program.clone.treasuryAddress,
				program.clone.collateral.mint,
			)
		);
	}
	if (!treasuryOnassetAssociatedTokenInfo.isInitialized) {
		ixns.push(
			createAssociatedTokenAccountInstruction(
				userPubKey,
				treasuryOnassetAssociatedTokenInfo.address,
				program.clone.treasuryAddress,
				pool.assetInfo.onassetMint,
			)
		);
	}

	const collateralScale = program.clone.collateral.scale

	const scaledQuantity = quantityIsCollateral ? toScale(quantity, collateralScale) : toCloneScale(quantity)
	const threshold = data.estimatedSwapResult * (quantityIsInput ? 1. - slippage : 1. + slippage);
	const scaledThreshold = (quantityIsCollateral && quantityIsInput) || (!quantityIsCollateral && !quantityIsInput) ? toCloneScale(threshold) : toScale(threshold, collateralScale)

	ixns.push(program.updatePricesInstruction(oracles))
	ixns.push(program.swapInstruction(
		poolIndex,
		scaledQuantity,
		quantityIsInput,
		quantityIsCollateral,
		scaledThreshold,
		pool.assetInfo.onassetMint,
		collateralTokenAccountInfo.address,
		onassetTokenAccountInfo.address,
		treasuryCollateralAssociatedTokenInfo.address,
		treasuryOnassetAssociatedTokenInfo.address,
	))

	//socket handler
	const subscriptionId = program.provider.connection.onAccountChange(
		program.getPoolsAddress(),
		async (updatedAccountInfo) => {
			console.log("Updated account info: ", updatedAccountInfo)
			// const pools = await Pools.fromAccountInfo(updatedAccountInfo, 0)[0]
			// console.log(pools)

			//if success, invalidate query
			queryClient.invalidateQueries({ queryKey: ['portfolioBalance'] })
			queryClient.invalidateQueries({ queryKey: ['marketDetail'] })
			queryClient.invalidateQueries({ queryKey: ['userBalance'] })

			await program.provider.connection.removeAccountChangeListener(subscriptionId);
		},
		"confirmed"
	)
	console.log('Starting web socket, subscription ID: ', subscriptionId);

	const result = await sendAndConfirm(program.provider as AnchorProvider, ixns, setTxState, feeLevel, retryFunc)
	return {
		result
	}
}

type FormData = {
	quantity: number,
	quantityIsCollateral: boolean,
	quantityIsInput: boolean,
	poolIndex: number,
	slippage: number,
	estimatedSwapResult: number,
}
interface CallTradingProps {
	program: CloneClient
	userPubKey: PublicKey | null
	setTxState: (state: TransactionStateType) => void
	data: FormData
	feeLevel: FeeLevel
	retryFunc?: (txHash: string) => void
	queryClient: QueryClient
}
export function useTradingMutation(userPubKey: PublicKey | null, retryFunc?: (txHash: string) => void) {
	const queryClient = useQueryClient()
	const wallet = useAnchorWallet()
	const { getCloneApp } = useClone()
	const { setTxState } = useTransactionState()
	const feeLevel = useAtomValue(priorityFee)

	if (wallet) {
		return useMutation({
			mutationFn: async (data: FormData) => callTrading({ program: await getCloneApp(wallet), userPubKey, setTxState, data, feeLevel, retryFunc, queryClient }),
			onSuccess: () => {
				queryClient.invalidateQueries({ queryKey: ['portfolioBalance'] })
			}
		})
	} else {
		return useMutation({ mutationFn: (_: FormData) => funcNoWallet() })
	}
}