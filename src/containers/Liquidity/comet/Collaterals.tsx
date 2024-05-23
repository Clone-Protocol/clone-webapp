import { Button, Theme, Typography, useMediaQuery } from '@mui/material'
import { styled } from '@mui/material/styles'
import { useCallback, useState } from 'react'
import { GridColDef, GridEventListener, GridRenderCellParams } from '@mui/x-data-grid'
import { Grid, CellTicker, CustomNoRowsOverlay } from '~/components/Common/DataGrid'
import { Collateral } from '~/features/Liquidity/comet/CometInfo.query'
import { Collateral as StableCollateral, collateralMapping } from '~/data/assets'
import { useWallet } from '@solana/wallet-adapter-react'
import EditCollateralDialog from './Dialogs/EditCollateralDialog'
import { ON_USD } from '~/utils/constants'
import BridgeDialog from '~/components/Bridge/BridgeDialog'
import { formatLocaleAmount } from '~/utils/numbers'

const Collaterals = ({ hasNoCollateral, collaterals, onRefetchData }: { hasNoCollateral: boolean, collaterals: Collateral[], onRefetchData: () => void }) => {
  const { publicKey } = useWallet()
  const [openEditCollateral, setOpenEditCollateral] = useState(false)
  const [showBridge, setShowBridge] = useState(false)
  const isMobileOnSize = useMediaQuery((theme: Theme) => theme.breakpoints.down('md'))

  let dataCollaterals = collaterals
  if (publicKey && hasNoCollateral) {
    const onUSDInfo = collateralMapping(StableCollateral.onUSD)
    dataCollaterals = [{
      tickerIcon: onUSDInfo.collateralIcon,
      tickerSymbol: onUSDInfo.collateralSymbol,
      tickerName: onUSDInfo.collateralName,
      collAmount: 0,
      collAmountDollarPrice: 0
    }]
  }

  const rowsCollateral = dataCollaterals.map((coll, id) => ({
    ...coll,
    id,
    setShowBridge
  }))

  const handleRowClick: GridEventListener<'rowClick'> = useCallback(() => {
    setOpenEditCollateral(true)
  }, [])

  let customOverlayMsg = ''
  if (!publicKey) {
    customOverlayMsg = 'Please connect wallet.'
  }

  return (
    <>
      <Grid
        headers={columns}
        columnVisibilityModel={isMobileOnSize ? {
          "usdValue": false,
        } : {}}
        rows={rowsCollateral || []}
        minHeight={108}
        noAutoHeight={!publicKey}
        isBorderTopRadius={false}
        customNoResultsOverlay={() => CustomNoRowsOverlay(customOverlayMsg)}
        onRowClick={handleRowClick}
      />

      <EditCollateralDialog
        open={openEditCollateral}
        isNewDeposit={hasNoCollateral}
        handleClose={() => {
          setOpenEditCollateral(false)
          onRefetchData()
        }}
      />

      <BridgeDialog open={showBridge} handleClose={() => { setShowBridge(false) }} />
    </>
  )

}

let columns: GridColDef[] = [
  {
    field: 'collType',
    headerClassName: '',
    cellClassName: '',
    headerName: 'Collateral Type',
    flex: 1,
    renderCell(params: GridRenderCellParams<string>) {
      return (
        <CellTicker tickerIcon={params.row.tickerIcon} tickerName={params.row.tickerName} tickerSymbol={params.row.tickerSymbol} />
      )
    },
  },
  {
    field: 'depositAmount',
    headerClassName: 'right--header',
    cellClassName: 'right--cell',
    headerName: 'Deposit Amount',
    flex: 1,
    renderCell(params: GridRenderCellParams<string>) {
      const collAmount = params.row.collAmount
      return <Typography variant='p_xlg' color={collAmount === 0 ? '#8988a3' : '#fff'}>{formatLocaleAmount(collAmount)}</Typography>
    },
  },
  {
    field: 'usdValue',
    headerClassName: 'right--header',
    cellClassName: 'right--cell',
    headerName: 'Value ($)',
    flex: 1,
    renderCell(params: GridRenderCellParams<string>) {
      const collUsdValue = params.row.collAmountDollarPrice * params.row.collAmount
      return <Typography variant='p_xlg' color={collUsdValue === 0 ? '#8988a3' : '#fff'}>${formatLocaleAmount(collUsdValue)}</Typography>
    },
  },
  {
    field: 'action',
    headerClassName: 'right--header',
    cellClassName: 'right--cell',
    headerName: '',
    flex: 1,
    renderCell(params: GridRenderCellParams<string>) {
      return (
        <GetButton onClick={(e) => { e.stopPropagation(); params.row.setShowBridge(true) }}><Typography variant='p'>Get more {ON_USD}</Typography></GetButton>
      )
    },
  },
]

columns = columns.map((col) => Object.assign(col, { hideSortIcons: true, filterable: false }))

const GetButton = styled(Button)`
  width: 110px;
  height: 28px;
  flex-grow: 0;
  border-radius: 100px;
  color: #fff;
  border: solid 1px ${(props) => props.theme.basis.lightSlateBlue};
  background-color: #000;
  &:hover {
    background-color: rgba(155, 121, 252, 0.15);
		border-color: ${(props) => props.theme.basis.lightSlateBlue};
  }
`

export default Collaterals