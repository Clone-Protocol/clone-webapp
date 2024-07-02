import { Box, styled, Dialog, DialogContent, Typography, Divider } from '@mui/material'
import { FadeTransition } from '~/components/Common/Dialog'
import GridAssets from './GridAssets'
import { CloseButton } from '~/components/Common/CommonButtons'
import { AssetList } from '~/features/Wrapper/Assets.query'
import { LoadingProgress } from '~/components/Common/Loading'
import withSuspense from '~/hocs/withSuspense'
import { ASSETS } from '~/data/assets_evm'
import { Status } from 'clone-protocol-sdk/sdk/generated/clone'

const ChooseAssetEvmDialog = ({ open, handleChooseAsset, handleClose }: { open: boolean, handleChooseAsset: (id: number) => void, handleClose: () => void }) => {
  const assets: AssetList[] = ASSETS.map((asset, index) => ({
    id: index,
    tickerName: asset.tickerName,
    tickerSymbol: asset.fromTickerSymbol,
    tickerIcon: asset.tickerIcon,
    assetType: 0,
    balance: 0,
    status: Status.Active
  }))

  return (
    <>
      <Dialog open={open} onClose={handleClose} TransitionComponent={FadeTransition} maxWidth={375}>
        <DialogContent sx={{ backgroundColor: '#000e22', width: '100%', padding: '0', borderRadius: '20px', border: '1px solid #414166' }}>
          <BoxWrapper>
            <Box ml='25px' my='21px' mb="19px"><Typography variant='h3' fontWeight={500}>Search Token</Typography></Box>
            <StyledDivider />
            <GridAssets assets={assets} onChoose={handleChooseAsset} />

            <Box sx={{ position: 'absolute', right: '10px', top: '10px' }}>
              <CloseButton handleClose={handleClose} />
            </Box>
          </BoxWrapper>
        </DialogContent>
      </Dialog>
    </>
  )
}

const BoxWrapper = styled(Box)`
  color: #fff; 
  width: 100%;
  min-width: 280px;
  overflow-x: hidden;
  overflow-y: hidden;
`
const StyledDivider = styled(Divider)`
  background-color: #414166;
`

export default withSuspense(ChooseAssetEvmDialog, <LoadingProgress />)

