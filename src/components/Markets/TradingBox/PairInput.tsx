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
	dollarValue?: number
	valueDisabled?: boolean
	max?: number
	tickerClickable?: boolean
	onTickerClick?: () => void
	onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void
	onMax?: (balance: number) => void
}

const PairInput: React.FC<Props> = ({ title, tickerIcon, ticker, balance, balanceDisabled, value, dollarValue, valueDisabled = false, tickerClickable = false, onTickerClick, onChange, onMax, max }) => {
	return (
		<FormControl variant="standard" sx={{ width: '100%' }}>
			<Stack direction="row" justifyContent="space-between">
				<Box><Typography variant='p_lg' color='#8988a3'>{title}</Typography></Box>
				{!balanceDisabled ? <Box display='flex' alignItems='center'>
					<Typography variant='p' color='#8988a3'>Balance: </Typography> <Typography variant='p' color='#c4b5fd' ml='5px'>{formatLocaleAmount(balance, 4)}</Typography>
					<MaxButton onClick={() => onMax && onMax(balance!)}>Max</MaxButton></Box> : <></>}
			</Stack>
			<FormStack direction="row" justifyContent="space-between" alignItems="center">
				<Box display='flex' flexDirection='column' alignItems='flex-start' pl='5px' sx={valueDisabled ? { cursor: 'not-allowed' } : { cursor: 'default' }}>
					<InputAmount id="ip-amount" type="number" sx={value && value > 0 ? { color: '#fff' } : { color: '#8988a3' }} placeholder="0.00" min={0} max={max} value={value} disabled={valueDisabled} onChange={onChange} />
					<Box><Typography variant='p' color='#8988a3'>${!dollarValue || isNaN(dollarValue) ? 0 : formatLocaleAmount(dollarValue)}</Typography></Box>
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
	color: ${(props) => props.theme.basis.textRaven};
	background-color: rgba(255, 255, 255, 0.1);
	&:hover {
		box-shadow: 0 3px 20px 0 rgba(67, 48, 119, 0.52), 0 0 0 1px ${(props) => props.theme.basis.portGore} inset;
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
		box-shadow: 0 0 0 1px ${(props) => props.theme.basis.melrose} inset;
	}
`

const InputAmount = styled(`input`)`
	width: 150px;
	border: 0px;
	background-color: transparent;
	font-size: 26px;
	font-weight: 500;
	color: #757a7f;
	padding: 0;
`

const MaxButton = styled(Button)`
	font-size: 10px;
	font-weight: 600;
	width: 38px;
	min-width: 20px;
	height: 16px;
	color: ${(props) => props.theme.basis.melrose};
	padding: 2px 7px;
	border-radius: 100px;
	background-color: rgba(155, 121, 252, 0.3);
	margin-left: 6px;
	margin-bottom: 3px;
	&:hover {
		background-color: rgba(155, 121, 252, 0.3);
		border: solid 1px ${(props) => props.theme.basis.melrose};
  }
`

export default PairInput
