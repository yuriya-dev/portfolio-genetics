import React, { useState } from 'react';
import { optimizePortfolio } from './services/api';
import ResultsDashboard from './components/ResultsDashboard';
import { Plus, Trash2, Cpu, Loader2 } from 'lucide-react';

function App() {
  // State Input
  const [tickers, setTickers] = useState(['BBCA.JK', 'ADRO.JK', 'TLKM.JK', 'ANTM.JK']);
  const [newTicker, setNewTicker] = useState('');
  const [riskAversion, setRiskAversion] = useState(0.5); // 0 = Agresif, 1 = Konservatif

  // State Proses
  const [loading, setLoading] = useState(false);
  const [resultData, setResultData] = useState(null);
  const [error, setError] = useState(null);

  // Handlers
  const addTicker = (e) => {
    e.preventDefault();
    if (newTicker && !tickers.includes(newTicker.toUpperCase())) {
      setTickers([...tickers, newTicker.toUpperCase()]);
      setNewTicker('');
    }
  };

  const removeTicker = (tickerToRemove) => {
    setTickers(tickers.filter(t => t !== tickerToRemove));
  };

  const handleOptimize = async () => {
    setLoading(true);
    setError(null);
    setResultData(null);

    try {
      const data = await optimizePortfolio(tickers, riskAversion);
      setResultData(data);
    } catch (err) {
      setError("Gagal melakukan optimasi. Pastikan simbol saham benar (gunakan akhiran .JK) dan server backend berjalan.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-200 font-sans selection:bg-emerald-500 selection:text-white">
      
      {/* HEADER */}
      <header className="border-b border-slate-800 bg-slate-900/50 backdrop-blur-md sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="bg-emerald-500 p-2 rounded-lg">
              <Cpu className="text-slate-900" size={24} />
            </div>
            <h1 className="text-xl font-bold tracking-tight text-white">
              Genetic<span className="text-emerald-400">Portfolio</span>
            </h1>
          </div>
          <div className="text-xs text-slate-500 font-mono">v1.0 Beta</div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* LEFT SIDEBAR - INPUT CONFIG */}
          <div className="w-full lg:w-1/4 space-y-6">
            
            {/* Input Card */}
            <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 shadow-lg sticky top-24">
              <h2 className="text-lg font-bold text-white mb-4">Konfigurasi Aset</h2>
              
              {/* Ticker Input */}
              <form onSubmit={addTicker} className="mb-4 relative">
                <input 
                  type="text" 
                  value={newTicker}
                  onChange={(e) => setNewTicker(e.target.value)}
                  placeholder="Simbol Saham (ex: BBRI.JK)"
                  className="w-full bg-slate-900 border border-slate-600 rounded-lg px-4 py-3 focus:outline-none focus:border-emerald-500 text-white placeholder-slate-500 uppercase"
                />
                <button 
                  type="submit"
                  className="absolute right-2 top-2 p-1 bg-slate-700 hover:bg-slate-600 rounded-md transition"
                >
                  <Plus size={20} />
                </button>
              </form>

              {/* Ticker List */}
              <div className="flex flex-wrap gap-2 mb-6">
                {tickers.map(ticker => (
                  <div key={ticker} className="bg-slate-700 text-xs font-mono py-1 px-3 rounded-full flex items-center border border-slate-600">
                    {ticker}
                    <button onClick={() => removeTicker(ticker)} className="ml-2 text-slate-400 hover:text-rose-400">
                      <Trash2 size={12} />
                    </button>
                  </div>
                ))}
              </div>

              {/* Risk Slider */}
              <div className="mb-8">
                <div className="flex justify-between mb-2 text-sm">
                  <span className="text-emerald-400">Agresif (Risiko Tinggi)</span>
                  <span className="text-blue-400">Konservatif (Aman)</span>
                </div>
                <input 
                  type="range" 
                  min="0" max="1" step="0.1" 
                  value={riskAversion}
                  onChange={(e) => setRiskAversion(parseFloat(e.target.value))}
                  className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                />
                <div className="text-center mt-2 text-slate-400 text-xs">
                  Risk Aversion Factor: <span className="text-white font-bold">{riskAversion}</span>
                </div>
              </div>

              {/* Action Button */}
              <button 
                onClick={handleOptimize}
                disabled={loading || tickers.length < 2}
                className={`w-full py-3 rounded-lg font-bold flex items-center justify-center space-x-2 transition-all
                  ${loading 
                    ? 'bg-slate-700 cursor-not-allowed text-slate-400' 
                    : 'bg-emerald-500 hover:bg-emerald-600 text-slate-900 shadow-[0_0_20px_rgba(16,185,129,0.3)]'
                  }`}
              >
                {loading ? (
                  <>
                    <Loader2 className="animate-spin" size={20} />
                    <span>Sedang Evolusi...</span>
                  </>
                ) : (
                  <>
                    <Cpu size={20} />
                    <span>Mulai Optimasi</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* RIGHT CONTENT - RESULTS */}
          <div className="w-full lg:w-3/4">
            {error && (
              <div className="bg-rose-500/10 border border-rose-500/50 text-rose-400 p-4 rounded-xl mb-6">
                {error}
              </div>
            )}

            {!resultData && !loading && !error && (
              <div className="h-96 flex flex-col items-center justify-center text-slate-600 border-2 border-dashed border-slate-800 rounded-xl">
                <Cpu size={64} className="mb-4 opacity-20" />
                <p className="text-lg">Tambahkan saham dan mulai optimasi AI</p>
              </div>
            )}

            {loading && (
              <div className="h-96 flex flex-col items-center justify-center space-y-4">
                <div className="w-16 h-16 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
                <p className="text-emerald-400 animate-pulse">Algoritma Genetika sedang mencari kombinasi terbaik...</p>
                <p className="text-xs text-slate-500">Proses ini memakan waktu 5-20 detik tergantung data historis.</p>
              </div>
            )}

            {resultData && <ResultsDashboard data={resultData} />}
          </div>

        </div>
      </main>
    </div>
  );
}

export default App;