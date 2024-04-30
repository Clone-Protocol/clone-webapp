import { useQuery } from '@tanstack/react-query'
import { PublicKey } from '@solana/web3.js'
import { CloneClient } from 'clone-protocol-sdk/sdk/src/clone'
import { useClone } from '~/hooks/useClone'
import { useAnchorWallet } from '@solana/wallet-adapter-react'
import { REFETCH_SHORT_CYCLE } from '~/components/Common/DataLoadingIndicator'

export const fetchStakingInfo = async ({
	program,
	userPubKey,
}: {
	program: CloneClient
	userPubKey: PublicKey | null
}) => {
	if (!userPubKey) return

	console.log('fetchStakingInfo :: StakingInfo.query')

	let stakedAmt = 15000.34
	let balance = 100

	return {
		stakedAmt,
		balance,
	}
}

export interface DetailInfo {
	stakedAmt: number
	balance: number
}

interface GetProps {
	userPubKey: PublicKey | null
	refetchOnMount?: boolean | "always"
	enabled?: boolean
}

export function useStakingInfoQuery({ userPubKey, refetchOnMount, enabled = true }: GetProps) {
	const wallet = useAnchorWallet()
	const { getCloneApp } = useClone()
	if (wallet) {
		return useQuery({
			queryKey: ['stakingInfo', wallet, userPubKey],
			queryFn: async () => fetchStakingInfo({ program: await getCloneApp(wallet), userPubKey }),
			refetchOnMount,
			refetchInterval: REFETCH_SHORT_CYCLE,
			refetchIntervalInBackground: true,
			enabled,
		})
	} else {
		return useQuery({ queryKey: ['stakingInfo'], queryFn: () => { return null } })
	}
}
