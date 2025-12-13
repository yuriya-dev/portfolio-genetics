import React, { useState } from 'react';
import { Send, User } from 'lucide-react';

export default function ChatPage() {
  const [messages, setMessages] = useState([
    { id: 1, user: 'System', text: 'Welcome to the public discussion! Discuss stock trends here.', time: '10:00 AM', isSystem: true },
    { id: 2, user: 'Investor_01', text: 'Does anyone have a good setup for BBCA today?', time: '10:05 AM', isMe: false },
    { id: 3, user: 'You', text: 'I think it is still bullish based on the GA results.', time: '10:07 AM', isMe: true },
  ]);
  const [input, setInput] = useState('');

  const handleSend = (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    setMessages([...messages, { 
      id: Date.now(), 
      user: 'You', 
      text: input, 
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), 
      isMe: true 
    }]);
    setInput('');
  };

  return (
    <div className="flex flex-col h-[calc(100vh-140px)] bg-[#1a1d2e] rounded-2xl border border-slate-800 overflow-hidden">
      {/* Chat Header */}
      <div className="p-4 border-b border-slate-800 bg-[#13151f]/50 flex justify-between items-center">
        <div>
          <h2 className="text-lg font-bold text-white">Public Discussion</h2>
          <p className="text-xs text-slate-500">124 Members Online</p>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.isSystem ? 'justify-center' : msg.isMe ? 'justify-end' : 'justify-start'}`}>
            {msg.isSystem ? (
              <span className="text-xs text-slate-500 bg-slate-800/50 px-3 py-1 rounded-full">{msg.text}</span>
            ) : (
              <div className={`flex gap-3 max-w-[80%] ${msg.isMe ? 'flex-row-reverse' : 'flex-row'}`}>
                <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center shrink-0">
                  <User size={14} className="text-slate-300" />
                </div>
                <div>
                  <div className={`p-3 rounded-2xl text-sm ${msg.isMe ? 'bg-emerald-600 text-white rounded-tr-none' : 'bg-slate-700 text-slate-200 rounded-tl-none'}`}>
                    {msg.text}
                  </div>
                  <span className={`text-[10px] text-slate-500 mt-1 block ${msg.isMe ? 'text-right' : 'text-left'}`}>{msg.time}</span>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Input Area */}
      <form onSubmit={handleSend} className="p-4 border-t border-slate-800 bg-[#13151f]/50 flex gap-3">
        <input 
          type="text" 
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your message..." 
          className="flex-1 bg-[#1a1d2e] border border-slate-700 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-emerald-500 transition-colors"
        />
        <button type="submit" className="bg-emerald-500 hover:bg-emerald-600 text-slate-900 p-2.5 rounded-xl transition-colors">
          <Send size={20} />
        </button>
      </form>
    </div>
  );
}