import React from 'react';
import { Box, Paper, Typography, Stack } from '@mui/material'
import { styled } from '@mui/material/styles'
import PieChartAlt from '../Charts/PieChartAlt'
import { useAtom } from 'jotai'
import { DEFAULT_ALL_INDEX, STABLE_COIN_INDEX, filterState } from '~/features/Portfolio/filterAtom'
import { useEffect, useState } from 'react'
import { FilterTypeColorMap, FilterTypeMap, PieItem } from '~/data/filter'
import { ASSETS } from '~/data/assets';
import { formatLocaleAmount } from '~/utils/numbers';

interface Props {
	data: PieItem[]
}

const BalanceView: React.FC<Props> = ({ data }) => {
	const [selectedFilter, setSelectedFilter] = useAtom(filterState)
	const [selectedTitle, setSelectedTitle] = useState('Portfolio')
	// const [selectedIdx, setSelectedIdx] = useState(DEFAULT_ALL_INDEX)
	const [selectedonusdAmount, setSelectedonusdAmount] = useState(0)

	const newData = data.filter((item) => item !== undefined)

	useEffect(() => {
		if (selectedFilter === DEFAULT_ALL_INDEX) {
			setSelectedTitle('Portfolio')
			// setSelectedIdx(DEFAULT_ALL_INDEX)
			const totaliAsset = newData.reduce((acc, item) => acc + item.onusdAmount, 0)
			setSelectedonusdAmount(totaliAsset);
		} else {
			newData.forEach((item, index) => {
				if (item.key === selectedFilter) {
					setSelectedTitle(item.name)
					// setSelectedIdx(item.key)
					setSelectedonusdAmount(item.onusdAmount)
					return;
				}
			})
		}
	}, [newData, selectedFilter])

	return (
		<StyledPaper sx={{ flexDirection: { xs: 'column', md: 'row' }, justifyContent: { xs: 'center', md: 'space-around' }, marginTop: { xs: '40px', md: '0' } }}>
			<Box width='200px' mb='40px'>
				<Box><Typography variant='p_lg' color='#c4b5fd'>{selectedTitle}</Typography></Box>
				<Box>
					<Typography variant='h1' fontWeight={500}>${formatLocaleAmount(selectedonusdAmount)}</Typography>
				</Box>
			</Box>
			<Box mb='-30px'>
				<PieChartAlt data={newData} selectedOnusdAmount={selectedonusdAmount} selectedIdx={selectedFilter} onSelect={(index: number) => setSelectedFilter(newData[index].key)} />
			</Box>
			<Box width='200px'>
				{newData.length > 0 &&
					<>
						<Stack direction='row' gap={6} mb='5px'>
							<Box ml='15px'><Typography variant='p_lg' color='#d5c7ff'>Category</Typography></Box>
							<Box><Typography variant='p_lg' color='#d5c7ff'>Percentage</Typography></Box>
						</Stack>
						{newData.map(item => {
							const color = item.key === STABLE_COIN_INDEX ? '#fff' : ASSETS[item.key].mainColor
							return (
								<Stack key={item.key} direction='row' gap={1} height='26px' style={selectedFilter === item.key ? { boxShadow: `0 0 0 1px ${color} inset`, borderRadius: '15px' } : {}}>
									<Box display="flex" alignItems='center' gap={2} width='130px' pl='5px'>
										<ColorIndicator sx={{ backgroundColor: color }} />
										<Typography variant='p_lg' mt='2px'>{item.name}</Typography>
									</Box>
									<Box><Typography variant='p_lg' fontWeight={600}>{item.value.toFixed(0)}%</Typography></Box>
								</Stack>
							)
						})}
					</>
				}
				{/* <Box sx={{ opacity: '0.5', lineHeight: '1.2', }}>
					{Object.keys(FilterTypeMap).filter((v, index) => index !== 0).map((key: string) => (
							<Stack direction='row' gap={3} key={key}>
								<Box display="flex" alignItems='center' gap={2} width='120px'>
									<ColorIndicator sx={{ backgroundColor: FilterTypeColorMap[key] }} />
									<Typography variant='p_lg' mt='4px'>{FilterTypeMap[key]}</Typography>
								</Box>
								<Box mt='4px'><Typography variant='p_lg'>0%</Typography></Box>
							</Stack>
						))}
				</Box> */}
			</Box>
		</StyledPaper>
	)
}

export default BalanceView

const StyledPaper = styled(Paper)`
  display: flex;
	width: 100%;
  justify-content: space-around;
  align-items: center;
  background: transparent;
`
const ColorIndicator = styled(Box)`
	width: 10px;
	height: 10px;
	margin-top: 2px;
	border-radius: 120px;
`