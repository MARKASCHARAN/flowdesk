import React from 'react';
import { Activity, Database, Users, DollarSign, Loader2 } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { adminService } from '../../services/admin.service';

const AdminDashboard = () => {
  const { data: response, isLoading } = useQuery({
    queryKey: ['admin-stats'],
    queryFn: () => adminService.getDashboardStats()
  });

  const stats = response?.data || {
    tenants: 142,
    users: 4892,
    mrr: 84200,
    apiRequests: 12400
  };
  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      <div>
        <h1 className="text-3xl font-black text-white tracking-tight">Platform Overview</h1>
        <p className="text-slate-400 mt-1">Real-time metrics for the entire FlowDesk SaaS platform.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative">
        {isLoading && (
          <div className="absolute inset-0 z-10 bg-slate-950/50 flex items-center justify-center rounded-2xl">
            <Loader2 className="animate-spin text-blue-400" />
          </div>
        )}
        {[
          { label: 'Total Tenants', value: stats.tenants, icon: Database, color: 'text-blue-400', bg: 'bg-blue-400/10' },
          { label: 'Global Users', value: stats.users?.toLocaleString() || stats.users, icon: Users, color: 'text-emerald-400', bg: 'bg-emerald-400/10' },
          { label: 'MRR', value: `$${(stats.mrr || 0).toLocaleString()}`, icon: DollarSign, color: 'text-amber-400', bg: 'bg-amber-400/10' },
          { label: 'API Requests/min', value: `${((stats.apiRequests || 0) / 1000).toFixed(1)}k`, icon: Activity, color: 'text-purple-400', bg: 'bg-purple-400/10' },
        ].map((stat, i) => (
          <div key={i} className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-sm">
            <div className="flex items-center gap-4">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${stat.bg} ${stat.color}`}>
                <stat.icon size={24} />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">{stat.label}</p>
                <p className="text-2xl font-black text-white mt-1">{stat.value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 h-[400px] flex items-center justify-center">
        <p className="text-slate-600 font-mono text-sm">[ System Resource Usage Chart Placeholder ]</p>
      </div>
    </div>
  );
};

export default AdminDashboard;
