// Database migration script for Railway deployment
const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');

async function runMigrations() {
  // Use Railway's injected DATABASE_URL or fallback
  const connectionString = process.env.DATABASE_URL || 
                          process.env.POSTGRES_URL || 
                          process.env.DATABASE_PRIVATE_URL ||
                          process.env.DATABASE_PUBLIC_URL;
  
  console.log('🔍 Available environment variables:');
  console.log('DATABASE_URL:', process.env.DATABASE_URL ? 'SET' : 'NOT SET');
  console.log('POSTGRES_URL:', process.env.POSTGRES_URL ? 'SET' : 'NOT SET');
  console.log('DATABASE_PRIVATE_URL:', process.env.DATABASE_PRIVATE_URL ? 'SET' : 'NOT SET');
  console.log('DATABASE_PUBLIC_URL:', process.env.DATABASE_PUBLIC_URL ? 'SET' : 'NOT SET');
  
  if (!connectionString) {
    console.error('❌ No database connection string found');
    console.error('Available environment variables:', Object.keys(process.env).filter(key => key.includes('DATABASE') || key.includes('POSTGRES')));
    process.exit(1);
  }

  const pool = new Pool({
    connectionString,
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
  });

  try {
    console.log('🔄 Connecting to database...');
    await pool.query('SELECT NOW()');
    console.log('✅ Database connected successfully');

    // Read and execute the init.sql file
    const sqlPath = path.join(__dirname, '../../database/init.sql');
    
    if (fs.existsSync(sqlPath)) {
      console.log('🔄 Running database migrations...');
      const sqlContent = fs.readFileSync(sqlPath, 'utf8');
      
      // Split by semicolon and execute each statement
      const statements = sqlContent
        .split(';')
        .map(stmt => stmt.trim())
        .filter(stmt => stmt.length > 0);

      for (const statement of statements) {
        try {
          await pool.query(statement);
        } catch (error) {
          // Ignore "already exists" errors
          if (!error.message.includes('already exists')) {
            console.warn('⚠️ Migration warning:', error.message);
          }
        }
      }
      
      console.log('✅ Database migrations completed successfully');
    } else {
      console.log('⚠️ No migration file found at', sqlPath);
    }

  } catch (error) {
    console.error('❌ Migration failed:', error.message);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

// Run migrations if this script is called directly
if (require.main === module) {
  runMigrations();
}

module.exports = { runMigrations };