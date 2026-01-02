// Middleware to protect admin-only endpoints

/**
 * Admin authentication middleware
 * Checks for valid admin token in Authorization header
 * Format: Bearer <admin_token>
 */
async function withAdminAuth(handler) {
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
 * Uses environment variable for MVP (simple and fast)
 */
async function validateAdminToken(token) {
  // Check against environment variable
  const adminToken = process.env.ADMIN_API_TOKEN;
  
  if (!adminToken) {
    console.warn('ADMIN_API_TOKEN not configured in environment');
    return false;
  }
  
  return token === adminToken;
}

/**
 * Quick helper to check if request is from admin
 * Can be used in non-Next.js contexts
 */
async function isAdminRequest(authHeader) {
  if (!authHeader) return false;
  const token = authHeader.replace('Bearer ', '');
  return validateAdminToken(token);
}

module.exports = { withAdminAuth, isAdminRequest };
module.exports.default = withAdminAuth;
