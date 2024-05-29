import { Box, Stack, Typography } from "@mui/material"
import { styled } from '@mui/material/styles'
import InfoTooltip from '~/components/Common/InfoTooltip'
import { TooltipTexts } from '~/data/tooltipTexts'
import { useWallet } from "@solana/wallet-adapter-react"
import { useLiquidityPositionQuery } from "~/features/Liquidity/comet/LiquidityPosition.query"
import { SubmitButton } from "~/components/Common/CommonButtons"
import { useEffect, useState } from "react"
import { useClosePositionMutation } from "~/features/Liquidity/comet/LiquidityPosition.mutation"
import Image from "next/image"
import CheckIcon from 'public/images/liquidity/check-icon.svg'
import { fromScale } from "clone-protocol-sdk/sdk/src/clone"
import { LoadingButton, LoadingProgress } from "~/components/Common/Loading"
import withSuspense from "~/hocs/withSuspense"
import { formatLocaleAmount } from "~/utils/numbers"

const ClosePosition = ({ positionIndex, onMoveTab, handleClose }: { positionIndex: number, onMoveTab: (index: number) => void, handleClose: () => void }) => {
  const { publicKey } = useWallet()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const [positionLiquidity, setPositionLiquidity] = useState(0)
  const [ildBalance, setIldBalance] = useState(0)
  const [remainRewards, setRemainRewards] = useState(0)

  const { data: positionInfo, refetch } = useLiquidityPositionQuery({
    userPubKey: publicKey,
    index: positionIndex,
    refetchOnMount: "always",
    enabled: publicKey != null,
  })

  const liquidityNotional = () => {
    let liquidity = 0
    if (positionInfo) {
      const position = positionInfo.comet.positions[positionIndex]
      liquidity += fromScale(position.committedCollateralLiquidity, 6) * 2
    }
    return liquidity
  }

  const ildNotional = () => {
    let reward = 0
    if (positionInfo!.collateralILD > 0) {
      reward += positionInfo!.collateralILD
    }
    if (positionInfo!.onassetILD > 0) {
      reward += positionInfo!.onassetILD * positionInfo!.oraclePrice
    }
    return Math.max(0, reward)
  }

  const rewardNotional = () => {
    let reward = 0
    if (positionInfo!.collateralILD < 0) {
      reward += (-positionInfo!.collateralILD)
    }
    if (positionInfo!.onassetILD < 0) {
      reward += (-positionInfo!.onassetILD * positionInfo!.oraclePrice)
    }

    return Math.max(0, reward)
  }

  useEffect(() => {
    if (positionInfo) {
      setPositionLiquidity(liquidityNotional())
      setIldBalance(ildNotional())
      setRemainRewards(rewardNotional())
    }
  }, [positionInfo])

  const { mutateAsync } = useClosePositionMutation(publicKey)
  const handleClosePosition = async () => {
    try {
      setIsSubmitting(true)

      const data = await mutateAsync({
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
        handleClose()
        location.reload()
      }
    } catch (err) {
      console.error(err)
    } finally {
      setIsSubmitting(false)
    }
  }

  const isValidClose = positionLiquidity === 0 && ildBalance === 0 && remainRewards === 0 && !isSubmitting

  return positionInfo ? (
    <>
      <Box>
        <Box>
          <Typography variant='p_lg'>Step 1: Withdraw All Liquidity</Typography>
          <InfoTooltip title={TooltipTexts.withdrawLiquidity} color="#8988a3" />
        </Box>
        <StackWithBorder direction='row' justifyContent='space-between'>
          <Typography variant='p_lg' color={positionLiquidity > 0 ? '#fff' : '#8988a3'}>
            ${formatLocaleAmount(positionLiquidity, 8)}
          </Typography>

          {positionLiquidity === 0 ?
            <Stack direction='row' gap={1} alignItems='center'>
              <Image src={CheckIcon} alt='check' />
              <Typography variant="p">No Liquidity Remaining</Typography>
            </Stack>
            :
            <GoButton onClick={() => onMoveTab(0)}><Typography variant="p_lg">Withdraw Liquidity</Typography></GoButton>
          }
        </StackWithBorder>
      </Box>
      <Box>
        <Box>
          <Typography variant='p_lg'>Step 2: Pay Entire ILD Balance</Typography>
          <InfoTooltip title={TooltipTexts.entireILDBalance} color="#8988a3" />
        </Box>
        <StackWithBorder direction='row' justifyContent='space-between'>
          <Typography variant='p_lg' color={ildBalance > 0 ? '#fff' : '#8988a3'}>
            ${formatLocaleAmount(ildBalance, 8)}</Typography>

          {ildBalance === 0 ?
            <Stack direction='row' gap={1} alignItems='center'>
              <Image src={CheckIcon} alt='check' />
              <Typography variant="p">No ILD Remaining</Typography>
            </Stack>
            :
            <GoButton onClick={() => onMoveTab(1)}><Typography variant="p_lg">Pay ILD</Typography></GoButton>
          }
        </StackWithBorder>
      </Box>
      <Box>
        <Box>
          <Typography variant='p_lg'>Step 3: Claim All Rewards</Typography>
          <InfoTooltip title={TooltipTexts.claimAllRewards} color="#8988a3" />
        </Box>
        <StackWithBorder direction='row' justifyContent='space-between'>
          <Typography variant='p_lg' color={remainRewards > 0 ? '#fff' : '#8988a3'}>
            ${formatLocaleAmount(remainRewards, 8)}</Typography>
          {remainRewards === 0 ?
            <Stack direction='row' gap={1} alignItems='center'>
              <Image src={CheckIcon} alt='check' />
              <Typography variant="p">No Reward Remaining</Typography>
            </Stack>
            :
            <GoButton onClick={() => onMoveTab(2)}><Typography variant="p_lg">Claim Rewards</Typography></GoButton>
          }
        </StackWithBorder>
      </Box>

      <Box>
        <Typography variant='p_lg'>Step 4 (Final Step): Close This Liquidity Position</Typography>
      </Box>

      {isSubmitting ?
        <Box display='flex' justifyContent='center' my='15px'>
          <LoadingButton width='100%' height='52px' />
        </Box>
        :
        <SubmitButton onClick={() => handleClosePosition()} disabled={!isValidClose}>
          <Typography variant='p_xlg'>{isValidClose ? 'Close This Liquidity Position' : 'Please Complete Step 1,2, and 3'}</Typography>
        </SubmitButton>
      }
    </>
  ) : <></>
}

const StackWithBorder = styled(Stack)`
  width: 100%;
  height: 60px;
  margin-top: 4px;
  margin-bottom: 12px;
  border-radius: 10px;
  align-items: center;
  gap: 10px;
  padding: 15px;
  border: solid 1px ${(props) => props.theme.basis.plumFuzz};
`
const GoButton = styled(SubmitButton)`
  width: 160px;
  height: 40px;
  text-wrap: nowrap;
`

export default withSuspense(ClosePosition, <LoadingProgress />)