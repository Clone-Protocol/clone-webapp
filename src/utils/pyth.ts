import axios from 'axios';
import { PythHttpClient, getPythProgramKeyForCluster } from '@pythnetwork/client';
import { PublicKey, Connection } from '@solana/web3.js';
import { ASSETS, assetMapping } from '~/data/assets';
import { Oracles, OracleSource } from 'clone-protocol-sdk/sdk/generated/clone'
import { IS_DEV } from '~/data/networks';

export type Network = "devnet" | "mainnet-beta" | "pythnet" | "testnet" | "pythtest";
export type Range = "1H" | "1D" | "1W" | "1M" | "1Y"

export interface PythData {
    timestamp: string;
    price: number;
}

export const convertPythSymbolToSupabaseSymbol = (pythSymbol: string): string => {

    for (let i = 0; i < ASSETS.length; i++) {
        const mapping = assetMapping(i)
        if (pythSymbol === mapping.pythSymbol)
            return mapping.supabaseSymbol
    }
    throw new Error(`Couldn't find pyth symbol: ${pythSymbol}`)
}

export const fetchPythPriceHistory = async (pythSymbol: string, range: Range): Promise<PythData[]> => {
    const symbol = convertPythSymbolToSupabaseSymbol(pythSymbol)
    let queryString = `symbol=${symbol}&range=${range}`
    let response = await axios.get(`${process.env.NEXT_PUBLIC_API_ROOT}/.netlify/functions/pyth-data-fetch?${queryString}`)

    return response.data
}

export const getPythOraclePrices = async (
    connection: Connection,
) => {
    const cluster = IS_DEV ? "devnet" : "mainnet-beta";
    const pythClient = new PythHttpClient(connection, new PublicKey(getPythProgramKeyForCluster(cluster)));
    const data = await pythClient.getData();
    const pricesMap = new Map<string, number>();
    for (const product of data.products) {
        const price = data.productPrice.get(product.symbol)?.aggregate.price;
        if (price) {
            pricesMap.set(product.symbol, price);
        }
    }
    return pricesMap;
};

// Fetches the latest oracle prices from Pyth ordered by the order of the oracles in the program,
// If the price isn't found in the pyth data, or the source is not pyth, it will return the last
// saved oracle price from the onchain account.
export const fetchPythOraclePrices = async (connection: Connection, oracles: Oracles): Promise<number[]> => {
    const cluster = IS_DEV ? "devnet" : "mainnet-beta";
    const pythClient = new PythHttpClient(connection, new PublicKey(getPythProgramKeyForCluster(cluster)));
    const pythData = await pythClient.getData();

    const pythOraclePrices = oracles.oracles.map((oracle) => {
        if (oracle.source === OracleSource.PYTH) {
            const feedAddress = oracle.address.toString()
            const product = pythData.products.find((p) => p.price_account === feedAddress)!
            const rescaleFactor = Math.pow(10, oracle.rescaleFactor)
            return rescaleFactor * (pythData.productPrice.get(product.symbol)?.aggregate.price ?? fromScale(oracle.price, oracle.expo))
        }
        return fromScale(oracle.price, oracle.expo)
    })
    return pythOraclePrices;
}