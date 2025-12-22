import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { AuthProvider } from '../context/AuthContext'
import { Toaster } from 'react-hot-toast'
import Script from 'next/script'

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      {/* hCAPTCHA Script - Using Next.js Script component */}
      <Script
        src="https://js.hcaptcha.com/1/api.js"
        strategy="afterInteractive"
        onLoad={() => {
          console.log('✓ hCAPTCHA script loaded successfully');
          if (typeof window !== 'undefined' && window['hcaptcha']) {
            console.log('✓ hcaptcha object available');
          }
        }}
        onError={() => {
          console.error('✗ Failed to load hCAPTCHA script');
        }}
      />
      <AuthProvider>
        <Component {...pageProps} />
        <Toaster />
      </AuthProvider>
    </>
  )
}