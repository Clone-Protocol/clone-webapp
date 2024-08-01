import React, { Dispatch, SetStateAction, ReactNode, useState } from 'react';
import { styled } from '@mui/system'
import { Card, Box, Typography } from '@mui/material'
import { ResponsiveContainer, YAxis, Tooltip, AreaChart, Area } from 'recharts'
import { withCsrOnly } from '~/hocs/CsrOnly'
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import { darken } from 'polished'
import { ChartElem } from '~/features/Chart/Liquidity.query';
dayjs.extend(utc)

export type LineChartProps = {
  data: ChartElem[]
  color?: string | undefined
  height?: number | undefined
  minHeight?: number
  setValue?: Dispatch<SetStateAction<number | undefined>> // used for value on hover
  setLabel?: Dispatch<SetStateAction<string | undefined>> // used for label of valye
  defaultValue?: number
  isTvlTab?: boolean
  value?: number
  label?: string
  topLeft?: ReactNode | undefined
  topRight?: ReactNode | undefined
  bottomLeft?: ReactNode | undefined
  bottomRight?: ReactNode | undefined
  maxY: number
  minY: number
} & React.HTMLAttributes<HTMLDivElement>


const LineChartAlt: React.FC<LineChartProps> = ({
  data,
  color = 'rgba(166, 153, 251)',
  value,
  label,
  setValue,
  setLabel,
  defaultValue,
  isTvlTab = false,
  topLeft,
  topRight,
  bottomLeft,
  bottomRight,
  minHeight = 307,
  maxY,
  minY,
  ...rest
}) => {
  const [activeTooltip, setActiveTooltip] = useState(false)
  const parsedValue = value

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      if (setValue && parsedValue !== payload[0].value) {
        setValue(payload[0].value)
      }

      const formattedTime = dayjs(payload[0].payload.time).format('MMM D, h:mm A')
      return (
        <Box sx={{ fontSize: '12px', color: '#8988a3' }}>
          <p>{`${formattedTime}`}</p>
        </Box>
      );
    }

    return null;
  };

  return (
    <Wrapper>
      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
        {topLeft ?? null}
        {(topRight && !isTvlTab) ?? null}
      </Box>
      {!isTvlTab ?
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            width={500}
            height={268}
            data={data}
            margin={{
              top: 5,
              right: 20,
              left: 20,
              bottom: 5,
            }}
            onMouseLeave={() => {
              setLabel && setLabel(undefined)
              setValue && setValue(undefined)
            }}
          >
            <defs>
              <linearGradient id="gradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="15%" stopColor={color} stopOpacity={0.29} />
                <stop offset="100%" stopColor={darken(0.29, color)} stopOpacity={0.5} />
              </linearGradient>
            </defs>
            <YAxis
              type="number"
              fontSize="10px"
              color="#9e9e9e"
              axisLine={false}
              domain={[minY, maxY]}
              hide
            />
            <Tooltip
              cursor={{ stroke: '#8988a3', strokeDasharray: '4 4' }}
              content={CustomTooltip}
              isAnimationActive={false}
              wrapperStyle={{ outline: "none" }}
              contentStyle={{ display: 'block', background: 'transparent' }}
            />
            <Area dataKey="value" type="monotone" stroke="#c4b5fd" fill="url(#gradient)"
              activeDot={activeTooltip}
              animationBegin={100} animationDuration={1200} strokeWidth={1}
              onAnimationStart={() => setActiveTooltip(false)}
              onAnimationEnd={() => setActiveTooltip(true)}
            />
          </AreaChart>
        </ResponsiveContainer>
        :
        <Box width='100%' height='100%' display='flex' justifyContent='center' alignItems='center'><Typography variant='p_lg' color='#8988a3'>Chart unavailable</Typography></Box>}
    </Wrapper>
  )
}

const Wrapper = styled(Card)`
  width: 100%;
  margin: 0 auto;
  height: 268px;
  padding: 1rem;
  display: flex;
  background-color: ${(props) => props.theme.basis.cinder};
  flex-direction: column;
  > * {
    font-size: 1rem;
  }
`

export default withCsrOnly(LineChartAlt)
