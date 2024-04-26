import { Typography, Stack, Select, SelectChangeEvent } from '@mui/material'
import { styled } from '@mui/material/styles'
import MenuItem from '@mui/material/MenuItem'

interface Props {
  selMenuIdx: number
  onChangeMenu: (menuIdx: number) => void
}

const MobileMenu: React.FC<Props> = ({ selMenuIdx, onChangeMenu }) => {

  const CommonSelectBox = ({ children, value, handleChange }: { children: React.ReactNode, value: number, handleChange: (event: SelectChangeEvent) => void }) => {
    return (
      <SelectBox
        value={value}
        onChange={handleChange}
        sx={{
          padding: '0px',
          '& .MuiSelect-icon': {
            color: '#fff'
          },
          "&.MuiOutlinedInput-root": {
            "& fieldset": {
              border: '1px solid #343441',
            },
            "&:hover fieldset": {
              borderColor: "#c4b5fd !important"
            },
            "&.Mui-focused fieldset": {
              borderColor: "#343441"
            }
          }
        }}
        MenuProps={{
          disablePortal: false,
          PaperProps: {
            sx: {
              zIndex: 999999,
              border: '1px solid #343441',
              '& .MuiMenu-list': {
                padding: 0,
                '&:hover': {
                  backgroundColor: '#000',
                }
              },
              '& .Mui-selected': {
                backgroundColor: '#000 !important',
              },
            }
          },
          anchorOrigin: {
            vertical: "bottom",
            horizontal: "left"
          },
          transformOrigin: {
            vertical: "top",
            horizontal: "left"
          },
        }}
      >
        {children}
      </SelectBox>
    )
  }

  const handleChangeMenu = (event: SelectChangeEvent) => {
    const menuIdx = Number(event.target.value)
    onChangeMenu(menuIdx)
  };

  return (
    <CommonSelectBox value={selMenuIdx} handleChange={handleChangeMenu}>
      <SelectMenuItem key={0} value={0}>
        <Stack direction='row' alignItems='center' gap={1}>
          <Typography variant='p'>Trading Fee</Typography>
        </Stack>
      </SelectMenuItem>
      <SelectMenuItem key={0} value={1}>
        <Stack direction='row' alignItems='center' gap={1}>
          <Typography variant='p'>Comet APY</Typography>
        </Stack>
      </SelectMenuItem>
      <SelectMenuItem key={0} value={2}>
        <Stack direction='row' alignItems='center' gap={1}>
          <Typography variant='p'>Points boost</Typography>
        </Stack>
      </SelectMenuItem>
    </CommonSelectBox>
  )
}

const SelectBox = styled(Select)`
  width: 130px;
  height: 36px;
  padding: 10px;
  border-radius: 10px;
  background: #201c27;
`
const SelectMenuItem = styled(MenuItem)`
  display: flex;
  padding: 10px;
  background: #000;
  &:hover {
    background-color: rgba(255, 255, 255, 0.1);
  }
`

export default MobileMenu;