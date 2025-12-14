import React, { useState, useEffect } from 'react';
import { optimizePortfolio, searchStocks } from '../services/api'; 
import ResultsDashboard from '../components/ResultsDashboard';
import HistorySidebar from '../components/HistorySidebar';
import { Loader2, Plus, X, Search, Cpu, History, Trash2, TrendingUp, Globe, Wallet } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function OptimizationPage() {
  const { user } = useAuth();

  // Storage keys
  const storageKeyTickers = user ? `opt_tickers_${user.id}` : 'opt_tickers_guest';
  const storageKeyResult = user ? `opt_result_${user.id}` : 'opt_result_guest';
  const storageKeyBalance = user ? `opt_balance_${user.id}` : 'opt_balance_guest';

  const [tickers, setTickers] = useState(() => {
    const saved = sessionStorage.getItem(storageKeyTickers);
    return saved ? JSON.parse(saved) : ['BBCA.JK', 'ADRO.JK', 'TLKM.JK', 'ANTM.JK'];
  });

  const [resultData, setResultData] = useState(() => {
    const saved = sessionStorage.getItem(storageKeyResult);
    return saved ? JSON.parse(saved) : null;
  });

  const [investmentBalance, setInvestmentBalance] = useState(() => {
    const saved = sessionStorage.getItem(storageKeyBalance);
    return saved ? parseFloat(saved) : 100000000; // Default 100 juta
  });

  const [newTicker, setNewTicker] = useState('');
  const [suggestions, setSuggestions] = useState([]); 
  const [isSearching, setIsSearching] = useState(false); 
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [riskAversion, setRiskAversion] = useState(0.5);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);

  // Auto Save
  useEffect(() => {
    sessionStorage.setItem(storageKeyTickers, JSON.stringify(tickers));
  }, [tickers, storageKeyTickers]);

  useEffect(() => {
    if (resultData) {
      sessionStorage.setItem(storageKeyResult, JSON.stringify(resultData));
    }
  }, [resultData, storageKeyResult]);

  useEffect(() => {
    sessionStorage.setItem(storageKeyBalance, investmentBalance.toString());
  }, [investmentBalance, storageKeyBalance]);

  // Reset state on user change
  useEffect(() => {
    const savedTickers = sessionStorage.getItem(storageKeyTickers);
    setTickers(savedTickers ? JSON.parse(savedTickers) : ['BBCA.JK', 'ADRO.JK', 'TLKM.JK', 'ANTM.JK']);
    
    const savedResult = sessionStorage.getItem(storageKeyResult);
    setResultData(savedResult ? JSON.parse(savedResult) : null);

    const savedBalance = sessionStorage.getItem(storageKeyBalance);
    setInvestmentBalance(savedBalance ? parseFloat(savedBalance) : 100000000);
  }, [user]);

  // Fetch stock suggestions
  useEffect(() => {
    const fetchStocksData = async () => {
      if (!newTicker || newTicker.length < 2) {
        setSuggestions([]);
        return;
      }
      setIsSearching(true);
      try {
        const data = await searchStocks(newTicker);
        if (data.quotes) {
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
        console.error(err);
        setSuggestions([]);
      } finally {
        setIsSearching(false);
      }
    };
    const timeoutId = setTimeout(fetchStocksData, 500);
    return () => clearTimeout(timeoutId);
  }, [newTicker]);

  // Handlers
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
    sessionStorage.removeItem(storageKeyResult);
  };

  const handleOptimize = async () => {
    setLoading(true);
    setError(null);
    setResultData(null);
    try {
      const data = await optimizePortfolio(tickers, riskAversion, user?.id);
      // Tambahkan balance ke result data
      const enrichedData = {
        ...data,
        investmentBalance: investmentBalance
      };
      setResultData(enrichedData);
    } catch (err) {
      setError("Gagal optimasi. Cek koneksi backend.");
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  const handleBalanceChange = (e) => {
    const value = e.target.value.replace(/\D/g, ''); // Remove non-digits
    setInvestmentBalance(value ? parseFloat(value) : 0);
  };

  return (
    <div className="space-y-6 relative pb-20">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-2">
        <div>
          <h2 className="text-2xl font-bold text-white">Portfolio Optimization</h2>
          <p className="text-slate-400 text-sm">
            {user ? `Optimasi untuk akun: ${user.email}` : 'Mode Tamu (Hasil bersifat sementara)'}
          </p>
        </div>
        
        <button 
          onClick={() => setIsHistoryOpen(true)}
          className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white px-4 py-2 rounded-xl border border-slate-700 transition-all shadow-sm group"
        >
          <History size={18} className="text-emerald-500 group-hover:text-emerald-400" />
          <span>Riwayat Optimasi</span>
        </button>
      </div>
      
      {/* SECTION 1: Investment Balance */}
      <div className="bg-[#1a1d2e] p-4 rounded-xl border border-slate-800 shadow-sm">
        <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-2">
          <Wallet size={14} className="text-emerald-500" />
          Saldo Investasi
        </h3>
        
        <div className="flex flex-col md:flex-row gap-3 items-center">
          <div className="flex-1 w-full">
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 text-sm">Rp</span>
              <input 
                type="text"
                value={investmentBalance ? investmentBalance.toLocaleString('id-ID') : ''}
                onChange={handleBalanceChange}
                placeholder="100.000.000"
                className="w-full bg-[#13151f] border border-slate-700 text-white rounded-lg py-2 pl-10 pr-3 focus:outline-none focus:border-emerald-500 transition-all font-semibold"
              />
            </div>
          </div>
          
          <div className="flex gap-2">
            <button 
              onClick={() => setInvestmentBalance(50000000)}
              className="px-3 py-2 text-xs rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-colors whitespace-nowrap"
            >
              50 Jt
            </button>
            <button 
              onClick={() => setInvestmentBalance(100000000)}
              className="px-3 py-2 text-xs rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-colors whitespace-nowrap"
            >
              100 Jt
            </button>
            <button 
              onClick={() => setInvestmentBalance(500000000)}
              className="px-3 py-2 text-xs rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-colors whitespace-nowrap"
            >
              500 Jt
            </button>
          </div>
          
          <div className="px-3 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-lg">
            <p className="text-xs text-emerald-400 font-semibold whitespace-nowrap">
              {formatCurrency(investmentBalance)}
            </p>
          </div>
        </div>
      </div>

      {/* SECTION 2: Stock Selection */}
      <div className="bg-[#1a1d2e] p-4 rounded-xl border border-slate-800 shadow-sm relative z-10">
        <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">Pilih Aset Investasi</h3>
        
        <div className="flex gap-3 mb-4 relative">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
            <input 
              type="text"
              value={newTicker}
              onFocus={() => setShowSuggestions(true)}
              onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
              onChange={(e) => setNewTicker(e.target.value)}
              placeholder="Cari kode saham (cth: BBCA, TLKM, AAPL)..."
              className="w-full bg-[#13151f] border border-slate-700 text-white rounded-lg py-2 pl-10 pr-3 focus:outline-none focus:border-emerald-500 transition-all uppercase placeholder:normal-case text-sm"
              autoComplete="off"
            />

            {/* Dropdown Suggestions */}
            {showSuggestions && newTicker.length > 1 && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-[#1a1d2e] border border-slate-700 rounded-xl shadow-2xl max-h-64 overflow-y-auto z-50 custom-scrollbar">
                {isSearching ? (
                   <div className="p-4 text-center text-slate-500 text-xs flex items-center justify-center gap-2">
                      <Loader2 size={14} className="animate-spin" /> Mencari...
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
                          {isAdded ? (
                            <span className="text-[10px] font-medium bg-slate-700 text-slate-300 px-2 py-1 rounded">Added</span>
                          ) : (
                            <Plus size={16} className="text-slate-500 hover:text-white" />
                          )}
                        </button>
                      );
                    })}
                  </>
                ) : (
                   <div className="p-4 text-center text-slate-500 text-sm">Tidak ditemukan.</div>
                )}
              </div>
            )}
          </div>

          <button 
            onClick={addTicker}
            disabled={!newTicker}
            className="bg-slate-700 hover:bg-slate-600 text-white px-5 py-2 rounded-lg font-medium transition-colors disabled:opacity-50 flex items-center gap-2 shadow-lg"
          >
            <Plus size={18} />
            <span className="hidden md:inline">Tambah</span>
          </button>
        </div>

        {/* Active Tickers */}
        <div className="mb-4 bg-[#13151f]/50 p-3 rounded-lg border border-slate-800/50">
          <p className="text-[10px] text-slate-500 mb-2">Aset Terpilih ({tickers.length})</p>
          <div className="flex flex-wrap gap-2">
            {tickers.length === 0 && <span className="text-slate-600 text-xs italic">Belum ada aset dipilih.</span>}
            {tickers.map(t => (
              <div key={t} className="flex items-center gap-2 bg-[#1a1d2e] border border-slate-700 px-2.5 py-1 rounded-lg text-xs text-slate-300 shadow-sm hover:border-slate-600 transition-colors group">
                <span className="font-mono font-bold text-emerald-400">{t}</span>
                <button onClick={() => removeTicker(t)} className="text-slate-500 hover:text-rose-400 transition-colors bg-slate-800 rounded-full p-0.5 opacity-0 group-hover:opacity-100">
                  <X size={12} />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Risk Slider */}
        <div className="pt-3 border-t border-slate-800">
           <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">Atur Profil Risiko</h3>
           
           <div className="flex flex-col md:flex-row items-end gap-4">
            <div className="flex-1 w-full">
              <div className="flex justify-between mb-2 text-xs">
                <span className="text-emerald-400 font-medium">Agresif</span>
                <span className="text-slate-400 bg-slate-800 px-2 py-0.5 rounded text-[10px]">Risk: <strong className="text-white">{riskAversion}</strong></span>
                <span className="text-blue-400 font-medium">Konservatif</span>
              </div>
              <input 
                type="range" min="0" max="1" step="0.1"
                value={riskAversion}
                onChange={(e) => setRiskAversion(parseFloat(e.target.value))}
                className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-emerald-500 hover:accent-emerald-400"
              />
            </div>
            
            <div className="flex gap-2 w-full md:w-auto">
              {resultData && (
                <button onClick={handleReset} className="px-3 py-2 rounded-lg border border-slate-700 text-slate-400 hover:text-white hover:bg-slate-700 transition-all">
                  <Trash2 size={18} />
                </button>
              )}
              <button 
                onClick={handleOptimize}
                disabled={loading || tickers.length < 2}
                className={`flex-1 md:flex-none px-6 py-2 rounded-lg font-bold flex items-center justify-center gap-2 transition-all shadow-lg text-sm
                  ${loading 
                    ? 'bg-slate-700 text-slate-400 cursor-not-allowed' 
                    : 'bg-emerald-500 hover:bg-emerald-600 text-slate-900 shadow-emerald-500/20 hover:shadow-emerald-500/30'}
                `}
              >
                {loading ? <Loader2 className="animate-spin" size={18}/> : <Cpu size={18}/>}
                {loading ? 'Menghitung...' : 'Jalankan Optimasi'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Results */}
      {error && (
        <div className="p-4 bg-rose-500/10 border border-rose-500/20 text-rose-400 rounded-xl flex items-center gap-3 animate-in fade-in">
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
            <p className="text-sm mt-1">Tambahkan saham lalu klik "Jalankan Optimasi".</p>
          </div>
        )
      )}

      <HistorySidebar 
        isOpen={isHistoryOpen} 
        onClose={() => setIsHistoryOpen(false)} 
        onLoadHistory={(savedData) => {
          setResultData(savedData);
          setTickers(savedData.composition.map(c => c.ticker));
          if (savedData.investmentBalance) {
            setInvestmentBalance(savedData.investmentBalance);
          }
          sessionStorage.setItem(storageKeyResult, JSON.stringify(savedData));
          sessionStorage.setItem(storageKeyTickers, JSON.stringify(savedData.composition.map(c => c.ticker)));
          if (savedData.investmentBalance) {
            sessionStorage.setItem(storageKeyBalance, savedData.investmentBalance.toString());
          }
        }}
      />
    </div>
  );
}