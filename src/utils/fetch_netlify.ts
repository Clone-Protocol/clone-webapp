import axios from "axios";
import { FeeLevel } from "~/data/networks";

export interface StatsData {
    time_interval: string;
    total_committed_collateral_liquidity: number;
    volume: number;
    trading_fees: number;
    pool_index: number | undefined;
}

export const fetchStatsData = async (interval: string, filter: string): Promise<StatsData[]> => {
    const response = await axios.get(`${process.env.NEXT_PUBLIC_API_ROOT}/.netlify/functions/get-pool-stats?interval=${interval}&filter=${filter}`)
    return response.data as StatsData[]
}

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
    hasPythPoint?: boolean
    pythPointTier?: number
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