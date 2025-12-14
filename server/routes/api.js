const express = require('express');
const router = express.Router();
const { runOptimization } = require('../controllers/optimizationController');
const { 
    getUserWatchlist, 
    syncWatchlist, 
    getUserHistory,
    deleteUserHistory,
    clearAllUserHistory
} = require('../controllers/userController');

// --- OPTIMIZATION ROUTES ---
router.post('/optimize', runOptimization);

// --- HISTORY ROUTES ---
router.get('/history', getUserHistory);
router.delete('/history/clear-all', clearAllUserHistory);
router.delete('/history/:id', deleteUserHistory);

// --- WATCHLIST ROUTES ---
router.get('/watchlist', getUserWatchlist);
router.post('/watchlist/sync', syncWatchlist);

// Test endpoint
router.get('/status', (req, res) => {
    res.json({ status: "Server is running", timestamp: new Date() });
});

module.exports = router;