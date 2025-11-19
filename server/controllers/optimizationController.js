const { spawn } = require('child_process');
const path = require('path');
const pool = require('../config/db'); // <--- Import DB

// 1. FUNGSI RUN OPTIMIZATION (POST)
const runOptimization = (req, res) => {
    const { tickers, riskAversion } = req.body;
    
    // ... (Validasi input tetap sama) ...
    if (!tickers || !Array.isArray(tickers) || tickers.length === 0) {
        return res.status(400).json({ error: "Ticker saham wajib diisi." });
    }
    const riskParam = riskAversion || 0.5;
    const tickerString = tickers.join(',');
    const scriptPath = path.join(__dirname, '../../engine/optimizer.py');

    console.log(`⚙️ Processing: ${tickerString} (Risk: ${riskParam})`);

    const pythonProcess = spawn('python', [scriptPath, tickerString, riskParam]);

    let dataString = '';
    let errorString = '';

    pythonProcess.stdout.on('data', (data) => { dataString += data.toString(); });
    pythonProcess.stderr.on('data', (data) => { errorString += data.toString(); });

    pythonProcess.on('close', async (code) => { // <--- Tambahkan async
        if (code !== 0) {
            return res.status(500).json({ error: "Engine Error", details: errorString });
        }

        try {
            const jsonResult = JSON.parse(dataString);

            // === BAGIAN BARU: SIMPAN KE DB ===
            if (jsonResult.status === 'success') {
                try {
                    const insertQuery = `
                        INSERT INTO optimization_history (tickers, risk_aversion, result_data)
                        VALUES ($1, $2, $3)
                        RETURNING id, created_at
                    `;
                    
                    // Kita simpan jsonResult utuh ke kolom result_data
                    const savedRecord = await pool.query(insertQuery, [
                        tickers, 
                        riskParam, 
                        jsonResult
                    ]);
                    
                    console.log(`💾 History saved with ID: ${savedRecord.rows[0].id}`);
                    
                    // Sertakan ID history di response agar frontend tahu
                    jsonResult.history_id = savedRecord.rows[0].id;
                } catch (dbErr) {
                    console.error("⚠️ Gagal menyimpan ke DB:", dbErr.message);
                    // Jangan gagalkan response ke user cuma karena gagal simpan history
                }
            }
            // =================================

            res.json(jsonResult);
            
        } catch (e) {
            console.error("JSON Parse Error:", e);
            res.status(500).json({ error: "Invalid Output", raw: dataString });
        }
    });
};

// 2. FUNGSI GET HISTORY (GET) - UNTUK MENAMPILKAN LIST
const getHistory = async (req, res) => {
    try {
        // Ambil 10 history terakhir
        const result = await pool.query(`
            SELECT id, created_at, tickers, risk_aversion, result_data
            FROM optimization_history 
            ORDER BY created_at DESC 
            LIMIT 10
        `);
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Gagal mengambil history" });
    }
};

module.exports = { runOptimization, getHistory };