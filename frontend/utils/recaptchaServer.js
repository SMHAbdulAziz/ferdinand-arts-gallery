/**
 * Verify reCAPTCHA v3 token
 */
export async function verifyRecaptcha(token) {
  const secretKey = process.env.RECAPTCHA_SECRET_KEY;

  try {
    const response = await fetch('https://www.google.com/recaptcha/api/siteverify', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: `secret=${secretKey}&response=${token}`,
    });

    const data = await response.json();

    // reCAPTCHA v3 returns a score between 0 and 1
    // Score of 1.0 is very likely a legitimate interaction
    // Score of 0.0 is very likely a bot
    const threshold = 0.5; // Adjust this based on your needs

    if (data.success && data.score >= threshold) {
      return { success: true, score: data.score };
    } else {
      return { success: false, score: data.score || 0, error: 'Failed verification' };
    }
  } catch (error) {
    console.error('reCAPTCHA verification error:', error);
    return { success: false, error: 'Verification server error' };
  }
}
