import { useEffect } from 'react'
import { useAtom, useAtomValue, useSetAtom } from 'jotai'
import { useSnackbar } from 'notistack'
import { useAnchorWallet, useWallet } from '@solana/wallet-adapter-react'
import { TransactionInstruction } from "@solana/web3.js";
import { useClone } from '~/hooks/useClone'
import { getTokenAccount } from '~/utils/token_accounts'
import { createAssociatedTokenAccountInstruction, getAssociatedTokenAddress } from "@solana/spl-token"
import { CreateAccountDialogStates } from '~/utils/constants'
import { createAccountDialogState, declinedAccountCreationState, isCreatingAccountState, priorityFee } from '~/features/globalAtom'
import { useTransactionState } from "~/hooks/useTransactionState"
import { sendAndConfirm } from '~/utils/tx_helper';

export function useCreateAccount() {
	const [isCreatingAccount, setIsCreatingAccount] = useAtom(isCreatingAccountState)
	const { getCloneApp } = useClone()
	const { publicKey } = useWallet()
	const wallet = useAnchorWallet()
	const feeLevel = useAtomValue(priorityFee)
	const setCreateAccountDialogStatus = useSetAtom(createAccountDialogState)
	const setDeclinedAccountCreation = useSetAtom(declinedAccountCreationState)
	const { enqueueSnackbar } = useSnackbar()
	const { setTxState } = useTransactionState()

	useEffect(() => {
		async function createAccount() {
			if (wallet) {
				try {
					const program = await getCloneApp(wallet, true)

					let ixnCalls: Promise<TransactionInstruction>[] = []

					const onusdTokenAccount = await getTokenAccount(program.clone.collateral.mint, publicKey!, program.provider.connection);
					const associatedToken = await getAssociatedTokenAddress(
						program.clone.collateral.mint,
						publicKey!
					);

					if (onusdTokenAccount === undefined) {
						ixnCalls.push(
							(async () => createAssociatedTokenAccountInstruction(
								publicKey!,
								associatedToken,
								publicKey!,
								program.clone.collateral.mint
							))()
						)
					}

					ixnCalls.push(
						(async () =>
							program.initializeUserInstruction()
						)()
					)

					let ixns = await Promise.all(ixnCalls)

					const txHash = await sendAndConfirm(program.provider, ixns, setTxState, feeLevel)

					console.log('txHash', txHash)

					// store account to localstorage
					if (txHash) {
						console.log('store account')
						setCreateAccountDialogStatus(CreateAccountDialogStates.Closed)
						//hacky sync
						location.reload()
					}
				} catch (err) {
					console.log(err)
					console.log('err: Attempt to debit an account but found no record of a prior credit.')
					setDeclinedAccountCreation(true)
					enqueueSnackbar('Attempt to debit an account but found no record of a prior credit. Get SOL in Faucet or exchanges')
				} finally {
					setIsCreatingAccount(false)
				}
			}
		}

		if (isCreatingAccount) {
			createAccount()
		}

	}, [wallet, isCreatingAccount])
}
