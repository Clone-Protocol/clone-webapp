import React, { useState } from 'react'
import { Stack, Typography, Button, Box } from '@mui/material'
import { styled } from '@mui/material/styles'
import { GridColDef, GridRenderCellParams, GridColumnHeaderParams } from '@mui/x-data-grid'
import { CellDigitValue, Grid, CellTicker, GridType } from '~/components/Common/DataGrid'
import withSuspense from '~/hocs/withSuspense'
import { LoadingProgress } from '~/components/Common/Loading'
import { useBorrowQuery } from '~/features/Liquidity/borrow/Borrow.query'
import { useWallet } from '@solana/wallet-adapter-react'
import { GridEventListener } from '@mui/x-data-grid'
import { CustomNoRowsOverlay } from '~/components/Common/DataGrid'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import AddIconOn from 'public/images/liquidity/add-icon-on.svg'
import { AddIcon } from '~/components/Common/SvgIcons'
import BorrowLiquidityStatus from './BorrowLiquidityStatus'
import LearnMoreIcon from 'public/images/learn-more.svg'
import { ON_USD, RootLiquidityDir } from '~/utils/constants'
import { PoolStatusButton, showPoolStatus } from '~/components/Common/PoolStatus'
import { Status } from 'clone-protocol-sdk/sdk/generated/clone'
import InfoTooltip from '~/components/Common/InfoTooltip'
import { TooltipTexts } from '~/data/tooltipTexts'
import { formatLocaleAmount } from '~/utils/numbers'

const BorrowPositions = () => {
	const { publicKey } = useWallet()
	const router = useRouter()
	const [isBtnHover, setIsBtnHover] = useState(false)

	const { data: positions } = useBorrowQuery({
		userPubKey: publicKey,
		filter: 'all',
		refetchOnMount: "always",
		enabled: publicKey != null
	})

	const handleRowClick: GridEventListener<'rowClick'> = (
		params,
	) => {
		if (params.row.status !== Status.Frozen) {
			router.push(`${RootLiquidityDir}/borrow/myliquidity/${params.row.id}`)
		}
	}

	const moveNewBorrowPositionPage = () => {
		router.push(`${RootLiquidityDir}/borrow`)
	}

	let customOverlayMsg = ''
	if (!publicKey) {
		customOverlayMsg = 'Please connect wallet.'
	}

	return (
		<>
			<Box mb='20px'>
				<Typography variant='h3' fontWeight={500}>Borrow</Typography>
				<Stack direction='row' alignItems='center' gap={1}>
					<Typography variant='p' color='#66707e'>Borrow function enable LPs to leverage creative liquidity strategies.</Typography>
					<a href="https://docs.clone.so/clone-mainnet-guide/clone-liquidity-or-for-lps/borrowing" target='_blank'>
						<Box display='flex' color='#b5fdf9' sx={{ cursor: 'pointer', ":hover": { color: '#4fe5ff' } }}>
							<Typography variant='p' mr='3px'>Learn more</Typography>
							<Image src={LearnMoreIcon} alt='learnMore' />
						</Box>
					</a>
				</Stack>
			</Box>
			<BorrowLiquidityStatus hasNoPosition={positions && positions.length > 0 ? false : true} />

			<Grid
				headers={columns}
				rows={positions || []}
				minHeight={108}
				noAutoHeight={(!publicKey || positions?.length === 0) === true}
				hasRangeIndicator={true}
				hasTopBorderRadius={true}
				gridType={GridType.Borrow}
				customNoRowsOverlay={() => CustomNoRowsOverlay(customOverlayMsg)}
				onRowClick={handleRowClick}
			/>

			{publicKey &&
				<Stack direction='row' mt='9px' onMouseOver={() => setIsBtnHover(true)} onMouseLeave={() => setIsBtnHover(false)}>
					{positions && positions.length > 0 ?
						<AddButton onClick={moveNewBorrowPositionPage} sx={isBtnHover ? { color: '#fff' } : { color: '#414e66' }} disableRipple>
							<Stack direction='row'>
								<AddIcon color={isBtnHover ? '#fff' : '#414e66'} />
								<Typography variant='p_lg' ml='10px' color={isBtnHover ? '#fff' : '#414e66'}>Add new borrow position</Typography>
							</Stack>
						</AddButton>
						:
						<AddButtonNoPosition onClick={moveNewBorrowPositionPage}>
							<Image src={AddIconOn} width={15} height={15} alt='add' />
							<Typography variant='p_lg' ml='10px'>Add new borrow position</Typography>
						</AddButtonNoPosition>
					}
				</Stack>
			}
		</>
	)
}

let columns: GridColDef[] = [
	{
		field: 'asset',
		headerClassName: '',
		cellClassName: '',
		headerName: 'clAsset',
		flex: 1,
		renderCell(params: GridRenderCellParams<string>) {
			return params.row.borrowed > 0 ?
				<CellTicker tickerIcon={params.row.tickerIcon} tickerName={params.row.tickerName} tickerSymbol={params.row.tickerSymbol} />
				: <Box><Typography variant='p_xlg' color='#989898'>Please continue to close</Typography></Box>
		},
	},
	{
		field: 'borrowed',
		headerClassName: 'right--header',
		cellClassName: 'right--cell',
		headerName: 'Borrowed',
		flex: 1,
		renderCell(params: GridRenderCellParams<string>) {
			return Number(params.value) > 0 ?
				<Stack direction='column' alignItems='flex-end'>
					<Box><CellDigitValue value={params.value} symbol={params.row.tickerSymbol} /></Box>
					<Box><Typography variant='p_lg' color='#66707e'>${formatLocaleAmount(Number(params.value) * params.row.oPrice, 5)} USD</Typography></Box>
				</Stack>
				: <Box></Box>
		},
	},
	{
		field: 'collateral',
		headerClassName: 'right--header',
		cellClassName: 'right--cell',
		headerName: 'Collateral',
		flex: 1,
		renderCell(params: GridRenderCellParams<string>) {
			return (
				<Stack direction='column' alignItems='flex-end'>
					<Box><CellDigitValue value={params.value} symbol={ON_USD} /></Box>
					<Box><Typography variant='p_lg' color='#66707e'>${formatLocaleAmount(params.value)} USD</Typography></Box>
				</Stack>
			)
		},
	},
	{
		field: 'collateralRatio',
		headerClassName: 'right--header',
		cellClassName: 'right--cell',
		headerName: 'Collateral Ratio',
		flex: 1,
		renderHeader(params: GridColumnHeaderParams<string>) {
			return <Stack direction='row' alignItems='center'>
				<Typography variant='p' color='#989898'>{params.colDef.headerName}</Typography>
				<InfoTooltip title={TooltipTexts.borrowedCollRatio} color='#66707e' />
			</Stack>
		},
		renderCell(params: GridRenderCellParams<string>) {
			const isRisk = params.row.collateralRatio - params.row.minCollateralRatio < 20
			return showPoolStatus(params.row.status) ? <PoolStatusButton status={params.row.status} />
				:
				params.row.borrowed > 0 ?
					(<Stack direction='column' alignItems='flex-end'>
						<Box><Typography variant='h4' color={isRisk ? '#ed2525' : '#4fe5ff'}>{formatLocaleAmount(params.value, 2)}%</Typography></Box>
						<Box><Typography variant='p_lg' color={isRisk ? '#ed2525' : '#66707e'}>(min {params.row.minCollateralRatio.toLocaleString()}%)</Typography></Box>
					</Stack>)
					: (<></>)
		},
	},
]

columns = columns.map((col) => Object.assign(col, { hideSortIcons: true, filterable: false }))

const AddButton = styled(Button)`
  width: 100%;
  height: 28px;
  padding: 4px 0;
  background-color: rgba(255, 255, 255, 0.01);
  border: 1px solid ${(props) => props.theme.basis.jurassicGrey};
  color: ${(props) => props.theme.basis.shadowGloom};
  margin-top: 9px;
  &:hover {
    background-color: rgba(255, 255, 255, 0.05);
  }
`
const AddButtonNoPosition = styled(AddButton)`
	height: 70px;
  color: #fff;
	border: 0px;
	margin-top: -80px;
  &:hover {
    border-color: ${(props) => props.theme.palette.info.main};
  }
`


export default withSuspense(BorrowPositions, <LoadingProgress />)