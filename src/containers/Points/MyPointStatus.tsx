import { styled } from '@mui/system'
import { Box, Button, CircularProgress, Stack, Theme, Tooltip, Typography, useMediaQuery } from '@mui/material'
import InfoTooltip from '~/components/Common/InfoTooltip'
import { TooltipTexts } from '~/data/tooltipTexts'
import { RankIndexForStatus } from '~/components/Points/RankItems'
import { fetchReferralCode, usePointStatusQuery } from '~/features/Points/PointStatus.query'
import { useWallet } from '@solana/wallet-adapter-react'
import { BlackDefault, OpaqueDefault } from '~/components/Common/OpaqueArea'
import { useWalletDialog } from '~/hooks/useWalletDialog'
import { formatLocaleAmount } from '~/utils/numbers'
import { LoadingProgress } from '~/components/Common/Loading'
import withSuspense from '~/hocs/withSuspense'
import BoltIcon from '@mui/icons-material/Bolt';
import PromoteDialog from '~/components/Points/PromoteDialog'
import { useEffect, useState } from 'react'
import ContentCopyIcon from 'public/images/content-copy.svg'
import { PythSymbolIcon } from '~/components/Common/SvgIcons'
import { PointTextForPyth } from '~/components/Points/PointMultiplierText'
import Image from 'next/image'

import { ReferralStatus } from '~/utils/constants'
import { useSnackbar } from 'notistack'
import CopyToClipboard from 'react-copy-to-clipboard'

const MyPointStatus = () => {
  const { publicKey } = useWallet()
  const { setOpen } = useWalletDialog()
  const { enqueueSnackbar } = useSnackbar()
  const [showReferralPanel, setShowReferralPanel] = useState(false)
  const [showPromoteDialog, setShowPromoteDialog] = useState(true)
  const [referralStatus, setReferralStatus] = useState(ReferralStatus.NotGenerated)
  const [isGeneratingRefCode, setIsGeneratingRefCode] = useState(false)
  const [referralCode, setReferralCode] = useState('000000')
  const [isRefCodeButtonMouseEnter, setIsRefCodeButtonMouseEnter] = useState(false)
  const isMobileOnSize = useMediaQuery((theme: Theme) => theme.breakpoints.down('md'))

  const { data: infos } = usePointStatusQuery({
    userPubKey: publicKey,
    refetchOnMount: true,
    enabled: publicKey != null
  })

  useEffect(() => {
    if (!infos?.totalPoints) {
      console.log('t', infos?.totalPoints)
      setReferralStatus(ReferralStatus.NotAllowed)
    } else {
      setReferralStatus(ReferralStatus.NotGenerated)
    }
  }, [infos])

  const getReferralCode = async () => {
    try {
      setIsGeneratingRefCode(true)
      const result = await fetchReferralCode({ userPubKey: publicKey })
      if (result?.referralCode) {
        setReferralCode(result.referralCode.toString().padStart(6, '0'))
        setReferralStatus(ReferralStatus.Generated)
      }
    } catch (e) {
      console.error('e', e)
    } finally {
      setIsGeneratingRefCode(false)
    }
  }

  const clickReferralCode = async () => {
    // if (referralStatus === ReferralStatus.Generated) {
    //   setShowReferralPanel(false)
    //   setReferralStatus(ReferralStatus.NotGenerated)
    // } else {
    setShowReferralPanel(true)
    setIsRefCodeButtonMouseEnter(false)
    if (referralStatus === ReferralStatus.NotGenerated) {
      getReferralCode()
    }
    // }
  }

  const goBackShowReferral = (e: any) => {
    if (showReferralPanel) {
      e.stopPropagation()

      setShowReferralPanel(false)
    }
  }

  return (
    <Wrapper>
      <Stack direction='row' gap={2}>
        <BorderBox width={isMobileOnSize ? '166px' : '176px'}>
          <Box display='flex' justifyContent='center' alignItems='center' height='20px'>
            <Typography variant='p_lg'>Global Rank</Typography>
          </Box>
          <StatusValue>
            <RankIndexForStatus rank={infos?.myRank} />
          </StatusValue>
        </BorderBox>
        <BorderBox width={isMobileOnSize ? '166px' : '350px'} position='relative'>
          <Box display='flex' justifyContent='center' alignItems='center' height='20px'>
            <Typography variant='p_lg'>My Total Points</Typography>
            <InfoTooltip title={TooltipTexts.points.totalPoints} color='#66707e' />
          </Box>
          <StatusValue>
            {infos?.hasPythPoint &&
              <Box width='42px'></Box>
            }
            <Typography variant='h3' fontWeight={500}>
              {infos?.totalPoints ? formatLocaleAmount(infos.totalPoints) : '0'}
            </Typography>
            {infos?.hasPythPoint &&
              <Tooltip title={TooltipTexts.points.multiplier} placement="top">
                <Box width='42px'><PointTextForPyth pythPointTier={infos?.pythPointTier} /></Box>
              </Tooltip>
            }
          </StatusValue>
          {infos?.hasPythPoint &&
            <Tooltip title={TooltipTexts.points.pythSymbol} placement="top">
              <PythBox>
                <PythSymbolIcon />
              </PythBox>
            </Tooltip>
          }
        </BorderBox>
      </Stack>
      <Stack direction='row' gap={2} flexWrap={'wrap'} mt='18px' justifyContent='center'>
        <BorderBox width={isMobileOnSize ? '166px' : '200px'} position='relative'>
          <Box display='flex' justifyContent='center' alignItems='center' ml='10px'>
            <Typography variant='p'>My Liquidity Points</Typography>
            <InfoTooltip title={TooltipTexts.points.lpPoints} color='#66707e' />
          </Box>
          <StatusValue>
            <Typography variant='p_xlg'>
              {infos?.lpPoints ? formatLocaleAmount(infos.lpPoints) : '0'}
            </Typography>
          </StatusValue>
        </BorderBox>
        <BorderBox width={isMobileOnSize ? '166px' : '200px'} position='relative'>
          <Box display='flex' justifyContent='center' alignItems='center' ml='10px'>
            <Typography variant='p'>My Trade Points</Typography>
            <InfoTooltip title={TooltipTexts.points.tradePoints} color='#66707e' />
          </Box>
          <StatusValue>
            <Typography variant='p_xlg'>
              {infos?.tradePoints ? formatLocaleAmount(infos.tradePoints) : '0'}
            </Typography>
          </StatusValue>
          <PromoteBox onClick={() => setShowPromoteDialog(true)}>
            <BoltIcon sx={{ fontSize: '16px', color: '#fbdc5f' }} />
            <ColoredText><Typography variant='p_sm'>1.5x Multiplier</Typography></ColoredText>
          </PromoteBox>
        </BorderBox>
        <BorderBox width={isMobileOnSize ? '166px' : '200px'}>
          <Box display='flex' justifyContent='center' alignItems='center' ml='10px'>
            <Typography variant='p'>My Social Points</Typography>
            <InfoTooltip title={TooltipTexts.points.socialPoints} color='#66707e' />
          </Box>
          <StatusValue>
            <Typography variant='p_xlg'>
              {infos?.socialPoints ? formatLocaleAmount(infos.socialPoints) : '0'}
            </Typography>
          </StatusValue>
        </BorderBox>
        <GenerateReferralBorderBox className={isRefCodeButtonMouseEnter ? 'hover' : ''} width={isMobileOnSize ? '166px' : '200px'} position='relative' onClick={goBackShowReferral}>
          {isGeneratingRefCode ?
            <Box display='flex' justifyContent='center' alignItems='center' height='100%'>
              <Box sx={{ width: '32px', height: '30px', display: 'flex', justifyContent: 'center', alignItems: 'center', backgroundColor: '#1c1c1c', borderRadius: '10px' }}><CircularProgress sx={{ color: '#fff' }} size={15} thickness={4} /></Box>
            </Box>
            :
            !showReferralPanel || referralStatus === ReferralStatus.NotGenerated ?
              <Box mt='8px'>
                <Box display='flex' justifyContent='center' alignItems='center' ml='10px'>
                  <Typography variant='p'>My Referral Points</Typography>
                  <InfoTooltip title={TooltipTexts.points.referralPoints} color='#66707e' />
                </Box>
                <StatusValue>
                  <Typography variant='p_xlg'>
                    {infos?.referralPoints ? formatLocaleAmount(infos.referralPoints) : '0'}
                  </Typography>
                </StatusValue>
                <ReferralBox onMouseEnter={() => setIsRefCodeButtonMouseEnter(true)} onMouseLeave={() => setIsRefCodeButtonMouseEnter(false)} onClick={clickReferralCode}>
                  <Typography variant='p_sm'>Click for referral code</Typography>
                </ReferralBox>
              </Box>
              :
              <Box height='100%'>
                {referralStatus === ReferralStatus.Generated ?
                  <Box mt='3px'>
                    <Box display='flex' flexDirection='column' justifyContent='center' alignItems='center'>
                      <Box><Typography variant='p_sm'>My Referral Link</Typography></Box>
                      <CopyToClipboard text={process.env.NEXT_PUBLIC_API_ROOT + '?referralCode=' + referralCode} onCopy={() => enqueueSnackbar('Referral link copied')}>
                        <ReferralButton onClick={(e) => e.stopPropagation()}><Image src={ContentCopyIcon} alt='copy' /> <Typography variant='p'>Copy Link</Typography></ReferralButton>
                      </CopyToClipboard>
                    </Box>
                    <Box display='flex' flexDirection='column' justifyContent='center' alignItems='center'>
                      <Box><Typography variant='p_sm'>My Referral Code</Typography></Box>
                      <CopyToClipboard text={referralCode} onCopy={() => enqueueSnackbar('Referral code copied')}>
                        <ReferralButton onClick={(e) => e.stopPropagation()}><Image src={ContentCopyIcon} alt='copy' /> <Typography variant='p'>{referralCode}</Typography></ReferralButton>
                      </CopyToClipboard>
                    </Box>
                  </Box>
                  :
                  <Box display='flex' justifyContent='center' alignItems='center' height='100%'>
                    {/* //   <GenerateReferralButton onClick={() => getReferralCode()}><Typography variant='p_sm'>Generate Referral Code</Typography></GenerateReferralButton> */}
                    <Typography variant='p_sm' color='#cacaca' width='145px' lineHeight={1.2}>You are not eligible for referral link yet! Please use Clone Markets app and/or Clone Liquidity app first.</Typography>
                  </Box>
                }
              </Box>
          }
        </GenerateReferralBorderBox>
      </Stack>
      {!publicKey && <>
        {isMobileOnSize ? <BlackDefault /> : <OpaqueDefault />}
        <Box position='absolute' top='20px' marginY='55px' left="0px" right="0px" marginX='auto'>
          <Box display='flex' justifyContent='center'>
            <ConnectWallet onClick={() => setOpen(true)}><Typography variant='p_xlg'>Connect Wallet</Typography></ConnectWallet>
          </Box>
        </Box>
      </>}
      {showPromoteDialog && <PromoteDialog onClose={() => setShowPromoteDialog(false)} />}
    </Wrapper>
  )

}

const Wrapper = styled(Box)`
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin-top: 16px;
  margin-bottom: 28px;
  padding: 12px 28px;
`
const StatusValue = styled(Box)`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 14px;
  margin-top: 18px;
`
const BorderBox = styled(Box)`
  border-radius: 10px;
  border: solid 1px rgba(255, 255, 255, 0.1);
  padding-top: 8px;
  padding-bottom: 25px;
`
const GenerateReferralBorderBox = styled(BorderBox)`
  padding: 0px;
  background-color: #000;
  &.hover {
    background-color: #000;
    border-style: solid;
    border-width: 1px;
    border-image-source: linear-gradient(to bottom, #fbdc5f, #3dddff);
    border-image-slice: 1;
    background-image: linear-gradient(to bottom, #000, #000), linear-gradient(to bottom, #fbdc5f, #3dddff);
    background-origin: border-box;
    background-clip: content-box, border-box;
  }
`
const PromoteBox = styled(Box)`
  position: absolute;
  bottom: 0;
  right: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 110px;
  height: 24px;
  cursor: pointer;
  border-top-left-radius: 10px;
  border-bottom-right-radius: 8px;
  background-color: rgba(255, 255, 255, 0.07);
`
const ReferralBox = styled(PromoteBox)`
  width: 140px;
`
const PythBox = styled(Box)`
  position: absolute;
  bottom: 0;
  right: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 38px;
  height: 37px;
  color: #e6dafe;
  border-top-left-radius: 10px;
  border-bottom-right-radius: 8px;
  background-color: rgba(255, 255, 255, 0.07);
`
const ColoredText = styled('div')`
  text-shadow: 0 0 5px rgba(252, 220, 95, 0.42);
  background-image: linear-gradient(to right, #fbdc5f 45%, #3dddff 100%);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  margin-bottom: 3px;
`
const ConnectWallet = styled(Button)`
  width: 236px;
  height: 52px;
  object-fit: contain;
  border-radius: 10px;
  border: solid 1px ${(props) => props.theme.basis.melrose};
  background-color: #000;
  color: #fff;
  &:hover {
    background-color: #000;
    border-color: ${(props) => props.theme.basis.lightSlateBlue}};
  }
`
const ReferralButton = styled(Button)`
  width: 87px;
  height: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 2px;
  border-radius: 5px;
  background-color: #1c1c1c;
  color: #fff;
  padding: 0;
  &:hover {
    background-color: #1c1c1c;
    border-style: solid;
    border-width: 1px;
    border-image-source: linear-gradient(to bottom, #fbdc5f, #3dddff);
    border-image-slice: 1;
    background-image: linear-gradient(to bottom, #1c1c1c, #1c1c1c), linear-gradient(to bottom, #fbdc5f, #3dddff);
    background-origin: border-box;
    background-clip: content-box, border-box;
  }
`
const GenerateReferralButton = styled(Button)`
  width: 130px;
  height: 30px;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 5px;
  background-color: #1c1c1c;
  color: #fff;
  padding: 0;
  &:hover {
    background-color: #1c1c1c;
    border-style: solid;
    border-width: 1px;
    border-image-source: linear-gradient(to bottom, #a58e35, #1f6e7f);
    border-image-slice: 1;
    background-image: linear-gradient(to bottom, #1c1c1c, #1c1c1c), linear-gradient(to bottom, #a58e35, #1f6e7f);
    background-origin: border-box;
    background-clip: content-box, border-box;
  }
`

export default withSuspense(MyPointStatus, <LoadingProgress />)