import { Query, useQuery } from '@tanstack/react-query'
// import { REFETCH_CYCLE } from '~/components/Markets/TradingBox/RateLoadingIndicator'
import { PythObj, PythResponseData } from '~/pages/api/points_pythlist'
import { fetchAllUserPoints, UserPointsView } from '~/utils/fetch_netlify'

export const fetchRanking = async () => {
  console.log('fetchRanking')

  let userPoints: UserPointsView[] = await fetchAllUserPoints();

  //pyth point system
  let pythResult: { result: PythObj[] } = { result: [] }
  try {
    const fetchData = await fetch(`${process.env.NEXT_PUBLIC_API_ROOT}/data/pythSnapshot.json`)
    const fileContents = await fetchData.json()
    pythResult = {
      result: fileContents
    }
    // console.log('pythResult', pythResult)
  } catch (error) {
    console.error('err', error)
  }

  let result: RankingList[] = []
  userPoints = userPoints.slice(0, 100)
  userPoints.forEach((user, id) => {
    //check if the address is included in pythResult
    const pythUser = pythResult.result.find((pythUser) => {
      return pythUser.address === user.user_address
    })

    result.push({
      id,
      rank: user.rank,
      user: { name: user.name, address: user.user_address },
      lpPoints: user.lp_points,
      tradePoints: user.trading_points,
      socialPoints: user.social_points,
      referralPoints: user.referral_points,
      totalPoints: user.total_points,
      hasPythPoint: pythUser !== undefined ? true : false,
      pythPointTier: pythUser !== undefined ? pythUser.tier : -1
    })
  })

  return result
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
  pythPointTier: number
}

export function useRankingQuery({ refetchOnMount, enabled = true }: GetProps) {
  let queryFunc
  try {
    queryFunc = () => fetchRanking()
  } catch (e) {
    console.error(e)
    queryFunc = () => []
  }

  return useQuery({ queryKey: ['ranks'], queryFn: queryFunc, enabled, refetchOnMount })
}
