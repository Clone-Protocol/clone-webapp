import { Box, Typography } from '@mui/material'
import { styled } from '@mui/material/styles'
import { useEffect, useState } from 'react'
import { LoadingProgress } from '~/components/Common/Loading'
import withSuspense from '~/hocs/withSuspense'
import { fetchMetabaseUrl } from '~/utils/fetch_netlify'
const MetabaseStats = () => {
  const [iframeUrl, setIframeUrl] = useState('')

  useEffect(() => {
    const getStatsUrl = async () => {
      const response = await fetchMetabaseUrl()
      const url = response.url
      setIframeUrl(url)
    }
    getStatsUrl()
  }, [])

  return (
    <PanelBox>
      <Typography variant='h4'>Total Volume</Typography>
      <iframe
        src={iframeUrl}
        frameBorder={0}
        width={'100%'}
        height={400}
        allowTransparency
      />
    </PanelBox>
  )
}


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

export default withSuspense(MetabaseStats, <LoadingProgress />)
