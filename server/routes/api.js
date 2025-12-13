const express = require('express');
const router = express.Router();
const { runOptimization } = require('../controllers/optimizationController'); // Import runOptimization
const { getUserWatchlist, syncWatchlist, getUserHistory } = require('../controllers/userController'); // Import Controller Baru

// --- OPTIMIZATION ROUTES ---
router.post('/optimize', runOptimization);

// --- HISTORY ROUTES (Updated) ---
// Kita ganti getHistory lama dengan getUserHistory yang lebih pintar
router.get('/history', getUserHistory);

// --- WATCHLIST ROUTES (New) ---
router.get('/watchlist', getUserWatchlist);
router.post('/watchlist/sync', syncWatchlist);

// Test endpoint untuk cek server nyala/tidak
router.get('/status', (req, res) => {
    res.json({ status: "Server is running", timestamp: new Date() });
});

module.exports = router;