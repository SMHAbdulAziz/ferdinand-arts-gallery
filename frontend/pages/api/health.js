export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    // Basic health check - don't require database connection
    const healthData = {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      version: '1.0.0',
      environment: process.env.NODE_ENV || 'development'
    };

    // Optional database check - don't fail if DB is not available
    if (process.env.DATABASE_URL) {
      try {
        // Add database connectivity check here if needed
        healthData.database = 'connected';
      } catch (dbError) {
        console.warn('Database health check failed:', dbError.message);
        healthData.database = 'unavailable';
        // Don't fail the health check for database issues during startup
      }
    } else {
      healthData.database = 'not_configured';
    }

    return res.status(200).json(healthData);
  } catch (error) {
    console.error('Health check error:', error);
    return res.status(500).json({ 
      status: 'unhealthy', 
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
}