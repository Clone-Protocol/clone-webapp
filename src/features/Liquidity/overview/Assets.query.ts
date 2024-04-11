import { useQuery } from '@tanstack/react-query'
import { CloneClient } from "clone-protocol-sdk/sdk/src/clone"
import { assetMapping, AssetType, MAX_POOLS_FOR_SHOW } from '~/data/assets'
import { FilterType } from '~/data/filter'
import { REFETCH_CYCLE } from '~/components/Common/DataLoadingIndicator'
import { getAggregatedPoolStats, getiAssetInfos } from '~/utils/assets';
import { useAtomValue, useSetAtom } from 'jotai'
import { getCloneClient } from '~/features/baseQuery'
import { cloneClient, rpcEndpoint, showPythBanner } from '~/features/globalAtom'
import { fetchPythPriceHistory } from '~/utils/pyth'
import { Status } from 'clone-protocol-sdk/sdk/generated/clone'

export const fetchAssets = async ({ setShowPythBanner, mainCloneClient, networkEndpoint }: { setShowPythBanner: (show: boolean) => void, mainCloneClient?: CloneClient | null, networkEndpoint: string }) => {
	console.log('fetchAssets - Overview')

	let program
	if (mainCloneClient) {
		program = mainCloneClient
	} else {
		const { cloneClient: cloneProgram } = await getCloneClient(networkEndpoint)
		program = cloneProgram
	}

	const pools = await program.getPools();
	const iassetInfos = await getiAssetInfos(program.provider.connection, program);
	const poolStats = await getAggregatedPoolStats(pools)

	// Fetch Pyth
	let pythData
	try {
		pythData = await Promise.all(
			iassetInfos.map((info) => {
				let { pythSymbol } = assetMapping(info.poolIndex)
				return fetchPythPriceHistory(
					pythSymbol, '1D'
				)
			})
		)
	} catch (e) {
		console.error(e)
	}

	const result: AssetList[] = []

	//for (let i = 0; i < iassetInfos.length; i++) {
	for (let i = 0; i < MAX_POOLS_FOR_SHOW; i++) {
		const info = iassetInfos[i]
		const { tickerName, tickerSymbol, tickerIcon, ticker, assetType } = assetMapping(info.poolIndex)
		const stats = poolStats[info.poolIndex]

		let change24h = 0
		if (pythData && pythData.length > 0) {
			const priceData = pythData[i]

			const openPrice = priceData[0] ? Number(priceData[0].price) : 0
			const closePrice = priceData[0] ? Number(priceData.at(-1)!.price) : 0
			change24h = priceData[0] ? (closePrice / openPrice - 1) * 100 : 0
		}

		result.push({
			id: info.poolIndex,
			tickerName,
			tickerSymbol,
			tickerIcon,
			ticker,
			price: info.poolPrice,
			assetType,
			liquidity: parseInt(info.liquidity.toString()),
			volume24h: stats.volumeUSD,
			change24h,
			feeRevenue24h: stats.fees,
			avgAPY24h: stats.apy,
			status: info.status
		})
	}

	//show pyth banner if found that the status is frozen
	const isFrozenFoundIndex = result.findIndex((asset) => asset.status === Status.Frozen)
	if (isFrozenFoundIndex !== -1) {
		setShowPythBanner(true)
	}

	return result
}

interface GetAssetsProps {
	filter: FilterType
	searchTerm: string
	refetchOnMount?: boolean | "always"
	enabled?: boolean
}

export interface AssetList {
	id: number
	tickerName: string
	tickerSymbol: string
	tickerIcon: string
	ticker: string
	price: number
	assetType: number
	liquidity: number
	volume24h: number
	change24h: number
	feeRevenue24h: number
	avgAPY24h: number
	status: Status
}

export function useAssetsQuery({ filter, searchTerm, refetchOnMount, enabled = true }: GetAssetsProps) {
	const setShowPythBanner = useSetAtom(showPythBanner)
	const mainCloneClient = useAtomValue(cloneClient)
	const networkEndpoint = useAtomValue(rpcEndpoint)

	let queryFunc
	try {
		queryFunc = () => fetchAssets({ setShowPythBanner, mainCloneClient, networkEndpoint })
	} catch (e) {
		console.error(e)
		queryFunc = () => []
	}

	return useQuery({
		queryKey: ['assets'],
		queryFn: queryFunc,
		refetchOnMount,
		refetchInterval: REFETCH_CYCLE,
		refetchIntervalInBackground: true,
		enabled,
		select: (assets) => {
			let filteredAssets = assets

			filteredAssets = assets.filter((asset) => {
				if (filter === 'all') {
					return asset.assetType === AssetType.Crypto || asset.assetType === AssetType.Commodities
				} else if (filter === 'onCrypto') {
					return asset.assetType === AssetType.Crypto
				} else if (filter === 'onCommodity') {
					return asset.assetType === AssetType.Commodities
				}
				return true;
			})

			if (searchTerm && searchTerm.length > 0) {
				filteredAssets = filteredAssets.filter((asset) => asset.tickerName.toLowerCase().includes(searchTerm.toLowerCase()) || asset.tickerSymbol.toLowerCase().includes(searchTerm.toLowerCase()))
			}
			return filteredAssets
		}
	})
}
