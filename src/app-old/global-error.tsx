'use client'
import { Box, Container, Stack, Typography } from '@mui/material'
import { StyledSection } from '~/components/Layout'
import { FailedStatusBox } from '~/components/Common/TransactionStateSnackbar';
import SupportDiscordIcon from 'public/images/support-button-discord.svg'
import Image from 'next/image';
import * as Sentry from "@sentry/nextjs";
import Error from "next/error";
import { useEffect } from "react";

export default function GlobalError({ error }: { error: Error }) {
  useEffect(() => {
    Sentry.captureException(error);
  }, [error]);

  return (
    <html lang="en">
      <head>
        <title>Clone Markets - Cloned Assets to Supercharge your Portfolio</title>
        <meta name="description" content="Designed to bring unprecedented flexibility to trading on Solana, clAssets are optimized to scale Solana DeFi." />
        <meta property="og:title" content="Clone Markets - Cloned Assets to Supercharge your Portfolio" />
        <meta property="og:url" content="https://markets.clone.so/" />
        <meta property="og:image" content="/markets-meta-img.png" />
        <meta
          property="og:image:alt"
          content="Clone Markets"
        />
        <meta
          property="og:description"
          content="Designed to bring unprecedented flexibility to trading on Solana, clAssets are optimized to scale Solana DeFi."
        />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
      </head>
      <body>
        <StyledSection sx={{ color: '#fff' }}>
          <Container>
            <Stack width='300px' direction='column' alignItems='center' justifyContent='center' margin='0 auto' mt='130px'>
              <Box mb='10px'><Typography fontSize='70px' fontWeight={600} color='#c4b5fd'>{':('}</Typography></Box>
              <Typography variant="p_lg" textAlign='center'>{`We’re sorry, an unexpected error has occurred. If the error persists after reloading, please join us on Discord for support.`}</Typography>
              <a href="https://discord.gg/BXAeVWdmmD" target='_blank' rel="noreferrer"><FailedStatusBox width='74px' mt='15px'><Image src={SupportDiscordIcon} alt='discord' /> <Typography variant='p'>Discord</Typography></FailedStatusBox></a>
            </Stack>
          </Container>
        </StyledSection>
      </body>
    </html>
  )
}
