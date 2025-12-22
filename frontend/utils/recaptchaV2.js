/**
 * Get reCAPTCHA v2 Checkbox token
 * User must manually check the checkbox first
 */
export function getRecaptchaV2Token() {
  if (typeof window === 'undefined' || !window.grecaptcha) {
    console.warn('reCAPTCHA v2 not loaded');
    return null;
  }

  try {
    const token = window.grecaptcha.getResponse();
    if (!token) {
      console.warn('reCAPTCHA checkbox not verified - user must check the box');
      return null;
    }
    return token;
  } catch (error) {
    console.error('Error getting reCAPTCHA v2 token:', error);
    return null;
  }
}

/**
 * Reset reCAPTCHA v2 after form submission
 */
export function resetRecaptchaV2() {
  if (typeof window === 'undefined' || !window.grecaptcha) {
    return;
  }

  try {
    window.grecaptcha.reset();
  } catch (error) {
    console.error('Error resetting reCAPTCHA v2:', error);
  }
}
