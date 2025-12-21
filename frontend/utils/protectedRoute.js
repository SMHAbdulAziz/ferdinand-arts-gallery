import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../context/AuthContext';

/**
 * HOC to protect routes - redirects to login if user is not authenticated
 * Usage: export default withProtectedRoute(YourComponent)
 */
export function withProtectedRoute(Component) {
  return function ProtectedRoute(props) {
    const router = useRouter();
    const { isAuthenticated, loading } = useAuth();

    useEffect(() => {
      if (!loading && !isAuthenticated) {
        router.push('/login');
      }
    }, [isAuthenticated, loading, router]);

    if (loading) {
      return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
    }

    if (!isAuthenticated) {
      return null;
    }

    return <Component {...props} />;
  };
}

/**
 * Hook to check authentication status in components
 * Usage: const { isAuthenticated, token } = useProtected();
 */
export function useProtected() {
  const router = useRouter();
  const { isAuthenticated, token, loading } = useAuth();

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, loading, router]);

  return { isAuthenticated, token, loading };
}

/**
 * Middleware to validate JWT tokens on API routes
 * Usage: 
 * export default async function handler(req, res) {
 *   const user = await validateAuthMiddleware(req, res);
 *   if (!user) return;
 *   // ... rest of handler
 * }
 */
export async function validateAuthMiddleware(req, res) {
  const { verifyToken, extractToken } = require('./auth');

  const token = extractToken(req.headers.authorization);
  if (!token) {
    res.status(401).json({ error: 'Missing authentication token' });
    return null;
  }

  const payload = verifyToken(token);
  if (!payload) {
    res.status(401).json({ error: 'Invalid or expired token' });
    return null;
  }

  return payload;
}
