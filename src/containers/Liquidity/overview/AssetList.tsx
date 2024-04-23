import { Box, Stack, Typography } from '@mui/material'
import { styled } from '@mui/material/styles'
import Image from 'next/image'
import { GridColDef, GridRenderCellParams } from '@mui/x-data-grid'
import { useState, useCallback } from 'react'
import { LoadingProgress } from '~/components/Common/Loading'
import withSuspense from '~/hocs/withSuspense'
import { useAssetsQuery } from '~/features/Liquidity/overview/Assets.query'
import ArrowUpward from 'public/images/liquidity/arrow-upward-green.svg'
import ArrowDownward from 'public/images/liquidity/arrow-down-red.svg'
import { Grid, CellTicker } from '~/components/Common/DataGrid'
import SearchInput from '~/components/Liquidity/overview/SearchInput'
import useDebounce from '~/hooks/useDebounce'
import { GridEventListener } from '@mui/x-data-grid'
import { CustomNoRowsOverlay } from '~/components/Common/DataGrid'
import { useRouter } from 'next/navigation'
import { formatDollarAmount, formatLocaleAmount } from '~/utils/numbers'
import { ON_USD, RootLiquidityDir } from '~/utils/constants'
import { PoolStatusButton, showPoolStatus } from '~/components/Common/PoolStatus'

const AssetList: React.FC = () => {
	// const [filter, _] = useState<FilterType>('all')
	const [searchTerm, setSearchTerm] = useState('')
	const debounceSearchTerm = useDebounce((newData) => { setSearchTerm(newData) }, 500)
	const router = useRouter()

	const { data: assets } = useAssetsQuery({
		filter: 'all',
		searchTerm,
		refetchOnMount: true,
		enabled: true
	})

	// const handleFilterChange = useCallback((event: React.SyntheticEvent, newValue: FilterType) => {
	// 	setFilter(newValue)
	// }, [filter])

	const handleSearch = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
		const newVal = e.currentTarget.value
		if (newVal) {
			debounceSearchTerm(newVal)
		} else {
			setSearchTerm('')
		}
	}, [searchTerm])

	// const isAlreadyInitializedAccount = useAtomValue(isAlreadyInitializedAccountState)
	// const handleLinkNeedingAccountClick = useOnLinkNeedingAccountClick()

	const handleRowClick: GridEventListener<'rowClick'> = useCallback((
		params
	) => {
		if (!showPoolStatus(params.row.status)) {
			router.push(`${RootLiquidityDir}/comet/new/${params.row.ticker}`)
		}
	}, [])

	return (
		<PanelBox sx={{ '& .non-hover-row': { ':hover': { background: '#000' } } }}>
			<Stack mb={2} direction="row" justifyContent="space-between" alignItems="center">
				{/* <PageTabs value={filter} onChange={handleFilterChange}>
					{Object.keys(FilterTypeMap).map((f) => (
						<PageTab key={f} value={f} label={FilterTypeMap[f as FilterType]} />
					))}
				</PageTabs> */}
				<Box></Box>
				<Box width='320px'>
					<SearchInput onChange={handleSearch} />
				</Box>
			</Stack>
			<Grid
				headers={columns}
				rows={assets || []}
				minHeight={110}
				noAutoHeight={false}
				hasTopBorderRadius={true}
				customNoRowsOverlay={() => CustomNoRowsOverlay('No assets')}
				onRowClick={handleRowClick}
			/>
		</PanelBox>
	)
}

let columns: GridColDef[] = [
	{
		field: 'iAsset',
		headerClassName: 'super-app-theme--header',
		cellClassName: 'super-app-theme--cell ',
		headerName: 'clAsset Pools',
		flex: 2,
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
		flex: 1,
		renderCell(params: GridRenderCellParams<string>) {
			return !showPoolStatus(params.row.status) ?
				<Typography variant='p_xlg'>${formatLocaleAmount(params.value)}</Typography>
				: <></>
		},
	},
	{
		field: '24hChange',
		headerClassName: 'super-app-theme--header right--header',
		cellClassName: 'super-app-theme--cell right--cell',
		headerName: '24h Change',
		flex: 1,
		renderCell(params: GridRenderCellParams<string>) {
			return !showPoolStatus(params.row.status) ?
				params.row.change24h >= 0 ?
					<Box color='#4fe5ff' display='flex' alignItems='center'>
						<Typography variant='p_xlg'>+{params.row.change24h?.toFixed(2)}%</Typography>
						<Image src={ArrowUpward} alt='arrowUp' />
					</Box>
					: <Box color='#ff0084' display='flex' alignItems='center'>
						<Typography variant='p_xlg'>{params.row.change24h?.toFixed(2)}%</Typography>
						<Image src={ArrowDownward} alt='arrowDown' />
					</Box>
				: <></>
		},
	},
	{
		field: 'liquidity',
		headerClassName: 'super-app-theme--header right--header',
		cellClassName: 'super-app-theme--cell right--cell',
		headerName: 'Liquidity',
		flex: 1,
		renderCell(params: GridRenderCellParams<string>) {
			return !showPoolStatus(params.row.status) ?
				<Typography variant='p_xlg'>{formatDollarAmount(Number(params.value), 3)}</Typography>
				: <></>
		},
	},
	{
		field: '24hVolume',
		headerClassName: 'super-app-theme--header right--header',
		cellClassName: 'super-app-theme--cell right--cell',
		headerName: '24hr Volume',
		flex: 1,
		renderCell(params: GridRenderCellParams<string>) {
			return !showPoolStatus(params.row.status) ?
				<Typography variant='p_xlg'>{formatDollarAmount(Number(params.row.volume24h), 3)}</Typography>
				: <></>
		},
	},
	{
		field: 'avgAPY24h',
		headerClassName: 'super-app-theme--header right--header',
		cellClassName: 'super-app-theme--cell right--cell',
		headerName: 'APR',
		flex: 1,
		renderCell(params: GridRenderCellParams<string>) {
			return showPoolStatus(params.row.status) ? <PoolStatusButton status={params.row.status} />
				:
				params.row.avgAPY24h > 0 ?
					<Box color='#4fe5ff' display='flex' alignItems='center'>
						<Typography variant='p_xlg'>{params.row.avgAPY24h >= 0.01 ? `+${params.row.avgAPY24h?.toFixed(2)}` : '<0.01'}%</Typography>
					</Box>
					: <Box color='white' display='flex' alignItems='center'>
						<Typography variant='p_xlg'>{'0.00'}%</Typography>
					</Box>
		},
	},
]

const PanelBox = styled(Box)`
	padding: 18px 36px;
  color: #fff;
  & .super-app-theme--header { 
    color: #9d9d9d; 
    font-size: 11px; 
  }
`

columns = columns.map((col) => Object.assign(col, { hideSortIcons: true, filterable: false }))

export default withSuspense(AssetList, <LoadingProgress />)
