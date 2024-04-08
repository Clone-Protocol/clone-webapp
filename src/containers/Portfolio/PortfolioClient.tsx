'use client'
import { Container } from '@mui/material'
import PortfolioView from '~/containers/Portfolio/PortfolioView'
import { StyledSection } from '~/components/Layout'

const PortfolioClient = () => {
  return (
    <div>
      <StyledSection>
        <Container>
          <PortfolioView />
        </Container>
      </StyledSection>
    </div>
  )
}

export default PortfolioClient
