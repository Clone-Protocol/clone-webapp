import { useQuery } from "@tanstack/react-query"
import { PublicKey } from "@solana/web3.js"
import { CloneClient } from "clone-protocol-sdk/sdk/src/clone"
import { useClone } from "~/hooks/useClone"
import { REFETCH_CYCLE } from "~/components/Common/DataLoadingIndicator"
import { getAggregatedPoolStats, getiAssetInfos } from '~/utils/assets';
import { AssetType, assetMapping } from "~/data/assets"
import { useAnchorWallet } from "@solana/wallet-adapter-react"

export const fetchPools = async ({
  program,
  userPubKey,
  noFilter,
}: {
  program: CloneClient
  userPubKey: PublicKey | null
  noFilter: boolean
}) => {
  if (!userPubKey) return []
  console.log("fetchPools :: LiquidityPools.query")

  const [poolsData, userAccountData] = await Promise.allSettled([
    program.getPools(),
    program.getUserAccount(),
  ])
  if (poolsData.status === "rejected" || userAccountData.status === "rejected") {
    throw new Error("Couldn't fetch data!")
  }
  const pools = poolsData.value
  const comet = userAccountData.value.comet
  const assetInfos = await getiAssetInfos(program.provider.connection, program)
  const poolStats = await getAggregatedPoolStats(pools, userPubKey)
  const currentPoolSet = new Set()

  for (let i = 0; i < Number(comet.positions.length); i++) {
    const poolIndex = Number(comet.positions[i].poolIndex)
    currentPoolSet.add(poolIndex)
  }

  const result = []
  for (const asset of assetInfos) {
    if (!noFilter && currentPoolSet.has(asset.poolIndex)) {
      continue
    }
    const { tickerIcon, tickerSymbol, tickerName, assetType } = assetMapping(asset.poolIndex)
    const stats = poolStats[asset.poolIndex]
    result.push({
      id: asset.poolIndex,
      assetType,
      tickerName,
      tickerSymbol,
      tickerIcon,
      totalLiquidity: asset.liquidity,
      volume24H: stats.volumeUSD,
      averageAPY: stats.apy,
      isEnabled: true,
    })
  }

  return result
}

interface GetPoolsProps {
  userPubKey: PublicKey | null
  refetchOnMount?: boolean | "always"
  enabled?: boolean
  searchTerm: string
  noFilter?: boolean
}

export interface PoolList {
  id: number
  tickerSymbol: string
  tickerIcon: string
  totalLiquidity: number
  volume24H: number
  averageAPY: number
  isEnabled: boolean
}

export function useLiquidityPoolsQuery({
  userPubKey,
  refetchOnMount,
  enabled = true,
  searchTerm,
  noFilter = true,
}: GetPoolsProps) {
  const wallet = useAnchorWallet()
  const { getCloneApp } = useClone()

  if (wallet) {
    return useQuery({
      queryKey: ["liquidityPools", wallet, userPubKey],
      queryFn: async () => fetchPools({ program: await getCloneApp(wallet), userPubKey, noFilter }),
      refetchOnMount,
      refetchInterval: REFETCH_CYCLE,
      refetchIntervalInBackground: true,
      enabled,
      select: (assets) => {
        let filteredAssets = assets
        if (filteredAssets) {
          filteredAssets = filteredAssets.filter((asset) => {
            return asset.assetType === AssetType.Crypto || asset.assetType === AssetType.Commodities
          })
        }
        if (filteredAssets && searchTerm && searchTerm.length > 0) {
          filteredAssets = filteredAssets.filter((asset) => asset.tickerName.toLowerCase().includes(searchTerm.toLowerCase()) || asset.tickerSymbol.toLowerCase().includes(searchTerm.toLowerCase()))
        }

        return filteredAssets
      }
    }
    )
  } else {
    return useQuery({ queryKey: ["liquidityPools"], queryFn: () => [] })
  }
}
