import axios from 'axios';
import { PythHttpClient, getPythProgramKeyForCluster } from '@pythnetwork/client';
import { PublicKey, Connection } from '@solana/web3.js';
import { ASSETS, assetMapping } from '~/data/assets';
import { Oracles, OracleSource } from 'clone-protocol-sdk/sdk/generated/clone'
import { IS_DEV } from '~/data/networks';
import { PythSolanaReceiver } from "@pythnetwork/pyth-solana-receiver";
import * as anchor from "@coral-xyz/anchor"

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
export const fetchPythOraclePrices = async (
    provider: anchor.AnchorProvider,
    oracles: Oracles
): Promise<number[]> => {
    // const wallet = new anchor.Wallet(Keypair.generate());
    const connection = provider.connection
    const wallet = provider.wallet
    const client = new PythHttpClient(
        connection,
        getPythProgramKeyForCluster("mainnet-beta")
    );
    const clientV2 = new PythSolanaReceiver({ connection, wallet });
    const priceAccounts = oracles.oracles.map((acc, index) => {
        return { source: acc.source, address: acc.address, index };
    });
    let priceData: number[] = oracles.oracles.map((o) => 0);
    const v1PriceAccounts = priceAccounts.filter(
        (o) => o.source === OracleSource.PYTH
    );
    const v2PriceAccounts = priceAccounts.filter(
        (o) => o.source === OracleSource.PYTHV2
    );
    const priceDataV1 = await client.getAssetPricesFromAccounts(
        v1PriceAccounts.map((o) => o.address)
    );

    for (const [i, acc] of v1PriceAccounts.entries()) {
        const priceAccount = priceDataV1[i];
        const scale = Math.pow(10, oracles.oracles[acc.index].rescaleFactor);
        priceData[acc.index] =
            Number(priceAccount?.aggregate.price) * scale;
    }
    for (const acc of v2PriceAccounts) {
        const priceAccount = await clientV2.fetchPriceUpdateAccount(acc.address);
        const scale = Math.pow(10, oracles.oracles[acc.index].rescaleFactor);
        priceData[acc.index] =
            Number(priceAccount?.priceMessage.price!) *
            Math.pow(10, priceAccount?.priceMessage.exponent!) * scale;
    }
    return priceData;
};