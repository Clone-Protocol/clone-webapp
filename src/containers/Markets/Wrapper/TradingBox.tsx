import { Box, Paper } from '@mui/material'
import { styled } from '@mui/material/styles'
import { useState } from 'react'
import TradingComp from '~/components/Markets/Wrapper/TradingComp'
import dynamic from 'next/dynamic'
import WrapBridgeDialog from '~/components/Markets/Wrapper/WrapBridgeDialog'
import { ARB_Widget, OP_Widget } from '~/utils/debridge_widgets'
import { AssetTickers } from '~/data/assets'
import TradingComp1M from '~/components/Markets/Wrapper/TradingComp1M'
import { InfoMsg2 } from '~/components/Common/WarningMsg'
import { StyledTabs, StyledTab } from "~/components/Common/StyledTab"

const TradingBox: React.FC = () => {
	const ChooseAssetDialog = dynamic(() => import('./Dialogs/ChooseAssetDialog'))
	const ChooseAssetEvmDialog = dynamic(() => import('./Dialogs/ChooseAssetEvmDialog'))
	const [openChooseAsset, setOpenChooseAsset] = useState(false)
	const [assetIndex, setAssetIndex] = useState(0)
	//for evm
	const [assetEvmIndex, setAssetEvmIndex] = useState(0)
	const [openChooseEvmAsset, setOpenChooseEvmAsset] = useState(false)
	const [openWrapBridge, setOpenWrapBridge] = useState(false)
	const [widgetType, setWidgetType] = useState(ARB_Widget)
	const [tab, setTab] = useState(0)

	const handleChangeTab = (event: React.SyntheticEvent, newValue: number) => {
		setTab(newValue)
	}

	const handleChooseAsset = (assetId: number) => {
		setAssetIndex(assetId)
		setOpenChooseAsset(false)

		if (assetId === AssetTickers.arbitrum) {
			setWidgetType(ARB_Widget)
		} else if (assetId === AssetTickers.optimism) {
			setWidgetType(OP_Widget)
		}
	}

	const handleChooseEvmAsset = (assetId: number) => {
		setAssetEvmIndex(assetId)
		setOpenChooseEvmAsset(false)
	}

	return (
		<StyledPaper>
			<Box sx={{ backgroundColor: '#1a1c28', borderRadius: '10px' }}>
				<StyledTabs value={tab} onChange={handleChangeTab}>
					<StyledTab value={0} label="clAsset Wrapper" width='180px' allBorderRadius={true} />
					<StyledTab value={1} label="1M Wrapper" width='180px' allBorderRadius={true} />
				</StyledTabs>
			</Box>

			<Box mt='21px'>
				<InfoMsg2>
					{tab === 0 ? 'clAsset Wrapper lets users mint clAssets by wrapping bridged assets, enabling arbitrage on Clone.' : '1M Wrapper lets users convert tokens into 1M tokens at a 1:1,000,000 ratio.'}
				</InfoMsg2>
			</Box>
			<Divider />

			{tab === 0 ?
				<TradingComp
					assetIndex={assetIndex}
					onShowSearchAsset={() => setOpenChooseAsset(true)}
					onShowWrapBridge={() => setOpenWrapBridge(true)}
				/>
				:
				<TradingComp1M
					assetIndex={assetEvmIndex}
					onShowSearchAsset={() => setOpenChooseEvmAsset(true)}
					onShowWrapBridge={() => setOpenWrapBridge(true)}
				/>
			}

			<ChooseAssetDialog
				open={openChooseAsset}
				handleChooseAsset={handleChooseAsset}
				handleClose={() => setOpenChooseAsset(false)}
			/>

			<ChooseAssetEvmDialog
				open={openChooseEvmAsset}
				handleChooseAsset={handleChooseEvmAsset}
				handleClose={() => setOpenChooseEvmAsset(false)}
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
	width: 402px;
	background: transparent;
	text-align: center;
	border: 1px solid #414e66;
	border-radius: 10px;
	padding: 20px;
`
const Divider = styled(Box)`
	width: 100%;
	height: 1px;
	background: #414e66;
	margin-top: 22px;
	margin-bottom: 22px;
`

export default TradingBox
