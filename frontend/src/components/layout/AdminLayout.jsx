import React from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Building2, Users, CreditCard, ShieldAlert, LogOut } from 'lucide-react';

const AdminLayout = () => {
  const navigate = useNavigate();

  const navItems = [
    { to: '/admin/dashboard', label: 'Overview', icon: LayoutDashboard },
    { to: '/admin/tenants', label: 'Tenants (Workspaces)', icon: Building2 },
    { to: '/admin/users', label: 'Global Users', icon: Users },
    { to: '/admin/billing', label: 'Revenue & Billing', icon: CreditCard },
    { to: '/admin/audit-logs', label: 'Audit Logs', icon: ShieldAlert },
  ];

  return (
    <div className="flex h-screen bg-slate-950 text-slate-50 overflow-hidden font-sans">
      
      {/* SuperAdmin Sidebar */}
      <aside className="w-64 bg-slate-900 border-r border-slate-800 flex flex-col flex-shrink-0">
        <div className="h-16 flex items-center px-6 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <div className="w-5 h-2.5 bg-red-500 rounded-full -rotate-45 mb-1 shadow-[0_0_10px_rgba(239,68,68,0.5)]"></div>
            <span className="text-xl font-black tracking-tight text-white">FlowDesk</span>
            <span className="ml-2 px-1.5 py-0.5 rounded text-[9px] font-bold uppercase tracking-widest bg-red-500/20 text-red-400 border border-red-500/30">SuperAdmin</span>
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto py-6 px-4 custom-scrollbar">
          <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-3 px-3">System Control</div>
          <nav className="space-y-1">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors text-[13px] font-medium ${
                    isActive 
                    ? 'bg-slate-800 text-white shadow-inner' 
                    : 'text-slate-400 hover:bg-slate-800/50 hover:text-white'
                  }`
                }
              >
                <item.icon size={16} />
                <span>{item.label}</span>
              </NavLink>
            ))}
          </nav>
        </div>

        <div className="p-4 border-t border-slate-800">
          <button 
            onClick={() => navigate('/login')}
            className="w-full flex justify-center items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-rose-500/10 hover:text-rose-400 text-slate-400 rounded-lg text-sm font-medium transition-all"
          >
            <LogOut size={16} />
            <span>Exit Admin</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 bg-slate-950">
        <header className="h-16 border-b border-slate-800 flex items-center justify-between px-8 flex-shrink-0 z-10 bg-slate-900/50 backdrop-blur-md">
          <h2 className="text-sm font-medium text-slate-400">System Administration Interface</h2>
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-2 text-[11px] font-mono text-emerald-400 bg-emerald-400/10 px-2 py-1 rounded border border-emerald-400/20">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              SYSTEM HEALTHY
            </span>
          </div>
        </header>

        <div className="flex-1 overflow-auto p-8 relative">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;
