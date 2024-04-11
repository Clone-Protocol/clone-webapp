import { styled } from '@mui/material'
import { Box, Input } from '@mui/material'
import Image from 'next/image'
import SearchIcon from 'public/images/search-icon.svg'

interface Props {
  onChange?: React.ChangeEventHandler<HTMLTextAreaElement | HTMLInputElement>
  placeholderTxt?: string
}
const SearchInput: React.FC<Props> = ({ placeholderTxt = 'Search clAssets', onChange }) => {
  return <StyledBox>
    <Box sx={{ position: 'relative', left: '0px', top: '-6px' }}>
      <Image src={SearchIcon} alt='search' />
    </Box>
    <StyledInput placeholder={placeholderTxt} disableUnderline onChange={onChange} />
  </StyledBox>
}

const StyledBox = styled(Box)`
  display: flex;
  width: 100%;
  height: 36px;
  color: #fff;
  padding: 14px 11px;
  border: solid 1px ${(props) => props.theme.basis.shadowGloom};
  border-radius: 5px;
  background-color: rgba(255, 255, 255, 0.05);
  &:hover {
    border-color: ${(props) => props.theme.basis.liquidityBlue};
  }
`

const StyledInput = styled(Input)`
  & input {
    width: 206px;
    height: 46px;
    font-size: 14px;
    font-weight: 500;
    font-stretch: normal;
    font-style: normal;
    line-height: normal;
    letter-spacing: normal;
    text-align: left;
    color: #fff;
    margin-left: 15px;

    &::placeholder {
      color: #fff;
    }
  }
`

export default SearchInput
