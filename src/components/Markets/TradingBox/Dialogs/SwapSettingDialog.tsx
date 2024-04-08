import { Box, Dialog, DialogContent, FormControl, Stack, Typography } from '@mui/material'
import { styled } from '@mui/material/styles'
import { FadeTransition } from '~/components/Common/Dialog'
import useLocalStorage from '~/hooks/useLocalStorage'
import { StyledTabs, StyledTab } from './OrderSettingSlippage'
import { useEffect, useState } from 'react'
import { SLIPPAGE } from '~/data/localstorage'
import { CloseButton } from '~/components/Common/CommonButtons'
import { useSnackbar } from 'notistack'
import useDebounce from '~/hooks/useDebounce'

const SwapSettingDialog = ({ open, onSaveSetting }: { open: boolean, onSaveSetting: (slippage: number) => void }) => {
  const { enqueueSnackbar } = useSnackbar()
  const [customInputValue, setCustomInputValue] = useState('')
  const [customSlippage, setCustomSlippage] = useState(NaN)
  const [slippage, setSlippage] = useState(1)
  const [localSlippage, _] = useLocalStorage(SLIPPAGE, 1)
  const [showErrorMsg, setShowErrorMsg] = useState(false)

  useEffect(() => {
    if (localSlippage === 0.1 || localSlippage === 0.5 || localSlippage === 1) {
      setSlippage(localSlippage)
    } else {
      setCustomSlippage(localSlippage)
      setCustomInputValue(localSlippage.toString())
    }
  }, [localSlippage])

  const handleSlippageChange = (event: React.SyntheticEvent, newValue: number) => {
    setSlippage(newValue)
    setCustomInputValue('')
    setCustomSlippage(NaN)
    enqueueSnackbar(`Slippage tolerance set to ${newValue}%`)
  }

  const showDebounceSnackbar = useDebounce((newData) => {
    enqueueSnackbar(`Slippage tolerance set to ${newData}%`)
  }, 1000)

  const onChangeCustom = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newData = parseFloat(e.currentTarget.value)
    // console.log('n', e.currentTarget.value + "/" + newData)
    if (isNaN(newData) || newData < 0) {
      setCustomInputValue('')
      setCustomSlippage(NaN)
      setShowErrorMsg(false)
    } else if (newData <= 100) {
      setCustomInputValue(e.currentTarget.value)
      setCustomSlippage(parseFloat(newData.toFixed(2)))
      if (newData < 0.1) {
        setShowErrorMsg(true)
      } else {
        setShowErrorMsg(false)
      }
      showDebounceSnackbar(newData.toString())
    }
  }

  const onSave = () => {
    if (customSlippage > 0) {
      onSaveSetting(customSlippage)
    } else {
      onSaveSetting(slippage)
    }
  }

  return (
    <>
      <Dialog open={open} onClose={onSave} TransitionComponent={FadeTransition}>
        <DialogContent sx={{ backgroundColor: '#080018', border: '1px solid #414166', borderRadius: '10px', width: { xs: '100%', md: '330px' } }}>
          <BoxWrapper>
            <Box mb="15px"><Typography variant='h3' fontWeight={500}>Swap Settings</Typography></Box>
            <Box mb='5px'><Typography variant='p_lg'>Max slippage tolerance</Typography></Box>
            <Box lineHeight={1}><Typography variant='p' color='#8988a3'>Your transaction will revert if price changes unfavorably by more than this percentage.</Typography></Box>
            <SlippageStack direction="row" alignItems="center">
              <StyledTabs value={!isNaN(customSlippage) ? 0 : slippage} onChange={handleSlippageChange}>
                <StyledTab value={0.1} label="0.1%" />
                <StyledTab value={0.5} label="0.5%" />
                <StyledTab value={1} label="1%" />
              </StyledTabs>

              <FormControl variant="standard" sx={{ width: '120px', height: '40px' }}>
                <FormStack direction="row" justifyContent="space-between" alignItems="center" sx={!isNaN(customSlippage) ? { border: '1px solid #c4b5fd', borderRadius: '7px', color: '#fff' } : {}}>
                  <CustomSlippagePlaceholder>
                    <Typography variant='p'>Custom</Typography>
                  </CustomSlippagePlaceholder>
                  <Box position='relative'>
                    <InputAmount id="ip-amount" type="number" placeholder="0.00" sx={!isNaN(customSlippage) ? { color: '#fff' } : { color: 'rgba(137, 136, 163, 0.8)' }} value={customInputValue} onChange={onChangeCustom} />
                    <Box position='absolute' top='6px' right='10px'><Typography variant='p' color='#fff'>%</Typography></Box>
                  </Box>
                </FormStack>
              </FormControl>
            </SlippageStack>

            {showErrorMsg &&
              <Box mt='10px' lineHeight={1}><Typography variant='p' color='#ed2525'>Your transaction may be reverted due to low slippage tolerance</Typography></Box>
            }

            <Box sx={{ position: 'absolute', right: '10px', top: '10px' }}>
              <CloseButton handleClose={onSave} />
            </Box>
          </BoxWrapper>
        </DialogContent>
      </Dialog>
    </>
  )
}

const BoxWrapper = styled(Box)`
  padding: 1px; 
  color: #fff;
  width: 100%;
  overflow-x: hidden;
`
const SlippageStack = styled(Stack)`
  background-color: transparent;
  width: 272px;
  height: 40px;
  border-radius: 10px;
  margin-top: 10px;
`
const FormStack = styled(Stack)`
	display: flex;
	width: 120px;
	height: 40px;
	padding: 6px;
  color: ${(props) => props.theme.basis.textRaven};
  background: rgba(255, 255, 255, 0.05);
`
const CustomSlippagePlaceholder = styled(Box)`
  width: 66px; 
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  margin-right: 5px;
  color: rgba(255, 255, 255, 0.7);
`
const InputAmount = styled(`input`)`
	width: 66px;
  height: 40px;
	text-align: right;
  background-color: rgba(255, 255, 255, 0.05);
  border-top-right-radius: 10px;
  border-bottom-right-radius: 10px;
	border: 0px;
	font-size: 14px;
  padding-right: 25px;
  color: #fff;
`

export default SwapSettingDialog