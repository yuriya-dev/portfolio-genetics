import React from 'react';
import { Cpu, History } from 'lucide-react';
import logo from '../assets/logo.png';

const Header = ({ onOpenHistory }) => {
  return (
    <header className="border-b border-slate-800 bg-slate-900/50 backdrop-blur-md sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="w-12 h-12">
            <img src={logo} alt="logo" />
          </div>
          <h1 className="text-xl font-bold tracking-tight text-white">
            Genetic<span className="text-emerald-400">Portfolio</span>
          </h1>
        </div>
        <div className="text-xs text-slate-500 font-mono">v1.0 Beta</div>
        <button 
          onClick={onOpenHistory}
          className="flex items-center gap-2 text-sm font-medium text-slate-400 hover:text-white transition bg-slate-800 hover:bg-slate-700 px-4 py-2 rounded-lg border border-slate-700"
        >
          <History size={18} />
          <span>Riwayat</span>
        </button>
      </div>
    </header>
  );
};

export default Header;