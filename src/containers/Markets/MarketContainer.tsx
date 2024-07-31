'use client'
import React, { useState, useEffect } from 'react'
import { Box, Stack, Theme, useMediaQuery } from '@mui/material'
import MarketDetail from '~/containers/Markets/MarketDetail'
import TradingBox from '~/containers/Markets/TradingBox'
import ChartSwitch from '~/components/Markets/TradingBox/ChartSwitch';
import { ShowChartBtn } from '~/components/Common/CommonButtons';
import { DefaultBalance, MarketDetail as MarketDetailType, useMarketDetailQuery } from '~/features/Markets/MarketDetail.query'
import withSuspense from '~/hocs/withSuspense'
import { LoadingSkeleton } from '~/components/Common/Loading'

const MarketContainer = ({ assetId }: { assetId: number }) => {
  const isMobileOnSize = useMediaQuery((theme: Theme) => theme.breakpoints.down('md'))
  const [showChart, setShowChart] = useState(false)

  const toggleShowTrading = () => {
    setShowChart(!showChart)
  }

  useEffect(() => {
    if (!isMobileOnSize) {
      setShowChart(false)
    }
  }, [isMobileOnSize])

  const { marketDetailSuspenseQuery, defaultBalanceSuspenseQuery } = useMarketDetailQuery({
    index: assetId,
    refetchOnMount: true,
  })
  const { data: defaultBalance } = defaultBalanceSuspenseQuery
  const { data: assetData } = marketDetailSuspenseQuery

  return (
    <div>
      <>
        <Stack direction={isMobileOnSize ? 'column' : 'row'} gap={5} justifyContent="center" alignItems={isMobileOnSize ? "center" : ""}>
          {showChart &&
            <Box minWidth={isMobileOnSize ? '360px' : '750px'} width={isMobileOnSize ? '100%' : '750px'} bgcolor={isMobileOnSize ? '#0f0e14' : 'transparent'} zIndex={99}>
              <MarketDetail assetId={assetId} assetData={assetData} />
            </Box>
          }
          <Box width={isMobileOnSize ? '100%' : '420px'} height='100%' overflow={isMobileOnSize ? 'auto' : 'hidden'} position={isMobileOnSize ? 'fixed' : 'relative'} display={isMobileOnSize ? 'flex' : 'block'} justifyContent={isMobileOnSize ? 'center' : ''} top={isMobileOnSize ? '85px' : 'inherit'} mt='24px' mb={isMobileOnSize ? '180px' : '0px'}>
            {!isMobileOnSize &&
              <ChartSwitch onChange={() => toggleShowTrading()} checked={showChart} />
            }

            <TradingBox assetId={assetId} assetData={assetData as MarketDetailType} defaultBalance={defaultBalance as DefaultBalance} />
          </Box>
        </Stack>
      </>
      <Box display={isMobileOnSize ? 'block' : 'none'}><ShowChartBtn onClick={() => toggleShowTrading()}>{showChart ? 'Hide Chart' : 'Show Chart'}</ShowChartBtn></Box>
    </div>
  )
}



export default withSuspense(MarketContainer, <Box mt='10px'><LoadingSkeleton /></Box>)
