import { useSuspenseQuery } from '@tanstack/react-query'
import { fetchAllUserBonus, fetchAllUserPoints, Tier, UserBonus, UserPointsView } from '~/utils/fetch_netlify'

export const fetchRanking = async () => {
  console.log('fetchRanking')

  let userPoints: UserPointsView[] = await fetchAllUserPoints();
  const userBonus: UserBonus = await fetchAllUserBonus();

  let result: RankingList[] = []
  userPoints = userPoints.slice(0, 100)
  userPoints.forEach((user, id) => {
    const matchPythUser = userBonus.pyth.find((pythUser) => {
      return pythUser.user_address === user.user_address
    })

    const matchJupUser = userBonus.jup.find((jupUser) => {
      return jupUser.user_address === user.user_address
    })

    const matchDriftUser = userBonus.drift.find((driftUser) => {
      return driftUser.user_address === user.user_address
    })

    const multipleTier = calculateMultiplierForUser(matchJupUser?.tier, matchPythUser?.tier, matchDriftUser?.tier)

    result.push({
      id,
      rank: user.rank,
      user: { name: user.name, address: user.user_address },
      lpPoints: user.lp_points,
      tradePoints: user.trading_points,
      socialPoints: user.social_points,
      referralPoints: user.referral_points,
      totalPoints: user.total_points,
      hasPythPoint: matchPythUser !== undefined ? true : false,
      hasJupPoint: matchJupUser !== undefined ? true : false,
      hasDriftPoint: matchDriftUser !== undefined ? true : false,
      multipleTier: multipleTier,
    })
  })

  return result
}

export const calculateMultiplierForUser = (jup?: Tier, pyth?: Tier, drift?: Tier) => {
  const multiplier = (t: Tier) => {
    switch (t) {
      case 0: return 20
      case 1: return 40
      case 2: return 60
      default:
        return 0
    }
  }
  const jupMul = jup !== undefined ? multiplier(jup) : 0
  const pythMul = pyth !== undefined ? multiplier(pyth) : 0
  const driftMul = drift !== undefined ? multiplier(drift) : 0

  return 1 + (jupMul + pythMul + driftMul) / 100
}

interface GetProps {
  refetchOnMount?: boolean | "always"
  enabled?: boolean
}

export interface RankingList {
  id: number
  rank: number
  user: { name: string | undefined, address: string }
  lpPoints: number
  tradePoints: number
  socialPoints: number
  totalPoints: number
  referralPoints: number
  hasPythPoint: boolean
  hasJupPoint: boolean
  hasDriftPoint: boolean
  multipleTier: number
}

export function useRankingQuery({ refetchOnMount }: GetProps) {
  let queryFunc
  try {
    queryFunc = () => fetchRanking()
  } catch (e) {
    console.error(e)
    queryFunc = () => []
  }

  return useSuspenseQuery({ queryKey: ['ranks'], queryFn: queryFunc, refetchOnMount })
}
