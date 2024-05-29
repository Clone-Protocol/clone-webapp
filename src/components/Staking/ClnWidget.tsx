import React from 'react';
import { Box, Typography, Stack } from '@mui/material'
import { styled } from '@mui/material/styles'
import { LoadingProgress } from '~/components/Common/Loading'
import { useWallet } from '@solana/wallet-adapter-react'
import withSuspense from '~/hocs/withSuspense'
import { formatLocaleAmount } from '~/utils/numbers';
import { useClickOutside } from '~/hooks/useClickOutside';
import BenefitLevel from '../Staking/BenefitLevel';
import Image from 'next/image';
import ArrowTopIcon from 'public/images/arrow-top-right.svg'
import { LevelInfo, useStakingInfoQuery } from '~/features/Staking/StakingInfo.query';
import { GoStakingButton } from '../Common/WalletSelectBox';

const ClnWidget = ({ show, levelData, onHide }: { show: boolean, levelData: LevelInfo, onHide: () => void }) => {
  const { publicKey } = useWallet()

  const { data: stakeData } = useStakingInfoQuery({
    userPubKey: publicKey,
    refetchOnMount: "always",
    enabled: publicKey != null
  })

  const walletRef = useClickOutside(() => {
    if (show) {
      onHide()
    }
  })

  return show ? (
    <WalletWrapper ref={walletRef}>
      <Box padding='25px 20px'>
        <Box mb='10px'><Typography variant='p_lg' color='#8988a3'>Your staked CLN</Typography></Box>
        {publicKey ?
          <Typography variant='h3' fontWeight={500} color='#fff'>{formatLocaleAmount(stakeData?.stakedAmt)}</Typography>
          :
          <Typography variant='h3' fontWeight={500} color='#8988a3'>-</Typography>
        }
      </Box>
      <Divider />
      <Box padding="18px 25px" mb='5px'>
        <BenefitLevel levelData={levelData} />
        <GoStakingButton><Typography variant='p_sm'>Go to Staking</Typography> <Image src={ArrowTopIcon} alt='arrow' /></GoStakingButton>
      </Box>
    </WalletWrapper>
  ) : <></>
}

export default withSuspense(ClnWidget, <LoadingProgress />)

const WalletWrapper = styled(Stack)`
	position: absolute;
	top: 70px;
	right: 0px;
	width: 284px;
	background-color: ${(props) => props.theme.basis.cinder};
	border-radius: 10px;
  border: solid 1px ${(props) => props.theme.basis.portGore};
	z-index: 99;
`
const Divider = styled(Box)`
  width: 100%;
  height: 1px;
  background-color: ${(props) => props.theme.basis.plumFuzz};
`
