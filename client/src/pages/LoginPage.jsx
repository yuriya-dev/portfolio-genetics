import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { LogIn, UserPlus, Loader2, User, UserCircle } from 'lucide-react'; // Import UserCircle
import { supabase } from '../lib/supabaseClient'; // Import supabase untuk anonymous login

export default function LoginPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const { signIn, signUp } = useAuth();
  const navigate = useNavigate();

  const handleAuth = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      if (isLogin) {
        const { error } = await signIn({ email, password });
        if (error) throw error;
        navigate('/'); 
      } else {
        const { error } = await signUp({ 
          email, 
          password,
          options: {
            data: {
              full_name: fullName, 
            }
          }
        });
        if (error) throw error;
        alert('Cek email Anda untuk verifikasi!');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Fungsi Login Tamu
  const handleGuestLogin = async () => {
    setLoading(true);
    setError('');
    try {
        const randomId = Math.floor(Math.random() * 1000);
        const { error } = await supabase.auth.signInAnonymously({
            options: {
                data: {
                    full_name: `Guest_${randomId}`,
                    avatar_url: `https://ui-avatars.com/api/?name=Guest+${randomId}&background=334155&color=94a3b8`
                }
            }
        });
        
        if (error) throw error;
        navigate('/');
    } catch(err) {
        console.error("Guest login error:", err);
        setError("Gagal masuk sebagai tamu. Pastikan 'Anonymous Sign-ins' diaktifkan di Authentication -> Providers Supabase Anda.");
    } finally {
        setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#13151f] p-4">
      <div className="w-full max-w-md bg-[#1a1d2e] p-8 rounded-2xl border border-slate-700 shadow-2xl">
        <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-emerald-500 mb-4 shadow-lg shadow-emerald-500/20">
                <span className="text-slate-900 font-bold text-2xl">G</span>
            </div>
            <h2 className="text-2xl font-bold text-white">
            {isLogin ? 'Welcome Back' : 'Create Account'}
            </h2>
            <p className="text-slate-400 text-sm mt-2">
                GeneticPortfolio Optimization Platform
            </p>
        </div>
        
        {error && (
          <div className="mb-4 p-3 bg-rose-500/20 border border-rose-500 text-rose-400 rounded-lg text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleAuth} className="space-y-4">
          
          {!isLogin && (
            <div className="animate-in fade-in slide-in-from-top-2">
              <label className="block text-slate-400 text-sm mb-1">Full Name</label>
              <div className="relative">
                <User size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
                <input 
                  type="text" 
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="John Doe"
                  className="w-full bg-[#13151f] border border-slate-700 rounded-xl pl-11 pr-4 py-3 text-white focus:border-emerald-500 outline-none transition-colors"
                  required={!isLogin}
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-slate-400 text-sm mb-1">Email</label>
            <div className="relative">
                <User size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
                <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full bg-[#13151f] border border-slate-700 rounded-xl pl-11 pr-4 py-3 text-white focus:border-emerald-500 outline-none transition-colors"
                required
                />
            </div>
          </div>
          <div>
            <label className="block text-slate-400 text-sm mb-1">Password</label>
            <div className="relative">
                <LogIn size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
                <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-[#13151f] border border-slate-700 rounded-xl pl-11 pr-4 py-3 text-white focus:border-emerald-500 outline-none transition-colors"
                required
                />
            </div>
          </div>
          
          <button 
            disabled={loading}
            className="w-full bg-emerald-500 hover:bg-emerald-600 text-slate-900 font-bold py-3 rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 mt-2"
          >
            {loading ? <Loader2 className="animate-spin" size={20}/> : (isLogin ? <LogIn size={20}/> : <UserPlus size={20}/>)}
            {isLogin ? 'Sign In' : 'Create Account'}
          </button>
        </form>

        {/* Divider */}
        <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-700"></div>
            </div>
            <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-[#1a1d2e] text-slate-500">Or continue with</span>
            </div>
        </div>

        {/* Guest Button */}
        <button
            type="button"
            onClick={handleGuestLogin}
            disabled={loading}
            className="w-full bg-slate-700 hover:bg-slate-600 text-white font-medium py-3 rounded-xl transition-all flex items-center justify-center gap-2 border border-slate-600"
        >
            {loading ? <Loader2 className="animate-spin" size={20}/> : <UserCircle size={20} />}
            Masuk sebagai Tamu
        </button>

        <div className="mt-6 text-center text-sm text-slate-400">
          {isLogin ? "Don't have an account? " : "Already have an account? "}
          <button 
            onClick={() => setIsLogin(!isLogin)}
            className="text-emerald-400 hover:underline font-medium"
          >
            {isLogin ? 'Sign Up' : 'Sign In'}
          </button>
        </div>
      </div>
    </div>
  );
}