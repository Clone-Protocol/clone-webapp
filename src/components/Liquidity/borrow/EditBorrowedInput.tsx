import { FormControl, Stack, Box, Typography } from "@mui/material"
import { styled } from '@mui/material/styles'
import { StyledTabs, StyledTab } from "~/components/Common/StyledTab"
import PairInput from '~/components/Liquidity/comet/PairInput'
import { formatLocaleAmount } from "~/utils/numbers"

interface Props {
  editType: number
  tickerIcon: string
  tickerName?: string | null
  tickerSymbol: string | null
  maxCollVal: number
  collAmount: number
  collAmountDollarPrice: number
  currentCollAmount: number
  dollarPrice: number
  onChangeType: (event: React.SyntheticEvent, newValue: number) => void
  onChangeAmount?: (e: React.FormEvent<HTMLInputElement>) => void
  onMax: (value: number) => void
}

const EditBorrowedInput: React.FC<Props> = ({
  editType,
  tickerIcon,
  tickerSymbol,
  maxCollVal,
  collAmount,
  collAmountDollarPrice,
  currentCollAmount,
  dollarPrice,
  onChangeType,
  onChangeAmount,
  onMax,
}) => {
  const afterBorrowedAmount = isNaN(collAmount) ? Number(currentCollAmount) : editType === 0 ? Number(currentCollAmount) + Number(collAmount) : Number(currentCollAmount) - Number(collAmount)
  const afterBorrowedDollarPrice = isNaN(collAmountDollarPrice) ? Number(dollarPrice) : editType === 0 ? Number(dollarPrice) + Number(collAmountDollarPrice) : Number(dollarPrice) - Number(collAmountDollarPrice)
  const isAfterNoBorrowedRemaining = afterBorrowedAmount <= 0

  return (
    <FormControl variant="standard" sx={{ width: "100%" }}>
      <Box sx={{ backgroundColor: '#201c27', borderRadius: '10px' }} mb='30px'>
        <StyledTabs value={editType} onChange={onChangeType}>
          <StyledTab value={0} label="Borrow More" width='142px' allBorderRadius={true}></StyledTab>
          <StyledTab value={1} label="Repay" allBorderRadius={true}></StyledTab>
        </StyledTabs>
      </Box>

      <StackWithBorder direction='row' justifyContent="space-between" alignItems='center'>
        <Typography variant="p">Current borrowed amount</Typography>
        <Stack direction='row' gap={1}>
          <Typography variant="p_lg">{formatLocaleAmount(currentCollAmount, 5)} {tickerSymbol}</Typography>
          <Typography variant="p_lg" color='#8988a3'>(${formatLocaleAmount(dollarPrice, 5)} USD)</Typography>
        </Stack>
      </StackWithBorder>

      <CenterBox mt='15px'>
        <PairInput
          tickerIcon={tickerIcon}
          tickerSymbol={tickerSymbol}
          rightHeaderTitle={editType === 0 ? 'Max Borrowable' : 'Wallet Balance'}
          inputTitle={editType === 0 ? 'Borrow More' : 'Repay'}
          inputTitleColor="#fff"
          value={collAmount}
          valueDollarPrice={collAmountDollarPrice}
          balance={maxCollVal}
          hideMaxButton={editType === 0}
          onChange={onChangeAmount}
          onMax={onMax}
        />

        <StackWithBorder direction='row' justifyContent="space-between" alignItems='center' sx={{ background: 'transparent' }}>
          <Typography variant="p">Borrow amount after {editType === 0 ? "borrowing" : "repaying"}</Typography>
          <Stack direction='row' gap={1}>
            <Typography variant="p_lg">{`${isAfterNoBorrowedRemaining ? '0' : formatLocaleAmount(afterBorrowedAmount, 5) + " " + tickerSymbol}`}</Typography>
            <Typography variant="p_lg" color='#8988a3'>{`${isAfterNoBorrowedRemaining ? '(Paid in Full)' : '$' + formatLocaleAmount(afterBorrowedDollarPrice, 5)}`}</Typography>
          </Stack>
        </StackWithBorder>
      </CenterBox>
    </FormControl>
  )
}

const StackWithBorder = styled(Stack)`
  background: ${(props) => props.theme.basis.nobleBlack};
  border: solid 1px ${(props) => props.theme.basis.plumFuzz};
  border-radius: 10px;
  padding: 15px 18px;
  margin-top: 10px;
`
const CenterBox = styled(Box)`
  padding: 20px 17px;
  border-radius: 10px;
  border: solid 1px ${(props) => props.theme.basis.plumFuzz};
`

export default EditBorrowedInput
