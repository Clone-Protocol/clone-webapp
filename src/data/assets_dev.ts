import { ON_USD } from "~/utils/constants"
import { IS_DEV } from "./networks"

export enum Collateral {
    onUSD,
    mockUSDC,
}

export enum AssetTickers {
    euro = 0,
    gold = 1,
    solana = 2,
    ethereum = 3,
    bitcoin = 4,
    cosmos = 5,
    avalanche = 6,
    sui = 7,
    aptos = 8,
    cardano = 9,
}

export enum Asset {
    Euro,
    Gold,
    Solana,
    Ethereum,
    Bitcoin,
    Cosmos,
    Avalanche,
    Sui,
    Aptos,
    Cardano,
}

export enum AssetType {
    Crypto,
    Fx,
    Commodities,
}

export const ASSETS = [
    {
        tickerName: 'Clone Euro',
        tickerSymbol: 'clEUR',
        tickerIcon: '/images/assets/on-euro.svg',
        ticker: 'euro',
        pythSymbol: 'FX.EUR/USD'
    },
    {
        tickerName: 'Clone Gold',
        tickerSymbol: 'clGOLD',
        tickerIcon: '/images/assets/on-gold.svg',
        ticker: 'gold',
        pythSymbol: 'Metal.XAU/USD'
    },
    {
        tickerName: 'Clone Solana',
        tickerSymbol: 'clSOL',
        tickerIcon: '/images/assets/on-sol.svg',
        ticker: 'solana',
        pythSymbol: 'Crypto.SOL/USD'
    },
    {
        tickerName: 'Clone Ethereum',
        tickerSymbol: 'clETH',
        tickerIcon: '/images/assets/on-eth.svg',
        ticker: 'ethereum',
        pythSymbol: 'Crypto.ETH/USD'
    },
    {
        tickerName: 'Clone Bitcoin',
        tickerSymbol: 'clBTC',
        tickerIcon: '/images/assets/on-btc.svg',
        ticker: 'bitcoin',
        pythSymbol: 'Crypto.BTC/USD'
    },
    {
        tickerName: 'Clone Cosmos',
        tickerSymbol: 'clATOM',
        tickerIcon: '/images/assets/on-atom.svg',
        ticker: 'cosmos',
        pythSymbol: 'Crypto.ATOM/USD'
    },
    {
        tickerName: 'Clone Avalanche',
        tickerSymbol: 'clAVAX',
        tickerIcon: '/images/assets/on-avax.svg',
        ticker: 'avalanche',
        pythSymbol: 'Crypto.AVAX/USD'
    },
    {
        tickerName: 'Clone Sui',
        tickerSymbol: 'clSUI',
        tickerIcon: '/images/assets/on-sui.svg',
        ticker: 'sui',
        pythSymbol: 'Crypto.SUI/USD'
    },
    {
        tickerName: 'Clone Aptos',
        tickerSymbol: 'clAPT',
        tickerIcon: '/images/assets/on-apt.svg',
        ticker: 'aptos',
        pythSymbol: 'Crypto.APT/USD'
    },
    {
        tickerName: 'Clone Cardano',
        tickerSymbol: 'clADA',
        tickerIcon: '/images/assets/on-ada.svg',
        ticker: 'cardano',
        pythSymbol: 'Crypto.ADA/USD'
    },
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
        case Asset.Euro:
            tickerName = 'Clone Euro'
            tickerSymbol = 'clEUR'
            tickerIcon = '/images/assets/on-euro.svg'
            ticker = 'euro'
            assetType = AssetType.Fx
            pythSymbol = 'FX.EUR/USD'
            supabaseSymbol = pythSymbol
            break
        case Asset.Gold:
            tickerName = 'Clone Gold'
            tickerSymbol = 'clGOLD'
            tickerIcon = '/images/assets/on-gold.svg'
            ticker = 'gold'
            assetType = AssetType.Commodities
            pythSymbol = 'Metal.XAU/USD'
            supabaseSymbol = pythSymbol
            break
        case Asset.Solana:
            tickerName = 'Clone Solana'
            tickerSymbol = 'clSOL'
            tickerIcon = '/images/assets/on-sol.svg'
            ticker = 'solana'
            assetType = AssetType.Crypto
            pythSymbol = 'Crypto.SOL/USD'
            supabaseSymbol = pythSymbol
            break
        case Asset.Ethereum:
            tickerName = 'Clone Ethereum'
            tickerSymbol = 'clETH'
            tickerIcon = '/images/assets/on-eth.svg'
            ticker = 'ethereum'
            assetType = AssetType.Crypto
            pythSymbol = 'Crypto.ETH/USD'
            supabaseSymbol = pythSymbol
            break
        case Asset.Bitcoin:
            tickerName = 'Clone Bitcoin'
            tickerSymbol = 'clBTC'
            tickerIcon = '/images/assets/on-btc.svg'
            ticker = 'bitcoin'
            assetType = AssetType.Crypto
            pythSymbol = 'Crypto.BTC/USD'
            supabaseSymbol = pythSymbol
            break
        case Asset.Cosmos:
            tickerName = 'Clone Cosmos'
            tickerSymbol = 'clATOM'
            tickerIcon = '/images/assets/on-atom.svg'
            ticker = 'cosmos'
            assetType = AssetType.Crypto
            pythSymbol = 'Crypto.ATOM/USD'
            supabaseSymbol = pythSymbol
            break
        case Asset.Avalanche:
            tickerName = 'Clone Avalanche'
            tickerSymbol = 'clAVAX'
            tickerIcon = '/images/assets/on-avax.svg'
            ticker = 'avalanche'
            assetType = AssetType.Crypto
            pythSymbol = 'Crypto.AVAX/USD'
            supabaseSymbol = pythSymbol
            break
        case Asset.Sui:
            tickerName = 'Clone Sui'
            tickerSymbol = 'clSUI'
            tickerIcon = '/images/assets/on-sui.svg'
            ticker = 'sui'
            assetType = AssetType.Crypto
            pythSymbol = 'Crypto.SUI/USD'
            supabaseSymbol = pythSymbol
            break
        case Asset.Aptos:
            tickerName = 'Clone Aptos'
            tickerSymbol = 'clAPT'
            tickerIcon = '/images/assets/on-apt.svg'
            ticker = 'aptos'
            assetType = AssetType.Crypto
            pythSymbol = 'Crypto.APT/USD'
            supabaseSymbol = pythSymbol
            break
        case Asset.Cardano:
            tickerName = 'Clone Cardano'
            tickerSymbol = 'clADA'
            tickerIcon = '/images/assets/on-ada.svg'
            ticker = 'cardano'
            assetType = AssetType.Crypto
            pythSymbol = 'Crypto.ADA/USD'
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
            collateralIcon = '/images/assets/on-usd.svg'
            break
        case Collateral.mockUSDC:
            collateralName = 'USD Coin'
            collateralType = Collateral.mockUSDC
            collateralSymbol = 'USDC'
            collateralIcon = '/images/assets/on-usd.svg'
            break
        default:
            throw new Error('Not supported')
    }

    return { collateralName, collateralSymbol, collateralIcon, collateralType }
}

export const ASSETS_DESC = [
    {
        ticker: 'euro',
        desc: "clEUR is a cloned asset on Clone that represents the Euro, the official currency for 20 of the 27 countries in the European Union (EU), which is overseen by the European Central Bank and the Eurosystem. The Euro is a major global currency and plays a crucial role in international trading and finance. With the creation of clEUR, Clone aims to allow traders to gain exposure to the Euro's economic dynamics and price movements on the Solana blockchain. The Eurozone, the region that uses the Euro, is one of the largest economic areas in the world, which includes several strong economies such as Germany and France. Changes in the Euro's value can reflect shifts in monetary policy, political developments, and macroeconomic trends within these countries. Trading clEUR on Clone allows users to speculate on the Euro's value and hedge against potential volatility in the original asset, without needing to physically hold or transact with the currency itself."
    },
    {
        ticker: 'gold',
        desc: "clGold is a cloned asset on Clone that represents gold, one of the oldest and most reliable stores of value known to man. For millennia, gold has served as a medium of exchange, a unit of account, and a store of value, remaining a coveted asset for investors looking for wealth preservation, inflation hedge, and portfolio diversification. Its demand transcends geographical boundaries, and its value is not tied to any single currency or economy, but is globally recognized. With clGold, Clone brings the attributes of this precious metal onto the Solana blockchain, opening doors for traders to gain exposure to gold's price dynamics without needing to physically hold or transact with the metal itself. Trading clGold on Clone not only allows users to speculate on the price of gold, but also offers a hedge against market volatility and macroeconomic uncertainties, which are often marked by an increase in gold's value."
    },
    {
        ticker: 'solana',
        desc: "clSOL is a cloned asset on Clone that corresponds to Solana (SOL), an innovative high-performance, open-source project that utilizes a unique timestamp system to offer fast and secure decentralized applications and crypto operations. The Solana blockchain was designed from the ground up to support thousands of transactions per second, and has attracted considerable attention in the crypto world for its scalability and speed. Solana’s native cryptocurrency, SOL, plays a key role in maintaining and operating the Solana ecosystem and its various functionalities. Trading clSOL on Clone gives users an alternative way speculate on Solana's future price movements. For traders, this offers an opportunity to engage with Solana’s growth narrative within the same high-performance environment that Clone operates, showcasing the symbiotic relationship between our platform and the robust Solana ecosystem."
    },
    {
        ticker: 'ethereum',
        desc: "clETH is a cloned asset on Clone representing Ethereum, one of the most influential blockchain platforms to date. Ethereum introduced smart contracts to the blockchain world, ushering in a new era of decentralized applications (dApps). Ethereum's native currency, Ether (ETH), is used to power these smart contracts and to reward network participants. Ethereum has positioned itself as a primary platform for many significant trends in the digital asset space, including Decentralized Finance (DeFi) and Non-Fungible Tokens (NFTs). The platform's ongoing shift from Proof of Work (PoW) to Proof of Stake (PoS) consensus through Ethereum 2.0 bring attention to its token economics and scalability solutions. Trading clETH on Clone allows users to gain exposure to Ethereum's market dynamics without the need to own ETH directly. Traders can speculate on Ethereum's future potential and the adoption of its cutting-edge technologies, while participating in the efficient, high-speed trading environment offered by Clone on Solana."
    },
    {
        ticker: 'bitcoin',
        desc: "clBTC is a cloned asset on Clone that represents Bitcoin, the pioneering cryptocurrency that instigated the blockchain revolution. Introduced in 2009 by an anonymous entity named Satoshi Nakamoto, Bitcoin has since then been a linchpin in the digital asset market, commanding significant value and influence. Known as 'digital gold', Bitcoin's decentralized, peer-to-peer nature presents it as an attractive store of value and a hedge against inflation. Its price movements have been historically significant, often defining the mood for the broader cryptocurrency market. Trading clBTC on Clone provides traders with exposure to Bitcoin's value without having to own the digital currency directly. This facilitates speculation on Bitcoin's evolving role in the digital economy and its long-term value proposition. Considering Bitcoin's dominance, trading clBTC can be an integral part of a well-diversified digital asset portfolio. Clone, built on Solana, ensures that trading clBTC is a seamless, efficient, and scalable experience."
    },
    {
        ticker: 'cosmos',
        desc: "clATOM is a cloned asset on Clone that represents Cosmos (ATOM), a blockchain ecosystem designed to solve interoperability and scalability issues in the blockchain industry. Cosmos enables different blockchains to communicate and transact with one another in a decentralized way, a fundamental infrastructure development in the realm of blockchain technology. Trading clATOM on Clone allows traders to partake in the Cosmos ecosystem's potential growth and development, reflecting the progress and adoption of interoperability in blockchain technology. Through its unique Tendermint consensus and Inter-Blockchain Communication (IBC) protocol, Cosmos fosters a scalable and interoperable blockchain network that hosts a wide variety of applications and crypto-assets. In this context, clATOM serves as a gateway for traders to gain exposure to this pivotal advancement in blockchain technology, facilitating participation in the Cosmos network's evolving story. Built on Solana, Clone ensures a smooth, efficient, and scalable trading experience for clATOM, further enhancing its appeal for traders interested in the future of blockchain interoperability."
    },
    {
        ticker: 'avalanche',
        desc: "clAVAX is a cloned asset on Clone that represents Avalanche (AVAX), a highly scalable, open-source platform for launching decentralized applications. Avalanche is built with a unique consensus protocol, offering a decentralized and robust infrastructure for developers to create custom blockchain networks and decentralized applications. Trading clAVAX on Clone allows traders to gain exposure to the Avalanche ecosystem's rapid growth and development, reflecting the evolution of scalable blockchain technology. Known for its blazing fast finality and high throughput, Avalanche has emerged as a robust solution for decentralized finance (DeFi), enterprise blockchain deployments, and other decentralized applications. clAVAX serves as a bridge for traders to engage with Avalanche's potential, offering insight into the trajectory of high-performance blockchain ecosystems. By offering clAVAX on Clone, built on Solana, traders can participate in this dynamic market with the added benefits of scalable, efficient, and secure trading operations."
    },
    {
        ticker: 'sui',
        desc: "clSUI is a cloned asset on Clone that symbolizes the native token of the Sui blockchain platform, a revolutionary smart contract platform known for its unprecedented scalability and low-latency transactions. Built on Rust, Sui employs a novel approach by enabling parallel processing for most transactions, allowing better utilization of processing resources and a potential increase in throughput by adding more resources. What sets Sui apart is its Sui Move, a powerful asset-centric adaptation of the Move programming language for the Sui blockchain. With Sui Move, developers can define assets with custom operations and rules, effectively managing their creation, ownership transfer, and mutations. By representing Sui on Clone, traders can engage with the performance of this unique, scalability-focused platform on the fast, efficient Solana blockchain."
    },
    {
        ticker: 'aptos',
        desc: "clAPT is a cloned asset on Clone that represents the Aptos token, the native token of a scalable layer-1 proof-of-stake blockchain named Aptos. Aptos stands out with its use of the Move programming language, which promises enhanced reliability, usability, and security. Additionally, Aptos is known for its parallel execution engine, low transaction costs, and high-grade security features, enabling it to carve a niche for itself amidst other layer-1 protocols. Trading clAPT on Clone gives traders the opportunity to engage with the unique prospects offered by Aptos. Launched amidst both criticism and applause, Aptos quickly overcame early backlash to establish itself as a promising protocol. This was largely due to its founders, Mo Shaikh and Avery Ching, their claims of technological breakthroughs, and the blockchain's potential to be one of the most secure and scalable decentralized platforms. Aptos has gained notable attention in the crypto community, partly because of its strong social media presence, which sparked widespread discussion and attracted many early adopters. As traders speculate on the future growth and success of Aptos via clAPT, they can benefit from the security, speed, and efficiency that come with trading on Clone, which is built on the Solana blockchain."
    },
    {
        ticker: 'cardano',
        desc: "clADA is a cloned asset on Clone that corresponds to Cardano (ADA), an open-source blockchain platform founded by Ethereum co-founder Charles Hoskinson. Cardano has generated interest through its unique two-layered architecture that separates settlement from computation, ensuring a higher degree of flexibility and scalability. By trading clADA on Clone, traders can engage with the value narrative of the Cardano platform, which has made significant strides in developing a decentralized infrastructure aimed at redressing the balance of power in society by putting individuals in control of their data. Cardano is recognized for its scientific approach to blockchain, with its protocol being designed from the ground up by academics and engineers and subjected to a rigorous peer-review process. This scientific rigor is reflected in ADA's value dynamics, making it an interesting addition to any trading portfolio. With clADA on Clone, traders can experience Cardano's unique dynamics on a trading platform designed for scalability and efficiency on the Solana blockchain."
    }
]