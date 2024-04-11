import React from 'react';
import { styled } from '@mui/system'
import { Card } from '@mui/material'
import { ResponsiveContainer, LineChart as ReLineChart, Line, YAxis } from 'recharts'
import { withCsrOnly } from '~/hocs/CsrOnly'
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import { ChartElem } from '~/features/Chart/Liquidity.query';
dayjs.extend(utc)

export type LineChartProps = {
  data: ChartElem[]
  color?: string | undefined
  maxY: number
  minY: number
} & React.HTMLAttributes<HTMLDivElement>


const LineChart: React.FC<LineChartProps> = ({
  data,
  color = '#4fe5ff',
  maxY,
  minY,
}) => {
  return data ? (
    <Wrapper>
      <ResponsiveContainer width="100%" height="100%">
        <ReLineChart
          width={462}
          height={288}
          data={data}
          margin={{
            top: 5,
            right: 5,
            left: 5,
            bottom: 5,
          }}
        >
          <YAxis
            type="number"
            fontSize="10px"
            color="#9e9e9e"
            axisLine={false}
            domain={[minY, maxY]}
            hide
          />
          <Line dataKey="value" type="monotone" dot={false} stroke={color} strokeWidth={1} />
        </ReLineChart>
      </ResponsiveContainer>
    </Wrapper>
  ) : <></>
}

const Wrapper = styled(Card)`
  background: #000;
  width: 100%;
  max-width: 472px;
  margin: 30px 0px;
  height: 171px;
  display: flex;
  flex-direction: column;
  > * {
    font-size: 1rem;
  }
`

export default withCsrOnly(LineChart)
