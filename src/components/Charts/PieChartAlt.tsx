import React, { useState } from 'react';
import { PieChart, Pie, Sector, Cell } from 'recharts';
import { withCsrOnly } from '~/hocs/CsrOnly'
import { Box } from '@mui/material'
import { styled } from '@mui/material/styles'
import { PieItem } from '~/data/filter'
import { DEFAULT_ALL_INDEX, STABLE_COIN_INDEX, filterState } from '~/features/Portfolio/filterAtom'
import CloseIcon from '@mui/icons-material/Close';
import { useSetAtom } from 'jotai'
import { ASSETS } from '~/data/assets';

export type ChartProps = {
  data: PieItem[]
  selectedIdx: number
  onSelect: (index: number) => void
}

const PieChartAlt: React.FC<ChartProps> = ({
  data,
  selectedIdx,
  onSelect
}) => {
  const setSelectedFilter = useSetAtom(filterState)
  const [activeIndex, setActiveIndex] = useState(DEFAULT_ALL_INDEX)
  const [isClicked, setIsClicked] = useState(false)

  const onPieEnter = (_, index: number) => {
    setActiveIndex(index)
  }
  const onPieLeave = (_, index: number) => {
    if (!isClicked) {
      setActiveIndex(-1)
    }
  }
  const onPieClick = (_, index: number) => {
    setIsClicked(true)
    onSelect(index)
  }

  const renderHoverShape = (props) => {
    const { cx, cy, innerRadius, outerRadius, startAngle, endAngle, fill } = props;

    return (
      <g>
        <Sector
          cx={cx}
          cy={cy}
          innerRadius={innerRadius - 8}
          outerRadius={outerRadius}
          startAngle={startAngle}
          endAngle={endAngle}
          fill={fill}
          strokeWidth={0}
          style={{ cursor: 'pointer' }}
        />
      </g>
    );
  };

  const renderActiveShape = (props) => {
    const { cx, cy, innerRadius, outerRadius, startAngle, endAngle, fill } = props;

    return (
      <g>
        <Sector
          cx={cx}
          cy={cy}
          innerRadius={innerRadius - 8}
          outerRadius={outerRadius}
          startAngle={startAngle}
          endAngle={endAngle}
          fill={fill}
          strokeWidth={0}
          style={{ filter: `drop-shadow(0px 0px 5px ${fill})` }}
        />
      </g>
    );
  };

  const renderInactiveShape = (props) => {
    const { cx, cy, innerRadius, outerRadius, startAngle, endAngle, fill } = props;

    return (
      <g>
        <Sector
          cx={cx}
          cy={cy}
          innerRadius={innerRadius}
          outerRadius={outerRadius}
          startAngle={startAngle}
          endAngle={endAngle}
          fill={fill}
          strokeWidth={0}
          opacity={0.3}
        />
      </g>
    );
  }

  const clearPie = () => {
    setIsClicked(false);
    setActiveIndex(-1);
    setSelectedFilter(DEFAULT_ALL_INDEX);
  }

  return (
    <Wrapper>
      <Box width='100%' maxWidth='229px'>
        <PieChart width={278} height={278}>
          {data.length > 0 ? (
            <Pie
              data={data}
              cx={110}
              cy={110}
              innerRadius={80}
              outerRadius={100}
              fill="#8884d8"
              paddingAngle={0}
              dataKey="value"
              activeIndex={activeIndex}
              cursor="pointer"
              activeShape={isClicked ? renderActiveShape : renderHoverShape}
              inactiveShape={isClicked ? renderInactiveShape : null}
              onMouseDown={!isClicked ? onPieClick : () => { }}
              onMouseEnter={!isClicked ? onPieEnter : () => { }}
              onMouseLeave={onPieLeave}
            >
              {data.map((entry, index) => {
                const color = entry.key === STABLE_COIN_INDEX ? '#fff' : ASSETS[entry.key].mainColor
                return (
                  <Cell key={`cell-${index}`} fill={color} strokeWidth={0} />
                )
              })}
            </Pie>
          ) : (
            <Pie
              data={[{ key: 'all', name: 'all', value: 100 }]}
              cx={110}
              cy={110}
              innerRadius={80}
              outerRadius={100}
              cursor="pointer"
              fill="rgba(255, 255, 255, 0.09)"
              paddingAngle={0}
              dataKey="value"
            >
              <Cell fill="#363636" strokeWidth={0} />
            </Pie>
          )}
        </PieChart>
      </Box>
      {selectedIdx >= 0 &&
        <CloseWrapper onClick={() => clearPie()}>
          <CloseIcon fontSize='large' sx={{ color: selectedIdx === STABLE_COIN_INDEX ? '#fff' : `${ASSETS[selectedIdx].mainColor}` }} />
        </CloseWrapper>
      }
    </Wrapper>
  );
}

const Wrapper = styled(Box)`
  position: relative;
`
const CloseWrapper = styled(Box)`
  position: absolute;
  width: 80px;
  height: 80px;
  display: flex;
  justify-content: center;
  align-items: center;
  top: 76px;
  left: calc(50% - 38px);
  border-radius: 50%;
  cursor: pointer;
  background: rgba(196, 181, 253, 0.07);
  &:hover {
    background: rgba(196, 181, 253, 0.05);
  }
`


export default withCsrOnly(PieChartAlt)
