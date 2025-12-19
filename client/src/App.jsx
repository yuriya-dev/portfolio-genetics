import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext'; // Pastikan import useAuth
import DashboardLayout from './layouts/DashboardLayout';
import OptimizationPage from './pages/OptimizationPage';
import StockListPage from './pages/StockListPage';
import ChatPage from './pages/ChatPage';
import LoginPage from './pages/LoginPage';
import SettingsPage from './pages/SettingsPage';

// --- KOMPONEN PELINDUNG RUTE ---
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth(); // Pastikan AuthContext Anda mengekspos state 'loading'

  // 1. Tunggu sampai pengecekan auth selesai (opsional tapi disarankan agar tidak flicker ke login)
  if (loading) {
    return <div className="flex h-screen items-center justify-center bg-[#0f111a] text-white">Loading...</div>; 
  }

  // 2. Jika tidak ada user, tendang ke halaman Login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // 3. Jika user ada, tampilkan halaman yang diminta
  return children;
};

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* --- PUBLIC ROUTES --- */}
          <Route path="/login" element={<LoginPage />} />
          
          {/* --- PRIVATE ROUTES (DILINDUNGI) --- */}
          {/* Kita bungkus DashboardLayout dengan ProtectedRoute */}
          <Route path="/" element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }>
            <Route index element={<OptimizationPage />} />
            <Route path="stocks" element={<StockListPage />} />
            <Route path="chat" element={<ChatPage />} />
            <Route path="settings" element={<SettingsPage />} />
            
            {/* Fallback untuk private route */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;