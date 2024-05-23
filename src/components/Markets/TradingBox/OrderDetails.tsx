import React from 'react';
import { Box, Stack, Typography } from '@mui/material'
import { styled } from '@mui/material/styles'
import InfoTooltip from '~/components/Common/InfoTooltip'
import { ON_USD } from '~/utils/constants';
import { TooltipTexts } from '~/data/tooltipTexts';
import { formatLocaleAmount } from '~/utils/numbers';
import ArrowIcon from 'public/images/dropdown-show-more-arrow-right.svg'
import Image from 'next/image';
import StarPlusIcon from 'public/images/star-plus.svg'
import { LEVEL_DISCOUNT_PRICING_FEES, LevelInfo } from '~/features/Staking/StakingInfo.query';
import { useWallet } from '@solana/wallet-adapter-react';

interface Props {
  levelData: LevelInfo | null | undefined
  isBuy: boolean,
  onusdAmount: number,
  onassetPrice: number
  onassetAmount: number
  tickerSymbol: string
  priceImpact: number
  slippage: number
  tradeFee: number
  estimatedFees: number
  feesAreNonZero: boolean
}

const OrderDetails: React.FC<Props> = ({ levelData, isBuy, onusdAmount, onassetPrice, onassetAmount, tickerSymbol, priceImpact, slippage, tradeFee, estimatedFees, feesAreNonZero }) => {
  const { publicKey } = useWallet()
  const isShowBenefit = publicKey && levelData && levelData.currentLevel !== 0
  const slippageMultiplier = (1 - (slippage / 100))
  const [minReceived, outputSymbol, tradeFeeDollar] = (() => {
    if (isBuy) {
      return [slippageMultiplier * onassetAmount, tickerSymbol, estimatedFees * onassetPrice]
    } else {
      return [slippageMultiplier * onusdAmount, ON_USD, estimatedFees]
    }
  })()

  const finalEstimatedFees = isShowBenefit ? estimatedFees * (1 - LEVEL_DISCOUNT_PRICING_FEES[levelData.currentLevel] / 1000) : estimatedFees
  const discountFeeRate = isShowBenefit ? tradeFee - LEVEL_DISCOUNT_PRICING_FEES[levelData.currentLevel] / 1000 : estimatedFees
  const finalTradeFeeDollar = isShowBenefit ? tradeFeeDollar * (1 - LEVEL_DISCOUNT_PRICING_FEES[levelData.currentLevel] / 1000) : tradeFeeDollar

  return (
    <Wrapper>
      <Stack direction="row" justifyContent="space-between" alignItems="center">
        <Typography variant='p' color='#c5c7d9' display='flex' alignItems='center'>Price Impact <InfoTooltip title={TooltipTexts.priceImpact} color='#8988a3' /></Typography>
        {feesAreNonZero ?
          <PriceImpactValue sx={{ color: priceImpact > 5 ? '#FF0084' : '#c4b5fd' }}>{isNaN(priceImpact) || priceImpact < 0.1 ? '<' : '~'} {isNaN(priceImpact) ? '0.1' : Math.max(priceImpact, 0.1)}%</PriceImpactValue>
          :
          <PriceImpactValue sx={{ color: '#8988a3' }}>-</PriceImpactValue>
        }
      </Stack>
      <Stack mt="10px" direction="row" justifyContent="space-between" alignItems="center">
        <Typography variant='p' color='#c5c7d9' display='flex' alignItems='center'>Minimum received <InfoTooltip title={TooltipTexts.minimumReceived} color='#8988a3' /></Typography>
        <div style={{ lineHeight: '10px', textAlign: 'right' }}>
          <Box><Typography variant='p' fontWeight={600} color='#c4b5fd'>{isNaN(minReceived) ? '0' : formatLocaleAmount(minReceived)} {outputSymbol}</Typography></Box>
          <Box><Typography variant='p_sm' color='#8988a3'>Slippage tolerance: {formatLocaleAmount(slippage)}%</Typography></Box>
        </div>
      </Stack>
      <Stack mt="10px" direction="row" justifyContent="space-between" alignItems="center">
        <TradingFeeTxt className={isShowBenefit ? 'discountFee' : ''} color="#c5c7d9" variant='p' display='flex' alignItems='center'>
          {isShowBenefit && <Image src={StarPlusIcon} alt='trading-star' />} Trading Fees <InfoTooltip title={TooltipTexts.tradeFees} color='#8988a3' />
        </TradingFeeTxt>
        <div style={{ lineHeight: '10px', textAlign: 'right' }}>
          <TradingFeeTxt className={isShowBenefit ? 'discountFee' : ''} variant='p' fontWeight={600} color='#c4b5fd'>{isNaN(finalEstimatedFees) ? '0' : finalEstimatedFees?.toFixed(6)} {outputSymbol}</TradingFeeTxt>
          <Box display='flex' alignItems='center' justifyContent='flex-end' mt='3px'>
            <Typography variant='p_sm' color='#8988a3' style={{ marginRight: '5px', marginTop: '1px' }}>{tradeFee.toFixed(2)}%</Typography>
            {!isShowBenefit ?
              <Typography variant='p_sm' color='#8988a3'>(${isNaN(finalTradeFeeDollar) ? '0' : finalTradeFeeDollar?.toFixed(6)})</Typography>
              :
              <Stack direction='row' alignItems='center'>
                <Image src={ArrowIcon} alt='arrow' style={{ marginBottom: '-1px', marginRight: '2px' }} />
                <TradingFeeTxt className={isShowBenefit ? 'discountFee' : ''} variant='p_sm' color='#8988a3'>{discountFeeRate.toFixed(2)}% (${isNaN(finalTradeFeeDollar) ? '0' : finalTradeFeeDollar?.toFixed(6)})</TradingFeeTxt>
              </Stack>
            }
          </Box>
        </div>
      </Stack>
    </Wrapper>
  )
}

const Wrapper = styled(Box)`
  width: 100%;
  margin: 13px 0 16px;
  padding: 5px 12px;
  border-radius: 10px;
  background-color: rgba(255, 255, 255, 0.05);
`
const PriceImpactValue = styled('div')`
  color: ${(props) => props.theme.basis.lightGreen};
  font-size: 12px; 
  font-weight: 600;
`
const TradingFeeTxt = styled(Typography)`
  &.discountFee {
    background-image: linear-gradient(101deg, #b5fdf9 1%, #c4b5fd 93%);
    -webkit-background-clip: text;
    background-clip: text;
    -webkit-text-fill-color: transparent;
  }
`

export default OrderDetails