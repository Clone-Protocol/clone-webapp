import axios from 'axios';
import { PythHttpClient, getPythProgramKeyForCluster } from '@pythnetwork/client';
import { PublicKey, Connection } from '@solana/web3.js';
import { ASSETS, assetMapping } from '~/data/assets';
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

    // const response = await fetch(`/.netlify/functions/pyth-data-fetch?${queryString}`)

    // if (!response.ok) {
    //     throw new Error('Network response was not ok');
    // }

    // const data = await response.json();
    // return data
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