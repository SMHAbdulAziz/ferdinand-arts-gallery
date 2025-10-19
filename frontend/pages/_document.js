import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <meta charSet="utf-8" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon.png" />
        <link rel="apple-touch-icon" sizes="180x180" href="/favicon.png" />
        <meta name="theme-color" content="#1f2937" />
        <meta name="description" content="The FUND Gallery - Supporting young artists through community raffles. A ministry of the FUNDamental Qahal of the Most High." />
        
        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://thefundgallery.org" />
        <meta property="og:title" content="The FUND Gallery - Supporting Young Artists" />
        <meta property="og:description" content="Supporting young artists through community raffles. A ministry of the FUNDamental Qahal of the Most High." />
        <meta property="og:image" content="https://thefundgallery.org/images/artworks/playful-giraffe.jpg" />

        {/* Twitter */}
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content="https://thefundgallery.org" />
        <meta property="twitter:title" content="The FUND Gallery - Supporting Young Artists" />
        <meta property="twitter:description" content="Supporting young artists through community raffles. A ministry of the FUNDamental Qahal of the Most High." />
        <meta property="twitter:image" content="https://thefundgallery.org/images/artworks/playful-giraffe.jpg" />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}