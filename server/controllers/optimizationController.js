const { spawn } = require('child_process');
const path = require('path');

// Controller untuk menangani request optimasi
const runOptimization = (req, res) => {
    const { tickers, riskAversion } = req.body;

    // 1. Validasi Input Dasar
    if (!tickers || !Array.isArray(tickers) || tickers.length === 0) {
        return res.status(400).json({ error: "Ticker saham wajib diisi dan berupa array." });
    }

    // Default risk aversion jika user tidak mengirim
    const riskParam = riskAversion || 0.5;
    const tickerString = tickers.join(',');

    // 2. Tentukan Path Script Python
    // Kita asumsikan folder 'engine' sejajar dengan folder 'server'
    const scriptPath = path.join(__dirname, '../../engine/optimizer.py');

    console.log(`⚙️ Menjalankan optimasi untuk: ${tickerString} dengan Risk: ${riskParam}`);

    // 3. Spawn Child Process (Panggil Python)
    // NOTE: Jika Anda menggunakan Virtual Environment (venv), ganti 'python' 
    // dengan path absolut ke python di venv, misal: '../engine/venv/bin/python'
    const pythonProcess = spawn('python', [scriptPath, tickerString, riskParam]);

    let dataString = '';
    let errorString = '';

    // 4. Tangkap Output (stdout) dari Python
    pythonProcess.stdout.on('data', (data) => {
        dataString += data.toString();
    });

    // 5. Tangkap Error (stderr) jika ada
    pythonProcess.stderr.on('data', (data) => {
        errorString += data.toString();
        console.error(`Python Error: ${data}`);
    });

    // 6. Ketika Proses Selesai
    pythonProcess.on('close', (code) => {
        if (code !== 0) {
            return res.status(500).json({ 
                error: "Gagal menjalankan algoritma genetika.",
                details: errorString 
            });
        }

        try {
            // Parse string JSON dari Python menjadi Object JavaScript
            const jsonResult = JSON.parse(dataString);
            
            // (Opsional) Di sini nanti kita bisa simpan ke Supabase sebelum return
            
            // Kirim hasil ke Frontend
            res.json(jsonResult);
            
        } catch (e) {
            console.error("Gagal parsing output JSON:", e);
            // Kadang Python print warning yang bukan JSON, ini handle errornya
            res.status(500).json({ 
                error: "Format output dari engine tidak valid.", 
                rawOutput: dataString 
            });
        }
    });
};

module.exports = { runOptimization };