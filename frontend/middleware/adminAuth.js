// Middleware to protect admin-only endpoints
const { Pool } = require('pg');

/**
 * Admin authentication middleware
 * Checks for valid admin token in Authorization header
 * Format: Bearer <admin_token>
 */
export async function withAdminAuth(handler) {
  return async (req, res) => {
    const token = req.headers.authorization?.replace('Bearer ', '');

    if (!token) {
      return res.status(401).json({ error: 'Missing authorization token' });
    }

    // Verify token against database or environment variable
    try {
      const isValid = await validateAdminToken(token);

      if (!isValid) {
        return res.status(403).json({ error: 'Invalid or expired admin token' });
      }

      // Token is valid, proceed with handler
      return handler(req, res);
    } catch (error) {
      console.error('Auth error:', error);
      return res.status(500).json({ error: 'Authentication failed' });
    }
  };
}

/**
 * Validate admin token
 * Can be either:
 * 1. Hardcoded admin token from environment
 * 2. JWT token validation
 * 3. Database session lookup
 */
async function validateAdminToken(token) {
  // Method 1: Simple environment variable check (quickest for MVP)
  const adminToken = process.env.ADMIN_API_TOKEN;
  if (adminToken && token === adminToken) {
    return true;
  }

  // Method 2: Database session validation (optional)
  try {
    const pool = new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
    });

    const query = await pool.query(
      `SELECT id FROM admin_sessions 
       WHERE token = $1 AND expires_at > NOW()`,
      [token]
    );

    await pool.end();

    return query.rows.length > 0;
  } catch (error) {
    console.error('Database auth check failed:', error);
    return false;
  }
}

/**
 * Quick helper to check if request is from admin
 * Can be used in non-Next.js contexts
 */
export async function isAdminRequest(authHeader) {
  if (!authHeader) return false;
  const token = authHeader.replace('Bearer ', '');
  return validateAdminToken(token);
}

export default withAdminAuth;
