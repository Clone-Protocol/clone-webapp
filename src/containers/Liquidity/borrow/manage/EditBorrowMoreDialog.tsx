import React, { useState, useCallback, useEffect } from 'react'
import { Box, Dialog, DialogContent, Typography, Stack } from '@mui/material'
import { styled } from '@mui/material/styles'
import { useWallet } from '@solana/wallet-adapter-react'
import { useEditBorrowMutation } from '~/features/Liquidity/borrow/Borrow.mutation'
import { PairData, PositionInfo as BorrowDetail } from '~/features/Liquidity/borrow/BorrowPosition.query'
import { useForm, Controller } from 'react-hook-form'
import EditBorrowedInput from '~/components/Liquidity/borrow/EditBorrowedInput'
import { FadeTransition } from '~/components/Common/Dialog'
import { CloseButton, SubmitButton } from '~/components/Common/CommonButtons'
import Image from 'next/image'
import IconSmile from 'public/images/liquidity/icon-smile.svg'
import InfoTooltip from '~/components/Common/InfoTooltip'
import { TooltipTexts } from '~/data/tooltipTexts'
import { Status } from 'clone-protocol-sdk/sdk/generated/clone'
import { LoadingButton } from '~/components/Common/Loading'
import { InfoMsg } from '~/components/Common/WarningMsg'

const EditBorrowMoreDialog = ({ borrowId, borrowDetail, initEditType, open, onHideEditForm }: { borrowId: number, borrowDetail: BorrowDetail, initEditType: number, open: boolean, onHideEditForm: () => void }) => {
  const { publicKey } = useWallet()
  const borrowIndex = borrowId
  const [editType, setEditType] = useState(initEditType) // 0 : borrow more , 1: repay
  const [maxCollVal, setMaxCollVal] = useState(0);
  const [disableChangeTab, setDisableChangeTab] = useState(false)

  // MEMO: expected collateral Ratio is 10% under from the min collateral ratio
  const [hasLackBalance, setHasLackBalance] = useState(editType === 1 && Number(borrowDetail.borrowedOnasset) > Number(borrowDetail.iassetVal))
  const [isFullRepaid, setIsFullRepaid] = useState(false)
  const [hasRiskRatio, setHasRiskRatio] = useState(editType === 0 && borrowDetail.minCollateralRatio * 1.1 >= borrowDetail.collateralRatio)
  const [expectedCollRatio, setExpectedCollRatio] = useState(0)

  //only allowable to repay on the status is extraction or liquidation
  useEffect(() => {
    if (borrowDetail) {
      if (borrowDetail.status === Status.Extraction || borrowDetail.status === Status.Liquidation) {
        setEditType(1)
        setDisableChangeTab(true)
      }
    }
  }, [borrowDetail])

  //max borrowable
  useEffect(() => {
    setMaxCollVal(editType === 0 ? Math.max(0, ((Number(borrowDetail.effectiveCollateralValue) * 100) / (borrowDetail.price * borrowDetail.minCollateralRatio)) - Number(borrowDetail.borrowedOnasset)) : borrowDetail.iassetVal)
  }, [borrowDetail.usdiVal, borrowDetail.iassetVal, editType])

  const handleChangeType = useCallback((event: React.SyntheticEvent, newValue: number) => {
    if (!disableChangeTab) {
      setEditType(newValue)
      initData()
    }
  }, [editType])

  const fromPair: PairData = {
    tickerIcon: borrowDetail.tickerIcon,
    tickerName: borrowDetail.tickerName,
    tickerSymbol: borrowDetail.tickerSymbol,
  }

  const { mutateAsync } = useEditBorrowMutation(publicKey)

  const {
    handleSubmit,
    control,
    formState: { isDirty, errors, isSubmitting },
    watch,
    setValue,
    reset
  } = useForm({
    mode: 'onChange',
    defaultValues: {
      borrowAmount: NaN,
    }
  })
  const [borrowAmount] = watch([
    'borrowAmount',
  ])

  const initData = () => {
    setValue('borrowAmount', NaN)
    reset()
  }

  useEffect(() => {
    let expectedCollRatio
    if (borrowAmount) {
      if (editType === 0) { // borrow more
        expectedCollRatio = (Number(borrowDetail.effectiveCollateralValue) * 100 / (borrowDetail.price * (Number(borrowDetail.borrowedOnasset) + Number(borrowAmount))))
      } else { // repay
        expectedCollRatio = (Number(borrowDetail.effectiveCollateralValue) * 100 / (borrowDetail.price * (Number(borrowDetail.borrowedOnasset) - Number(borrowAmount))))
      }
    } else {
      expectedCollRatio = (borrowDetail.collateralRatio)
    }
    setExpectedCollRatio(expectedCollRatio)

    if (editType === 1) {
      setHasLackBalance(borrowAmount > borrowDetail.iassetVal)
      setIsFullRepaid(Number(borrowDetail.borrowedOnasset) <= borrowAmount)
    }
    setHasRiskRatio(borrowDetail.minCollateralRatio * 1.1 >= expectedCollRatio)
  }, [borrowAmount, editType])

  const onEdit = async () => {
    try {
      const data = await mutateAsync(
        {
          borrowIndex,
          borrowAmount: borrowAmount,
          editType
        }
      )

      if (data) {
        console.log('data', data)
        initData()
        onHideEditForm()
      }
    } catch (err) {
      console.error(err)
    }

  }

  const isValid = Object.keys(errors).length === 0 && !isSubmitting && borrowAmount > 0

  return (
    <>
      <Dialog open={open} onClose={onHideEditForm} TransitionComponent={FadeTransition} maxWidth={600}>
        <DialogContent sx={{ background: '#16141b', width: '100%' }}>
          <BoxWrapper>
            <Typography variant='h3'>Manage Borrow Position: Borrowed Amount</Typography>

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
                  <Typography variant='h3'>{borrowDetail.collateralRatio.toFixed(2)}%</Typography>
                  <Typography variant='p_lg' color='#8988a3' whiteSpace={'nowrap'}>(min {borrowDetail.minCollateralRatio.toFixed(0)}%)</Typography>
                </Stack>
              </ValueBox>
            </Stack>

            <Box my='38px'>
              <Controller
                name="borrowAmount"
                control={control}
                rules={{
                  validate(value) {
                    if (!value || isNaN(value) || value <= 0) {
                      return 'Please enter a valid amount'
                    } else if (value > maxCollVal) {
                      if (editType === 0) {
                        return 'The borrow amount cannot exceed the max borrowable amount.'
                      } else {
                        return 'Repay amount cannot exceed the Wallet Balance'
                      }
                    } else if (editType === 1 && value > Number(borrowDetail.borrowedOnasset)) {
                      return 'Repay amount cannot exceed the Current Debt'
                    }
                  }
                }}
                render={({ field }) => (
                  <EditBorrowedInput
                    editType={editType}
                    tickerIcon={fromPair.tickerIcon}
                    tickerSymbol={fromPair.tickerSymbol}
                    collAmount={field.value}
                    collAmountDollarPrice={field.value * borrowDetail.price}
                    maxCollVal={maxCollVal}
                    currentCollAmount={Number(borrowDetail.borrowedOnasset)}
                    dollarPrice={Number(borrowDetail.borrowedOnasset) * borrowDetail.price}
                    onChangeType={handleChangeType}
                    onChangeAmount={(event: React.FormEvent<HTMLInputElement>) => {
                      field.onChange(event.currentTarget.value)
                    }}
                    onMax={(value: number) => {
                      const maxValue = editType === 1 ? Math.min(value, Number(borrowDetail.borrowedOnasset)) : value
                      field.onChange(maxValue)
                    }}
                  />
                )}
              />
              {/* <FormHelperText sx={{ textAlign: 'right' }} error={!!errors.borrowAmount?.message}>{errors.borrowAmount?.message}</FormHelperText> */}
            </Box>

            <RatioBox>
              {hasLackBalance || isFullRepaid ?
                <Box>
                  <Image src={IconSmile} alt='full borrowed amount' />
                  <Box>
                    <Typography variant='p' color='#8988a3'>{hasLackBalance ? 'N/A' : 'Borrowed amount paid in full (no collateral ratio)'}</Typography>
                  </Box>
                </Box>
                :
                <Box>
                  <Box>
                    <Typography variant='p'>Projected Collateral Ratio</Typography>
                    <InfoTooltip title={TooltipTexts.projectedCollateralRatio} color='#8988a3' />
                  </Box>
                  <Stack direction='row' gap={1} mt='8px'>
                    <Typography variant='h3' fontWeight={500} color={editType === 0 && hasRiskRatio ? '#ff0084' : '#fff'}>
                      {expectedCollRatio.toFixed(2)}%
                    </Typography>
                    <Typography variant='p_xlg' color={editType === 0 ? '#ff0084' : '#c4b5fd'}>
                      {editType === 1 ? '+' : '-'}{(Math.abs(expectedCollRatio - borrowDetail.collateralRatio)).toFixed(2)}%
                    </Typography>
                  </Stack>
                  <Typography variant='p_lg' color={editType === 0 && hasRiskRatio ? '#ff0084' : '#8988a3'}>(min {borrowDetail.minCollateralRatio}%)</Typography>
                </Box>}
            </RatioBox>

            {(editType === 1 && isFullRepaid) && <Box my='25px'><InfoMsg>Repaying full amount is the first step of the process to close a borrow position. You can complete rest of the steps in the close tab.</InfoMsg></Box>}

            {isSubmitting ?
              <Box display='flex' justifyContent='center' my='15px'>
                <LoadingButton width='100%' height='52px' />
              </Box>
              :
              <SubmitButton onClick={handleSubmit(onEdit)} disabled={!isValid} hasRisk={hasRiskRatio}>
                {editType === 0 ? <Typography variant='p_xlg'>{hasRiskRatio && 'Accept Risk and '}Borrow More</Typography>
                  : <Typography variant='p_xlg'>Repay {isFullRepaid && 'Full Amount'}</Typography>}
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
  background-color: #0a080f;
`
const RatioBox = styled(Box)`
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  align-items: center;
  text-align: center;
  border-radius: 10px;
  background-color: ${(props) => props.theme.basis.nobleBlack};
  height: 120px;
  margin-bottom: 15px;
`

export default EditBorrowMoreDialog