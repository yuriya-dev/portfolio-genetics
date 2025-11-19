import React from 'react';
import { Cpu } from 'lucide-react';

export const ErrorView = ({ message }) => (
  <div className="bg-rose-500/10 border border-rose-500/50 text-rose-400 p-4 rounded-xl mb-6">
    {message}
  </div>
);

export const EmptyState = () => (
  <div className="h-96 flex flex-col items-center justify-center text-slate-600 border-2 border-dashed border-slate-800 rounded-xl">
    <Cpu size={64} className="mb-4 opacity-20" />
    <p className="text-lg">Tambahkan saham dan mulai optimasi AI</p>
  </div>
);

export const LoadingState = () => (
  <div className="h-96 flex flex-col items-center justify-center space-y-4">
    <div className="w-16 h-16 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
    <p className="text-emerald-400 animate-pulse">Algoritma Genetika sedang mencari kombinasi terbaik...</p>
    <p className="text-xs text-slate-500">Proses ini memakan waktu 5-20 detik tergantung data historis.</p>
  </div>
);