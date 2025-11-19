import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { X, Clock, ChevronRight, RefreshCw } from 'lucide-react';

const HistorySidebar = ({ isOpen, onClose, onLoadHistory }) => {
  const [historyList, setHistoryList] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fungsi ambil data dari Backend
  const fetchHistory = async () => {
    setLoading(true);
    try {
      const res = await axios.get('http://localhost:5000/api/history');
      setHistoryList(res.data);
    } catch (err) {
      console.error("Gagal ambil history:", err);
    } finally {
      setLoading(false);
    }
  };

  // Ambil data setiap kali sidebar dibuka
  useEffect(() => {
    if (isOpen) {
      fetchHistory();
    }
  }, [isOpen]);

  return (
    <div className={`fixed inset-y-0 right-0 w-80 bg-slate-800 shadow-2xl border-l border-slate-700 transform transition-transform duration-300 z-50 ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
      
      {/* Header */}
      <div className="p-4 border-b border-slate-700 flex justify-between items-center">
        <h2 className="font-bold text-white flex items-center gap-2">
          <Clock size={20} className="text-emerald-500"/> Riwayat Optimasi
        </h2>
        <div className="flex gap-2">
          <button onClick={fetchHistory} className="p-1 hover:bg-slate-700 rounded text-slate-400">
            <RefreshCw size={18} />
          </button>
          <button onClick={onClose} className="p-1 hover:bg-slate-700 rounded text-slate-400">
            <X size={20} />
          </button>
        </div>
      </div>

      {/* List Content */}
      <div className="overflow-y-auto h-[calc(100vh-64px)] p-4 space-y-3">
        {loading && <p className="text-center text-slate-500 py-4">Memuat data...</p>}
        
        {!loading && historyList.length === 0 && (
          <div className="text-center text-slate-500 py-10">
            <p>Belum ada riwayat.</p>
            <p className="text-xs mt-2">Lakukan optimasi pertama Anda!</p>
          </div>
        )}

        {historyList.map((item) => (
          <div 
            key={item.id} 
            onClick={() => {
              onLoadHistory(item.result_data); // Load data JSON ke Dashboard
              onClose(); // Tutup sidebar
            }}
            className="bg-slate-700/50 hover:bg-slate-700 border border-slate-600 p-3 rounded-lg cursor-pointer transition group"
          >
            <div className="flex justify-between items-start mb-2">
              <span className="text-xs text-slate-400 font-mono">
                {new Date(item.created_at).toLocaleDateString('id-ID')} • {new Date(item.created_at).toLocaleTimeString('id-ID', {hour: '2-digit', minute:'2-digit'})}
              </span>
              <ChevronRight size={16} className="text-slate-500 group-hover:text-emerald-400" />
            </div>
            
            {/* Daftar Ticker */}
            <div className="flex flex-wrap gap-1 mb-2">
              {item.tickers.slice(0, 3).map(t => (
                <span key={t} className="text-[10px] bg-slate-800 px-1.5 py-0.5 rounded text-slate-300">{t}</span>
              ))}
              {item.tickers.length > 3 && <span className="text-[10px] text-slate-500">+{item.tickers.length - 3}</span>}
            </div>

            {/* Ringkasan Hasil */}
            <div className="flex justify-between text-xs border-t border-slate-600/50 pt-2 mt-1">
              <div>
                <span className="block text-slate-500">Return</span>
                <span className="font-bold text-emerald-400">{(item.result_data.metrics.expected_return * 100).toFixed(1)}%</span>
              </div>
              <div className="text-right">
                <span className="block text-slate-500">Risk</span>
                <span className="font-bold text-rose-400">{(item.result_data.metrics.risk * 100).toFixed(1)}%</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HistorySidebar;