import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// --- FUNGSI UTILITY SESSION ---
const getGuestId = () => {
  let id = localStorage.getItem('guest_session_id');
  if (!id) {
    id = 'guest_' + Math.random().toString(36).substr(2, 9) + Date.now().toString(36);
    localStorage.setItem('guest_session_id', id);
  }
  return id;
};

// --- API CALLS ---

export const searchStocks = async (query) => {
  try {
    const response = await axios.get(`${API_URL}/proxy-search`, { params: { q: query } });
    return response.data;
  } catch (error) {
    console.error("Error searching stocks:", error);
    throw error;
  }
};

// Ambil Detail Saham (Bisa banyak sekaligus)
export const getStockQuotes = async (symbols) => {
  try {
    const response = await axios.get(`${API_URL}/proxy-quote`, { 
        params: { symbols: Array.isArray(symbols) ? symbols.join(',') : symbols } 
    });
    return response.data.quoteResponse?.result || [];
  } catch (error) {
    console.error("Error fetching quotes:", error);
    return [];
  }
};

// Fungsi Ambil Data Chart
export const getStockChart = async (symbol, range = '1mo', interval = '1d') => {
  try {
    const response = await axios.get(`${API_URL}/proxy-chart`, { 
        params: { symbol, range, interval } 
    });
    
    console.log('📊 Chart API Response:', response.data);
    
    const chartResult = response.data?.chart?.result?.[0];
    
    if (!chartResult) {
      console.warn('⚠️ No chart result found');
      return null;
    }
    
    // console.log('✅ Chart Data Parsed:', {
    //   hasTimestamp: !!chartResult.timestamp,
    //   timestampLength: chartResult.timestamp?.length || 0,
    //   hasIndicators: !!chartResult.indicators,
    //   hasPrices: !!chartResult.indicators?.quote?.[0]?.close
    // });
    
    return chartResult;
    
  } catch (error) {
    console.error("Error fetching chart:", error);
    return null;
  }
};

// --- OPTIMIZE DENGAN USER ID ---
export const optimizePortfolio = async (tickers, riskAversion, userId = null) => {
  try {
    const guestId = getGuestId();
    const payload = {
      tickers,
      riskAversion,
      sessionId: guestId,
    };
    
    if (userId) {
        payload.userId = userId;
    }

    const response = await axios.post(`${API_URL}/optimize`, payload);
    return response.data;
  } catch (error) {
    console.error("Error fetching optimization data:", error);
    throw error;
  }
};

// --- HISTORY DENGAN USER ID ---
export const getHistoryList = async (userId = null) => {
  try {
    const params = {};
    if (userId) {
        params.userId = userId;
    } else {
        params.sessionId = getGuestId();
    }

    const response = await axios.get(`${API_URL}/history`, { params });
    return response.data;
  } catch (error) {
    console.error("Error fetching history:", error);
    throw error;
  }
};

// --- DELETE SINGLE HISTORY ---
export const deleteHistory = async (historyId, userId = null) => {
  try {
    const params = {};
    if (userId) {
      params.userId = userId;
    } else {
      params.sessionId = getGuestId();
    }

    const response = await axios.delete(`${API_URL}/history/${historyId}`, { params });
    return response.data;
  } catch (error) {
    console.error("Error deleting history:", error);
    throw error;
  }
};

// --- CLEAR ALL HISTORY ---
export const clearAllHistory = async (userId = null) => {
  try {
    const params = {};
    if (userId) {
      params.userId = userId;
    } else {
      params.sessionId = getGuestId();
    }

    const response = await axios.delete(`${API_URL}/history/clear-all`, { params });
    return response.data;
  } catch (error) {
    console.error("Error clearing all history:", error);
    throw error;
  }
};

// --- WATCHLIST SYNC ---
export const fetchUserWatchlist = async (userId) => {
    try {
        const response = await axios.get(`${API_URL}/watchlist`, { params: { userId } });
        return response.data;
    } catch (error) {
        console.error("Error fetching watchlist:", error);
        return [];
    }
};

export const syncUserWatchlist = async (userId, symbols) => {
    try {
        await axios.post(`${API_URL}/watchlist/sync`, { userId, symbols });
    } catch (error) {
        console.error("Error syncing watchlist:", error);
    }
};