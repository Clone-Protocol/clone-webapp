import { useQuery } from '@tanstack/react-query'
import { PublicKey } from '@solana/web3.js'
import { CloneClient } from 'clone-protocol-sdk/sdk/src/clone'
import { useClone } from '~/hooks/useClone'
import { REFETCH_CYCLE } from '~/components/Common/DataLoadingIndicator'
import { getCollateralAccount } from '~/utils/token_accounts'
import { useAnchorWallet } from '@solana/wallet-adapter-react'
import { Collateral as StableCollateral, collateralMapping } from '~/data/assets'

export const fetchCollaterals = async ({
	program,
	userPubKey,
}: {
	program: CloneClient
	userPubKey: PublicKey | null
}) => {
	if (!userPubKey) return []

	console.log('fetchPools :: Collaterals.query')

	let collBalance = 0
	const collateralAssociatedTokenAccount = await getCollateralAccount(program)

	if (collateralAssociatedTokenAccount.isInitialized) {
		const collateralTokenBalance = await program.provider.connection.getTokenAccountBalance(collateralAssociatedTokenAccount.address)
		collBalance = collateralTokenBalance.value.uiAmount!
	}

	const onUSDInfo = collateralMapping(StableCollateral.onUSD)
	const result: CollateralList[] = [
		{
			id: 0,
			tickerName: onUSDInfo.collateralName,
			tickerSymbol: onUSDInfo.collateralSymbol,
			tickerIcon: onUSDInfo.collateralIcon,
			balance: collBalance,
			isEnabled: true,
		},
	]
	return result
}

interface GetProps {
	userPubKey: PublicKey | null
	refetchOnMount?: boolean | "always"
	enabled?: boolean
}

export interface CollateralList {
	id: number
	tickerName: string
	tickerSymbol: string
	tickerIcon: string
	balance: number
	isEnabled: boolean
}

export function useCollateralsQuery({ userPubKey, refetchOnMount, enabled = true }: GetProps) {
	const wallet = useAnchorWallet()
	const { getCloneApp } = useClone()

	if (wallet) {
		return useQuery({
			queryKey: ['collaterals', wallet, userPubKey],
			queryFn: async () => fetchCollaterals({ program: await getCloneApp(wallet), userPubKey }),

			refetchOnMount,
			refetchInterval: REFETCH_CYCLE,
			refetchIntervalInBackground: true,
			enabled,
		})
	} else {
		return useQuery({ queryKey: ['collaterals'], queryFn: () => [] })
	}
}
