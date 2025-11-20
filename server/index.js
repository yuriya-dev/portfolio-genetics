const express = require('express');
const cors = require('cors');
const apiRoutes = require('./routes/api');

const app = express();
const PORT = process.env.PORT || 5000;

// --- 1. KONFIGURASI CORS (PENTING!) ---
app.use(cors({
    origin: '*', 
    methods: ['GET', 'POST', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

// --- 2. LOGGING REQUEST (Untuk Debugging di Render) ---
app.use((req, res, next) => {
    console.log(`👉 [REQUEST] ${req.method} ${req.url}`);
    next();
});

// --- 3. ROUTES ---
app.use('/api', apiRoutes);

// --- 4. HEALTH CHECK (Wajib untuk Render) ---
app.get('/', (req, res) => {
    res.status(200).send('GeneticPortfolio Backend is Running! 🧬');
});

// --- 5. JALANKAN SERVER ---
app.listen(PORT, '0.0.0.0', () => {
    console.log(`=========================================`);
    console.log(`🚀 Server berjalan di port ${PORT}`);
    console.log(`📡 Siap menerima request`);
    console.log(`=========================================`);
});