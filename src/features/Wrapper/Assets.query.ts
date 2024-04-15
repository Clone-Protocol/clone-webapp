import { useQuery } from '@tanstack/react-query'
import { PublicKey } from '@solana/web3.js'
import { CloneClient } from "clone-protocol-sdk/sdk/src/clone"
import { useClone } from '~/hooks/useClone'
import { AssetType, MAX_POOLS_FOR_SHOW, assetMapping } from '~/data/assets'
import { useAnchorWallet } from '@solana/wallet-adapter-react'
import { Status } from 'clone-protocol-sdk/sdk/generated/clone'
import { showPoolStatus } from '~/components/Common/PoolStatus'

export const fetchAssets = async ({ program, userPubKey }: { program: CloneClient, userPubKey: PublicKey | null }) => {
	if (!userPubKey) return null
	console.log('fetchAssets - Wrapper')

	const pools = await program.getPools()

	const result: AssetList[] = []
	console.log('pool', pools.pools)
	//MAX_POOLS_FOR_SHOW
	for (let index = 0; index < MAX_POOLS_FOR_SHOW; index++) {
		const { wrapTickerName, wrapTickerSymbol, tickerIcon, assetType } = assetMapping(index)
		const status = pools.pools[index].status
		result.push({
			id: index,
			tickerName: wrapTickerName,
			tickerSymbol: wrapTickerSymbol,
			tickerIcon: tickerIcon,
			assetType: assetType,
			balance: 0,
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
			queryKey: ['wrap-assets', wallet, userPubKey],
			queryFn: async () => fetchAssets({ program: await getCloneApp(wallet), userPubKey }),
			refetchOnMount,
			enabled,
			select: (assets) => {
				let filteredAssets = assets
				if (filteredAssets) {
					filteredAssets = filteredAssets.filter((asset) => {
						return !showPoolStatus(asset.status) && (asset.assetType === AssetType.Crypto || asset.assetType === AssetType.Commodities)
						// return (asset.assetType === AssetType.Crypto || asset.assetType === AssetType.Commodities)
					})
				}
				if (filteredAssets && searchTerm && searchTerm.length > 0) {
					filteredAssets = filteredAssets.filter((asset) => asset.tickerName.toLowerCase().includes(searchTerm.toLowerCase()) || asset.tickerSymbol.toLowerCase().includes(searchTerm.toLowerCase()))
				}

				return filteredAssets
			}
		})
	} else {
		return useQuery({ queryKey: ['wrap-assets'], queryFn: () => [] })
	}
}
