import React from 'react';
import { Search, ShieldX, Loader2 } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { adminService } from '../../services/admin.service';

const AdminTenants = () => {
  const { data: response, isLoading } = useQuery({
    queryKey: ['admin-tenants'],
    queryFn: () => adminService.getTenants()
  });

  const tenants = response?.data || [];


  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Tenants (Workspaces)</h1>
          <p className="text-slate-400 text-sm mt-1">Manage all companies using the platform.</p>
        </div>
        <div className="relative w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
          <input type="text" placeholder="Search tenants..." className="w-full pl-9 pr-4 py-2 bg-slate-900 border border-slate-800 rounded-lg text-sm text-white focus:border-slate-700 outline-none" />
        </div>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
        <table className="w-full text-left text-sm text-slate-300">
          <thead className="bg-slate-950/50 border-b border-slate-800 text-[11px] uppercase tracking-wider font-bold text-slate-500">
            <tr>
              <th className="px-6 py-4">Tenant ID / Name</th>
              <th className="px-6 py-4">Users</th>
              <th className="px-6 py-4">Plan</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/50">
            {isLoading ? (
              <tr>
                <td colSpan="5" className="px-6 py-12 text-center text-slate-500">
                  <Loader2 size={24} className="animate-spin mx-auto text-blue-400 mb-2" />
                  Loading tenants...
                </td>
              </tr>
            ) : tenants.length === 0 ? (
              <tr>
                <td colSpan="5" className="px-6 py-12 text-center text-slate-500">
                  No tenants found.
                </td>
              </tr>
            ) : tenants.map(t => (
              <tr key={t.id} className="hover:bg-slate-800/20 transition-colors">
                <td className="px-6 py-4">
                  <p className="font-bold text-white">{t.name}</p>
                  <p className="text-xs text-slate-500 font-mono mt-0.5">{t.id}</p>
                </td>
                <td className="px-6 py-4">{t.users || t.userCount || 0}</td>
                <td className="px-6 py-4"><span className="px-2 py-1 bg-slate-800 rounded text-xs">{t.plan || t.subscriptionTier || 'Free'}</span></td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase ${t.status === 'Active' || t.isActive ? 'text-emerald-400 bg-emerald-400/10' : 'text-rose-400 bg-rose-400/10'}`}>
                    {(t.status === 'Active' || t.isActive) ? 'Active' : 'Suspended'}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <button className="p-1.5 text-slate-500 hover:text-rose-400 transition-colors rounded hover:bg-rose-400/10" title="Suspend Tenant">
                    <ShieldX size={16} />
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

export default AdminTenants;
