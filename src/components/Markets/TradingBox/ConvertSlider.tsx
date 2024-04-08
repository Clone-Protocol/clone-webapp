//@DEPRECATED
import { Box, Slider } from '@mui/material'
import { styled } from '@mui/material/styles'

interface Props {
	isBuy: boolean
	value: number
	onChange?: (event: Event, newValue: number | number[]) => void
}

const StyledSlider = styled(Slider)(({ theme }) => ({
	color: '#FFF',
	height: 4,
	padding: '13px 0',
	marginTop: '13px',
	'& .MuiSlider-thumb': {
		zIndex: 30,
		height: 20,
		width: 20,
		backgroundColor: '#fff',
		border: '3px solid #809cff',
		'&:hover': {
			boxShadow: '0 0 0 8px rgba(58, 133, 137, 0.16)',
		},
	},
	'& .MuiSlider-track': {
		zIndex: 10,
		height: 3,
		border: 'none',
		background: 'linear-gradient(to left, #f00 -12%, #809cff 66%)'
	},
	'& .MuiSlider-valueLabel': {
		fontSize: '11px',
		fontWeight: '600',
		width: '51px',
		padding: '4px 8px 4px 8px',
		borderRadius: '10px',
		border: 'solid 1px #00ff66',
		backgroundColor: '#000',
		'&:before': { display: 'none' },
	},
	'& .MuiSlider-rail': {
		zIndex: 10,
		color: '#444444',
		height: 3,
	},
}))

const ConvertSlider: React.FC<Props> = ({ isBuy, value, onChange }) => {
	const valueLabelFormat = (value: number) => {
		return `${value.toFixed(0)}%`
	}

	return (
		<Box
			sx={{
				display: 'flex',
			}}>
			<ValueBox>{value <= 100 ? valueLabelFormat(value) : '100%+'}</ValueBox>
			<Box width="252px" sx={value === 0 ? { marginLeft: '12px' } : {}}>
				<StyledSlider
					sx={
						value <= 100 ?
							isBuy ? {
								'& .MuiSlider-thumb': {
									border: `2px solid #00ff66`,
								},
								'& .MuiSlider-track': {
									background: `#00ff66`
								}
							} : {
								'& .MuiSlider-thumb': {
									border: `2px solid #fb782e`,
								},
								'& .MuiSlider-track': {
									background: `#fb782e`
								}
							}
							:
							{
								'& .MuiSlider-thumb': {
									border: `1px solid #282828`,
								},
								'& .MuiSlider-track': {
									background: `#282828`
								}
							}
					}
					value={value}
					min={0}
					step={5}
					max={100}
					valueLabelFormat={valueLabelFormat}
					onChange={onChange}
					valueLabelDisplay="off"
				/>
			</Box>
		</Box>
	)
}

const ValueBox = styled(Box)`
	background: #282828;
	width: 55px;
	height: 30px;
  border-radius: 10px;
	line-height: 29px;
	font-size: 12px;
	font-weight: 500;
  color: #fff;
  margin-top: 12px;
`

export default ConvertSlider
