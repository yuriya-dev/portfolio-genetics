import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import DashboardLayout from './layouts/DashboardLayout';
import OptimizationPage from './pages/OptimizationPage';
import StockListPage from './pages/StockListPage';
import ChatPage from './pages/ChatPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
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
  );
}

export default App;