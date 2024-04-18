import { Box, Typography } from '@mui/material'
import { styled } from '@mui/material/styles'
import { GridColDef, GridRenderCellParams } from '@mui/x-data-grid'
import { LoadingProgress } from '~/components/Common/Loading'
import withSuspense from '~/hocs/withSuspense'
import { Grid } from '~/components/Common/DataGrid'
import { CustomNoRowsOverlay } from '~/components/Common/DataGrid'
import { formatLocaleAmount } from '~/utils/numbers'
import { useStatsQuery } from '~/features/Stats/Stats.query'

const StatsList = () => {
  const { data: statsList } = useStatsQuery({
    refetchOnMount: true,
    enabled: true
  })

  return (
    <PanelBox>
      <Grid
        headers={columns}
        rows={statsList || []}
        minHeight={110}
        isBorderTopRadius={true}
        customNoResultsOverlay={() => CustomNoRowsOverlay('No Stats')}
      />
    </PanelBox>
  )
}

let columns: GridColDef[] = [
  {
    field: 'symbol',
    headerClassName: 'super-app-theme--header',
    cellClassName: 'super-app-theme--cell',
    headerName: 'symbol',
    flex: 2,
    renderCell(params: GridRenderCellParams<string>) {
      return <Typography variant='p'>{formatLocaleAmount(params.value)}</Typography>
    },
  },
  {
    field: 'poolPrice',
    headerClassName: 'super-app-theme--header right--header',
    cellClassName: 'super-app-theme--cell right--cell',
    headerName: `poolPrice`,
    flex: 2,
    renderCell(params: GridRenderCellParams<number>) {
      return <Typography variant='p'>{formatLocaleAmount(params.value)}</Typography>
    },
  },
  {
    field: 'oraclePrice',
    headerClassName: 'super-app-theme--header right--header',
    cellClassName: 'super-app-theme--cell right--cell',
    headerName: 'oraclePrice',
    flex: 2,
    renderCell(params: GridRenderCellParams<number>) {
      return <Typography variant='p'>{formatLocaleAmount(params.value)}</Typography>
    },
  },
  {
    field: 'premium',
    headerClassName: 'super-app-theme--header right--header',
    cellClassName: 'super-app-theme--cell right--cell',
    headerName: 'premium',
    flex: 2,
    renderCell(params: GridRenderCellParams<number>) {
      return <Typography variant='p'>{formatLocaleAmount(params.value)}</Typography>
    },
  },
  {
    field: 'capacity',
    headerClassName: 'super-app-theme--header right--header',
    cellClassName: 'super-app-theme--cell right--cell',
    headerName: 'capacity',
    flex: 2,
    renderCell(params: GridRenderCellParams<number>) {
      return <Typography variant='p'>{formatLocaleAmount(params.value)}</Typography>
    },
  },
  {
    field: 'timestamp',
    headerClassName: 'super-app-theme--header right--header',
    cellClassName: 'super-app-theme--cell right--cell',
    headerName: 'timestamp',
    flex: 2,
    renderCell(params: GridRenderCellParams<number>) {
      return <Typography variant='p'>{new Date(params.value! * 1000).toDateString()}</Typography>
    },
  },
]

const PanelBox = styled(Box)`
  color: #fff;
  & .super-app-theme--header { 
    color: #9d9d9d; 
    font-size: 11px; 
  }
  & .MuiDataGrid-columnHeaderTitle {
    text-overflow: initial !important;
  }
`

columns = columns.map((col) => Object.assign(col, { hideSortIcons: true, filterable: false }))

export default withSuspense(StatsList, <LoadingProgress />)
