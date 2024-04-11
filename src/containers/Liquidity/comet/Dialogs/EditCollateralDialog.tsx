import React, { useState, useEffect } from 'react'
import { Box, Dialog, DialogContent, Typography } from '@mui/material'
import { styled } from '@mui/material/styles'
import { useWallet } from '@solana/wallet-adapter-react'
import Image from 'next/image'
import { DetailInfo, useEditCollateralQuery } from '~/features/Liquidity/comet/EditCollateral.query'
import { useCollateralMutation } from '~/features/Liquidity/comet/Collateral.mutation'
import { useForm, Controller } from 'react-hook-form'
import { StyledTabs, StyledTab } from '~/components/Common/StyledTab'
import { FadeTransition } from '~/components/Common/Dialog'
import InfoTooltip from '~/components/Common/InfoTooltip'
import { TooltipTexts } from '~/data/tooltipTexts'
import PairInput from '~/components/Liquidity/comet/PairInput'
import { CloseButton, RiskSubmitButton, SubmitButton } from '~/components/Common/CommonButtons'
import HealthscoreView from '~/components/Liquidity/comet/HealthscoreView'
import IconHealthScoreGraph from 'public/images/liquidity/healthscore-graph.svg'
import WarningMsg, { InfoMsg } from '~/components/Common/WarningMsg'
import { LoadingButton } from '~/components/Common/Loading'
import { RISK_RATIO_VAL } from '~/data/riskfactors'
import { formatLocaleAmount } from '~/utils/numbers'

const EditCollateralDialog = ({ open, isNewDeposit, handleClose }: { open: boolean, isNewDeposit: boolean, handleClose: () => void }) => {
  const { publicKey } = useWallet()
  const [tab, setTab] = useState(0) // 0 : deposit , 1: withdraw
  const handleChangeTab = (event: React.SyntheticEvent, newValue: number) => {
    setTab(newValue)
  }
  const [healthScore, setHealthScore] = useState(0)
  const [maxWithdrawable, setMaxWithdrawable] = useState(0)

  const { data: collData, refetch } = useEditCollateralQuery({
    userPubKey: publicKey,
    refetchOnMount: "always",
    enabled: open && publicKey != null
  })

  const {
    handleSubmit,
    control,
    formState: { isDirty, errors, isSubmitting },
    watch,
    setValue,
    trigger,
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
    setMaxWithdrawable(0)
  }

  const setDetailValues = (collData: DetailInfo) => {
    if (tab === 1 && collData.collAmount === 0) {
      setHealthScore(0)
      setMaxWithdrawable(0)
    } else {
      if (!isNaN(collData.prevHealthScore)) {
        let loss = (100 - collData.prevHealthScore) * collData.effectiveCollateral;
        let collDelta = (tab === 0 ? 1 : -1) * collAmount;

        setHealthScore(100 - loss / (collData.effectiveCollateral + collData.collateralizationRatio * collDelta))
        if (collData.hasCometPositions || loss > 0) {
          setMaxWithdrawable((collData.effectiveCollateral - loss / 100) / collData.collateralizationRatio)
        } else {
          setMaxWithdrawable(collData.collAmount)
        }
      } else {
        if (tab === 0) {
          setHealthScore(100)
        } else {
          setHealthScore(0)
        }
      }
    }

    trigger()
  }

  // initialize state data
  useEffect(() => {
    async function fetch() {
      if (open && collData) {
        refetch()
        initData()
        setHealthScore(collData.prevHealthScore)
      }
    }
    fetch()
  }, [open])

  // calculate HealthScore & totalCollValue
  useEffect(() => {
    async function fetch() {
      if (open && collData) {
        // console.log('collData', collData)
        setDetailValues(collData)
      }
    }
    fetch()
  }, [open, collData, collAmount, tab])

  const { mutateAsync } = useCollateralMutation(publicKey)
  const onEdit = async () => {
    try {
      const data = await mutateAsync(
        {
          collAmount,
          editType: tab
        }
      )
      if (data) {
        console.log('data', data)
        // refetch()
        initData()
        // onRefetchData()
        // handleClose()
      }
    } catch (err) {
      console.error(err)
    }
  }

  let isValid = (() => {
    let valid = Object.keys(errors).length === 0
    if (collData?.hasCometPositions) {
      valid = valid && healthScore > 0.5
    }
    return valid
  })()

  const hasRiskScore = healthScore < RISK_RATIO_VAL

  let submitButtonText = tab === 0 ? 'Deposit Collateral' : 'Withdraw Collateral'
  if (!collAmount || collAmount === 0) {
    submitButtonText = tab === 0 ? 'Enter Deposit Amount' : 'Enter Withdraw Amount'
    isValid = false
  } else if (tab === 0 && collData?.hasCometPositions && collAmount > collData?.balance) {
    submitButtonText = 'Exceeded Deposit Amount'
    isValid = false
  } else if (tab === 1 && collData?.hasCometPositions && collAmount >= maxWithdrawable) {
    submitButtonText = 'Exceeded Withdrawable Amount'
    isValid = false
  } else if (tab === 1 && maxWithdrawable === 0) {
    submitButtonText = 'Withdrawable Amount is Zero'
    isValid = false
  }

  return collData ? (
    <>
      <Dialog open={open} onClose={handleClose} TransitionComponent={FadeTransition} maxWidth={400}>
        <DialogContent sx={{ backgroundColor: '#000916', width: '400px' }}>
          <BoxWrapper>
            <Box mb='20px'>
              <Typography variant='h3'>Manage Collateral</Typography>
            </Box>

            <StyledTabs value={tab} onChange={handleChangeTab}>
              <StyledTab value={0} label="Deposit" allBorderRadius={true} />
              <StyledTab value={1} label="Withdraw" allBorderRadius={true} />
            </StyledTabs>

            <Box my='36px'>
              <Box><Typography variant='p_lg' color='#fff'>Current Collateral</Typography></Box>
              <Box mt='7px'><Typography variant='h2' fontWeight={500}>${formatLocaleAmount(collData.collAmount)}</Typography></Box>
            </Box>

            {isNewDeposit && tab === 1 && collData.collAmount === 0 ?
              <ZeroAmountBox><Typography variant='h4'>Collateral Amount is Zero</Typography></ZeroAmountBox>
              :
              <>
                <Box mb='18px'>
                  <Controller
                    name="collAmount"
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
                        tickerIcon={collData.tickerIcon}
                        tickerSymbol={collData.tickerSymbol}
                        rightHeaderTitle={tab === 0 ? 'Balance' : 'Withdrawable'}
                        value={field.value}
                        valueDollarPrice={field.value}
                        inputTitle={tab === 0 ? 'Deposit' : 'Withdraw'}
                        balance={tab === 0 ? collData.balance : maxWithdrawable}
                        hideMaxButton={tab === 1 && collData && collData.hasCometPositions}
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
                  {/* <FormHelperText error={!!errors.collAmount?.message}>{errors.collAmount?.message}</FormHelperText> */}
                </Box>

                {
                  (tab === 0 && collAmount > 0) || (tab === 1 && collAmount > 0 && collAmount < maxWithdrawable) ?
                    <CometHealthBox padding='15px 20px'>
                      <Box display='flex' justifyContent='center'>
                        <Typography variant='p'>Projected Comet Health Score <InfoTooltip title={TooltipTexts.projectedHealthScore} color='#66707e' /></Typography>
                      </Box>
                      <Box mt='10px' display='flex' justifyContent='center'>
                        <HealthscoreView score={healthScore ? healthScore : collData.prevHealthScore} />
                      </Box>
                    </CometHealthBox>
                    :
                    <CometHealthBox padding='36px 20px' display='flex' flexDirection='column' justifyContent='center' alignItems='center'>
                      <Image src={IconHealthScoreGraph} alt='healthscore' />
                      <Box mt='7px'>
                        <Typography variant='p' color='#414e66'>Projected health score unavailable</Typography>
                      </Box>
                    </CometHealthBox>
                }

                {tab === 1 && <>
                  {
                    collAmount >= collData.collAmount ?
                      <InfoMsg>
                        If you are looking to withdraw all of your collateral, please close all of your liquidity positions first.
                      </InfoMsg>
                      :
                      hasRiskScore ?
                        <WarningMsg>
                          Due to low health score, you will have high possibility to become subject to liquidation.
                        </WarningMsg>
                        : <></>
                  }
                </>
                }

                {(tab === 1 && hasRiskScore && collAmount <= maxWithdrawable) ?
                  <RiskSubmitButton onClick={handleSubmit(onEdit)} disabled={!isDirty || !isValid || isSubmitting}>
                    <Typography variant='p_xlg'>
                      {'Accept Risk and Withdraw'}
                    </Typography>
                  </RiskSubmitButton>
                  :
                  isSubmitting ?
                    <Box display='flex' justifyContent='center' my='15px'>
                      <LoadingButton width='100%' height='52px' />
                    </Box>
                    :
                    <SubmitButton onClick={handleSubmit(onEdit)} disabled={!isDirty || !isValid || isSubmitting}>
                      <Typography variant='p_xlg'>
                        {submitButtonText}
                      </Typography>
                    </SubmitButton>
                }
              </>
            }

            <Box sx={{ position: 'absolute', right: '20px', top: '20px' }}>
              <CloseButton handleClose={handleClose} />
            </Box>
          </BoxWrapper>
        </DialogContent>
      </Dialog>
    </>
  ) : <></>
}

const BoxWrapper = styled(Box)`
  color: #fff;
  overflow-x: hidden;
`
const CometHealthBox = styled(Box)`
  background-color: ${(props) => props.theme.basis.darkNavy};
  margin-bottom: 30px;
`
const ZeroAmountBox = styled(Box)`
  width: 100%;
  height: 52px;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 7px 17px;
  border-radius: 5px;
  color: #989898;
  border: solid 1px ${(props) => props.theme.basis.shadowGloom};
`

export default EditCollateralDialog