import { styled } from '@mui/system'
import { Box, Button } from '@mui/material'
import CloseIcon from 'public/images/close-round.svg'
import Image from 'next/image'


export const GoBackButton = styled(Box)`
  color: ${(props) => props.theme.basis.slug};
  cursor: pointer;
  &:hover {
    color: #fff;
  }
`

export const SubmitButton = styled(Button) <{ hasRisk?: boolean }>`
	width: 100%;
  height: 52px;
	background-color: ${(props) => props.hasRisk ? '#d92a84' : props.theme.basis.melrose};
	color: #000;
  border-radius: 10px;
  margin-top: 15px;
	margin-bottom: 15px;
  text-wrap: nowrap;
  &:hover {
    background-color: ${(props) => props.hasRisk ? '#af256c' : props.theme.basis.lightSlateBlue};
  }
  &:disabled {
    background-color: ${(props) => props.theme.basis.backInBlack};
    border: 1px solid ${(props) => props.theme.basis.plumFuzz};
    color: #8988a3;
    font-weight: 600;
  }
`
export const RiskSubmitButton = styled(SubmitButton)`
  background-color: #d92a84;
  &:hover {
    background-color: #d92a84;
    opacity: 0.6;
  }
`

export const SubmitEvmButton = styled(SubmitButton)`
	background-color: #fff;
	color: #000;
  &:hover {
    background-color: #909090;
  }
  &:disabled {
    border: 1px solid #4f4f4f;
  }
`

export const ConnectButton = styled(Button)`
  width: 100%;
  height: 52px;
  border-radius: 10px;
  background: ${(props) => props.theme.basis.backInBlack};
  border: solid 1px ${(props) => props.theme.basis.plumFuzz};
  color: #fff;
  margin-top: 15px;
  margin-bottom: 15px;
  &:hover {
    background: transparent;
    border: solid 1px ${(props) => props.theme.basis.melrose};
  }
  &:disabled {
    border: 1px solid ${(props) => props.theme.basis.portGore};
    font-weight: 600;
    color: #989898;
  }
`

export const SelectButton = styled(ConnectButton)`
  color: #8988a3;
`

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

export const ShowChartBtn = styled(Box)`
  position: fixed;
  bottom: 15px;
  width: 95%;
  height: 36px;
  color: #fff;
	border-radius: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 10px;
  z-index: 9999999;
  cursor: pointer;
  border: solid 1px ${(props) => props.theme.basis.plumFuzz};
  background: ${(props) => props.theme.basis.backInBlack};
	&:hover {
		background: ${(props) => props.theme.basis.backInBlack};
    border: solid 1px ${(props) => props.theme.basis.melrose};
  }
`