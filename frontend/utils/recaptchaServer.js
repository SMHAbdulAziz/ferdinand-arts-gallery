/**
 * Verify reCAPTCHA v3 token
 */
export async function verifyRecaptcha(token) {
  const secretKey = process.env.RECAPTCHA_SECRET_KEY;

  // If secret key is not configured, log warning but don't fail
  if (!secretKey) {
    console.warn('WARNING: RECAPTCHA_SECRET_KEY is not configured. Verification will be skipped.');
    return { success: true, score: 1.0, warning: 'reCAPTCHA not configured' };
  }

  try {
    const response = await fetch('https://www.google.com/recaptcha/api/siteverify', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: `secret=${secretKey}&response=${token}`,
    });

    const data = await response.json();

    console.log('reCAPTCHA verification response:', {
      success: data.success,
      score: data.score,
      action: data.action,
      challengeTimestamp: data.challenge_ts,
      hostname: data.hostname,
      errorCodes: data['error-codes']
    });

    // reCAPTCHA v3 returns a score between 0 and 1
    // Score of 1.0 is very likely a legitimate interaction
    // Score of 0.0 is very likely a bot
    const threshold = 0.5; // Adjust this based on your needs

    if (data.success && data.score >= threshold) {
      return { success: true, score: data.score };
    } else {
      const errorMsg = data['error-codes']?.[0] || 'Failed verification';
      console.warn('reCAPTCHA verification failed:', {
        success: data.success,
        score: data.score,
        threshold,
        error: errorMsg
      });
      return { success: false, score: data.score || 0, error: errorMsg };
    }
  } catch (error) {
    console.error('reCAPTCHA verification error:', error);
    return { success: false, error: 'Verification server error: ' + error.message };
  }
}

