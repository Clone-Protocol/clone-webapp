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
	maxDisabled?: boolean
	onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void
	onMax?: (balance: number) => void
}

const PairInput: React.FC<Props> = ({ title, tickerIcon, ticker, balance, balanceDisabled, value, valueDisabled = false, onChange, onMax, max, maxDisabled = false }) => {
	return (
		<FormControl variant="standard" sx={{ width: '100%' }}>
			<Stack direction="row" justifyContent="space-between" alignItems='center'>
				<Box><Typography variant='p_lg' color='#8988a3'>{title}</Typography></Box>
				{!balanceDisabled ? <Box display='flex' alignItems='center'>
					<Typography variant='p' color='#8988a3'>Balance: </Typography> <Typography variant='p' color='#c5c7d9' ml='5px'>{formatLocaleAmount(balance, 4)}</Typography>
					{!maxDisabled && <MaxButton onClick={() => onMax && onMax(balance!)}>MAX</MaxButton>}
				</Box> : <></>}
			</Stack>
			<FormStack direction="row" justifyContent="space-between" alignItems="center">
				<Box display='flex' flexDirection='column' alignItems='flex-start' pl='5px' sx={valueDisabled ? { cursor: 'not-allowed' } : { cursor: 'default' }}>
					<InputAmount id="ip-amount" type="number" sx={value && value > 0 ? { color: '#fff' } : { color: '#8988a3' }} placeholder="0.00" min={0} max={max} value={value} disabled={valueDisabled} onChange={onChange} />
				</Box>
				<TickerBox>
					{tickerIcon && <Image src={tickerIcon} width={22} height={22} alt={''} />}
					<Box display='flex' alignItems='center' ml='4px'>
						<Typography variant='h4' color='#fff'>{ticker}</Typography>
					</Box>
				</TickerBox>
			</FormStack>
		</FormControl>
	)
}

const FormStack = styled(Stack)`
	display: flex;
	width: 100%;
	height: 84px;
	margin-top: 9px;
	padding: 12px;
	border-radius: 10px;
	color: ${(props) => props.theme.basis.textRaven};
	background-color: ${(props) => props.theme.basis.cinder};
	&:hover {
		box-shadow: 0 0 0 1px ${(props) => props.theme.basis.plumFuzz} inset;
	}
`
const TickerBox = styled(Box)`
	display: flex;
	align-items: center;
	padding: 3px 10px 3px 5px;
	color: #fff;
`
const InputAmount = styled(`input`)`
	width: 120px;
	border: 0px;
	background-color: transparent;
	font-size: 26px;
	font-weight: 500;
	color: #757a7f;
	padding: 0;
	&::placeholder {
		color: #8988a3;
	}
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
	&:hover {
		background-color: rgba(155, 121, 252, 0.3);
		border: solid 1px ${(props) => props.theme.basis.melrose};
  }
`

export default PairInput
