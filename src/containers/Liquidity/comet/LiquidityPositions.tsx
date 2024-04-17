import { Box, Stack, Button, Typography } from '@mui/material'
import { styled } from '@mui/material/styles'
import { useEffect, useState } from 'react'
import { GridColDef, GridEventListener, GridRenderCellParams, GridColumnHeaderParams } from '@mui/x-data-grid'
import { Grid, CustomNoRowsOverlay } from '~/components/Common/DataGrid'
import { LiquidityPosition } from '~/features/Liquidity/comet/CometInfo.query'
import { useRouter } from 'next/navigation'
import AddIconOn from 'public/images/liquidity/add-icon-on.svg'
import Image from 'next/image'
import { useWallet } from '@solana/wallet-adapter-react'
import { AddIcon } from '~/components/Common/SvgIcons'
import { ON_USD, RootLiquidityDir } from '~/utils/constants'
import { PoolStatusButton, showPoolStatus } from '~/components/Common/PoolStatus'
import { Status } from 'clone-protocol-sdk/sdk/generated/clone'
import { DEFAULT_LIQUIDITY_ASSET_LINK } from '~/data/assets'
import EditLiquidityDialog from './Dialogs/EditLiquidityDialog'
import InfoTooltip from '~/components/Common/InfoTooltip'
import { TooltipTexts } from '~/data/tooltipTexts'
import { formatLocaleAmount } from '~/utils/numbers'

const LiquidityPositions = ({ hasNoCollateral, positions, onRefetchData }: { hasNoCollateral: boolean, positions: LiquidityPosition[], onRefetchData: () => void }) => {
  const router = useRouter()
  const { publicKey } = useWallet()
  const [openEditLiquidity, setOpenEditLiquidity] = useState(false)
  const [editAssetId, setEditAssetId] = useState(0)
  const [poolIndex, setPoolIndex] = useState(0)
  const [isBtnHover, setIsBtnHover] = useState(false)
  const [renderPositions, setRenderPositions] = useState<LiquidityPosition[]>([])

  useEffect(() => {
    if (positions) {
      setRenderPositions(positions)
    }
  }, [positions])

  const handleChooseEditPosition = (positionIndex: number) => {
    console.log('positions', renderPositions)
    console.log('positionIndex', positionIndex)
    setPoolIndex(Number(renderPositions[positionIndex].poolIndex))
    setEditAssetId(positionIndex)
    setOpenEditLiquidity(true)
  }

  const redirectAddCometPage = () => {
    router.push(`${DEFAULT_LIQUIDITY_ASSET_LINK}`)
  }

  const handleRowClick: GridEventListener<'rowClick'> = (
    params
  ) => {
    if (params.row.status !== Status.Frozen) {
      handleChooseEditPosition(params.row.positionIndex)
    }
  }

  const rowsPositions = renderPositions.map((position, id) => ({
    ...position,
    id,
  }))

  let customOverlay = () => CustomNoRowsOverlay('')
  if (!publicKey) {
    customOverlay = () => CustomNoRowsOverlay('Please connect wallet.')
  } else if (hasNoCollateral) {
    customOverlay = () => CustomNoRowsOverlay('Add collateral in order to start providing liquidity!', '#fff')
  }

  return (
    <>
      <Box>
        <Grid
          headers={columns}
          rows={rowsPositions || []}
          minHeight={108}
          noAutoHeight={(!publicKey || hasNoCollateral || (!hasNoCollateral && positions.length === 0)) === true}
          customNoRowsOverlay={customOverlay}
          onRowClick={handleRowClick}
        />
      </Box>
      {publicKey && !hasNoCollateral &&
        <Stack direction='row' mt='9px' onMouseOver={() => setIsBtnHover(true)} onMouseLeave={() => setIsBtnHover(false)}>
          {positions.length > 0 ?
            <AddButton onClick={redirectAddCometPage} disableRipple>
              <Stack direction='row'>
                <AddIcon color={isBtnHover ? '#fff' : '#414e66'} />
                <Typography variant='p_lg' ml='10px' color={isBtnHover ? '#fff' : '#414e66'}>Add new liquidity position</Typography>
              </Stack>
            </AddButton>
            :
            <AddButtonNoPosition onClick={redirectAddCometPage}>
              <Image src={AddIconOn} width={15} height={15} alt='add' />
              <Typography variant='p_lg' ml='10px'>Add new liquidity position</Typography>
            </AddButtonNoPosition>
          }
        </Stack>
      }

      {openEditLiquidity &&
        <EditLiquidityDialog
          open={openEditLiquidity}
          positionIndex={editAssetId}
          poolIndex={poolIndex}
          handleClose={() => {
            setOpenEditLiquidity(false)
            onRefetchData()
          }}
        />
      }
    </>
  )

}

let columns: GridColDef[] = [
  {
    field: 'pool',
    headerClassName: '',
    cellClassName: '',
    headerName: 'Liquidity Pool',
    flex: 1,
    renderCell(params: GridRenderCellParams<string>) {
      return (
        <Box display="flex" justifyContent="flex-start">
          <Image src={params.row.tickerIcon} width={27} height={27} alt={params.row.tickerSymbol} />
          <Box ml='10px'><Typography variant='p_xlg'>{params.row.tickerSymbol}{'/'}{ON_USD}</Typography></Box>
        </Box>
      )
    },
  },
  {
    field: 'liquidityAmount',
    headerClassName: 'right--header',
    cellClassName: 'right--cell',
    headerName: 'Liquidity Amount',
    flex: 1,
    renderHeader(params: GridColumnHeaderParams<string>) {
      return <Stack direction='row' alignItems='center'>
        <Typography variant='p' color='#989898'>{params.colDef.headerName}</Typography>
        <InfoTooltip title={TooltipTexts.myPositions.liquidityAmount} color='#66707e' />
      </Stack>
    },
    renderCell(params: GridRenderCellParams<string>) {
      return <Typography variant='p_xlg'>${formatLocaleAmount(params.row.liquidityDollarPrice)}</Typography>
    },
  },
  {
    field: 'ild',
    headerClassName: 'right--header',
    cellClassName: 'right--cell',
    headerName: 'ILD',
    flex: 1,
    renderHeader(params: GridColumnHeaderParams<string>) {
      return <Stack direction='row' alignItems='center'>
        <Typography variant='p' color='#989898'>{params.colDef.headerName}</Typography>
        <InfoTooltip title={TooltipTexts.myPositions.ild} color='#66707e' />
      </Stack>
    },
    renderCell(params: GridRenderCellParams<string>) {
      return <Typography variant='p_xlg'>${formatLocaleAmount(Number(params.row.ildDollarPrice), 5)}</Typography>
    },
  },
  {
    field: 'rewards',
    headerClassName: 'right--header',
    cellClassName: 'right--cell',
    headerName: 'Rewards',
    flex: 1,
    renderHeader(params: GridColumnHeaderParams<string>) {
      return <Stack direction='row' alignItems='center'>
        <Typography variant='p' color='#989898'>{params.colDef.headerName}</Typography>
        <InfoTooltip title={TooltipTexts.myPositions.rewards} color='#66707e' />
      </Stack>
    },
    renderCell(params: GridRenderCellParams<string>) {
      return <Typography variant='p_xlg'>${formatLocaleAmount(params.row.rewards, 5)}</Typography>
    },
  },
  {
    field: 'apy',
    headerClassName: 'right--header',
    cellClassName: 'right--cell',
    headerName: 'APR',
    flex: 1,
    renderHeader(params: GridColumnHeaderParams<string>) {
      return <Stack direction='row' alignItems='center'>
        <Typography variant='p' color='#989898'>{params.colDef.headerName}</Typography>
        <InfoTooltip title={TooltipTexts.myPositions.apy} color='#66707e' />
      </Stack>
    },
    renderCell(params: GridRenderCellParams<string>) {
      return showPoolStatus(params.row.status) ? <PoolStatusButton status={params.row.status} />
        :
        Number(params.value) > 0 ?
          <Box display='flex' justifyContent='center' alignItems='center' color='#4fe5ff'>
            <Typography variant='p_xlg'>{Number(params.value) >= 0.01 ? `+${Number(params.value).toFixed(2)}` : '<0.01'}%</Typography>
          </Box>
          :
          <Box display='flex' alignItems='center' color='white'>
            <Typography variant='p_xlg'>{'0.00'}%</Typography>
          </Box>
    },
  },
]

columns = columns.map((col) => Object.assign(col, { hideSortIcons: true, filterable: false }))

const AddButton = styled(Button)`
  width: 100%;
  height: 28px;
  padding: 4px 0;
  background-color: rgba(255, 255, 255, 0.01);
  border: 1px solid ${(props) => props.theme.boxes.blackShade};
  color: ${(props) => props.theme.basis.melrose};
  margin-top: 9px;
  &:hover {
    background-color: rgba(255, 255, 255, 0.05);
    border-color: rgba(255, 255, 255, 0.05);
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

export default LiquidityPositions