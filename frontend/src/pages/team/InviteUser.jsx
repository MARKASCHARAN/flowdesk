import React from 'react';
import { ArrowLeft, Mail, ShieldAlert } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const InviteUser = () => {
  const navigate = useNavigate();

  return (
    <div className="p-6 md:p-8 lg:p-10 max-w-3xl mx-auto space-y-6">
      <button 
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-slate-900 transition-colors"
      >
        <ArrowLeft size={16} />
        <span>Back to Team</span>
      </button>

      <div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Invite Team Member</h1>
        <p className="text-sm text-gray-500 mt-1">Send an invitation link to add a new user to your workspace.</p>
      </div>

      <div className="bg-white border border-gray-200 rounded-3xl p-6 md:p-8 shadow-sm">
        <form className="space-y-6">
          
          <div className="space-y-2">
            <label className="text-[13px] font-bold text-slate-900">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
              <input 
                type="email" 
                placeholder="colleague@company.com"
                className="w-full bg-white border border-gray-200 rounded-xl pl-11 pr-4 py-3 text-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[13px] font-bold text-slate-900">Assign Role</label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <label className="border border-indigo-600 bg-indigo-50/50 rounded-xl p-4 cursor-pointer flex gap-3 items-start relative">
                <input type="radio" name="role" value="agent" className="mt-1" defaultChecked />
                <div>
                  <h4 className="font-bold text-sm text-slate-900">Support Agent</h4>
                  <p className="text-xs text-gray-500 mt-1">Can view and respond to tickets, manage customers, and view basic reports.</p>
                </div>
              </label>
              
              <label className="border border-gray-200 hover:border-gray-300 bg-white rounded-xl p-4 cursor-pointer flex gap-3 items-start relative transition-colors">
                <input type="radio" name="role" value="admin" className="mt-1" />
                <div>
                  <h4 className="font-bold text-sm text-slate-900">Workspace Admin</h4>
                  <p className="text-xs text-gray-500 mt-1">Full access to billing, roles, system integrations, and all data.</p>
                </div>
              </label>
            </div>
          </div>

          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex gap-3 items-start">
            <ShieldAlert size={18} className="text-amber-600 mt-0.5" />
            <div className="text-sm text-amber-800">
              <p className="font-bold">Billing Impact</p>
              <p className="mt-1 text-amber-700/80">Adding a new user will increase your monthly billing by $29/mo based on your current plan.</p>
            </div>
          </div>

          <div className="pt-4 border-t border-gray-100 flex justify-end gap-3">
            <button 
              type="button"
              onClick={() => navigate(-1)}
              className="px-6 py-2.5 rounded-lg border border-gray-200 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button 
              type="submit"
              className="px-6 py-2.5 rounded-lg bg-indigo-600 text-white text-sm font-medium hover:bg-indigo-700 shadow-sm transition-colors"
            >
              Send Invitation
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default InviteUser;
