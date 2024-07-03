import React, { useState, useEffect } from 'react'
import withSuspense from '~/hocs/withSuspense'
import Image from 'next/image'
import { LoadingButton, LoadingProgress } from '~/components/Common/Loading'
import { useWallet } from '@solana/wallet-adapter-react'
import { Box, Stack, FormHelperText, Typography, useMediaQuery, Theme } from '@mui/material'
import { useForm } from 'react-hook-form'
import { styled } from '@mui/material/styles'
import RatioSlider from '~/components/Liquidity/overview/RatioSlider'
import InfoTooltip from '~/components/Common/InfoTooltip'
import { TooltipTexts } from '~/data/tooltipTexts'
import HealthscoreBar from '~/components/Liquidity/overview/HealthscoreBar'
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import { useLiquidityDetailQuery } from '~/features/Liquidity/comet/LiquidityPosition.query'
import { useNewPositionMutation } from '~/features/Liquidity/comet/LiquidityPosition.mutation'
import { useRouter } from 'next/navigation'
import { fromScale } from 'clone-protocol-sdk/sdk/src/clone'
import { ConnectButton, SelectButton, SubmitButton } from '~/components/Common/CommonButtons'
import { OpaqueAlreadyPool, OpaqueDefault, OpaqueNoCollateral } from '~/components/Common/OpaqueArea'
import SelectArrowIcon from 'public/images/liquidity/keyboard-arrow-left.svg'
import DepositIcon from 'public/images/liquidity/deposit-icon.svg'
import Link from 'next/link'
import { useWalletDialog } from '~/hooks/useWalletDialog'
import { InfoMsg } from '~/components/Common/WarningMsg'
import { ON_USD, RootLiquidityDir } from '~/utils/constants'
import { PoolStatusButton, showPoolStatus } from '~/components/Common/PoolStatus'
import { RISK_RATIO_VAL } from '~/data/riskfactors'
import { useAtomValue } from 'jotai'
import { isAlreadyInitializedAccountState } from '~/features/globalAtom'
import { formatLocaleAmount } from '~/utils/numbers'
import { assetMapping } from '~/data/assets'

const CometPanel = ({ assetIndex, openChooseLiquidityDialog }: { assetIndex: number, openChooseLiquidityDialog: () => void }) => {
  const { publicKey } = useWallet()
  const { setOpen } = useWalletDialog()
  const router = useRouter()
  const [mintRatio, setMintRatio] = useState(0)
  const [maxMintable, setMaxMintable] = useState(0.0)
  const [totalLiquidity, setTotalLiquidity] = useState(0)
  const [healthScore, setHealthScore] = useState(0)
  const [assetHealthCoefficient, setAssetHealthCoefficient] = useState(0)
  const [validMintValue, setValidMintValue] = useState(false)
  const isAlreadyInitializedAccount = useAtomValue(isAlreadyInitializedAccountState)
  const isMobileOnSize = useMediaQuery((theme: Theme) => theme.breakpoints.down('md'))
  const assetData = assetMapping(assetIndex)

  const { data: positionInfo, refetch } = useLiquidityDetailQuery({
    userPubKey: publicKey,
    index: assetIndex,
    refetchOnMount: "always",
    enabled: publicKey != null && isAlreadyInitializedAccount
  })

  useEffect(() => {
    if (positionInfo) {
      const assetInfo = positionInfo.pools.pools[assetIndex].assetInfo
      const healthCoefficient = fromScale(assetInfo.positionHealthScoreCoefficient, 2);
      setAssetHealthCoefficient(healthCoefficient)
      setHealthScore(positionInfo.totalHealthScore)
      setMaxMintable(positionInfo.effectiveCollateralValue * positionInfo.totalHealthScore / (100 * healthCoefficient))
      initData()
    }
  }, [positionInfo])

  const initData = () => {
    setMintRatio(0)
  }

  const {
    handleSubmit,
    setValue,
    trigger,
    formState: { errors, isSubmitting },
    watch,
  } = useForm({
    mode: 'onChange',
    defaultValues: {
      mintAmount: 0,
    }
  })

  const [mintAmount] = watch([
    'mintAmount',
  ])

  const handleChangeMintRatio = (event: Event, newValue: number | number[]) => {
    if (typeof newValue === 'number') {
      setMintRatio(newValue)
    }
  }

  // const validateMintAmount = () => {
  //   if (!isDirty) {
  //     clearErrors('mintAmount')
  //     return
  //   }

  //   if (!mintAmount || mintAmount <= 0) {
  //     return 'Mint amount should be above zero'
  //   } else if (mintAmount >= maxMintable) {
  //     return 'Mint amount cannot exceed the max mintable amount'
  //   }
  // }

  useEffect(() => {
    if (positionInfo) {
      const mintAmount = maxMintable * mintRatio / 100
      setValue('mintAmount', mintAmount);
      setHealthScore(positionInfo.totalHealthScore - 100 * assetHealthCoefficient * mintAmount / positionInfo.effectiveCollateralValue)
      setTotalLiquidity(mintAmount * 2)
      setValidMintValue(mintRatio > 0 && mintRatio < 100 && mintAmount > 0 && mintAmount < maxMintable)
      trigger()
    }
  }, [mintRatio])

  const { mutateAsync } = useNewPositionMutation(publicKey)
  const onNewLiquidity = async () => {
    try {
      const data = await mutateAsync({
        poolIndex: assetIndex,
        changeAmount: mintAmount,
      })

      if (data.result) {
        console.log('data', data)
        refetch()
        initData()
        router.push(`${RootLiquidityDir}/comet/myliquidity`)
      }
    } catch (err) {
      console.error(err)
    }
  }

  const isValid = Object.keys(errors).length === 0 && !isSubmitting && validMintValue
  const hasRiskScore = healthScore < RISK_RATIO_VAL

  let opaqueArea = null
  let actionButton = null
  if (!publicKey) {
    opaqueArea = <OpaqueDefault />
    actionButton = (
      <ConnectButton onClick={() => setOpen(true)}>
        <Typography variant='p_xlg'>Connect Wallet</Typography>
      </ConnectButton>
    )
  } else if (showPoolStatus(positionInfo?.status!)) {
    opaqueArea = <OpaqueDefault />
    actionButton = (
      <Box display='flex' justifyContent='center'>
        <PoolStatusButton status={positionInfo?.status!} />
      </Box>
    )
  } else if (positionInfo?.hasFullPool) {
    actionButton = (
      <SelectButton>
        <Typography variant='p_xlg'>Exhausted All Available Pools</Typography>
      </SelectButton>
    )
  } else if (positionInfo?.hasNoCollateral) {
    opaqueArea = <OpaqueNoCollateral />
    actionButton = (
      <Link href='/comet/myliquidity'>
        <SelectButton>
          <Typography variant='p_xlg'>Deposit Collateral</Typography>
        </SelectButton>
      </Link>
    )
  } else if (positionInfo?.hasAlreadyPool) {
    opaqueArea = <OpaqueAlreadyPool />
    actionButton = (
      <SelectButton onClick={() => openChooseLiquidityDialog()}>
        <Typography variant='p_xlg'>Select a Pool</Typography>
      </SelectButton>
    )
  } else {
    actionButton = (
      <Box>
        {isSubmitting ?
          <Box display='flex' justifyContent='center' my='15px'>
            <LoadingButton width='100%' height='52px' />
          </Box>
          :
          <SubmitButton onClick={handleSubmit(onNewLiquidity)} disabled={!isValid} hasRisk={hasRiskScore}>
            <Typography variant='p_lg'>{hasRiskScore && 'Accept Risk and '} Open New Comet Liquidity Position</Typography>
          </SubmitButton>
        }
      </Box>
    )
  }

  return (
    <>
      <Box position='relative' mb='10px'>
        <Box>
          <BoxWithBorder p='14px 22px'>
            <Box>
              <Typography variant='p_lg'>Current Comet Status</Typography>
            </Box>
            <Box mt='5px' mb='10px'>
              <SubHeader><Typography variant='p'>Collateral Value</Typography> <InfoTooltip title={TooltipTexts.totalCollateralValue} /></SubHeader>
              {!positionInfo || positionInfo?.hasNoCollateral ?
                <Link href='/comet/myliquidity'>
                  <DepositCollateralButton>
                    <Typography variant='p_lg'>Deposit collateral to get started </Typography>
                    <Image src={DepositIcon} alt='deposit' />
                  </DepositCollateralButton>
                </Link>
                :
                <Box><Typography variant='h3' fontWeight={500}>${formatLocaleAmount(positionInfo?.totalCollValue)}</Typography></Box>
              }
            </Box>
            <Box>
              <SubHeader><Typography variant='p'>Health Score</Typography> <InfoTooltip title={TooltipTexts.healthScoreCol} /></SubHeader>
              <HealthscoreBar score={positionInfo?.totalHealthScore} width={isMobileOnSize ? 330 : 480} hasRiskScore={hasRiskScore} hiddenThumbTitle={true} />
            </Box>
          </BoxWithBorder>

          <BoxWithBorder padding="15px 24px" mt='24px'>
            {positionInfo?.hasFullPool ?
              <Box my='20px'><InfoMsg>You’ve exhausted all available pools on Clone Protocol to provide comet liquidity. If you need to create more positions, please consider opening a new account with different wallet address.</InfoMsg></Box>
              :
              <Box>
                <Box mb='10px'>
                  <Typography variant='p_lg'>Select Liquidity Pool</Typography>
                  <InfoTooltip title={TooltipTexts.selectLiquidityPool} color='#8988a3' />
                </Box>
                {positionInfo?.hasAlreadyPool ?
                  <SelectDefaultPool onClick={() => openChooseLiquidityDialog()}>
                    <Box mb='4px'><Typography variant='p_lg'>Select a Pool</Typography></Box>
                    <Image src={SelectArrowIcon} alt='select' />
                  </SelectDefaultPool>
                  :
                  <SelectPoolBox onClick={() => openChooseLiquidityDialog()}>
                    <Stack direction='row' gap={1} alignItems='center'>
                      <Image src={assetData.tickerIcon} width={20} height={20} alt={assetData.tickerSymbol} />
                      <Typography variant='p_lg' mb='3px'>{assetData.tickerSymbol}{'/'}{ON_USD}</Typography>
                    </Stack>
                    <Image src={SelectArrowIcon} alt='select' />
                  </SelectPoolBox>
                }
                <Box mt='20px'>
                  <Box>
                    <Typography variant='p_lg'>Liquidity Amount</Typography>
                    <InfoTooltip title={TooltipTexts.liquidityAmount} color='#8988a3' />
                  </Box>
                  <Box mt='15px' mb='10px' p='5px'>
                    <RatioSlider min={0} max={100} value={mintRatio} hideValueBox onChange={handleChangeMintRatio} />
                  </Box>
                  <FormHelperText error={!!errors.mintAmount?.message}>{errors.mintAmount?.message}</FormHelperText>
                </Box>

                <StackWithBorder direction='row' justifyContent='space-between' alignItems='center'>
                  <Box display='flex' alignItems='center'>
                    <Typography variant="p">Liquidity Value</Typography>
                    <InfoTooltip title={TooltipTexts.newLiquidityValue} color='#8988a3' />
                  </Box>
                  <Box display='flex' alignItems='center'><Typography variant="p_lg">${formatLocaleAmount(totalLiquidity)}</Typography></Box>
                </StackWithBorder>

                <Box mt='25px'>
                  <Box mb="15px"><Typography variant="p_lg">Projected Health Score</Typography> <InfoTooltip title={TooltipTexts.projectedHealthScore} color='#8988a3' /></Box>
                  <HealthscoreBar score={healthScore} width={isMobileOnSize ? 330 : 470} hasRiskScore={hasRiskScore} hiddenThumbTitle={true} />
                  {hasRiskScore &&
                    <a href="https://docs.clone.so/clone-mainnet-guide/clone-liquidity-or-for-lps/comets" target='_blank'>
                      <WarningStack direction='row'>
                        <WarningAmberIcon sx={{ color: '#ff0084', width: '15px' }} />
                        <Typography variant='p' ml='8px'>Due to low health score, you will have high possibility to become subject to liquidation. Click to learn more about our liquidation process.</Typography>
                      </WarningStack>
                    </a>
                  }
                </Box>
              </Box>
            }
          </BoxWithBorder>
        </Box>

        {opaqueArea}
      </Box>

      {actionButton}
    </>
  )
}

const BoxWithBorder = styled(Box)`
  background: ${(props) => props.theme.basis.backInBlack};
  border-radius: 20px;
`
const StackWithBorder = styled(Stack)`
  border: solid 1px ${(props) => props.theme.basis.jurassicGrey};
  border-radius: 10px;
  padding: 18px;
  height: 52px;
`
const WarningStack = styled(Stack)`
  justify-content: center;
  align-items: center;
  cursor: pointer;
  margin-top: 10px;
  padding: 13px;
  border-radius: 10px;
  background-color: rgba(255, 0, 214, 0.15);
  color: #ff0084;
  &:hover {
    background-color: rgba(237, 37, 193, 0.1);
  }
`
const SubHeader = styled(Box)`
  color: ${(props) => props.theme.basis.slug};
`
const SelectPoolBox = styled(Box)`
	display: flex;
	justify-content: space-between;
	align-items: center;
	width: 190px;
	height: 40px;
	border: solid 1px ${(props) => props.theme.basis.lightSlateBlue};
  background-color: ${(props) => props.theme.basis.nobleBlack};
	border-radius: 1000px;
	cursor: pointer;
	padding: 8px;
	&:hover {
		box-shadow: 0 0 0 1px ${(props) => props.theme.basis.melrose} inset;
  }
`
const SelectDefaultPool = styled(Box)`
  width: 142px;
  height: 40px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 10px;
  padding: 8px 12px;
  border-radius: 1000px;
  cursor: pointer;
  border: solid 1px ${(props) => props.theme.basis.lightSlateBlue};
  background-color: ${(props) => props.theme.basis.nobleBlack};
  &:hover {
		box-shadow: 0 0 0 1px ${(props) => props.theme.basis.melrose} inset;
  }
`
const DepositCollateralButton = styled(SelectDefaultPool)`
  width: 285px;
  height: 35px;
  color: #fff;
  border-radius: 10px;
  justify-content: center;
`
export default withSuspense(CometPanel, <LoadingProgress />)