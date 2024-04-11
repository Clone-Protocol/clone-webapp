import { Box, Stack, Button, IconButton, Typography, CircularProgress } from '@mui/material'
import { styled } from '@mui/material/styles'
import React, { useState, useEffect } from 'react'
import PairInput from './PairInput'
import Image from 'next/image'
import oneWaySwapIcon from 'public/images/oneway-swap.svg'
import { useForm, Controller } from 'react-hook-form'
import { useWallet } from '@solana/wallet-adapter-react'
import { useTradingMutation } from '~/features/Wrapper/Trading.mutation'
import { useBalanceQuery } from '~/features/Wrapper/Balance.query'
import { useWalletDialog } from '~/hooks/useWalletDialog'
import { LoadingProgress } from '~/components/Common/Loading'
import withSuspense from '~/hocs/withSuspense'
import { SubmitButton } from '../Common/CommonButtons'
import { AssetTickers, assetMapping } from '~/data/assets'
import DebridgeIcon from 'public/images/sponsors/debridge-ic.svg'
import WormholeIcon from 'public/images/sponsors/wormhole-ic.svg'
import { LearnMoreIcon } from '../Common/SvgIcons'

interface Props {
  assetIndex: number
  onShowSearchAsset: () => void
  onShowWrapBridge: () => void
}

const TradingComp: React.FC<Props> = ({ assetIndex, onShowSearchAsset, onShowWrapBridge }) => {
  const [loading, setLoading] = useState(false)
  const { publicKey } = useWallet()
  const [isWrap, setIsWrap] = useState(true)
  const { setOpen } = useWalletDialog()

  const pairData = assetMapping(assetIndex)

  const { data: myBalance, refetch } = useBalanceQuery({
    userPubKey: publicKey,
    index: assetIndex,
    refetchOnMount: 'always',
    enabled: publicKey != null
  })

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
      amountWrapAsset: NaN,
      amountUnwrapAsset: NaN
    }
  })

  const [amountWrapAsset, amountUnwrapAsset] = watch([
    'amountWrapAsset',
    'amountUnwrapAsset'
  ])

  const initData = () => {
    setValue('amountWrapAsset', NaN)
    setValue('amountUnwrapAsset', NaN)
    refetch()
  }

  const handleChangeWrapType = () => {
    setIsWrap(!isWrap)
    initData()
    refetch()
    trigger()
  }

  useEffect(() => {
    if (assetIndex) {
      initData()
      trigger()
    }
  }, [assetIndex])

  const { mutateAsync } = useTradingMutation(publicKey)

  const calculateTotalAmountByFrom = (newValue: number) => {
    if (isWrap) {
      setValue('amountWrapAsset', newValue)
    } else {
      setValue('amountUnwrapAsset', newValue)
    }
  }

  const onConfirm = async () => {
    try {
      setLoading(true)
      const data = await mutateAsync(
        {
          quantity: isWrap ? amountWrapAsset : amountUnwrapAsset,
          isWrap,
          poolIndex: assetIndex,
        }
      )

      if (data) {
        setLoading(false)
        console.log('data', data)
        initData()
        refetch()
      }
    } catch (err) {
      console.error(err)
      setLoading(false)
    }
  }

  const invalidMsg = () => {
    if (isWrap && (amountWrapAsset == 0 || isNaN(amountWrapAsset) || !amountWrapAsset)) {
      return 'Enter Amount'
    } else if (!isWrap && (amountUnwrapAsset == 0 || isNaN(amountUnwrapAsset) || !amountUnwrapAsset)) {
      return 'Enter Amount'
    } else if (isWrap && amountWrapAsset > myBalance?.underlyingAssetVal!) {
      return `Insufficient ${pairData.wrapTickerSymbol}`
    } else if (!isWrap && amountUnwrapAsset > myBalance?.onassetVal!) {
      return `Insufficient ${pairData.tickerSymbol}`
    } else if (!isWrap && amountUnwrapAsset > myBalance?.maxUnwrappableVal!) {
      return 'Exceeded Max Unwrap Amount'
    } else {
      return ''
    }
  }

  const isValid = invalidMsg() === ''
  const isWormholeAsset = pairData.wrapTickerSymbol.slice(0, 1) === 'w'
  const hasLinkForWrapPortUrl = isWormholeAsset || assetIndex === AssetTickers.doge

  return (
    <>
      <div style={{ width: '100%', height: '100%' }}>
        <Box sx={{ paddingBottom: { xs: '150px', md: '18px' } }}>
          <Box>
            {isWrap ?
              <Box>
                {/* <a href={isWormholeAsset ? pairData.wrapPortUrl : '#'} target='_blank'> */}
                <GetMoreStack direction="row" justifyContent="space-between" alignItems="center" px='20px' onClick={!hasLinkForWrapPortUrl ? onShowWrapBridge : () => window.open(pairData.wrapPortUrl)}>
                  <Box display='flex' flexDirection='column' alignItems='flex-start'>
                    <Box display='flex' gap={1} alignItems='center' mb='4px'>
                      <Typography variant='p_lg' color='#fff'>Get more {pairData.wrapTickerSymbol}</Typography>
                      {hasLinkForWrapPortUrl && <Box color='#66707e' mb='-3px'><LearnMoreIcon /></Box>}
                    </Box>
                    <Typography variant='p' color='#66707e' textAlign='left' whiteSpace='nowrap'>Port over {pairData.tickerSymbol.slice(2).toUpperCase()} as {pairData.wrapTickerSymbol} to Solana</Typography>
                  </Box>
                  <Image src={isWormholeAsset ? WormholeIcon : DebridgeIcon} alt='debridge' />
                </GetMoreStack>
                {/* </a> */}

                <Controller
                  name="amountWrapAsset"
                  control={control}
                  rules={{
                    validate(value) {
                      if (!value || isNaN(value) || value <= 0) {
                        return 'the amount should not empty'
                      } else if (value > myBalance?.underlyingAssetVal!) {
                        return 'The amount cannot exceed the balance.'
                      }
                    }
                  }}
                  render={({ field }) => (
                    <PairInput
                      title="You’re Wrapping"
                      tickerIcon={pairData.tickerIcon}
                      ticker={pairData.wrapTickerSymbol}
                      onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                        const wrapAmt = parseFloat(event.currentTarget.value)
                        field.onChange(event.currentTarget.value)
                        calculateTotalAmountByFrom(wrapAmt)
                      }}
                      onMax={(balance: number) => {
                        field.onChange(balance)
                        calculateTotalAmountByFrom(balance)
                      }}
                      value={field.value}
                      balance={myBalance?.underlyingAssetVal}
                      balanceDisabled={!publicKey}
                      tickerClickable={true}
                      onTickerClick={publicKey ? () => onShowSearchAsset() : () => setOpen(true)}
                      max={myBalance?.underlyingAssetVal}
                    />
                  )}
                />
              </Box>
              :
              <Box>
                <MaxStack direction="row" justifyContent="space-between" alignItems="center" px='20px'>
                  <Typography variant='p_lg' color='#66707e'>Max Unwrappable</Typography>
                  <Typography variant='p_xlg'>{myBalance?.maxUnwrappableVal! >= 0.01 ? myBalance?.maxUnwrappableVal.toFixed(2) : '<0.01'} {pairData.tickerSymbol}</Typography>
                </MaxStack>

                <Controller
                  name="amountUnwrapAsset"
                  control={control}
                  rules={{
                    validate(value) {
                      if (!value || isNaN(value) || value <= 0) {
                        return 'the amount should not empty'
                      } else if (value > myBalance?.onassetVal!) {
                        return 'The amount cannot exceed the balance.'
                      }
                    }
                  }}
                  render={({ field }) => (
                    <PairInput
                      title="You’re Unwrapping"
                      tickerIcon={pairData.tickerIcon}
                      ticker={pairData.tickerSymbol}
                      onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                        const unwrapAmt = parseFloat(event.currentTarget.value)
                        field.onChange(event.currentTarget.value)
                        calculateTotalAmountByFrom(unwrapAmt)
                      }}
                      onMax={(balance: number) => {
                        field.onChange(balance)
                        calculateTotalAmountByFrom(balance)
                      }}
                      value={field.value}
                      balance={myBalance?.onassetVal}
                      balanceDisabled={!publicKey}
                      tickerClickable={false}
                      max={myBalance?.onassetVal}
                    />
                  )}
                />
              </Box>
            }
          </Box>

          <Box height='100%'>
            <SwapButton onClick={handleChangeWrapType}>
              <Image src={oneWaySwapIcon} alt="swap" />
            </SwapButton>

            <PairInput
              title="To Receive"
              tickerIcon={pairData.tickerIcon}
              ticker={isWrap ? pairData.tickerSymbol : pairData.wrapTickerSymbol}
              value={isWrap ? amountWrapAsset : amountUnwrapAsset}
              balanceDisabled={true}
              valueDisabled={true}
              tickerClickable={!isWrap}
              onTickerClick={publicKey ? () => onShowSearchAsset() : () => setOpen(true)}
            />

            <Box my='5px'>
              {!publicKey ? <ConnectButton onClick={() => setOpen(true)}>
                <Typography variant='h4'>Connect Wallet</Typography>
              </ConnectButton> :
                isValid ?
                  <SubmitButton onClick={handleSubmit(onConfirm)} disabled={loading} sx={loading ? { border: '1px solid #c4b5fd' } : {}}>
                    {!loading ?
                      <Typography variant='p_xlg'>{isWrap ? 'Wrap' : 'Unwrap'}</Typography>
                      :
                      <Stack direction='row' alignItems='center' gap={2}>
                        <CircularProgress sx={{ color: '#c4b5fd' }} size={15} thickness={4} />
                        <Typography variant='p_xlg' color='#fff'>{isWrap ? 'Wrap' : 'Unwrap'}</Typography>
                      </Stack>}
                  </SubmitButton>
                  :
                  <DisableButton disabled={true}>
                    <Typography variant='p_xlg'>{invalidMsg()}</Typography>
                  </DisableButton>
              }
            </Box>

          </Box>
        </Box>
      </div>
    </>
  )
}

const GetMoreStack = styled(Stack)`
  width: 100%;
  height: 80px;
  border-radius: 10px;
  border: solid 1px ${(props) => props.theme.basis.slug};
  background-color: rgba(255, 255, 255, 0.05);
  margin-bottom: 30px;
  cursor: pointer;
  &:hover {
    border: solid 1px ${(props) => props.theme.basis.skylight};
  }
`
const MaxStack = styled(Stack)`
  width: 100%;
  height: 66px;
  border-radius: 10px;
  border: solid 1px ${(props) => props.theme.basis.slug};
  background-color: rgba(255, 255, 255, 0.05);
  margin-bottom: 30px;
`
const SwapButton = styled(IconButton)`
  width: 35px;
  height: 35px;
  margin-top: 10px;
  margin-bottom: 6px;
  padding: 8px;
  border-radius: 999px;
  background-color: rgba(255, 255, 255, 0.05);
  cursor: pointer;
  &:hover {
    background-color: rgba(255, 255, 255, 0.05);
    border: solid 1px ${(props) => props.theme.basis.liquidityBlue};
  }
`
const ConnectButton = styled(Button)`
  width: 100%;
  height: 52px;
  color: #fff;
  border: solid 1px #4fe5ff;
  border-radius: 5px;
  margin-top: 10px;
  &:hover {
    background: transparent;
    opacity: 0.6;
  }
`
const DisableButton = styled(Button)`
  width: 100%;
  height: 52px;
	color: #fff;
  border-radius: 5px;
	margin-top: 10px;
  &:disabled {
    border: solid 1px ${(props) => props.theme.basis.shadowGloom};
    background: transparent;
    color: #989898;
  } 
`

export default withSuspense(TradingComp, <Box mt='20px'><LoadingProgress /></Box>)
