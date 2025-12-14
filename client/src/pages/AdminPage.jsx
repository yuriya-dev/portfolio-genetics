import React, { useState, useEffect, useRef } from 'react';
import { 
  Bell, 
  Menu, 
  X, 
  Home, 
  Users, 
  Settings, 
  BarChart2, 
  FileText, 
  LogOut,
  ChevronDown,
  User,
  CheckCircle,
  AlertCircle
} from 'lucide-react';

// --- Mock Data ---
const mockNotifications = [
  { id: 1, title: 'Pesanan Baru', message: 'Pesanan #1029 baru saja masuk.', time: '5 menit lalu', type: 'success' },
  { id: 2, title: 'Peringatan Server', message: 'Penggunaan CPU server tinggi.', time: '1 jam lalu', type: 'alert' },
  { id: 3, title: 'Pengguna Baru', message: 'Siti mendaftar sebagai member.', time: '2 jam lalu', type: 'info' },
];

const mockStats = [
  { title: 'Total Pengguna', value: '1,240', change: '+12%', icon: Users, color: 'bg-blue-500' },
  { title: 'Pendapatan', value: 'Rp 15.4jt', change: '+8%', icon: BarChart2, color: 'bg-green-500' },
  { title: 'Proyek Aktif', value: '12', change: '-2%', icon: FileText, color: 'bg-purple-500' },
];

const recentActivities = [
  { user: 'Budi Santoso', action: 'Memperbarui profil', date: '14 Des 2025' },
  { user: 'Ani Wijaya', action: 'Mengunggah dokumen laporan', date: '14 Des 2025' },
  { user: 'Admin Utama', action: 'Menyetujui pembayaran #992', date: '13 Des 2025' },
  { user: 'Rina Kurnia', action: 'Login dari perangkat baru', date: '13 Des 2025' },
];

export default function DashboardLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  
  // Ref untuk mendeteksi klik di luar elemen dropdown
  const notificationRef = useRef(null);
  const profileRef = useRef(null);

  // Menutup dropdown jika klik di luar
  useEffect(() => {
    function handleClickOutside(event) {
      if (notificationRef.current && !notificationRef.current.contains(event.target)) {
        setIsNotificationOpen(false);
      }
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  return (
    <div className="flex h-screen bg-gray-100 font-sans overflow-hidden">
      
      {/* --- Sidebar (Desktop & Mobile) --- */}
      <aside 
        className={`
          fixed inset-y-0 left-0 z-50 w-64 bg-slate-900 text-white transition-transform duration-300 ease-in-out
          ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
          md:relative md:translate-x-0
        `}
      >
        <div className="flex items-center justify-between p-4 h-16 bg-slate-800">
          <h1 className="text-xl font-bold tracking-wider text-blue-400">ADMIN PANEL</h1>
          <button onClick={toggleSidebar} className="md:hidden text-gray-400 hover:text-white">
            <X size={24} />
          </button>
        </div>

        <nav className="mt-6 px-4 space-y-2">
          <NavItem icon={Home} label="Dashboard" active />
          <NavItem icon={Users} label="Pengguna" />
          <NavItem icon={BarChart2} label="Analitik" />
          <NavItem icon={FileText} label="Laporan" />
          <div className="pt-6 pb-2">
            <p className="text-xs uppercase text-gray-500 font-semibold tracking-wider">Pengaturan</p>
          </div>
          <NavItem icon={Settings} label="Konfigurasi" />
          <NavItem icon={LogOut} label="Keluar" />
        </nav>
      </aside>

      {/* --- Overlay untuk Mobile Sidebar --- */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black bg-opacity-50 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        ></div>
      )}

      {/* --- Main Content Wrapper --- */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        
        {/* --- Header / Topbar --- */}
        <header className="bg-white shadow-sm z-20 h-16 flex items-center justify-between px-6">
          <div className="flex items-center gap-4">
            <button 
              onClick={toggleSidebar} 
              className="p-2 rounded-md text-gray-600 hover:bg-gray-100 md:hidden"
            >
              <Menu size={24} />
            </button>
            <h2 className="text-xl font-semibold text-gray-800 hidden sm:block">Dashboard Overview</h2>
          </div>

          {/* Bagian Kanan Header: Notifikasi & Profil (Pencarian Dihapus) */}
          <div className="flex items-center gap-4">
            
            {/* Tombol Notifikasi */}
            <div className="relative" ref={notificationRef}>
              <button 
                onClick={() => setIsNotificationOpen(!isNotificationOpen)}
                className="p-2 rounded-full text-gray-500 hover:bg-gray-100 hover:text-blue-600 transition-colors relative"
              >
                <Bell size={20} />
                {/* Badge Notifikasi */}
                <span className="absolute top-1 right-1 h-2.5 w-2.5 bg-red-500 rounded-full border-2 border-white"></span>
              </button>

              {/* Dropdown Notifikasi */}
              {isNotificationOpen && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-100 py-2 animate-in fade-in slide-in-from-top-2 duration-200">
                  <div className="px-4 py-2 border-b border-gray-100 flex justify-between items-center">
                    <span className="font-semibold text-gray-800">Notifikasi</span>
                    <span className="text-xs text-blue-500 cursor-pointer hover:underline">Tandai semua</span>
                  </div>
                  <div className="max-h-64 overflow-y-auto">
                    {mockNotifications.map((notif) => (
                      <div key={notif.id} className="px-4 py-3 hover:bg-gray-50 cursor-pointer flex gap-3 border-b border-gray-50 last:border-0">
                        <div className={`mt-1 shrink-0 w-2 h-2 rounded-full ${notif.type === 'alert' ? 'bg-red-500' : 'bg-blue-500'}`}></div>
                        <div>
                          <p className="text-sm font-medium text-gray-800">{notif.title}</p>
                          <p className="text-xs text-gray-500 mt-1">{notif.message}</p>
                          <p className="text-[10px] text-gray-400 mt-1">{notif.time}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="px-4 py-2 border-t border-gray-100 text-center">
                    <button className="text-xs text-blue-600 font-medium hover:text-blue-800">Lihat Semua</button>
                  </div>
                </div>
              )}
            </div>

            {/* Profil User */}
            <div className="relative" ref={profileRef}>
              <button 
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="flex items-center gap-2 hover:bg-gray-50 p-1.5 rounded-lg transition-colors border border-transparent hover:border-gray-200"
              >
                <div className="h-8 w-8 rounded-full bg-slate-700 flex items-center justify-center text-white font-bold text-sm">
                  AD
                </div>
                <div className="hidden md:block text-left">
                  <p className="text-sm font-medium text-gray-700">Admin</p>
                </div>
                <ChevronDown size={16} className="text-gray-400 hidden md:block" />
              </button>
              
              {/* Dropdown Profil */}
              {isProfileOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-100 py-1">
                  <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 items-center gap-2">
                    <User size={16} /> Profil Saya
                  </a>
                  <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 items-center gap-2">
                    <Settings size={16} /> Pengaturan
                  </a>
                  <div className="border-t border-gray-100 my-1"></div>
                  <a href="#" className="block px-4 py-2 text-sm text-red-600 hover:bg-red-50 items-center gap-2">
                    <LogOut size={16} /> Keluar
                  </a>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* --- Main Content Area --- */}
        <main className="flex-1 overflow-y-auto bg-gray-50 p-6">
          
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {mockStats.map((stat, index) => (
              <div key={index} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500 font-medium">{stat.title}</p>
                    <h3 className="text-2xl font-bold text-gray-800 mt-1">{stat.value}</h3>
                  </div>
                  <div className={`p-3 rounded-lg text-white ${stat.color}`}>
                    <stat.icon size={24} />
                  </div>
                </div>
                <div className="mt-4 flex items-center text-sm">
                  <span className={stat.change.startsWith('+') ? 'text-green-500 font-medium' : 'text-red-500 font-medium'}>
                    {stat.change}
                  </span>
                  <span className="text-gray-400 ml-2">dari bulan lalu</span>
                </div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Recent Activity */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold text-gray-800">Aktivitas Terbaru</h3>
                <button className="text-sm text-blue-600 hover:text-blue-800">Lihat Semua</button>
              </div>
              <div className="space-y-4">
                {recentActivities.map((activity, idx) => (
                  <div key={idx} className="flex items-start gap-4 p-3 hover:bg-gray-50 rounded-lg transition-colors">
                    <div className="mt-1">
                      <CheckCircle size={18} className="text-green-500" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-800">{activity.user}</p>
                      <p className="text-sm text-gray-600">{activity.action}</p>
                      <p className="text-xs text-gray-400 mt-1">{activity.date}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Actions / System Status */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h3 className="text-lg font-bold text-gray-800 mb-6">Status Sistem</h3>
              <div className="space-y-6">
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-600">Kapasitas Server</span>
                    <span className="font-semibold text-gray-800">78%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: '78%' }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-600">Penggunaan Memori</span>
                    <span className="font-semibold text-gray-800">45%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div className="bg-purple-500 h-2.5 rounded-full" style={{ width: '45%' }}></div>
                  </div>
                </div>
                
                <div className="pt-4 border-t border-gray-100 mt-4">
                   <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 flex gap-3">
                     <AlertCircle className="text-yellow-600 shrink-0" size={20} />
                     <div>
                       <h4 className="text-sm font-bold text-yellow-800">Perhatian Diperlukan</h4>
                       <p className="text-xs text-yellow-700 mt-1">Sertifikat SSL akan kadaluarsa dalam 3 hari. Segera perbarui.</p>
                     </div>
                   </div>
                </div>
              </div>
            </div>
          </div>
          
        </main>
      </div>
    </div>
  );
}

// Komponen Helper untuk Navigasi Sidebar
function NavItem({ icon: Icon, label, active = false }) {
  return (
    <a 
      href="#" 
      className={`
        flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200
        ${active 
          ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30' 
          : 'text-gray-300 hover:bg-slate-700 hover:text-white'
        }
      `}
    >
      <Icon size={20} />
      <span className="font-medium text-sm">{label}</span>
    </a>
  );
}