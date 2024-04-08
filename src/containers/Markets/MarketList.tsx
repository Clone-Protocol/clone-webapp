'use client'
import { Box, Theme, Typography, useMediaQuery } from '@mui/material'
import { GridColDef, GridRenderCellParams } from '@mui/x-data-grid'
import { useAssetsQuery } from '~/features/Markets/Assets.query'
import { FilterType } from '~/data/filter'
import { LoadingProgress } from '~/components/Common/Loading'
import withSuspense from '~/hocs/withSuspense'
import { CustomNoRowsOverlay } from '~/components/Common/DataGrid'
import { Grid, CellTicker } from '~/components/Common/DataGrid'
import { GridEventListener } from '@mui/x-data-grid'
import { useRouter } from 'next/navigation'
import ArrowUpward from 'public/images/arrow-up-green.svg'
import ArrowDownward from 'public/images/arrow-down-red.svg'
import Image from 'next/image'
import { formatDollarAmount, formatLocaleAmount } from '~/utils/numbers'
import { ASSETS, AssetTickers } from '~/data/assets'
import { useCallback } from 'react'
import { ON_USD, RootMarketsDir } from '~/utils/constants'
import { PoolStatusButton, showPoolStatus } from '~/components/Common/PoolStatus'

const MarketList = () => {
	const router = useRouter()
	// const [filter, setFilter] = useState<FilterType>('all')
	const filter: FilterType = 'all'

	const isMobileOnSize = useMediaQuery((theme: Theme) => theme.breakpoints.down('md'))
	const { data: assets } = useAssetsQuery({
		filter,
		refetchOnMount: true,
		searchTerm: '',
		enabled: true
	})

	const Change24hComp = ({ change24h }: { change24h: number }) => {
		if (change24h >= 0) {
			return <Box color='#00ff99' display='flex' alignItems='center' gap={1}>
				<Typography variant={isMobileOnSize ? 'p' : 'p_xlg'}>+{change24h.toFixed(2)}%</Typography>
				<Image src={ArrowUpward} alt='arrowUp' height={isMobileOnSize ? 20 : 25} />
			</Box>
		} else {
			return <Box color='#ff0084' display='flex' alignItems='center' gap={1}>
				<Typography variant={isMobileOnSize ? 'p' : 'p_xlg'}>{change24h.toFixed(2)}%</Typography>
				<Image src={ArrowDownward} alt='arrowDown' height={isMobileOnSize ? 20 : 25} />
			</Box>
		}
	}

	let columns: GridColDef[] = [
		{
			field: 'iAsset',
			headerClassName: 'super-app-theme--header',
			cellClassName: 'super-app-theme--cell',
			headerName: 'clAsset',
			flex: 5,
			renderCell(params: GridRenderCellParams<string>) {
				return (
					<CellTicker tickerIcon={params.row.tickerIcon} tickerName={params.row.tickerName} tickerSymbol={params.row.tickerSymbol} />
				)
			},
		},
		{
			field: 'price',
			headerClassName: 'super-app-theme--header right--header',
			cellClassName: 'super-app-theme--cell right--cell',
			headerName: `Price (${ON_USD})`,
			flex: 3,
			renderCell(params: GridRenderCellParams<string>) {
				return <Box textAlign={isMobileOnSize ? 'right' : 'left'}>
					{isMobileOnSize && showPoolStatus(params.row.status) ?
						<PoolStatusButton status={params.row.status} />
						:
						showPoolStatus(params.row.status) ?
							<></>
							:
							<Box>
								<Typography variant='p_xlg'>${formatLocaleAmount(params.value)}</Typography>
								{isMobileOnSize && <Box display='flex' justifyContent='flex-end'><Change24hComp change24h={params.row.change24h} /></Box>}
							</Box>
					}
				</Box>
			}
		},
		{
			field: '24hChange',
			headerClassName: 'super-app-theme--header right--header',
			cellClassName: 'super-app-theme--cell right--cell',
			headerName: '24h Change',
			flex: 3,
			renderCell(params: GridRenderCellParams<string>) {
				return showPoolStatus(params.row.status) ?
					<></>
					:
					<Change24hComp change24h={params.row.change24h} />
			},
		},
		{
			field: 'liquidity',
			headerClassName: 'super-app-theme--header right--header',
			cellClassName: 'super-app-theme--cell right--cell',
			headerName: 'Liquidity',
			flex: 3,
			renderCell(params: GridRenderCellParams<string>) {
				return showPoolStatus(params.row.status) ?
					<></>
					:
					<Typography variant='p_xlg'>{formatDollarAmount(Number(params.value), 3)}</Typography>
			},
		},
		{
			field: '24hVolume',
			headerClassName: 'super-app-theme--header right--header',
			cellClassName: 'super-app-theme--cell right--cell',
			headerName: '24h Volume',
			flex: 3,
			renderCell(params: GridRenderCellParams<string>) {
				return showPoolStatus(params.row.status) ?
					<PoolStatusButton status={params.row.status} />
					:
					<Typography variant='p_xlg'>{formatDollarAmount(Number(params.row.volume24h), 3)}</Typography>
			},
		},
	]

	columns = columns.map((col) => Object.assign(col, { hideSortIcons: true, filterable: false }))

	// const handleFilterChange = (event: React.SyntheticEvent, newValue: FilterType) => {
	// 	setFilter(newValue)
	// }

	// const handleSearch = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
	// 	const newVal = e.currentTarget.value
	// 	if (newVal) {
	// 		setSearchTerm(newVal)
	// 	} else {
	// 		setSearchTerm('')
	// 	}
	// }, [searchTerm])

	const handleRowClick: GridEventListener<'rowClick'> = useCallback((
		params
	) => {
		if (!showPoolStatus(params.row.status)) {
			router.push(`${RootMarketsDir}/trade/${ASSETS[params.row.id].ticker}`)
		}
	}, [])

	return (
		<Box
			sx={{
				width: '100%',
				background: '#000',
				paddingBottom: '25px',
				color: '#fff',
				borderRadius: '10px',
				'& .super-app-theme--header': { color: '#9d9d9d', fontSize: '11px' },
				'& .non-hover-row': { ':hover': { background: '#000' } }
			}}>

			<Box mb='9px'><Typography variant='p_xlg'>All clAssets on Clone Protocol</Typography></Box>
			<Grid
				headers={columns}
				columnVisibilityModel={isMobileOnSize ? {
					"24hChange": false,
					"liquidity": false,
					"24hVolume": false
				} : {}}
				rows={assets || []}
				minHeight={110}
				customNoResultsOverlay={() => CustomNoRowsOverlay('No assets')}
				onRowClick={handleRowClick}
			/>
		</Box>
	)
}

export default withSuspense(MarketList, <LoadingProgress />)
