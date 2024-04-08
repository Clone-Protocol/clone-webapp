import { styled } from '@mui/material/styles'

export enum IndicatorStatus {
  Green,
  Yellow,
  Red
}

export const IndicatorGreen = () => <Indicator style={{ backgroundColor: '#00ff99' }} />

export const IndicatorYellow = () => <Indicator style={{ backgroundColor: '#fffc72' }} />

export const IndicatorRed = () => <Indicator style={{ backgroundColor: '#ff0084' }} />

const Indicator = styled('div')`
  width: 8px;
  height: 8px;
  border-radius: 999px;
`