import { Box, Typography } from '@mui/material'
import { GridColDef, GridRenderCellParams, GridRowParams } from '@mui/x-data-grid'
import { Grid } from '~/components/Liquidity/comet/DataGrid'
import Image from 'next/image'
import { AssetList } from '~/features/Wrapper/Assets.query'

interface Props {
	assets: AssetList[] | null | undefined
	onChoose: (id: number) => void
}

const GridAssets: React.FC<Props> = ({ assets, onChoose }) => {
	// const { publicKey } = useWallet()

	// const { data: assets } = useAssetsQuery({
	// 	userPubKey: publicKey,
	// 	refetchOnMount: true,
	// 	searchTerm: searchTerm || '',
	// 	enabled: publicKey != null
	// })

	const handleChoose = (params: GridRowParams) => {
		const id = params.row.id
		onChoose && onChoose(id)
	}

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
				<Box display="flex" justifyContent="flex-start" ml='4px'>
					<Image src={params.row.tickerIcon} width={28} height={28} alt={params.row.tickerSymbol} />
					<Box ml='10px' mt='3px'>
						<Typography variant='p_lg'>{params.row.tickerName}</Typography>
						<Typography variant='p_lg' color='#989898' ml='10px'>{params.row.tickerSymbol}</Typography>
					</Box>
				</Box>
			)
		},
	},
]

columns = columns.map((col) => Object.assign(col, { hideSortIcons: true, filterable: false }))

export default GridAssets
