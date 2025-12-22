/**
 * Get hCAPTCHA token
 * User must manually complete the hCAPTCHA challenge first
 */
export function getHcaptchaToken() {
  if (typeof window === 'undefined' || !window.hcaptcha) {
    console.error('hCAPTCHA not loaded in window.hcaptcha');
    return null;
  }

  try {
    const token = window.hcaptcha.getResponse();
    if (!token || !token.response) {
      console.warn('hCAPTCHA challenge not completed - user must complete the challenge');
      return null;
    }
    console.log('✓ hCAPTCHA token obtained');
    return token.response;
  } catch (error) {
    console.error('Error getting hCAPTCHA token:', error);
    return null;
  }
}

/**
 * Reset hCAPTCHA after form submission
 */
export function resetHcaptcha() {
  if (typeof window === 'undefined' || !window.hcaptcha) {
    return;
  }

  try {
    window.hcaptcha.reset();
    console.log('✓ hCAPTCHA reset');
  } catch (error) {
    console.error('Error resetting hCAPTCHA:', error);
  }
}

/**
 * Legacy exports for backward compatibility
 */
export function getRecaptchaV2Token() {
  return getHcaptchaToken();
}

export function resetRecaptchaV2() {
  return resetHcaptcha();
}
