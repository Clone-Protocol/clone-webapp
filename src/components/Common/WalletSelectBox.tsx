import React, { useMemo, useState } from 'react';
import { Box, Typography, Stack, Button } from '@mui/material'
import { styled } from '@mui/material/styles'
import { LoadingProgress } from '~/components/Common/Loading'
import { useBalanceQuery } from '~/features/Portfolio/Balance.query'
import { useAnchorWallet, useWallet } from '@solana/wallet-adapter-react'
import { useSnackbar } from 'notistack'
import { useSetAtom } from 'jotai'
import { cloneClient } from '~/features/globalAtom'
import withSuspense from '~/hocs/withSuspense'
import { shortenAddress } from '~/utils/address'
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { getSolInBalance } from '~/utils/address';
import { useClone } from '~/hooks/useClone';
import { ON_USD } from '~/utils/constants';
import { formatLocaleAmount } from '~/utils/numbers';
import { useClickOutside } from '~/hooks/useClickOutside';
import BenefitLevel from '../Staking/BenefitLevel';
import Image from 'next/image';
import ArrowTopIcon from 'public/images/arrow-top-right.svg'
import { LevelInfo } from '~/features/Staking/StakingInfo.query';
import DiscordAuthButton from '../Account/DiscordAuthButton';

const WalletSelectBox = ({ show, levelData, onHide }: { show: boolean, levelData: LevelInfo, onHide: () => void }) => {
  const { enqueueSnackbar } = useSnackbar()
  const { getCloneApp } = useClone()
  const wallet = useAnchorWallet()
  const { publicKey, disconnect } = useWallet()
  const setCloneClient = useSetAtom(cloneClient)
  const [solBalance, setSolBalance] = useState(0)

  const walletRef = useClickOutside(() => {
    if (show) {
      onHide()
    }
  })

  const { data: balance } = useBalanceQuery({
    userPubKey: publicKey,
    refetchOnMount: 'always',
    enabled: publicKey != null
  })

  useMemo(() => {
    const getBalance = async () => {
      if (publicKey && wallet && show) {
        try {
          const program = await getCloneApp(wallet)
          const balance = await getSolInBalance(program, publicKey)
          setSolBalance(balance)
        } catch (e) {
          console.error(e)
        }
      }
    }
    getBalance()
  }, [show, publicKey])

  const handleDisconnect = async () => {
    setCloneClient(null)
    enqueueSnackbar('Wallet disconnected')
    await disconnect()
    onHide()
    // refresh page by force
    await setTimeout(() => {
      location.reload()
    }, 1000)
  }

  return show ? (
    <WalletWrapper ref={walletRef}>
      <Stack direction='row' justifyContent='space-between' alignItems='center' padding='13px'>
        <Box lineHeight={1}>
          <Box><Typography variant='p' fontWeight={600} color='#fff'>{formatLocaleAmount(solBalance)} SOL</Typography></Box>
          {publicKey && (
            <Box><Typography variant='p' color='#c5c7d9'>{shortenAddress(publicKey.toString())}</Typography></Box>
          )}
        </Box>
        <Stack direction='row' spacing={1}>
          <CopyToClipboard text={publicKey!!.toString()}
            onCopy={() => enqueueSnackbar('Wallet address copied')}>
            <PopupButton><Typography variant='p_sm'>Copy</Typography></PopupButton>
          </CopyToClipboard>
          <PopupButton><Typography variant='p_sm' onClick={handleDisconnect}>Disconnect</Typography></PopupButton>
        </Stack>
      </Stack>
      <AssetBox>
        <Typography variant='h3'>${formatLocaleAmount(balance?.onusdVal)}</Typography> <Typography variant='p_lg'>{ON_USD}</Typography>
      </AssetBox>
      {publicKey &&
        <Box display='flex' justifyContent='center' my='16px'>
          <DiscordAuthButton />
        </Box>
      }
      <Box padding="18px 25px" mb='5px'>
        <BenefitLevel levelData={levelData} />
        <GoStakingButton><Typography variant='p_sm'>Go to Staking</Typography> <Image src={ArrowTopIcon} alt='arrow' /></GoStakingButton>
      </Box>
    </WalletWrapper>
  ) : <></>
}

export default withSuspense(WalletSelectBox, <LoadingProgress />)

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
const PopupButton = styled(Box)`
	font-size: 10px;
	font-weight: 600;
	color: ${(props) => props.theme.basis.melrose};
	padding: 2px 6px;
	border-radius: 100px;
  background-color: rgba(155, 121, 252, 0.3);
	cursor: pointer;
  &:hover {
		background-color: rgba(155, 121, 252, 0.3);
    box-shadow: 0 0 0 1px ${(props) => props.theme.basis.melrose} inset;
  }
`
const AssetBox = styled(Box)`
	width: 100%;
	height: 61px;
	padding: 17px;
	display: flex;
  align-items: center;
	gap: 10px;
	color: #fff;
	background-color: rgba(255, 255, 255, 0.05);
`
export const GoStakingButton = styled(Button)`
  width: 98px;
  height: 23px;
  display: flex;
  margin: 0 auto;
  margin-top: 25px;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  gap: 3px;
  padding: 5px 7px;
  border-radius: 10px;
  background-color: #201c27;
  color: #8988a3;
  &:hover {
    background-color: #000;
    border-style: solid;
    border-width: 1px;
    border-image-source: linear-gradient(101deg, #b5fdf9 1%, #c4b5fd 93%);
    border-image-slice: 1;
    background-image: linear-gradient(to bottom, #201c27, #201c27), linear-gradient(101deg, #b5fdf9 1%, #c4b5fd 93%);
    background-origin: border-box;
    background-clip: content-box, border-box;
    padding: 0;
  }
`