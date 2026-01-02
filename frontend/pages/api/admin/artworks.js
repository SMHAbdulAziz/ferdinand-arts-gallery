// Admin artwork management endpoints
const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

async function handler(req, res) {
  if (req.method === 'GET') {
    return handleGetArtworks(req, res);
  } else if (req.method === 'POST') {
    return handleCreateArtwork(req, res);
  } else {
    return res.status(405).json({ error: 'Method not allowed' });
  }
}

async function handleGetArtworks(req, res) {
  try {
    const result = await pool.query(
      `SELECT id, title, artist_id, status, estimated_value, created_at
       FROM artworks
       ORDER BY created_at DESC`
    );

    res.status(200).json({
      success: true,
      artworks: result.rows
    });
  } catch (error) {
    console.error('Database error:', error);
    res.status(500).json({ error: 'Failed to fetch artworks' });
  }
}

async function handleCreateArtwork(req, res) {
  const {
    title,
    description,
    artist,
    medium,
    dimensions,
    creation_date,
    estimated_value,
    series_info,
    limited_edition_info
  } = req.body;

  // Validate required fields
  if (!title) {
    return res.status(400).json({ error: 'Title is required' });
  }

  try {
    const result = await pool.query(
      `INSERT INTO artworks (
        title, description, medium, dimensions, 
        creation_date, estimated_value, series_info, 
        limited_edition_info, status, created_at
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, NOW())
      RETURNING id, title, status`,
      [
        title, description, medium, dimensions,
        creation_date || null, parseFloat(estimated_value) || 0, series_info,
        limited_edition_info, 'available'
      ]
    );

    res.status(201).json({
      success: true,
      message: 'Artwork created successfully',
      artwork: result.rows[0]
    });
  } catch (error) {
    console.error('Database error:', error);
    res.status(500).json({ error: 'Failed to create artwork' });
  }
}

export default handler;
