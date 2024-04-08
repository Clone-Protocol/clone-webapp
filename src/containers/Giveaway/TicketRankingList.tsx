import { Box, Tooltip, Typography } from '@mui/material'
import { styled } from '@mui/system'
import { GridColDef, GridRenderCellParams } from '@mui/x-data-grid'
import { LoadingProgress } from '~/components/Common/Loading'
import withSuspense from '~/hocs/withSuspense'
import { Grid } from '~/components/Common/DataGrid'
import { CustomNoRowsOverlay } from '~/components/Common/DataGrid'
import { shortenAddress } from '~/utils/address'
import { formatLocaleAmount } from '~/utils/numbers'
import { PointTextForPyth } from '~/components/Points/PointMultiplierText'
import { TooltipTexts } from '~/data/tooltipTexts'
import { useTicketRankingQuery } from '~/features/Giveaway/TicketRanking.query'

const TicketRankingList = () => {
  const { data: rankList } = useTicketRankingQuery({
    refetchOnMount: true,
    enabled: true
  })

  return (
    <PanelBox>
      <Grid
        headers={columns}
        rows={rankList || []}
        minHeight={110}
        isBorderTopRadius={true}
        customNoResultsOverlay={() => CustomNoRowsOverlay('No Rank')}
      />
    </PanelBox>
  )
}

const formatUserDisplayName = ({ name, address }: { name: string | undefined, address: string }) => {
  const displayName = name ?? address;
  return shortenAddress(displayName, 15, 6)
}

let columns: GridColDef[] = [
  {
    field: 'user',
    headerClassName: 'super-app-theme--header',
    cellClassName: 'super-app-theme--cell',
    headerName: `User`,
    flex: 1,
    renderCell(params: GridRenderCellParams<{ name: string | undefined, address: string }>) {

      return <Box display='flex' alignItems='center' gap={1}>
        <a href={`https://solana.fm/address/${params.value!.address.toString()}`} target='_blank' rel='noreferrer' style={{ color: '#fff' }}>
          <Typography variant='p_xlg' sx={{ ':hover': { color: '#c4b5fd' } }}>{formatUserDisplayName(params.value!)}</Typography>
        </a>
      </Box>

    },
  },
  {
    field: 'totalTickets',
    headerClassName: 'super-app-theme--header right--header',
    cellClassName: 'super-app-theme--cell right--cell',
    headerName: 'Total Tickets',
    flex: 1,
    renderCell(params: GridRenderCellParams<string>) {
      const hasPythPoint = params.row.hasPythPoint
      const pythPointTier = params.row.pythPointTier

      return <Box display='flex' alignItems='center' gap='7px'>
        <Typography variant='p_lg'>{formatLocaleAmount(params.value)}</Typography>
        {hasPythPoint &&
          <Tooltip title={TooltipTexts.points.multiplier} placement="top">
            <Box><PointTextForPyth pythPointTier={pythPointTier} /></Box>
          </Tooltip>
        }
      </Box>
    },
  },
]

const PanelBox = styled(Box)`
  width: 474px;
  color: #fff;
  & .super-app-theme--header { 
    color: #1a1a1a !important;
    font-size: 11px !important;
  }
  & .MuiDataGrid-columnHeaderTitle {
    color: #989898 !important;
  }
  & .MuiDataGrid-columnHeaders {
    border-bottom-color: rgba(255, 255, 255, 0.1) !important;
  }
  & .MuiDataGrid-main {
    border-color: rgba(255, 255, 255, 0.1) !important;
    border-radius: 10px !important;
  }
  & .MuiDataGrid-row {
    border-bottom: 1px solid rgba(255, 255, 255, 0.1) !important;
  }
`

columns = columns.map((col) => Object.assign(col, { hideSortIcons: true, filterable: false }))

export default withSuspense(TicketRankingList, <LoadingProgress />)
