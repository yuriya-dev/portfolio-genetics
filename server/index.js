const express = require('express');
const cors = require('cors');
const apiRoutes = require('./routes/api');

const app = express();
const PORT = process.env.PORT || 5000;

// --- Middleware ---
app.use(cors()); // Mengizinkan Frontend (beda port) mengakses Backend ini
app.use(express.json()); // Supaya bisa baca JSON dari body request

// --- Routes ---
app.use('/api', apiRoutes);

// --- Start Server ---
app.listen(PORT, () => {
    console.log(`=========================================`);
    console.log(`🚀 Server berjalan di http://localhost:${PORT}`);
    console.log(`📡 Siap menerima request dari Frontend`);
    console.log(`=========================================`);
});