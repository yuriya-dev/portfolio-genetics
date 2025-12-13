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

// Fungsi Baru: Ambil Detail Saham (Bisa banyak sekaligus)
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

// Fungsi Baru: Ambil Data Chart
export const getStockChart = async (symbol, range = '1mo', interval = '1d') => {
  try {
    const response = await axios.get(`${API_URL}/proxy-chart`, { 
        params: { symbol, range, interval } 
    });
    return response.data.chart?.result?.[0] || null;
  } catch (error) {
    console.error("Error fetching chart:", error);
    return null;
  }
};

export const optimizePortfolio = async (tickers, riskAversion) => {
  try {
    const guestId = getGuestId();
    const response = await axios.post(`${API_URL}/optimize`, {
      tickers,
      riskAversion,
      sessionId: guestId,
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching optimization data:", error);
    throw error;
  }
};

export const getHistoryList = async () => {
  try {
    const guestId = getGuestId();
    const response = await axios.get(`${API_URL}/history`, {
      params: { sessionId: guestId }
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching history:", error);
    throw error;
  }
};