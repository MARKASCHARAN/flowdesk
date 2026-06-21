import React from 'react';
import { Search, Loader2, Shield } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { adminService } from '../../services/admin.service';

const AdminUsers = () => {
  const { data: response, isLoading } = useQuery({
    queryKey: ['admin-users'],
    queryFn: () => adminService.getUsers()
  });

  const users = response?.data || [];
  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Global Users</h1>
          <p className="text-slate-400 text-sm mt-1">Cross-tenant view of all registered accounts.</p>
        </div>
        <div className="relative w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
          <input type="text" placeholder="Search global users..." className="w-full pl-9 pr-4 py-2 bg-slate-900 border border-slate-800 rounded-lg text-sm text-white focus:border-slate-700 outline-none" />
        </div>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
        <table className="w-full text-left text-sm text-slate-300">
          <thead className="bg-slate-950/50 border-b border-slate-800 text-[11px] uppercase tracking-wider font-bold text-slate-500">
            <tr>
              <th className="px-6 py-4">User</th>
              <th className="px-6 py-4">Tenant ID</th>
              <th className="px-6 py-4">Role</th>
              <th className="px-6 py-4">Joined</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/50">
            {isLoading ? (
              <tr>
                <td colSpan="5" className="px-6 py-12 text-center text-slate-500">
                  <Loader2 size={24} className="animate-spin mx-auto text-emerald-400 mb-2" />
                  Loading global users...
                </td>
              </tr>
            ) : users.length === 0 ? (
              <tr>
                <td colSpan="5" className="px-6 py-12 text-center text-slate-500">
                  No users found in global directory.
                </td>
              </tr>
            ) : users.map(u => (
              <tr key={u.id} className="hover:bg-slate-800/20 transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <img src={u.avatarUrl || `https://ui-avatars.com/api/?name=${u.firstName}+${u.lastName}&bg=334155&color=fff`} alt={u.firstName} className="w-8 h-8 rounded-full" />
                    <div>
                      <p className="font-bold text-white">{u.firstName} {u.lastName}</p>
                      <p className="text-xs text-slate-500">{u.email}</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 font-mono text-xs">{u.tenantId || 'Unknown'}</td>
                <td className="px-6 py-4">
                  <span className="px-2 py-1 bg-slate-800 rounded text-[10px] uppercase font-bold tracking-wider">{u.globalRole || 'User'}</span>
                </td>
                <td className="px-6 py-4 text-slate-500 text-xs">
                  {new Date(u.createdAt).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 text-right">
                  <button className="p-1.5 text-slate-500 hover:text-emerald-400 transition-colors rounded hover:bg-emerald-400/10" title="Impersonate User">
                    <Shield size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminUsers;
