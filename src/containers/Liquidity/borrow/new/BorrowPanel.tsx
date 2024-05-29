import { Box, Stack, FormHelperText, Typography } from '@mui/material'
import React, { useState, useEffect, useCallback } from 'react'
import { styled } from '@mui/material/styles'
import Image from 'next/image'
import PairInput from '~/components/Liquidity/borrow/PairInput'
import RatioSlider from '~/components/Liquidity/borrow/RatioSlider'
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import { useWallet } from '@solana/wallet-adapter-react'
import { useBalanceQuery } from '~/features/Liquidity/borrow/Balance.query'
import { ASSETS } from '~/data/assets'
import { PairData, DetailInfo } from '~/features/Liquidity/borrow/BorrowPosition.query'
import { useBorrowMutation } from '~/features/Liquidity/borrow/Borrow.mutation'
import { useForm, Controller } from 'react-hook-form'
import SelectArrowIcon from 'public/images/liquidity/keyboard-arrow-left.svg'
import { SubmitButton } from '~/components/Common/CommonButtons'
import { Collateral as StableCollateral, collateralMapping } from '~/data/assets'
import dynamic from 'next/dynamic'
import InfoTooltip from '~/components/Common/InfoTooltip'
import { TooltipTexts } from '~/data/tooltipTexts'
import { formatNumberToString } from '~/utils/numbers'
import DisabledRatioSlider from '~/components/Liquidity/borrow/DisabledRatioSlider'
import { PoolStatusButton, showPoolStatus } from '~/components/Common/PoolStatus'
import { LoadingButton } from '~/components/Common/Loading'
import { useRouter } from 'next/navigation'
import { RootLiquidityDir } from '~/utils/constants'

const RISK_RATIO_VAL = 170

const BorrowPanel = ({ assetIndex, borrowDetail, onChooseAssetIndex }: { assetIndex: number, borrowDetail: DetailInfo, onChooseAssetIndex: (index: number) => void }) => {
  const { publicKey } = useWallet()
  const router = useRouter()
  const onUSDInfo = collateralMapping(StableCollateral.onUSD)
  const fromPair: PairData = {
    tickerIcon: onUSDInfo.collateralIcon,
    tickerName: onUSDInfo.collateralName,
    tickerSymbol: onUSDInfo.collateralSymbol,
  }
  const ChooseAssetDialog = dynamic(() => import('~/containers/Liquidity/borrow/new/Dialogs/ChooseAssetDialog'))

  const { data: usdiBalance, refetch } = useBalanceQuery({
    userPubKey: publicKey,
    refetchOnMount: "always",
    enabled: publicKey != null
  })

  const {
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
    watch,
    setValue
  } = useForm({
    mode: 'onChange',
    defaultValues: {
      collAmount: NaN,
      borrowAmount: NaN,
    }
  })

  const [collAmount, borrowAmount] = watch([
    'collAmount',
    'borrowAmount',
  ])

  const [collRatio, setCollRatio] = useState(100)
  const [openChooseAsset, setOpenChooseAsset] = useState(false)

  const initData = () => {
    setValue('collAmount', NaN)
    setValue('borrowAmount', NaN)
  }

  const calculateBorrowAmount = (inputCollAmount: number, inputCollRatio: number) => {
    const assetOraclePrice = borrowDetail ? borrowDetail.oPrice : 1
    const borrowAmount = (inputCollAmount * borrowDetail.collateralizationRatio * 100) / (assetOraclePrice * inputCollRatio)
    setValue('borrowAmount', borrowAmount)
  }

  const calculateCollRatio = (inputBorrowAmount: number) => {
    const assetOraclePrice = borrowDetail ? borrowDetail.oPrice : 1
    setCollRatio((collAmount * borrowDetail.collateralizationRatio * 100) / (inputBorrowAmount * assetOraclePrice))
  }

  useEffect(() => {
    if (borrowDetail) {
      console.log('borrowDetail', borrowDetail)
      setCollRatio(borrowDetail.minCollateralRatio + 30)
    }
  }, [borrowDetail])

  const { mutateAsync } = useBorrowMutation(publicKey)

  // const handleChangeAsset = useCallback((data: AssetType) => {
  //   if (data) {
  //     const index = ASSETS.findIndex((elem) => elem.tickerSymbol === data.tickerSymbol)
  //     setAssetIndex(index)
  //     setBorrowAsset(ASSETS[index])
  //     initData()
  //   }
  // }, [assetIndex, borrowAsset])

  const handleChooseAsset = (assetId: number) => {
    onChooseAssetIndex(assetId)
    setOpenChooseAsset(false)

    initData()
    refetch()
  }

  const handleChangeCollRatio = useCallback((event: React.ChangeEvent<HTMLInputElement>, newValue: number | number[]) => {
    if (typeof newValue === 'number' && borrowDetail) {
      if (!isNaN(newValue)) {
        setCollRatio(newValue)
        calculateBorrowAmount(collAmount, newValue)
      } else {
        setCollRatio(0)
        calculateBorrowAmount(collAmount, 0)
      }

    }
  }, [collAmount, collRatio])

  const onBorrow = async () => {
    try {
      const data = await mutateAsync(
        {
          onassetIndex: assetIndex,
          onassetAmount: borrowAmount,
          collateralAmount: collAmount,
        }
      )

      if (data) {
        console.log('data', data)
        initData()
        router.replace(`${RootLiquidityDir}/borrow/myliquidity`)
      }
    } catch (err) {
      console.error(err)
    }
  }

  const isValid = Object.keys(errors).length === 0 && !isSubmitting && borrowAmount > 0 && (borrowDetail && borrowDetail.minCollateralRatio <= collRatio)
  const hasRiskRatio = collRatio < RISK_RATIO_VAL
  const hasLowerMin = collRatio < borrowDetail?.minCollateralRatio;

  return usdiBalance && borrowDetail ? (
    <>
      <Box>
        <Box>
          <Typography variant='p_lg'>clAsset to Borrow</Typography>
          <InfoTooltip title={TooltipTexts.onAssetToBorrow} color='#8988a3' />
        </Box>
        <SelectPoolBox onClick={() => setOpenChooseAsset(true)}>
          <Stack direction='row' gap={1}>
            <Image src={ASSETS[assetIndex].tickerIcon} width={20} height={20} alt={ASSETS[assetIndex].tickerSymbol} />
            <Typography variant='p_lg'>{ASSETS[assetIndex].tickerSymbol}</Typography>
          </Stack>
          <Image src={SelectArrowIcon} alt='select' />
        </SelectPoolBox>
        <Box>
          <Box mb='5px'>
            <Typography variant='p_lg'>Collateral Amount</Typography>
            <InfoTooltip title={TooltipTexts.collateralAmount} color='#8988a3' />
          </Box>
          <Controller
            name="collAmount"
            control={control}
            rules={{
              validate(value) {
                if (!value || value <= 0) {
                  return ''
                } else if (value > usdiBalance?.balanceVal) {
                  return 'The collateral amount cannot exceed the balance.'
                }
              }
            }}
            render={({ field }) => (
              <PairInput
                tickerIcon={fromPair.tickerIcon}
                tickerSymbol={fromPair.tickerSymbol}
                value={parseFloat(formatNumberToString(field.value, 4))}
                headerTitle="Balance"
                headerValue={usdiBalance?.balanceVal}
                onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                  const collAmt = parseFloat(event.currentTarget.value)
                  field.onChange(collAmt)
                  calculateBorrowAmount(collAmt, collRatio)
                }}
                onMax={(balance: number) => {
                  field.onChange(balance)
                  calculateBorrowAmount(balance, collRatio)
                }}
              />
            )}
          />
          {/* <FormHelperText error={!!errors.collAmount?.message}>{errors.collAmount?.message}</FormHelperText> */}
        </Box>

        <Box mt='25px' mb='5px'>
          <Typography variant='p_lg'>Collateral Ratio</Typography>
          <InfoTooltip title={TooltipTexts.borrowedCollRatio} color='#8988a3' />
        </Box>
        <Box>
          {!isNaN(collAmount) && collAmount > 0 ?
            <RatioSlider min={borrowDetail?.minCollateralRatio} value={collRatio} hasRiskRatio={hasRiskRatio} hasLowerMin={hasLowerMin} showChangeRatio hideValueBox onChange={handleChangeCollRatio} />
            :
            <DisabledRatioSlider />
          }
        </Box>

        <Box mb='10px'>
          <Box mt='25px' mb='5px'>
            <Typography variant='p_lg'>Borrow Amount</Typography>
            <InfoTooltip title={TooltipTexts.borrowAmount} color='#8988a3' />
          </Box>
          <Box>
            <Controller
              name="borrowAmount"
              control={control}
              rules={{
                validate(value) {
                  if (!value || value <= 0) {
                    return ''
                  }
                }
              }}
              render={({ field }) => (
                <PairInput
                  tickerIcon={ASSETS[assetIndex].tickerIcon}
                  tickerSymbol={ASSETS[assetIndex].tickerSymbol}
                  value={parseFloat(formatNumberToString(field.value, 5))}
                  dollarPrice={field.value * borrowDetail.oPrice}
                  disabledInput={true}
                  onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                    const borrowAmt = parseFloat(event.currentTarget.value)
                    field.onChange(borrowAmt)
                    calculateCollRatio(borrowAmt)
                  }}
                />
              )}
            />
            <FormHelperText error={!!errors.borrowAmount?.message}>{errors.borrowAmount?.message}</FormHelperText>
          </Box>
        </Box>

        {hasRiskRatio && !hasLowerMin &&
          <WarningStack direction='row'>
            <WarningAmberIcon sx={{ color: '#ff0084', width: '15px' }} />
            <Typography variant='p' ml='8px'>Due to low collateral ratio, this borrow position will have high possibility to become subject to liquidation.</Typography>
          </WarningStack>
        }

        {showPoolStatus(borrowDetail.status) ?
          <Box display='flex' justifyContent='center'>
            <PoolStatusButton status={borrowDetail.status} />
          </Box>
          :
          isSubmitting ?
            <Box display='flex' justifyContent='center' my='15px'>
              <LoadingButton width='100%' height='52px' />
            </Box>
            :
            <SubmitButton onClick={handleSubmit(onBorrow)} disabled={!isValid} hasRisk={hasRiskRatio}>
              <Typography variant='p_lg'>{(isNaN(collAmount) || collAmount === 0) ? 'Enter Collateral Amount' : hasLowerMin ? 'Minimum Collateral Ratio is 150%' : collAmount > usdiBalance?.balanceVal ? 'Exceeded Wallet Balance' : hasRiskRatio ? 'Accept Risk and Open Borrow Position' : 'Borrow'}</Typography>
            </SubmitButton>
        }

      </Box>

      <ChooseAssetDialog
        open={openChooseAsset}
        handleChooseAsset={handleChooseAsset}
        handleClose={() => setOpenChooseAsset(false)}
      />
    </>
  ) : <><Typography variant='p_lg'>Please Connect Wallet</Typography></>
}


const SelectPoolBox = styled(Box)`
	display: flex;
	justify-content: space-between;
	align-items: center;
	width: 145px;
	height: 40px;
	border: solid 1px ${(props) => props.theme.basis.lightSlateBlue};
  background-color: ${(props) => props.theme.basis.nobleBlack};
	border-radius: 1000px;
	cursor: pointer;
	padding: 8px;
  margin-top: 10px;
  margin-bottom: 25px;
	&:hover {
		box-shadow: 0 0 0 1px ${(props) => props.theme.basis.melrose} inset;
  }
`
const WarningStack = styled(Stack)`
  justify-content: center;
  align-items: center;
  margin-top: 10px;
  padding: 13px;
  border-radius: 5px;
  background-color: rgba(255, 0, 214, 0.15);
  color: #ff0084;
`

export default BorrowPanel
