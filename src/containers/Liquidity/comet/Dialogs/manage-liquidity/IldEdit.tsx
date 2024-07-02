import { Box, Stack, Typography } from "@mui/material"
import { styled } from '@mui/material/styles'
import { SubmitButton } from "~/components/Common/CommonButtons"
import { useForm, Controller } from 'react-hook-form'
import PairInput from '~/components/Liquidity/comet/PairInput'
import Image from 'next/image'
import HealthscoreView from '~/components/Liquidity/comet/HealthscoreView'
import IconHealthScoreGraph from 'public/images/liquidity/healthscore-graph.svg'
import InfoTooltip from '~/components/Common/InfoTooltip'
import { TooltipTexts } from '~/data/tooltipTexts'
import { useWallet } from "@solana/wallet-adapter-react"
import WarningMsg, { InfoMsg } from "~/components/Common/WarningMsg"
import { useLiquidityPositionQuery } from "~/features/Liquidity/comet/LiquidityPosition.query"
import { useEffect, useState } from "react"
import { fromScale } from 'clone-protocol-sdk/sdk/src/clone'
import { usePayILDMutation } from "~/features/Liquidity/comet/LiquidityPosition.mutation"
import { LoadingButton, LoadingProgress } from "~/components/Common/Loading"
import withSuspense from "~/hocs/withSuspense"
import { Collateral as StableCollateral, collateralMapping } from "~/data/assets"
import { ON_USD } from "~/utils/constants"
import { formatLocaleAmount } from "~/utils/numbers"

const IldEdit = ({ positionIndex }: { positionIndex: number }) => {
  const { publicKey } = useWallet()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [healthScore, setHealthScore] = useState(0)
  const onUSDInfo = collateralMapping(StableCollateral.onUSD)

  const { data: positionInfo } = useLiquidityPositionQuery({
    userPubKey: publicKey,
    index: positionIndex,
    refetchOnMount: "always",
    enabled: publicKey != null,
  })

  const {
    handleSubmit,
    control,
    watch,
    setValue,
  } = useForm({
    mode: 'onChange',
    defaultValues: {
      ildAssetAmount: NaN,
      ildCollAmount: NaN
    }
  })
  const [ildAssetAmount, ildCollAmount] = watch([
    'ildAssetAmount',
    'ildCollAmount'
  ])

  useEffect(() => {
    if (positionInfo) {
      const position = positionInfo.comet.positions[positionIndex]
      const poolIndex = Number(position.poolIndex)
      const pool = positionInfo.pools.pools[poolIndex]
      const ildDebtNotionalValue = Math.max(positionInfo.collateralILD - ildCollAmount, 0) + Math.max((positionInfo.onassetILD - ildAssetAmount) * positionInfo.oraclePrice, 0)
      const healthScoreIncrease = (
        fromScale(pool.assetInfo.ilHealthScoreCoefficient, 2) * ildDebtNotionalValue +
        positionInfo.committedCollateralLiquidity * fromScale(pool.assetInfo.positionHealthScoreCoefficient, 2)
      ) / positionInfo.totalCollateralAmount
      // console.log('m', (positionInfo.onassetILD - ildAmount))
      // console.log('s', fromScale(pool.assetInfo.ilHealthScoreCoefficient, 2) * ildDebtNotionalValue)
      // console.log('h', healthScoreIncrease)
      setHealthScore(positionInfo.prevHealthScore + healthScoreIncrease)
    }
  }, [ildAssetAmount])

  const initData = () => {
    setValue('ildAssetAmount', NaN)
    setValue('ildCollAmount', NaN)
  }

  const { mutateAsync } = usePayILDMutation(publicKey)
  const onEdit = async () => {
    try {
      setIsSubmitting(true)

      const data = await mutateAsync({
        ildAssetAmount,
        ildCollAmount,
        positionIndex,
        collateralBalance: positionInfo?.onusdVal!,
        collateralILD: positionInfo?.collateralILD!,
        onassetBalance: positionInfo?.onassetVal!,
        onassetILD: positionInfo?.onassetILD!,
        onassetMint: positionInfo?.onassetMint!,
        committedCollateralLiquidity: positionInfo?.committedCollateralLiquidity!,
      })

      if (data) {
        console.log("data", data)
        // refetch()
        // onRefetchData()
        initData()
      }
    } catch (err) {
      console.error(err)
    } finally {
      setIsSubmitting(false)
    }
  }


  const balanceOnAsset: number = positionInfo ? Math.max(0, positionInfo.onassetVal) : 0
  const remainingAssetILD: number = positionInfo ? Math.max(0, positionInfo.onassetILD - ildAssetAmount) : 0
  const balanceColl: number = positionInfo ? Math.max(0, positionInfo.onusdVal) : 0
  const remainingCollILD: number = positionInfo ? Math.max(0, positionInfo.collateralILD - ildCollAmount) : 0

  let warningMsgForAsset = ''
  if (balanceOnAsset === 0) {
    warningMsgForAsset = 'You wallet balance is zero'
  } else if (positionInfo && Math.max(0, positionInfo.onassetILD) - ildAssetAmount > 0) {
    warningMsgForAsset = 'Not enough wallet balance to fully payoff clAsset ILD Amount. You can acquire more or borrow to payoff.'
  }

  let warningMsgForColl = ''
  if (balanceColl === 0) {
    warningMsgForColl = 'You wallet balance is zero'
  } else if (positionInfo && Math.max(0, positionInfo.collateralILD) - balanceColl > 0) {
    warningMsgForColl = `Not enough wallet balance to fully payoff ${ON_USD} ILD Amount.`
  }

  const isNotValid = positionInfo ?
    (positionInfo.onassetILD <= 0 && Math.max(0, positionInfo.collateralILD) <= 0)
    || (isNaN(ildAssetAmount) && positionInfo.onassetILD > 0)
    || (isNaN(ildCollAmount) && Math.max(0, positionInfo.collateralILD) > 0)
    || ildCollAmount > Math.max(0, positionInfo.collateralILD)
    || ildAssetAmount > Math.max(0, positionInfo.onassetILD)
    || (remainingAssetILD > 0 && ildAssetAmount === 0)
    || (remainingCollILD > 0 && ildCollAmount === 0)
    || isSubmitting : false

  return positionInfo ? (
    <>
      <Box>
        <Box>
          <Typography variant='p_lg'>clAsset ILD</Typography>
          <InfoTooltip title={TooltipTexts.ildDebt} color='#8988a3' />
        </Box>
        <StackWithBorder direction='row' justifyContent='space-between'>
          <Box>
            <Typography variant='p_lg'>{positionInfo.tickerSymbol} ILD</Typography>
          </Box>
          <Box>
            <Typography variant='p_lg'>
              {formatLocaleAmount(Math.max(0, positionInfo.onassetILD), 8)} {positionInfo.tickerSymbol}
            </Typography>
            <Typography variant='p_lg' color='#8988a3' ml='10px'>
              {`($${formatLocaleAmount(Math.max(0, positionInfo.onassetILD) * positionInfo.oraclePrice, 8)})`}
            </Typography>
          </Box>
        </StackWithBorder>

        {Math.max(0, positionInfo.onassetILD) > 0 &&
          <BoxWithBorder>
            <Controller
              name="ildAssetAmount"
              control={control}
              render={({ field }) => (
                <PairInput
                  tickerIcon={positionInfo.tickerIcon}
                  tickerSymbol={positionInfo.tickerSymbol}
                  rightHeaderTitle={'Wallet Balance'}
                  value={field.value}
                  valueDollarPrice={field.value * positionInfo.oraclePrice}
                  inputTitle={`${positionInfo.tickerSymbol} ILD Payment`}
                  inputTitleColor="#fff"
                  balance={balanceOnAsset}
                  onChange={(event: React.FormEvent<HTMLInputElement>) => {
                    const ildAmt = parseFloat(event.currentTarget.value)
                    field.onChange(ildAmt)
                  }}
                  onMax={(value: number) => {
                    const onassetILD = Math.max(0, positionInfo.onassetILD)
                    field.onChange(Math.min(value, onassetILD))
                  }}
                />
              )}
            />
            {!isNaN(ildAssetAmount) &&
              <StackWithBorder direction='row' justifyContent='space-between' sx={{ background: 'transparent' }}>
                <Box>
                  <Typography variant='p'>Projected Remaining clAsset ILD</Typography>
                  <InfoTooltip title={TooltipTexts.projectedRemainingILD} color='#8988a3' />
                </Box>
                <Box>
                  <Typography variant='p_lg'>{ildAssetAmount > balanceOnAsset ? 'N/A' : formatLocaleAmount(remainingAssetILD, 8)}</Typography>
                  <Typography variant='p_lg' color='#8988a3' ml='5px'>{ildAssetAmount > balanceOnAsset ? 'N/A' : remainingAssetILD === 0 ? '(Paid Off)' : `($${formatLocaleAmount(remainingAssetILD, 8)})`}</Typography>
                </Box>
              </StackWithBorder>
            }

            {ildAssetAmount > balanceOnAsset &&
              <Box mb='10px'>
                <WarningMsg>
                  Exceeded Wallet Balance. Please adjust the payment amount.
                </WarningMsg>
              </Box>
            }
            {warningMsgForAsset !== '' && <InfoMsg>{warningMsgForAsset}</InfoMsg>}
          </BoxWithBorder>
        }

        <Box>
          <Box>
            <Typography variant='p_lg'>{ON_USD} ILD</Typography>
            <InfoTooltip title={TooltipTexts.onUSDILD} color='#8988a3' />
          </Box>
          <StackWithBorder direction='row' justifyContent='space-between'>
            <Typography variant='p_lg'>{ON_USD} ILD</Typography>
            <Typography variant='p_lg'>
              {formatLocaleAmount(Math.max(0, positionInfo.collateralILD), 8)} {ON_USD}
            </Typography>
          </StackWithBorder>

          {Math.max(0, positionInfo.collateralILD) > 0 &&
            <BoxWithBorder>
              <Controller
                name="ildCollAmount"
                control={control}
                render={({ field }) => (
                  <PairInput
                    tickerIcon={onUSDInfo.collateralIcon}
                    tickerSymbol={onUSDInfo.collateralSymbol}
                    rightHeaderTitle={'Wallet Balance'}
                    value={field.value}
                    valueDollarPrice={field.value}
                    inputTitle={`${ON_USD} ILD Payment`}
                    inputTitleColor="#fff"
                    balance={balanceColl}
                    onChange={(event: React.FormEvent<HTMLInputElement>) => {
                      const ildAmt = parseFloat(event.currentTarget.value)
                      field.onChange(ildAmt)
                    }}
                    onMax={(value: number) => {
                      const collateralILD = Math.max(0, positionInfo.collateralILD)
                      field.onChange(Math.min(value, collateralILD))
                    }}
                  />
                )}
              />
              {!isNaN(ildCollAmount) &&
                <StackWithBorder direction='row' justifyContent='space-between' sx={{ background: 'transparent' }}>
                  <Box>
                    <Typography variant='p'>Projected Remaining {ON_USD} ILD</Typography>
                    {/* <InfoTooltip title={TooltipTexts.projectedRemainingILD} color='#8988a3' /> */}
                  </Box>
                  <Box>
                    <Typography variant='p_lg'>{ildCollAmount > balanceColl ? 'N/A' : formatLocaleAmount(remainingCollILD, 8)}</Typography>
                    <Typography variant='p_lg' color='#8988a3' ml='5px'>{ildCollAmount > balanceColl ? 'N/A' : remainingCollILD === 0 ? '(Paid Off)' : `($${formatLocaleAmount(remainingCollILD, 8)})`}</Typography>
                  </Box>
                </StackWithBorder>
              }

              {ildCollAmount > Math.max(0, positionInfo.collateralILD) &&
                <Box mb='10px'>
                  <WarningMsg>
                    Exceeded ILD Amount. Please lower the payment amount.
                  </WarningMsg>
                </Box>
              }
              {ildCollAmount > balanceColl &&
                <Box mb='10px'>
                  <WarningMsg>
                    Exceeded Wallet Balance. Please adjust the payment amount.
                  </WarningMsg>
                </Box>
              }
              {warningMsgForColl !== '' && <InfoMsg>{warningMsgForColl}</InfoMsg>}
            </BoxWithBorder>
          }

          {
            (ildAssetAmount > 0 || ildCollAmount > 0) ?
              <HealthBox padding='15px 20px'>
                <Box display='flex' justifyContent='center'>
                  <Typography variant='p'>Projected Health Score <InfoTooltip title={TooltipTexts.projectedHealthScore} color='#8988a3' /></Typography>
                </Box>
                <Box mt='10px' display='flex' justifyContent='center'>
                  <HealthscoreView score={healthScore ? healthScore : positionInfo.healthScore} />
                </Box>
              </HealthBox>
              :
              <HealthBox padding='36px 20px' display='flex' flexDirection='column' justifyContent='center' alignItems='center'>
                <Image src={IconHealthScoreGraph} alt='healthscore' />
                <Box>
                  <Typography variant='p' color='#8988a3'>Projected health score unavailable</Typography>
                </Box>
              </HealthBox>
          }
        </Box>

        {isSubmitting ?
          <Box display='flex' justifyContent='center' my='15px'>
            <LoadingButton width='100%' height='52px' />
          </Box>
          :
          <SubmitButton onClick={handleSubmit(onEdit)} disabled={isNotValid}>
            <Typography variant='p_xlg'>{positionInfo.onassetILD <= 0 && positionInfo.collateralILD <= 0 ? 'No ILD Balance' : (!ildAssetAmount && !ildCollAmount) ? 'Please adjust payment amount' : (remainingAssetILD === 0 && remainingCollILD === 0) ? 'Pay Entire ILD Debt' : 'Adjust ILD'}</Typography>
          </SubmitButton>
        }
      </Box>
    </>
  ) : (
    <></>
  )
}

const StackWithBorder = styled(Stack)`
  width: 100%;
  height: 52px;
  margin-top: 10px;
  margin-bottom: 15px;
  align-items: center;
  border-radius: 10px;
  gap: 10px;
  padding: 18px 21px;
  background: ${(props) => props.theme.basis.nobleBlack};
  border: solid 1px ${(props) => props.theme.basis.plumFuzz};
`
const BoxWithBorder = styled(Box)`
  width: 100%;
  margin-top: 15px;
  margin-bottom: 33px;
  border-radius: 5px;
  align-items: center;
  gap: 10px;
  padding: 18px 21px;
  border: solid 1px ${(props) => props.theme.basis.jurassicGrey};
`
const HealthBox = styled(Box)`
  background-color: ${(props) => props.theme.basis.nobleBlack};
  color: ${(props) => props.theme.basis.textRaven};
  border-radius: 10px;
  margin-top: 38px;
  margin-bottom: 30px;
`

export default withSuspense(IldEdit, <LoadingProgress />)