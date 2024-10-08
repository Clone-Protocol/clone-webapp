import { useQuery, useSuspenseQuery } from '@tanstack/react-query'
import { PublicKey } from '@solana/web3.js'
import { CloneClient } from 'clone-protocol-sdk/sdk/src/clone'
import { useClone } from '~/hooks/useClone'
import { useAnchorWallet } from '@solana/wallet-adapter-react'
import { REFETCH_CYCLE } from '~/components/Common/DataLoadingIndicator'
import { getStakingAccount, getCLNTokenBalance, CLN_TOKEN_SCALE, getClnStakingInitInfo } from "~/utils/staking";
import { BN } from "@coral-xyz/anchor"

export const LEVEL_TRADING_FEES = [300, 200, 150, 100, 50]
export const LEVEL_COMET_APYS = [8.57, 9.57, 10.1, 11.5, 13.2]
export const LEVEL_POINTS_BOOSTS = [1, 1.2, 1.4, 1.6, 1.8]
export const LEVEL_DISCOUNT_PRICING_FEES = [0, 100, 150, 200, 250]

export const fetchCurrentLevelData = async ({
	program,
	userPubKey,
}: {
	program: CloneClient
	userPubKey: PublicKey | null
}) => {
	if (!userPubKey) return

	console.log('fetchCurrentLevel :: StakingInfo.query')
	let currentLevel = 0;

	const [clnStakingInfoResult, clnUserAccountResult] = await Promise.allSettled([
		getClnStakingInitInfo(program.provider.connection),
		getStakingAccount(userPubKey, program.provider.connection),
	])

	if (clnStakingInfoResult.status === "fulfilled" && clnUserAccountResult.status === "fulfilled") {
		if (clnUserAccountResult.value !== undefined) {
			const currentStake = new BN(clnUserAccountResult.value.stakedTokens.toString())
			for (let i = 0; i < clnStakingInfoResult.value.numTiers; i++) {
				let tierInfo = clnStakingInfoResult.value.tiers[i]
				const stakeRequirement = new BN(tierInfo.stakeRequirement.toString())
				if (currentStake.gte(stakeRequirement)) {
					currentLevel = i + 1;
				}
			}
		}
	}

	return {
		currentLevel,
	}
}

export interface LevelInfo {
	currentLevel: number
}

export function useCurrentLevelQuery({ userPubKey, refetchOnMount }: GetProps) {
	const wallet = useAnchorWallet()
	const { getCloneApp } = useClone()
	if (wallet) {
		return useSuspenseQuery({
			queryKey: ['currentLevel', wallet, userPubKey],
			queryFn: async () => fetchCurrentLevelData({ program: await getCloneApp(wallet), userPubKey }),
			refetchOnMount,
			refetchInterval: REFETCH_CYCLE,
			refetchIntervalInBackground: true,
		})
	} else {
		return useSuspenseQuery({ queryKey: ['currentLevel'], queryFn: () => { return null } })
	}
}

export const fetchStakingInfo = async ({
	program,
	userPubKey,
}: {
	program: CloneClient
	userPubKey: PublicKey | null
}) => {
	if (!userPubKey) return

	console.log('fetchStakingInfo :: StakingInfo.query')

	let stakedAmt = 0
	let balance = 0
	let minWithdrawalSlot = undefined
	let currentSlot = undefined
	let secsPerSlot = 0.400 // Estimated
	let stakingPeriodSlots = 0

	const [stakingAccountResult, balanceInfoResult, currentSlotResult, performanceSamplesResult, stakingInfoResult] = await Promise.allSettled([
		getStakingAccount(userPubKey, program.provider.connection),
		getCLNTokenBalance(userPubKey, program.provider.connection),
		program.provider.connection.getSlot(),
		program.provider.connection.getRecentPerformanceSamples(60),
		getClnStakingInitInfo(program.provider.connection),
	])

	const scalingFactor = Math.pow(10, -CLN_TOKEN_SCALE)

	if (stakingAccountResult.status === "fulfilled" && stakingAccountResult.value !== undefined) {
		stakedAmt = Number(stakingAccountResult.value.stakedTokens) * scalingFactor
		minWithdrawalSlot = Number(stakingAccountResult.value.minSlotWithdrawal)
	}
	if (balanceInfoResult.status === "fulfilled") {
		balance = Number(balanceInfoResult.value.amount) * scalingFactor
	}

	if (currentSlotResult.status === "fulfilled") {
		currentSlot = currentSlotResult.value
	}

	if (performanceSamplesResult.status === "fulfilled") {
		const totalSlots = performanceSamplesResult.value.reduce((acc, sample) => acc + sample.numSlots, 0)
		const totalPeriodSecs = performanceSamplesResult.value.reduce((acc, sample) => acc + sample.samplePeriodSecs, 0)
		secsPerSlot = totalPeriodSecs / totalSlots
	}

	if (stakingInfoResult.status === "fulfilled") {
		stakingPeriodSlots = Number(stakingInfoResult.value.stakingPeriodSlots)
	}

	return {
		stakedAmt,
		balance,
		minWithdrawalSlot,
		currentSlot,
		stakingPeriodSlots,
		secsPerSlot
	}
}

export interface DetailInfo {
	stakedAmt: number
	balance: number
	minWithdrawalSlot?: number
}

interface GetProps {
	userPubKey: PublicKey | null
	refetchOnMount?: boolean | "always"
	enabled?: boolean
}

export function useStakingInfoQuery({ userPubKey, refetchOnMount, enabled = true }: GetProps) {
	const wallet = useAnchorWallet()
	const { getCloneApp } = useClone()
	if (wallet) {
		return useQuery({
			queryKey: ['stakingInfo', wallet, userPubKey],
			queryFn: async () => fetchStakingInfo({ program: await getCloneApp(wallet), userPubKey }),
			refetchOnMount,
			refetchInterval: REFETCH_CYCLE,
			refetchIntervalInBackground: true,
			enabled,
		})
	} else {
		return useQuery({ queryKey: ['stakingInfo'], queryFn: () => { return null } })
	}
}
