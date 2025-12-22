/**
 * Get reCAPTCHA v3 token
 */
export async function getRecaptchaToken(action = 'submit') {
  // Check if site key is configured
  const siteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;
  if (!siteKey) {
    console.warn('WARNING: NEXT_PUBLIC_RECAPTCHA_SITE_KEY is not configured.');
    return 'DEMO_TOKEN_RECAPTCHA_NOT_CONFIGURED';
  }

  if (!window.grecaptcha) {
    console.error('reCAPTCHA script not loaded. Check that the script is in _app.tsx');
    return null;
  }

  try {
    console.log('Requesting reCAPTCHA token for action:', action);
    const token = await window.grecaptcha.execute(siteKey, { action });
    console.log('Successfully obtained reCAPTCHA token');
    return token;
  } catch (error) {
    console.error('Error getting reCAPTCHA token:', error);
    return null;
  }
}

