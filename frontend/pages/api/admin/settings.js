// Manage application settings (fund goals, site config, etc.)
const { Pool } = require('pg');

export default async function handler(req, res) {
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
  });

  try {
    if (req.method === 'GET') {
      return handleGetSettings(req, res, pool);
    } else if (req.method === 'POST') {
      return handleUpdateSettings(req, res, pool);
    } else {
      return res.status(405).json({ error: 'Method not allowed' });
    }
  } catch (error) {
    console.error('Settings error:', error);
    res.status(500).json({ error: 'Failed to manage settings', details: error.message });
  } finally {
    await pool.end();
  }
}

async function handleGetSettings(req, res, pool) {
  const { key } = req.query;

  try {
    if (key) {
      // Get specific setting
      const result = await pool.query(
        'SELECT key, value, description FROM settings WHERE key = $1',
        [key]
      );
      
      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'Setting not found' });
      }
      
      return res.status(200).json({
        success: true,
        setting: result.rows[0]
      });
    } else {
      // Get all settings
      const result = await pool.query(
        'SELECT key, value, description FROM settings ORDER BY key'
      );
      
      return res.status(200).json({
        success: true,
        settings: result.rows
      });
    }
  } catch (error) {
    console.error('Get settings error:', error);
    return res.status(500).json({ error: 'Failed to fetch settings', details: error.message });
  }
}

async function handleUpdateSettings(req, res, pool) {
  const { key, value, description } = req.body;

  // Validate input
  if (!key || value === undefined) {
    return res.status(400).json({ error: 'Missing required fields: key, value' });
  }

  try {
    // Update or insert setting
    const result = await pool.query(`
      INSERT INTO settings (key, value, description, updated_at)
      VALUES ($1, $2, $3, CURRENT_TIMESTAMP)
      ON CONFLICT (key) DO UPDATE SET
        value = $2,
        description = COALESCE($3, settings.description),
        updated_at = CURRENT_TIMESTAMP
      RETURNING key, value, description, updated_at
    `, [key, JSON.stringify(value), description]);

    if (result.rows.length === 0) {
      return res.status(500).json({ error: 'Failed to update setting' });
    }

    // If updating fund goals, also update the artists table
    if (key === 'fund_goals' && value.ferdinand_fund_target !== undefined) {
      await pool.query(`
        UPDATE artists 
        SET education_fund_target = $1, updated_at = CURRENT_TIMESTAMP
        WHERE name = 'Ferdinand Ssekyanja'
      `, [value.ferdinand_fund_target]);
    }

    return res.status(200).json({
      success: true,
      message: 'Setting updated successfully',
      setting: result.rows[0]
    });

  } catch (error) {
    console.error('Update settings error:', error);
    return res.status(500).json({ error: 'Failed to update setting', details: error.message });
  }
}
