import axios from 'axios';

// Ganti URL ini nanti jika sudah deploy (misal: https://my-app.onrender.com/api)
const API_URL = 'http://localhost:5000/api';

// --- FUNGSI UTILITY SESSION ---
const getGuestId = () => {
  let id = localStorage.getItem('guest_session_id');
  if (!id) {
    // Buat ID acak sederhana jika belum ada
    id = 'guest_' + Math.random().toString(36).substr(2, 9) + Date.now().toString(36);
    localStorage.setItem('guest_session_id', id);
  }
  return id;
};

// --- API CALLS ---

export const optimizePortfolio = async (tickers, riskAversion) => {
  try {
    const guestId = getGuestId(); // Ambil ID
    const response = await axios.post(`${API_URL}/optimize`, {
      tickers,
      riskAversion,
      sessionId: guestId, // Kirim ID ke backend
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching optimization data:", error);
    throw error;
  }
};

export const getHistoryList = async () => {
  try {
    const guestId = getGuestId(); // Ambil ID
    // Kirim ID lewat Query Params
    const response = await axios.get(`${API_URL}/history`, {
      params: { sessionId: guestId }
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching history:", error);
    throw error;
  }
};