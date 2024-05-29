import { Box, Stack, Theme, Typography, useMediaQuery } from "@mui/material"
import { styled } from "@mui/system"
import Image from "next/image"
import ArrowLink from 'public/images/giveaway/arrow-link.svg'
import ArrowLinkOn from 'public/images/giveaway/arrow-link-on.svg'
import { useState } from "react"

const CompleteRound = ({ version = 1 }: { version: number }) => {
  const isMobileOnSize = useMediaQuery((theme: Theme) => theme.breakpoints.down('md'))
  const [hoverArrow, setHoverArrow] = useState(false)

  return version === 1 ? (
    <Stack direction='row' justifyContent='center' alignItems='center' width='100%' mt='23px' mb='10px'>
      <a href="https://docs.clone.so/clone-mainnet-guide/points-program/season-1/cloner-classic-giveaway#past-ccg-winners" target='_blank'>
        <BorderBox width={isMobileOnSize ? '100%' : '474px'} height='104px' position='relative' onMouseEnter={() => setHoverArrow(true)} onMouseLeave={() => setHoverArrow(false)}>
          <Box display='flex' justifyContent='center' alignItems='center'>
            <Typography variant='p_xlg' fontWeight={500}>Round 2 draw is now complete</Typography>
          </Box>
          <Box display='flex' justifyContent='center' alignItems='center' padding='5px 15px'>
            <Typography variant='p' fontWeight={500} color='#c5c7d9'>
              Prize points have been applied and click this box to see the winners!
            </Typography>
          </Box>

          <Box position='absolute' top='10px' right='10px'>
            <Image src={hoverArrow ? ArrowLinkOn : ArrowLink} alt='ArrowLink' />
          </Box>
        </BorderBox>
      </a>
    </Stack>
  ) : (
    <Stack direction='row' justifyContent='center' alignItems='center' width='100%' mt='23px' mb='10px'>
      <BorderBox width={isMobileOnSize ? '100%' : '474px'} height='104px' position='relative' onMouseEnter={() => setHoverArrow(true)} onMouseLeave={() => setHoverArrow(false)}>
        <Box display='flex' justifyContent='center' alignItems='center'>
          <Typography variant='p_xlg' fontWeight={500}>Round 2 has ended</Typography>
        </Box>
        <Box display='flex' justifyContent='center' alignItems='center' padding='5px 15px'>
          <Typography variant='p' fontWeight={500} color='#c5c7d9'>
            Winners will be announced soon!
          </Typography>
        </Box>
      </BorderBox>
    </Stack>
  )
}

const BorderBox = styled(Box)`
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 10px;
  color: #fff;
  // cursor: pointer;
  &::before {
    content: "";
    border-radius: 10px;
    border-style: solid;
    border-width: 1px;
    border-color: transparent;
    border-image-source: linear-gradient(103deg, #a18e3f -19%, #7336a2 102%);
    border-image-slice: 1;
    background-image: linear-gradient(to bottom, #000, #000), linear-gradient(103deg, #a18e3f -19%, #7336a2 102%);
    background-origin: border-box;
    background-clip: content-box, border-box;
    position: absolute;
    inset: 0;
    -webkit-mask: /*4*/
     linear-gradient(#fff 0 0) padding-box, 
     linear-gradient(#fff 0 0);
  -webkit-mask-composite: xor; /*5'*/
          mask-composite: exclude; /*5*/
  }
  &:hover {
    &::before {
      border-image-source: linear-gradient(103deg, #fbdc5f -19%, #b557ff 102%);
      background-image: linear-gradient(to bottom, #000, #000), linear-gradient(103deg, #fbdc5f -19%, #b557ff 102%);
    }
  }
`

export default CompleteRound