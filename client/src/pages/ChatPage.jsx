import React, { useState, useEffect, useRef } from 'react';
import { Send, User, Loader2, MessageSquare } from 'lucide-react';
import { supabase } from '../lib/supabaseClient';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';

export default function ChatPage() {
  const { user } = useAuth(); 
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef(null);

  // Data User Saat Ini (untuk input box)
  const myAvatarUrl = user?.user_metadata?.avatar_url;
  const myFullName = user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'Pengguna';

  // --- 1. SCROLL OTOMATIS KE BAWAH ---
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // --- 2. FETCH & SUBSCRIBE REALTIME ---
  useEffect(() => {
    const fetchInitialMessages = async () => {
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .order('created_at', { ascending: true }) 
        .limit(50);
      
      if (error) console.error("Error fetching messages:", error);
      else setMessages(data || []);
      setLoading(false);
    };

    fetchInitialMessages();

    const channel = supabase
      .channel('public-chat')
      .on(
        'postgres_changes', 
        { event: 'INSERT', schema: 'public', table: 'messages' }, 
        (payload) => {
          setMessages((prev) => [...prev, payload.new]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  // --- 3. KIRIM PESAN ---
  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim() || !user) return;

    const messageContent = input.trim();
    setInput(''); 

    try {
      // Masukkan pesan BESERTA data profil saat ini (Snapshot)
      const { error } = await supabase
        .from('messages')
        .insert({
          user_id: user.id,
          email: user.email, 
          full_name: myFullName, // Simpan Nama
          avatar_url: myAvatarUrl, // Simpan Foto
          content: messageContent
        });

      if (error) throw error;
    } catch (err) {
      console.error("Gagal mengirim pesan:", err.message);
      alert("Gagal mengirim pesan. Coba lagi.");
      setInput(messageContent); 
    }
  };

  const formatTime = (isoString) => {
    return new Date(isoString).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const getAvatarColor = (name) => {
    const colors = ['bg-red-500', 'bg-blue-500', 'bg-green-500', 'bg-yellow-500', 'bg-purple-500', 'bg-pink-500'];
    let hash = 0;
    const safeName = name || 'User';
    for (let i = 0; i < safeName.length; i++) hash = safeName.charCodeAt(i) + ((hash << 5) - hash);
    return colors[Math.abs(hash) % colors.length];
  };

  return (
    <div className="flex flex-col h-[calc(100vh-140px)] bg-[#1a1d2e] rounded-2xl border border-slate-800 overflow-hidden shadow-2xl relative">
      
      {/* Chat Header */}
      <div className="p-4 border-b border-slate-800 bg-[#13151f]/95 backdrop-blur flex justify-between items-center z-10">
        <div>
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <MessageSquare size={20} className="text-emerald-500"/> Public Discussion
          </h2>
          <p className="text-xs text-slate-500">Diskusi terbuka seputar saham & investasi.</p>
        </div>
        <div className="flex items-center gap-2">
           <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
           <span className="text-xs text-emerald-400 font-medium">Live</span>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar bg-[#1a1d2e]">
        {loading ? (
          <div className="flex flex-col items-center justify-center h-full text-slate-500 gap-2">
            <Loader2 className="animate-spin" size={32}/>
            <p className="text-sm">Memuat percakapan...</p>
          </div>
        ) : messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-slate-500 opacity-50">
            <MessageSquare size={48} className="mb-2"/>
            <p>Belum ada pesan. Jadilah yang pertama!</p>
          </div>
        ) : (
          messages.map((msg) => {
            const isMe = user && msg.user_id === user.id;
            // Gunakan Nama jika ada, fallback ke bagian depan email
            const displayName = msg.full_name || msg.email?.split('@')[0] || 'User';
            const userAvatar = msg.avatar_url;

            return (
              <div key={msg.id} className={`flex gap-3 max-w-[85%] ${isMe ? 'ml-auto flex-row-reverse' : 'mr-auto flex-row'}`}>
                
                {/* LOGIKA AVATAR: Gambar vs Inisial */}
                {userAvatar ? (
                  <img 
                    src={userAvatar} 
                    alt={displayName} 
                    className="w-8 h-8 rounded-full object-cover shrink-0 shadow-sm border border-slate-700 bg-slate-800"
                  />
                ) : (
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-xs font-bold text-white shadow-sm ${getAvatarColor(displayName)}`}>
                    {displayName.charAt(0).toUpperCase()}
                  </div>
                )}
                
                {/* Bubble */}
                <div className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                  <div className="flex items-baseline gap-2 mb-1">
                    <span className="text-xs font-bold text-slate-300">{displayName}</span>
                    <span className="text-[10px] text-slate-500">{formatTime(msg.created_at)}</span>
                  </div>
                  <div className={`px-4 py-2.5 rounded-2xl text-sm leading-relaxed shadow-sm wrap-break-words max-w-full
                    ${isMe 
                      ? 'bg-emerald-600 text-white rounded-tr-none' 
                      : 'bg-slate-700 text-slate-200 rounded-tl-none border border-slate-600'
                    }
                  `}>
                    {msg.content}
                  </div>
                </div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 border-t border-slate-800 bg-[#13151f]/50">
        {user ? (
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2 px-1">
              <div className="w-6 h-6 rounded-full overflow-hidden border border-slate-700 bg-slate-800">
                {myAvatarUrl ? (
                  <img src={myAvatarUrl} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-slate-500">
                    <User size={14} />
                  </div>
                )}
              </div>
              <span className="text-xs font-medium text-slate-300">
                {myFullName}
              </span>
            </div>
            <form onSubmit={handleSend} className="flex gap-3">
              <input 
                type="text" 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ketik pesan diskusi..." 
                className="flex-1 bg-[#1a1d2e] border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all placeholder:text-slate-600"
              />
              <button 
                type="submit" 
                disabled={!input.trim()}
                className="bg-emerald-500 hover:bg-emerald-600 text-slate-900 p-3 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-emerald-500/20"
              >
                <Send size={20} />
              </button>
            </form>
          </div>
        ) : (
          <div className="flex items-center justify-between bg-slate-800/50 border border-slate-700 rounded-xl p-4">
            <span className="text-sm text-slate-400">Anda harus login untuk ikut berdiskusi.</span>
            <Link to="/login" className="text-sm font-bold text-emerald-400 hover:underline">
              Login Sekarang
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}