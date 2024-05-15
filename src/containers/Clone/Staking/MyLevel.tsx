import { Box, Typography } from '@mui/material'
import { styled } from '@mui/material/styles'
import { InfoOutlineIcon } from '~/components/Common/SvgIcons'
import { DISCORD_URL } from '~/data/social'
import { useWallet } from '@solana/wallet-adapter-react'
import BenefitLevel from '~/components/Staking/BenefitLevel'
import { LevelInfo } from '~/features/Staking/StakingInfo.query'

const MyLevel = ({ levelData }: { levelData: LevelInfo | undefined }) => {
  const { publicKey } = useWallet()

  console.log('l', levelData)
  const isShowBenefit = publicKey && levelData && levelData.currentLevel !== 0

  return (
    <Wrapper height={isShowBenefit ? 'auto' : '185px'}>
      <Box padding='22px 30px'>
        <MoreTxt position='absolute' right='8px' top='7px' display='flex' gap='4px' alignItems='center'>
          <InfoOutlineIcon />
          <Typography variant='p_sm'>More about levels</Typography>
        </MoreTxt>
        <BenefitLevel levelData={levelData} />
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
const MoreTxt = styled(Box)`
  background-color: #0f0e14; 
  border-radius: 10px; 
  padding: 5px 7px;
  cursor: pointer;
  &:hover {
    color: #cef2f0;
`


export default MyLevel