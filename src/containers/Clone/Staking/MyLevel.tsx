import { Box, Stack, Typography } from '@mui/material'
import { styled } from '@mui/material/styles'
import Image from 'next/image'
import BenefitIcon1 from 'public/images/staking/benefit-logo-1.svg'
import BenefitIcon2 from 'public/images/staking/benefit-logo-2.svg'
import BenefitIcon3 from 'public/images/staking/benefit-logo-3.svg'
import { InfoOutlineIcon } from '~/components/Common/SvgIcons'
import { DISCORD_URL } from '~/data/social'
import { useWallet } from '@solana/wallet-adapter-react'

const LEVEL_DISCOUNT_TRAIDING_FEE = [0, 100, 150, 200, 250]

const MyLevel = ({ currLevel }: { currLevel: number }) => {
  const { publicKey } = useWallet()

  const isShowBenefit = publicKey && currLevel !== 0

  return (
    <Wrapper height={isShowBenefit ? 'auto' : '185px'}>
      <Box padding='22px 30px'>
        <MoreTxt position='absolute' right='8px' top='7px' display='flex' gap='4px' alignItems='center'>
          <InfoOutlineIcon />
          <Typography variant='p_sm'>More about levels</Typography>
        </MoreTxt>
        <Typography variant='p_lg'>Your Level</Typography>
        <BorderBox mt='20px' mb='30px'>
          {publicKey ?
            <>
              <TitleTxt>cloner</TitleTxt>
              <LevelTxt>{currLevel + 1}</LevelTxt>
            </>
            : <>
              <Typography variant='h3' fontWeight={500}>-</Typography>
            </>
          }
        </BorderBox>
        {isShowBenefit &&
          <Box>
            <Box mb='20px'><Typography variant='p_lg'>Your Benefit</Typography></Box>
            <Stack direction='row' mb='20px' gap='5px'>
              <Image src={BenefitIcon1} alt='benefit' />
              <Box>
                <Box><Typography variant='p_xlg' color='#fff'>Save on every trade</Typography></Box>
                <Box lineHeight={1} mt='4px'><Typography variant='p_lg'>You receive <span style={{ color: '#cef2f0' }}>{LEVEL_DISCOUNT_TRAIDING_FEE[currLevel]}bps</span> discount for all your trades.</Typography></Box>
              </Box>
            </Stack>
            <Stack direction='row' mb='20px' gap='5px'>
              <Image src={BenefitIcon2} alt='benefit' />
              <Box>
                <Box><Typography variant='p_xlg' color='#fff'>Increased Comet APY</Typography></Box>
                <Box lineHeight={1} mt='4px'><Typography variant='p_lg'>You receive additional $CLN emission that contributes to increased APY of your Comets.</Typography></Box>
              </Box>
            </Stack>
            <Stack direction='row' gap='5px'>
              <Image src={BenefitIcon3} alt='benefit' />
              <Box>
                <Box><Typography variant='p_xlg' color='#fff'>More points</Typography></Box>
                <Box lineHeight={1} mt='4px'><Typography variant='p_lg'>You become eligible for more points</Typography></Box>
              </Box>
            </Stack>
          </Box>
        }
      </Box>
      {isShowBenefit &&
        <Box display='flex' justifyContent='center' alignItems='center' borderTop='1px solid #201c27' height='50px' mt='10px'>
          <a href={DISCORD_URL} target="_blank" rel="noreferrer">
            <Box sx={{ color: '#8988a3', ':hover': { color: '#cef2f0' } }}>
              <Typography variant='p_sm'>Other benefits in mind? Let us know.</Typography>
            </Box>
          </a>
        </Box>
      }
    </Wrapper>
  )
}

const Wrapper = styled(Box)`
  width: 330px;
  position: relative;
  border-radius: 10px;
  background: ${(props) => props.theme.basis.backInBlack};
  color: ${(props) => props.theme.basis.textRaven};
`
const BorderBox = styled(Box)`
  width: 271px;
  height: 90px;
  flex-grow: 0;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  gap: 15px;
  padding: 10px;
  border-radius: 10px;
  border: solid 1px ${(props) => props.theme.basis.plumFuzz};
  background-color: ${(props) => props.theme.basis.backInBlack};
`
const MoreTxt = styled(Box)`
  background-color: #0f0e14; 
  border-radius: 10px; 
  padding: 5px 7px;
  cursor: pointer;
  &:hover {
    color: #cef2f0;
`
const TitleTxt = styled('span')`
  background-image: linear-gradient(106deg, #b5fdf9 1%, #c4b5fd 93%);
  font-size: 14px;
  font-weight: 500;
  line-height: 1;
  letter-spacing: normal;
  text-align: left;
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
`
const LevelTxt = styled('span')`
  background-image: linear-gradient(134deg, #b5fdf9 7%, #c4b5fd 89%);
  font-size: 50px;
  font-weight: 600;
  line-height: 0.8;
  letter-spacing: normal;
  text-align: left;
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
`

export default MyLevel