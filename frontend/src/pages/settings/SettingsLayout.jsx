import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { Settings, Shield, Users, Webhook, Puzzle } from 'lucide-react';

const SettingsLayout = () => {
  const navItems = [
    { to: '/app/settings/general', label: 'General', icon: Settings },
    { to: '/app/settings/security', label: 'Security', icon: Shield },
    { to: '/app/settings/team', label: 'Team', icon: Users },
    { to: '/app/settings/integrations', label: 'Integrations', icon: Puzzle },
    { to: '/app/settings/webhooks', label: 'Webhooks', icon: Webhook },
  ];

  return (
    <div className="p-6 md:p-8 lg:p-10 max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-slate-900 tracking-tight mb-1">Workspace Settings</h1>
        <p className="text-sm text-gray-500">Manage your organization's preferences, security, and integrations.</p>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        
        {/* Settings Navigation Sidebar */}
        <aside className="w-full md:w-64 flex-shrink-0">
          <nav className="flex flex-col space-y-1">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-indigo-50 text-indigo-700'
                      : 'text-gray-600 hover:bg-gray-100/50 hover:text-slate-900'
                  }`
                }
              >
                <item.icon size={18} />
                {item.label}
              </NavLink>
            ))}
          </nav>
        </aside>

        {/* Settings Content Area */}
        <main className="flex-1 min-w-0">
          <Outlet />
        </main>

      </div>
    </div>
  );
};

export default SettingsLayout;
