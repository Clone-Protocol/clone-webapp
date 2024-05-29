import { FormControl, Stack, Box, Typography } from "@mui/material"
import { styled } from '@mui/material/styles'
import Image from "next/image"
import { useRef } from "react"
import { formatLocaleAmount } from "~/utils/numbers"

interface Props {
  tickerIcon: string
  tickerSymbol: string | null
  value?: number
  valueDollarPrice?: number
  rightHeaderTitle: string
  balance?: number
  inputTitle?: string
  inputTitleColor?: string
  balanceDisabled?: boolean
  hideMaxButton?: boolean
  onChange?: (e: React.FormEvent<HTMLInputElement>) => void
  onMax?: (value: number) => void
}

const PairInput: React.FC<Props> = ({
  tickerIcon,
  tickerSymbol,
  value,
  valueDollarPrice,
  rightHeaderTitle,
  balance,
  inputTitle,
  inputTitleColor = '#8988a3',
  balanceDisabled = false,
  hideMaxButton = false,
  onChange,
  onMax,
}) => {
  const ipAmount = useRef(null)

  return (
    <FormControl variant="standard" sx={{ width: "100%" }}>
      <Stack direction="row" justifyContent="space-between">
        <Box>
          <Typography variant="p" color={inputTitleColor}>{inputTitle}</Typography>
        </Box>
        {!balanceDisabled ? (
          <Box display='flex' alignItems='center'>
            <Typography variant="p" color="#8988a3">
              {rightHeaderTitle}:{" "}
            </Typography>
            <MaxPointerValue>
              <Typography variant="p">
                {formatLocaleAmount(balance, 6)}
              </Typography>
              {!hideMaxButton && <MaxButton onClick={() => onMax && onMax(balance!)}>MAX</MaxButton>}
            </MaxPointerValue>
          </Box>
        ) : (
          <></>
        )}
      </Stack>
      <CenterBox>
        <FormStack direction="row" justifyContent="space-between" alignItems="center" onClick={() => ipAmount.current?.focus()} >
          <Box>
            <InputAmount
              id="ip-amount"
              ref={ipAmount}
              type="number"
              placeholder="0.00"
              value={value}
              onChange={onChange}
              min={0}
              max={!balanceDisabled ? balance : 1000}
              sx={{ width: { xs: '150px', sm: '230px' } }}
            />
            <DollarAmount>
              {valueDollarPrice && valueDollarPrice > 0
                ? "$" + formatLocaleAmount(valueDollarPrice)
                : ""}
            </DollarAmount>
          </Box>
          <TickerBox display="flex" alignItems='center'>
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
  background-color: ${(props) => props.theme.basis.cinder};
  margin-top: 5px;
  border-radius: 10px;
`
const FormStack = styled(Stack)`
  width: 100%;
  height: 84px;
  padding: 18px 12px;
  border-radius: 10px;
  &:hover {
    box-shadow: 0 0 0 1px ${(props) => props.theme.basis.shadowGloom} inset;
  }
`
const MaxPointerValue = styled(Box)`
  display: flex;
  align-items: center;
  color: ${(props) => props.theme.basis.melrose};
  margin-left: 4px;
`
const MaxButton = styled(Box)`
  border-radius: 4px;
  background-color: ${(props) => props.theme.basis.jurassicGrey};
  margin-left: 6px;
  font-size: 10px;
  font-weight: 600;
  padding: 2px 7px;
  color: #fff;
  cursor: pointer;
  &:hover {
		background-color: rgba(155, 121, 252, 0.3);
		box-shadow: 0 0 0 1px ${(props) => props.theme.basis.melrose} inset;
  }
`
const InputAmount = styled(`input`)`
  border: 0px;
  background-color: transparent;
  font-size: 26px;
  color: #fff;
  &::placeholder {
    color: ${(props) => props.theme.basis.slug};
  }
`
const DollarAmount = styled("div")`
  font-size: 12px;
  font-weight: 500;
  color: ${(props) => props.theme.basis.slug};
  margin-left: 2px;
`
const TickerBox = styled(Box)`
  border-radius: 10px;
  padding: 3px 10px 3px 5px;
`

export default PairInput
