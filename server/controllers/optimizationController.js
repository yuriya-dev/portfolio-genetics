const { spawn } = require('child_process');
const path = require('path');
const supabase = require('../config/db'); // Import Supabase Client

const runOptimization = (req, res) => {
    const { tickers, riskAversion, sessionId, userId } = req.body;
    
    if (!tickers || !Array.isArray(tickers) || tickers.length === 0) {
        return res.status(400).json({ error: "Ticker saham wajib diisi." });
    }
    const riskParam = riskAversion || 0.5;
    const currentSession = sessionId || 'anonymous'; 

    const tickerString = tickers.join(',');
    const pythonCommand = process.platform === 'win32' ? 'python' : 'python3';
    const scriptPath = path.join(__dirname, '../../engine/optimizer.py');

    console.log(`⚙️ Processing: ${tickerString} | User: ${userId || 'Guest'}`);

    const pythonProcess = spawn(pythonCommand, [scriptPath, tickerString, riskParam]);

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
                // --- SIMPAN KE DB MENGGUNAKAN SUPABASE CLIENT ---
                const { data, error } = await supabase
                    .from('optimization_history')
                    .insert([{
                        tickers: tickers,
                        risk_aversion: riskParam,
                        result_data: jsonResult,
                        session_id: currentSession,
                        user_id: userId || null
                    }])
                    .select('id')
                    .single();

                if (error) {
                    console.error("⚠️ Gagal menyimpan ke DB:", error.message);
                } else if (data) {
                    jsonResult.history_id = data.id;
                    console.log(`💾 Saved history ID: ${data.id}`);
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
    // Controller ini sudah digantikan oleh userController.getUserHistory
    // Tapi kita biarkan route ini ada sebagai legacy
    res.status(404).json({error: "Endpoint deprecated. Use /api/history"});
};

module.exports = { runOptimization, getHistory };