import RankingIcon1 from 'public/images/ranking-1.svg'
import RankingIcon2 from 'public/images/ranking-2.svg'
import RankingIcon3 from 'public/images/ranking-3.svg'
import Image from 'next/image'
import { Typography } from '@mui/material'

export const RankIndex = ({ rank }: { rank: number }) => {
  if (rank === 1) {
    return <Image src={RankingIcon1} alt="ranking" />
  } else if (rank === 2) {
    return <Image src={RankingIcon2} alt="ranking" />
  } else if (rank === 3) {
    return <Image src={RankingIcon3} alt="ranking" />
  } else {
    return <Typography variant='p_xlg'>{rank}</Typography>
  }
}

export const RankIndexForStatus = ({ rank }: { rank: number | undefined }) => {
  if (rank === 1) {
    return <Image src={RankingIcon1} alt="ranking" />
  } else if (rank === 2) {
    return <Image src={RankingIcon2} alt="ranking" />
  } else if (rank === 3) {
    return <Image src={RankingIcon3} alt="ranking" />
  } else {
    return <Typography variant='h3' fontWeight={500}>{rank ? rank : '-'}</Typography>
  }
}