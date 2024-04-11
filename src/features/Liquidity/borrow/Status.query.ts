import { useQuery } from '@tanstack/react-query'
import { PublicKey } from '@solana/web3.js'
import { CloneClient, fromCloneScale } from "clone-protocol-sdk/sdk/src/clone"
import { useClone } from '~/hooks/useClone'
import { REFETCH_CYCLE } from '~/components/Common/DataLoadingIndicator'
import { fromScale } from 'clone-protocol-sdk/sdk/src/clone'
import { useAnchorWallet } from '@solana/wallet-adapter-react'

export const fetchStatus = async ({ program, userPubKey }: { program: CloneClient, userPubKey: PublicKey | null }) => {
  if (!userPubKey) return null

  console.log('fetchStatus')

  let totalCometLiquidity = 0;
  let totalCometValLocked = 0;
  let totalBorrowLiquidity = 0;
  let totalBorrowCollateralVal = 0;

  const [poolsData, oraclesData, userAccountData] = await Promise.allSettled([
    program.getPools(),
    program.getOracles(),
    program.getUserAccount()
  ]);

  if (poolsData.status === "rejected" || oraclesData.status === "rejected") {
    throw new Error("couldn't fetch token data!")
  }
  const pools = poolsData.value!;

  if (userAccountData.status === "fulfilled") {
    const borrowPositions = userAccountData.value.borrows;
    for (var i = 0; i < Number(borrowPositions.length); i++) {
      const borrowPosition = borrowPositions[i]
      const collateralAmount = fromScale(borrowPosition.collateralAmount, program.clone.collateral.scale)
      totalBorrowCollateralVal += collateralAmount
      const pool = pools.pools[borrowPosition.poolIndex];
      const oracle = oraclesData.value.oracles[Number(pool.assetInfo.oracleInfoIndex)];
      totalBorrowLiquidity += fromCloneScale(borrowPosition.borrowedOnasset) * fromScale(oracle.price, oracle.expo);
    }

    const comet = userAccountData.value.comet
    const onusdValue = Number(comet.collateralAmount)
    totalCometValLocked += onusdValue

    comet.positions.slice(0, comet.positions.length).forEach((pos) => {
      totalCometLiquidity += fromScale(pos.committedCollateralLiquidity, program.clone.collateral.scale) * 2
    });
  }

  const totalCollateralLocked = totalBorrowCollateralVal + totalCometValLocked
  const totalLiquidityProvided = totalBorrowLiquidity + totalCometLiquidity
  const borrowPercent = totalCollateralLocked > 0 ? (totalBorrowCollateralVal / totalCollateralLocked) * 100 : 0

  const statusValues = {
    totalBorrowLiquidity,
    totalBorrowCollateralVal,
    totalLiquidityProvided
  }

  return {
    totalCollateralLocked,
    borrow: totalBorrowCollateralVal,
    borrowPercent,
    comet: totalCometValLocked,
    liquidated: 0,
    statusValues
  }
}

interface GetProps {
  userPubKey: PublicKey | null
  refetchOnMount?: boolean | "always"
  enabled?: boolean
}

interface StatusValues {
  totalBorrowLiquidity: number
  totalBorrowCollateralVal: number
  totalLiquidityProvided: number
}

export interface Status {
  totalCollateralLocked: number
  borrow: number
  borrowPercent: number
  comet: number
  liquidated: number
  statusValues: StatusValues
}

export function useStatusQuery({ userPubKey, refetchOnMount, enabled = true }: GetProps) {
  const wallet = useAnchorWallet()
  const { getCloneApp } = useClone()

  if (wallet) {
    return useQuery({
      queryKey: ['statusData', wallet, userPubKey],
      queryFn: async () => fetchStatus({ program: await getCloneApp(wallet), userPubKey }),
      refetchOnMount,
      refetchInterval: REFETCH_CYCLE,
      refetchIntervalInBackground: true,
      enabled
    })
  } else {
    return useQuery({
      queryKey: ['statusData'], queryFn: () => { return null }
    })
  }
}