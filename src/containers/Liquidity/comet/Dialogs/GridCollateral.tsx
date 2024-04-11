import { useWallet } from '@solana/wallet-adapter-react'
import { Box } from '@mui/material'
import { styled } from '@mui/material/styles'
import { GridColDef, GridRenderCellParams, GridRowParams } from '@mui/x-data-grid'
import { Grid } from '~/components/Liquidity/comet/DataGrid'
import withSuspense from '~/hocs/withSuspense'
import Image from 'next/image'
import { LoadingProgress } from '~/components/Common/Loading'
import { useCollateralsQuery } from '~/features/Liquidity/comet/Collaterals.query'
import { formatLocaleAmount } from '~/utils/numbers'

interface Props {
	onChoose: (id: number) => void
}

const GridCollateral: React.FC<Props> = ({ onChoose }) => {
	const { publicKey } = useWallet()
	const { data: collaterals } = useCollateralsQuery({
		userPubKey: publicKey,
		refetchOnMount: "always",
		enabled: publicKey != null
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
			rows={collaterals || []}
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
		headerName: 'Asset',
		flex: 1,
		renderCell(params: GridRenderCellParams<string>) {
			return (
				<Box display="flex" justifyContent="flex-start" marginLeft='4px'>
					<Image src={params.row.tickerIcon} width={27} height={27} alt={params.row.tickerSymbol} />
					<Box sx={{ fontSize: '14px', fontWeight: '500', marginLeft: '8px', marginTop: '3px' }}>
						{params.row.tickerSymbol}
					</Box>
				</Box>
			)
		},
	},
	{
		field: 'balance',
		headerClassName: 'last--header',
		cellClassName: 'last--cell',
		headerName: 'Wallet Balance',
		flex: 1,
		renderCell(params: GridRenderCellParams<string>) {
			return <CellValue>{formatLocaleAmount(params.value)}</CellValue>
		},
	},
]

columns = columns.map((col) => Object.assign(col, { hideSortIcons: true, filterable: false }))

const CellValue = styled(Box)`
	font-size: 14px;
	text-align: right;
  color: #fff;
`

export default withSuspense(GridCollateral, <LoadingProgress />)
