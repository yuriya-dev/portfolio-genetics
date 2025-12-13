import React, { useState, useEffect } from 'react';
import { optimizePortfolio, searchStocks } from '../services/api'; // Import searchStocks
import ResultsDashboard from '../components/ResultsDashboard';
import HistorySidebar from '../components/HistorySidebar';
import { Loader2, Plus, X, Search, Cpu, History, Trash2, TrendingUp, Globe } from 'lucide-react';

export default function OptimizationPage() {
  // --- 1. STATE DENGAN AUTO-SAVE (SESSION STORAGE) ---
  const [tickers, setTickers] = useState(() => {
    const saved = sessionStorage.getItem('opt_tickers');
    return saved ? JSON.parse(saved) : ['BBCA.JK', 'ADRO.JK', 'TLKM.JK', 'ANTM.JK'];
  });

  const [resultData, setResultData] = useState(() => {
    const saved = sessionStorage.getItem('opt_result');
    return saved ? JSON.parse(saved) : null;
  });

  const [newTicker, setNewTicker] = useState('');
  const [suggestions, setSuggestions] = useState([]); // Data hasil pencarian API
  const [isSearching, setIsSearching] = useState(false); // Loading state untuk pencarian
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [riskAversion, setRiskAversion] = useState(0.5);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);

  // --- 2. EFFECTS ---
  useEffect(() => {
    sessionStorage.setItem('opt_tickers', JSON.stringify(tickers));
  }, [tickers]);

  useEffect(() => {
    if (resultData) {
      sessionStorage.setItem('opt_result', JSON.stringify(resultData));
    }
  }, [resultData]);

  // --- 3. FETCH DATA DARI SERVICE (API) ---
  useEffect(() => {
    const fetchStocksData = async () => {
      // Hanya cari jika input lebih dari 1 karakter
      if (!newTicker || newTicker.length < 2) {
        setSuggestions([]);
        return;
      }

      setIsSearching(true);
      try {
        // Panggil fungsi API dari service (searchStocks)
        const data = await searchStocks(newTicker);

        if (data.quotes) {
          // Filter hanya saham (Equity), ETF, dan Reksadana
          const validQuotes = data.quotes
            .filter(q => q.quoteType === 'EQUITY' || q.quoteType === 'ETF' || q.quoteType === 'MUTUALFUND')
            .map(q => ({
              symbol: q.symbol,
              name: q.shortname || q.longname || q.symbol,
              exch: q.exchDisp || q.exchange
            }));
          setSuggestions(validQuotes);
        }
      } catch (err) {
        console.error("Gagal mengambil data saham:", err);
        setSuggestions([]);
      } finally {
        setIsSearching(false);
      }
    };

    // Debounce: Tunggu 500ms setelah user berhenti mengetik baru fetch
    const timeoutId = setTimeout(fetchStocksData, 500);
    
    return () => clearTimeout(timeoutId);
  }, [newTicker]);

  // --- HANDLERS ---
  const addTicker = (e) => {
    e && e.preventDefault();
    if (newTicker && !tickers.includes(newTicker.toUpperCase())) {
      setTickers([...tickers, newTicker.toUpperCase()]);
      setNewTicker('');
      setShowSuggestions(false);
    }
  };

  const selectTickerFromList = (symbol) => {
    if (!tickers.includes(symbol)) {
      setTickers([...tickers, symbol]);
    }
    setNewTicker('');
    setShowSuggestions(false);
  };

  const removeTicker = (t) => setTickers(tickers.filter(ticker => ticker !== t));

  const handleReset = () => {
    setResultData(null);
    setError(null);
    sessionStorage.removeItem('opt_result');
  };

  const handleOptimize = async () => {
    setLoading(true);
    setError(null);
    setResultData(null);
    try {
      const data = await optimizePortfolio(tickers, riskAversion);
      setResultData(data);
    } catch (err) {
      setError("Gagal optimasi. Cek koneksi backend.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 relative pb-20">
      
      {/* Header Halaman */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-2">
        <div>
          <h2 className="text-2xl font-bold text-white">Portfolio Optimization</h2>
          <p className="text-slate-400 text-sm">Gunakan AI untuk meracik komposisi investasi terbaik.</p>
        </div>
        
        <button 
          onClick={() => setIsHistoryOpen(true)}
          className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white px-4 py-2 rounded-xl border border-slate-700 transition-all shadow-sm group"
        >
          <History size={18} className="text-emerald-500 group-hover:text-emerald-400" />
          <span>Riwayat Optimasi</span>
        </button>
      </div>
      
      {/* --- SECTION 1: SEARCH & CONFIG --- */}
      <div className="bg-[#1a1d2e] p-6 rounded-2xl border border-slate-800 shadow-sm relative z-10">
        <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-4">1. Pilih Aset Investasi</h3>
        
        {/* Search Bar Input Style with Dropdown */}
        <div className="flex gap-4 mb-6 relative">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={20} />
            <input 
              type="text"
              value={newTicker}
              onFocus={() => setShowSuggestions(true)}
              // Delay onBlur agar klik pada list sempat tereksekusi
              onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
              onChange={(e) => setNewTicker(e.target.value)}
              placeholder="Cari kode saham (cth: BBCA, TLKM, AAPL)..."
              className="w-full bg-[#13151f] border border-slate-700 text-white rounded-xl py-3 pl-12 pr-4 focus:outline-none focus:border-emerald-500 transition-all uppercase placeholder:normal-case"
              autoComplete="off"
            />

            {/* DROPDOWN SUGGESTIONS */}
            {showSuggestions && newTicker.length > 1 && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-[#1a1d2e] border border-slate-700 rounded-xl shadow-2xl max-h-64 overflow-y-auto z-50 custom-scrollbar">
                
                {isSearching ? (
                   <div className="p-4 text-center text-slate-500 text-xs flex items-center justify-center gap-2">
                      <Loader2 size={14} className="animate-spin" /> Mencari di Yahoo Finance...
                   </div>
                ) : suggestions.length > 0 ? (
                  <>
                    <div className="px-4 py-2 text-[10px] font-semibold text-slate-500 uppercase bg-[#13151f]/50 border-b border-slate-800">
                      Hasil Pencarian
                    </div>
                    {suggestions.map((stock) => {
                      const isAdded = tickers.includes(stock.symbol);
                      return (
                        <button
                          key={stock.symbol}
                          onClick={() => selectTickerFromList(stock.symbol)}
                          disabled={isAdded}
                          className={`w-full text-left px-4 py-3 flex justify-between items-center transition-colors border-b border-slate-800/50 last:border-0
                            ${isAdded ? 'opacity-50 cursor-not-allowed bg-slate-800/30' : 'hover:bg-slate-800 cursor-pointer'}
                          `}
                        >
                          <div className="flex items-center gap-3 overflow-hidden">
                            <div className={`p-2 rounded-lg shrink-0 ${isAdded ? 'bg-slate-700 text-slate-400' : 'bg-emerald-500/10 text-emerald-400'}`}>
                              {stock.symbol.includes('.') ? <TrendingUp size={16} /> : <Globe size={16} />}
                            </div>
                            <div className="min-w-0">
                              <span className="font-bold text-white block truncate">{stock.symbol}</span>
                              <span className="text-xs text-slate-400 block truncate">{stock.name}</span>
                            </div>
                          </div>
                          <div className="flex items-center gap-3 shrink-0">
                            <span className="text-[10px] bg-slate-700/50 text-slate-500 px-1.5 py-0.5 rounded">{stock.exch}</span>
                            {isAdded ? (
                              <span className="text-[10px] font-medium bg-slate-700 text-slate-300 px-2 py-1 rounded">Added</span>
                            ) : (
                              <Plus size={16} className="text-slate-500 hover:text-white" />
                            )}
                          </div>
                        </button>
                      );
                    })}
                  </>
                ) : (
                   <div className="p-4 text-center text-slate-500 text-sm">
                     Tidak ditemukan. Coba kode lain.
                   </div>
                )}
              </div>
            )}
          </div>

          <button 
            onClick={addTicker}
            disabled={!newTicker}
            className="bg-slate-700 hover:bg-slate-600 text-white px-6 py-3 rounded-xl font-medium transition-colors disabled:opacity-50 flex items-center gap-2 shadow-lg"
          >
            <Plus size={18} />
            <span className="hidden md:inline">Tambah</span>
          </button>
        </div>

        {/* Active Tickers Chips */}
        <div className="mb-6 bg-[#13151f]/50 p-4 rounded-xl border border-slate-800/50">
          <p className="text-xs text-slate-500 mb-3">Aset Terpilih ({tickers.length})</p>
          <div className="flex flex-wrap gap-2">
            {tickers.length === 0 && <span className="text-slate-600 text-sm italic">Belum ada aset dipilih.</span>}
            {tickers.map(t => (
              <div key={t} className="flex items-center gap-2 bg-[#1a1d2e] border border-slate-700 px-3 py-1.5 rounded-lg text-sm text-slate-300 shadow-sm hover:border-slate-600 transition-colors group">
                <span className="font-mono font-bold text-emerald-400">{t}</span>
                <button onClick={() => removeTicker(t)} className="text-slate-500 hover:text-rose-400 transition-colors bg-slate-800 rounded-full p-0.5 opacity-0 group-hover:opacity-100">
                  <X size={12} />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Risk Slider & Action */}
        <div className="pt-4 border-t border-slate-800">
           <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-4">2. Atur Profil Risiko</h3>
           
           <div className="flex flex-col md:flex-row items-end gap-6">
            <div className="flex-1 w-full">
              <div className="flex justify-between mb-2 text-sm">
                <span className="text-emerald-400 font-medium">Agresif (High Return)</span>
                <span className="text-slate-400 bg-slate-800 px-2 py-0.5 rounded text-xs">Risk Aversion: <strong className="text-white">{riskAversion}</strong></span>
                <span className="text-blue-400 font-medium">Konservatif (Low Risk)</span>
              </div>
              <input 
                type="range" min="0" max="1" step="0.1"
                value={riskAversion}
                onChange={(e) => setRiskAversion(parseFloat(e.target.value))}
                className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-emerald-500 hover:accent-emerald-400"
              />
            </div>
            
            <div className="flex gap-3 w-full md:w-auto">
              {resultData && (
                <button 
                  onClick={handleReset}
                  className="px-4 py-3 rounded-xl border border-slate-700 text-slate-400 hover:text-white hover:bg-slate-700 transition-all"
                  title="Reset Hasil"
                >
                  <Trash2 size={20} />
                </button>
              )}
              
              <button 
                onClick={handleOptimize}
                disabled={loading || tickers.length < 2}
                className={`flex-1 md:flex-none px-8 py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-all shadow-lg 
                  ${loading 
                    ? 'bg-slate-700 text-slate-400 cursor-not-allowed' 
                    : 'bg-emerald-500 hover:bg-emerald-600 text-slate-900 shadow-emerald-500/20 hover:shadow-emerald-500/30'}
                `}
              >
                {loading ? <Loader2 className="animate-spin" size={20}/> : <Cpu size={20}/>}
                {loading ? 'Sedang Menghitung...' : 'Jalankan Optimasi'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* --- SECTION 2: RESULTS --- */}
      {error && (
        <div className="p-4 bg-rose-500/10 border border-rose-500/20 text-rose-400 rounded-xl flex items-center gap-3 animate-in fade-in slide-in-from-bottom-2">
          <div className="w-2 h-2 bg-rose-500 rounded-full animate-pulse"></div>
          {error}
        </div>
      )}

      {resultData ? (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
          <ResultsDashboard data={resultData} />
        </div>
      ) : (
        !loading && (
          <div className="text-center py-20 border-2 border-dashed border-slate-800 rounded-2xl text-slate-500 bg-[#1a1d2e]/30">
            <Cpu size={48} className="mx-auto mb-4 opacity-20" />
            <h3 className="text-lg font-medium text-slate-400">Siap untuk Optimasi</h3>
            <p className="text-sm mt-1">Tambahkan saham di atas lalu klik tombol "Jalankan Optimasi".</p>
          </div>
        )
      )}

      {/* Sidebar Component */}
      <HistorySidebar 
        isOpen={isHistoryOpen} 
        onClose={() => setIsHistoryOpen(false)} 
        onLoadHistory={(savedData) => {
          setResultData(savedData);
          setTickers(savedData.composition.map(c => c.ticker));
          sessionStorage.setItem('opt_result', JSON.stringify(savedData));
          sessionStorage.setItem('opt_tickers', JSON.stringify(savedData.composition.map(c => c.ticker)));
        }}
      />
    </div>
  );
}