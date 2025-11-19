const express = require('express');
const router = express.Router();
const { runOptimization } = require('../controllers/optimizationController');

// POST http://localhost:5000/api/optimize
router.post('/optimize', runOptimization);

// Test endpoint untuk cek server nyala/tidak
router.get('/status', (req, res) => {
    res.json({ status: "Server is running", timestamp: new Date() });
});

module.exports = router;