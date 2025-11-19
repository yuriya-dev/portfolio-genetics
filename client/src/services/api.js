import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

export const optimizePortfolio = async (tickers, riskAversion) => {
  try {
    const response = await axios.post(`${API_URL}/optimize`, {
      tickers,
      riskAversion,
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching optimization data:", error);
    throw error;
  }
};