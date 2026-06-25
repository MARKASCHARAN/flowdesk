import React from 'react';
import { Search, Plus, MoreHorizontal, Loader2 } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { usersService } from '../../services/users.service';

const TeamList = () => {
  const navigate = useNavigate();
  
  const { data: teamRes, isLoading } = useQuery({
    queryKey: ['team'],
    queryFn: () => usersService.getTeam()
  });

  const team = teamRes?.data?.users || [];

  return (
    <div className="p-6 md:p-8 lg:p-10 max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Team Members</h1>
          <p className="text-sm text-gray-500">Manage your workspace users and their roles.</p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={() => navigate('/app/roles')}
            className="h-10 px-4 rounded-lg bg-white border border-gray-200 text-gray-700 text-sm font-medium hover:bg-gray-50 shadow-sm transition-colors"
          >
            Manage Roles
          </button>
          <button 
            onClick={() => navigate('/app/team/invite')}
            className="h-10 px-4 rounded-lg bg-indigo-600 text-white text-sm font-medium hover:bg-indigo-700 shadow-sm transition-colors flex items-center gap-2"
          >
            <Plus size={16} />
            <span>Invite User</span>
          </button>
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
        <div className="p-4 border-b border-gray-200 flex flex-col sm:flex-row gap-4 justify-between items-center bg-gray-50/50">
          <div className="relative w-full sm:w-[400px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            <input 
              type="text" 
              placeholder="Search team members..." 
              className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition-all"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          {isLoading ? (
            <div className="flex justify-center p-12">
              <Loader2 className="animate-spin text-indigo-600" size={32} />
            </div>
          ) : (
            <table className="w-full text-left text-sm text-gray-600">
              <thead className="bg-gray-50/50 text-gray-500 border-b border-gray-200 text-[12px] uppercase tracking-wider font-semibold">
                <tr>
                  <th className="px-6 py-4">User</th>
                  <th className="px-6 py-4">Role</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Last Active</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {team.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50/50 transition-colors group">
                    <td className="px-6 py-4">
                      <Link to={`/app/team/${user.id}`} className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold text-xs">
                          {user.name?.charAt(0) || user.firstName?.charAt(0) || 'U'}
                        </div>
                        <div>
                          <p className="font-medium text-slate-900 group-hover:text-indigo-600 transition-colors">
                            {user.name || `${user.firstName || ''} ${user.lastName || ''}`}
                          </p>
                          <p className="text-[13px] text-gray-500">{user.email}</p>
                        </div>
                      </Link>
                    </td>
                    <td className="px-6 py-4 font-medium text-slate-700">{user.memberships?.[0]?.role?.name || user.role?.name || 'N/A'}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-[12px] font-medium ${
                        user.status === 'active' ? 'bg-emerald-50 text-emerald-700' : 
                        user.status === 'invited' ? 'bg-amber-50 text-amber-700' : 'bg-gray-100 text-gray-600'
                      }`}>
                        {user.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-500">{new Date(user.lastLoginAt || user.createdAt).toLocaleDateString()}</td>
                    <td className="px-6 py-4 text-right">
                      <button className="text-gray-400 hover:text-gray-600 p-1.5 rounded-lg hover:bg-gray-100 transition-colors">
                        <MoreHorizontal size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
                {team.length === 0 && (
                  <tr>
                    <td colSpan="5" className="px-6 py-8 text-center text-gray-500">
                      No team members found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default TeamList;
