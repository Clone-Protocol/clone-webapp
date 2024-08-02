import { useWallet } from '@solana/wallet-adapter-react'
import { Box, Typography } from '@mui/material'
import { GridColDef, GridRenderCellParams, GridRowParams } from '@mui/x-data-grid'
import { Grid } from '~/components/Liquidity/comet/DataGrid'
import withSuspense from '~/hocs/withSuspense'
import Image from 'next/image'
import { LoadingProgress } from '~/components/Common/Loading'
import { useLiquidityPoolsQuery } from '~/features/Liquidity/comet/LiquidityPools.query'
import { ON_USD } from '~/utils/constants'

interface Props {
	onChoose: (id: number) => void
	noFilter: boolean
	searchTerm?: string
}

const GridLiquidityPool: React.FC<Props> = ({ onChoose, noFilter, searchTerm }) => {
	const { publicKey } = useWallet()
	const { data: pools } = useLiquidityPoolsQuery({
		userPubKey: publicKey,
		refetchOnMount: "always",
		searchTerm: searchTerm || '',
		noFilter: false
	})

	const handleChoose = (params: GridRowParams) => {
		if (params.row.isEnabled) {
			const id = params.row.id
			onChoose && onChoose(id)
		}
	}

	return (
		<Grid
			headers={columns}
			rows={pools || []}
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
		flex: 2,
		renderCell(params: GridRenderCellParams<string>) {
			return (
				<Box display="flex" justifyContent="flex-start" ml='4px'>
					<Image src={params.row.tickerIcon} width={28} height={28} alt={params.row.tickerSymbol} />
					<Box ml='10px' mt='3px'>
						<Typography variant='p_xlg'>{params.row.tickerSymbol}/{ON_USD}</Typography>
					</Box>
				</Box>
			)
		},
	}
]

columns = columns.map((col) => Object.assign(col, { hideSortIcons: true, filterable: false }))

export default withSuspense(GridLiquidityPool, <LoadingProgress />)
