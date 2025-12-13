import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabaseClient';
import { User, Camera, Save, Loader2, Mail, AlertCircle, CheckCircle2, UploadCloud } from 'lucide-react';

export default function SettingsPage() {
  const { user } = useAuth();
  
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  
  // State Form
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [avatarUrl, setAvatarUrl] = useState(null);
  
  // State Notifikasi
  const [notification, setNotification] = useState(null);

  // Load data user saat komponen dimuat
  useEffect(() => {
    if (user) {
      setFullName(user.user_metadata?.full_name || '');
      setEmail(user.email || '');
      setAvatarUrl(user.user_metadata?.avatar_url || null);
    }
  }, [user]);

  // Helper Notifikasi
  const showNotification = (type, message) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 3000);
  };

  // --- 1. LOGIKA UPLOAD FOTO ---
  const handleAvatarUpload = async (event) => {
    try {
      setUploading(true);
      
      if (!event.target.files || event.target.files.length === 0) {
        throw new Error('Pilih gambar untuk diupload.');
      }

      const file = event.target.files[0];
      const fileExt = file.name.split('.').pop();
      // Nama file unik: folder user_id / timestamp
      const fileName = `${user.id}/${Date.now()}.${fileExt}`;
      const filePath = `${fileName}`;

      // A. Upload ke Supabase Storage (Bucket 'avatars')
      let { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      // B. Dapatkan Public URL
      const { data } = supabase.storage.from('avatars').getPublicUrl(filePath);
      const publicUrl = data.publicUrl;

      // C. Update Metadata User Auth
      const { error: updateError } = await supabase.auth.updateUser({
        data: { avatar_url: publicUrl }
      });

      if (updateError) throw updateError;

      setAvatarUrl(publicUrl);
      showNotification('success', 'Foto profil berhasil diperbarui!');
      
      // Reload halaman agar perubahan terlihat di Sidebar/Header (Opsional)
      // window.location.reload(); 

    } catch (error) {
      console.error(error);
      showNotification('error', error.message || 'Gagal mengupload gambar.');
    } finally {
      setUploading(false);
    }
  };

  // --- 2. LOGIKA UPDATE PROFIL ---
  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const { error } = await supabase.auth.updateUser({
        data: { full_name: fullName }
      });

      if (error) throw error;
      showNotification('success', 'Informasi profil berhasil disimpan.');
    } catch (error) {
      showNotification('error', error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-20">
      
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-white">Account Settings</h2>
        <p className="text-slate-400 text-sm">Kelola informasi profil dan preferensi akun Anda.</p>
      </div>

      {/* Notification Toast */}
      {notification && (
        <div className={`p-4 rounded-xl flex items-center gap-3 animate-in fade-in slide-in-from-top-4 
          ${notification.type === 'success' ? 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-400' : 'bg-rose-500/10 border border-rose-500/20 text-rose-400'}
        `}>
          {notification.type === 'success' ? <CheckCircle2 size={20} /> : <AlertCircle size={20} />}
          <span className="text-sm font-medium">{notification.message}</span>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* --- KOLOM KIRI: FOTO PROFIL --- */}
        <div className="bg-[#1a1d2e] p-6 rounded-2xl border border-slate-700 shadow-lg h-fit">
          <h3 className="font-bold text-white mb-6">Profile Picture</h3>
          
          <div className="flex flex-col items-center gap-6">
            {/* Avatar Preview */}
            <div className="relative group">
              <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-slate-700 bg-slate-800 shadow-xl">
                {avatarUrl ? (
                  <img src={avatarUrl} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-slate-500">
                    <User size={48} />
                  </div>
                )}
                
                {/* Loading Overlay */}
                {uploading && (
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                    <Loader2 size={32} className="animate-spin text-white" />
                  </div>
                )}
              </div>

              {/* Camera Icon Overlay */}
              <label className="absolute bottom-0 right-0 p-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-full cursor-pointer shadow-lg transition-transform hover:scale-110 active:scale-95">
                <Camera size={18} />
                <input 
                  type="file" 
                  accept="image/*" 
                  onChange={handleAvatarUpload} 
                  disabled={uploading}
                  className="hidden" 
                />
              </label>
            </div>

            <div className="text-center">
              <p className="text-sm text-slate-400">Allowed *.jpeg, *.jpg, *.png</p>
              <p className="text-xs text-slate-500 mt-1">Max size of 3 MB</p>
            </div>
          </div>
        </div>

        {/* --- KOLOM KANAN: FORM DATA DIRI --- */}
        <div className="md:col-span-2 bg-[#1a1d2e] p-6 rounded-2xl border border-slate-700 shadow-lg">
          <h3 className="font-bold text-white mb-6">Personal Information</h3>
          
          <form onSubmit={handleUpdateProfile} className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              {/* Full Name */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-400">Full Name</label>
                <div className="relative">
                  <User size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
                  <input 
                    type="text" 
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Enter your name"
                    className="w-full bg-[#13151f] border border-slate-700 rounded-xl py-3 pl-11 pr-4 text-white focus:outline-none focus:border-emerald-500 transition-all"
                  />
                </div>
              </div>

              {/* Email (Read Only) */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-400">Email Address</label>
                <div className="relative">
                  <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
                  <input 
                    type="email" 
                    value={email}
                    disabled
                    className="w-full bg-[#13151f]/50 border border-slate-800 rounded-xl py-3 pl-11 pr-4 text-slate-500 cursor-not-allowed"
                  />
                </div>
              </div>
            </div>

            {/* Tombol Simpan */}
            <div className="pt-4 border-t border-slate-700 flex justify-end">
              <button 
                type="submit" 
                disabled={loading}
                className="bg-emerald-500 hover:bg-emerald-600 text-slate-900 font-bold px-6 py-3 rounded-xl transition-all shadow-lg shadow-emerald-500/20 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
                {loading ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </form>
        </div>

      </div>
    </div>
  );
}