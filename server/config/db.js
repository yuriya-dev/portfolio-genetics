require('dotenv').config();
const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// Cek koneksi saat start
pool.connect((err) => {
  if (err) console.error('❌ Gagal koneksi ke Database:', err.message);
  else console.log('✅ Terkoneksi ke PostgreSQL');
});

module.exports = pool;