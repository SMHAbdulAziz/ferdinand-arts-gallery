import { verifyPassword, generateToken, isValidEmail, generateRememberToken } from '../../../utils/auth';
import { query } from '../../../utils/db';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { email, password, rememberMe, hcaptchaToken } = req.body;

  try {
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    if (!isValidEmail(email)) {
      return res.status(400).json({ error: 'Invalid email format' });
    }

    // Verify hCAPTCHA token
    if (!hcaptchaToken) {
      return res.status(400).json({ error: 'hCAPTCHA verification required' });
    }

    try {
      const hcaptchaResponse = await fetch('https://hcaptcha.com/siteverify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: `secret=${process.env.HCAPTCHA_SECRET_KEY}&response=${hcaptchaToken}`
      });

      const hcaptchaData = await hcaptchaResponse.json();
      if (!hcaptchaData.success) {
        console.error('hCAPTCHA verification failed:', hcaptchaData);
        return res.status(400).json({ error: 'Human verification failed. Please try again.' });
      }
    } catch (hcaptchaErr) {
      console.error('hCAPTCHA error:', hcaptchaErr);
      return res.status(400).json({ error: 'Human verification failed. Please try again.' });
    }

    // Find user
    const result = await query(
      'SELECT id, email, password_hash, first_name, last_name, role FROM users WHERE email = $1',
      [email.toLowerCase()]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const user = result.rows[0];

    // Verify password
    if (!verifyPassword(password, user.password_hash)) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // Generate token
    const token = generateToken(user.id, user.email);

    // Handle remember-me token
    let rememberToken = null;
    if (rememberMe) {
      rememberToken = generateRememberToken();
      const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 days
      
      await query(
        'UPDATE users SET remember_token = $1, remember_token_expires = $2 WHERE id = $3',
        [rememberToken, expiresAt, user.id]
      );

      // Set HTTP-only cookie (can't be accessed by JavaScript)
      res.setHeader('Set-Cookie', `rememberMe=${rememberToken}; Path=/; Max-Age=${30 * 24 * 60 * 60}; HttpOnly; Secure; SameSite=Strict`);
    }

    return res.status(200).json({
      success: true,
      message: 'Login successful',
      token,
      rememberMe: !!rememberToken,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.first_name,
        lastName: user.last_name,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ error: 'Failed to login' });
  }
}
