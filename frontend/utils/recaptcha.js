/**
 * Get reCAPTCHA v3 token
 */
export async function getRecaptchaToken(action = 'submit') {
  if (!window.grecaptcha) {
    console.error('reCAPTCHA not loaded');
    return null;
  }

  try {
    const token = await window.grecaptcha.execute(
      process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY,
      { action }
    );
    return token;
  } catch (error) {
    console.error('Error getting reCAPTCHA token:', error);
    return null;
  }
}
