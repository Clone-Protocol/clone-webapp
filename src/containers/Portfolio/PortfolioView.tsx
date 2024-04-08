import { useEffect, useState } from 'react'
import BalanceView from '~/components/Portfolio/BalanceView'
import { useWallet } from '@solana/wallet-adapter-react'
import { useBalanceQuery } from '~/features/Portfolio/Balance.query'
import { Box } from '@mui/material'
import { LoadingProgress } from '~/components/Common/Loading'
import { useUserBalanceQuery } from '~/features/Portfolio/UserBalance.query'
import StableAssetList from '~/containers/Portfolio/StableAssetList'
import OnAssetList from './OnAssetList'
import { FilterTypeMap, PieItem } from '~/data/filter'
import withSuspense from '~/hocs/withSuspense'
import { useAtom } from 'jotai'
import { DEFAULT_ALL_INDEX, STABLE_COIN_INDEX, filterState } from '~/features/Portfolio/filterAtom'
import { showPoolStatus } from '~/components/Common/PoolStatus'

interface ResultAsset {
	id: number
	name: string
	val: number
}

const PortfolioView = () => {
	const { publicKey } = useWallet()
	const [selectedFilter, setSelectedFilter] = useAtom(filterState)
	const filterType = selectedFilter //as FilterType
	const [dataPie, setDataPie] = useState<PieItem[]>([])

	const { data: balance } = useBalanceQuery({
		userPubKey: publicKey,
		refetchOnMount: 'always',
		enabled: publicKey != null
	})

	const { data: assets } = useUserBalanceQuery({
		userPubKey: publicKey,
		// filter: filterType,
		selectedFilter,
		refetchOnMount: 'always',
		enabled: publicKey != null
	})

	useEffect(() => {
		const onusdBalance = balance?.onusdVal!
		// only called when filter is all
		if (selectedFilter === DEFAULT_ALL_INDEX) {
			const result: ResultAsset[] = []
			let totalBalance = onusdBalance
			assets?.filter(asset => !showPoolStatus(asset.status)).forEach((asset) => {
				// if (result[asset.assetType]) {
				// 	result[asset.assetType].val += asset.onusdBalance
				// } else {
				result[asset.id] = {
					id: asset.id,
					name: asset.tickerSymbol,
					val: asset.onusdBalance
				}
				// }
				totalBalance += asset.onusdBalance
			})

			const ordered = result.sort((a, b) => a.val < b.val ? 1 : -1)
			const finalPie = ordered.map((item) => {
				const percentVal = totalBalance > 0 ? Math.round(item.val * 100 / totalBalance) : 0
				// if (item.id === AssetType.Crypto) {
				// 	return { key: 'onCrypto', name: FilterTypeMap.onCrypto, value: percentVal, onusdAmount: item.val } as PieItem
				// }
				return { key: item.id, name: item.name, value: percentVal, onusdAmount: item.val } as PieItem
			})

			if (totalBalance > 0) {
				finalPie.push(
					{ key: STABLE_COIN_INDEX, name: FilterTypeMap.stableCoin, value: Math.round(100 * onusdBalance / totalBalance), onusdAmount: onusdBalance } as PieItem
				)
			}
			// console.log('f', finalPie)
			setDataPie(finalPie)
		}
	}, [assets, balance?.onusdVal])

	useEffect(() => {
		//unmounted
		return () => {
			setSelectedFilter(DEFAULT_ALL_INDEX)
		}
	}, [])

	return (
		<div>
			<Box display='flex' justifyContent='center'>
				{balance ? <BalanceView data={dataPie} /> : <></>}
			</Box>
			<Box py='30px'>
				{(filterType === DEFAULT_ALL_INDEX || filterType === STABLE_COIN_INDEX) &&
					<Box mb='45px'>
						<StableAssetList balance={balance} />
					</Box>
				}
				{(filterType === DEFAULT_ALL_INDEX || filterType !== STABLE_COIN_INDEX) &&
					<Box>
						<OnAssetList assets={assets} balance={balance} />
					</Box>
				}
			</Box>
		</div>
	)
}

export default withSuspense(PortfolioView, <LoadingProgress />)
