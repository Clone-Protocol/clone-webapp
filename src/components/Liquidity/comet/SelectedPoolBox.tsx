import { Box, Typography, Stack } from '@mui/material'
import { styled } from '@mui/material/styles'
import Image from 'next/image'
import { PoolStatusButton, showPoolStatus } from '~/components/Common/PoolStatus'
import { PositionInfo } from '~/features/Liquidity/comet/LiquidityPosition.query'
import { ON_USD } from '~/utils/constants'

interface Props {
  positionInfo: PositionInfo
}

const SelectedPoolBox: React.FC<Props> = ({ positionInfo }) => {
  return (
    <StackWrapper direction='row' alignItems='center' justifyContent='space-between'>
      <Box>
        <Typography variant='p_lg'>Liquidity pool</Typography>
        <Stack direction='row' alignItems='center' my='14px'>
          <Image src={positionInfo.tickerIcon} width={28} height={28} alt={positionInfo.tickerSymbol} />
          <Box sx={{ marginLeft: '9px' }}>
            <Typography variant='h3'>{positionInfo.tickerSymbol}/{ON_USD}</Typography>
          </Box>
        </Stack>
      </Box>
      <Box>
        {showPoolStatus(positionInfo.status) ?
          <PoolStatusButton status={positionInfo.status} />
          :
          <></>
        }
      </Box>
    </StackWrapper>
  )
}

const StackWrapper = styled(Stack)`
  background-color: #0a080f;
  border-radius: 10px;
  padding: 5px 23px;
`

export default SelectedPoolBox