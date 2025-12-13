import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext'; // Import Provider
import DashboardLayout from './layouts/DashboardLayout';
import OptimizationPage from './pages/OptimizationPage';
import StockListPage from './pages/StockListPage';
import ChatPage from './pages/ChatPage';
import LoginPage from './pages/LoginPage'; // Import Halaman Login

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          
          {/* Wrap semua halaman dengan DashboardLayout */}
          <Route path="/" element={<DashboardLayout />}>
            <Route index element={<OptimizationPage />} />
            <Route path="stocks" element={<StockListPage />} />
            <Route path="chat" element={<ChatPage />} />
            
            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;