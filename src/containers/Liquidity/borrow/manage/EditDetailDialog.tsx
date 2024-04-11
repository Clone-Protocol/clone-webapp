import React, { useState, useCallback, useEffect } from 'react'
import { Box, Dialog, DialogContent, Typography, Stack } from '@mui/material'
import { styled } from '@mui/material/styles'
import { useWallet } from '@solana/wallet-adapter-react'
import { useCloseMutation, useEditCollateralMutation } from '~/features/Liquidity/borrow/Borrow.mutation'
import { PairData, PositionInfo as BorrowDetail } from '~/features/Liquidity/borrow/BorrowPosition.query'
import { useForm, Controller } from 'react-hook-form'
import EditCollateralInput from '~/components/Liquidity/borrow/EditCollateralInput'
import { FadeTransition } from '~/components/Common/Dialog'
import { RISK_RATIO_VAL } from '~/data/riskfactors'
import { CloseButton, SubmitButton } from '~/components/Common/CommonButtons'
import { Collateral as StableCollateral, collateralMapping } from '~/data/assets'
import Image from 'next/image'
import IconSmile from 'public/images/liquidity/icon-smile.svg'
import WarningMsg, { InfoMsg } from '~/components/Common/WarningMsg'
import { useRouter } from 'next/navigation'
import InfoTooltip from '~/components/Common/InfoTooltip'
import { TooltipTexts } from '~/data/tooltipTexts'
import { LoadingButton } from '~/components/Common/Loading'
import { RootLiquidityDir } from '~/utils/constants'

const EditDetailDialog = ({ borrowId, borrowDetail, initEditType, open, onHideEditForm }: { borrowId: number, borrowDetail: BorrowDetail, initEditType: number, open: boolean, onHideEditForm: () => void }) => {
  const { publicKey } = useWallet()
  const borrowIndex = borrowId
  const router = useRouter()

  const [editType, setEditType] = useState(initEditType) // 0 : deposit , 1: withdraw
  const [maxCollVal, setMaxCollVal] = useState(0);
  const [expectedCollRatio, setExpectedCollRatio] = useState(0)
  const [isFullWithdrawal, setIsFullWithdrawal] = useState(false)
  const [isFullRepaid, setIsFullRepaid] = useState(false)
  const [hasInvalidRatio, setHasInvalidRatio] = useState(false)
  const [hasRiskRatio, setHasRiskRatio] = useState(false)

  useEffect(() => {
    setMaxCollVal(editType === 0 ? borrowDetail.usdiVal : borrowDetail.maxWithdrawableColl)
  }, [editType, borrowDetail.usdiVal])

  useEffect(() => {
    if (borrowDetail.borrowedOnasset === 0) {
      setIsFullRepaid(true)
      setEditType(1)
    }
  }, [borrowDetail.borrowedOnasset])

  const handleChangeType = useCallback((event: React.SyntheticEvent, newValue: number) => {
    setEditType(newValue)
    initData()
    setMaxCollVal(newValue === 0 ? borrowDetail.usdiVal : borrowDetail.maxWithdrawableColl)
  }, [editType, open])

  const onUSDInfo = collateralMapping(StableCollateral.onUSD)
  const fromPair: PairData = {
    tickerIcon: onUSDInfo.collateralIcon,
    tickerName: onUSDInfo.collateralName,
    tickerSymbol: onUSDInfo.collateralSymbol,
  }

  const { mutateAsync } = useEditCollateralMutation(publicKey)
  const { mutateAsync: mutateAsyncClose } = useCloseMutation(publicKey)

  const {
    handleSubmit,
    control,
    trigger,
    formState: { isDirty, errors, isSubmitting },
    watch,
    setValue,
    reset
  } = useForm({
    mode: 'onChange',
    defaultValues: {
      collAmount: NaN,
    }
  })
  const [collAmount] = watch([
    'collAmount',
  ])

  const initData = () => {
    setValue('collAmount', NaN)
    reset()
  }

  useEffect(() => {
    let expectedCollRatio
    if (collAmount) {
      if (editType === 0) { // deposit
        const collateralDelta = Number(borrowDetail.collateralAmount) + Math.abs(Number(collAmount))
        expectedCollRatio = collateralDelta * borrowDetail.collateralizationRatio * 100 / (borrowDetail.price * Number(borrowDetail.borrowedOnasset))
      } else { // withdraw
        const collateralDelta = Number(borrowDetail.collateralAmount) - Math.abs(Number(collAmount))
        expectedCollRatio = collateralDelta * borrowDetail.collateralizationRatio * 100 / (borrowDetail.price * Number(borrowDetail.borrowedOnasset))
      }
    } else {
      expectedCollRatio = borrowDetail.collateralRatio
    }
    setExpectedCollRatio(expectedCollRatio)
    setHasInvalidRatio(expectedCollRatio < borrowDetail.minCollateralRatio || Math.abs(collAmount) > maxCollVal)
    setHasRiskRatio(expectedCollRatio - borrowDetail.minCollateralRatio <= RISK_RATIO_VAL)

    if (editType === 1) {
      setIsFullWithdrawal(collAmount >= Number(borrowDetail.collateralAmount))
    }

    trigger()
  }, [collAmount, editType])

  const onEdit = async () => {
    try {
      const data = await mutateAsync(
        {
          borrowIndex,
          collateralAmount: Math.abs(collAmount),
          editType
        }
      )

      if (data) {
        console.log('data', data)
        initData()
        // setEditType(0)
        onHideEditForm()
      }
    } catch (err) {
      console.error(err)
    }
  }

  const onClose = async () => {
    try {
      const data = await mutateAsyncClose(
        {
          borrowIndex,
        }
      )
      if (data) {
        console.log('data', data)
        initData()
        onHideEditForm()
        router.replace(`${RootLiquidityDir}/borrow/myliquidity`)
        // location.reload()
      }
    } catch (err) {
      console.error(err)
    }
  }

  const isValid = Object.keys(errors).length === 0 && !isSubmitting && collAmount > 0
  const isClose = isFullWithdrawal && isFullRepaid

  return (
    <>
      <Dialog open={open} onClose={onHideEditForm} TransitionComponent={FadeTransition} maxWidth={600}>
        <DialogContent sx={{ background: '#000916', width: '600px' }}>
          <BoxWrapper>
            <Typography variant='h3'>Manage Borrow Position: Collateral</Typography>

            {!isFullRepaid &&
              <Stack direction='row' gap={3} mt='38px'>
                <ValueBox width='220px'>
                  <Box mb='6px'><Typography variant='p'>Borrowed Asset</Typography></Box>
                  <Box display="flex" alignItems='center'>
                    <Image src={fromPair.tickerIcon} width={28} height={28} alt={fromPair.tickerSymbol!} />
                    <Typography variant="h4" ml='10px'>
                      {fromPair.tickerSymbol}
                    </Typography>
                  </Box>
                </ValueBox>
                <ValueBox width='300px'>
                  <Box mb='6px'><Typography variant='p'>Collateral Ratio</Typography></Box>
                  <Stack direction='row' gap={1} alignItems='center'>
                    <Typography variant='h3' fontWeight={500}>{borrowDetail.collateralRatio.toFixed(2)}%</Typography>
                    <Typography variant='p_lg' color='#66707e'>(min {borrowDetail.minCollateralRatio.toFixed(0)}%)</Typography>
                  </Stack>
                </ValueBox>
              </Stack>
            }
            <Box my='38px'>
              <Controller
                name="collAmount"
                control={control}
                rules={{
                  validate(value) {
                    if (!value || value <= 0) {
                      return ''
                    } else if (value > maxCollVal) {
                      if (editType === 0) {
                        return 'The deposit amount exceeds wallet balance.'
                      } else {
                        return 'Withdraw amount cannot exceed value for Max Withdraw-able.'
                      }
                    }
                  }
                }}
                render={({ field }) => (
                  <EditCollateralInput
                    editType={editType}
                    tickerIcon={fromPair.tickerIcon}
                    tickerSymbol={fromPair.tickerSymbol}
                    collAmount={field.value}
                    collAmountDollarPrice={field.value}
                    maxCollVal={maxCollVal}
                    currentCollAmount={Number(borrowDetail.collateralAmount)}
                    dollarPrice={Number(borrowDetail.collateralAmount)}
                    hasInvalidRatio={hasInvalidRatio}
                    isFullRepaid={isFullRepaid}
                    onChangeType={handleChangeType}
                    onChangeAmount={(event: React.FormEvent<HTMLInputElement>) => {
                      field.onChange(event.currentTarget.value)
                    }}
                    onMax={(value: number) => {
                      const maxValue = editType === 1 ? Math.min(value, Number(borrowDetail.collateralAmount)) : value
                      field.onChange(maxValue)
                    }}
                  />
                )}
              />
              {/* <FormHelperText error={!!errors.collAmount?.message}>{errors.collAmount?.message}</FormHelperText> */}
            </Box>

            <RatioBox>
              {hasInvalidRatio || isFullRepaid ?
                <Box>
                  <Image src={IconSmile} alt='paidInFull' />
                  <Box>
                    <Typography variant='p' color='#414e66'>{isFullWithdrawal ? 'Borrowed amount paid in full (no collateral ratio)' : 'Projected Collateral Ratio Unavailable'}</Typography>
                  </Box>
                </Box>
                :
                <Box>
                  <Box>
                    <Typography variant='p'>Projected Collateral Ratio</Typography>
                    <InfoTooltip title={TooltipTexts.projectedCollateralRatio} color='#66707e' />
                  </Box>
                  <Stack direction='row' gap={1} mt='8px'>
                    <Typography variant='h3' fontWeight={500} color={editType === 1 && hasRiskRatio ? '#ff0084' : '#fff'}>
                      {expectedCollRatio.toFixed(2)}%
                    </Typography>
                    <Typography variant='p_xlg' color={editType === 1 ? '#ff0084' : '#4fe5ff'}>
                      {editType === 0 ? '+' : '-'}{(Math.abs(expectedCollRatio - borrowDetail.collateralRatio)).toFixed(2)}%
                    </Typography>
                  </Stack>
                  <Typography variant='p_lg' color={editType === 1 && hasRiskRatio ? '#ff0084' : '#66707e'}>(min {borrowDetail.minCollateralRatio}%)</Typography>
                </Box>}
            </RatioBox>

            {isClose && <Box my='20px'><InfoMsg>By withdrawing entire collateral amount, you will be closing this borrow position.</InfoMsg></Box>}
            {(hasRiskRatio && collAmount <= maxCollVal) && <Box my='20px'><WarningMsg>
              Due to the lower collateral ratio, this borrow position will have high possibility to become subject to liquidation.
            </WarningMsg></Box>}

            {isSubmitting ?
              <Box display='flex' justifyContent='center' my='15px'>
                <LoadingButton width='100%' height='52px' />
              </Box>
              :
              <SubmitButton onClick={handleSubmit(isClose ? onClose : onEdit)} disabled={!isValid} hasRisk={hasRiskRatio && !isFullRepaid}>
                {isClose ?
                  <Typography variant='p_lg'>
                    Withdraw and Close This Borrow Position
                  </Typography>
                  :
                  <Typography variant='p_lg'>
                    {editType === 0 ?
                      collAmount > maxCollVal ? 'Exceeded Wallet Balance' : 'Deposit More Collateral'
                      :
                      collAmount > maxCollVal ? 'Exceeded Max Withdrawable Amount' :
                        `${hasRiskRatio ? 'Accept Risk and ' : ''} Withdraw Collateral`}
                  </Typography>
                }
              </SubmitButton>
            }

            <Box sx={{ position: 'absolute', right: '20px', top: '20px' }}>
              <CloseButton handleClose={onHideEditForm} />
            </Box>
          </BoxWrapper>
        </DialogContent>
      </Dialog>
    </>
  )
}

const BoxWrapper = styled(Box)`
  color: #fff;
  overflow-x: hidden;
`
const ValueBox = styled(Box)`
  display: flex;
  flex-direction: column;
  height: 78px;
  padding: 8px 30px;
  border-radius: 10px;
  line-height: 24px;
  background-color: ${(props) => props.theme.basis.jurassicGrey};
`
const RatioBox = styled(Box)`
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  align-items: center;
  text-align: center;
  border-radius: 5px;
  background-color: ${(props) => props.theme.basis.darkNavy};
  height: 120px;
`

export default EditDetailDialog