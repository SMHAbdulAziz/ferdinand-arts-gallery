import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <meta charSet="utf-8" />
        <link rel="icon" href="/favicon.ico" type="image/x-icon" />
        <meta name="theme-color" content="#1f2937" />
        <meta name="description" content="The FUND Gallery - Supporting young artists through community raffles. A ministry of the FUNDamental Qahal of the Most High." />
        
        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://thefundgallery.org" />
        <meta property="og:title" content="The FUND Gallery - Supporting Young Artists" />
        <meta property="og:description" content="Supporting young artists through community raffles. A ministry of the FUNDamental Qahal of the Most High." />

        {/* Twitter */}
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content="https://thefundgallery.org" />
        <meta property="twitter:title" content="The FUND Gallery - Supporting Young Artists" />
        <meta property="twitter:description" content="Supporting young artists through community raffles. A ministry of the FUNDamental Qahal of the Most High." />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}