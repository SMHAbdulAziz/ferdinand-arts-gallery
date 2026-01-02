// Database health check endpoint
const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

export default async function handler(req, res) {
  try {
    console.log('Testing database connection...');
    const result = await pool.query('SELECT NOW() as current_time');
    
    res.status(200).json({
      success: true,
      message: 'Database connection OK',
      timestamp: result.rows[0].current_time,
      environment: {
        NODE_ENV: process.env.NODE_ENV,
        DATABASE_URL: process.env.DATABASE_URL ? '***configured***' : 'NOT SET'
      }
    });
  } catch (error) {
    console.error('Database connection error:', error.message);
    res.status(500).json({
      success: false,
      error: 'Database connection failed',
      details: error.message
    });
  }
}
