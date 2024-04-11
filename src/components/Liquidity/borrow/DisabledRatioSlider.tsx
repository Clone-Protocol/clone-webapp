import { Box, Slider, styled, Typography } from '@mui/material'


const StyledSlider = styled(Slider)(({ theme }) => ({
	color: '#FFF',
	height: 5,
	padding: '13px 0',
	marginTop: '13px',
	'& .MuiSlider-thumb': {
		display: 'none',
	},
	'& .MuiSlider-track': {
		zIndex: 10,
		height: 5,
		border: 'none',
	},
	'& .MuiSlider-rail': {
		zIndex: 10,
		color: '#414e66',
		height: 5,
	},
}))

const DisabledRatioSlider: React.FC = () => {

	return (
		<Box>
			<Box display='flex' mb='25px'>
				<Box display='flex'>
					<InputAmount id="ip-amount" type="number" min={0} placeholder="" disabled />
					<div style={{ marginLeft: '-26px', marginRight: '5px', marginTop: '10px' }}><Typography fontSize='26px' color='#66707e'>%</Typography></div>
				</Box>
				<Box width="100%">
					<StyledSlider
						sx={{
							'& .MuiSlider-track': {
								background: `linear-gradient(to right, #ff0084 20%, #fff 130px);`
							},
						}}
						value={0}
						step={1}
						valueLabelDisplay={'off'}
					/>
				</Box>
			</Box>
		</Box >
	)
}


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
`

export default DisabledRatioSlider
