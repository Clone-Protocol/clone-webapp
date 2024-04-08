'use client'
import { Container, Typography, Box, Button } from '@mui/material'
import { styled } from '@mui/material/styles'
import logoIcon from 'public/images/logo-markets.svg'
import Image from 'next/image'
import { StyledSection } from '~/components/Layout'
const NotFound = () => {
  return (
    <StyledSection>
      <Container>
        <Box mt='150px' textAlign='center'>
          <Box mb='10px'>
            <Image src={logoIcon} width={100} height={26} alt="clone" />
          </Box>
          <Box mb='30px' lineHeight={0.8}>
            <Typography fontSize='70px' fontWeight={600} color='#c4b5fd'>404</Typography>
            <Typography variant='p_lg' fontWeight={600}>Page not found</Typography>
          </Box>
          <a href='/'><ReturnButton><Typography variant='p_lg'>Return Home</Typography></ReturnButton></a>
        </Box>
      </Container>
    </StyledSection>
  )
}

const ReturnButton = styled(Button)`
  width: 158px;
  height: 42px;
  border-radius: 10px;
  box-shadow: 0 0 10px 0 #6d5887;
  border: solid 1px ${(props) => props.theme.basis.melrose};
  background-color: #000;
  color: #fff;
  &:hover {
    border: solid 1px ${(props) => props.theme.basis.lightSlateBlue};
    background: transparent;
  }
`

export default NotFound