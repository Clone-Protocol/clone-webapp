import { Box, Stack, Button, Typography, useMediaQuery, Theme } from '@mui/material'
import { styled } from '@mui/material/styles'
import { GridColDef, GridRenderCellParams } from '@mui/x-data-grid'
import { Grid, CellTicker, CustomNoOnAssetOverlay, CustomNoRowsOverlay } from '~/components/Common/DataGrid'
import { LoadingProgress } from '~/components/Common/Loading'
import withSuspense from '~/hocs/withSuspense'
import { Balance } from '~/features/Portfolio/Balance.query'
import { useWallet } from '@solana/wallet-adapter-react'
import { Collateral, collateralMapping } from '~/data/assets'
import { useMemo, useState } from 'react'
import { formatLocaleAmount } from '~/utils/numbers'
import { ON_USD } from '~/utils/constants'
import BridgeDialog from '~/components/Bridge/BridgeDialog'

interface Props {
	balance: Balance
}

const StableAssetList: React.FC<Props> = ({ balance }) => {
	const { publicKey } = useWallet()
	const isMobileOnSize = useMediaQuery((theme: Theme) => theme.breakpoints.down('md'))
	const onUSDInfo = collateralMapping(Collateral.onUSD)
	const [assets, setAssets] = useState<any>([])
	const [showBridge, setShowBridge] = useState(false)

	useMemo(() => {
		if (publicKey && balance) {
			setAssets([{
				id: onUSDInfo.collateralType,
				tickerIcon: onUSDInfo.collateralIcon,
				tickerName: onUSDInfo.collateralName,
				tickerSymbol: onUSDInfo.collateralSymbol,
				onusdBalance: balance.onusdVal,
				price: 1.0,
				setShowBridge
			}])
		}
	}, [publicKey, balance])

	return balance ? (
		<>
			<TopBox>
				<Box><Typography variant='p' color='#8988a3'>Stable Coin</Typography></Box>
				<Box><Typography variant='h3' fontWeight={500}>${balance?.onusdVal.toFixed(2)}</Typography></Box>
			</TopBox>
			<Grid
				headers={columns}
				columnVisibilityModel={isMobileOnSize ? {
					"price": false,
					"actions": false
				} : {}}
				rows={assets || []}
				isBorderTopRadius={false}
				minHeight={110}
				noAutoHeight={!publicKey}
				customNoResultsOverlay={() => !publicKey ? CustomNoRowsOverlay('Please connect wallet.') : CustomNoOnAssetOverlay()}
			/>

			<BridgeDialog open={showBridge} handleClose={() => { setShowBridge(false) }} />
		</>
	) : <></>
}

let columns: GridColDef[] = [
	{
		field: 'iAssets',
		headerName: 'Stable Coin',
		flex: 1,
		renderCell(params: GridRenderCellParams<string>) {
			return (
				<CellTicker tickerIcon={params.row.tickerIcon} tickerName={params.row.tickerName} tickerSymbol={params.row.tickerSymbol} />
			)
		},
	},
	{
		field: 'myBalance',
		headerName: 'Total Balance',
		headerClassName: 'right--header',
		cellClassName: 'right--cell',
		flex: 1,
		renderCell(params: GridRenderCellParams<string>) {
			return (
				<Stack width='78px' textAlign='right'>
					<Box>
						<Typography variant='p_xlg'>${formatLocaleAmount(params.row.onusdBalance)}</Typography>
					</Box>
				</Stack>
			)
		},
	},
	{
		field: 'price',
		headerName: 'Price',
		headerClassName: 'right--header',
		cellClassName: 'right--cell',
		flex: 1,
		renderCell(params: GridRenderCellParams<string>) {
			return (
				<Stack>
					<Box>
						<Typography variant='p_xlg'>${params.row.price.toFixed(2)}</Typography>
					</Box>
				</Stack>
			)
		},
	},
	{
		field: 'actions',
		headerName: '',
		headerClassName: 'right--header',
		cellClassName: 'right--cell',
		flex: 1,
		renderCell(params: GridRenderCellParams<string>) {

			return (
				<GetUSDButton onClick={() => { params.row.setShowBridge(true) }}><Typography variant='p'>Get more {ON_USD}</Typography></GetUSDButton>
			)
		},
	},
]

const TopBox = styled(Box)`
	height: 87px;
	border-top-left-radius: 20px;
	border-top-right-radius: 20px;
	border-left: solid 1px rgba(196, 181, 253, 0.25);
	border-right: solid 1px rgba(196, 181, 253, 0.25);
	border-top: solid 1px rgba(196, 181, 253, 0.25);
	display: flex;
	flex-direction: column;
	justify-content: center;
	padding-left: 29px;
`

const GetUSDButton = styled(Button)`
	width: 108px;
	height: 28px;
	border-radius: 100px;
	border: solid 1px ${(props) => props.theme.basis.portGore};
	background-color: rgba(155, 121, 252, 0.15);
	color: #fff;
	line-height: 29px;
	&:hover {
		background-color: rgba(155, 121, 252, 0.15);
		border-color: ${(props) => props.theme.basis.lightSlateBlue};
	}
`

columns = columns.map((col) => Object.assign(col, { hideSortIcons: true, filterable: false }))

export default withSuspense(StableAssetList, <LoadingProgress />)
