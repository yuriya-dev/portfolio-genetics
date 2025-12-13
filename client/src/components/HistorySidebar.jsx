import React, { useEffect, useState } from 'react';
import { getHistoryList } from '../services/api';
import { useAuth } from '../context/AuthContext'; // 1. Import Auth
import { X, Clock, ChevronRight, RefreshCw } from 'lucide-react';

const HistorySidebar = ({ isOpen, onClose, onLoadHistory }) => {
  const { user } = useAuth(); // 2. Ambil User
  const [historyList, setHistoryList] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fungsi ambil data dari Backend
  const fetchHistory = async () => {
    setLoading(true);
    try {
      // 3. Kirim user?.id. Jika null, API otomatis pakai mode Tamu (SessionID)
      const data = await getHistoryList(user?.id);
      setHistoryList(data);
    } catch (err) {
      console.error("Gagal ambil history:", err);
    } finally {
      setLoading(false);
    }
  };

  // Ambil data setiap kali sidebar dibuka ATAU user berubah (Login/Logout)
  useEffect(() => {
    if (isOpen) {
      fetchHistory();
    }
  }, [isOpen, user]); // Tambahkan user ke dependency agar refresh saat login/logout

  return (
    <div className={`fixed inset-y-0 right-0 w-80 bg-[#1a1d2e] shadow-2xl border-l border-slate-700 transform transition-transform duration-300 z-[60] ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
      
      {/* Header */}
      <div className="p-4 border-b border-slate-700 flex justify-between items-center bg-[#13151f]">
        <div className="flex flex-col">
          <h2 className="font-bold text-white flex items-center gap-2">
            <Clock size={20} className="text-emerald-500"/> Riwayat
          </h2>
          <span className="text-[10px] text-slate-500 ml-7">
            {user ? 'Simpanan Akun' : 'Sesi Tamu'}
          </span>
        </div>
        <div className="flex gap-2">
          <button onClick={fetchHistory} className="p-1 hover:bg-slate-700 rounded text-slate-400 transition-colors" title="Refresh">
            <RefreshCw size={18} />
          </button>
          <button onClick={onClose} className="p-1 hover:bg-slate-700 rounded text-slate-400 transition-colors" title="Close">
            <X size={20} />
          </button>
        </div>
      </div>

      {/* List Content */}
      <div className="overflow-y-auto h-[calc(100vh-64px)] p-4 space-y-3 custom-scrollbar">
        {loading && (
          <div className="flex justify-center items-center py-8 text-slate-500 gap-2">
            <div className="w-4 h-4 border-2 border-slate-500 border-t-transparent rounded-full animate-spin"></div>
            <span>Memuat data...</span>
          </div>
        )}
        
        {!loading && historyList.length === 0 && (
          <div className="text-center text-slate-500 py-10">
            <Clock size={48} className="mx-auto mb-3 opacity-20" />
            <p>Belum ada riwayat.</p>
            <p className="text-xs mt-2 text-slate-600">
              {user ? 'Hasil optimasi akan tersimpan di sini.' : 'Login untuk menyimpan riwayat permanen.'}
            </p>
          </div>
        )}

        {historyList.map((item) => {
           const metrics = item.result_data?.metrics; 
           if (!metrics) return null;

           return (
            <div 
              key={item.id} 
              onClick={() => {
                onLoadHistory(item.result_data); 
                onClose();
              }}
              className="bg-slate-800/50 hover:bg-slate-700 border border-slate-700 hover:border-emerald-500/50 p-3 rounded-xl cursor-pointer transition-all group relative overflow-hidden"
            >
              <div className="absolute left-0 top-0 bottom-0 w-1 bg-emerald-500 opacity-0 group-hover:opacity-100 transition-opacity"></div>

              <div className="flex justify-between items-start mb-2 pl-2">
                <span className="text-[10px] text-slate-400 font-mono">
                  {new Date(item.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })} • {new Date(item.created_at).toLocaleTimeString('id-ID', {hour: '2-digit', minute:'2-digit'})}
                </span>
                <ChevronRight size={14} className="text-slate-600 group-hover:text-emerald-400 transition-colors" />
              </div>
              
              <div className="flex flex-wrap gap-1 mb-3 pl-2">
                {item.tickers.slice(0, 3).map(t => (
                  <span key={t} className="text-[10px] bg-[#13151f] px-1.5 py-0.5 rounded text-emerald-400 font-medium border border-slate-700">{t}</span>
                ))}
                {item.tickers.length > 3 && <span className="text-[10px] text-slate-500 self-center">+{item.tickers.length - 3}</span>}
              </div>

              <div className="flex justify-between text-xs border-t border-slate-700/50 pt-2 mt-1 pl-2">
                <div>
                  <span className="block text-slate-500 text-[10px] uppercase">Return</span>
                  <span className="font-bold text-emerald-400">{(metrics.expected_return * 100).toFixed(1)}%</span>
                </div>
                <div>
                  <span className="block text-slate-500 text-[10px] uppercase">Risk</span>
                  <span className="font-bold text-rose-400">{(metrics.risk * 100).toFixed(1)}%</span>
                </div>
                <div>
                  <span className="block text-slate-500 text-[10px] uppercase">Score</span>
                  <span className="font-bold text-blue-400">{metrics.fitness.toFixed(3)}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default HistorySidebar;