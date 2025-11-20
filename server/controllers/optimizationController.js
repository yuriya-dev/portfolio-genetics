const { spawn } = require('child_process');
const path = require('path');
const pool = require('../config/db');

const runOptimization = (req, res) => {
    // 1. Tangkap sessionId dari body request
    const { tickers, riskAversion, sessionId } = req.body;
    
    // ... validasi input ...
    if (!tickers || !Array.isArray(tickers) || tickers.length === 0) {
        return res.status(400).json({ error: "Ticker saham wajib diisi." });
    }
    const riskParam = riskAversion || 0.5;
    // Gunakan ID default jika kosong (untuk jaga-jaga)
    const currentSession = sessionId || 'anonymous'; 

    const tickerString = tickers.join(',');
    const scriptPath = path.join(__dirname, '../../engine/optimizer.py');

    console.log(`⚙️ Processing: ${tickerString} for Session: ${currentSession}`);

    const pythonProcess = spawn('python', [scriptPath, tickerString, riskParam]);

    let dataString = '';
    let errorString = '';

    pythonProcess.stdout.on('data', (data) => { dataString += data.toString(); });
    pythonProcess.stderr.on('data', (data) => { errorString += data.toString(); });

    pythonProcess.on('close', async (code) => {
        if (code !== 0) {
            return res.status(500).json({ error: "Engine Error", details: errorString });
        }

        try {
            const jsonResult = JSON.parse(dataString);

            if (jsonResult.status === 'success') {
                try {
                    // QUERY UPDATE: Masukkan session_id
                    const insertQuery = `
                        INSERT INTO optimization_history (tickers, risk_aversion, result_data, session_id)
                        VALUES ($1, $2, $3, $4)
                        RETURNING id, created_at
                    `;
                    
                    const savedRecord = await pool.query(insertQuery, [
                        tickers, 
                        riskParam, 
                        jsonResult,
                        currentSession // <--- Simpan ID session
                    ]);
                    
                    jsonResult.history_id = savedRecord.rows[0].id;
                } catch (dbErr) {
                    console.error("⚠️ Gagal menyimpan ke DB:", dbErr.message);
                }
            }
            res.json(jsonResult);
        } catch (e) {
            console.error("JSON Parse Error:", e);
            res.status(500).json({ error: "Invalid Output", raw: dataString });
        }
    });
};

const getHistory = async (req, res) => {
    try {
        // 2. Tangkap sessionId dari Query Params
        const { sessionId } = req.query;
        const currentSession = sessionId || 'anonymous';

        // QUERY UPDATE: Tambahkan WHERE clause
        const result = await pool.query(`
            SELECT id, created_at, tickers, risk_aversion, result_data 
            FROM optimization_history 
            WHERE session_id = $1 
            ORDER BY created_at DESC 
            LIMIT 10
        `, [currentSession]); // <--- Filter berdasarkan session

        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Gagal mengambil history" });
    }
};

module.exports = { runOptimization, getHistory };