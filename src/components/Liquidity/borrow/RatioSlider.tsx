import { Box, Slider, styled, Typography } from '@mui/material'
import { formatLocaleAmount } from '~/utils/numbers'

interface Props {
	min?: number
	value: number
	hideValueBox?: boolean
	showChangeRatio?: boolean
	hasRiskRatio?: boolean
	hasLowerMin?: boolean
	onChange?: (event: React.ChangeEvent<HTMLInputElement>, newValue: number | number[]) => void
}

const StyledSlider = styled(Slider)(({ theme }) => ({
	color: '#FFF',
	height: 5,
	padding: '13px 0',
	marginTop: '13px',
	'& .MuiSlider-thumb': {
		zIndex: 30,
		height: 16,
		width: 16,
		backgroundColor: '#fff',
		'&:hover': {
			boxShadow: '0 0 0 8px rgba(58, 133, 137, 0.16)',
		},
	},
	'& .MuiSlider-track': {
		zIndex: 10,
		height: 5,
		border: 'none',
	},
	'& .MuiSlider-valueLabel': {
		width: '56px',
		height: '26px',
		fontSize: '14px',
		fontWeight: '500',
		border: '1px solid #fff',
		borderRadius: '4px',
		padding: '6px 8px',
		backgroundColor: 'transparent',
		'&:before': { display: 'none' },
	},
	'& .MuiSlider-rail': {
		zIndex: 10,
		color: '#414e66',
		height: 5,
	},
}))

const RatioSlider: React.FC<Props> = ({ min = 0, value, hideValueBox = false, showChangeRatio = false, hasRiskRatio, hasLowerMin, onChange }) => {
	const max = min + 250

	const valueLabelFormat = (val: number) => {
		if (value >= 10000) {
			return `SAFE`
		} else if (value >= max) {
			return `${val.toFixed(0)}%+`
		} else if (value < min) {
			return `<${val.toFixed(0)}%`
		} else {
			return `${val.toFixed(0)}%`
		}
	}

	return (
		<Box>
			<Box display='flex' mb='25px'>
				{!hideValueBox ? <ValueBox><Typography variant='p_xlg'>{valueLabelFormat(value)}</Typography></ValueBox> : <></>}
				{showChangeRatio &&
					<Box display='flex'>
						<InputAmount id="ip-amount" type="number" min={0} style={hasLowerMin ? { border: '1px solid #ff0084' } : {}} placeholder="0.00" value={value >= 1000 ? Number(value).toFixed(0) : formatLocaleAmount(Number(value), 1)} onChange={(event) => onChange && onChange(event, parseFloat(event.currentTarget.value))} />
						<div style={{ marginLeft: '-23px', marginRight: '5px', marginTop: '10px' }}><Typography fontSize='26px' color={value > 0 ? '#fff' : '#66707e'}>%</Typography></div>
					</Box>
				}
				<Box width="100%">
					<StyledSlider
						sx={{
							'& .MuiSlider-track': {
								background: `linear-gradient(to right, #ff0084 20%, #fff 130px);`
							},
							'& .MuiSlider-valueLabel': {
								borderColor: hasLowerMin || hasRiskRatio ? '#ff0084' : '#fff'
							}
						}}
						value={value > min ? value : min}
						min={min - 25}
						step={1}
						max={max}
						valueLabelFormat={valueLabelFormat}
						onChange={onChange}
						valueLabelDisplay={'on'}
					/>
					<Box display='flex'>
						<Box marginLeft='20px'><Stick /><FlagBox sx={hasLowerMin ? { borderColor: '#ff0084' } : {}}><Typography variant='p'>min {min}%</Typography></FlagBox></Box>
						<Box marginLeft='38px'><Stick /><FlagBox><Typography variant='p'>safer {min + 50}%</Typography></FlagBox></Box>
					</Box>
				</Box>
			</Box>
		</Box >
	)
}

const ValueBox = styled(Box)`
	text-align: center;
	background-color: ${(props) => props.theme.boxes.black};
	width: 108px;
	height: 58px;
	line-height: 28px;
	color: #fff;
	padding: 12px 18px 12px 26px;
`
const InputAmount = styled(`input`)`
	text-align: center;
	background-color: rgba(255, 255, 255, 0.05);
	width: 108px;
	height: 58px;
	border: 0px;
	border-radius: 5px;
	line-height: 15px;
	color: #fff;
	font-size: 26px;
	font-weight: 500;
	padding: 12px 18px;
	cursor: pointer;
	&:hover {
    border: solid 1px ${(props) => props.theme.basis.shadowGloom};
  }
`
const FlagBox = styled(Box)`
  width: 42px;
  height: 37px;
  line-height: 1.13;
	border-radius: 4px;
	border: 1px solid ${(props) => props.theme.basis.shadowGloom};
	background: ${(props) => props.theme.basis.jurassicGrey};
	text-align: center;
`
const Stick = styled('div')`
  z-index: 20;
	border-radius: 0;
	background: #414e66;
	width: 2px;
	height: 13px;
	margin-top: -22px;
	margin-left: 20px;
`

export default RatioSlider
