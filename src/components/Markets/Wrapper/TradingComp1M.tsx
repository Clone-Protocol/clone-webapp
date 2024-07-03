import { Box, Stack, Button, IconButton, Typography, CircularProgress } from '@mui/material'
import { styled } from '@mui/material/styles'
import React, { useState, useEffect } from 'react'
import PairInput from './PairInput'
import Image from 'next/image'
import oneWaySwapIcon from 'public/images/oneway-swap.svg'
import walletIcon from 'public/images/wallet-icon-small.svg'
import { useForm, Controller } from 'react-hook-form'
import { LoadingProgress } from '~/components/Common/Loading'
import withSuspense from '~/hocs/withSuspense'
import { SubmitEvmButton } from '~/components/Common/CommonButtons'
import SelectArrowIcon from 'public/images/keyboard-arrow-left.svg'
import { shortenAddress } from '~/utils/address'
import { assetMapping } from '~/data/assets_evm'
import WalletOptionSelect from './WalletOptionSelect'
import { BaseError, useAccount, useEstimateFeesPerGas, useReadContract, useWaitForTransactionReceipt, useWriteContract } from "wagmi";
import { getPEPE1MContractAddress, getPEPEContractAddress } from '~/wrapper/chains'
import { wrapped1MPEPETokenAbi } from '~/wrapper/contracts/abi/WrappedPepeContract'
import { PEPETokenAbi } from '~/wrapper/contracts/abi/PepeContract'
import { useWalletEvmDialog } from '~/hooks/useWalletEvmDialog'
import { parseGwei } from 'viem'
import { TransactionState, useTransactionState } from '~/hooks/useTransactionState'

interface Props {
  assetIndex: number
  onShowSearchAsset: () => void
}

const SCALE_PEPE = 18
const SCALE_1M = 6

const TradingComp1M: React.FC<Props> = ({ assetIndex, onShowSearchAsset }) => {
  const [isWrap, setIsWrap] = useState(true)
  const { setOpen } = useWalletEvmDialog()
  const [openPopover, setOpenPopover] = useState(false);
  const { isConnected, address, chain } = useAccount();
  const { data: estimateFees } = useEstimateFeesPerGas({
    chainId: chain?.id,
    formatUnits: "gwei",
  })
  // const { data: estimateGas } = useEstimateGas({
  //   chainId: chain?.id,
  // })
  const { setTxState } = useTransactionState()

  const pairData = assetMapping(assetIndex)

  const { data: cBalance, refetch } = useReadContract({
    address: isWrap ? getPEPEContractAddress(chain) : getPEPE1MContractAddress(chain),
    abi: wrapped1MPEPETokenAbi,
    functionName: 'balanceOf',
    account: address,
    args: [address],
    query: {
      enabled: !!address,
    }
  })
  // console.log('m', myBalance)
  const myBalance = cBalance ? Number(cBalance) / 10 ** SCALE_PEPE : 0

  const { data: hashApprove, writeContract: writeContractApprove, isPending: isPendingApprove, error: errorApprove } = useWriteContract()
  const { data: hash, writeContract, isPending: isPendingProcess, error } = useWriteContract()
  // const { data: hash, isPending, writeContracts } = useWriteContracts()
  const { isLoading: isConfirmingApprove, isSuccess: isConfirmedApprove } =
    useWaitForTransactionReceipt({
      hash: hashApprove,
      query: {
        enabled: !!hashApprove,
      }
    });
  const { isLoading: isConfirming, isSuccess: isConfirmed } =
    useWaitForTransactionReceipt({
      hash,
      query: {
        enabled: !!hash,
      }
    });

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

  // const handleWalletClick = async () => {
  //   try {
  //     const arbitrumChainId = chains[0].id
  //     if (chain?.id !== arbitrumChainId) {
  //       console.log('dd', arbitrumChainId)
  //       await switchChain({ chainId: arbitrumChainId })
  //     }
  //     console.log('connector', connectors[0])
  //     await connect({ connector: connectors[0] })

  //     console.log('c', chains[0])
  //   } catch (error) {
  //     console.error('e', error)
  //   }
  // }

  const handleWalletOptionClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setOpenPopover(!openPopover)
  }
  const handleWalletOptionClose = () => {
    setOpenPopover(false)
  };

  const [amountWrapAsset, amountUnwrapAsset] = watch([
    'amountWrapAsset',
    'amountUnwrapAsset'
  ])

  const initData = () => {
    setValue('amountWrapAsset', NaN)
    setValue('amountUnwrapAsset', NaN)
    setOpenPopover(false)
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

  const calculateTotalAmountByFrom = (newValue: number) => {
    if (isWrap) {
      setValue('amountWrapAsset', newValue)
    } else {
      setValue('amountUnwrapAsset', newValue)
    }
  }

  //when approve, call mint process
  useEffect(() => {
    if (isConfirmedApprove && isWrap && estimateFees && isValid) {
      console.log('call mint or burn process')
      console.log('estimateFees', estimateFees)
      writeContract({
        address: getPEPE1MContractAddress(chain),
        abi: wrapped1MPEPETokenAbi,
        functionName: 'mint',
        args: [BigInt(amountWrapAsset * (10 ** SCALE_PEPE) / (10 ** SCALE_1M))],
        maxFeePerGas: estimateFees?.maxFeePerGas,
        maxPriorityFeePerGas: estimateFees?.maxPriorityFeePerGas,
        gas: parseGwei('0.001'), // Error: Execution reverted for an unknown reason when using with estimateGas
      })
      setTxState({ state: TransactionState.SUCCESS, txHash: '', networkName: chain?.name, networkScanUrl: chain?.blockExplorers?.default.url })
    }
  }, [isConfirmedApprove])

  // for transaction snackbar
  useEffect(() => {
    if (isConfirmingApprove || isConfirming) {
      setTxState({ state: TransactionState.PENDING, txHash: '', networkName: chain?.name, networkScanUrl: chain?.blockExplorers?.default.url })
    }
  }, [isConfirmingApprove, isConfirming])

  useEffect(() => {
    if (errorApprove || error) {
      setTxState({ state: TransactionState.FAIL, txHash: '', networkName: chain?.name, networkScanUrl: chain?.blockExplorers?.default.url })
    }
  }, [errorApprove, error])

  useEffect(() => {
    if (isConfirmed) {
      setTxState({ state: TransactionState.SUCCESS, txHash: hash, networkName: chain?.name, networkScanUrl: chain?.blockExplorers?.default.url })
      initData()
      refetch()
    }
  }, [isConfirmed])



  const onConfirm = async () => {
    try {
      if (isWrap) {
        await writeContractApprove({
          address: getPEPEContractAddress(chain),
          abi: PEPETokenAbi,
          functionName: 'approve',
          args: [getPEPE1MContractAddress(chain), BigInt(amountWrapAsset * 10 ** SCALE_PEPE)],
        })
        //after confirmed this, call mint above
      } else {
        // console.log('estimateGas', estimateGas)
        await writeContract({
          chainId: chain?.id,
          address: getPEPE1MContractAddress(chain),
          abi: wrapped1MPEPETokenAbi,
          functionName: 'burn',
          args: [BigInt(amountUnwrapAsset * (10 ** SCALE_PEPE))],
          maxFeePerGas: estimateFees?.maxFeePerGas,
          maxPriorityFeePerGas: estimateFees?.maxPriorityFeePerGas,
          gas: parseGwei('0.001'), // Error: Execution reverted for an unknown reason when using with estimateGas
        })
      }

      //@TODO: using with writeContracts - https://wagmi.sh/core/api/actions/writeContracts#writecontracts
      // await writeContracts({
      //   contracts: [
      //     {
      //       address: getPEPEContractAddress(chain),
      //       abi: PEPETokenAbi,
      //       functionName: 'approve',
      //       args: [getPEPE1MContractAddress(chain), isWrap ? BigInt(amountWrapAsset) : BigInt(amountUnwrapAsset)]
      //     },
      //     {
      //       address: getPEPE1MContractAddress(chain),
      //       abi: wrapped1MPEPETokenAbi,
      //       functionName: isWrap ? 'mint' : 'burn',
      //       args: [isWrap ? BigInt(amountWrapAsset) : BigInt(amountUnwrapAsset)],
      //     }
      //   ]
      // })

    } catch (err) {
      console.error(err)
      setTxState({ state: TransactionState.FAIL, txHash: '', networkName: chain?.name, networkScanUrl: chain?.blockExplorers?.default.url })
    }
  }

  const invalidMsg = () => {
    if (isWrap && (amountWrapAsset == 0 || isNaN(amountWrapAsset) || !amountWrapAsset)) {
      return 'Enter Amount'
    } else if (!isWrap && (amountUnwrapAsset == 0 || isNaN(amountUnwrapAsset) || !amountUnwrapAsset)) {
      return 'Enter Amount'
    } else if (isWrap && amountWrapAsset > myBalance) {
      return `Insufficient ${pairData.fromTickerSymbol}`
    } else if (!isWrap && amountUnwrapAsset > myBalance) {
      return `Insufficient ${pairData.toTickerSymbol}`
    } else {
      return ''
    }
  }

  const isValid = invalidMsg() === ''
  const isPending = isPendingApprove || isPendingProcess || isConfirming || isConfirmingApprove

  return (
    <>
      <div style={{ width: '100%', height: '100%' }}>
        <Box sx={{ paddingBottom: { xs: '150px', md: '3px' } }}>
          <Box>
            <Box>
              <Box display='flex' justifyContent='flex-start'>
                <Box><Typography variant='p_lg' color='#66707e'>Token</Typography></Box>
              </Box>
              <SelectPoolBox onClick={() => onShowSearchAsset()}>
                <Stack direction='row' gap={1}>
                  <Image src={pairData.tickerIcon} width={24} height={24} alt={pairData.tickerName} />
                  <Typography variant='p_xlg'>{pairData.tickerName}</Typography>
                </Stack>
                <Image src={SelectArrowIcon} alt='select' />
              </SelectPoolBox>

              <Box display='flex' justifyContent='flex-start'>
                <Box><Typography variant='p_lg' color='#66707e'>Connect Wallet</Typography></Box>
              </Box>
              <Stack direction='row' alignItems='center' gap='10px' mb='20px'>
                <Box>
                  {
                    !isConnected ?
                      <ConnectWalletButton
                        onClick={() => setOpen(true)}
                      >
                        <Typography variant='p_lg'>Connect Wallet</Typography>
                      </ConnectWalletButton>
                      :
                      <Box position='relative'>
                        <ConnectedButton onClick={handleWalletOptionClick} startIcon={address ? <Image src={walletIcon} alt="wallet" /> : <></>}>
                          <Typography variant='p'>{address && shortenAddress(address.toString())}</Typography>
                          <Box ml='10px' mt='5px'><Image src={SelectArrowIcon} alt='select' /></Box>
                        </ConnectedButton>
                        {openPopover &&
                          <PopoverBox>
                            <WalletOptionSelect address={address} onClose={handleWalletOptionClose} />
                          </PopoverBox>
                        }
                      </Box>
                  }
                </Box>
                <NetworkBox><Typography variant='p'>Arbitrum Network</Typography></NetworkBox>
              </Stack>
            </Box>

            {isWrap ?
              <Box>
                <Controller
                  name="amountWrapAsset"
                  control={control}
                  rules={{
                    validate(value) {
                      if (!value || isNaN(value) || value <= 0) {
                        return 'the amount should not empty'
                      } else if (value > myBalance) {
                        return 'The amount cannot exceed the balance.'
                      }
                    }
                  }}
                  render={({ field }) => (
                    <PairInput
                      title="You’re Wrapping"
                      tickerIcon={pairData.tickerIcon}
                      ticker={pairData.fromTickerSymbol}
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
                      balance={myBalance}
                      balanceDisabled={!isConnected}
                      tickerClickable={false}
                      max={myBalance}
                    />
                  )}
                />
              </Box>
              :
              <Box>
                <Controller
                  name="amountUnwrapAsset"
                  control={control}
                  rules={{
                    validate(value) {
                      if (!value || isNaN(value) || value <= 0) {
                        return 'the amount should not empty'
                      } else if (value > myBalance) {
                        return 'The amount cannot exceed the balance.'
                      }
                    }
                  }}
                  render={({ field }) => (
                    <PairInput
                      title="You’re Unwrapping"
                      tickerIcon={pairData.tickerIcon}
                      ticker={pairData.toTickerSymbol}
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
                      balance={myBalance}
                      balanceDisabled={!isConnected}
                      tickerClickable={false}
                      max={myBalance}
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
              ticker={isWrap ? pairData.toTickerSymbol : pairData.fromTickerSymbol}
              value={isWrap ? amountWrapAsset / 10 ** SCALE_1M : amountUnwrapAsset * 10 ** SCALE_1M}
              balanceDisabled={true}
              valueDisabled={true}
              tickerClickable={!isWrap}
              onTickerClick={isConnected ? () => onShowSearchAsset() : () => setOpen(true)}
            />

            <Box mt='5px'>
              {!isConnected ? <ConnectButton onClick={() => setOpen(true)}>
                <Typography variant='h4'>Connect Wallet</Typography>
              </ConnectButton> :
                isValid ?
                  <SubmitEvmButton onClick={handleSubmit(onConfirm)} disabled={isPending} sx={isPending ? { backgroundColor: '#171717' } : {}}>
                    {!isPending ?
                      <Typography variant='p_xlg'>{isWrap ? 'Wrap' : 'Unwrap'}</Typography>
                      :
                      <Stack direction='row' alignItems='center' gap={2}>
                        <CircularProgress sx={{ color: '#6cffff' }} size={15} thickness={4} />
                        <Typography variant='p_xlg' color='#989898'>{isWrap ? 'Wrap' : 'Unwrap'}</Typography>
                      </Stack>}
                  </SubmitEvmButton>
                  :
                  <DisableButton disabled={true}>
                    <Typography variant='p_xlg'>{invalidMsg()}</Typography>
                  </DisableButton>
              }
            </Box>
            <Box my='10px'>
              {/* {(isConfirmingApprove || isConfirming) && <><Typography variant='p'>Waiting for confirmation...</Typography></>}
              {(isConfirmedApprove || isConfirmed) && <><Typography variant='p'>Transaction confirmed.</Typography></>} */}
              {errorApprove && (
                <div><Typography variant='p'>Error: {(errorApprove as BaseError).shortMessage || errorApprove.message}</Typography></div>
              )}
              {error && (
                <div><Typography variant='p'>Error: {(error as BaseError).shortMessage || error.message}</Typography></div>
              )}
            </Box>

          </Box>
        </Box>
      </div>
    </>
  )
}

const SelectPoolBox = styled(Box)`
	display: flex;
	justify-content: space-between;
	align-items: center;
  width: 200px;
	height: 30px;
	background-color: rgba(65, 75, 102, 0.5);
	border-radius: 100px;
	cursor: pointer;
	padding: 5px;
  margin-top: 5px;
  margin-bottom: 20px;
	&:hover {
		box-shadow: 0 0 0 1px ${(props) => props.theme.basis.liquidityBlue} inset;
		background-color: rgba(37, 141, 237, 0.23);
  }
`
const PopoverBox = styled(Box)`
  position: absolute;
  top: 50px;
  right: 0;
  z-index: 999;
`
const ConnectWalletButton = styled(Button)`
	width: 134px;
	height: 42px;
	padding: 9px;
	border: solid 1px #fff;
	border-radius: 5px;
	color: #fff;
  &:hover {
		background: transparent;
		opacity: 0.6;
  }
`
const ConnectedButton = styled(Button)`
	width: 167px;
	height: 42px;
	padding: 9px;
	border-radius: 5px;
	color: #fff;
	border: solid 1px #4f4f4f;
  background: transparent;
	&:hover {
		background: transparent;
    border: solid 1px #fff;
  }
`
const NetworkBox = styled(Box)`
  display: flex;
  align-items: center;
  height: 28px;
  flex-grow: 0;
  padding: 6px 7px 6px 9px;
  border-radius: 5px;
  background-color: rgba(65, 78, 102, 0.5);
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
  border: solid 1px #fff;
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
    border: solid 1px #4f4f4f;
    background: transparent;
    color: #989898;
  } 
`

export default withSuspense(TradingComp1M, <Box mt='20px'><LoadingProgress /></Box>)
