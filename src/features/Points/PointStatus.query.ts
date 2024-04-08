import { useQuery } from '@tanstack/react-query'
import { PublicKey } from '@solana/web3.js'
// import { REFETCH_CYCLE } from '~/components/Markets/TradingBox/RateLoadingIndicator'
import { useAnchorWallet } from '@solana/wallet-adapter-react'
import { fetchCheckReferralCode, fetchGenerateReferralCode, fetchUserPoints, UserPointsView } from '~/utils/fetch_netlify'

// export const fetchCheckReferral = async ({ userPubKey }: { userPubKey: PublicKey | null }) => {
//   if (!userPubKey) return null

//   console.log('fetchCheckReferral')
//   const result = await fetchCheckReferralCode(userPubKey.toString())
//   console.log('ref', result)

//   // if (result.length === 0) return null

//   return {
//     successful: result
//   }
// }


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

  if (userPoints.length === 0) return null

  return {
    myRank: userPoints[0].rank,
    totalPoints: userPoints[0].total_points,
    lpPoints: userPoints[0].lp_points,
    tradePoints: userPoints[0].trading_points,
    socialPoints: userPoints[0].social_points,
    referralPoints: userPoints[0].referral_points,
    hasPythPoint: userPoints[0].hasPythPoint,
    pythPointTier: userPoints[0].pythPointTier
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
  pythPointTier: number
}

export function usePointStatusQuery({ userPubKey, refetchOnMount, enabled = true }: GetProps) {
  const wallet = useAnchorWallet()

  if (wallet) {
    return useQuery({
      queryKey: ['statusData', wallet, userPubKey],
      queryFn: async () => fetchStatus({ userPubKey }),
      refetchOnMount,
      // refetchInterval: REFETCH_CYCLE,
      // refetchIntervalInBackground: true,
      enabled
    })
  } else {
    return useQuery({
      queryKey: ['statusData'],
      queryFn: () => { return null }
    })
  }
}