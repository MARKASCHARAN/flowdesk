import React, { useState, useEffect } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, Users, Ticket, BarChart3, Receipt, Search, Bell, Settings, Menu, X, Hexagon, FileText, Blocks
} from 'lucide-react';
import { useAuthStore } from '../../store/useAuthStore';

const MainLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user, fetchProfile } = useAuthStore();

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);
  
  // Minimalist Sidebar Nav
  const navLinks = [
    { name: 'Dashboard', path: '/app', icon: <LayoutDashboard size={20} strokeWidth={1.5} /> },
    { name: 'CRM', path: '/app/crm', icon: <Users size={20} strokeWidth={1.5} /> },
    { name: 'Tickets', path: '/app/tickets', icon: <Ticket size={20} strokeWidth={1.5} /> },
    { name: 'Analytics', path: '/app/analytics', icon: <BarChart3 size={20} strokeWidth={1.5} /> },
    { name: 'Reports', path: '/app/reports', icon: <FileText size={20} strokeWidth={1.5} /> },
    { name: 'Settings', path: '/app/settings', icon: <Settings size={20} strokeWidth={1.5} /> },
  ];

  const NavItem = ({ to, icon, name }) => {
    const isActive = location.pathname === to || (to !== '/app' && location.pathname.startsWith(to));
    return (
      <Link
        to={to}
        className={`group relative w-full flex justify-center py-4 transition-colors ${
          isActive ? 'bg-[#F4F6F8] text-black' : 'text-[#64748B] hover:bg-gray-50 hover:text-black'
        }`}
      >
        {isActive && (
          <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-black" />
        )}
        {icon}
        
        {/* Tooltip */}
        <div className="absolute left-full ml-2 px-2.5 py-1.5 bg-gray-900 text-white text-[12px] font-bold rounded-md opacity-0 group-hover:opacity-100 pointer-events-none transition-all duration-200 shadow-sm whitespace-nowrap z-50 transform translate-x-[-10px] group-hover:translate-x-0 flex items-center">
          <div className="absolute left-[-4px] top-1/2 -translate-y-1/2 w-2 h-2 bg-gray-900 rotate-45" />
          {name}
        </div>
      </Link>
    );
  };

  return (
    <div className="flex h-screen bg-[#D0D6E1] font-sans selection:bg-black/10 overflow-hidden">
      
      {/* --- DESKTOP SIDEBAR --- */}
      <aside className="hidden md:flex flex-col w-[80px] bg-white h-full shadow-[2px_0_10px_rgba(0,0,0,0.02)] z-50 shrink-0">
        
        {/* Top Logo */}
        <div className="pt-8 pb-10 flex flex-col items-center">
          <Link to="/app" className="flex flex-col items-center group">
            <span className="text-[28px] font-bold text-black leading-none group-hover:scale-105 transition-transform">F</span>
            <span className="text-[9px] font-bold tracking-[0.1em] text-black uppercase mt-1">Flow</span>
          </Link>
        </div>
        
        {/* Nav Links */}
        <nav className="flex flex-col w-full">
          {navLinks.map((link) => (
            <NavItem key={link.path} to={link.path} icon={link.icon} name={link.name} />
          ))}
        </nav>

        <div className="flex-1" />

        {/* Bottom Actions */}
        <div className="flex flex-col items-center gap-6 pb-8 w-full">
          <Link to="/app/search" className="group relative text-[#64748B] hover:text-black transition-colors">
            <Search size={20} strokeWidth={1.5} />
            <div className="absolute left-full ml-6 px-2.5 py-1.5 bg-gray-900 text-white text-[12px] font-bold rounded-md opacity-0 group-hover:opacity-100 pointer-events-none transition-all duration-200 shadow-sm whitespace-nowrap z-50 transform translate-x-[-10px] group-hover:translate-x-0 flex items-center">
              <div className="absolute left-[-4px] top-1/2 -translate-y-1/2 w-2 h-2 bg-gray-900 rotate-45" />
              Search
            </div>
          </Link>
          <Link to="/app/notifications" className="group relative text-[#64748B] hover:text-black transition-colors">
            <Bell size={20} strokeWidth={1.5} />
            <div className="absolute left-full ml-6 px-2.5 py-1.5 bg-gray-900 text-white text-[12px] font-bold rounded-md opacity-0 group-hover:opacity-100 pointer-events-none transition-all duration-200 shadow-sm whitespace-nowrap z-50 transform translate-x-[-10px] group-hover:translate-x-0 flex items-center">
              <div className="absolute left-[-4px] top-1/2 -translate-y-1/2 w-2 h-2 bg-gray-900 rotate-45" />
              Notifications
            </div>
          </Link>
          
          <div className="w-full px-4 mt-2">
            <Link to="/app/profile" className="group relative w-full aspect-square rounded-2xl bg-gray-100 overflow-hidden hover:ring-4 ring-indigo-500/30 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 block">
              {user?.avatar ? (
                <img src={user.avatar} alt="Profile" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
              ) : (
                <div className="w-full h-full bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold text-xl group-hover:scale-110 transition-transform duration-500">
                  {user?.firstName?.charAt(0) || user?.email?.charAt(0) || 'U'}
                </div>
              )}
              
              <div className="absolute left-full ml-4 top-1/2 -translate-y-1/2 px-2.5 py-1.5 bg-gray-900 text-white text-[12px] font-bold rounded-md opacity-0 group-hover:opacity-100 pointer-events-none transition-all duration-200 shadow-sm whitespace-nowrap z-50 transform translate-x-[-10px] group-hover:translate-x-0 flex items-center">
                <div className="absolute left-[-4px] top-1/2 -translate-y-1/2 w-2 h-2 bg-gray-900 rotate-45" />
                {user ? `${user.firstName} ${user.lastName}` : 'My Profile'}
              </div>
            </Link>
          </div>
        </div>
      </aside>

      {/* --- MOBILE HEADER --- */}
      <div className="md:hidden fixed top-0 left-0 right-0 h-[64px] bg-white flex items-center justify-between px-4 z-50 shadow-sm">
        <Link to="/app" className="flex items-center gap-2">
          <span className="text-[24px] font-bold text-black leading-none">F</span>
        </Link>
        <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="p-2 text-black">
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu Dropdown */}
      {isMobileMenuOpen && (
        <div className="md:hidden fixed inset-0 top-[64px] bg-white z-40 flex flex-col">
          {navLinks.map((link) => (
            <Link 
              key={link.path}
              to={link.path}
              onClick={() => setIsMobileMenuOpen(false)}
              className="px-6 py-4 border-b border-gray-100 flex items-center gap-4 text-black font-medium"
            >
              {link.icon} {link.name}
            </Link>
          ))}
        </div>
      )}

      {/* --- MAIN CONTENT AREA --- */}
      <div className="flex-1 flex flex-col h-full min-w-0 md:pt-0 pt-[64px]">
        {/* Dashboard Content */}
        <main className="flex-1 overflow-auto p-4 md:p-8">
          <Outlet />
        </main>
      </div>

    </div>
  );
};

export default MainLayout;
