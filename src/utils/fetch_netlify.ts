import axios from "axios";
import { FeeLevel } from "~/data/networks";

export interface OHLCVResponse {
    time_interval: string,
    pool_index: number,
    open: string,
    high: string,
    low: string,
    close: string,
    volume: string,
    trading_fees: string
}

export const fetchOHLCV = async (interval: string, filter: string, pool?: number | string): Promise<OHLCVResponse[]> => {
    let endpoint = `${process.env.NEXT_PUBLIC_API_ROOT}/.netlify/functions/get-ohlcv?interval=${interval}&filter=${filter}`

    if (pool !== undefined)
        endpoint += `&pool=${pool}`

    const response = await axios.get(endpoint)
    return response.data as OHLCVResponse[]
}

export interface BorrowStats {
    pool_index: number,
    time_interval: string,
    cumulative_collateral_delta: number,
    cumulative_borrowed_delta: number
}

export const fetchBorrowStats = async (): Promise<BorrowStats[]> => {
    const response = await axios.get(`${process.env.NEXT_PUBLIC_API_ROOT}/.netlify/functions/get-borrow-stats`)
    return response.data as BorrowStats[]
}

export const fetchPoolApy = async (): Promise<{ pool_index: number, apy_24hr?: number }[]> => {
    const response = await axios.get(`${process.env.NEXT_PUBLIC_API_ROOT}/.netlify/functions/get-pool-apy`)
    return response.data as { pool_index: number, apy_24hr?: number }[]
}

export type UserApy = {
    apy: number
    avgCollateral: number
    poolApy: number[]
}

export const fetchUserApy = async (user_address: string, poolIndexes: number[]): Promise<UserApy> => {
    const response = await axios.get(`${process.env.NEXT_PUBLIC_API_ROOT}/.netlify/functions/get-user-apy?user_address=${user_address}&pool_indexes=${poolIndexes.join(',')}`)
    return response.data as UserApy
}

export const fetchTotalLiquidity = async (interval: string, filter: string): Promise<{ time_interval: string, total_liquidity: number }[]> => {
    const response = await axios.get(`${process.env.NEXT_PUBLIC_API_ROOT}/.netlify/functions/get-total-liquidity?interval=${interval}&filter=${filter}`)
    return response.data as { time_interval: string, total_liquidity: number }[]
}

export const fetchFromSupabaseNotice = async () => {
    return await axios.get(`${process.env.NEXT_PUBLIC_API_ROOT}/.netlify/functions/supabase-notice-fetch`)
}

export const fetchFromSupabasePyth = async () => {
    return await axios.get(`${process.env.NEXT_PUBLIC_API_ROOT}/.netlify/functions/supabase-pyth-fetch`)
}

export type UserPointsView = {
    rank: number
    user_address: string
    trading_points: number
    lp_points: number
    social_points: number
    total_points: number
    referral_points: number
    name?: string
}

export const fetchAllUserPoints = async (): Promise<UserPointsView[]> => {
    let url = `${process.env.NEXT_PUBLIC_API_ROOT}/.netlify/functions/get-users-all-points`;
    const response = await axios.get(url)
    return response.data as UserPointsView[]
}

export const fetchUserPoints = async (userAddress: string): Promise<UserPointsView[]> => {
    let url = `${process.env.NEXT_PUBLIC_API_ROOT}/.netlify/functions/get-user-points`;
    url += `?userAddress=${userAddress}`;
    const response = await axios.get(url)
    return response.data as UserPointsView[]
}

export type StakersInfo = {
    user_address: string
    amount: number
    tier: Tier
}
export type Tier = 0 | 1 | 2
export type UserBonus = {
    pyth: StakersInfo[],
    jup: StakersInfo[],
    drift: StakersInfo[],
}
export const fetchAllUserBonus = async (): Promise<UserBonus> => {
    let url = `${process.env.NEXT_PUBLIC_API_ROOT}/.netlify/functions/get-users-all-bonus`;
    const response = await axios.get(url)
    return response.data as UserBonus
}

export const fetchStakingUserBonus = async (userAddress: string): Promise<UserBonus> => {
    let url = `${process.env.NEXT_PUBLIC_API_ROOT}/.netlify/functions/get-users-staking-bonus`;
    url += `?userAddress=${userAddress}`;
    const response = await axios.get(url)
    return response.data as UserBonus
}

export type UserGiveaway = {
    user_address: string
    name?: string
    tickets: number
}

export const fetchAllUserGiveaway = async (): Promise<UserGiveaway[]> => {
    let url = `${process.env.NEXT_PUBLIC_API_ROOT}/.netlify/functions/get-users-all-tickets`;
    const response = await axios.get(url)
    return response.data as UserGiveaway[]
}

export const fetchUserGiveaway = async (userAddress: string): Promise<UserGiveaway[]> => {
    let url = `${process.env.NEXT_PUBLIC_API_ROOT}/.netlify/functions/get-user-tickets`;
    url += `?userAddress=${userAddress}`;
    const response = await axios.get(url)
    return response.data as UserGiveaway[]
}

export type ArbitrageStats = {
    symbol: string
    poolPrice?: number
    oraclePrice?: number
    premium?: number
    capacity?: number
    timestamp?: number
}

export const fetchArbitrageStats = async (): Promise<ArbitrageStats[]> => {
    let url = `${process.env.NEXT_PUBLIC_API_ROOT}/.netlify/functions/get-arbitrage-stats`;
    const response = await axios.get(url)
    console.log('d', response.data)
    return response.data as ArbitrageStats[]
}

export const fetchCheckReferralCode = async (userAddress: string) => {
    let url = `${process.env.NEXT_PUBLIC_API_ROOT}/.netlify/functions/get-check-referral-code`;
    url += `?userAddress=${userAddress}`;
    const response = await axios.get(url)
    return response.data
}

export const fetchGenerateReferralCode = async (userAddress: string) => {
    let url = `${process.env.NEXT_PUBLIC_API_ROOT}/.netlify/functions/get-or-generate-referral-code`;
    url += `?userAddress=${userAddress}`;
    const response = await axios.get(url)
    return response.data
}

export const fetchLinkReferralCode = async (userAddress: string, referralCode: string) => {
    let url = `${process.env.NEXT_PUBLIC_API_ROOT}/.netlify/functions/link-referral-code`;
    url += `?userAddress=${userAddress}&referralCode=${referralCode}`;
    const response = await axios.get(url)
    return response.data
}

export const fetchLinkDiscordAccess = async (userAddress: string, signature: string, accessToken: string) => {
    let url = `${process.env.NEXT_PUBLIC_API_ROOT}/.netlify/functions/link-discord-access`;
    url += `?userAddress=${userAddress}&signature=${signature}&accessToken=${accessToken}`;
    const response = await axios.get(url)
    return response.data
}

export const fetchLinkDiscordAccessLedger = async (userAddress: string, signature: string, accessToken: string) => {
    let url = `${process.env.NEXT_PUBLIC_API_ROOT}/.netlify/functions/link-discord-access-ledger`;
    url += `?userAddress=${userAddress}&signature=${signature}&accessToken=${accessToken}`;
    const response = await axios.get(url)
    return response.data
}

export const fetchGeoBlock = async (): Promise<{ result: boolean, whitelistAddr?: string[] }> => {
    const response = await axios.post(`/api/route`)
    return response.data
}

export type PriorityFeeEstimate = Record<FeeLevel, number>
export type PriorityFeeEstimateResponse = {
    priorityFeeLevels: PriorityFeeEstimate
}

export const getHeliusPriorityFeeEstimate = async () => {
    const response = await axios.get(`${process.env.NEXT_PUBLIC_API_ROOT}/.netlify/functions/get-priority-fee-estimate`)
    return response.data.priorityFeeLevels as PriorityFeeEstimate
}

export const fetchTotalCumulativeVolume = async (interval: string): Promise<{ time_interval: string, cumulative_volume: number }[]> => {
    const response = await axios.get(`${process.env.NEXT_PUBLIC_API_ROOT}/.netlify/functions/get-cumulative-volume?interval=${interval}`)
    return response.data as { time_interval: string, cumulative_volume: number }[]
}


export type PoolAnalytics = {
    pool_index: number
    current_volume: number
    current_fees: number
    current_liquidity: number
    previous_volume: number
    previous_fees: number
    previous_liquidity: number
}
export const fetchPoolAnalytics = async (): Promise<PoolAnalytics[]> => {
    const response = await axios.get(`${process.env.NEXT_PUBLIC_API_ROOT}/.netlify/functions/get-pool-analytics`)
    return response.data as PoolAnalytics[]
}