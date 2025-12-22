import { useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';
import Layout from '../components/layout/Layout';
import { useAuth } from '../context/AuthContext';
import { getRecaptchaV2Token, resetRecaptchaV2 } from '../utils/recaptchaV2';
import toast from 'react-hot-toast';

export default function LoginPage() {
  const router = useRouter();
  const { login, isAuthenticated } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);

  // Redirect if already authenticated
  if (isAuthenticated) {
    router.push('/dashboard');
    return null;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Get reCAPTCHA v2 token from checkbox
      const recaptchaToken = getRecaptchaV2Token();
      if (!recaptchaToken) {
        toast.error('Please verify the reCAPTCHA checkbox');
        setLoading(false);
        return;
      }

      // Pass recaptchaToken to login function
      const result = await login(email, password, rememberMe, recaptchaToken);

      if (result.success) {
        toast.success('Logged in successfully!');
        resetRecaptchaV2();
        router.push('/dashboard');
      } else {
        toast.error(result.error || 'Login failed');
        resetRecaptchaV2();
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>Login - THE FUND Gallery</title>
        <meta name="description" content="Login to your THE FUND Gallery account" />
      </Head>

      <Layout>
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center py-12 px-4">
          <div className="w-full max-w-md">
            <div className="bg-white rounded-lg shadow-lg p-8">
              <h1 className="text-3xl font-bold text-center mb-2 text-slate-900">
                Welcome Back
              </h1>
              <p className="text-center text-slate-600 mb-8">
                Login to your account to view your raffle tickets and purchase history
              </p>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Email */}
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="you@example.com"
                    required
                  />
                </div>

                {/* Password */}
                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-slate-700 mb-2">
                    Password
                  </label>
                  <input
                    type="password"
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="••••••••"
                    required
                  />
                </div>

                {/* Remember Me */}
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="rememberMe"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                  />
                  <label htmlFor="rememberMe" className="ml-2 text-sm text-slate-600">
                    Remember me on this device
                  </label>
                </div>

                {/* reCAPTCHA Checkbox */}
                <div className="flex justify-center">
                  <div 
                    className="g-recaptcha" 
                    data-sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY}
                  ></div>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-medium py-2 px-4 rounded-lg transition duration-200"
                >
                  {loading ? 'Logging in...' : 'Login'}
                </button>
              </form>

              {/* Signup Link */}
              <p className="mt-6 text-center text-slate-600">
                Don't have an account?{' '}
                <Link href="/signup" className="text-blue-600 hover:underline font-medium">
                  Sign up here
                </Link>
              </p>
            </div>
          </div>
        </div>
      </Layout>
    </>
  );
}
