import React, { useCallback, useMemo, useState } from 'react'
import { Box, Typography } from '@mui/material'
import { TimeTabs, TimeTab, FilterTimeMap, FilterTime } from '~/components/Charts/TimeTabs'
import LineChartAlt from '~/components/Charts/LineChartAlt'
// import { useTotalPriceQuery } from '~/features/Chart/Prices.query'
import { formatDollarAmount } from '~/utils/numbers'
import Image from 'next/image'
import ArrowUpward from 'public/images/arrow-up-green.svg'
import ArrowDownward from 'public/images/arrow-down-red.svg'
import PoweredByPyth from 'public/images/powered_pyth.svg'
import { usePriceHistoryQuery } from '~/features/Chart/PriceByAsset.query'
import { ON_USD } from '~/utils/constants'

const Chart = ({ pythSymbol }: { pythSymbol: string }) => {
  const [filterTime, setFilterTime] = useState<FilterTime>('7d')
  const [chartHover, setChartHover] = useState<number | undefined>()
  const [percentOfRateHover, setPercentOfRateHover] = useState<number>(0)
  const { data: priceHistory } = usePriceHistoryQuery({
    timeframe: filterTime,
    pythSymbol: pythSymbol,
    refetchOnMount: true,
    enabled: pythSymbol != null
  })

  const handleFilterChange = useCallback((event: React.SyntheticEvent, newValue: FilterTime) => {
    setFilterTime(newValue)
  }, [filterTime])

  useMemo(() => {
    if (priceHistory && priceHistory?.chartData.length > 0) {
      setChartHover(priceHistory?.chartData[priceHistory?.chartData.length - 1].value)
      setPercentOfRateHover(priceHistory.percentOfRate)
    }
  }, [priceHistory])

  useMemo(() => {
    if (chartHover === undefined && priceHistory && priceHistory?.chartData.length > 0) {
      setChartHover(priceHistory?.chartData[priceHistory?.chartData.length - 1].value)
    } else if (chartHover !== undefined && priceHistory && priceHistory?.chartData.length > 0) {
      const previousPrice = priceHistory?.chartData[0].value
      const percentOfRate = 100 * (chartHover - previousPrice) / previousPrice
      setPercentOfRateHover(percentOfRate)
    }
  }, [chartHover, priceHistory])


  return (
    priceHistory ?
      <Box position='relative'>
        <LineChartAlt
          data={priceHistory.chartData}
          value={chartHover}
          setValue={setChartHover}
          maxY={priceHistory?.maxValue}
          minY={priceHistory?.minValue}
          topLeft={
            <Box mb='25px'>
              <Box display='flex' alignItems='baseline'>
                <Typography variant='h1' fontWeight={500}>{formatDollarAmount(chartHover, 3, true)}</Typography>
                <Typography variant='p_xlg' ml='8px'>{ON_USD}</Typography>
              </Box>
              <Box display='flex' alignItems='center' gap={1}>
                <Box display='flex' alignItems='center' gap={1}>
                  <Typography variant='p_xlg' color={percentOfRateHover >= 0 ? '#00ff99' : '#ff0084'}>{percentOfRateHover >= 0 ? '+' : ''}{percentOfRateHover?.toFixed(2)}%</Typography>
                  <Image src={percentOfRateHover >= 0 ? ArrowUpward : ArrowDownward} alt='arrow' />
                </Box>
              </Box>
            </Box>
          }
          topRight={
            <div style={{ marginTop: '25px', marginBottom: '30px' }}>
              <TimeTabs value={filterTime} onChange={handleFilterChange}>
                {Object.keys(FilterTimeMap).map((f) => (
                  <TimeTab key={f} value={f} label={FilterTimeMap[f as FilterTime]} />
                ))}
              </TimeTabs>
            </div>
          }
        />
        <Box position='absolute' bottom='0px' right='20px'>
          <Image src={PoweredByPyth} alt='powered_by_pyth' />
        </Box>
      </Box> : <></>
  )
}

export default Chart
