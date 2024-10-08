import { Paper } from '@mui/material'
import { styled } from '@mui/material/styles'
import { useState } from 'react'
import TradingComp from '~/components/Markets/TradingBox/TradingComp'
import { useRouter } from 'next/navigation'
import useLocalStorage from '~/hooks/useLocalStorage'
import { SLIPPAGE } from '~/data/localstorage'
import { ASSETS } from '~/data/assets'
import dynamic from 'next/dynamic'
import { RootMarketsDir } from '~/utils/constants'
import { DefaultBalance, MarketDetail } from '~/features/Markets/MarketDetail.query'

interface Props {
	assetId: number
	assetData: MarketDetail
	defaultBalance: DefaultBalance
}

const TradingBox: React.FC<Props> = ({ assetId, assetData, defaultBalance }) => {
	const router = useRouter()
	const [showSearchAssetDlog, setShowSearchAssetDlog] = useState(false)
	const [showOrderSetting, setShowOrderSetting] = useState(false)
	const [slippage, setLocalSlippage] = useLocalStorage(SLIPPAGE, 0.5)

	const SearchAssetDialog = dynamic(() => import('~/components/Markets/TradingBox/Dialogs/SearchAssetDialog'), { ssr: false })
	const SwapSettingDialog = dynamic(() => import('~/components/Markets/TradingBox/Dialogs/SwapSettingDialog'), { ssr: false })

	const chooseAsset = (id: number) => {
		setShowSearchAssetDlog(false)
		router.push(`${RootMarketsDir}/trade/${ASSETS[id].ticker}`)
	}

	const saveSetting = (slippage: number) => {
		setLocalSlippage(slippage)
		setShowOrderSetting(false)
	}

	return (
		<StyledPaper>
			<TradingComp
				assetIndex={assetId}
				assetData={assetData}
				defaultBalance={defaultBalance}
				slippage={slippage}
				onShowOption={() => setShowOrderSetting(true)}
				onShowSearchAsset={() => setShowSearchAssetDlog(true)}
			/>

			<SearchAssetDialog
				open={showSearchAssetDlog}
				onChooseAsset={(id) => chooseAsset(id)}
				onHide={() => setShowSearchAssetDlog(false)}
			/>

			<SwapSettingDialog
				open={showOrderSetting}
				onSaveSetting={(slippage) => saveSetting(slippage)}
			/>
		</StyledPaper>
	)
}

const StyledPaper = styled(Paper)`
  position: relative;
	width: 420px;
	background: transparent;
	text-align: center;
`

export default TradingBox
