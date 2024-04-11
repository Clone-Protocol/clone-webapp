import { PublicKey, TransactionInstruction } from '@solana/web3.js'
import { CloneClient, toCloneScale, toScale } from 'clone-protocol-sdk/sdk/src/clone'
import { useMutation } from '@tanstack/react-query'
import { useClone } from '~/hooks/useClone'
import { useAnchorWallet } from '@solana/wallet-adapter-react';
import { TransactionStateType, useTransactionState } from "~/hooks/useTransactionState"
import { sendAndConfirm } from '~/utils/tx_helper'
import { useAtomValue } from 'jotai'
import { funcNoWallet } from '~/features/baseQuery'
import { FeeLevel } from '~/data/networks'
import { priorityFee } from '~/features/globalAtom'
import { AnchorProvider } from '@coral-xyz/anchor'
import { createAssociatedTokenAccountInstruction, getMint } from '@solana/spl-token';
import { assetMapping } from "~/data/assets";
import { getTokenAccount } from '~/utils/token_accounts';

export const callTrading = async ({
	program,
	userPubKey,
	setTxState,
	data,
	feeLevel,
}: CallTradingProps) => {
	if (!userPubKey) throw new Error('no user public key')

	let {
		quantity,
		poolIndex,
		isWrap
	} = data
	quantity = Number(quantity)

	const pools = await program.getPools()
	const pool = pools.pools[poolIndex]
	const { underlyingTokenMint } = assetMapping(poolIndex);
	const underlyingMintDecimal = await getMint(program.provider.connection, underlyingTokenMint).then(mint => mint.decimals)
	const userAssetAta = await getTokenAccount(
		underlyingTokenMint,
		program.provider.publicKey!,
		program.provider.connection);
	const userclAssetAta = await getTokenAccount(
		pool.assetInfo.onassetMint,
		program.provider.publicKey!,
		program.provider.connection
	)
	let ixns: TransactionInstruction[] = []

	if (isWrap) {
		// Check if the user has a clAsset ata
		if (!userclAssetAta.isInitialized) {
			ixns.push(
				createAssociatedTokenAccountInstruction(
					program.provider.publicKey!,
					userclAssetAta.address,
					program.provider.publicKey!,
					pool.assetInfo.onassetMint
				)
			)
		}
		// Create wrap instruction
		ixns.push(
			program.wrapAssetInstruction(
				pools,
				toScale(quantity, underlyingMintDecimal),
				poolIndex,
				underlyingTokenMint,
				userAssetAta.address,
				userclAssetAta.address
			)
		)

	} else {
		// Check if the user has a underlying ata
		if (!userAssetAta.isInitialized) {
			ixns.push(
				createAssociatedTokenAccountInstruction(
					program.provider.publicKey!,
					userAssetAta.address,
					program.provider.publicKey!,
					underlyingTokenMint
				)
			)
		}
		// Create wrap instruction
		ixns.push(
			program.unwrapOnassetInstruction(
				pools,
				toCloneScale(quantity),
				poolIndex,
				underlyingTokenMint,
				userAssetAta.address,
				userclAssetAta.address
			)
		)
	}

	await sendAndConfirm(program.provider as AnchorProvider, ixns, setTxState, feeLevel)

	return {
		result: true
	}
}

type FormData = {
	quantity: number,
	isWrap: boolean,
	poolIndex: number,
}
interface CallTradingProps {
	program: CloneClient
	userPubKey: PublicKey | null
	setTxState: (state: TransactionStateType) => void
	data: FormData
	feeLevel: FeeLevel
}
export function useTradingMutation(userPubKey: PublicKey | null) {
	const wallet = useAnchorWallet()
	const { getCloneApp } = useClone()
	const { setTxState } = useTransactionState()
	const feeLevel = useAtomValue(priorityFee)

	if (wallet) {
		return useMutation({ mutationFn: async (data: FormData) => callTrading({ program: await getCloneApp(wallet), userPubKey, setTxState, data, feeLevel }) })
	} else {
		return useMutation({ mutationFn: (_: FormData) => funcNoWallet() })
	}
}