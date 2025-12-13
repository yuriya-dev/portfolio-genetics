const express = require('express');
const cors = require('cors');
const apiRoutes = require('./routes/api');

// PERBAIKAN: Import YahooFinance class dan instantiate (v3 style)
const YahooFinance = require('yahoo-finance2').default;

// Buat instance YahooFinance dengan konfigurasi
const yahooFinance = new YahooFinance({
    // Optional: tambahkan konfigurasi jika diperlukan
    // cookieJar: new CookieJar(), // jika butuh custom cookie handling
    suppressNotices: ['yahooSurvey'], // suppress notices
});

console.log('✅ Yahoo Finance v3 instance created successfully');

const app = express();
const PORT = process.env.PORT || 5000;

// --- 1. KONFIGURASI CORS ---
app.use(cors({
    origin: '*', 
    methods: ['GET', 'POST', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

// --- 2. LOGGING REQUEST ---
app.use((req, res, next) => {
    console.log(`👉 [REQUEST] ${req.method} ${req.url}`);
    next();
});

// --- FITUR BARU: PROXY MENGGUNAKAN YAHOO-FINANCE2 (Stabil) ---

// A. Proxy Search
app.get('/api/proxy-search', async (req, res) => {
    const { q } = req.query;
    if (!q) return res.status(400).json({ error: "Query 'q' required" });

    try {
        console.log(`🔎 Searching: ${q}`);
        const results = await yahooFinance.search(q, { 
            quotesCount: 6, 
            newsCount: 0 
        });
        res.json({ quotes: results.quotes || [] });
    } catch (error) {
        console.error("❌ Search Error:", error.message);
        console.error("Error Stack:", error.stack);
        res.status(500).json({ 
            error: "Search failed", 
            details: error.message 
        });
    }
});

// B. Proxy Quote (Detail Harga Real-time)
app.get('/api/proxy-quote', async (req, res) => {
    const { symbols } = req.query;
    if (!symbols) return res.status(400).json({ error: "Query 'symbols' required" });

    try {
        console.log(`📈 Quoting: ${symbols}`);
        const symbolArray = symbols.split(',').map(s => s.trim());
        
        // PERBAIKAN: Panggil quote() tanpa options (v3 style)
        // Biarkan library handle format return secara otomatis
        const results = await yahooFinance.quote(symbolArray);
        
        console.log(`✅ Quote Success: ${results.length} symbols retrieved`);
        
        // Format response sesuai ekspektasi frontend
        const data = Array.isArray(results) ? results : [results];
        res.json({ 
            quoteResponse: { 
                result: data,
                error: null 
            } 
        });
    } catch (error) {
        console.error("❌ Quote Error:", error.message);
        console.error("Error Stack:", error.stack);
        
        // Kirim response yang informatif
        res.status(500).json({ 
            error: "Quote failed",
            details: error.message,
            quoteResponse: {
                result: [],
                error: error.message
            }
        });
    }
});

// C. Proxy Chart (Grafik Historis)
app.get('/api/proxy-chart', async (req, res) => {
    const { symbol, range, interval } = req.query;
    if (!symbol) return res.status(400).json({ error: "Symbol required" });

    try {
        console.log(`📊 Charting: ${symbol} (${range}, ${interval})`);
        
        const queryOptions = { 
            period1: undefined, // Let library handle it
            period2: undefined,
            interval: interval || '1d',
            includePrePost: false,
            events: 'history'
        };

        // Untuk range-based query
        if (range) {
            queryOptions.range = range;
        }

        const result = await yahooFinance.chart(symbol, queryOptions);

        if (!result || !result.quotes || result.quotes.length === 0) {
            console.log(`⚠️ No chart data for ${symbol}`);
            return res.json({ chart: { result: null } });
        }

        // Transformasi ke format yang diharapkan frontend
        const quotes = result.quotes;
        const timestamp = quotes.map(q => Math.floor(new Date(q.date).getTime() / 1000));
        const close = quotes.map(q => q.close);

        const formattedResult = {
            chart: {
                result: [{
                    meta: result.meta || {},
                    timestamp: timestamp,
                    indicators: {
                        quote: [{
                            close: close,
                            open: quotes.map(q => q.open),
                            high: quotes.map(q => q.high),
                            low: quotes.map(q => q.low),
                            volume: quotes.map(q => q.volume)
                        }]
                    }
                }],
                error: null
            }
        };

        console.log(`✅ Chart Success: ${quotes.length} data points`);
        res.json(formattedResult);

    } catch (error) {
        console.error("❌ Chart Error:", error.message);
        console.error("Error Stack:", error.stack);
        res.json({ 
            chart: { 
                result: null,
                error: { description: error.message }
            } 
        });
    }
});

// --- 3. ROUTES ---
app.use('/api', apiRoutes);

// --- 4. HEALTH CHECK ---
app.get('/', (req, res) => {
    res.status(200).send('GeneticPortfolio Backend is Running! 🧬');
});

// --- 5. GLOBAL ERROR HANDLER ---
app.use((err, req, res, next) => {
    console.error('💥 Unhandled Error:', err);
    res.status(500).json({ 
        error: 'Internal Server Error',
        message: err.message 
    });
});

// --- 6. JALANKAN SERVER ---
app.listen(PORT, '0.0.0.0', () => {
    console.log(`=========================================`);
    console.log(`🚀 Server berjalan di port ${PORT}`);
    console.log(`📡 Siap menerima request`);
    console.log(`🔧 Yahoo Finance ready:`, !!yahooFinance);
    console.log(`=========================================`);
});