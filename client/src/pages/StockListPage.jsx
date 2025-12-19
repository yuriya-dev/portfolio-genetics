import React, { useState, useEffect, useRef, useCallback } from 'react';
import { getStockQuotes, getStockChart, searchStocks, fetchUserWatchlist, syncUserWatchlist } from '../services/api';
import { 
  TrendingUp, TrendingDown, Search, Loader2, X, BarChart3, Globe, 
  Calendar, Plus, Trash2, RefreshCw, ChevronLeft, ChevronRight, 
  ArrowUpRight, ArrowDownRight, MousePointer2
} from 'lucide-react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer 
} from 'recharts';
import { useAuth } from '../context/AuthContext'; 
import { Link } from 'react-router-dom';

// --- PRESET LISTS ---
const PRESETS = {
  INDO: [
    'BBCA.JK', 'BBRI.JK', 'BMRI.JK', 'BBNI.JK', 'TLKM.JK', 'ASII.JK', 
    'ICBP.JK', 'UNVR.JK', 'ADRO.JK', 'GOTO.JK', 'KLBF.JK', 'MDKA.JK',
    'ANTM.JK', 'PTBA.JK', 'PGAS.JK', 'CPIN.JK', 'BRPT.JK', 'INKP.JK',
    'ITMG.JK', 'UNTR.JK', 'SMGR.JK', 'TPIA.JK', 'INCO.JK', 'TINS.JK',
    'AMRT.JK', 'AKRA.JK', 'MEDC.JK', 'INDF.JK', 'BUKA.JK'
  ],
  US_TECH: [
    'AAPL', 'MSFT', 'NVDA', 'GOOGL', 'AMZN', 'TSLA', 'META', 'AMD', 'INTC', 'NFLX', 
    'CRM', 'CSCO', 'ADBE', 'AVGO', 'QCOM', 'TXN', 'ORCL', 'IBM', 'UBER', 'ABNB',
    'PLTR', 'SPOT', 'SHOP', 'SNAP', 'PYPL', 'SQ', 'COIN', 'ROKU'
  ],
  CRYPTO: [
    'BTC-USD', 'ETH-USD', 'SOL-USD', 'BNB-USD', 'XRP-USD', 'ADA-USD', 'DOGE-USD'
  ]
};

// --- KOMPONEN LOGO SAHAM ---
const StockLogo = ({ symbol, name }) => {
  const [error, setError] = useState(false);
  const cleanSymbol = symbol.split('.')[0]; 
  const logoUrl = `https://assets.parqet.com/logos/symbol/${cleanSymbol}?format=png`;

  if (error) {
    return (
      <div className="w-10 h-10 rounded-lg bg-slate-700 text-white flex items-center justify-center font-bold text-xs shadow-md border border-slate-600">
        {symbol.substring(0, 2)}
      </div>
    );
  }

  return (
    <img 
      src={logoUrl} 
      alt={symbol}
      className="w-10 h-10 rounded-lg object-contain bg-white p-1 shadow-md"
      onError={() => setError(true)}
    />
  );
};

// --- KOMPONEN DETAIL & CHART (REUSABLE) ---
// Digunakan di Modal (Mobile) dan Sidebar (Desktop)
const StockDetailPanel = ({ stock, onClose, chartData, chartLoading, chartRange, setChartRange, isMobileMode }) => {
  const formatCurrency = (val, currency) => {
    if (val === undefined || val === null) return '-';
    return new Intl.NumberFormat(currency === 'IDR' ? 'id-ID' : 'en-US', {
      style: 'currency',
      currency: currency || 'USD',
      minimumFractionDigits: 2
    }).format(val);
  };

  return (
    <div className={`flex flex-col h-full ${isMobileMode ? '' : 'bg-[#1a1d2e] rounded-2xl border border-slate-700 shadow-xl'}`}>
      {/* Header Panel */}
      <div className="p-6 border-b border-slate-700 flex justify-between items-start bg-[#13151f] rounded-t-2xl">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 shrink-0">
             <StockLogo symbol={stock.symbol} />
          </div>
          <div>
             <h2 className="text-2xl font-bold text-white leading-none mb-1">{stock.symbol}</h2>
             <p className="text-slate-400 text-sm line-clamp-1">{stock.longName || stock.shortName}</p>
          </div>
        </div>
        
        {/* Tombol Close hanya muncul jika mode Mobile atau prop onClose diberikan */}
        {onClose && (
          <button onClick={onClose} className="p-2 hover:bg-slate-700 rounded-full text-slate-400 hover:text-white transition-colors">
            <X size={24} />
          </button>
        )}
      </div>

      {/* Content Panel */}
      <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
         {/* Key Stats */}
         <div className="grid grid-cols-2 gap-3 mb-6">
            <div className="bg-slate-800/50 p-3 rounded-xl border border-slate-700">
              <p className="text-slate-500 text-[10px] uppercase mb-1">Price</p>
              <p className="text-lg font-bold text-white">{formatCurrency(stock.regularMarketPrice, stock.currency)}</p>
            </div>
            <div className="bg-slate-800/50 p-3 rounded-xl border border-slate-700">
              <p className="text-slate-500 text-[10px] uppercase mb-1">Volume</p>
              <p className="text-sm font-medium text-white">{stock.regularMarketVolume?.toLocaleString()}</p>
            </div>
            <div className="bg-slate-800/50 p-3 rounded-xl border border-slate-700">
              <p className="text-slate-500 text-[10px] uppercase mb-1">Day High</p>
              <p className="text-sm font-medium text-emerald-400">{formatCurrency(stock.regularMarketDayHigh, stock.currency)}</p>
            </div>
            <div className="bg-slate-800/50 p-3 rounded-xl border border-slate-700">
              <p className="text-slate-500 text-[10px] uppercase mb-1">Day Low</p>
              <p className="text-sm font-medium text-rose-400">{formatCurrency(stock.regularMarketDayLow, stock.currency)}</p>
            </div>
         </div>

         {/* Chart Section */}
         <div className="bg-[#13151f] p-4 rounded-xl border border-slate-700 min-h-[350px]">
            <div className="flex justify-between mb-4 items-center">
               <h3 className="font-bold text-white flex items-center gap-2 text-sm"><Calendar size={16}/> History</h3>
               <div className="flex bg-slate-800 rounded-lg p-1">
                  {['5d', '1mo', '6mo', '1y'].map(range => (
                     <button key={range} onClick={() => setChartRange(range)} className={`px-2 py-1 text-[10px] font-bold rounded-md transition-colors ${chartRange === range ? 'bg-slate-600 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'}`}>
                        {range.toUpperCase()}
                     </button>
                  ))}
               </div>
            </div>
            {chartLoading ? (
               <div className="h-[250px] flex items-center justify-center text-slate-500 gap-2"><Loader2 className="animate-spin" size={20}/> Loading...</div>
            ) : chartData.length > 0 ? (
               <div className="h-[250px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                     <AreaChart data={chartData}>
                        <defs>
                           <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#10B981" stopOpacity={0.3}/>
                              <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                           </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} opacity={0.5} />
                        <XAxis dataKey="date" hide={true} />
                        <YAxis domain={['auto', 'auto']} orientation="right" width={40} tick={{fontSize:10, fill:'#94a3b8'}} stroke="transparent"/>
                        <Tooltip 
                            contentStyle={{backgroundColor:'#1e293b', borderColor:'#334155', color:'#fff', borderRadius:'8px', fontSize:'12px'}} 
                            itemStyle={{color:'#10b981'}}
                            formatter={(value) => [value, 'Price']}
                        />
                        <Area type="monotone" dataKey="price" stroke="#10B981" fill="url(#colorPrice)" strokeWidth={2} />
                     </AreaChart>
                  </ResponsiveContainer>
               </div>
            ) : (
               <div className="h-[250px] flex items-center justify-center text-slate-500 text-sm">No Data Available</div>
            )}
         </div>
      </div>
    </div>
  );
};

export default function StockListPage() {
  // --- STATE ---
  const { user } = useAuth();
  const [activeCategory, setActiveCategory] = useState('watchlist'); 

  // 1. WATCHLIST STATE
  const [watchlist, setWatchlist] = useState([]);
  const [isWatchlistLoaded, setIsWatchlistLoaded] = useState(false); 

  // 2. LOGIC: LOAD WATCHLIST (INIT ONLY)
  useEffect(() => {
    let isMounted = true;
    const loadWatchlist = async () => {
      if (user) {
        try {
          const dbWatchlist = await fetchUserWatchlist(user.id);
          if (isMounted) {
            setWatchlist(Array.isArray(dbWatchlist) ? dbWatchlist : []);
          }
        } catch (e) {
          if (isMounted) setWatchlist([]);
        }
      } else {
        const saved = localStorage.getItem('guest_watchlist');
        if (isMounted) {
          setWatchlist(saved ? JSON.parse(saved) : []);
        }
      }
      if (isMounted) setIsWatchlistLoaded(true);
    };
    loadWatchlist();
    return () => { isMounted = false; };
  }, [user]); 

  // 3. LOGIC: SAVE WATCHLIST
  const handleUpdateWatchlist = async (newWatchlist) => {
    setWatchlist(newWatchlist);
    if (user) {
      try {
        await syncUserWatchlist(user.id, newWatchlist);
      } catch (error) { console.error("Failed sync", error); }
    } else {
      localStorage.setItem('guest_watchlist', JSON.stringify(newWatchlist));
    }
  };

  // 4. Data Saham (Quote)
  const [stocks, setStocks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  
  // 5. Search
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const searchTimeout = useRef(null);

  // 6. Modal/Detail Chart
  const [selectedStock, setSelectedStock] = useState(null);
  const [chartData, setChartData] = useState([]);
  const [chartLoading, setChartLoading] = useState(false);
  const [chartRange, setChartRange] = useState('1mo');

  // 7. Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // --- LOGIC: FETCH DATA ---
  const fetchQuotes = useCallback(async (isBackground = false) => {
    let symbolsToFetch = [];
    switch (activeCategory) {
      case 'watchlist': symbolsToFetch = watchlist; break;
      case 'indo': symbolsToFetch = PRESETS.INDO; break;
      case 'us': symbolsToFetch = PRESETS.US_TECH; break;
      case 'gainers':
      case 'losers': symbolsToFetch = [...new Set([...PRESETS.INDO, ...PRESETS.US_TECH, ...PRESETS.CRYPTO])]; break;
      default: symbolsToFetch = [];
    }

    if (symbolsToFetch.length === 0) {
      if (activeCategory === 'watchlist') setStocks([]); 
      return;
    }

    if (!isBackground) setLoading(true);
    else setRefreshing(true);

    try {
      let data = await getStockQuotes(symbolsToFetch);
      data = data || [];

      if (activeCategory === 'gainers') {
        data.sort((a, b) => b.regularMarketChangePercent - a.regularMarketChangePercent);
      } else if (activeCategory === 'losers') {
        data.sort((a, b) => a.regularMarketChangePercent - b.regularMarketChangePercent);
      }
      setStocks(data);
    } catch (err) { console.error(err); } 
    finally {
      if (!isBackground) setLoading(false);
      else setRefreshing(false);
    }
  }, [activeCategory, watchlist]);

  useEffect(() => {
    if (activeCategory === 'watchlist' && !isWatchlistLoaded) return;
    setCurrentPage(1);
    fetchQuotes(false);
  }, [fetchQuotes, activeCategory, isWatchlistLoaded]);

  // Auto Refresh
  useEffect(() => {
    const interval = setInterval(() => {
      if (stocks.length > 0) fetchQuotes(true);
    }, 15000); 
    return () => clearInterval(interval);
  }, [fetchQuotes, stocks.length]);

  // Search Logic
  useEffect(() => {
    if (!searchQuery) { setSearchResults([]); return; }
    if (searchTimeout.current) clearTimeout(searchTimeout.current);

    searchTimeout.current = setTimeout(async () => {
      setIsSearching(true);
      try {
        const data = await searchStocks(searchQuery);
        if (data.quotes) {
           const filtered = data.quotes
            .filter(q => (q.quoteType === 'EQUITY' || q.quoteType === 'ETF') && q.symbol)
            .slice(0, 5);
           setSearchResults(filtered);
        }
      } catch (err) { console.error(err); } 
      finally { setIsSearching(false); }
    }, 500);
  }, [searchQuery]);

  const addToWatchlist = (symbol) => {
    if (!watchlist.includes(symbol)) {
      const newList = [...watchlist, symbol];
      handleUpdateWatchlist(newList);
      if (activeCategory !== 'watchlist') setActiveCategory('watchlist');
    }
    setSearchQuery('');
    setSearchResults([]);
  };

  const removeFromWatchlist = (e, symbol) => {
    e.stopPropagation();
    const newList = watchlist.filter(s => s !== symbol);
    handleUpdateWatchlist(newList);
  };

  // --- LOGIC: FETCH CHART DATA ---
  useEffect(() => {
    if (selectedStock) {
      // Only lock body scroll on MOBILE
      if (window.innerWidth < 1024) {
         document.body.style.overflow = 'hidden';
      }

      const fetchChart = async () => {
        setChartLoading(true);
        setChartData([]);
        try {
          const result = await getStockChart(selectedStock.symbol, chartRange);
          if (result && result.timestamp && result.indicators) {
            const timestamps = result.timestamp;
            const prices = result.indicators?.quote?.[0]?.close;
            if (timestamps && prices) {
              const formattedData = timestamps.map((ts, index) => ({
                date: new Date(ts * 1000).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
                price: prices[index] ? parseFloat(prices[index].toFixed(2)) : null,
              })).filter(d => d.price !== null);
              setChartData(formattedData);
            }
          }
        } catch (error) { console.error(error); } 
        finally { setChartLoading(false); }
      };
      fetchChart();
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [selectedStock, chartRange]);

  const formatCurrency = (val, currency) => {
    if (val === undefined || val === null) return '-';
    return new Intl.NumberFormat(currency === 'IDR' ? 'id-ID' : 'en-US', {
      style: 'currency',
      currency: currency || 'USD',
      minimumFractionDigits: 2
    }).format(val);
  };

  // Pagination
  const totalPages = Math.ceil(stocks.length / itemsPerPage);
  const paginatedStocks = stocks.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) setCurrentPage(newPage);
  };

  const categories = [
    { id: 'watchlist', label: 'My Watchlist', icon: BarChart3 },
    { id: 'indo', label: 'Indo Bluechip', icon: Globe },
    { id: 'us', label: 'US Tech', icon: Globe },
    { id: 'gainers', label: 'Top Gainers', icon: ArrowUpRight, color: 'text-emerald-400' },
    { id: 'losers', label: 'Top Losers', icon: ArrowDownRight, color: 'text-rose-400' },
  ];

  return (
    <div className="space-y-6 relative pb-20">
      
      {/* Header & Search */}
      <div className="flex flex-col gap-6">
         <div className="flex flex-col md:flex-row justify-between md:items-end gap-4">
            <div>
              <h2 className="text-2xl font-bold text-white">Market Overview</h2>
              <div className="flex items-center gap-2 text-sm">
                <span className="text-slate-400">Welcome,</span>
                <span className="font-bold text-emerald-400">{user ? (user.user_metadata?.full_name || user.email) : 'Guest'}</span>
                {!user && (
                  <Link to="/login" className="text-xs bg-slate-800 px-2 py-1 rounded text-white hover:bg-slate-700 ml-2">Login to sync</Link>
                )}
              </div>
            </div>
            
            {/* Search Bar */}
            <div className="relative w-full md:w-96 z-20">
                <div className="relative group">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-emerald-500 transition-colors" size={20} />
                  <input 
                    type="text" 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Cari & Tambah ke Watchlist..." 
                    className="w-full bg-[#1a1d2e] border border-slate-700 rounded-xl py-3 pl-12 pr-4 text-white focus:outline-none focus:border-emerald-500 transition-all placeholder:text-slate-600"
                  />
                  {isSearching && (
                    <div className="absolute right-4 top-1/2 -translate-y-1/2"><Loader2 size={18} className="animate-spin text-slate-500" /></div>
                  )}
                </div>

                {/* Dropdown Results */}
                {searchResults.length > 0 && (
                  <div className="absolute top-full left-0 right-0 mt-2 bg-[#1a1d2e] border border-slate-700 rounded-xl shadow-2xl overflow-hidden z-50">
                    <div className="px-4 py-2 bg-slate-800/50 text-[10px] text-slate-400 uppercase font-semibold">Hasil Pencarian</div>
                    {searchResults.map((item) => (
                      <button
                        key={item.symbol}
                        onClick={() => addToWatchlist(item.symbol)}
                        className="w-full text-left px-4 py-3 hover:bg-slate-800 flex justify-between items-center border-b border-slate-800/50 last:border-0 group transition-colors"
                      >
                        <div className="flex items-center gap-3">
                           <div className="p-2 bg-slate-800 rounded-lg text-slate-400"><Search size={14} /></div>
                           <div>
                              <span className="font-bold text-white block">{item.symbol}</span>
                              <span className="text-xs text-slate-400">{item.shortname || item.longname}</span>
                           </div>
                        </div>
                        <Plus size={18} className="text-emerald-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </button>
                    ))}
                  </div>
                )}
            </div>
         </div>

         {/* --- CATEGORY TABS --- */}
         <div className="flex flex-wrap gap-2 pb-2 border-b border-slate-800">
            {categories.map(cat => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all
                  ${activeCategory === cat.id 
                    ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shadow-sm' 
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                  }
                `}
              >
                <cat.icon size={16} className={cat.color || ''} />
                {cat.label}
              </button>
            ))}
         </div>
      </div>

      {/* --- MAIN GRID LAYOUT --- */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        
        {/* KOLOM KIRI: TABLE (Desktop: 2/3, Mobile: Full) */}
        <div className="lg:col-span-2 bg-[#1a1d2e] rounded-2xl border border-slate-800 overflow-hidden shadow-lg flex flex-col min-h-[400px]">
          {/* Table Header */}
          <div className="p-6 border-b border-slate-800 flex justify-between items-center bg-[#13151f]">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              {categories.find(c => c.id === activeCategory)?.label}
            </h2>
            
            <div className="flex items-center gap-3">
               {refreshing && (
                  <span className="text-xs text-slate-500 flex items-center gap-1 animate-pulse"><RefreshCw size={12} className="animate-spin" /> Updating...</span>
               )}
               <span className="text-xs text-slate-500 bg-slate-800 px-3 py-1 rounded-full flex items-center gap-2 border border-slate-700">
                  <span className="relative flex h-2 w-2">
                     <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                     <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                  </span>
                  Live
               </span>
            </div>
          </div>
          
          <div className="overflow-x-auto flex-1">
            {loading ? (
               <div className="flex flex-col items-center justify-center h-64 text-slate-500">
                 <Loader2 className="animate-spin mb-3" size={32}/>
                 <p>Memuat data pasar...</p>
               </div>
            ) : stocks.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-64 text-slate-500 bg-slate-800/20 m-4 rounded-xl border border-dashed border-slate-700">
                 {activeCategory === 'watchlist' ? (
                   <>
                     <Search size={48} className="mb-4 opacity-20" />
                     <p className="text-lg font-medium text-slate-400">Watchlist Kosong</p>
                     <p className="text-sm mt-1 text-slate-500">
                       {user ? 'Gunakan pencarian di atas untuk menambahkan saham.' : 'Login untuk menyimpan watchlist Anda secara permanen.'}
                     </p>
                   </>
                 ) : (
                   <p className="text-sm text-slate-500">Tidak ada data untuk kategori ini.</p>
                 )}
              </div>
            ) : (
              <table className="w-full text-left">
                <thead className="bg-[#13151f] text-slate-400 text-xs uppercase tracking-wider font-semibold">
                  <tr>
                    <th className="p-4 pl-6">Ticker</th>
                    <th className="p-4">Price</th>
                    <th className="p-4">Change</th>
                    <th className="p-4 hidden md:table-cell">Volume</th>
                    <th className="p-4 hidden md:table-cell">Market Cap</th>
                    {activeCategory === 'watchlist' && <th className="p-4 text-center pr-6">Action</th>}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {paginatedStocks.map((stock) => {
                    const isPositive = stock.regularMarketChange >= 0;
                    const isSelected = selectedStock?.symbol === stock.symbol;
                    return (
                      <tr 
                        key={stock.symbol} 
                        onClick={() => setSelectedStock(stock)}
                        className={`transition-colors cursor-pointer group 
                          ${isSelected 
                            ? 'bg-emerald-500/10 border-l-2 border-emerald-500' 
                            : 'hover:bg-slate-800/50 border-l-2 border-transparent'}`}
                      >
                        <td className="p-4 pl-6">
                          <div className="flex items-center gap-3">
                            <StockLogo symbol={stock.symbol} name={stock.shortName} />
                            <div>
                              <span className={`font-bold block ${isSelected ? 'text-emerald-400' : 'text-white'}`}>{stock.symbol}</span>
                              <span className="text-xs text-slate-400 block max-w-[150px] truncate">
                                {stock.shortName || stock.longName}
                              </span>
                            </div>
                          </div>
                        </td>
                        <td className="p-4 font-medium text-white">
                          {formatCurrency(stock.regularMarketPrice, stock.currency)}
                        </td>
                        <td className="p-4">
                          <div className={`flex flex-col items-start ${isPositive ? 'text-emerald-400' : 'text-rose-400'}`}>
                             <span className="font-medium flex items-center gap-1">
                                {isPositive ? <TrendingUp size={14}/> : <TrendingDown size={14}/>}
                                {Math.abs(stock.regularMarketChangePercent).toFixed(2)}%
                             </span>
                             <span className="text-xs opacity-70">
                                {stock.regularMarketChange > 0 ? '+' : ''}{stock.regularMarketChange?.toFixed(2)}
                             </span>
                          </div>
                        </td>
                        <td className="p-4 text-slate-400 text-sm hidden md:table-cell">
                          {(stock.regularMarketVolume / 1000000).toFixed(1)}M
                        </td>
                        <td className="p-4 text-slate-400 text-sm hidden md:table-cell">
                          {stock.marketCap ? (stock.marketCap / 1000000000).toFixed(1) + 'B' : '-'}
                        </td>
                        
                        {activeCategory === 'watchlist' && (
                          <td className="p-4 text-center pr-6">
                            <button 
                              onClick={(e) => removeFromWatchlist(e, stock.symbol)}
                              className="p-2 hover:bg-rose-500/20 text-slate-500 hover:text-rose-500 rounded-lg transition-colors"
                              title="Hapus dari Watchlist"
                            >
                                <Trash2 size={18} />
                            </button>
                          </td>
                        )}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>

          {/* Pagination Controls */}
          {stocks.length > itemsPerPage && (
            <div className="p-4 border-t border-slate-800 bg-[#13151f] flex justify-between items-center">
               <span className="text-xs text-slate-500 hidden sm:block">
                 Showing {Math.min((currentPage - 1) * itemsPerPage + 1, stocks.length)} to {Math.min(currentPage * itemsPerPage, stocks.length)} of {stocks.length}
               </span>
               <div className="flex gap-2 ml-auto sm:ml-0">
                  <button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1} className="p-2 rounded-lg bg-slate-800 text-slate-400 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
                    <ChevronLeft size={16} />
                  </button>
                  <div className="px-4 py-2 bg-slate-800 rounded-lg text-xs font-bold text-white flex items-center border border-slate-700">
                     {currentPage} / {totalPages}
                  </div>
                  <button onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages} className="p-2 rounded-lg bg-slate-800 text-slate-400 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
                    <ChevronRight size={16} />
                  </button>
               </div>
            </div>
          )}
        </div>

        {/* KOLOM KANAN: DETAIL SAHAM (DESKTOP ONLY) */}
        {/* Hidden on Mobile, Block on Large Screens */}
        <div className="hidden lg:block lg:col-span-1">
           {selectedStock ? (
             <div className="sticky top-6">
                <StockDetailPanel 
                   stock={selectedStock}
                   chartData={chartData}
                   chartLoading={chartLoading}
                   chartRange={chartRange}
                   setChartRange={setChartRange}
                   isMobileMode={false}
                   onClose={() => setSelectedStock(null)} // Opsional: Tombol close di desktop
                />
             </div>
           ) : (
             <div className="sticky top-6 bg-[#1a1d2e] rounded-2xl border border-dashed border-slate-700 p-8 flex flex-col items-center justify-center text-center h-[500px]">
                <div className="p-4 bg-slate-800/50 rounded-full mb-4 text-slate-500">
                   <MousePointer2 size={32} />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">Pilih Saham</h3>
                <p className="text-sm text-slate-400">
                  Klik salah satu saham di daftar sebelah kiri untuk melihat detail harga, statistik, dan grafik historisnya.
                </p>
             </div>
           )}
        </div>
      </div>

      {/* --- MODAL DETAIL STOCK (MOBILE ONLY) --- */}
      {/* Visible only on Mobile (lg:hidden) */}
      {selectedStock && (
        <div 
          className="lg:hidden fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in duration-200"
          onClick={() => setSelectedStock(null)}
        >
          <div 
            className="bg-[#1a1d2e] w-full max-w-lg rounded-t-2xl sm:rounded-2xl border-t sm:border border-slate-700 shadow-2xl overflow-hidden flex flex-col h-[85vh] sm:h-auto sm:max-h-[90vh]"
            onClick={(e) => e.stopPropagation()}
          >
             <StockDetailPanel 
                stock={selectedStock}
                onClose={() => setSelectedStock(null)}
                chartData={chartData}
                chartLoading={chartLoading}
                chartRange={chartRange}
                setChartRange={setChartRange}
                isMobileMode={true}
             />
          </div>
        </div>
      )}
    </div>
  );
}