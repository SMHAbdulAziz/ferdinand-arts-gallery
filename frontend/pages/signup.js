import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';
import Layout from '../components/layout/Layout';
import { useAuth } from '../context/AuthContext';
import { getRecaptchaV2Token, resetRecaptchaV2 } from '../utils/recaptchaV2';
import { parsePhoneNumber } from 'libphonenumber-js';
import { getCountryCodeFromCallingCode } from '../utils/countryCodeMap';
import toast from 'react-hot-toast';

export default function SignupPage() {
  const router = useRouter();
  const { signup, isAuthenticated } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [countryCode, setCountryCode] = useState('+1');
  const [phone, setPhone] = useState('');
  const [phoneError, setPhoneError] = useState('');
  const [loading, setLoading] = useState(false);
  const [recaptchaReady, setRecaptchaReady] = useState(false);

  // Check if hCAPTCHA script is loaded
  useEffect(() => {
    const checkHcaptcha = () => {
      if (typeof window !== 'undefined' && window['hcaptcha']) {
        setRecaptchaReady(true);
        console.log('✓ hCAPTCHA ready to render');
      } else {
        setTimeout(checkHcaptcha, 100);
      }
    };
    checkHcaptcha();
  }, []);

  // Validate phone number in real-time
  const validatePhoneInput = (phoneValue) => {
    if (!phoneValue) {
      setPhoneError('');
      return;
    }

    try {
      // Get the proper ISO country code from the calling code
      const isoCountryCode = getCountryCodeFromCallingCode(countryCode);
      const parsed = parsePhoneNumber(phoneValue, isoCountryCode);
      if (parsed && parsed.isValid()) {
        setPhoneError('');
      } else {
        setPhoneError('Invalid phone number for this country');
      }
    } catch (err) {
      setPhoneError('Invalid phone format');
    }
  };

  const handlePhoneChange = (e) => {
    const value = e.target.value;
    setPhone(value);
    validatePhoneInput(value);
  };

  const handleCountryCodeChange = (e) => {
    const value = e.target.value;
    setCountryCode(value);
    // Revalidate phone with new country code
    if (phone) {
      validatePhoneInput(phone);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Final phone validation
    try {
      const isoCountryCode = getCountryCodeFromCallingCode(countryCode);
      const parsed = parsePhoneNumber(phone, isoCountryCode);
      if (!parsed || !parsed.isValid()) {
        toast.error('Please enter a valid phone number');
        setLoading(false);
        return;
      }
    } catch (err) {
      toast.error('Invalid phone number');
      setLoading(false);
      return;
    }

    try {
      // Get reCAPTCHA v2 token from checkbox
      const recaptchaToken = getRecaptchaV2Token();
      if (!recaptchaToken) {
        toast.error('Please verify the reCAPTCHA checkbox');
        setLoading(false);
        return;
      }

      const result = await signup(email, password, firstName, lastName, phone, countryCode, recaptchaToken);

      if (result.success) {
        toast.success('Account created! Redirecting to dashboard...');
        resetRecaptchaV2();
        setTimeout(() => router.push('/dashboard'), 1500);
      } else {
        toast.error(result.error || 'Signup failed');
        resetRecaptchaV2();
      }
    } finally {
      setLoading(false);
    }
  };

  // Redirect if already authenticated
  if (isAuthenticated) {
    router.push('/dashboard');
    return null;
  }

  return (
    <>
      <Head>
        <title>Sign Up - THE FUND Gallery</title>
        <meta name="description" content="Create a new THE FUND Gallery account" />
      </Head>

      <Layout>
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center py-12 px-4">
          <div className="w-full max-w-md">
            <div className="bg-white rounded-lg shadow-lg p-8">
              <h1 className="text-3xl font-bold text-center mb-2 text-slate-900">
                Create Account
              </h1>
              <p className="text-center text-slate-600 mb-8">
                Join THE FUND Gallery to participate in raffles and support young artists
              </p>

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* First Name */}
                <div>
                  <label htmlFor="firstName" className="block text-sm font-medium text-slate-700 mb-2">
                    First Name *
                  </label>
                  <input
                    type="text"
                    id="firstName"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="John"
                    required
                  />
                </div>

                {/* Last Name */}
                <div>
                  <label htmlFor="lastName" className="block text-sm font-medium text-slate-700 mb-2">
                    Last Name *
                  </label>
                  <input
                    type="text"
                    id="lastName"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Doe"
                    required
                  />
                </div>

                {/* Phone Number */}
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-slate-700 mb-2">
                    Phone Number *
                  </label>
                  <div className="flex gap-2">
                    <select
                      value={countryCode}
                      onChange={handleCountryCodeChange}
                      className="w-24 px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    >
                      <option value="+1">🇺🇸 +1</option>
                      <option value="+44">🇬🇧 +44</option>
                      <option value="+91">🇮🇳 +91</option>
                      <option value="+86">🇨🇳 +86</option>
                      <option value="+81">🇯🇵 +81</option>
                      <option value="+33">🇫🇷 +33</option>
                      <option value="+49">🇩🇪 +49</option>
                      <option value="+39">🇮🇹 +39</option>
                      <option value="+34">🇪🇸 +34</option>
                      <option value="+31">🇳🇱 +31</option>
                      <option value="+46">🇸🇪 +46</option>
                      <option value="+47">🇳🇴 +47</option>
                      <option value="+41">🇨🇭 +41</option>
                      <option value="+43">🇦🇹 +43</option>
                      <option value="+61">🇦🇺 +61</option>
                      <option value="+64">🇳🇿 +64</option>
                      <option value="+1-246">🇧🇧 +1-246</option>
                      <option value="+1-242">🇧🇸 +1-242</option>
                      <option value="+1-441">🇧🇲 +1-441</option>
                      <option value="+1-876">🇯🇲 +1-876</option>
                    </select>
                    <input
                      type="tel"
                      id="phone"
                      value={phone}
                      onChange={handlePhoneChange}
                      className={`flex-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                        phoneError ? 'border-red-500' : 'border-slate-300'
                      }`}
                      placeholder="(555) 123-4567"
                      required
                    />
                  </div>
                  {phoneError && (
                    <p className="text-sm text-red-600 mt-1">{phoneError}</p>
                  )}
                </div>

                {/* Email */}
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-2">
                    Email Address *
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
                  <p className="text-xs text-slate-500 mt-2">
                    Minimum 8 characters, uppercase, lowercase, and number required
                  </p>
                </div>

                {/* hCAPTCHA Widget */}
                <div className="flex justify-center">
                  {recaptchaReady ? (
                    <div 
                      className="h-captcha" 
                      data-sitekey={process.env.NEXT_PUBLIC_HCAPTCHA_SITEKEY || "25f017a0-d5cc-4350-b376-abec707c652e"}
                    ></div>
                  ) : (
                    <div className="text-center text-sm text-slate-600">
                      Loading security verification...
                    </div>
                  )}
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={loading || phoneError !== ''}
                  className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-medium py-2 px-4 rounded-lg transition duration-200 mt-6"
                >
                  {loading ? 'Creating Account...' : 'Sign Up'}
                </button>
              </form>

              {/* Login Link */}
              <p className="mt-6 text-center text-slate-600">
                Already have an account?{' '}
                <Link href="/login" className="text-blue-600 hover:underline font-medium">
                  Login here
                </Link>
              </p>
            </div>
          </div>
        </div>
      </Layout>
    </>
  );
}
