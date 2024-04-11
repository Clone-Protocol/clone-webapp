import { useQuery } from '@tanstack/react-query'
import { PublicKey } from '@solana/web3.js'
import { CloneClient } from "clone-protocol-sdk/sdk/src/clone"
import { useClone } from '~/hooks/useClone'
import { AssetType, MAX_POOLS_FOR_SHOW, assetMapping } from '~/data/assets'
import { useAnchorWallet } from '@solana/wallet-adapter-react'
import { Pools, Status } from 'clone-protocol-sdk/sdk/generated/clone'
import { getAssociatedTokenAddress } from "@solana/spl-token";
import { showPoolStatus } from '~/components/Common/PoolStatus'

const fetchIassetBalances = async (program: CloneClient, pools: Pools): Promise<number[]> => {
	const balancesQueries = await Promise.allSettled(
		pools.pools.slice(0, pools.pools.length).map(async (pool) => {
			const ata = await getAssociatedTokenAddress(
				pool.assetInfo.onassetMint,
				program.provider.publicKey!
			);
			const balance = await program.provider.connection.getTokenAccountBalance(
				ata
			);
			return balance.value.uiAmount !== null ? balance.value.uiAmount : 0;
		})
	);

	return balancesQueries.map((query) => {
		if (query.status === "rejected")
			return 0;

		return query.value!
	})
}

export const fetchAssets = async ({ program, userPubKey }: { program: CloneClient, userPubKey: PublicKey | null }) => {
	if (!userPubKey) return null
	console.log('fetchAssets - Borrow')

	const pools = await program.getPools()
	const balances = await fetchIassetBalances(program, pools);

	const result: AssetList[] = []
	//for (let index = 0; index < pools.pools.length; index++) {
	for (let index = 0; index < MAX_POOLS_FOR_SHOW; index++) {
		const { tickerName, tickerSymbol, tickerIcon, assetType } = assetMapping(index)
		const status = pools.pools[index].status
		result.push({
			id: index,
			tickerName: tickerName,
			tickerSymbol: tickerSymbol,
			tickerIcon: tickerIcon,
			assetType: assetType,
			balance: balances[index],
			status
		})
	}
	return result
}

interface GetAssetsProps {
	searchTerm: string
	userPubKey: PublicKey | null
	enabled?: boolean
	refetchOnMount?: boolean | "always"
}

interface AssetList {
	id: number
	tickerName: string
	tickerSymbol: string
	tickerIcon: string
	assetType: number
	balance: number
	status: Status
}

export function useAssetsQuery({ searchTerm, userPubKey, enabled = true, refetchOnMount }: GetAssetsProps) {
	const wallet = useAnchorWallet()
	const { getCloneApp } = useClone()

	if (wallet) {
		return useQuery({
			queryKey: ['assets', wallet, userPubKey],
			queryFn: async () => fetchAssets({ program: await getCloneApp(wallet), userPubKey }),
			refetchOnMount,
			enabled,
			select: (assets) => {
				let filteredAssets = assets
				if (filteredAssets) {
					filteredAssets = filteredAssets.filter((asset) => {
						return !showPoolStatus(asset.status) && (asset.assetType === AssetType.Crypto || asset.assetType === AssetType.Commodities)
					})
				}
				if (filteredAssets && searchTerm && searchTerm.length > 0) {
					filteredAssets = filteredAssets.filter((asset) => asset.tickerName.toLowerCase().includes(searchTerm.toLowerCase()) || asset.tickerSymbol.toLowerCase().includes(searchTerm.toLowerCase()))
				}

				return filteredAssets
			}
		})
	} else {
		return useQuery({ queryKey: ['assets'], queryFn: () => [] })
	}
}
