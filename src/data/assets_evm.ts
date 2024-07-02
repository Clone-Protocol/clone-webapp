
export enum AssetTickers {
    pepe = 0
}

export enum Asset {
    Pepe
}

export const DEFAULT_ASSET_ID = AssetTickers.pepe

export const ASSETS = [
    {
        tickerName: 'PEPE (Arbitrum)',
        tickerIcon: '/images/assets/on-pepe.svg',
        networkName: 'Arbitrum',
        fromTickerSymbol: 'PEPE',
        toTickerSymbol: '1MPEPE',
        fromContractAddr: '0x25d887Ce7a35172C62FeBFD67a1856F20FaEbB00',
        toContractAddr: '0x36FF4FB204Ad84ee1524339939b41618330f83C7'
    }
]

export const assetMapping = (index: number) => {
    let tickerName = ''
    let tickerIcon = ''
    let networkName = ''
    let fromTickerSymbol = ''
    let toTickerSymbol = ''
    let fromContractAddr = ''
    let toContractAddr = ''
    switch (index) {
        case Asset.Pepe:
            tickerName = 'PEPE (Arbitrum)'
            tickerIcon = '/images/assets/on-pepe.svg'
            networkName = 'Arbitrum'
            fromTickerSymbol = 'PEPE'
            toTickerSymbol = '1MPEPE'
            fromContractAddr = '0x25d887Ce7a35172C62FeBFD67a1856F20FaEbB00'
            toContractAddr = '0x36FF4FB204Ad84ee1524339939b41618330f83C7'
            break
        default:
            throw new Error('Not supported')
    }

    return { tickerName, tickerIcon, networkName, fromTickerSymbol, toTickerSymbol, fromContractAddr, toContractAddr }
}
