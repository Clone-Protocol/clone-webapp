import { FormControl, styled, Stack, Box, Typography } from '@mui/material'
import Image from 'next/image'
import { useRef } from 'react'
import { formatLocaleAmount } from '~/utils/numbers'

interface Props {
	tickerIcon: string
	tickerSymbol: string
	value?: number | string
	dollarPrice?: number | undefined
	inputTitle?: string
	headerTitle?: string
	headerValue?: number
	disabledInput?: boolean
	onChange?: (evt: React.ChangeEvent<HTMLInputElement>) => void
	onMax?: (value: number) => void
	onTickerClicked?: () => void
}

const PairInput: React.FC<Props> = ({
	tickerIcon,
	tickerSymbol,
	value,
	dollarPrice,
	inputTitle,
	headerTitle,
	headerValue,
	disabledInput = false,
	onChange,
	onMax,
	onTickerClicked
}) => {
	const ipAmount = useRef(null)

	return (
		<FormControl variant="standard" sx={{ width: '100%' }}>
			<Stack direction="row" justifyContent="space-between">
				<Box>
					<Typography variant="p_lg" color='#66707e'>{inputTitle}</Typography>
				</Box>
				{headerTitle ? (
					<Stack direction="row" justifyContent="flex-end">
						<Typography variant='p' color='#66707e'>
							{headerTitle}: {headerValue || headerValue == 0 ? (<MaxValue onClick={() => onMax && onMax(headerValue)}>{formatLocaleAmount(headerValue, 5)}</MaxValue>) : '_'}
						</Typography>
						{(headerValue || headerValue == 0) && <MaxButton onClick={() => onMax && onMax(headerValue)}>MAX</MaxButton>}
					</Stack>
				) : (
					<></>
				)}
			</Stack>
			<CenterBox>
				<FormStack direction="row" justifyContent="space-between" alignItems="center" noHover={disabledInput} onClick={() => ipAmount.current?.focus()} sx={disabledInput ? { border: '1px solid #414166', background: 'transparent' } : {}}>
					<Box>
						<InputAmount
							ref={ipAmount}
							type="number"
							placeholder='0.00'
							step='any'
							min={0}
							max={headerValue}
							sx={value && value > 0 ? { color: '#fff' } : { color: '#adadad' }}
							value={value}
							disabled={disabledInput}
							onChange={onChange} />
						<DollarAmount>
							{dollarPrice ? "$" + formatLocaleAmount(dollarPrice) : ""}
						</DollarAmount>
					</Box>
					<TickerBox display="flex" alignItems='center' onClick={onTickerClicked} style={onTickerClicked ? { cursor: 'pointer' } : {}}>
						<Image src={tickerIcon} width={22} height={22} alt={tickerSymbol!} />
						<Box ml='4px'>
							<Typography variant="h4">{tickerSymbol}</Typography>
						</Box>
					</TickerBox>
				</FormStack>
			</CenterBox>
		</FormControl>
	)
}

const CenterBox = styled(Box)`
  width: 100%;
  background-color: rgba(255, 255, 255, 0.05);
`
const MaxValue = styled('span')`
	color: ${(props) => props.theme.basis.liquidityBlue};
	cursor: pointer;
`
const FormStack = styled(Stack) <{ noHover?: boolean }>`
	display: flex;
	width: 100%;
	height: 84px;
	border-radius: 5px;
	padding: 9px 21px 8px 24px;
  &:hover {
		${(props) => props.noHover ? 'box-shadow: 0px !important;' : `box-shadow: 0 0 0 1px #414e66 inset;`}
  }
`
const InputAmount = styled(`input`)`
	width: 200px;
	border: 0px;
	background-color: transparent;
	font-size: 26px;
	color: #fff;
	&::placeholder {
		color: ${(props) => props.theme.basis.slug};
	}
`
const MaxButton = styled(Box)`
  border-radius: 4px;
  background-color: ${(props) => props.theme.basis.jurassicGrey};
  margin-left: 6px;
	margin-bottom: 5px;
  font-size: 10px;
  font-weight: 600;
  padding: 2px 7px;
	border-radius: 5px;
  color: #fff;
  cursor: pointer;
	&:hover {
		box-shadow: 0 0 0 1px ${(props) => props.theme.basis.liquidityBlue};
	}
`
const DollarAmount = styled("div")`
  font-size: 12px;
  font-weight: 500;
  color: ${(props) => props.theme.basis.slug};
  margin-left: 2px;
`
const TickerBox = styled(Box)`
  background-color: ${(props) => props.theme.basis.darkNavy};
  border-radius: 10px;
  padding: 3px 10px 3px 5px;
`

export default PairInput
