import { Box, Button, CircularProgress, Stack, Theme, Typography, useMediaQuery } from '@mui/material'
import { styled } from '@mui/material/styles'
import LogosClone from 'public/images/staking/logos-clone-mini.svg'
import { useWallet } from '@solana/wallet-adapter-react'
import { useState } from 'react'
import { CommonTab, StyledTabs } from '~/components/Staking/StyledStakingTab'
import PairInput from '~/components/Staking/PairInput'
import { Controller, useForm } from 'react-hook-form'
import { useWalletDialog } from '~/hooks/useWalletDialog'
import { useStakingInfoQuery } from '~/features/Staking/StakingInfo.query'
import { useStakingMutation } from '~/features/Staking/Staking.mutation'
import { formatLocaleAmount } from '~/utils/numbers'
import { InfoOutlineIcon } from '~/components/Common/SvgIcons'

const Stake = () => {
  const isMobileOnSize = useMediaQuery((theme: Theme) => theme.breakpoints.down('md'))
  const { publicKey } = useWallet()
  const [tab, setTab] = useState(0) // 0 : deposit , 1: withdraw
  const [loading, setLoading] = useState(false)
  const { setOpen } = useWalletDialog()
  const isDeposit = tab === 0

  const { data: stakeData, refetch } = useStakingInfoQuery({
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
    reset
  } = useForm({
    mode: 'onChange',
    defaultValues: {
      stakeAmt: NaN,
    }
  })
  const [stakeAmt] = watch([
    'stakeAmt',
  ])

  const { mutateAsync } = useStakingMutation(publicKey)

  const onConfirm = async () => {
    try {
      setLoading(true)
      const data = await mutateAsync(
        {
          stakeAmount: stakeAmt,
          isDeposit,
        }
      )

      if (data.result) {
        console.log('data', data)
        initData()
      }
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const initData = () => {
    setValue('stakeAmt', NaN)
    reset()
  }

  const invalidMsg = () => {
    if (isDeposit && (stakeAmt == 0 || isNaN(stakeAmt) || !stakeAmt)) {
      return 'Deposit'
    } else if (!isDeposit && (stakeAmt == 0 || isNaN(stakeAmt) || !stakeAmt)) {
      return 'Withdraw'
    } else if (isDeposit && stakeAmt > stakeData?.balance!) {
      return `Insufficient CLN`
    } else if (!isDeposit && stakeAmt > stakeData?.stakedAmt!) {
      return `Exceeded staked balance`
    } else {
      return ''
    }
  }


  const isValid = invalidMsg() === ''

  //@TODO
  const maxWithdrawable = stakeData?.stakedAmt
  const ableToWithdraw = stakeData?.minWithdrawalSlot !== undefined && stakeData?.currentSlot !== undefined && stakeData?.minWithdrawalSlot - stakeData?.currentSlot <= 0

  const cooldownDialog = (tab: number) => {
    if (tab === 0) {
      // Should let user know about withdraw cooldown after staking. Provide estimate.
      let msg = "CLN deposits have a mandatory cooldown period before withdrawals."
      if (stakeData) {
        const cooldownSecs = stakeData.stakingPeriodSlots * stakeData.secsPerSlot
        console.log("COOLDOWN:", cooldownSecs, stakeData.secsPerSlot)
        const cooldownHours = cooldownSecs / 3600
        const cooldownMinutes = cooldownSecs / 60
        msg += ` Current cooldown is ${stakeData.stakingPeriodSlots} slots (~${cooldownHours.toFixed(0)}h ${cooldownMinutes.toFixed(0)}m).`
      }
      return msg
    } else {
      if (stakeData && stakeData.minWithdrawalSlot !== undefined && stakeData.currentSlot !== undefined) {
        const slotDiff = stakeData.minWithdrawalSlot - stakeData.currentSlot;
        if (slotDiff > 0) {
          const estimatedHours = (slotDiff * stakeData.secsPerSlot / 3600)
          const estimatedMinutes = (estimatedHours % 1) * 60
          return `Unable to withdraw CLN. Cooldown period ends in ${slotDiff} slots. (~${estimatedHours.toFixed(0)}h ${estimatedMinutes.toFixed(0)}m)`
        } else {
          return `Cooldown period has ended. You may withdraw your CLN.`
        }
      }
      return `Available CLN may be less than staked due to cooldown period.`
    }
  }


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
          <Typography variant='h3' fontWeight={500} color='#fff'>{formatLocaleAmount(stakeData?.stakedAmt)}</Typography>
          :
          <Typography variant='h3' fontWeight={500} color='#8988a3'>-</Typography>
        }
      </StakeBox>
      <Divider />

      <Box padding='20px'>
        <Controller
          name="stakeAmt"
          control={control}
          rules={{
            validate(value) {
              if (!value || value <= 0) {
                return ''
              } else if (tab === 0 && value > stakeData?.balance!) {
                return 'The stake amount cannot exceed the balance.'
              } else if (tab === 1 && value >= stakeData?.stakedAmt!) {
                return 'Cannot withdraw the maximum amount.'
              }
            }
          }}
          render={({ field }) => (
            <PairInput
              tickerIcon={LogosClone}
              ticker={'CLN'}
              value={field.value}
              isDeposit={isDeposit}
              title={isDeposit ? 'Deposit' : 'Withdraw'}
              balance={stakeData ? stakeData.balance : 0}
              // balanceDisabled={!isDeposit}
              max={isDeposit ? stakeData?.balance : maxWithdrawable}
              maxDisabled={isDeposit ? (!stakeData || stakeData?.balance === 0) : maxWithdrawable === 0}
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

        <Box mt='15px' mb='5px'>
          {!publicKey ? <ConnectButton onClick={() => setOpen(true)}>
            <Typography variant='h4'>Connect Wallet</Typography>
          </ConnectButton> :
            isValid ? <ActionButton onClick={handleSubmit(onConfirm)} disabled={loading || (tab === 1 && !ableToWithdraw)} sx={loading ? { border: '1px solid #c4b5fd' } : {}}>
              {!loading ?
                <Typography variant='p_lg'>{tab === 0 ? 'Deposit' : 'Withdraw'}</Typography>
                :
                <Stack direction='row' alignItems='center' gap={2}>
                  <CircularProgress sx={{ color: '#c4b5fd' }} size={15} thickness={4} />
                  <Typography variant='p_lg'>{tab === 0 ? 'Depositing' : 'Withdrawing'}</Typography>
                </Stack>}
            </ActionButton> :
              <DisableButton disabled={true}>
                <Typography variant='p_lg'>{invalidMsg()}</Typography>
              </DisableButton>
          }
        </Box>

        {publicKey &&
          <CooldownStack direction='row' mt='15px'>
            <InfoOutlineIcon />
            <Box maxWidth='205px' lineHeight={1}>
              <Typography variant='p'>
                {cooldownDialog(tab)}
              </Typography>
            </Box>
          </CooldownStack>
        }
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
  height: 42px;
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
    opacity: 0.9;
  } 
`
const DisableButton = styled(Button)`
  width: 100%;
  height: 42px;
	color: #fff;
  border-radius: 10px;
  &:disabled {
    border: solid 1px ${(props) => props.theme.basis.portGore};
    background:  ${(props) => props.theme.basis.backInBlack};
    color: ${(props) => props.theme.basis.textRaven};
  } 
`
const CooldownStack = styled(Stack)`
  width: 259px;
  background-color: ${(props) => props.theme.basis.nobleBlack};
  gap: 10px;
  padding: 14px 13px;
  border-radius: 10px;
  color: ${(props) => props.theme.basis.textRaven};
  align-items: center;
`

export default Stake