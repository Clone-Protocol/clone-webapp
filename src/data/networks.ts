export const CURRENT_NETWORK = process.env.NEXT_PUBLIC_USE_NETWORK

export const DEVNET_PUBLIC = 'https://dev-markets.clone.so'
export const MAINNET_PUBLIC = 'https://markets.clone.so'

export type RPCType = {
  rpc_name: string
  rpc_url: string
}

export const DEV_RPCs: RPCType[] = [
  {
    rpc_name: 'Triton RPC',
    rpc_url: process.env.NEXT_PUBLIC_NETWORK_ENDPOINT_TRITON!,
  },
  {
    rpc_name: 'Helius RPC',
    rpc_url: process.env.NEXT_PUBLIC_NETWORK_ENDPOINT_HELIUS!,  //clusterApiUrl(WalletAdapterNetwork.Mainnet) 
  },
  {
    rpc_name: 'Quicknode RPC',
    rpc_url: process.env.NEXT_PUBLIC_NETWORK_ENDPOINT_QUICKNODE!,
  },
]

export const MAIN_RPCs: RPCType[] = [
  {
    rpc_name: 'Triton RPC',
    rpc_url: process.env.NEXT_PUBLIC_NETWORK_ENDPOINT_TRITON!,
  },
  {
    rpc_name: 'Helius RPC',
    rpc_url: process.env.NEXT_PUBLIC_NETWORK_ENDPOINT_HELIUS!,  //clusterApiUrl(WalletAdapterNetwork.Mainnet) 
  },
  {
    rpc_name: 'Quicknode RPC',
    rpc_url: process.env.NEXT_PUBLIC_NETWORK_ENDPOINT_QUICKNODE!,
  },
]

export const CUSTOM_RPC_INDEX = DEV_RPCs.length

export const IS_DEV = CURRENT_NETWORK === "DEV_NET"

export const getTxnURL = (txHash: string) => {
  let cluster = (() => {
    let network = CURRENT_NETWORK;
    if (network === "DEV_NET") {
      return 'devnet-qn1'
    }
    if (network === "MAIN_NET") {
      return 'mainnet-qn1'
    }
    throw new Error(`Network ${network} not yet supported!`)
  })();

  // return `https://solana.fm/tx/${txHash}?cluster=${cluster}`
  return `https://solscan.io/tx/${txHash}`
}

export type FeeLevel = "min" | "low" | "medium" | "high" | "veryHigh" | "unsafeMax"

export type PriorityFeeType = {
  fee_name: string
  fee_level: FeeLevel
}

export const DEFAULT_PRIORITY_FEE_INDEX = 2

export const PRIORITY_FEES: PriorityFeeType[] = [
  {
    fee_name: "Min",
    fee_level: "min"
  },
  {
    fee_name: "Normal",
    fee_level: "high"
  },
  {
    fee_name: "High",
    fee_level: "veryHigh"
  },
  {
    fee_name: "Max",
    fee_level: "unsafeMax"
  },
]