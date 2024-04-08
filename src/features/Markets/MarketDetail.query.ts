import { QueryObserverOptions, useQuery } from "@tanstack/react-query"
import { CloneClient, fromCloneScale, fromScale } from "clone-protocol-sdk/sdk/src/clone"
import { Collateral, Status } from "clone-protocol-sdk/sdk/generated/clone"
import { assetMapping, ASSETS_DESC } from "src/data/assets"
import { REFETCH_CYCLE } from "~/components/Markets/TradingBox/RateLoadingIndicator"
import { getPythOraclePrices } from "~/utils/pyth"
import { getCloneClient } from "../baseQuery"
import { useAtomValue } from "jotai"
import { cloneClient, rpcEndpoint } from "../globalAtom"
import { fetchPoolAnalytics } from "~/utils/fetch_netlify"

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
  const oracle = oracles.oracles[pool.assetInfo.oracleInfoIndex]
  const poolOnassetIld = fromCloneScale(pool.onassetIld)
  const poolCollateralIld = fromCollateralScale(pool.collateralIld)
  const poolCommittedCollateral = fromCollateralScale(pool.committedCollateralLiquidity)
  const liquidityTradingFee = fromScale(pool.liquidityTradingFeeBps, 4)
  const treasuryTradingFee = fromScale(pool.treasuryTradingFeeBps, 4)
  const oraclePrices = await getPythOraclePrices(program.provider.connection);
  const rescaleFactor = Math.pow(10, oracle.rescaleFactor);
  const oracleUsdcPrice = oraclePrices.get("Crypto.USDC/USD")!
  const oraclePrice = rescaleFactor * oraclePrices.get(pythSymbol)! / oracleUsdcPrice;
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
  enabled?: boolean
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

export function useMarketDetailQuery({ index, refetchOnMount, enabled = true }: GetProps) {
  const mainCloneClient = useAtomValue(cloneClient)
  const networkEndpoint = useAtomValue(rpcEndpoint)
  let queryFunc
  try {
    queryFunc = () => fetchMarketDetail({ index, mainCloneClient, networkEndpoint })
  } catch (e) {
    console.error(e)
    queryFunc = () => fetchMarketDetailDefault()
  }

  return useQuery({
    queryKey: ["marketDetail", index],
    queryFn: queryFunc,
    refetchOnMount,
    refetchInterval: REFETCH_CYCLE,
    refetchIntervalInBackground: true,
    enabled,
  })
}
