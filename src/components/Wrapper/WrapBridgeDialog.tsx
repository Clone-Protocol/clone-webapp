import { Box, Dialog, DialogContent, Stack } from '@mui/material'
import { styled } from '@mui/material/styles'
import { FadeTransition } from '~/components/Common/Dialog'
import { CloseButton } from '../Common/CommonButtons'
import DebridgeWidget from '../Bridge/DebridgeWidget'
import { WidgetType } from '~/utils/debridge_widgets'

const WrapBridgeDialog = ({ open, widgetType, handleClose }: { open: boolean, widgetType: WidgetType, handleClose: () => void }) => {
  const close = () => {
    handleClose()
  }

  return (
    <>
      <Dialog open={open} onClose={close} TransitionComponent={FadeTransition} maxWidth={463} sx={{ overflowX: 'hidden' }}>
        <DialogContent sx={{ backgroundColor: '#000916', borderRadius: '10px', paddingY: '15px', paddingX: '0px', height: '540px', overflowX: 'hidden', width: { xs: '100%', md: '340px' } }}>
          <BoxWrapper>
            <Box position='absolute' top='0px' width='100%' paddingTop='15px' zIndex={999} sx={{ backgroundColor: '#000916' }}>
              <Stack direction='row' justifyContent='space-between' >
                <Box></Box>
                <Box mr='15px'>
                  <CloseButton handleClose={close} />
                </Box>
              </Stack>
            </Box>

            <Box mt='10px'>
              <DebridgeWidget widgetType={widgetType} />
            </Box>
          </BoxWrapper>
        </DialogContent>
      </Dialog>
    </>
  )
}


const BoxWrapper = styled(Box)`
  padding: 12px 0px; 
  color: #fff;
  text-align: center;
  overflow-x: hidden;
`
export default WrapBridgeDialog

