import { DataGrid, GridColDef, GridRowParams } from '@mui/x-data-grid'
import { Box } from '@mui/material'

interface GridProps {
  headers: GridColDef[],
  rows: any,
  onRowClick: (params: GridRowParams) => void,
  minHeight?: number
}

const CustomNoRowsOverlay = () => {
  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', paddingTop: '60px', fontSize: '12px', fontWeight: '500', color: '#fff' }}>
      No position to display.
    </Box>
  )
}

export const Grid: React.FC<GridProps> = ({ headers, rows, minHeight = 260, onRowClick }) => (
  <DataGrid
    sx={{
      border: 0,
      color: '#fff',
      minHeight: `${minHeight}px`,
      '& .last--cell': {
        display: 'flex',
        justifyContent: 'flex-end',
        maxWidth: '180px',
      },
      '& .MuiDataGrid-columnHeaderTitle': {
        color: '#989898',
        fontSize: '12px'
      },
      '& .last--header': {
        '& .MuiDataGrid-columnHeaderTitleContainer': {
          display: 'flex',
          justifyContent: 'right'
        },
        borderRight: '0px !important'
      },
      '& .MuiDataGrid-columnHeaders': {
        borderBottom: '0px',
        marginTop: '-5px'
      },
      '& .MuiDataGrid-columnHeader:focus': {
        outline: 'none',
      },
      '& .MuiDataGrid-columnSeparator': {
        display: 'none',
      },
      '& .MuiDataGrid-row': {
        cursor: 'pointer',
      },
      '& .MuiDataGrid-row:hover': {
        backgroundColor: 'rgba(255, 255, 255, 0.1)'
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
      '& .MuiDataGrid-withBorder': {
        borderRight: '0px solid #3f3f3f',
        marginLeft: '-1px'
      },
    }}
    components={{
      NoResultsOverlay: CustomNoRowsOverlay
    }}
    getRowClassName={(params) => {
      return 'super-app-theme--row'
    }}
    disableColumnFilter
    disableSelectionOnClick
    disableColumnSelector
    disableColumnMenu
    disableDensitySelector
    disableExtendRowFullWidth
    hideFooter
    headerHeight={0}
    rowHeight={60}
    rowCount={20}
    onRowClick={onRowClick}
    columns={headers}
    rows={rows || []}
  />
)
