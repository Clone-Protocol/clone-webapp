import { Box, Slider, styled } from '@mui/material'
import { formatNumberToString } from '~/utils/numbers'

interface Props {
	min?: number
	max?: number
	value: number
	hideValueBox?: boolean
	onChange?: (event: Event, newValue: number | number[]) => void
}

const StyledSlider = styled(Slider)(({ theme }) => ({
	color: '#FFF',
	height: 4,
	padding: '13px 0',
	marginTop: '13px',
	'& .MuiSlider-thumb': {
		height: 20,
		width: 20,
		backgroundColor: '#fff',
		border: '3px solid #809cff',
		'&:hover': {
			boxShadow: '0 0 0 8px rgba(58, 133, 137, 0.16)',
		},
	},
	'& .MuiSlider-track': {
		height: 4,
		border: 'none',
		background: 'linear-gradient(to right, #fff 51%, #ff0084 550px)'
	},
	'& .MuiSlider-valueLabel': {
		fontSize: '12px',
		fontWeight: '500',
		marginTop: '5px',
		padding: '4px 8px',
		border: 'solid 1px #fff',
		background: 'unset',
		'&:before': { display: 'none' },
	},
	'& .MuiSlider-rail': {
		color: '#414e66',
		height: 4,
	},
}))

const RatioSlider: React.FC<Props> = ({ min = 0, max = 200, value, hideValueBox = false, onChange }) => {
	const valueLabelFormat = (value: number) => {
		if (value >= 100) {
			return `100%+`
		} else {
			return `${value.toFixed(0)}%`
		}
	}

	return (
		<Box
			sx={{
				display: 'flex',
			}}>
			{!hideValueBox ? <ValueBox>{valueLabelFormat(value)}</ValueBox> : <></>}
			<Box width="100%">
				<StyledSlider
					sx={{
						'& .MuiSlider-valueLabel': {
							border: `solid 1px #fff`,
							borderRadius: '4px',
							color: value >= 100 ? '#ed2525' : ''
						},
						'& .MuiSlider-thumb': {
							border: `0px`,
						}
					}}
					value={parseFloat(formatNumberToString(value, 2))}
					min={min}
					step={1}
					max={max}
					valueLabelFormat={valueLabelFormat}
					onChange={onChange}
					valueLabelDisplay="on"
				/>
			</Box>
		</Box>
	)
}

const ValueBox = styled(Box)`
	text-align: center;
	background-color: #333;
  border: solid 1px #444;
	border-radius: 10px;
	width: 102px;
	height: 54px;
	line-height: 28px;
	font-size: 16px;
	font-weight: 500;
	color: #fff;
	padding: 12px 18px 12px 26px;
`

export default RatioSlider
