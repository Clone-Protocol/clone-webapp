import React, { useCallback, useState } from 'react'
import { Box, Dialog, DialogContent, Typography, Divider } from '@mui/material'
import { styled } from '@mui/material/styles'
import { FadeTransition } from '~/components/Common/Dialog'
import SearchInput from '~/components/Liquidity/overview/SearchInput'
import { CloseButton } from '~/components/Common/CommonButtons'
import GridLiquidityPool from './GridLiquidityPool'

const ChooseLiquidityPoolsDialog = ({ open, handleChoosePool, handleClose }: { open: boolean, handleChoosePool: (id: number) => void, handleClose: () => void }) => {
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
      <Dialog open={open} onClose={handleClose} TransitionComponent={FadeTransition} maxWidth={375}>
        <DialogContent sx={{ backgroundColor: '#000e22', padding: '0', borderRadius: '20px', border: '1px solid #414166' }}>
          <BoxWrapper>
            <Box ml='25px' my='21px' mb="19px"><Typography variant='h3' fontWeight={500}>Search Liquidity Pools</Typography></Box>
            <Box mb='25px' px='11px' display='flex' justifyContent='center'>
              <SearchInput onChange={handleSearch} />
            </Box>
            <StyledDivider />
            <GridLiquidityPool onChoose={handleChoosePool} searchTerm={searchTerm} />

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
  min-width: 305px;
`
const StyledDivider = styled(Divider)`
  background-color: #414166;
`

export default ChooseLiquidityPoolsDialog

