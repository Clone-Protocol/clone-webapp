import { Box, Stack, Typography } from '@mui/material'
import { styled } from '@mui/material/styles'
import { StyledTabs, CommonTab } from '~/components/Staking/StyledTab'
import { useState } from 'react'
// import InfoOutlineIcon from 'public/images/staking/info-outline.svg'
import InfoTooltip from '~/components/Staking/InfoTooltip'
import { TooltipTexts } from '~/data/tooltipTexts'

const LEVEL_TRAIDING_FEE = [300, 200, 150, 100, 50]
const LEVEL_COMET_APY = [8.57, 9.57, 10.1, 11.5, 13.2]
const LEVEL_POINTS_BOOST = [1, 1.2, 1.4, 1.6, 1.8]

const BenefitLevels = () => {
  const [tab, setTab] = useState(0)
  const [currLevel, setCurrLevel] = useState(0)

  const handleChangeTab = (event: React.SyntheticEvent, newValue: number) => {
    setTab(newValue)
  }

  return (
    <Wrapper>
      <Stack direction='row' justifyContent='space-between' alignItems='center' padding='14px 22px'>
        <TitleTxt>Benefit by levels</TitleTxt>
        <StyledTabs value={tab} onChange={handleChangeTab}>
          <CommonTab value={0} label="Trading fee" />
          <CommonTab value={1} label="Comet APY" icon={<InfoTooltip title={TooltipTexts.totalLiquidity} />} />
          <CommonTab value={2} label="Points boost" />
        </StyledTabs>
      </Stack>

      <GridBackground>
        <Stack direction='row' alignContent='center' justifyContent='center' gap='20px'>
          {tab === 0 && LEVEL_TRAIDING_FEE.map((fee, index) =>
            index === currLevel ?
              <BorderBox className='selected' key={index}>
                <Box><SelectedTxt variant='p_xlg'>{fee} bps</SelectedTxt></Box>
                <Box><SelectedSubTxt variant='p'>cloner {index + 1}</SelectedSubTxt></Box>
              </BorderBox>
              :
              <BorderBox key={index}>
                <Box><Typography variant='p_xlg'>{fee} bps</Typography></Box>
                <Box><Typography variant='p'>cloner {index + 1}</Typography></Box>
              </BorderBox>
          )}
          {tab === 1 && LEVEL_COMET_APY.map((apy, index) =>
            index === currLevel ?
              <BorderBox className='selected' key={index}>
                <Box><SelectedTxt variant='p_xlg'>{apy}%</SelectedTxt></Box>
                <Box><SelectedSubTxt variant='p'>cloner {index + 1}</SelectedSubTxt></Box>
              </BorderBox>
              :
              <BorderBox key={index}>
                <Box><Typography variant='p_xlg'>{apy}%</Typography></Box>
                <Box><Typography variant='p'>cloner {index + 1}</Typography></Box>
              </BorderBox>
          )}
          {tab === 2 && LEVEL_POINTS_BOOST.map((points, index) =>
            index === currLevel ?
              <BorderBox className='selected' key={index}>
                <Box><SelectedTxt variant='p_xlg'>{points > 1 ? `${points}X` : '-'}</SelectedTxt></Box>
                <Box><SelectedSubTxt variant='p'>cloner {index + 1}</SelectedSubTxt></Box>
              </BorderBox>
              :
              <BorderBox key={index}>
                <Box><Typography variant='p_xlg'>{points > 1 ? `${points}X` : '-'}</Typography></Box>
                <Box><Typography variant='p'>cloner {index + 1}</Typography></Box>
              </BorderBox>
          )}
        </Stack>
      </GridBackground>
    </Wrapper >
  )
}

const Wrapper = styled(Box)`
  width: 626px;
  height: 173px;
  position: relative;
  border-radius: 10px;
  color: ${(props) => props.theme.basis.textRaven};
  background: ${(props) => props.theme.basis.backInBlack};
`
const TitleTxt = styled('span')`
  background-image: linear-gradient(96deg, #b5fdf9 0%, #c4b5fd 93%);
  font-size: 14px;
  line-height: 1.71;
  letter-spacing: normal;
  text-align: left;
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
`
const SelectedTxt = styled(Typography)`
  background-image: linear-gradient(106deg, #b5fdf9 1%, #c4b5fd 93%);
  font-size: 16px;
  line-height: 1.5;
  letter-spacing: normal;
  text-align: center;
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
`
const SelectedSubTxt = styled(Typography)`
  background-image: linear-gradient(109deg, #b5fdf9 2%, #c4b5fd 92%);
  font-size: 12px;
  line-height: 1.33;
  letter-spacing: normal;
  text-align: center;
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
`
const GridBackground = styled(Box)`
  height: 116px;
  display: flex;
  align-items: center;
  padding: 18px 18px;
  border-bottom-left-radius: 10px;
  border-bottom-right-radius: 10px;
  background-color: ${(props) => props.theme.basis.backInBlack};
  background-image: linear-gradient(to right, rgba(49,46,70, 0.3) 1px, transparent 1px), linear-gradient(to bottom, rgba(49,46,70, 0.3) 1px, transparent 1px);
  background-size: 22px 22px;
`
const BorderBox = styled(Box)`
  width: 103px;
  height: 65px;
  padding: 10px;
  text-align: center;
  border-radius: 15px;
  background-color: ${(props) => props.theme.basis.cinder};
  &.selected {
    border: solid 1px ${(props) => props.theme.basis.plumFuzz};
  }
`

export default BenefitLevels
