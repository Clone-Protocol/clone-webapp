import { styled } from '@mui/material/styles'
import { ON_USD, ON_USD_NAME } from '~/utils/constants'

const BackdropPartMsg = ({ isUsdi, tickerSymbol }: { isUsdi: boolean, tickerSymbol: string | undefined }) => {
  return (
    <Wrapper>
      <TitleMsg>{isUsdi ? `Clone Markets are traded using ${ON_USD_NAME}. Please obtain ${ON_USD}.` : `Your ${tickerSymbol} balance is zero, therefore sell is disabled.`}</TitleMsg>
    </Wrapper>
  )
}

export default BackdropPartMsg

const Wrapper = styled('div')`
  position: absolute;
  display: flex;
  justify-content: center;
  align-items: center;
  left: 0px;
  top: 200px;
  width: 100%;
  height: 360px;
  border-radius: 10px;
  background-color: rgba(20, 20, 20, 0.95);
  z-index: 800;
`
const TitleMsg = styled('div')`
  width: 186px;
  font-size: 12px;
  font-weight: 500;
	color: #fff;  
`
