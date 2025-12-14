import React from 'react';
import { 
  PieChart, Pie, Cell, Tooltip, ResponsiveContainer, 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, 
  ScatterChart, Scatter, ZAxis 
} from 'recharts';
import { TrendingUp, AlertTriangle, Activity, Wallet, DollarSign } from 'lucide-react';

const COLORS = ['#10B981', '#3B82F6', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899'];

const ResultsDashboard = ({ data }) => {
  if (!data) return null;

  const { metrics, composition, history, efficient_frontier, investmentBalance } = data;

  // Format currency
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  // Calculate allocation amounts
  const compositionWithAmount = composition.map(item => ({
    ...item,
    amount: investmentBalance ? item.weight * investmentBalance : 0
  }));

  // Format data history untuk grafik
  const historyData = history.generation.map((gen, i) => ({
    gen,
    best: history.best_fitness[i],
    avg: history.avg_fitness[i]
  }));

  return (
    <div className="space-y-6 animate-fade-in">
      
      {/* Investment Summary Card */}
      {investmentBalance && (
        <div className="bg-linear-to-br from-emerald-500/10 to-blue-500/10 p-6 rounded-2xl border border-emerald-500/20 shadow-lg">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-emerald-500/20 rounded-xl">
              <Wallet size={24} className="text-emerald-400" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider">Total Dana Investasi</h3>
              <p className="text-3xl font-bold text-white">{formatCurrency(investmentBalance)}</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4 mt-4 pt-4 border-t border-slate-700/50">
            <div>
              <p className="text-xs text-slate-400 mb-1">Estimasi Return Tahunan</p>
              <p className="text-xl font-bold text-emerald-400">
                {formatCurrency(investmentBalance * metrics.expected_return)}
              </p>
            </div>
            <div>
              <p className="text-xs text-slate-400 mb-1">Return Rate</p>
              <p className="text-xl font-bold text-emerald-400">
                {(metrics.expected_return * 100).toFixed(2)}%
              </p>
            </div>
          </div>
        </div>
      )}

      {/* KPI CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-slate-800 p-5 rounded-xl border border-slate-700 shadow-lg">
          <div className="flex items-center space-x-3 text-emerald-400 mb-2">
            <TrendingUp size={24} />
            <h3 className="font-bold text-lg">Expected Return</h3>
          </div>
          <p className="text-3xl font-bold text-white">
            {(metrics.expected_return * 100).toFixed(2)}%
            <span className="text-sm text-slate-400 font-normal ml-2">/ tahun</span>
          </p>
        </div>

        <div className="bg-slate-800 p-5 rounded-xl border border-slate-700 shadow-lg">
          <div className="flex items-center space-x-3 text-rose-400 mb-2">
            <AlertTriangle size={24} />
            <h3 className="font-bold text-lg">Risiko (Std Dev)</h3>
          </div>
          <p className="text-3xl font-bold text-white">
            {(metrics.risk * 100).toFixed(2)}%
          </p>
        </div>

        <div className="bg-slate-800 p-5 rounded-xl border border-slate-700 shadow-lg">
          <div className="flex items-center space-x-3 text-blue-400 mb-2">
            <Activity size={24} />
            <h3 className="font-bold text-lg">Fitness Score</h3>
          </div>
          <p className="text-3xl font-bold text-white">
            {metrics.fitness.toFixed(4)}
          </p>
        </div>
      </div>

      {/* Allocation Table */}
      {investmentBalance && (
        <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 shadow-lg">
          <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-700">
            <DollarSign size={24} className="text-emerald-400" />
            <h3 className="text-xl font-bold text-white">Alokasi Dana per Aset</h3>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left border-b border-slate-700">
                  <th className="pb-3 text-sm font-semibold text-slate-400 uppercase tracking-wider">Saham</th>
                  <th className="pb-3 text-sm font-semibold text-slate-400 uppercase tracking-wider text-center">Bobot</th>
                  <th className="pb-3 text-sm font-semibold text-slate-400 uppercase tracking-wider text-right">Nominal</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700/50">
                {compositionWithAmount.map((item, index) => (
                  <tr key={item.ticker} className="hover:bg-slate-700/30 transition-colors">
                    <td className="py-4">
                      <div className="flex items-center gap-3">
                        <div 
                          className="w-4 h-4 rounded-full shrink-0" 
                          style={{ backgroundColor: COLORS[index % COLORS.length] }}
                        ></div>
                        <span className="font-bold text-white">{item.ticker}</span>
                      </div>
                    </td>
                    <td className="py-4 text-center">
                      <span className="inline-block bg-slate-700 text-slate-200 px-3 py-1 rounded-lg font-mono font-semibold text-sm">
                        {item.percentage}
                      </span>
                    </td>
                    <td className="py-4 text-right">
                      <span className="text-emerald-400 font-bold text-lg">
                        {formatCurrency(item.amount)}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="border-t-2 border-slate-600">
                  <td className="pt-4 font-bold text-white">TOTAL</td>
                  <td className="pt-4 text-center">
                    <span className="inline-block bg-emerald-500/20 text-emerald-400 px-3 py-1 rounded-lg font-mono font-bold">
                      100%
                    </span>
                  </td>
                  <td className="pt-4 text-right">
                    <span className="text-emerald-400 font-bold text-xl">
                      {formatCurrency(investmentBalance)}
                    </span>
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      )}

      {/* CHARTS SECTION */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Pie Chart - Alokasi */}
        <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 shadow-lg">
          <h3 className="text-xl font-bold text-white mb-6 border-b border-slate-700 pb-2">Alokasi Portofolio Optimal</h3>
          <div className="h-64 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={composition}
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="weight"
                  nameKey="ticker"
                >
                  {composition.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#fff' }}
                  itemStyle={{ color: '#fff' }}
                  formatter={(value) => `${(value * 100).toFixed(2)}%`}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          
          {/* Legend Manual */}
          <div className="mt-4 grid grid-cols-2 gap-2 text-sm">
            {composition.map((item, index) => (
              <div key={item.ticker} className="flex items-center justify-between p-2 bg-slate-700/50 rounded">
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: COLORS[index % COLORS.length] }}></div>
                  <span>{item.ticker}</span>
                </div>
                <span className="font-mono font-bold">{item.percentage}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Area Chart - Evolusi GA */}
        <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 shadow-lg">
          <h3 className="text-xl font-bold text-white mb-6 border-b border-slate-700 pb-2">Evolusi Kecerdasan (GA)</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={historyData}>
                <defs>
                  <linearGradient id="colorBest" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10B981" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="gen" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" />
                <Tooltip contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155' }} />
                <Area type="monotone" dataKey="best" stroke="#10B981" fillOpacity={1} fill="url(#colorBest)" name="Best Fitness" />
                <Area type="monotone" dataKey="avg" stroke="#64748b" fillOpacity={0} fill="transparent" name="Avg Fitness" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <p className="text-xs text-slate-400 mt-4 text-center">
            Grafik menunjukkan bagaimana algoritma menemukan solusi yang lebih baik seiring bertambahnya generasi.
          </p>
        </div>

        {/* Scatter Chart - Efficient Frontier */}
        <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 shadow-lg lg:col-span-2">
          <h3 className="text-xl font-bold text-white mb-2">Efficient Frontier (Empiris)</h3>
          <p className="text-sm text-slate-400 mb-6">Titik Merah adalah Portofolio Optimal hasil Genetika. Titik lain adalah simulasi acak.</p>
          <div className="h-80">
             <ResponsiveContainer width="100%" height="100%">
              <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis type="number" dataKey="risk" name="Risk" unit="" stroke="#94a3b8" label={{ value: 'Risk (Std Dev)', position: 'insideBottom', offset: -10, fill: '#94a3b8' }} />
                <YAxis type="number" dataKey="return" name="Return" unit="" stroke="#94a3b8" label={{ value: 'Return', angle: -90, position: 'insideLeft', fill: '#94a3b8' }} />
                <Tooltip cursor={{ strokeDasharray: '3 3' }} contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155' }} />
                
                {/* Random Samples */}
                <Scatter name="Random" data={efficient_frontier.filter(p => !p.is_optimal)} fill="#3b82f6" fillOpacity={0.4} shape="circle" />
                
                {/* Optimal Portfolio */}
                <Scatter name="Optimal" data={efficient_frontier.filter(p => p.is_optimal)} fill="#ef4444" shape="star" />
              </ScatterChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>
    </div>
  );
};

export default ResultsDashboard;