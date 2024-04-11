import { floorToScale } from 'clone-protocol-sdk/sdk/src/utils'
import numbro from 'numbro'

export const formatDollarAmount = (num: number | undefined, digits = 2, round = true) => {
  if (num === 0) return '$0.00'
  if (!num) return '-'
  if (num < 0.001 && digits <= 3) {
    return '<$0.001'
  }

  return numbro(num).formatCurrency({
    average: round,
    mantissa: num > 1000 ? 2 : digits,
    abbreviations: {
      million: 'M',
      billion: 'B',
    },
  })
}

export const formatLocaleAmount = (num: number | string | undefined | never[], maxFractionDigits = 3) => {
  return num?.toLocaleString('en-US', { maximumFractionDigits: maxFractionDigits })
}

export const formatHealthScore = (score: number): string => {
  score = (isNaN(score)) ? 0 : score

  return Math.max(0, Math.min(100, score)).toFixed(2)
}

export const formatNumberToString = (num: number, scale: number): string => {
  return floorToScale(num, scale).toFixed(scale)
}