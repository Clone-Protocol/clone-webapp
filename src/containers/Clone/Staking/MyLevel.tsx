import { Box, Typography } from '@mui/material'
import { styled } from '@mui/material/styles'
import { InfoOutlineIcon } from '~/components/Common/SvgIcons'
import { DISCORD_URL } from '~/data/social'
import { useWallet } from '@solana/wallet-adapter-react'
import BenefitLevel from '~/components/Staking/BenefitLevel'

export const LEVEL_DISCOUNT_TRAIDING_FEE = [0, 100, 150, 200, 250]

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
        <BenefitLevel currLevel={currLevel} />
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