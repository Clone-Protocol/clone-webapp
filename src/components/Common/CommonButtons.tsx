import { styled } from '@mui/system'
import { Box } from '@mui/material'
import CloseIcon from 'public/images/close-round.svg'
import Image from 'next/image'

export const CloseButton = ({ handleClose }: { handleClose: () => void }) => (
  <CloseBox onClick={handleClose}>
    <Image src={CloseIcon} alt='close' />
  </CloseBox>
)
const CloseBox = styled(Box)`
  cursor: pointer;
  width: 22px;
  height: 22px;
  display: flex;
  justify-content: center;
  align-items: center;
`