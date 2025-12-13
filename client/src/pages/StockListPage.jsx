import React, { useState, useEffect } from 'react';
import { getStockQuotes, getStockChart } from '../services/api';
import { 
  TrendingUp, TrendingDown, MoreHorizontal, Search, 
  Loader2, X, BarChart3, Globe, DollarSign, Calendar
} from 'lucide-react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer 
} from 'recharts';

// Daftar saham default untuk dipantau
const DEFAULT_WATCHLIST = [
  'BBCA.JK', 'BBRI.JK', 'BMRI.JK', 'TLKM.JK', 'ASII.JK', 
  'GOTO.JK', 'UNVR.JK', 'ADRO.JK', 'AAPL', 'TSLA', 'NVDA', 'MSFT'
];

export default function StockListPage() {
  const [stocks, setStocks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedStock, setSelectedStock] = useState(null); // Untuk Modal Detail
  const [chartData, setChartData] = useState([]);
  const [chartLoading, setChartLoading] = useState(false);
  const [chartRange, setChartRange] = useState('1mo'); // 1d, 5d, 1mo, 6mo, 1y

  // --- 1. FETCH DATA SAHAM (QUOTES) ---
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const data = await getStockQuotes(DEFAULT_WATCHLIST);
      setStocks(data);
      setLoading(false);
    };
    fetchData();
    
    // Auto refresh setiap 30 detik
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, []);

  // --- 2. FETCH DATA CHART SAAT SAHAM DIKLIK ---
  useEffect(() => {
    if (selectedStock) {
      const fetchChart = async () => {
        setChartLoading(true);
        const result = await getStockChart(selectedStock.symbol, chartRange);
        
        if (result && result.timestamp) {
          const prices = result.indicators.quote[0].close;
          const formattedData = result.timestamp.map((ts, index) => ({
            date: new Date(ts * 1000).toLocaleDateString(),
            price: prices[index] ? prices[index].toFixed(2) : null,
          })).filter(d => d.price !== null); // Hapus data null
          
          setChartData(formattedData);
        }
        setChartLoading(false);
      };
      fetchChart();
    }
  }, [selectedStock, chartRange]);

  // --- FORMAT CURRENCY ---
  const formatCurrency = (val, currency) => {
    return new Intl.NumberFormat(currency === 'IDR' ? 'id-ID' : 'en-US', {
      style: 'currency',
      currency: currency || 'USD',
      minimumFractionDigits: 2
    }).format(val);
  };

  return (
    <div className="space-y-6 relative">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-end gap-4">
         <div>
            <h2 className="text-2xl font-bold text-white">Market Watchlist</h2>
            <p className="text-slate-400 text-sm">Pantau pergerakan harga saham global dan lokal secara real-time.</p>
         </div>
      </div>

      {/* Table */}
      <div className="bg-[#1a1d2e] rounded-2xl border border-slate-800 overflow-hidden shadow-lg">
        <div className="p-6 border-b border-slate-800 flex justify-between items-center bg-[#13151f]">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <BarChart3 size={20} className="text-emerald-500"/> Market Overview
          </h2>
          <span className="text-xs text-slate-500 bg-slate-800 px-2 py-1 rounded">Auto-refresh: 30s</span>
        </div>
        
        <div className="overflow-x-auto">
          {loading && stocks.length === 0 ? (
             <div className="p-10 text-center text-slate-500">
               <Loader2 className="animate-spin mx-auto mb-2" size={32}/>
               Loading market data...
             </div>
          ) : (
            <table className="w-full text-left">
              <thead className="bg-[#13151f] text-slate-400 text-xs uppercase tracking-wider font-semibold">
                <tr>
                  <th className="p-4 pl-6">Ticker</th>
                  <th className="p-4">Price</th>
                  <th className="p-4">Change</th>
                  <th className="p-4">% Change</th>
                  <th className="p-4 hidden md:table-cell">Volume</th>
                  <th className="p-4 hidden md:table-cell">Market Cap</th>
                  <th className="p-4 text-right pr-6">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {stocks.map((stock) => {
                  const isPositive = stock.regularMarketChange >= 0;
                  return (
                    <tr 
                      key={stock.symbol} 
                      onClick={() => setSelectedStock(stock)}
                      className="hover:bg-slate-800/50 transition-colors cursor-pointer group"
                    >
                      <td className="p-4 pl-6">
                        <div className="flex items-center gap-3">
                          <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs ${isPositive ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'}`}>
                            {stock.symbol.substring(0, 1)}
                          </div>
                          <div>
                            <span className="font-bold text-white block">{stock.symbol}</span>
                            <span className="text-xs text-slate-400 block max-w-[150px] truncate">{stock.shortName || stock.longName}</span>
                          </div>
                        </div>
                      </td>
                      <td className="p-4 font-medium text-white">
                        {formatCurrency(stock.regularMarketPrice, stock.currency)}
                      </td>
                      <td className={`p-4 font-medium ${isPositive ? 'text-emerald-400' : 'text-rose-400'}`}>
                        {stock.regularMarketChange.toFixed(2)}
                      </td>
                      <td className="p-4">
                        <span className={`flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-md w-fit ${isPositive ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'}`}>
                          {isPositive ? <TrendingUp size={12}/> : <TrendingDown size={12}/>}
                          {stock.regularMarketChangePercent.toFixed(2)}%
                        </span>
                      </td>
                      <td className="p-4 text-slate-400 text-sm hidden md:table-cell">
                        {(stock.regularMarketVolume / 1000000).toFixed(1)}M
                      </td>
                      <td className="p-4 text-slate-400 text-sm hidden md:table-cell">
                        {stock.marketCap ? (stock.marketCap / 1000000000).toFixed(1) + 'B' : '-'}
                      </td>
                      <td className="p-4 text-right pr-6 text-slate-500 group-hover:text-white">
                        <MoreHorizontal size={20} />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* --- MODAL DETAIL STOCK --- */}
      {selectedStock && (
        <div className="fixed inset-0 z-[60] bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-[#1a1d2e] w-full max-w-4xl rounded-2xl border border-slate-700 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            
            {/* Modal Header */}
            <div className="p-6 border-b border-slate-700 flex justify-between items-start bg-[#13151f]">
              <div className="flex items-center gap-4">
                <div className={`p-3 rounded-xl ${selectedStock.regularMarketChange >= 0 ? 'bg-emerald-500' : 'bg-rose-500'} text-slate-900`}>
                   <Globe size={24} />
                </div>
                <div>
                   <h2 className="text-2xl font-bold text-white">{selectedStock.symbol}</h2>
                   <p className="text-slate-400 text-sm">{selectedStock.longName}</p>
                </div>
              </div>
              <button 
                onClick={() => setSelectedStock(null)}
                className="p-2 hover:bg-slate-700 rounded-full text-slate-400 hover:text-white transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            {/* Modal Content */}
            <div className="flex-1 overflow-y-auto p-6">
               
               {/* Key Stats Grid */}
               <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                  <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700">
                    <p className="text-slate-500 text-xs uppercase mb-1">Current Price</p>
                    <p className="text-xl font-bold text-white">{formatCurrency(selectedStock.regularMarketPrice, selectedStock.currency)}</p>
                  </div>
                  <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700">
                    <p className="text-slate-500 text-xs uppercase mb-1">Day Range</p>
                    <p className="text-sm font-medium text-white">
                       {selectedStock.regularMarketDayLow?.toFixed(2)} - {selectedStock.regularMarketDayHigh?.toFixed(2)}
                    </p>
                  </div>
                  <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700">
                    <p className="text-slate-500 text-xs uppercase mb-1">Volume</p>
                    <p className="text-sm font-medium text-white">{selectedStock.regularMarketVolume?.toLocaleString()}</p>
                  </div>
                  <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700">
                    <p className="text-slate-500 text-xs uppercase mb-1">Market Cap</p>
                    <p className="text-sm font-medium text-white">
                      {selectedStock.marketCap ? (selectedStock.marketCap / 1000000000).toFixed(2) + 'B' : '-'}
                    </p>
                  </div>
               </div>

               {/* Chart Section */}
               <div className="bg-[#13151f] p-4 rounded-xl border border-slate-700 min-h-[300px]">
                  <div className="flex justify-between items-center mb-4">
                     <h3 className="font-bold text-white flex items-center gap-2">
                        <Calendar size={18} className="text-slate-400"/> Price History
                     </h3>
                     <div className="flex bg-slate-800 rounded-lg p-1">
                        {['5d', '1mo', '6mo', '1y'].map(range => (
                           <button
                              key={range}
                              onClick={() => setChartRange(range)}
                              className={`px-3 py-1 text-xs font-medium rounded-md transition-all ${
                                 chartRange === range ? 'bg-slate-600 text-white shadow' : 'text-slate-400 hover:text-white'
                              }`}
                           >
                              {range.toUpperCase()}
                           </button>
                        ))}
                     </div>
                  </div>

                  {chartLoading ? (
                     <div className="h-[250px] flex flex-col items-center justify-center text-slate-500">
                        <Loader2 className="animate-spin mb-2" size={32}/>
                        <p>Loading chart data...</p>
                     </div>
                  ) : chartData.length > 0 ? (
                     <div className="h-[250px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                           <AreaChart data={chartData}>
                              <defs>
                                 <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor={selectedStock.regularMarketChange >= 0 ? "#10B981" : "#F43F5E"} stopOpacity={0.3}/>
                                    <stop offset="95%" stopColor={selectedStock.regularMarketChange >= 0 ? "#10B981" : "#F43F5E"} stopOpacity={0}/>
                                 </linearGradient>
                              </defs>
                              <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                              <XAxis dataKey="date" hide={true} />
                              <YAxis 
                                 domain={['auto', 'auto']} 
                                 orientation="right" 
                                 stroke="#94a3b8" 
                                 tick={{fontSize: 10}}
                                 width={40}
                              />
                              <Tooltip 
                                 contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#fff' }}
                                 itemStyle={{ color: '#fff' }}
                                 labelStyle={{ color: '#94a3b8', fontSize: '12px', marginBottom: '5px' }}
                              />
                              <Area 
                                 type="monotone" 
                                 dataKey="price" 
                                 stroke={selectedStock.regularMarketChange >= 0 ? "#10B981" : "#F43F5E"} 
                                 fillOpacity={1} 
                                 fill="url(#colorPrice)" 
                                 strokeWidth={2}
                              />
                           </AreaChart>
                        </ResponsiveContainer>
                     </div>
                  ) : (
                     <div className="h-[250px] flex items-center justify-center text-slate-500">
                        No chart data available
                     </div>
                  )}
               </div>

            </div>
          </div>
        </div>
      )}

    </div>
  );
}