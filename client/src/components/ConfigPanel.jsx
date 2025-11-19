import React from 'react';
import { Plus, Trash2, Cpu, Loader2 } from 'lucide-react';

const ConfigPanel = ({ 
  tickers, 
  addTicker, 
  removeTicker, 
  newTicker, 
  setNewTicker, 
  riskAversion, 
  setRiskAversion, 
  handleOptimize, 
  loading 
}) => {
  return (
    <div className="w-full lg:w-1/4 space-y-6">
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
            <span className="text-emerald-400">Agresif</span>
            <span className="text-blue-400">Konservatif</span>
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
  );
};

export default ConfigPanel;