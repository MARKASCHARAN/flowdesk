import React from 'react';
import { Loader2 } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { adminService } from '../../services/admin.service';

const AdminAuditLogs = () => {
  const { data: response, isLoading } = useQuery({
    queryKey: ['admin-audit-logs'],
    queryFn: () => adminService.getAuditLogs()
  });

  const logs = response?.data || [];
  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-white tracking-tight">Security Audit Logs</h1>
        <p className="text-slate-400 text-sm mt-1">Immutable system-wide event log.</p>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
        <table className="w-full text-left text-sm text-slate-300">
          <thead className="bg-slate-950/50 border-b border-slate-800 text-[11px] uppercase tracking-wider font-bold text-slate-500">
            <tr>
              <th className="px-6 py-3">Timestamp</th>
              <th className="px-6 py-3">Actor</th>
              <th className="px-6 py-3">Action</th>
              <th className="px-6 py-3">Target</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/50 font-mono text-xs">
            {isLoading ? (
              <tr>
                <td colSpan="4" className="px-6 py-12 text-center text-slate-500 font-sans">
                  <Loader2 size={24} className="animate-spin mx-auto text-blue-400 mb-2" />
                  Loading audit logs...
                </td>
              </tr>
            ) : logs.length === 0 ? (
              <tr>
                <td colSpan="4" className="px-6 py-12 text-center text-slate-500 font-sans">
                  No audit logs found.
                </td>
              </tr>
            ) : logs.map((log) => (
              <tr key={log.id || Math.random()} className="hover:bg-slate-800/20">
                <td className="px-6 py-3 text-slate-500">{new Date(log.timestamp || log.createdAt).toLocaleString()}</td>
                <td className="px-6 py-3 text-blue-400">{log.actor || log.userId}</td>
                <td className={`px-6 py-3 ${log.action?.includes('delete') || log.action?.includes('suspend') ? 'text-rose-400' : ''}`}>{log.action}</td>
                <td className="px-6 py-3 text-slate-400">{log.target || log.resourceId}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminAuditLogs;
