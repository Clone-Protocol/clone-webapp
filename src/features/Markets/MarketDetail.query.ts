import { useSuspenseQueries } from "@tanstack/react-query"
import { CloneClient, fromCloneScale, fromScale } from "clone-protocol-sdk/sdk/src/clone"
import { Collateral, Status } from "clone-protocol-sdk/sdk/generated/clone"
import { assetMapping, ASSETS_DESC } from "src/data/assets"
import { REFETCH_CYCLE } from "~/components/Markets/TradingBox/RateLoadingIndicator"
import { fetchPythOraclePrices } from "~/utils/pyth"
import { getCloneClient } from "../baseQuery"
import { useAtomValue } from "jotai"
import { cloneClient, rpcEndpoint } from "../globalAtom"
import { fetchPoolAnalytics } from "~/utils/fetch_netlify"
import { AnchorProvider } from "@coral-xyz/anchor"
import { useDataLoading } from "~/hooks/useDataLoading"
import { getCollateralAccount, getTokenAccount } from "~/utils/token_accounts"
import { calculatePoolAmounts } from "clone-protocol-sdk/sdk/src/utils"

export const fetchDefaultBalance = async ({ index, setStartTimer, mainCloneClient, networkEndpoint }: { index: number, setStartTimer?: (start: boolean) => void, mainCloneClient?: CloneClient | null, networkEndpoint: string }) => {
  console.log('fetchDefaultBalance')
  // start timer in data-loading-indicator
  if (setStartTimer) {
    setStartTimer(false);
    setStartTimer(true);
  }

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
  } as DefaultBalance
}

export interface DefaultBalance {
  onusdVal: number
  onassetVal: number
  ammOnassetValue: number
  ammCollateralValue: number
}



export const fetchMarketDetail = async ({
  index,
  mainCloneClient,
  networkEndpoint
}: {
  index: number
  mainCloneClient?: CloneClient | null
  networkEndpoint: string
}) => {
  console.log('fetchMarketDetail :: MarketDetail.query')

  let program: CloneClient
  if (mainCloneClient) {
    program = mainCloneClient
  } else {
    const { cloneClient: cloneProgram } = await getCloneClient(networkEndpoint)
    program = cloneProgram
  }

  const fromCollateralScale = (n: any) => {
    return fromScale(n, program.clone.collateral.scale)
  }

  const { tickerName, tickerSymbol, tickerIcon, pythSymbol } = assetMapping(index)
  const pools = await program.getPools()
  const oracles = await program.getOracles()
  const pool = pools.pools[index]
  const poolOnassetIld = fromCloneScale(pool.onassetIld)
  const poolCollateralIld = fromCollateralScale(pool.collateralIld)
  const poolCommittedCollateral = fromCollateralScale(pool.committedCollateralLiquidity)
  const liquidityTradingFee = fromScale(pool.liquidityTradingFeeBps, 4)
  const treasuryTradingFee = fromScale(pool.treasuryTradingFeeBps, 4)
  const pythOraclePrices = await fetchPythOraclePrices(program.provider as AnchorProvider, oracles);
  const oracleUsdcPrice = pythOraclePrices[0]
  const oraclePrice = pythOraclePrices[pool.assetInfo.oracleInfoIndex]
  const committedCollateralLiquidity = fromCollateralScale(pool.committedCollateralLiquidity)
  const poolCollateral = committedCollateralLiquidity - fromCollateralScale(pool.collateralIld)
  const poolOnasset = committedCollateralLiquidity / oraclePrice - fromCloneScale(pool.onassetIld)
  const price = poolCollateral / poolOnasset
  const detailOverview = ASSETS_DESC[index].desc

  const poolAnalytics = await fetchPoolAnalytics();
  const volume = poolAnalytics[index]?.current_volume ?? 0
  const avgLiquidity = poolCommittedCollateral * 2
  const avgPremium = 100 * (price / oraclePrice - 1)

  const marketDetail: MarketDetail = {
    tickerName,
    tickerSymbol,
    tickerIcon,
    pythSymbol,
    price,
    poolOnassetIld,
    poolCollateralIld,
    poolCommittedCollateral,
    liquidityTradingFee,
    treasuryTradingFee,
    oracleUsdcPrice,
    oraclePrice,
    volume,
    avgLiquidity,
    avgPremium,
    detailOverview,
    collateral: program.clone.collateral,
    status: pool.status
  }

  return marketDetail
}

export const fetchMarketDetailDefault = (): MarketDetail => {
  return {
    tickerName: "Clone Euro",
    tickerSymbol: "clEUR",
    pythSymbol: "FX.EUR/USD",
    tickerIcon: "",
    price: 160.51,
    poolOnassetIld: 0,
    poolCollateralIld: 0,
    poolCommittedCollateral: 0,
    liquidityTradingFee: 0,
    treasuryTradingFee: 0,
    oracleUsdcPrice: 1,
    oraclePrice: 0,
    volume: 12.4,
    avgLiquidity: 50700000,
    avgPremium: 0.013,
    detailOverview:
      "clSOL, appreviated from iSolana, is a synthetic asset of Solana on Clone. Solana is one of a number of newer cryptocurrencies designed to compete with Ethereum. Like Ethereum, Solana is both a cryptocurrency and a flexible platform for running crypto apps — everything from NFT projects like Degenerate Apes to the Serum decentralized exchange (or DEX). However, it can process transactions much faster than Ethereum — around 50,000 transactions per second.",
    collateral: null,
    status: Status.Active
  }
}

interface GetProps {
  index: number
  refetchOnMount?: boolean | "always"
}

export interface MarketDetail {
  tickerName: string
  tickerSymbol: string
  tickerIcon: string
  pythSymbol: string
  price: number
  poolOnassetIld: number
  poolCollateralIld: number
  poolCommittedCollateral: number
  liquidityTradingFee: number
  treasuryTradingFee: number
  oracleUsdcPrice: number
  oraclePrice: number
  volume: number
  avgLiquidity: number
  avgPremium: number
  detailOverview: string
  collateral: Collateral | null
  status: Status
}

export interface PairData {
  tickerIcon: string
  tickerName: string
  tickerSymbol: string
}

export function useMarketDetailQuery({ index, refetchOnMount }: GetProps) {
  const { setStartTimer } = useDataLoading()
  const mainCloneClient = useAtomValue(cloneClient)
  const networkEndpoint = useAtomValue(rpcEndpoint)

  let queryFuncs = []
  queryFuncs.push({ queryKey: ["marketDetail", index], queryFn: () => fetchMarketDetail({ index, mainCloneClient, networkEndpoint }), refetchOnMount, refetchInterval: REFETCH_CYCLE, refetchIntervalInBackground: true })
  queryFuncs.push({ queryKey: ["defaultBalance", index], queryFn: () => fetchDefaultBalance({ index, setStartTimer, mainCloneClient, networkEndpoint }), refetchOnMount, refetchInterval: REFETCH_CYCLE, refetchIntervalInBackground: true })

  const data = useSuspenseQueries({
    queries: queryFuncs,
  })

  return {
    marketDetailSuspenseQuery: data[0],
    defaultBalanceSuspenseQuery: data[1]
  }
}
