import { Box } from '@mui/material'
import { styled } from '@mui/material/styles'

export const OpaqueDefault = styled(Box)`
  position: absolute;
  top: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.65);
`

export const OpaqueNoCollateral = styled(Box)`
  position: absolute;
  top: 120px;
  left: 3px;
  width: 99%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.65);
`

export const OpaqueAlreadyPool = styled(Box)`
  position: absolute;
  top: 360px;
  left: 3px;
  width: 99%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.65);
`

export const BlackDefault = styled(Box)`
  position: absolute;
  top: 0;
  width: 100%;
  height: 100%;
  background-color: #000;
`
