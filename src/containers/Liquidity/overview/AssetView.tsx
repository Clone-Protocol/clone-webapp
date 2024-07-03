import { Box, Stack, Theme, Typography, useMediaQuery } from '@mui/material'
import React, { useState, useMemo, useEffect } from 'react'
import { styled } from '@mui/material/styles'
import Image from 'next/image'
import { useWallet } from '@solana/wallet-adapter-react'
import { LoadingProgress } from '~/components/Common/Loading'
import withSuspense from '~/hocs/withSuspense'
import CometPanel from './CometPanel'
import { useRouter } from 'next/navigation'
import PriceChart from '~/components/Liquidity/overview/PriceChart'
import PoolAnalytics from '~/components/Liquidity/overview/PoolAnalytics'
import TipMsg from '~/components/Common/TipMsg'
import InfoIcon from 'public/images/info-icon.svg'
import { GoBackButton, ShowChartBtn } from '~/components/Common/CommonButtons'
import { ASSETS, AssetTickers, DEFAULT_ASSET_ID, DEFAULT_LIQUIDITY_ASSET_LINK, assetMapping } from '~/data/assets'
import dynamic from 'next/dynamic'
import { RootLiquidityDir } from '~/utils/constants'

const AssetView = ({ assetTicker }: { assetTicker: string }) => {
	const { publicKey } = useWallet()
	const router = useRouter()
	const [assetIndex, setAssetIndex] = useState(0)
	const [showChart, setShowChart] = useState(true)
	const [openChooseLiquidity, setOpenChooseLiquidity] = useState(false)
	const ChooseLiquidityPoolsDialog = dynamic(() => import('./Dialogs/ChooseLiquidityPoolsDialog'), { ssr: false })
	const isMobileOnSize = useMediaQuery((theme: Theme) => theme.breakpoints.down('md'))

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

	const assetData = useMemo(() => assetMapping(assetIndex), [assetIndex])

	useEffect(() => {
		if (!isMobileOnSize) {
			setShowChart(true)
		} else {
			setShowChart(false)
		}
	}, [isMobileOnSize])

	const toggleShowTrading = () => {
		setShowChart(!showChart)
	}

	const openChooseLiquidityDialog = () => {
		setOpenChooseLiquidity(true)
	}

	const handleChoosePool = (assetId: number) => {
		setAssetIndex(assetId)
		setOpenChooseLiquidity(false)

		router.replace(`${RootLiquidityDir}/comet/new/${ASSETS[assetId].ticker}`)
	}

	return (
		<>
			<Stack width='100%' direction={isMobileOnSize ? 'column' : 'row'} spacing={isMobileOnSize ? 0 : 9} justifyContent="center" alignItems={isMobileOnSize ? "center" : ""}>
				<LeftBoxWrapper width={isMobileOnSize ? "100%" : "600px"} height='100%' overflow={isMobileOnSize ? 'auto' : 'hidden'} position={isMobileOnSize ? 'fixed' : 'relative'} top={isMobileOnSize ? '85px' : 'inherit'}>
					<GoBackButton onClick={() => router.back()}><Typography variant='p'>{'<'} Go back</Typography></GoBackButton>
					<Box mb='8px'>
						<Typography variant='h3' fontWeight={500}>New Comet Liquidity Position</Typography>
					</Box>
					<a href="https://docs.clone.so/system-architecture/comet-liquidity-system" target="_blank" rel="noreferrer">
						<TipMsg>
							<Image src={InfoIcon} alt='info' />
							<Typography variant='p' ml='10px' sx={{ cursor: 'pointer' }}>Comet Liquidity System is built to introduce hyper liquidity to clAssets. Click to learn more.</Typography>
						</TipMsg>
					</a>

					<Box padding='8px 0px' mb={isMobileOnSize ? '150px' : '0px'}>
						<Box paddingY='15px'>
							<CometPanel assetIndex={assetIndex} openChooseLiquidityDialog={openChooseLiquidityDialog} />
						</Box>
					</Box>
				</LeftBoxWrapper>

				{showChart &&
					<RightBoxWrapper width={isMobileOnSize ? '100%' : '472px'} py={isMobileOnSize ? '0px' : '8px'} bgcolor={isMobileOnSize ? '#0f0e14' : 'transparent'} zIndex={99}>
						<StickyBox top={isMobileOnSize ? '0px' : '100px'} px={isMobileOnSize ? '15px' : '0px'} py='10px'>
							<PriceChart assetIndex={assetIndex} publicKey={publicKey} priceTitle='Oracle Price' />
							{publicKey && assetData && <PoolAnalytics tickerSymbol={assetData.tickerSymbol} />}
						</StickyBox>
					</RightBoxWrapper>
				}
			</Stack>

			<ChooseLiquidityPoolsDialog
				open={openChooseLiquidity}
				handleChoosePool={handleChoosePool}
				handleClose={() => setOpenChooseLiquidity(false)}
			/>

			{isMobileOnSize && <ShowChartBtn onClick={() => toggleShowTrading()}>{showChart ? 'Hide Chart' : 'Show Chart'}</ShowChartBtn>}
		</>
	)
}

const LeftBoxWrapper = styled(Box)`
	padding: 8px 10px;
`
const RightBoxWrapper = styled(Box)`
	height: 100vh;
	padding-bottom: 55px;
`
const StickyBox = styled(Box)`
	width: 100%;
  position: sticky;
`

export default withSuspense(AssetView, <LoadingProgress />)
