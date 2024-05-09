import { Box, Stack, Typography } from '@mui/material'
import React, { useState, useMemo } from 'react'
import { styled } from '@mui/material/styles'
import Image from 'next/image'
import { useWallet } from '@solana/wallet-adapter-react'
import { useInitCometDetailQuery } from '~/features/Liquidity/comet/CometInfo.query'
import { LoadingProgress } from '~/components/Common/Loading'
import withSuspense from '~/hocs/withSuspense'
import CometPanel from './CometPanel'
import { useRouter } from 'next/navigation'
import PriceChart from '~/components/Liquidity/overview/PriceChart'
import PoolAnalytics from '~/components/Liquidity/overview/PoolAnalytics'
import TipMsg from '~/components/Common/TipMsg'
import InfoIcon from 'public/images/info-icon.svg'
import { GoBackButton } from '~/components/Common/CommonButtons'
import { ASSETS, AssetTickers, DEFAULT_ASSET_ID, DEFAULT_LIQUIDITY_ASSET_LINK } from '~/data/assets'
import dynamic from 'next/dynamic'
import { RootLiquidityDir } from '~/utils/constants'

const AssetView = ({ assetTicker }: { assetTicker: string }) => {
	const { publicKey } = useWallet()
	const router = useRouter()
	const [assetIndex, setAssetIndex] = useState(0)
	const [openChooseLiquidity, setOpenChooseLiquidity] = useState(false)
	const ChooseLiquidityPoolsDialog = dynamic(() => import('./Dialogs/ChooseLiquidityPoolsDialog'), { ssr: false })

	useMemo(() => {
		if (assetTicker) {
			if (AssetTickers[assetTicker as keyof typeof AssetTickers]) {
				setAssetIndex(AssetTickers[assetTicker as keyof typeof AssetTickers])
			} else {
				setAssetIndex(DEFAULT_ASSET_ID)
				router.replace(DEFAULT_LIQUIDITY_ASSET_LINK)
			}
		}
	}, [assetTicker])

	const { data: assetData, refetch } = useInitCometDetailQuery({
		userPubKey: publicKey,
		index: assetIndex,
		refetchOnMount: "always",
	})

	const openChooseLiquidityDialog = () => {
		setOpenChooseLiquidity(true)
	}

	const handleChoosePool = (assetId: number) => {
		setAssetIndex(assetId)
		setOpenChooseLiquidity(false)

		router.replace(`${RootLiquidityDir}/comet/new/${ASSETS[assetId].ticker}`)
	}

	return (
		<Box>
			<Stack direction='row' spacing={9} justifyContent="center">
				<Box>
					<GoBackButton onClick={() => router.back()}><Typography variant='p'>{'<'} Go back</Typography></GoBackButton>
					<Box mb='8px'>
						<Typography variant='h3' fontWeight={500}>New Comet Liquidity Position</Typography>
					</Box>
					<a href="https://docs.clone.so/system-architecture/comet-liquidity-system" target="_blank" rel="noreferrer">
						<TipMsg>
							<Image src={InfoIcon} alt='info' />
							<Typography variant='p' ml='5px' sx={{ cursor: 'pointer' }}>Comet Liquidity System is built to introduce hyper liquidity to clAssets. Click to learn more.</Typography>
						</TipMsg>
					</a>

					<LeftBoxWrapper>
						<Box paddingY='15px'>
							<CometPanel assetIndex={assetIndex} assetData={assetData} openChooseLiquidityDialog={openChooseLiquidityDialog} onRefetchData={() => refetch()} />
						</Box>
					</LeftBoxWrapper>
				</Box>

				<RightBoxWrapper>
					<StickyBox>
						<PriceChart assetData={assetData} publicKey={publicKey} isOraclePrice={true} priceTitle='Oracle Price' />
						{publicKey && assetData && <PoolAnalytics tickerSymbol={assetData.tickerSymbol} />}
					</StickyBox>
				</RightBoxWrapper>
			</Stack>

			<ChooseLiquidityPoolsDialog
				open={openChooseLiquidity}
				handleChoosePool={handleChoosePool}
				handleClose={() => setOpenChooseLiquidity(false)}
			/>
		</Box>
	)
}

const LeftBoxWrapper = styled(Box)`
	width: 600px; 
	padding: 8px 0px;
	margin-bottom: 65px;
`
const RightBoxWrapper = styled(Box)`
	width: 472px;
	padding: 8px 0px;
`
const StickyBox = styled(Box)`
  position: sticky;
  top: 100px;
`

export default withSuspense(AssetView, <LoadingProgress />)
