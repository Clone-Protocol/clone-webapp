import { ON_USD } from "~/utils/constants"
import { IS_DEV } from "./networks"

export enum Collateral {
    onUSD,
    mockUSDC,
}

export enum AssetTickers {
    arbitrum = 0,
    optimism = 1,
    sui = 2,
    doge = 3,
}

export enum Asset {
    Arbitrum,
    Optimism,
    Sui,
    Doge
}

export enum AssetType {
    Crypto,
    Commodities,
}

export const DEFAULT_ASSET_ID = AssetTickers.arbitrum
export const DEFAULT_ASSET_LINK = "/trade/arbitrum"

//@MEMO: to add more asset, need to adjust here
export const MAX_POOLS_FOR_SHOW = 4

export const ASSETS = [
    {
        tickerName: 'Cloned Arbitrum',
        tickerSymbol: 'clARB',
        tickerIcon: '/images/assets/on-arb.svg',
        ticker: 'arbitrum',
        pythSymbol: 'Crypto.ARB/USD',
        mainColor: '#277DC7',
    },
    {
        tickerName: 'Cloned Optimism',
        tickerSymbol: 'clOP',
        tickerIcon: '/images/assets/on-op.svg',
        ticker: 'optimism',
        pythSymbol: 'Crypto.OP/USD',
        mainColor: '#e24e4c',
    },
    {
        tickerName: 'Cloned Sui',
        tickerSymbol: 'clSUI',
        tickerIcon: '/images/assets/on-sui.svg',
        ticker: 'sui',
        pythSymbol: 'Crypto.SUI/USD',
        mainColor: '#6FBCF0',
    },
    {
        tickerName: 'Cloned Doge',
        tickerSymbol: 'clDOGE',
        tickerIcon: '/images/assets/on-doge.svg',
        ticker: 'doge',
        pythSymbol: 'Crypto.DOGE/USD',
        mainColor: '#D9BD62',
    }
]

export const assetMapping = (index: number) => {
    let tickerName = ''
    let tickerSymbol = ''
    let tickerIcon = ''
    let ticker = ''
    let assetType: number
    let pythSymbol = ''
    let supabaseSymbol = ''
    switch (index) {
        case Asset.Arbitrum:
            tickerName = 'Cloned Arbitrum'
            tickerSymbol = 'clARB'
            tickerIcon = '/images/assets/on-arb.svg'
            ticker = 'arbitrum'
            assetType = AssetType.Crypto
            pythSymbol = 'Crypto.ARB/USD'
            supabaseSymbol = pythSymbol
            break
        case Asset.Optimism:
            tickerName = 'Cloned Optimism'
            tickerSymbol = 'clOP'
            tickerIcon = '/images/assets/on-op.svg'
            ticker = 'optimism'
            assetType = AssetType.Crypto
            pythSymbol = 'Crypto.OP/USD'
            supabaseSymbol = pythSymbol
            break
        case Asset.Sui:
            tickerName = 'Cloned Sui'
            tickerSymbol = 'clSUI'
            tickerIcon = '/images/assets/on-sui.svg'
            ticker = 'sui'
            assetType = AssetType.Crypto
            pythSymbol = 'Crypto.SUI/USD'
            supabaseSymbol = pythSymbol
            break
        case Asset.Doge:
            tickerName = 'Cloned Doge'
            tickerSymbol = 'clDOGE'
            tickerIcon = '/images/assets/on-doge.svg'
            ticker = 'doge'
            assetType = AssetType.Crypto
            pythSymbol = 'Crypto.DOGE/USD'
            supabaseSymbol = pythSymbol
            break
        default:
            throw new Error('Not supported')
    }

    return { tickerName, tickerSymbol, tickerIcon, ticker, assetType, pythSymbol, supabaseSymbol }
}

export const collateralMapping = (index: number) => {
    let collateralName = ''
    let collateralSymbol = ''
    let collateralIcon = ''
    let collateralType: number
    switch (index) {
        case Collateral.onUSD:
            collateralName = IS_DEV ? 'Clone USD' : 'USD Coin'
            collateralType = Collateral.onUSD
            collateralSymbol = ON_USD
            collateralIcon = IS_DEV ? '/images/assets/on-usd.svg' : '/images/assets/usdc.svg'
            break
        case Collateral.mockUSDC:
            collateralName = 'USD Coin'
            collateralType = Collateral.mockUSDC
            collateralSymbol = 'USDC'
            collateralIcon = '/images/assets/usdc.svg'
            break
        default:
            throw new Error('Not supported')
    }

    return { collateralName, collateralSymbol, collateralIcon, collateralType }
}

export const ASSETS_DESC = [
    {
        ticker: 'arbitrum',
        desc: "clARB represents the cloned asset of Arbitrum (ARB) on Solana, showcasing a sophisticated Layer 2 scaling solution for Ethereum. Arbitrum, known for its efficient multi-round fraud detection and flexible Arbitrum Virtual Machine (AVM), offers enhanced security and a wide range of application support. clARB brings the robustness of Arbitrum's Ethereum scaling solution to Solana traders, merging Ethereum's expansive DeFi capabilities with Solana's rapid and cost-effective blockchain."
    },
    {
        ticker: 'optimism',
        desc: "clOP is the cloned asset of Optimism (OP), a key Layer 2 solution that enhances Ethereum's scalability. Known for its single-round fraud proof system and high transaction speeds, Optimism ensures swift and cost-effective Ethereum transactions. clOP offers Solana traders a unique opportunity to trade OP natively, benefiting from the efficiencies of both the Optimism and Solana ecosystems."
    },
    {
        ticker: 'sui',
        desc: "clSUI, the cloned asset of SUI, offers traders exposure to SUI token without ever leaving the Solana ecosystem. The Sui blockchain is known for its high throughput and low latency. Built on the Move language, Sui supports secure and sophisticated dApps. clSUI provides Solana users with the ability to natively trade SUI, capitalizing on the advantages of both the Sui and Solana ecosystems."
    },
    {
        ticker: 'doge',
        desc: "clDOGE brings the quintessential memecoin, Dogecoin (DOGE), into the Solana ecosystem. Dogecoin embodies the original spirit of crypto, combining innovation and memes! Celebrated for its vibrant community, Dogecoin transcends its role as a digital currency to become a symbol of the playful and community-driven nature of the crypto space. clDOGE offers Solana traders the chance to engage with the legendary DOGE within Solana’s high-speed, low-cost environment."
    },
]