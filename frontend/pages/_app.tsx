import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { AuthProvider } from '../context/AuthContext'
import { Toaster } from 'react-hot-toast'
import Head from 'next/head'

export default function App({ Component, pageProps }: AppProps) {
  // Verify reCAPTCHA env var is loaded on client
  if (typeof window !== 'undefined') {
    const recaptchaSiteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;
    if (!recaptchaSiteKey) {
      console.warn('⚠️ reCAPTCHA site key not configured: NEXT_PUBLIC_RECAPTCHA_SITE_KEY not found');
    } else {
      console.log('✓ reCAPTCHA site key loaded:', recaptchaSiteKey.substring(0, 10) + '...');
    }
  }

  return (
    <>
      <Head>
        {/* Google reCAPTCHA v2 Checkbox Script */}
        <script
          src="https://www.google.com/recaptcha/api.js"
          async
          defer
        ></script>
      </Head>
      <AuthProvider>
        <Component {...pageProps} />
        <Toaster />
      </AuthProvider>
    </>
  )
}