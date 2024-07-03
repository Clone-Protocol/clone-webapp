import React from "react"
import { Box, Typography } from "@mui/material"
import { styled } from '@mui/system'
import Image from "next/image"
import LineChart from "~/components/Charts/LineChart"
import { usePriceHistoryQuery } from "~/features/Chart/PriceByAsset.query"
import withSuspense from "~/hocs/withSuspense"
import { LoadingSkeleton } from "~/components/Common/Loading"
import AnalyticsIcon from 'public/images/liquidity/analytics-sketch.svg'
import { PublicKey } from "@solana/web3.js"
import { formatLocaleAmount } from "~/utils/numbers"
import { assetMapping } from "~/data/assets"

interface Props {
  assetIndex: number
  publicKey: PublicKey
  isOraclePrice?: boolean
  priceTitle: string
}

const PriceChart: React.FC<Props> = ({ assetIndex, publicKey, priceTitle }) => {
  const assetData = assetMapping(assetIndex)
  const { data: priceHistory } = usePriceHistoryQuery({
    timeframe: "24h",
    assetIndex,
    pythSymbol: assetData?.pythSymbol,
    refetchOnMount: true,
    enabled: assetData != null && publicKey != null,
  })

  return priceHistory ? (
    <>
      <Box display="flex" alignItems='center'>
        <Image src={assetData.tickerIcon} width={30} height={30} alt={assetData.tickerSymbol!} />
        <Typography variant="h3" fontWeight={500} ml='14px'>
          {assetData.tickerName}
        </Typography>
        <Typography variant="h3" fontWeight={500} color='#8988a3' ml='8px'>
          {assetData.tickerSymbol}
        </Typography>
      </Box>
      <Box display="flex" alignItems="center" my='10px'>
        <Typography variant="h2" fontWeight={500}>
          ${formatLocaleAmount(priceHistory.currentPrice, 3)}
        </Typography>
        <Typography variant="p_lg" color="#8988a3" ml="10px">
          {priceTitle}
        </Typography>
      </Box>
      {priceHistory.rateOfPrice && (
        <Typography variant="p_lg" color="#c4b5fd">
          {priceHistory.rateOfPrice >= 0 ? "+" : "-"}$
          {Math.abs(priceHistory.rateOfPrice).toFixed(3)} ({priceHistory.percentOfRate?.toFixed(2)}%)
          past 24h
        </Typography>
      )}
      <LineChart data={priceHistory.chartData} />
    </>
  ) : (
    <DefaultAnalyticsBox>
      <Box><Image src={AnalyticsIcon} alt='analytics' /></Box>
      <Typography variant='p_xlg'>Pool analytics will appear here</Typography>
    </DefaultAnalyticsBox>
  )
}

const DefaultAnalyticsBox = styled(Box)`
  width: 100%;
  height: 590px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  border: solid 1px ${(props) => props.theme.basis.jurassicGrey};
  color: ${(props) => props.theme.basis.shadowGloom};
`

export default withSuspense(PriceChart, <Box mt='10px'><LoadingSkeleton /></Box>)
