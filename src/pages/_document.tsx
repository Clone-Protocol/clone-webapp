import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <title>Clone Markets - Cloned Assets to Supercharge your Portfolio</title>
        <meta name="description" content="Designed to bring unprecedented flexibility to trading on Solana, clAssets are optimized to scale Solana DeFi." />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <meta property="og:title" content="Clone Markets - Cloned Assets to Supercharge your Portfolio" />
        <meta property="og:url" content="https://markets.clone.so/" />
        <meta property="og:image" content="/markets-meta-img.png" />
        <meta property="og:image:alt" content="Clone Markets" />
        <meta
          property="og:description"
          content="Designed to bring unprecedented flexibility to trading on Solana, clAssets are optimized to scale Solana DeFi."
        />
        <link rel="manifest" href="/site.webmanifest" />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}