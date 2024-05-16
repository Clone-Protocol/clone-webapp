import React, { useState } from 'react'
import { Box, Typography, Button } from '@mui/material'
import { styled } from '@mui/material/styles'
import { CloseButton } from '../Common/CommonButtons'
// import RocketPromoteIcon from 'public/images/points-rocket.svg'
// import Image from 'next/image'

const PromoteDialog = ({ onClose }: { onClose: () => void }) => {
  const [addedOut, setAddedOut] = useState('')
  const close = () => {
    setAddedOut('out')
    setTimeout(() => {
      onClose && onClose()
    }, 1000)
  }

  return (
    <BackScreen>
      <AnimWrapper className={addedOut}>
        <BoxWrapper sx={{ width: { xs: '100%', md: '463px' }, paddingTop: { xs: '30px', md: '20px' } }}>
          <TextHead>Liquidity Point 2x Multiplier</TextHead>
          <Box my='20px' lineHeight={0.9}>
            <Typography variant='p_lg' lineHeight={1.5}>
              For limited amount of time, your liquidity points are multiplied!
            </Typography>
          </Box>
          {/* <EnterButton onClick={() => close()}><Image src={RocketPromoteIcon} alt='promote' /></EnterButton> */}

          <Box sx={{ position: 'absolute', right: '10px', top: '10px' }}>
            <CloseButton handleClose={() => close()} />
          </Box>
        </BoxWrapper>
      </AnimWrapper>
    </BackScreen>
  )
}

const BackScreen = styled('div')`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 999;
`
const AnimWrapper = styled('div')`
  transform: translateX(-1500px);
  animation: roadRunnerIn 0.3s cubic-bezier(0.165, 0.84, 0.44, 1) forwards;

  &.out {
    animation: roadRunnerOut 0.5s cubic-bezier(0.165, 0.84, 0.44, 1) forwards;
  }

  @keyframes roadRunnerIn {
    0% {
      transform: translateX(-1500px) skewX(30deg) scaleX(1.3);
    }
    70% {
      transform: translateX(50px) skewX(0deg) scaleX(0.9);
    }
    100% {
      transform: translateX(0px) skewX(0deg) scaleX(1);
    }
  }
  @keyframes roadRunnerOut {
    0% {
      transform: translateX(0px) skewX(0deg) scaleX(1);
    }
    30% {
      transform: translateX(-100px) skewX(-5deg) scaleX(0.9);
    }
    100% {
      transform: translateX(1500px) skewX(30deg) scaleX(1.3);
    }
  }
`
const BoxWrapper = styled(Box)`
  position: relative;
  color: #fff; 
  text-align: center;
  border-radius: 20px;
  border: solid 1px #191919;
  background-color: #0c0c0c;
  padding: 20px;
  z-index: 99999;
`
const TextHead = styled(Box)`
  font-size: 24px;
  font-weight: 600;
  background-image: linear-gradient(to right, #fbdc5f 35%, #3dddff 100%);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent
`
const EnterButton = styled(Button)`
  width: 123px;
  height: 52px;
  border-radius: 10px;
  color: #000;
  margin-top: 5px;
  background-color: rgba(255, 255, 255, 0.05);
  &:hover {
    background-color: rgba(255, 255, 255, 0.1);
  }
`

export default PromoteDialog

