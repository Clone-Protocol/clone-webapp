import { Box, Typography, Dialog } from '@mui/material'
import { styled } from '@mui/material/styles'
import StarsIcon from 'public/images/stars.svg'
import { CloseButton } from '../Common/CommonButtons'
import { FadeTransition } from '~/components/Common/Dialog'
import Image from 'next/image'
// import RocketPromoteIcon from 'public/images/points-rocket.svg'
// import Image from 'next/image'

const ReferralTextDialog = ({ referralStatus, open, handleClose }: { referralStatus: number, open: boolean, handleClose: () => void }) => {
  // const [addedOut, setAddedOut] = useState('')
  // const close = () => {
  //   setAddedOut('out')
  //   setTimeout(() => {
  //     onClose && onClose()
  //   }, 1000)
  // }

  return (
    // <AnimWrapper className={addedOut}>
    <Dialog open={open} onClose={handleClose} TransitionComponent={FadeTransition}>
      <BoxWrapper sx={{ width: { xs: '100%', md: '400px' }, paddingTop: { xs: '30px', md: '20px' } }}>
        <Image src={StarsIcon} alt='star' />
        <Typography variant='p_lg'>
          {referralStatus === 0 ? 'You are successfully referred!' :
            referralStatus === 1 ? 'Only new users can be referred!' :
              referralStatus === 2 ? 'You have already been referred!' :
                referralStatus === 3 ? 'Invalid referral link' : 'You can’t refer yourself'
          }</Typography>
        <Box sx={{ position: 'absolute', right: '10px', top: '10px' }}>
          <CloseButton handleClose={() => handleClose()} />
        </Box>
      </BoxWrapper>
    </Dialog>
    // </AnimWrapper>
  )
}

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
  height: 101px;
  color: #fff; 
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 12px;
  text-align: center;
  border-radius: 10px;
  background-color: #080018;
  padding: 20px;
  z-index: 99999;
`

export default ReferralTextDialog

