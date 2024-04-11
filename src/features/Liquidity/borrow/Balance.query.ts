import { useQuery } from '@tanstack/react-query'
import { PublicKey } from '@solana/web3.js'
import { CLONE_TOKEN_SCALE, CloneClient } from "clone-protocol-sdk/sdk/src/clone"
import { useClone } from '~/hooks/useClone'
import { REFETCH_CYCLE } from '~/components/Common/DataLoadingIndicator'
import { getCollateralAccount } from '~/utils/token_accounts'
import { useAnchorWallet } from '@solana/wallet-adapter-react'
import { getTokenAccount } from '~/utils/token_accounts'

export const fetchBalance = async ({ program, userPubKey, index }: { program: CloneClient, userPubKey: PublicKey | null, index: number }) => {
  if (!userPubKey) return null

  console.log('fetchBalance :: Balance.query')

  let onusdVal = 0.0
  let onassetVal = 0.0
  const devnetConversionFactor = Math.pow(10, -program.clone.collateral.scale)
  const cloneConversionFactor = Math.pow(10, -CLONE_TOKEN_SCALE)
  const collateralAssociatedTokenAccountInfo = await getCollateralAccount(program);
  if (collateralAssociatedTokenAccountInfo.isInitialized) {
    const onusdBalance = await program.provider.connection.getTokenAccountBalance(collateralAssociatedTokenAccountInfo.address, "processed");
    onusdVal = Number(onusdBalance.value.amount) * devnetConversionFactor;
  }

  // if not default index
  if (index !== -1) {
    const pools = await program.getPools();
    const pool = pools.pools[index];
    const onassetTokenAccountInfo = await getTokenAccount(pool.assetInfo.onassetMint, userPubKey, program.provider.connection);
    if (onassetTokenAccountInfo.isInitialized) {
      const iassetBalance = await program.provider.connection.getTokenAccountBalance(onassetTokenAccountInfo.address, "processed");
      onassetVal = Number(iassetBalance.value.amount) * cloneConversionFactor;
    }
  }

  return {
    onusdVal,
    onassetVal
  }
}

export const fetchBalances = async ({ program, userPubKey }: { program: CloneClient, userPubKey: PublicKey | null }) => {
  if (!userPubKey) return null

  console.log('fetchBalance - onUSD')

  let balanceVal = 0.0
  try {
    const devnetConversionFactor = Math.pow(10, -program.clone.collateral.scale)
    const collateralAssociatedTokenAccountInfo = await getCollateralAccount(program);
    if (collateralAssociatedTokenAccountInfo.isInitialized) {
      const balance = await program.provider.connection.getTokenAccountBalance(collateralAssociatedTokenAccountInfo.address, "processed");
      balanceVal = Number(balance.value.amount) * devnetConversionFactor;
    }
  } catch (e) {
    console.error(e)
  }

  return {
    balanceVal,
  }
}

interface GetProps {
  userPubKey: PublicKey | null
  refetchOnMount?: boolean | "always"
  enabled?: boolean
}

export interface Balance {
  balanceVal: number
}

export function useBalanceQuery({ userPubKey, refetchOnMount, enabled = true }: GetProps) {
  const wallet = useAnchorWallet()
  const { getCloneApp } = useClone()

  if (wallet) {
    return useQuery({
      queryKey: ['cometBalance', wallet, userPubKey],
      queryFn: async () => fetchBalances({ program: await getCloneApp(wallet), userPubKey }),
      refetchOnMount,
      refetchInterval: REFETCH_CYCLE,
      refetchIntervalInBackground: true,
      enabled
    })
  } else {
    return useQuery({ queryKey: ['cometBalance'], queryFn: () => ({ balanceVal: 0 }) })
  }
}