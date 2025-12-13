require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY; // Gunakan Service Role (Admin)

if (!supabaseUrl || !supabaseKey) {
    console.error("❌ Error: Pastikan SUPABASE_URL dan SUPABASE_SERVICE_ROLE_KEY ada di .env");
}

// Inisialisasi Supabase Client dengan hak akses Admin
const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

// Cek koneksi sederhana (opsional)
// Kita tidak melakukan 'connect' seperti pg, tapi client siap digunakan.
console.log(`✅ Supabase Admin Client Initialized`);

module.exports = supabase;