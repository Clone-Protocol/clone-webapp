import { StyledSection } from '~/components/Layout'
import { Container, Box, Typography } from '@mui/material'
import StatsList from '~/containers/Clone/Stats/StatsList'
import MetabaseStats from '~/containers/Clone/Stats/MetabaseStats'

const Stats = () => {
  return (
    <StyledSection sx={{ overflowX: 'hidden' }}>
      <Container>
        <Box sx={{ paddingX: { xs: '0px', md: '20px' }, paddingTop: '10px' }}>
          <Box><Typography fontSize='20px' fontWeight={500}>Stats</Typography></Box>
          <Box mt='10px'>
            <MetabaseStats />
          </Box>
          <Box mt='10px'>
            <StatsList />
          </Box>
        </Box>
      </Container>
    </StyledSection>
  )
}


export default Stats
