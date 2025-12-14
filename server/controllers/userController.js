const supabase = require('../config/db');

// --- WATCHLIST HANDLERS ---

// 1. Ambil Watchlist User
const getUserWatchlist = async (req, res) => {
    const { userId } = req.query;
    
    if (!userId) return res.status(400).json({ error: "User ID required" });

    try {
        const { data, error } = await supabase
            .from('user_watchlists')
            .select('symbol')
            .eq('user_id', userId)
            .order('created_at', { ascending: true });

        if (error) throw error;

        // Transform: [{symbol: 'BBCA'}, ...] -> ['BBCA', ...]
        const symbols = data.map(row => row.symbol);
        res.json(symbols);
    } catch (err) {
        console.error("Supabase Error (Get Watchlist):", err.message);
        res.status(500).json({ error: "Failed to fetch watchlist" });
    }
};

// 2. Sinkronisasi Watchlist (Delete + Insert)
const syncWatchlist = async (req, res) => {
    const { userId, symbols } = req.body;

    if (!userId || !Array.isArray(symbols)) {
        return res.status(400).json({ error: "Invalid data" });
    }

    try {
        // 1. Hapus watchlist lama
        const { error: deleteError } = await supabase
            .from('user_watchlists')
            .delete()
            .eq('user_id', userId);
        
        if (deleteError) throw deleteError;

        // 2. Insert baru (jika ada)
        if (symbols.length > 0) {
            const records = symbols.map(sym => ({
                user_id: userId,
                symbol: sym
            }));

            const { error: insertError } = await supabase
                .from('user_watchlists')
                .insert(records);
            
            if (insertError) throw insertError;
        }

        res.json({ success: true, count: symbols.length });
    } catch (err) {
        console.error("Supabase Sync Error:", err.message);
        res.status(500).json({ error: "Failed to sync watchlist" });
    }
};

// --- HISTORY HANDLERS ---

// 3. Get History List
const getUserHistory = async (req, res) => {
    const { userId, sessionId } = req.query;

    try {
        let query = supabase
            .from('optimization_history')
            .select('id, created_at, tickers, risk_aversion, result_data')
            .order('created_at', { ascending: false })
            .limit(20);

        if (userId) {
            query = query.eq('user_id', userId);
        } else if (sessionId) {
            query = query.eq('session_id', sessionId).is('user_id', null);
        } else {
            return res.json([]);
        }

        const { data, error } = await query;

        if (error) throw error;
        res.json(data);
    } catch (err) {
        console.error("Supabase Error (History):", err.message);
        res.status(500).json({ error: "Gagal mengambil history" });
    }
};

// 4. Delete Single History
const deleteUserHistory = async (req, res) => {
    const { id } = req.params;
    const { userId, sessionId } = req.query;

    try {
        let query = supabase
            .from('optimization_history')
            .delete()
            .eq('id', id);

        // Validasi kepemilikan
        if (userId) {
            query = query.eq('user_id', userId);
        } else if (sessionId) {
            query = query.eq('session_id', sessionId).is('user_id', null);
        } else {
            return res.status(400).json({ error: "User ID or Session ID required" });
        }

        const { error } = await query;

        if (error) throw error;

        res.json({ success: true, message: "History deleted successfully" });
    } catch (err) {
        console.error("Supabase Error (Delete History):", err.message);
        res.status(500).json({ error: "Failed to delete history" });
    }
};

// 5. Clear All History
const clearAllUserHistory = async (req, res) => {
    const { userId, sessionId } = req.query;

    try {
        let query = supabase
            .from('optimization_history')
            .delete();

        // Hapus semua milik user atau session
        if (userId) {
            query = query.eq('user_id', userId);
        } else if (sessionId) {
            query = query.eq('session_id', sessionId).is('user_id', null);
        } else {
            return res.status(400).json({ error: "User ID or Session ID required" });
        }

        // Tambahkan filter untuk menghapus semua (neq untuk bypass RLS jika ada)
        query = query.neq('id', 0); // Trick untuk select all records

        const { error, count } = await query;

        if (error) throw error;

        res.json({ 
            success: true, 
            message: "All history cleared successfully",
            deletedCount: count 
        });
    } catch (err) {
        console.error("Supabase Error (Clear All History):", err.message);
        res.status(500).json({ error: "Failed to clear all history" });
    }
};

module.exports = { 
    getUserWatchlist, 
    syncWatchlist, 
    getUserHistory,
    deleteUserHistory,
    clearAllUserHistory
};