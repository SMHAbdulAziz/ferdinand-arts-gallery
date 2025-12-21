// Clear remember-me token on logout
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

    if (rememberToken) {
      // Clear the token from database
      await query(
        'UPDATE users SET remember_token = NULL, remember_token_expires = NULL WHERE remember_token = $1',
        [rememberToken]
      );
    }

    // Clear the cookie
    res.setHeader('Set-Cookie', 'rememberMe=; Path=/; Max-Age=0; HttpOnly; Secure; SameSite=Strict');

    return res.status(200).json({ success: true, message: 'Logged out successfully' });
  } catch (error) {
    console.error('Logout error:', error);
    return res.status(500).json({ error: 'Failed to logout' });
  }
}
