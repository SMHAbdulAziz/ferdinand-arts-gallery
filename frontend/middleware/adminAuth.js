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

    // Verify token
    try {
      const isValid = await validateAdminToken(token);

      if (!isValid) {
        return res.status(403).json({ error: 'Invalid admin token' });
      }

      // Token is valid, proceed with handler
      return handler(req, res);
    } catch (error) {
      console.error('Auth error:', error.message);
      return res.status(500).json({ error: 'Authentication failed' });
    }
  };
}

/**
 * Validate admin token
 */
async function validateAdminToken(token) {
  const adminToken = process.env.ADMIN_API_TOKEN;
  
  // If no admin token configured, log warning but allow for development
  if (!adminToken) {
    console.warn('⚠️  ADMIN_API_TOKEN not configured - configure it in Railway dashboard');
    // In development, allow requests to proceed for testing
    if (process.env.NODE_ENV !== 'production') {
      return true;
    }
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
