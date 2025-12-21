const { Pool } = require('pg');

// Create a connection pool for database operations
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
  // Connection pool settings
  max: 20, // Maximum number of clients in pool
  idleTimeoutMillis: 30000, // Close idle clients after 30 seconds
  connectionTimeoutMillis: 2000, // Timeout for acquiring a connection
});

/**
 * Execute a database query
 * @param {string} sql - SQL query string
 * @param {Array} values - Query parameters for prepared statements
 * @returns {Promise} Query result object
 */
async function query(sql, values) {
  try {
    const result = await pool.query(sql, values);
    return result;
  } catch (error) {
    console.error('Database query error:', error);
    throw error;
  }
}

/**
 * Get a client from the pool for transactions
 * @returns {Promise} PostgreSQL client
 */
async function getClient() {
  return pool.connect();
}

/**
 * Close the connection pool
 */
async function closePool() {
  await pool.end();
}

module.exports = {
  query,
  getClient,
  closePool,
  pool, // Export pool for advanced usage
};
