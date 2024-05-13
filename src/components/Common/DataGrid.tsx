import { DataGrid, GridColDef, GridColumnVisibilityModel, GridEventListener } from '@mui/x-data-grid'
import { Box, Typography } from '@mui/material'
import Image from 'next/image'
import Link from 'next/link'
import { showPoolStatus } from './PoolStatus'
import { formatLocaleAmount } from '~/utils/numbers'

interface GridProps {
  headers: GridColDef[],
  rows: any,
  customNoResultsOverlay: () => JSX.Element,
  isBorderTopRadius?: boolean,
  isBorderBottomRadius?: boolean,
  minHeight?: number,
  noAutoHeight?: boolean,
  columnVisibilityModel?: GridColumnVisibilityModel,
  onRowClick?: GridEventListener<'rowClick'>
}

export const enum GridType {
  Normal = 'normal',
  SingleComet = 'singleComet',
  Borrow = 'borrow'
}

export const Grid: React.FC<GridProps> = ({ headers, rows, customNoResultsOverlay, isBorderTopRadius = true, isBorderBottomRadius = true, minHeight = 260, noAutoHeight = false, columnVisibilityModel, onRowClick }) => (
  <DataGrid
    columnVisibilityModel={columnVisibilityModel}
    sx={{
      width: '100%',
      border: 0,
      color: '#fff',
      minHeight: `${minHeight}px`,
      '& .MuiDataGrid-main': {
        borderLeft: '1px solid #332e46',
        borderRight: '1px solid #332e46',
        borderBottom: '1px solid #332e46',
        borderTop: '1px solid #332e46',
        borderBottomLeftRadius: isBorderBottomRadius ? '10px' : '0',
        borderBottomRightRadius: isBorderBottomRadius ? '10px' : '0',
        borderTopLeftRadius: isBorderTopRadius ? '10px' : '0',
        borderTopRightRadius: isBorderTopRadius ? '10px' : '0',
      },
      '& .right--cell': {
        display: 'flex',
        justifyContent: 'flex-end',
        paddingRight: '40px'
      },
      '& .last--cell': {
        display: 'flex',
        justifyContent: 'flex-end',
        maxWidth: '180px'
      },
      '& .MuiDataGrid-columnHeaderTitle': {
        color: '#8988a3',
        fontSize: '12px',
        lineHeight: 1.33,
        marginLeft: '10px'
      },
      '& .right--header': {
        '& .MuiDataGrid-columnHeaderTitleContainer': {
          display: 'flex',
          justifyContent: 'flex-end',
          paddingRight: '20px'
        }
      },
      '& .balance--header': {
        '& .MuiDataGrid-columnHeaderTitleContainer': {
          width: '120px',
          marginLeft: '45px'
        }
      },
      '& .last--header': {
        '& .MuiDataGrid-columnHeaderTitleContainer': {
          display: 'flex',
          justifyContent: 'right',
          marginRight: '35px'
        }
      },
      '& .MuiDataGrid-columnHeaders': {
        borderBottom: '1px solid rgba(196, 181, 253, 0.25)',
      },
      '& .MuiDataGrid-columnHeader:focus': {
        outline: 'none',
      },
      '& .MuiDataGrid-columnSeparator': {
        display: 'none',
      },
      '& .MuiDataGrid-row': {
        marginRight: '10px',
        paddingLeft: '10px',
        cursor: 'pointer'
      },
      '& .MuiDataGrid-row:hover': {
        backgroundColor: 'rgba(255, 255, 255, 0.08)'
      },
      '& .MuiDataGrid-cell': {
        borderBottom: '0',
      },
      '& .MuiDataGrid-cell:focus': {
        border: '0',
        outline: 'none'
      },
      '& .MuiDataGrid-cell:focus-within': {
        outline: 'none !important'
      },
      '.border-warning--row': {
        borderLeft: '1px solid #ff8e4f',
        borderRight: '1px solid #ff8e4f',
      },
      '.border-poor--row': {
        borderLeft: '1px solid #ff0084',
        borderRight: '1px solid #ff0084'
      }
    }}
    components={{
      NoResultsOverlay: customNoResultsOverlay
    }}
    getRowClassName={(params) => {
      // if pool status, show non-hover-row
      return showPoolStatus(params.row?.status) ? 'non-hover-row' : ''
    }}
    autoHeight={!noAutoHeight}
    disableColumnFilter
    disableSelectionOnClick
    disableColumnSelector
    disableColumnMenu
    disableDensitySelector
    disableExtendRowFullWidth
    hideFooter
    headerHeight={40}
    rowHeight={72}
    rowCount={20}
    onRowClick={onRowClick}
    columns={headers}
    rows={rows || []}
  />
)

export const CustomNoRowsOverlay = (msg: string) => {
  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: '20px' }}>
      <Typography variant='p_lg' color='#8988a3'>{msg}</Typography>
    </Box>
  )
}

export const CustomNoOnAssetOverlay = () => {
  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: '20px', zIndex: '999', position: 'relative' }}>
      <Typography variant='p_lg'>No clAsset to display. </Typography>
      <Link href='/'><Typography variant='p_lg' color='#C4B5FD' ml='5px' sx={{ textDecoration: 'underline', cursor: 'pointer' }}>Start Trading!</Typography></Link>
    </Box>
  )
}

export interface TickerType {
  tickerIcon: string
  tickerName: string
  tickerSymbol: string
}

export const CellTicker: React.FC<TickerType> = ({ tickerIcon, tickerName, tickerSymbol }) => (
  <Box display="flex" justifyContent="flex-start">
    {tickerIcon && <Image src={tickerIcon} width={27} height={27} alt={tickerSymbol} />}
    <Box display='flex' ml='10px' sx={{ flexDirection: { xs: 'column', md: 'row' }, alignItems: { xs: 'flex-start', md: 'center' } }}>
      <Box sx={{ maxWidth: '200px', textOverflow: 'ellipsis', whiteSpace: 'nowrap', overflow: 'hidden' }}>
        <Typography variant='p_xlg'>{tickerName}</Typography>
      </Box>
      <Box sx={{ color: '#8988a3', marginLeft: { xs: '0px', md: '10px' } }}>
        <Typography variant='p_lg'>{tickerSymbol}</Typography>
      </Box>
    </Box>
  </Box>
)

export const CellDigitValue = ({ value, symbol }: { value: string | undefined, symbol?: string }) => (
  <Typography variant='p_xlg'>{value && formatLocaleAmount(value, 5)} {symbol}</Typography>
)