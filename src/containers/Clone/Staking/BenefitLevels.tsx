import { Box, Stack, Theme, Typography, useMediaQuery } from '@mui/material'
import { styled } from '@mui/material/styles'
import { StyledTabs, CommonTab } from '~/components/Staking/StyledTab'
import { useEffect, useRef, useState } from 'react'
// import InfoOutlineIcon from 'public/images/staking/info-outline.svg'
import InfoTooltip from '~/components/Staking/InfoTooltip'
import { TooltipTexts } from '~/data/tooltipTexts'
import { useWallet } from '@solana/wallet-adapter-react'
import MobileMenu from '~/components/Staking/MobileMenu'
import { LEVEL_COMET_APYS, LEVEL_POINTS_BOOSTS, LEVEL_TRADING_FEES, LevelInfo } from '~/features/Staking/StakingInfo.query'


const BenefitLevels = ({ levelData }: { levelData: LevelInfo | undefined }) => {
  const isMobileOnSize = useMediaQuery((theme: Theme) => theme.breakpoints.down('md'))
  const { publicKey } = useWallet()
  const [tab, setTab] = useState(0)
  const scrollRef = useRef(null);

  const scroll = (scrollOffset: number) => {
    scrollRef.current.scrollLeft += scrollOffset
  };

  //scroll to right when level changes
  useEffect(() => {
    if (levelData) {
      if (levelData.currentLevel === 1) {
        scroll(20)
      } else if (levelData.currentLevel === 2) {
        scroll(80)
      } else if (levelData.currentLevel === 3) {
        scroll(150)
      } else if (levelData.currentLevel === 4) {
        scroll(200)
      }
    }
  }, [levelData])


  const handleChangeTab = (event: React.SyntheticEvent, newValue: number) => {
    setTab(newValue)
  }

  return (
    <Wrapper width={isMobileOnSize ? '330px' : '654px'}>
      <Stack direction='row' justifyContent='space-between' alignItems='center' padding='14px 22px'>
        <TitleTxt>Benefit by levels</TitleTxt>

        {isMobileOnSize ?
          <MobileMenu selMenuIdx={tab} onChangeMenu={(menuIdx) => setTab(menuIdx)} />
          :
          <StyledTabs value={tab} onChange={handleChangeTab}>
            <CommonTab value={0} label="Trading fee" />
            <CommonTab value={1} label="Comet APY" icon={<InfoTooltip title={TooltipTexts.totalLiquidity} />} />
            <CommonTab value={2} label="Points boost" />
          </StyledTabs>
        }
      </Stack>

      <GridBackground>
        <LevelStack ref={scrollRef} direction='row' display={isMobileOnSize ? '-webkit-box' : 'flex'} alignContent='center' justifyContent='center' gap='20px' width={isMobileOnSize ? '330px' : '100%'} sx={{ overflowX: { xs: 'auto', md: 'hidden' }, scrollMarginLeft: { xs: '30px', md: '0px' } }}>
          {tab === 0 && LEVEL_TRADING_FEES.map((fee, index) =>
            publicKey && index === levelData.currentLevel ?
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
          {tab === 1 && publicKey &&
            LEVEL_COMET_APYS.map((apy, index) =>
              index === levelData.currentLevel ?
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
          {tab === 1 && !publicKey &&
            <Box><Typography variant='p'>Connect your wallet to view APY</Typography></Box>
          }
          {tab === 2 && LEVEL_POINTS_BOOSTS.map((points, index) =>
            publicKey && index === levelData.currentLevel ?
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
        </LevelStack>
      </GridBackground>
    </Wrapper >
  )
}

const Wrapper = styled(Box)`
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
  justify-content: center;
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
  min-width: 103px;
  scroll-snap-align: center;
  height: 65px;
  padding: 10px;
  text-align: center;
  border-radius: 15px;
  background-color: ${(props) => props.theme.basis.cinder};
  &.selected {
    border: solid 1px ${(props) => props.theme.basis.plumFuzz};
  }
`
const LevelStack = styled(Stack)`
  scroll-snap-type: x mandatory;
  &::-webkit-scrollbar {
    display: none;
  }
`

export default BenefitLevels
