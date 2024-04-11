import { useQuery } from '@tanstack/react-query'
import { PublicKey } from '@solana/web3.js'
import { CloneClient } from "clone-protocol-sdk/sdk/src/clone"
import { useClone } from '~/hooks/useClone'
import { FilterType } from '~/data/filter'
import { assetMapping, collateralMapping, AssetType } from '~/data/assets'
import { REFETCH_SHORT_CYCLE } from '~/components/Common/DataLoadingIndicator'
import { getUserMintInfos } from '~/utils/user'
import { useAnchorWallet } from '@solana/wallet-adapter-react'
import { Collateral } from '~/data/assets'
import { Status } from 'clone-protocol-sdk/sdk/generated/clone'

export const fetchAssets = async ({ program, userPubKey }: { program: CloneClient, userPubKey: PublicKey | null }) => {
	if (!userPubKey) return []

	console.log('fetchPools :: Borrow.query')

	const result: AssetList[] = []

	const [poolsData, oraclesData, userAccountData] = await Promise.allSettled([
		program.getPools(), program.getOracles(), program.getUserAccount()
	]);

	if (poolsData.status === "fulfilled" && oraclesData.status === "fulfilled" && userAccountData.status === "fulfilled") {
		const mintInfos = getUserMintInfos(program, poolsData.value, oraclesData.value, userAccountData.value.borrows);

		let i = 0
		for (const info of mintInfos) {
			const { tickerName, tickerSymbol, tickerIcon, assetType } = assetMapping(info.poolIndex)
			const { collateralName, collateralType } = collateralMapping(Collateral.onUSD)

			result.push({
				id: i,
				tickerName: tickerName,
				tickerSymbol: tickerSymbol,
				tickerIcon: tickerIcon,
				collateralName: collateralName,
				oPrice: info.price,
				assetType: assetType,
				collateralType: collateralType,
				borrowed: info.borrowedOnasset,
				collateral: info.collateralAmount,
				collateralRatio: info.collateralRatio * 100,
				minCollateralRatio: info.minCollateralRatio * 100,
				status: info.status
			})
			i++
		}
	}
	return result
}

interface GetAssetsProps {
	userPubKey: PublicKey | null
	filter: FilterType
	refetchOnMount?: boolean | "always"
	enabled?: boolean
}

export interface AssetList {
	id: number
	tickerName: string
	tickerSymbol: string
	tickerIcon: string
	collateralName: string
	oPrice: number | Number
	assetType: number
	collateralType: number
	borrowed: number | Number
	collateral: number | Number
	collateralRatio: number | Number
	minCollateralRatio: number | Number
	status: Status
}

export function useBorrowQuery({ userPubKey, filter, refetchOnMount, enabled = true }: GetAssetsProps) {
	const wallet = useAnchorWallet()
	const { getCloneApp } = useClone()
	if (wallet) {
		return useQuery({
			queryKey: ['borrowAssets', wallet, userPubKey, filter],
			queryFn: async () => fetchAssets({ program: await getCloneApp(wallet), userPubKey }),
			refetchOnMount,
			refetchInterval: REFETCH_SHORT_CYCLE,
			refetchIntervalInBackground: true,
			enabled,
			select: (assets) => {
				return assets.filter((asset) => {
					if (filter === 'all') {
						return asset.assetType === AssetType.Crypto || asset.assetType === AssetType.Commodities
					} else if (filter === 'crypto') {
						return asset.assetType === AssetType.Crypto
					} else if (filter === 'commodities') {
						return asset.assetType === AssetType.Commodities
					}
					return true;
				})
			}
		})
	} else {
		return useQuery({ queryKey: ['borrowAssets'], queryFn: () => [] })
	}
}