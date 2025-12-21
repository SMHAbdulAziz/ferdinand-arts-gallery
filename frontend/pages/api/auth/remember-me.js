// Verify remember-me token and auto-login
import { generateToken } from '../../../utils/auth';
import { query } from '../../../utils/db';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Get remember-me token from cookies
    const cookies = req.headers.cookie || '';
    const rememberToken = cookies
      .split(';')
      .find(c => c.trim().startsWith('rememberMe='))
      ?.split('=')[1];

    if (!rememberToken) {
      return res.status(401).json({ error: 'No remember-me token found' });
    }

    // Find user with valid remember token
    const result = await query(
      `SELECT id, email, first_name, last_name, role 
       FROM users 
       WHERE remember_token = $1 
       AND remember_token_expires > NOW()`,
      [rememberToken]
    );

    if (result.rows.length === 0) {
      // Token is invalid or expired, clear the cookie
      res.setHeader('Set-Cookie', 'rememberMe=; Path=/; Max-Age=0; HttpOnly; Secure; SameSite=Strict');
      return res.status(401).json({ error: 'Remember-me token invalid or expired' });
    }

    const user = result.rows[0];

    // Generate new JWT token
    const token = generateToken(user.id, user.email);

    return res.status(200).json({
      success: true,
      token,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.first_name,
        lastName: user.last_name,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Remember-me verification error:', error);
    return res.status(500).json({ error: 'Failed to verify remember-me token' });
  }
}
