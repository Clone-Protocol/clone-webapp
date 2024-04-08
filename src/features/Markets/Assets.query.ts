import { QueryObserverOptions, useQuery } from '@tanstack/react-query'
import { AssetType, MAX_POOLS_FOR_SHOW, assetMapping } from '~/data/assets'
import { FilterType } from '~/data/filter'
import { getiAssetInfos } from '~/utils/assets';
import { fetchPythPriceHistory } from '~/utils/pyth'
import { useAtomValue, useSetAtom } from 'jotai'
import { cloneClient, rpcEndpoint, showPythBanner } from '~/features/globalAtom'
import { REFETCH_CYCLE } from '~/components/Markets/TradingBox/RateLoadingIndicator';
import { getCloneClient } from '../baseQuery';
import { CloneClient } from 'clone-protocol-sdk/sdk/src/clone';
import { Status } from 'clone-protocol-sdk/sdk/generated/clone';
import { showPoolStatus } from '~/components/Common/PoolStatus';
import { fetchPoolAnalytics } from '~/utils/fetch_netlify';

export const fetchAssets = async ({ setShowPythBanner, mainCloneClient, networkEndpoint }: { setShowPythBanner: (show: boolean) => void, mainCloneClient?: CloneClient | null, networkEndpoint: string }) => {
	console.log('fetchAssets')

	let program
	if (mainCloneClient) {
		program = mainCloneClient
	} else {
		const { cloneClient: cloneProgram } = await getCloneClient(networkEndpoint)
		program = cloneProgram
	}

	const iassetInfos = await getiAssetInfos(program.provider.connection, program);
	const dailyVolumeStats = await fetchPoolAnalytics()

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
		const { tickerName, tickerSymbol, tickerIcon, assetType } = assetMapping(info.poolIndex)

		let change24h = 0
		if (pythData && pythData.length > 0) {
			const priceData = pythData[i]

			const openPrice = priceData && priceData[0] ? Number(priceData[0].price) : 0
			const closePrice = priceData && priceData[0] ? Number(priceData.at(-1)!.price) : 0
			change24h = priceData && priceData[0] ? (closePrice / openPrice - 1) * 100 : 0
		}

		result.push({
			id: info.poolIndex,
			tickerName,
			tickerSymbol,
			tickerIcon,
			price: info.poolPrice,
			assetType,
			liquidity: parseInt(info.liquidity.toString()),
			volume24h: dailyVolumeStats[info.poolIndex]?.current_volume ?? 0,
			change24h,
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
	filterPoolStatus?: boolean
	enabled?: boolean
}

export interface AssetList {
	id: number
	tickerName: string
	tickerSymbol: string
	tickerIcon: string
	price: number
	assetType: number
	liquidity: number
	volume24h: number
	change24h: number
	status: Status
}

export function useAssetsQuery({ filter, searchTerm, refetchOnMount, filterPoolStatus = false, enabled = true }: GetAssetsProps) {
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
			if (filterPoolStatus) {
				filteredAssets = filteredAssets.filter((asset) => !showPoolStatus(asset.status))
			}
			filteredAssets = filteredAssets.filter((asset) => {
				if (filter === 'all') {
					return asset.assetType === AssetType.Crypto || asset.assetType === AssetType.Commodities
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
