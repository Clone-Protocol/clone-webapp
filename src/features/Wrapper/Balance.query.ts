import { useQuery } from '@tanstack/react-query'
import { CloneClient } from "clone-protocol-sdk/sdk/src/clone"
import { PublicKey } from '@solana/web3.js'
import { useClone } from '~/hooks/useClone'
import { useAnchorWallet } from '@solana/wallet-adapter-react';
import { REFETCH_CYCLE } from '~/components/Common/DataLoadingIndicator'
import { assetMapping } from "~/data/assets";
import { getAssociatedTokenAddress } from '@solana/spl-token';
import { getTokenAccount } from '~/utils/token_accounts'

export const fetchBalance = async ({ program, userPubKey, index }: { program: CloneClient, userPubKey: PublicKey | null, index: number }) => {
	if (!userPubKey) return null

	console.log('fetchBalance :: Balance.query')

	const { underlyingTokenMint } = assetMapping(index);
	const pools = await program.getPools();
	const pool = pools.pools[index];
	const underlyingAssetTokenAccount = await getAssociatedTokenAddress(underlyingTokenMint, userPubKey);

	const getAccountBalance = async (tokenAccount: PublicKey) => {
		try {
			return (await program.provider.connection.getTokenAccountBalance(tokenAccount, "confirmed")).value.uiAmount!
		} catch (e) {
			console.error(e)
			return 0
		}
	}
	const classetTokenAccountInfo = await getTokenAccount(pool.assetInfo.onassetMint, userPubKey, program.provider.connection);
	let onassetVal = await getAccountBalance(classetTokenAccountInfo.address);

	let underlyingAssetVal = await getAccountBalance(underlyingAssetTokenAccount);
	let maxUnwrappableVal = await getAccountBalance(pool.underlyingAssetTokenAccount);

	return {
		underlyingAssetVal,
		maxUnwrappableVal,
		onassetVal
	}
}

interface GetProps {
	userPubKey: PublicKey | null
	index?: number
	refetchOnMount?: boolean | "always"
	enabled?: boolean
}

export interface WrapperBalance {
	underlyingAssetVal: number
	maxUnwrappableVal: number
	onassetVal: number
}

export function useBalanceQuery({ userPubKey, index = -1, refetchOnMount, enabled = true }: GetProps) {
	const wallet = useAnchorWallet()
	const { getCloneApp } = useClone()

	if (wallet) {
		return useQuery({
			queryKey: ['wrapperBalance', wallet, userPubKey, index],
			queryFn: async () => fetchBalance({ program: await getCloneApp(wallet), userPubKey, index }),
			refetchOnMount,
			refetchInterval: REFETCH_CYCLE,
			refetchIntervalInBackground: true,
			enabled
		})
	} else {
		return useQuery({ queryKey: ['wrapperBalance'], queryFn: () => ({ underlyingAssetVal: 0, maxUnwrappableVal: 0, onassetVal: 0 }) })
	}
}
