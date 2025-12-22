import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { AuthProvider } from '../context/AuthContext'
import { Toaster } from 'react-hot-toast'
import Script from 'next/script'

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      {/* Google reCAPTCHA v2 Checkbox Script - Using Next.js Script component */}
      <Script
        src="https://www.google.com/recaptcha/api.js"
        strategy="afterInteractive"
        onLoad={() => {
          console.log('✓ reCAPTCHA script loaded successfully');
          if (typeof window !== 'undefined' && (window as any).grecaptcha) {
            console.log('✓ grecaptcha object available');
          }
        }}
        onError={() => {
          console.error('✗ Failed to load reCAPTCHA script');
        }}
      />
      <AuthProvider>
        <Component {...pageProps} />
        <Toaster />
      </AuthProvider>
    </>
  )
}