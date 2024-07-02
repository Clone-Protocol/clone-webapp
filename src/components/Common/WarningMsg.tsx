import { Typography, Stack } from '@mui/material'
import { styled } from '@mui/material/styles'
import Image from 'next/image'
import InfoIcon from 'public/images/info-icon.svg'
import IconAlertComet from 'public/images/alert-comet.svg'
import { InfoOutlineIcon } from './SvgIcons'

export const InfoMsg = ({ children }: { children?: React.ReactNode }) => {
  return (
    <InfoStack direction='row'>
      <Image src={InfoIcon} alt='info' />
      <Typography variant='p'>{children}</Typography>
    </InfoStack>
  )
}
const InfoStack = styled(Stack)`
  color: ${(props) => props.theme.basis.melrose};
  cursor: pointer;
  align-items: center;
  padding: 13px;
  width: 100%;
  gap: 13px;
  cursor: pointer;
  line-height: 1.33;
  border-radius: 10px;
  background-color: ${(props) => props.theme.basis.revolver};
  // &:hover {
  //   background-color: rgba(79, 229, 255, 0.05);
  // }
`

export const WarningMsg = ({ children }: { children?: React.ReactNode }) => {
  return (
    <WarningStack direction='row'>
      <Image src={IconAlertComet} alt='alert' width={15} height={14} />
      <Typography variant='p'>{children}</Typography>
    </WarningStack>
  )
}
const WarningStack = styled(InfoStack)`
  color: #ff0084;
  cursor: pointer;
  background-color: rgba(255, 0, 214, 0.15);
  &:hover {
    background-color: rgba(255, 0, 214, 0.05);
  }
`

export default WarningMsg

export const InfoMsg2 = ({ children }: { children?: React.ReactNode }) => {
  return (
    <InfoStack direction='row' textAlign='left'>
      <InfoOutlineIcon />
      <Typography variant='p' maxWidth='309px'>{children}</Typography>
    </InfoStack>
  )
}