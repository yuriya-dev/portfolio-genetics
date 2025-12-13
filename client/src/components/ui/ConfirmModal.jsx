import React, { useEffect, useState } from 'react';
import { X, AlertTriangle, CheckCircle, Info, ShieldAlert } from 'lucide-react';

const ConfirmModal = ({ isOpen, onClose, onConfirm, title, message, variant = 'info' }) => {
  const [isVisible, setIsVisible] = useState(false);

  // Animasi mount/unmount yang halus
  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
      // Prevent body scroll saat modal terbuka
      document.body.style.overflow = 'hidden';
    } else {
      const timer = setTimeout(() => setIsVisible(false), 300); // Tunggu animasi selesai
      document.body.style.overflow = 'unset';
      return () => clearTimeout(timer);
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [isOpen]);

  if (!isVisible && !isOpen) return null;

  // Konfigurasi tema berdasarkan variant
  const themes = {
    danger: {
      icon: ShieldAlert,
      color: 'text-rose-500',
      bgColor: 'bg-rose-500/10',
      borderColor: 'border-rose-500/20',
      btnColor: 'bg-rose-500 hover:bg-rose-600 text-white shadow-rose-500/20',
      glow: 'bg-rose-500/20'
    },
    info: {
      icon: Info,
      color: 'text-blue-500',
      bgColor: 'bg-blue-500/10',
      borderColor: 'border-blue-500/20',
      btnColor: 'bg-blue-500 hover:bg-blue-600 text-white shadow-blue-500/20',
      glow: 'bg-blue-500/20'
    },
    success: {
      icon: CheckCircle,
      color: 'text-emerald-500',
      bgColor: 'bg-emerald-500/10',
      borderColor: 'border-emerald-500/20',
      btnColor: 'bg-emerald-500 hover:bg-emerald-600 text-slate-900 shadow-emerald-500/20',
      glow: 'bg-emerald-500/20'
    }
  };

  const theme = themes[variant] || themes.info;
  const Icon = theme.icon;

  return (
    <div className={`fixed inset-0 z-100 flex items-center justify-center p-4 transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0'}`}>
      
      {/* Backdrop dengan Blur */}
      <div 
        className="absolute inset-0 bg-[#0f111a]/80 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal Container */}
      <div className={`
        relative w-full max-w-sm bg-[#1a1d2e] border border-slate-700/50 rounded-2xl shadow-2xl 
        transform transition-all duration-300 cubic-bezier(0.34, 1.56, 0.64, 1)
        ${isOpen ? 'scale-100 translate-y-0' : 'scale-95 translate-y-4'}
        overflow-hidden
      `}>
        
        {/* Dekorasi Glow Latar Belakang */}
        <div className={`absolute -top-10 -right-10 w-40 h-40 ${theme.glow} rounded-full blur-[60px] opacity-40`} />
        
        <div className="relative z-10 p-6">
          <div className="flex gap-4">
            {/* Icon Wrapper */}
            <div className={`shrink-0 w-12 h-12 rounded-xl ${theme.bgColor} ${theme.borderColor} border flex items-center justify-center`}>
              <Icon className={theme.color} size={24} strokeWidth={2.5} />
            </div>

            {/* Text Content */}
            <div className="flex-1 pt-1">
              <h3 className="text-lg font-bold text-white leading-tight mb-2">{title}</h3>
              <p className="text-slate-400 text-sm leading-relaxed">{message}</p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 mt-8 justify-end">
            <button 
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl text-sm font-medium text-slate-400 hover:text-white hover:bg-slate-800 transition-all active:scale-95"
            >
              Batalkan
            </button>
            <button 
              onClick={() => {
                if (onConfirm) onConfirm();
                onClose();
              }}
              className={`px-6 py-2.5 rounded-xl text-sm font-bold shadow-lg transition-all active:scale-95 flex items-center gap-2 ${theme.btnColor}`}
            >
              Ya, Lanjutkan
            </button>
          </div>
        </div>

        {/* Close Button Absolute (Fixed z-index) */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-600 hover:text-slate-300 transition-colors z-50"
        >
          <X size={18} />
        </button>
      </div>
    </div>
  );
};

export default ConfirmModal;