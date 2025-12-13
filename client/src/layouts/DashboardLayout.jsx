import { Outlet, NavLink, useNavigate, useLocation } from "react-router-dom";
import { useState } from "react";
import { 
  LayoutDashboard, BarChart3, MessageSquare, Settings, LogOut, 
  Menu, X, Search, Bell, ChevronDown, UserCircle
} from "lucide-react";
import ConfirmModal from "../components/ui/ConfirmModal"; // Pastikan path import sesuai
import { useAuth } from "../context/AuthContext"; // Import Context Auth

export default function DashboardLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, signOut } = useAuth(); // Ambil data user & fungsi logout
  
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Menentukan judul halaman berdasarkan path
  const getPageTitle = () => {
    switch(location.pathname) {
      case '/': return 'Portfolio Optimization';
      case '/stocks': return 'Stock Market List';
      case '/chat': return 'Public Discussion';
      default: return 'Dashboard';
    }
  };

  // Fungsi Logout
  const handleLogout = async () => {
    try {
      await signOut();
      navigate('/login');
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  // Fungsi Search Sederhana (Redirect ke halaman Stocks)
  const handleSearch = (e) => {
    if (e.key === 'Enter') {
      // Saat ini kita redirect ke halaman Stock List
      // Nanti bisa dikembangkan untuk memfilter list via URL param
      navigate('/stocks');
    }
  };

  // Helper untuk menampilkan nama user
  const getUserDisplayName = () => {
    if (!user) return "Guest User";
    // Jika ada metadata nama, gunakan itu. Jika tidak, ambil bagian depan email.
    return user.user_metadata?.full_name || user.email?.split('@')[0] || "User";
  };

  const links = [
    { href: "/", label: "Optimization", icon: LayoutDashboard },
    { href: "/stocks", label: "Stock List", icon: BarChart3 },
    { href: "/chat", label: "Public Chat", icon: MessageSquare },
    { href: "/settings", label: "Settings", icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-[#13151f] flex text-slate-200 font-sans selection:bg-emerald-500 selection:text-white">
      
      {/* --- SIDEBAR --- */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-72 bg-[#1a1d2e] border-r border-slate-800 transition-transform duration-300
        flex flex-col
        ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0
      `}>
        {/* Logo */}
        <div className="h-20 flex items-center px-8 border-b border-slate-800">
          <div className="flex items-center gap-2 font-bold text-xl tracking-tight text-white">
            <div className="w-8 h-8 rounded-lg bg-emerald-500 flex items-center justify-center text-slate-900">
              G
            </div>
            Genetic<span className="text-emerald-500">Portfolio</span>
          </div>
          <button onClick={() => setIsMobileMenuOpen(false)} className="md:hidden ml-auto text-slate-400">
            <X size={24} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
          <p className="px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Main Menu</p>
          {links.map((link) => (
            <NavLink
              key={link.href}
              to={link.href}
              onClick={() => setIsMobileMenuOpen(false)}
              className={({ isActive }) => `
                flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group
                ${isActive 
                  ? "bg-emerald-500/10 text-emerald-400 font-medium shadow-[0_0_15px_rgba(16,185,129,0.1)]" 
                  : "text-slate-400 hover:bg-slate-800 hover:text-white"
                }
              `}
            >
              <link.icon size={20} />
              <span>{link.label}</span>
            </NavLink>
          ))}
        </nav>

        {/* User Profile (Bottom Sidebar) */}
        <div className="p-4 border-t border-slate-800">
          <button onClick={() => setShowLogoutModal(true)} className="flex items-center gap-3 w-full p-3 rounded-xl hover:bg-slate-800 transition-colors text-left group">
            <div className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center text-white font-bold overflow-hidden">
              {user ? (
                // Tampilkan inisial jika login
                user.email?.charAt(0).toUpperCase()
              ) : (
                <UserCircle size={24} className="text-slate-400" />
              )}
            </div>
            <div className="flex-1 overflow-hidden">
              <p className="text-sm font-medium text-white truncate">
                {getUserDisplayName()}
              </p>
              <p className="text-xs text-slate-500 truncate group-hover:text-rose-400 transition-colors">
                {user ? 'Sign Out' : 'Login Required'}
              </p>
            </div>
            <LogOut size={18} className="text-slate-500 group-hover:text-rose-400 transition-colors" />
          </button>
        </div>
      </aside>

      {/* --- MAIN CONTENT AREA --- */}
      <div className="flex-1 md:ml-72 flex flex-col min-h-screen">
        
        {/* Top Header */}
        <header className="h-20 bg-[#13151f]/80 backdrop-blur-md sticky top-0 z-40 border-b border-slate-800 flex items-center justify-between px-4 md:px-8">
          
          <div className="flex items-center gap-4">
            <button onClick={() => setIsMobileMenuOpen(true)} className="md:hidden p-2 text-slate-400 hover:text-white">
              <Menu size={24} />
            </button>
            <h1 className="text-xl font-bold text-white hidden md:block">{getPageTitle()}</h1>
          </div>

          {/* Search Bar (Functional) */}
          <div className="flex-1 max-w-xl mx-4 hidden md:block">
            <div className="relative group">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-emerald-500 transition-colors" size={20} />
              <input 
                type="text" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={handleSearch}
                placeholder="Type & Press Enter to find stocks..." 
                className="w-full bg-[#1a1d2e] border border-slate-700 text-slate-200 text-sm rounded-full pl-10 pr-4 py-2.5 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all placeholder:text-slate-600"
              />
            </div>
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-3 md:gap-6">
            <button className="relative p-2 text-slate-400 hover:text-white transition-colors">
              <Bell size={20} />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full border-2 border-[#13151f]"></span>
            </button>
            
            {/* User Profile Header */}
            <div className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity">
              <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center text-xs font-bold text-white">
                 {user ? user.email?.charAt(0).toUpperCase() : <UserCircle size={20}/>}
              </div>
              <span className="text-sm font-medium text-white hidden md:block">
                {getUserDisplayName()}
              </span>
              <ChevronDown size={16} className="text-slate-500 hidden md:block" />
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-4 md:p-8 overflow-x-hidden">
          <Outlet />
        </main>
      </div>

      {/* Logout Confirmation Modal */}
      <ConfirmModal
        isOpen={showLogoutModal}
        onClose={() => setShowLogoutModal(false)}
        onConfirm={handleLogout}
        title="Confirm Logout"
        message="Are you sure you want to log out from your account?"
        variant="danger"
      />
    </div>
  );
}