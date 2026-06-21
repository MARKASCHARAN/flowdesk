import React from 'react';
import { ArrowLeft, Check, Shield, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { rbacService } from '../../services/rbac.service';

const Roles = () => {
  const navigate = useNavigate();

  const { data: rolesRes, isLoading: rolesLoading } = useQuery({
    queryKey: ['roles'],
    queryFn: () => rbacService.getRoles()
  });

  const { data: permsRes, isLoading: permsLoading } = useQuery({
    queryKey: ['permissions'],
    queryFn: () => rbacService.getPermissions()
  });

  const roles = rolesRes?.data || [];
  const permissions = permsRes?.data || [];
  const isLoading = rolesLoading || permsLoading;

  return (
    <div className="p-6 md:p-8 lg:p-10 max-w-5xl mx-auto space-y-6">
      <button 
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-slate-900 transition-colors"
      >
        <ArrowLeft size={16} />
        <span>Back to Team</span>
      </button>

      <div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
          <Shield className="text-indigo-600" /> Role Management
        </h1>
        <p className="text-sm text-gray-500 mt-1">Review the access levels and permissions for standard system roles.</p>
      </div>

      <div className="bg-white border border-gray-200 rounded-3xl overflow-hidden shadow-sm">
        {isLoading ? (
          <div className="flex justify-center p-12">
            <Loader2 className="animate-spin text-indigo-600" size={32} />
          </div>
        ) : (
          <table className="w-full text-left text-sm text-gray-600">
            <thead className="bg-gray-50/50 text-gray-500 border-b border-gray-200 text-[12px] uppercase tracking-wider font-semibold">
              <tr>
                <th className="px-6 py-4 w-1/3">Permission</th>
                {roles.map(role => (
                  <th key={role.id} className="px-6 py-4 text-center">{role.name}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {permissions.map((perm) => (
                <tr key={perm.id} className="hover:bg-gray-50/30 transition-colors">
                  <td className="px-6 py-4 font-medium text-slate-700">{perm.name || perm.action}</td>
                  {roles.map(role => {
                    // Check if role has this permission
                    const hasPerm = role.permissions?.some(p => p.id === perm.id);
                    return (
                      <td key={role.id} className={`px-6 py-4 ${role.name === 'Admin' ? 'bg-indigo-50/30' : ''}`}>
                        {hasPerm && (
                          <div className="flex justify-center">
                            <Check size={18} className={role.name === 'Admin' ? 'text-indigo-600' : 'text-emerald-500'} />
                          </div>
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
              {permissions.length === 0 && (
                <tr>
                  <td colSpan={roles.length + 1} className="px-6 py-8 text-center text-gray-500">
                    No permissions mapped yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>
      <div className="flex justify-end">
        <button className="px-6 py-2.5 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors shadow-sm">
          Create Custom Role (Enterprise)
        </button>
      </div>
    </div>
  );
};

export default Roles;
