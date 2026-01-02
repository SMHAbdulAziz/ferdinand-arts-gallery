// Admin user management endpoints
const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

async function handler(req, res) {
  if (req.method === 'GET') {
    return handleGetUsers(req, res);
  } else {
    return res.status(405).json({ error: 'Method not allowed' });
  }
}

async function handleGetUsers(req, res) {
  try {
    const result = await pool.query(
      `SELECT 
        id, 
        email, 
        first_name, 
        last_name, 
        role, 
        email_verified, 
        created_at
      FROM users
      ORDER BY created_at DESC`
    );

    res.status(200).json({
      success: true,
      users: result.rows
    });
  } catch (error) {
    console.error('Database error:', error);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
}

export default handler;
