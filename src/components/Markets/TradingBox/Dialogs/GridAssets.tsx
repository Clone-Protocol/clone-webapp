import { Box, Typography } from '@mui/material'
import { GridColDef, GridRenderCellParams, GridRowParams } from '@mui/x-data-grid'
import { Grid } from './DataGrid'
import withSuspense from '~/hocs/withSuspense'
import Image from 'next/image'
import { LoadingProgress } from '~/components/Common/Loading'
import { useAssetsQuery } from '~/features/Markets/Assets.query'
import { useCallback } from 'react'
import { formatLocaleAmount } from '~/utils/numbers'

interface Props {
	onChoose: (id: number) => void
	searchTerm?: string
}

const GridAssets: React.FC<Props> = ({ onChoose, searchTerm }) => {
	const { data: assets } = useAssetsQuery({
		filter: 'all',
		refetchOnMount: true,
		searchTerm: searchTerm || '',
		filterPoolStatus: true,
		enabled: true
	})

	const handleChoose = useCallback((params: GridRowParams) => {
		const id = params.row.id
		onChoose && onChoose(id)
	}, [])

	return (
		<Grid
			headers={columns}
			rows={assets || []}
			onRowClick={handleChoose}
			minHeight={380}
		/>
	)
}

let columns: GridColDef[] = [
	{
		field: 'asset',
		headerClassName: 'super-app-theme--header',
		cellClassName: 'super-app-theme--cell',
		headerName: '',
		flex: 3,
		renderCell(params: GridRenderCellParams<string>) {
			return (
				<Box display="flex" justifyContent="flex-start" marginLeft='4px'>
					<Image src={params.row.tickerIcon} width={28} height={28} alt={params.row.tickerSymbol} />
					<Box marginLeft='8px' marginTop='3px'>
						<Typography variant='p_lg'>{params.row.tickerName}</Typography>
						<Typography variant='p_lg' color='#8988a3' ml='10px'>{params.row.tickerSymbol}</Typography>
					</Box>
				</Box>
			)
		},
	},
	{
		field: 'balance',
		headerClassName: 'last--header',
		cellClassName: 'last--cell',
		headerName: '',
		flex: 1,
		renderCell(params: GridRenderCellParams<string>) {
			return <Box mr='5px'><Typography variant='p_lg' color='#c5c7d9'>{formatLocaleAmount(params.value)}</Typography></Box>
		},
	},
]

columns = columns.map((col) => Object.assign(col, { hideSortIcons: true, filterable: false }))

export default withSuspense(GridAssets, <LoadingProgress />)
