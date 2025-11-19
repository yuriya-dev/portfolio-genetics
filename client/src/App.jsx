import React, { useState } from 'react';
import { optimizePortfolio } from './services/api';

// Components
import Header from './components/Header';
import ConfigPanel from './components/ConfigPanel';
import ResultsDashboard from './components/ResultsDashboard';
import HistorySidebar from './components/HistorySidebar';
import { ErrorView, EmptyState, LoadingState } from './components/StatusViews';

function App() {
  // --- STATE MANAGEMENT ---
  const [tickers, setTickers] = useState(['BBCA.JK', 'ADRO.JK', 'TLKM.JK', 'ANTM.JK']);
  const [newTicker, setNewTicker] = useState('');
  const [riskAversion, setRiskAversion] = useState(0.5);
  const [loading, setLoading] = useState(false);
  const [resultData, setResultData] = useState(null);
  const [error, setError] = useState(null);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);

  // --- HANDLERS ---
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

  // --- RENDER ---
  return (
    <div className="min-h-screen bg-slate-900 text-slate-200 font-sans selection:bg-emerald-500 selection:text-white">
      
      <Header onOpenHistory={() => setIsHistoryOpen(true)} />

      <main className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* LEFT: CONFIG PANEL */}
          <ConfigPanel 
            tickers={tickers}
            addTicker={addTicker}
            removeTicker={removeTicker}
            newTicker={newTicker}
            setNewTicker={setNewTicker}
            riskAversion={riskAversion}
            setRiskAversion={setRiskAversion}
            handleOptimize={handleOptimize}
            loading={loading}
          />

          {/* RIGHT: MAIN CONTENT */}
          <div className="w-full lg:w-3/4">
            {error && <ErrorView message={error} />}
            
            {loading && <LoadingState />}
            
            {!loading && !resultData && !error && <EmptyState />}
            
            {resultData && <ResultsDashboard data={resultData} />}
          </div>

        </div>
      </main>

      <HistorySidebar 
        isOpen={isHistoryOpen} 
        onClose={() => setIsHistoryOpen(false)} 
        onLoadHistory={(savedData) => {
          setResultData(savedData);
          setTickers(savedData.composition.map(c => c.ticker));
        }}
      />
    </div>
  );
}

export default App;