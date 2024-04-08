import { Box, Input } from '@mui/material'
import { styled } from '@mui/material/styles'
import Image from 'next/image'
import SearchIcon from 'public/images/search-icon.svg'

interface Props {
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
}
const SearchInput: React.FC<Props> = ({ onChange }) => {
  return (
    <Box>
      <StyledBox>
        <Box sx={{ position: 'relative', left: '0px', top: '-6px' }}>
          <Image src={SearchIcon} alt='search' />
        </Box>
        <StyledInput placeholder="Search clAssets" disableUnderline onChange={onChange} />
      </StyledBox>
    </Box>
  )
}

const StyledBox = styled(Box)`
  display: flex;
  width: 100%;
  height: 36px;
  color: #fff;
  padding: 14px 11px;
  border-radius: 10px;
  border: solid 1px ${(props) => props.theme.basis.portGore};
  background-color: rgba(255, 255, 255, 0.05);
  &:hover {
    border-color: ${(props) => props.theme.basis.melrose};
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
    margin-left: 10px;
    color: #fff;

    &::placeholder {
      color: #fff;
    }
  }
`

export default SearchInput
