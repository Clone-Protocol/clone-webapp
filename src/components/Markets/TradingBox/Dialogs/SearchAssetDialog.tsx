import { Box, Dialog, DialogContent, Typography, Divider } from '@mui/material'
import { styled } from '@mui/material/styles'
import { FadeTransition } from '~/components/Common/Dialog'
import { useCallback, useState } from 'react'
import SearchInput from './SearchInput'
import GridAssets from './GridAssets'
import { CloseButton } from '~/components/Common/CommonButtons'

const SearchAssetDialog = ({ open, onChooseAsset, onHide }: { open: boolean, onChooseAsset: (id: number) => void, onHide: () => void }) => {
  const [searchTerm, setSearchTerm] = useState('')

  const handleSearch = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const newVal = e.currentTarget.value
    if (newVal) {
      setSearchTerm(newVal)
    } else {
      setSearchTerm('')
    }
  }, [searchTerm])

  return (
    <>
      <Dialog open={open} onClose={onHide} TransitionComponent={FadeTransition}>
        <DialogContent sx={{ backgroundColor: '#080018', border: '1px solid #414166', borderRadius: '10px', width: '100%', padding: '0px' }}>
          <BoxWrapper>
            <Box ml='25px' my='21px' mb="19px"><Typography variant='h3' fontWeight={500}>Search clAssets</Typography></Box>
            <Box mb='25px' px='11px'>
              <SearchInput onChange={handleSearch} />
            </Box>
            <StyledDivider />
            <GridAssets onChoose={onChooseAsset} searchTerm={searchTerm} />

            <Box sx={{ position: 'absolute', right: '10px', top: '10px' }}>
              <CloseButton handleClose={onHide} />
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
  overflow-y: hidden;
`
const StyledDivider = styled(Divider)`
  background-color: ${(props) => props.theme.basis.portGore};
`


export default SearchAssetDialog