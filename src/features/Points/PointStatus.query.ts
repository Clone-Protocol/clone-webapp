import { useSuspenseQuery } from '@tanstack/react-query'
import { PublicKey } from '@solana/web3.js'
import { useAnchorWallet } from '@solana/wallet-adapter-react'
import { fetchGenerateReferralCode, fetchStakingUserBonus, fetchUserPoints, UserBonus, UserPointsView } from '~/utils/fetch_netlify'
import { calculateMultiplierForUser } from './Ranking.query'

export const fetchReferralCode = async ({ userPubKey }: { userPubKey: PublicKey | null }) => {
  if (!userPubKey) return null

  console.log('fetchReferralCode')
  const referralCode = await fetchGenerateReferralCode(userPubKey.toString())
  console.log('ref', referralCode)

  if (referralCode.length === 0) return null

  return {
    referralCode: referralCode[0].referral_code
  }
}

export const fetchStatus = async ({ userPubKey }: { userPubKey: PublicKey | null }) => {
  if (!userPubKey) return null

  console.log('fetchStatus')
  const userPoints: UserPointsView[] = await fetchUserPoints(userPubKey.toString())

  const userAddress = userPubKey.toString()
  const userBonus: UserBonus = await fetchStakingUserBonus(userAddress);

  const matchPythUser = userBonus.pyth?.length > 0 ? userBonus.pyth[0] : undefined;
  const matchJupUser = userBonus.jup?.length > 0 ? userBonus.jup[0] : undefined;
  const matchDriftUser = userBonus.drift?.length > 0 ? userBonus.drift[0] : undefined;

  const multipleTier = calculateMultiplierForUser(matchJupUser?.tier, matchPythUser?.tier, matchDriftUser?.tier)

  if (userPoints?.length === 0) return null

  return {
    myRank: userPoints[0].rank,
    totalPoints: userPoints[0].total_points,
    lpPoints: userPoints[0].lp_points,
    tradePoints: userPoints[0].trading_points,
    socialPoints: userPoints[0].social_points,
    referralPoints: userPoints[0].referral_points,
    hasPythPoint: matchPythUser !== undefined ? true : false,
    hasJupPoint: matchJupUser !== undefined ? true : false,
    hasDriftPoint: matchDriftUser !== undefined ? true : false,
    multipleTier: multipleTier,
  }
}

interface GetProps {
  userPubKey: PublicKey | null
  refetchOnMount?: boolean | "always"
  enabled?: boolean
}

export interface Status {
  myRank: number
  totalPoints: number
  lpPoints: number
  tradePoints: number
  socialPoints: number
  referralPoints: number
  hasPythPoint: boolean
  hasJupPoint: boolean
  hasDriftPoint: boolean
  multipleTier: number
}

export function usePointStatusQuery({ userPubKey, refetchOnMount }: GetProps) {
  const wallet = useAnchorWallet()

  if (wallet) {
    return useSuspenseQuery({
      queryKey: ['statusData', wallet, userPubKey],
      queryFn: async () => fetchStatus({ userPubKey }),
      refetchOnMount,
    })
  } else {
    return useSuspenseQuery({
      queryKey: ['statusData'],
      queryFn: () => { return null }
    })
  }
}