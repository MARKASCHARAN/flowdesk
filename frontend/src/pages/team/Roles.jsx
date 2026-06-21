import React from 'react';
import { ArrowLeft, Check, Shield } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Roles = () => {
  const navigate = useNavigate();

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
        <table className="w-full text-left text-sm text-gray-600">
          <thead className="bg-gray-50/50 text-gray-500 border-b border-gray-200 text-[12px] uppercase tracking-wider font-semibold">
            <tr>
              <th className="px-6 py-4 w-1/3">Permission</th>
              <th className="px-6 py-4 text-center">Support Agent</th>
              <th className="px-6 py-4 text-center">Manager</th>
              <th className="px-6 py-4 text-center">Workspace Admin</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {[
              { name: "View Tickets", agent: true, manager: true, admin: true },
              { name: "Respond to Tickets", agent: true, manager: true, admin: true },
              { name: "View Customer CRM", agent: true, manager: true, admin: true },
              { name: "Assign Tickets to others", agent: false, manager: true, admin: true },
              { name: "View Team Analytics", agent: false, manager: true, admin: true },
              { name: "Manage Roles & Invites", agent: false, manager: false, admin: true },
              { name: "Access Billing", agent: false, manager: false, admin: true },
              { name: "Delete Workspace", agent: false, manager: false, admin: true },
            ].map((perm, i) => (
              <tr key={i} className="hover:bg-gray-50/30 transition-colors">
                <td className="px-6 py-4 font-medium text-slate-700">{perm.name}</td>
                <td className="px-6 py-4">
                  {perm.agent && <div className="flex justify-center"><Check size={18} className="text-emerald-500" /></div>}
                </td>
                <td className="px-6 py-4">
                  {perm.manager && <div className="flex justify-center"><Check size={18} className="text-emerald-500" /></div>}
                </td>
                <td className="px-6 py-4 bg-indigo-50/30">
                  {perm.admin && <div className="flex justify-center"><Check size={18} className="text-indigo-600" /></div>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
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
