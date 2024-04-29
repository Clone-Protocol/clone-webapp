import { Box, Button, CircularProgress, Stack, Theme, Typography, useMediaQuery } from '@mui/material'
import { styled } from '@mui/material/styles'
import Image from 'next/image'
import LogosClone from 'public/images/staking/logos-clone-mini.svg'
import { useWallet } from '@solana/wallet-adapter-react'
import { useState } from 'react'
import { CommonTab, StyledTabs } from '~/components/Staking/StyledStakingTab'
import PairInput from '~/components/Staking/PairInput'
import { Controller, useForm } from 'react-hook-form'
import { useEditCollateralQuery } from '~/features/Liquidity/comet/EditCollateral.query'
import { useWalletDialog } from '~/hooks/useWalletDialog'

const Stake = () => {
  const isMobileOnSize = useMediaQuery((theme: Theme) => theme.breakpoints.down('md'))
  const { publicKey } = useWallet()
  const [tab, setTab] = useState(0) // 0 : deposit , 1: withdraw
  const [maxWithdrawable, setMaxWithdrawable] = useState(0)
  const [loading, setLoading] = useState(false)
  const { setOpen } = useWalletDialog()

  //@TODO: need to change
  const { data: collData, refetch } = useEditCollateralQuery({
    userPubKey: publicKey,
    refetchOnMount: "always",
    enabled: publicKey != null
  })

  const handleChangeTab = (event: React.SyntheticEvent, newValue: number) => {
    setTab(newValue)
  }

  const {
    handleSubmit,
    control,
    formState: { errors },
    watch,
    setValue,
    trigger
  } = useForm({
    mode: 'onChange',
    defaultValues: {
      stakeAmt: NaN,
    }
  })

  const onConfirm = async () => {
    try {
      setLoading(true)
      // const data = await mutateAsync(
      //   {
      //     quantity: isBuy ? amountOnusd : amountOnasset,
      //     quantityIsCollateral: isBuy,
      //     quantityIsInput: true,
      //     poolIndex: assetIndex,
      //     slippage: slippage / 100,
      //     estimatedSwapResult,
      //   }
      // )

      // if (data.result) {
      //   console.log('data', data)
      //   initData()
      // }
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const invalidMsg = () => {
    // if (isBuy && (amountOnusd == 0 || isNaN(amountOnusd) || !amountOnusd)) {
    //   return 'Deposit'
    // } else if (!isBuy && (amountOnusd == 0 || isNaN(amountOnusd) || !amountOnusd)) {
    //   return 'Withdraw'
    // } else if (isBuy && amountOnusd > myBalance?.onusdVal!) {
    //   return `Insufficient CLN`
    // } else if (!isBuy && amountOnasset > myBalance?.onassetVal!) {
    //   return `Exceeded staked balance`
    // } else {
    //   return ''
    // }
    return ''
  }

  const isValid = invalidMsg() === ''

  return (
    <Wrapper width={isMobileOnSize ? '100%' : '299px'}>
      <Box padding="20px 25px 20px 20px">
        <StyledTabs value={tab} onChange={handleChangeTab}>
          <CommonTab value={0} label="Deposit" />
          <CommonTab value={1} label="Withdraw" />
        </StyledTabs>
      </Box>
      <Divider />
      <StakeBox width={isMobileOnSize ? '100%' : '225px'}>
        <Box mb='10px'><Typography variant='p_lg' color='#8988a3'>Your staked CLN</Typography></Box>
        {publicKey ?
          <Typography variant='h3' fontWeight={500} color='#fff'>15,000.34</Typography>
          :
          <Typography variant='h3' fontWeight={500} color='#8988a3'>-</Typography>
        }
      </StakeBox>
      <Divider />

      <Box padding='20px'>
        {collData &&
          <Controller
            name="stakeAmt"
            control={control}
            rules={{
              validate(value) {
                if (!value || value <= 0) {
                  return ''
                } else if (tab === 0 && value > collData.balance) {
                  return 'The collateral amount cannot exceed the balance.'
                } else if (tab === 1 && collData.hasCometPositions && value >= maxWithdrawable) {
                  return 'Cannot withdraw the maximum amount.'
                } else if (tab === 1 && !collData.hasCometPositions && value > maxWithdrawable) {
                  return 'Cannot withdraw more than maximum amount.'
                }
              }
            }}
            render={({ field }) => (
              <PairInput
                tickerIcon={LogosClone}
                ticker={'CLN'}
                value={field.value}
                title={tab === 0 ? 'Deposit' : 'Withdraw'}
                balance={tab === 0 ? collData.balance : maxWithdrawable}
                max={maxWithdrawable}
                onChange={(event: React.FormEvent<HTMLInputElement>) => {
                  const collAmt = parseFloat(event.currentTarget.value)
                  field.onChange(collAmt)
                }}
                onMax={(value: number) => {
                  field.onChange(value)
                }}
              />
            )}
          />
        }

        <Box mt='15px' mb='5px'>
          {!publicKey ? <ConnectButton onClick={() => setOpen(true)}>
            <Typography variant='h4'>Connect Wallet</Typography>
          </ConnectButton> :
            isValid ? <ActionButton onClick={handleSubmit(onConfirm)} disabled={loading} sx={loading ? { border: '1px solid #c4b5fd' } : {}}>
              {!loading ?
                <Typography variant='p_lg'>{tab === 0 ? 'Deposit' : 'Withdraw'}</Typography>
                :
                <Stack direction='row' alignItems='center' gap={2}>
                  <CircularProgress sx={{ color: '#c4b5fd' }} size={15} thickness={4} />
                  <Typography variant='p_lg' color='#fff'>{tab === 0 ? 'Depositing' : 'Withdrawing'}</Typography>
                </Stack>}
            </ActionButton> :
              <DisableButton disabled={true}>
                <Typography variant='p_lg'>{invalidMsg()}</Typography>
              </DisableButton>
          }
        </Box>
      </Box>
    </Wrapper>
  )
}

const Wrapper = styled(Box)`
  display: flex;
  flex-direction: column;
  justify-content: center;
  border-radius: 10px;
  background: ${(props) => props.theme.basis.backInBlack};
`
const Divider = styled(Box)`
  width: 100%;
  height: 1px;
  background-color: ${(props) => props.theme.basis.plumFuzz};
`
const StakeBox = styled(Box)`
  height: 100px;
  border-radius: 10px;
  padding: 20px;
`
const ConnectButton = styled(Button)`
  width: 100%;
  height: 52px;
  color: #fff;
  padding: 1px;
  background-color: transparent;
  border-style: solid;
  border-width: 1px;
  border-image-slice: 1;
  background-image: linear-gradient(to bottom, #16141b, #16141b), linear-gradient(97deg, #b5fdf9 0%, #c4b5fd 93%);
  background-origin: border-box;
  background-clip: content-box, border-box;
  border-color: ${(props) => props.theme.basis.lightSlateBlue};
  border-radius: 10px;
  &:hover {
    background-color: transparent;
		border-color: ${(props) => props.theme.basis.lightSlateBlue};
    border-image-source: linear-gradient(97deg, #76a3a1 0%, #8379a6 93%);
    background-image: linear-gradient(to bottom, #16141b, #16141b), linear-gradient(97deg, #76a3a1 0%, #8379a6 93%);
  }
`
const ActionButton = styled(Button)`
  width: 100%;
  height: 42px;
  border-radius: 10px;
  background-image: linear-gradient(108deg, #b5fdf9 2%, #c4b5fd 93%);
  &:hover {
    opacity: 0.9;
  }
  &:disabled {
    opacity: 0.4;
  } 
`
const DisableButton = styled(Button)`
  width: 100%;
  height: 52px;
	color: #fff;
  border-radius: 10px;
	margin-bottom: 10px;
  &:disabled {
    border: solid 1px ${(props) => props.theme.basis.portGore};
    background:  ${(props) => props.theme.basis.backInBlack};
    color: ${(props) => props.theme.basis.textRaven};
  } 
`

export default Stake