import React, { useState } from 'react'
import { Box, Stack, Theme, Typography, useMediaQuery } from '@mui/material'
import { styled } from '@mui/material/styles'
import CloseIcon from 'public/images/close-round.svg'
import Image from 'next/image'
import BenefitIcon1 from 'public/images/staking/benefit-logo-1.svg'
import { LEVEL_DISCOUNT_PRICING_FEES } from '~/features/Staking/StakingInfo.query'

const BannerSaveTrade = ({ open, handleClose }: Props) => {
  const isMobileOnSize = useMediaQuery((theme: Theme) => theme.breakpoints.down('md'))
  //@TODO: set currlevel as global
  const [currLevel, setCurrLevel] = useState(0)

  return open ? (
    <Box>
      <StackWrapper direction='row' alignItems='center'>
        <Box width='40px' height='100%' display='flex' justifyContent='flex-end' pl='10px' pt='10px'>
          <Image src={BenefitIcon1} alt='benefit' />
        </Box>
        <Box width='280px' padding='10px' textAlign='left'>
          <Box><Typography variant='p_lg' color='#fff'>Save on every trade</Typography></Box>
          <Box lineHeight={1} mb='10px'>
            <Typography variant='p' color='#8988a3'>
              <span style={{ color: '#cef2f0' }}>{LEVEL_DISCOUNT_PRICING_FEES[currLevel]}bps</span> fee discount automatically applies to all your trades given your CLN staking.
            </Typography>
          </Box>
        </Box>
        <CloseButton onClick={handleClose}><Image src={CloseIcon} alt='close' /></CloseButton>
      </StackWrapper>
    </Box>
  ) : <></>
}

export default BannerSaveTrade

interface Props {
  open: boolean
  handleClose: () => void
}
const StackWrapper = styled(Stack)`
  position: relative;
  width: 100%;
  height: 80px;
  margin-top: 20px;
  border-radius: 10px;
  border: solid 1px ${(props) => props.theme.basis.plumFuzz};
  background-color: #0a080f;
`
const CloseButton = styled(Box)`
  position: absolute;
  right: 8px;
  top: 8px;
  cursor: pointer;
`