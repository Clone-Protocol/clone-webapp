import React from 'react'
import { Box, Typography, Button } from '@mui/material'
import { styled } from '@mui/material/styles'
import useLocalStorage from '~/hooks/useLocalStorage'
import { IS_COMPLETE_INIT } from '~/data/localstorage'
import { CloseButton } from './CommonButtons'
import { NETWORK_NAME } from '~/utils/constants'

const InitEnterScreen = ({ onClose }: { onClose: () => void }) => {
  const [_, setIsCompleteInit] = useLocalStorage(IS_COMPLETE_INIT, false)

  const close = () => {
    setIsCompleteInit(true)
    onClose && onClose()
  }

  return (
    <BackScreen>
      <BoxWrapper>
        <TextHead>Welcome!</TextHead>
        <Box my='20px' lineHeight={0.9}>
          <Typography variant='p_xlg' lineHeight={1.5}>
            Welcome to Clone Liquidity on Solana {NETWORK_NAME}. {NETWORK_NAME} is the perfect place to explore Clone and Solana without any cost!
          </Typography>
        </Box>
        <EnterButton onClick={() => close()}><Typography variant='p_xlg'>Enter Clone {NETWORK_NAME}</Typography></EnterButton>

        <Box sx={{ position: 'absolute', right: '10px', top: '10px' }}>
          <CloseButton handleClose={onClose} />
        </Box>
      </BoxWrapper>
    </BackScreen>
  )
}

const BackScreen = styled('div')`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: #000;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 99999;
`
const BoxWrapper = styled(Box)`
  position: relative;
  width: 607px;
  color: #fff; 
  text-align: left;
  background: #000916;
  padding: 28px 53px;
`
const TextHead = styled(Box)`
  font-size: 36px;
  font-weight: 600;
  color: ${(props) => props.theme.basis.melrose};
`
const EnterButton = styled(Button)`
  width: 100%;
  height: 52px;
  color: #000;
  margin-top: 10px;
  border-radius: 10px;
  background: ${(props) => props.theme.basis.melrose};
  &:hover {
    background: ${(props) => props.theme.basis.lightSlateBlue};
  }
`

export default InitEnterScreen

