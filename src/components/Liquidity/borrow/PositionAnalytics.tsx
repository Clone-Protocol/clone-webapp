import { Typography, Box } from '@mui/material'
import { styled } from '@mui/material/styles'
import { usePoolAnalyticsQuery } from '~/features/Liquidity/overview/PoolAnalytics.query'
import InfoTooltip from '~/components/Common/InfoTooltip'
import { TooltipTexts } from '~/data/tooltipTexts'
import { formatLocaleAmount } from '~/utils/numbers'

const TxtPriceRate = ({ val, rate }: { val: number, rate: number }) => {
  if (isFinite(rate)) {
    if (rate >= 0) {
      return (
        <Typography variant="p" color='#c4b5fd'>+{Math.abs(rate).toLocaleString()}%</Typography>
      )
    } else {
      return (
        <Typography variant="p" color="#258ded">-{Math.abs(rate).toLocaleString()}%</Typography>
      )
    }
  } else {
    return <></>
  }
}

const PositionAnalytics = ({ price, tickerSymbol }: { price: number, tickerSymbol: string }) => {
  const { data: resultData } = usePoolAnalyticsQuery({
    tickerSymbol,
    refetchOnMount: "always",
    enabled: tickerSymbol != null
  })

  const relativeVal = (currentVal: number, rate: number) => {
    const prev = currentVal / (1 + rate / 100)
    return (
      currentVal - prev
    )
  }

  return resultData ? (
    <Box>
      <Box my="12px"><Typography variant="p_lg">{tickerSymbol} Borrow Position Analytics</Typography></Box>
      <DataBox>
        <Box>
          <Typography variant="p" color='#66707e'>Total Borrowed</Typography>
          <InfoTooltip title={TooltipTexts.totalBorrowed} color='#66707e' />
        </Box>
        <Box whiteSpace='nowrap'><Typography variant="p_xlg">{formatLocaleAmount(resultData?.currentAmountBorrowed, 5)} {tickerSymbol}</Typography> <Typography variant='p_xlg' color='#66707e' mx='10px'>${formatLocaleAmount(price * resultData?.currentAmountBorrowed)} USD</Typography> <TxtPriceRate val={relativeVal(resultData!.currentAmountBorrowed, resultData!.amountBorrowedRate)} rate={resultData!.amountBorrowedRate} /></Box>
      </DataBox>
      <DataBox>
        <Box>
          <Typography variant="p" color='#66707e'>TVL (Collateral)</Typography>
          <InfoTooltip title={TooltipTexts.tvlCollateral} color='#66707e' />
        </Box>
        <Box><Typography variant="p_xlg" mr='10px'>${formatLocaleAmount(resultData?.currentTVL)} USD</Typography> <TxtPriceRate val={relativeVal(resultData!.currentTVL, resultData!.tvlRate)} rate={resultData!.tvlRate} /></Box>
      </DataBox>
    </Box>
  ) : <></>
}

const DataBox = styled(Box)`
  width: 100%;
  height: 61px;
  margin-bottom: 12px;
  padding: 4px 16px;
  border: solid 1px ${(props) => props.theme.basis.darkPurple};
`

export default PositionAnalytics
