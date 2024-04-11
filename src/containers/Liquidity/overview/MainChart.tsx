import React, { useEffect, useMemo, useState } from 'react'
import { styled } from '@mui/system'
import { Box } from '@mui/material'
import { LoadingProgress } from '~/components/Common/Loading'
import withSuspense from '~/hocs/withSuspense'
import { formatDollarAmount } from '~/utils/numbers'
import LineChartAlt from '~/components/Charts/LineChartAlt'
import { StyledTabs, StyledTab } from '~/components/Charts/StyledTab'
import { TimeTabs, TimeTab, FilterTimeMap, FilterTime } from '~/components/Charts/TimeTabs'
import { useTotalLiquidityQuery, useTotalValueLockedQuery, useTotalVolumeQuery } from '~/features/Chart/Liquidity.query'

const MainChart: React.FC = () => {
  const [tab, setTab] = useState(0)
  const [filterTime, setFilterTime] = useState<FilterTime>('30d')
  const [chartHover, setChartHover] = useState<number | undefined>()
  //temporary
  const isTvlTab = tab === 2

  const handleChangeTab = (event: React.SyntheticEvent, newValue: number) => {
    setTab(newValue)
  }
  const handleFilterChange = (event: React.SyntheticEvent, newValue: FilterTime) => {
    setFilterTime(newValue)
  }

  const { data: totalVolumeDay } = useTotalVolumeQuery({
    timeframe: filterTime,
    refetchOnMount: false,
    enabled: tab === 0
  })

  const { data: totalLiquidityDay } = useTotalLiquidityQuery({
    timeframe: filterTime,
    refetchOnMount: false,
    enabled: tab === 1
  })

  const { data: totalTVL } = useTotalValueLockedQuery({
    timeframe: filterTime,
    refetchOnMount: false,
    enabled: tab === 2
  })

  useEffect(() => {
    if (tab === 0) {
      setChartHover(totalVolumeDay?.chartData[totalVolumeDay?.chartData.length - 1].value)
    } else if (tab === 1) {
      setChartHover(totalLiquidityDay?.chartData[totalLiquidityDay?.chartData.length - 1].value)
    } else if (tab === 2) {
      setChartHover(totalTVL ?? 0)
    }
  }, [totalLiquidityDay, totalVolumeDay, tab])

  useMemo(() => {
    if (chartHover === undefined) {
      if (tab === 0) {
        setChartHover(totalVolumeDay?.chartData[totalVolumeDay?.chartData.length - 1].value)
      } else if (tab === 1) {
        setChartHover(totalLiquidityDay?.chartData[totalLiquidityDay?.chartData.length - 1].value)
      } else if (tab === 2) {
        setChartHover(totalTVL ?? 0)
      }
    }
  }, [chartHover, tab, totalLiquidityDay, totalVolumeDay])

  return (
    <LineChartAlt
      data={tab === 0 ? totalVolumeDay?.chartData : totalLiquidityDay?.chartData}
      value={chartHover}
      setValue={setChartHover}
      maxY={tab === 0 ? totalVolumeDay?.maxValue : tab === 1 ? totalLiquidityDay?.maxValue : 0}
      minY={tab === 0 ? totalVolumeDay?.minValue : tab === 1 ? totalLiquidityDay?.minValue : 0}
      defaultValue={tab === 0 ? totalVolumeDay?.chartData[totalVolumeDay?.chartData.length - 1].value : 0}
      isTvlTab={isTvlTab}
      topLeft={
        <Box>
          <Box ml='20px'>
            <StyledTabs value={tab} onChange={handleChangeTab}>
              <StyledTab value={0} label="Total Volume"></StyledTab>
              <StyledTab value={1} label="Total Liquidity"></StyledTab>
              <StyledTab value={2} label="TVL"></StyledTab>
            </StyledTabs>
          </Box>
          <SelectValue>{formatDollarAmount(chartHover, 0, true)}</SelectValue>
        </Box>
      }
      topRight={
        <div style={{ marginTop: '4px', marginRight: '15px' }}>
          <TimeTabs value={filterTime} onChange={handleFilterChange}>
            {Object.keys(FilterTimeMap).map((f) => (
              <TimeTab key={f} value={f} label={FilterTimeMap[f as FilterTime]} />
            ))}
          </TimeTabs>
        </div>
      }
    />
  )
}

const SelectValue = styled(Box)`
  font-size: 32px;
  font-weight: 500;
  font-stretch: normal;
  font-style: normal;
  line-height: normal;
  letter-spacing: normal;
  text-align: left;
  color: #fff;
  margin-left: 20px;
  margin-top: 5px;
`

export default withSuspense(MainChart, <LoadingProgress />)
