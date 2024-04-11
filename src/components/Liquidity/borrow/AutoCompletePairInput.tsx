import { styled, Box, Autocomplete, TextField, Popper, PopperProps } from '@mui/material'
import Image from 'next/image'
import SearchIcon from 'public/images/search-icon.svg'
import 'animate.css'

export interface AssetType {
  tickerIcon: string
  tickerName: string
  tickerSymbol: string
}

interface Props {
  assets: AssetType[]
  selAssetId: number
  value?: number
  onChangeAsset?: (data: any) => void
}

const CustomPopper = function (props: PopperProps) {
  return <StyledPopper {...props} placement="bottom" />;
};

const SelectPairInput: React.FC<Props> = ({ assets, onChangeAsset }) => {
  return (
    <Box sx={{ display: 'flex' }}>
      <StyledAutocomplete
        selectOnFocus
        clearOnBlur
        onChange={(e, value) => onChangeAsset && onChangeAsset(value)}
        getOptionLabel={(option: any) => option.tickerName}
        options={assets}
        clearIcon={null}
        PopperComponent={(props) => CustomPopper(props)}
        renderInput={(params) => <StyledTextField {...params} placeholder="Search for an clAsset" />}
        renderOption={(props: any, option: any) => (
          <SelectBox key={option.tickerSymbol} {...props}>
            <Image src={option.tickerIcon} width={24} height={24} alt={option.tickerSymbol} />
            <TickerName>{option.tickerName} ({option.tickerSymbol})</TickerName>
          </SelectBox>
        )}
      />

      <SearchIconWrapper><Image src={SearchIcon} alt='search' /></SearchIconWrapper>
    </Box>
  )
}

const StyledAutocomplete = styled(Autocomplete)`
  width: 315px; 
  height: 36px;
  background-color: #151618;
  border: solid 1px #444;
  border-radius: 8px;
  & label {
    font-size: 11px;
    font-weight: 500;
    color: #989898;
    padding: 0;
    line-height: 5px;
    overflow: initial;
  }

  &:hover {
    border: solid 1px ${(props) => props.theme.palette.text.secondary};
  }

  & .MuiOutlinedInput-root {
    padding: 0;
    padding-left: 20px;
    padding-right: 20px;
  }

  & .MuiOutlinedInput-notchedOutline {
    border: none !important;
  }

  & .MuiTextField-root {
    margin-top: 0px;
    &:hover {
      border: none;
    }
  }

  & .MuiAutocomplete-inputRoot {
    padding: 0;
    padding-left: 20px;
  }

  & .MuiAutocomplete-input {
    padding: 0 !important;
    padding-top: 2px !important;
    font-size: 11px;
  }

  & input {
    width: 315px;
    height: 30px;
    color: #989898;
    line-height: 3px;
    padding: 0;
    &::placeholder {
      color: #fff;
      font-size: 11px;
      margin-top: -8px;
    }
  }
`

const StyledPopper = styled(Popper)`
  background: #151618;
  & .MuiPaper-root {
    border: solid 1px #444;
    border-bottom-left-radius: 10px;
    border-bottom-right-radius: 10px;
  }

  & .MuiAutocomplete-listbox {
    background: #151618;

    & :hover {
      background: #1f1f1f;
    }
  }
`

const SelectBox = styled(Box)`
  display: flex;
  padding: 13px 15px 17px;
  background-color: #151618;
  animation: fadeInDown;
  animation-duration: 1s;
`

const StyledTextField = styled(TextField)`
  line-height: 3px;
`

const TickerName = styled('div')`
  color: #fff;
	font-size: 12px;
  font-weight: 600;
  font-stretch: normal;
  font-style: normal;
  line-height: normal;
  letter-spacing: normal;
  margin: 5px;
`

const SearchIconWrapper = styled(Box)`
  position: relative; 
  right: 30px; 
  top: 8px;
`

export default SelectPairInput
