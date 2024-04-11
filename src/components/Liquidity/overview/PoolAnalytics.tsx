import { styled, Typography, Box } from '@mui/material'
import { usePoolAnalyticsQuery } from '~/features/Liquidity/overview/PoolAnalytics.query'
import InfoTooltip from '~/components/Common/InfoTooltip'
import { TooltipTexts } from '~/data/tooltipTexts'
import { ON_USD } from '~/utils/constants'
import { formatLocaleAmount } from '~/utils/numbers'

const TxtPriceRateComparePast = ({ val, rate }: { val: number, rate: number }) => {
  if (isFinite(rate)) {
    if (rate >= 0) {
      return (
        <Typography variant="p_sm" color='#4fe5ff'>+{val.toLocaleString()} ({rate.toLocaleString()}%) past 24h</Typography>
      )
    } else {
      return (
        <Typography variant="p_sm" color="#258ded">-{Math.abs(val).toLocaleString()} ({rate.toLocaleString()}%) past 24h</Typography>
      )
    }
  } else {
    return <></>
  }
}

const TxtPriceRate = ({ rate }: { rate: number }) => {
  if (isFinite(rate)) {
    return (
      <Typography variant="p" color={rate >= 0 ? '#4fe5ff' : '#258ded'} ml='5px'>  {rate >= 0 ? '+' : '-'}{Math.abs(rate).toLocaleString()}%</Typography>
    )
  } else {
    return <></>
  }
}

const PoolAnalytics = ({ tickerSymbol }: { tickerSymbol: string }) => {
  const { data: resultData } = usePoolAnalyticsQuery({
    tickerSymbol,
    refetchOnMount: true,
    enabled: tickerSymbol != null
  })

  return (
    <Box>
      <Box mb="12px"><Typography variant="p_lg">{tickerSymbol}/{ON_USD} Pool Analytics</Typography></Box>
      <DataBox>
        <Box>
          <Typography variant="p" color='#66707e'>Total Liquidity</Typography>
          <InfoTooltip title={TooltipTexts.totalLiquidity} color='#66707e' />
        </Box>
        <Box mt='-4px'><Typography variant="p_xlg">${formatLocaleAmount(resultData?.totalLiquidity)} USD</Typography> <TxtPriceRate rate={resultData!.liquidityGainPct} /></Box>
      </DataBox>
      <DataBox>
        <Box>
          <Typography variant="p" color='#66707e'>24h Trading Volume</Typography>
        </Box>
        <Box><Typography variant="p_xlg">${formatLocaleAmount(resultData?.tradingVol24h)} USD</Typography> <TxtPriceRate rate={resultData!.tradingVolGainPct} /></Box>
      </DataBox>
      <DataBox>
        <Box>
          <Typography variant="p" color='#66707e'>APR</Typography>
          <InfoTooltip title={TooltipTexts.avgAPY24h} color='#66707e' />
        </Box>
        <Box mt='-4px'><Typography variant="p_xlg" color={resultData?.avgAPY24hr! > 0 ? '#4fe5ff' : 'white'}>
          {
            resultData?.avgAPY24hr! >= 0.01 ? `+${Math.abs(resultData?.avgAPY24hr!).toLocaleString()}` : resultData?.avgAPY24hr! > 0 ? '<0.01' : '0.00'
          }%
        </Typography></Box>
      </DataBox>
    </Box>
  )
}

const DataBox = styled(Box)`
  width: 100%;
  height: 61px;
  margin-bottom: 12px;
  padding: 4px 16px;
  border: solid 1px ${(props) => props.theme.basis.jurassicGrey};
`

export default PoolAnalytics
