import { Box, Button, Stack, Typography } from '@mui/material'
import { styled } from '@mui/material/styles'
import Image from 'next/image'
import LogosClone from 'public/images/staking/logos-clone-mini.svg'

const MyLevel = () => {

  return (
    <Wrapper>
      <Typography variant='p_lg'>Your Level</Typography>
      <BorderBox>
        <Typography variant='p'>cloner</Typography>
        <LevelTxt>1</LevelTxt>
      </BorderBox>

    </Wrapper>
  )
}

const Wrapper = styled(Box)`
  width: 271px;
  height: 247px;
  padding: 25px 23px;
  border-radius: 10px;
  background: ${(props) => props.theme.basis.backInBlack};
`
const BorderBox = styled(Box)`
  width: 271px;
  height: 90px;
  flex-grow: 0;
  display: flex;
  flex-direction: row;
  justify-content: center;
  padding: 10px;
  border-radius: 10px;
  border: solid 1px ${(props) => props.theme.basis.plumFuzz};
  background-color: ${(props) => props.theme.basis.backInBlack};
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