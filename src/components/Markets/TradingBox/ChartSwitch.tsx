import { Stack, Switch } from "@mui/material";
import { styled } from "@mui/material/styles";

const CustomSwitch = styled(Switch)(({ theme }) => ({
  '& .MuiSwitch-switchBase': {
    color: '#c4b5fd',
    '&.Mui-checked': {
      '& .MuiSwitch-thumb': {
        backgroundColor: '#c4b5fd',
      }
    },
  },
  '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
    backgroundColor: '#4e4b57',
    opacity: 1
  },
  '& .MuiSwitch-track': {
    backgroundColor: '#c4b5fd',
    color: '#4e4b57',
  },
  '& .MuiSwitch-thumb': {
    backgroundColor: '#c5c7d9',
  }
}));

const label = { inputProps: { 'aria-label': 'ChartSwitch' } };

export default function ChartSwitch({ checked = false, onChange }: { checked?: boolean, onChange: (event: React.ChangeEvent<HTMLInputElement>) => void }) {
  {
    return (
      <CustomStack direction='row' justifyContent='center' alignContent='center' gap='3px' pt='5px'>
        <CustomSwitch size='small' checked={checked} onChange={onChange} {...label} color="default" />
      </CustomStack>
    );
  }
}

const CustomStack = styled(Stack)`
  width: 98px;
  height: 35px;
  background: #0a080f;
  border-top-left-radius: 20px;
  border-top-right-radius: 20px;
`