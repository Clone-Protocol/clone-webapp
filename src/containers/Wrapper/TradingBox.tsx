import { Paper } from '@mui/material'
import { styled } from '@mui/material/styles'
import { useState } from 'react'
import TradingComp from '~/components/Wrapper/TradingComp'
import dynamic from 'next/dynamic'
import WrapBridgeDialog from '~/components/Wrapper/WrapBridgeDialog'
import { ARB_Widget, OP_Widget } from '~/utils/debridge_widgets'
import { AssetTickers } from '~/data/assets'

const TradingBox: React.FC = () => {
	const ChooseAssetDialog = dynamic(() => import('./Dialogs/ChooseAssetDialog'))
	const [openChooseAsset, setOpenChooseAsset] = useState(false)
	const [assetIndex, setAssetIndex] = useState(0)
	const [openWrapBridge, setOpenWrapBridge] = useState(false)
	const [widgetType, setWidgetType] = useState(ARB_Widget)

	const handleChooseAsset = (assetId: number) => {
		setAssetIndex(assetId)
		setOpenChooseAsset(false)

		if (assetId === AssetTickers.arbitrum) {
			setWidgetType(ARB_Widget)
		} else if (assetId === AssetTickers.optimism) {
			setWidgetType(OP_Widget)
		}
	}

	return (
		<StyledPaper>
			<TradingComp
				assetIndex={assetIndex}
				onShowSearchAsset={() => setOpenChooseAsset(true)}
				onShowWrapBridge={() => setOpenWrapBridge(true)}
			/>

			<ChooseAssetDialog
				open={openChooseAsset}
				handleChooseAsset={handleChooseAsset}
				handleClose={() => setOpenChooseAsset(false)}
			/>

			<WrapBridgeDialog
				open={openWrapBridge}
				widgetType={widgetType}
				handleClose={() => setOpenWrapBridge(false)}
			/>
		</StyledPaper>
	)
}

const StyledPaper = styled(Paper)`
  position: relative;
	width: 360px;
	background: transparent;
	text-align: center;
`

export default TradingBox
