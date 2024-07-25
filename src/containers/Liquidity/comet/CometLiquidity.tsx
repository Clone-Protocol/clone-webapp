import { Box, Stack, Typography } from '@mui/material'
import { styled } from '@mui/material/styles'
import { StyledTabs, LiquidityTab } from '~/components/Common/StyledTab'
import { useAnchorWallet, useWallet } from '@solana/wallet-adapter-react'
import { LoadingSkeleton } from '~/components/Common/Loading'
import withSuspense from '~/hocs/withSuspense'
import { fetchPositionsApy, useCometInfoQuery } from '~/features/Liquidity/comet/CometInfo.query'
import Collaterals from './Collaterals'
import LearnMoreIcon from 'public/images/learn-more.svg'
import LiquidityPositions from './LiquidityPositions'
import CometLiquidityStatus from './CometLiquidityStatus'
import Image from 'next/image'
import { useEffect, useState } from 'react'
import { useClone } from '~/hooks/useClone'

const CometLiquidity = () => {
  const { publicKey } = useWallet()
  const { data: infos, refetch } = useCometInfoQuery({
    userPubKey: publicKey,
    refetchOnMount: "always",
    enabled: publicKey != null
  })

  const [totalApy, setTotalApy] = useState<number | undefined>()
  const [positionsApys, setPositionsApys] = useState<number[]>([])
  const wallet = useAnchorWallet()
  const { getCloneApp } = useClone()

  useEffect(() => {
    const fetchApy = async () => {
      if (publicKey && infos?.positions && infos.positions.length > 0) {
        try {
          const program = await getCloneApp(wallet)
          const apyInfo = await fetchPositionsApy({ program, userPubKey: publicKey })

          if (apyInfo && apyInfo.totalApy > 0) {
            setTotalApy(apyInfo.totalApy)
            setPositionsApys(apyInfo.apys)
          }
        } catch (err) {
          console.error('e', err)
        }
      } else {
        console.log('no positions')
      }
    }
    fetchApy()
  }, [publicKey])

  return (
    <div>
      <Box>
        <Typography variant='h3' fontWeight={500}>Comet Liquidity</Typography>
        <Stack direction='row' alignItems='center' gap={1} mt='4px'>
          <Typography variant='p' color='#8988a3'>While Comet excels in capital-efficiency, users need advanced knowledge to maximize yield and minimize risk.</Typography>
          <a href="https://docs.clone.so/clone-mainnet-guide/clone-liquidity-or-for-lps/comets" target='_blank' rel="noreferrer">
            <Box display='flex' color='#c4b5fd' sx={{ cursor: 'pointer', ':hover': { color: '#8070ad' }, whiteSpace: 'nowrap' }}>
              <Typography variant='p' mr='3px'>Learn more</Typography>
              <Image src={LearnMoreIcon} alt='learnMore' />
            </Box>
          </a>
        </Stack>
      </Box>

      <CometLiquidityStatus infos={infos} totalApy={totalApy} />

      <Box>
        <StyledTabs value={0} sx={{ maxWidth: '590px', marginTop: '12px' }}>
          <LiquidityTab value={0} label='Collateral' />
        </StyledTabs>

        <PanelBox>
          <Collaterals hasNoCollateral={infos ? infos.hasNoCollateral : false} collaterals={infos?.collaterals || []} onRefetchData={() => refetch()} />
        </PanelBox>
      </Box>

      <Box>
        <StyledTabs value={0} sx={{ maxWidth: '590px', marginTop: '12px' }}>
          <LiquidityTab value={0} label='Positions' />
        </StyledTabs>

        <PanelBox>
          <LiquidityPositions hasNoCollateral={infos ? infos.hasNoCollateral : false} positions={infos?.positions || []} positionsApys={positionsApys} onRefetchData={() => refetch()} />
        </PanelBox>
      </Box>
    </div>
  )
}

const PanelBox = styled(Box)`
  margin-bottom: 40px;
  color: #fff;
`

export default withSuspense(CometLiquidity, <LoadingSkeleton />)
