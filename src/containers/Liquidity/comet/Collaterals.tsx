import { Button, Typography } from '@mui/material'
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
        rows={rowsCollateral || []}
        minHeight={108}
        noAutoHeight={!publicKey}
        customNoRowsOverlay={() => CustomNoRowsOverlay(customOverlayMsg)}
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
      return <Typography variant='p_xlg' color={collAmount === 0 ? '#66707e' : '#fff'}>{formatLocaleAmount(collAmount)}</Typography>
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
      return <Typography variant='p_xlg' color={collUsdValue === 0 ? '#66707e' : '#fff'}>${formatLocaleAmount(collUsdValue)}</Typography>
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
  border: solid 1px ${(props) => props.theme.basis.shadowGloom};
  background: ${(props) => props.theme.basis.jurassicGrey};
  &:hover {
    background: ${(props) => props.theme.basis.jurassicGrey};
    border: solid 1px ${(props) => props.theme.basis.gloomyBlue};
  }
`

export default Collaterals