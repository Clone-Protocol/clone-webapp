import { useQuery } from '@tanstack/react-query'
import { CloneClient, fromCloneScale, fromScale } from 'clone-protocol-sdk/sdk/src/clone'
import { useDataLoading } from '~/hooks/useDataLoading'
import { REFETCH_CYCLE } from '~/components/Markets/TradingBox/RateLoadingIndicator'
import { getCollateralAccount, getTokenAccount } from '~/utils/token_accounts'
import { fetchPythOraclePrices } from "~/utils/pyth"
import { getCloneClient } from '../baseQuery'
import { useAtomValue } from 'jotai'
import { cloneClient, rpcEndpoint } from '~/features/globalAtom'
import { calculatePoolAmounts } from 'clone-protocol-sdk/sdk/src/utils'
import { AnchorProvider } from '@coral-xyz/anchor'

export const fetchBalance = async ({ index, setStartTimer, mainCloneClient, networkEndpoint }: { index: number, setStartTimer: (start: boolean) => void, mainCloneClient?: CloneClient | null, networkEndpoint: string }) => {
  console.log('fetchBalance')
  // start timer in data-loading-indicator
  setStartTimer(false);
  setStartTimer(true);

  let program
  if (mainCloneClient) {
    program = mainCloneClient
  } else {
    const { cloneClient: cloneProgram } = await getCloneClient(networkEndpoint)
    program = cloneProgram
  }

  let onusdVal = 0.0
  let onassetVal = 0.0
  let ammOnassetValue;
  let ammCollateralValue;

  const [pools, oracles, collateralAtaResult] = await Promise.allSettled([
    program.getPools(), program.getOracles(), getCollateralAccount(program)
  ]);

  try {
    if (collateralAtaResult.status === 'fulfilled' && collateralAtaResult.value.isInitialized) {
      const onusdBalance = await program.provider.connection.getTokenAccountBalance(collateralAtaResult.value.address, "processed")
      onusdVal = Number(onusdBalance.value.amount) / 10000000;
    }
  } catch (e) {
    console.error(e)
  }

  try {
    if (pools.status === 'fulfilled' && oracles.status === 'fulfilled') {
      const pool = pools.value.pools[index]
      const associatedTokenAccountInfo = await getTokenAccount(
        pool.assetInfo.onassetMint,
        program.provider.publicKey!,
        program.provider.connection
      );
      const collateralScale = program.clone.collateral.scale

      if (associatedTokenAccountInfo.isInitialized) {
        const onassetBalance = await program.provider.connection.getTokenAccountBalance(associatedTokenAccountInfo.address, "processed")
        onassetVal = Number(onassetBalance.value.amount) / 10000000;
      }
      const pythOraclePrices = await fetchPythOraclePrices(program.provider as AnchorProvider, oracles.value);
      const oraclePrice = pythOraclePrices[pool.assetInfo.oracleInfoIndex]
      const { poolCollateral, poolOnasset } = calculatePoolAmounts(
        fromScale(pool.collateralIld, collateralScale),
        fromCloneScale(pool.onassetIld),
        fromScale(pool.committedCollateralLiquidity, collateralScale),
        oraclePrice,
        program.clone.collateral
      )

      ammOnassetValue = poolOnasset
      ammCollateralValue = poolCollateral
    }
  } catch (e) {
    console.error(e)
  }

  return {
    onusdVal,
    onassetVal,
    ammOnassetValue,
    ammCollateralValue
  }
}

interface GetProps {
  index: number
  refetchOnMount?: boolean | "always"
  enabled?: boolean
}

export interface Balance {
  onusdVal: number
  onassetVal: number
  ammOnassetValue: number
  ammCollateralValue: number
}

export function useBalanceQuery({ index, refetchOnMount, enabled = true }: GetProps) {
  const { setStartTimer } = useDataLoading()
  const mainCloneClient = useAtomValue(cloneClient)
  const networkEndpoint = useAtomValue(rpcEndpoint)

  return useQuery({
    queryKey: ['balance', index],
    queryFn: () => fetchBalance({ index, setStartTimer, mainCloneClient, networkEndpoint }),
    refetchOnMount,
    refetchInterval: REFETCH_CYCLE,
    refetchIntervalInBackground: true,
    enabled
  })
}
