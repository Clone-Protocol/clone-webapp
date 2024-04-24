import React from 'react';
import { FormControl, Stack, Box, Button, Typography } from '@mui/material'
import { styled } from '@mui/material/styles'
import Image from 'next/image'
import ExpandMoreOutlinedIcon from '@mui/icons-material/ExpandMoreOutlined';
import { formatLocaleAmount } from '~/utils/numbers';

interface Props {
	title: string | null
	tickerIcon: string
	ticker: string | null
	balance?: number
	balanceDisabled?: boolean
	value?: number
	valueDisabled?: boolean
	max?: number
	tickerClickable?: boolean
	onTickerClick?: () => void
	onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void
	onMax?: (balance: number) => void
}

const PairInput: React.FC<Props> = ({ title, tickerIcon, ticker, balance, balanceDisabled, value, valueDisabled = false, tickerClickable = false, onTickerClick, onChange, onMax, max }) => {
	return (
		<FormControl variant="standard" sx={{ width: '100%' }}>
			<Stack direction="row" justifyContent="space-between">
				<Box><Typography variant='p_lg' color='#66707e'>{title}</Typography></Box>
				{!balanceDisabled ? <Box display='flex' alignItems='center'>
					<Typography variant='p' color='#66707e'>Balance: </Typography> <Typography variant='p' color='#b5fdf9' ml='5px'>{formatLocaleAmount(balance, 4)}</Typography>
					<MaxButton onClick={() => onMax && onMax(balance!)}>MAX</MaxButton></Box> : <></>}
			</Stack>
			<FormStack direction="row" justifyContent="space-between" alignItems="center">
				<Box display='flex' flexDirection='column' alignItems='flex-start' pl='5px' sx={valueDisabled ? { cursor: 'not-allowed' } : { cursor: 'default' }}>
					<InputAmount id="ip-amount" type="number" sx={value && value > 0 ? { color: '#fff' } : { color: '#8988a3' }} placeholder="0.00" min={0} max={max} value={value} disabled={valueDisabled} onChange={onChange} />
				</Box>

				{!tickerClickable ?
					<TickerBox>
						{tickerIcon && <Image src={tickerIcon} width={22} height={22} alt={''} />}
						<Box mx='4px' display='flex' alignItems='center'>
							<Typography variant='h4' color='#fff'>{ticker}</Typography>
						</Box>
					</TickerBox>
					:
					<SelectTickerButton onClick={onTickerClick}>
						{tickerIcon && <Image src={tickerIcon} width={22} height={22} alt={''} />}
						<Box mx='4px' display='flex' alignItems='center'>
							<Typography variant='h4' color='#fff'>{ticker}</Typography>
							<ExpandMoreOutlinedIcon />
						</Box>
					</SelectTickerButton>
				}
			</FormStack>
		</FormControl>
	)
}

const FormStack = styled(Stack)`
	display: flex;
	width: 100%;
	height: 84px;
	padding: 12px;
	border-radius: 10px;
	color: #fff;
	background-color: rgba(255, 255, 255, 0.1);
	&:hover {
		box-shadow: 0 0 0 1px ${(props) => props.theme.basis.shadowGloom} inset;
	}
`

const TickerBox = styled(Box)`
	display: flex;
	align-items: center;
	padding: 3px 10px 3px 5px;
	color: #fff;
	border-radius: 100px;
	background-color: rgba(65, 65, 102, 0.5);
`

const SelectTickerButton = styled(Button)`
	display: flex;
	align-items: center;
	color: #fff;
	border-radius: 100px;
	background-color: rgba(65, 65, 102, 0.5);
	padding: 3px 0px 3px 5px;

	&:hover {
		background-color: rgba(65, 65, 102, 0.5);
		box-shadow: 0 0 0 1px ${(props) => props.theme.basis.shadowGloom} inset;
	}
`

const InputAmount = styled(`input`)`
	width: 150px;
	border: 0px;
	background-color: transparent;
	font-size: 26px;
	font-weight: 500;
	color: #fff;
	&::placeholder {
		color: ${(props) => props.theme.basis.slug};
	}
	padding: 0;
`

const MaxButton = styled(Box)`
	width: 38px;
	background-color: ${(props) => props.theme.basis.jurassicGrey};
	margin-left: 6px;
	font-size: 10px;
	font-weight: 600;
	padding: 2px 0px;
	border-radius: 5px;
	color: #fff;
	cursor: pointer;
	&:hover {
		background-color: ${(props) => props.theme.basis.jurassicGrey};
		box-shadow: 0 0 0 1px ${(props) => props.theme.basis.shadowGloom} inset;
	}
`

export default PairInput
