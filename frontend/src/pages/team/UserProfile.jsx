import React from 'react';
import { ArrowLeft, UserCircle, Activity, CheckCircle2, XCircle } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';

const UserProfile = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  return (
    <div className="p-6 md:p-8 lg:p-10 max-w-5xl mx-auto space-y-6">
      <button 
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-slate-900 transition-colors"
      >
        <ArrowLeft size={16} />
        <span>Back to Team</span>
      </button>

      <div className="bg-white border border-gray-200 rounded-3xl p-8 shadow-sm">
        <div className="flex flex-col md:flex-row gap-8 items-start md:items-center">
          <div className="w-24 h-24 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold text-4xl shadow-inner">
            S
          </div>
          <div className="flex-1 space-y-1">
            <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Sarah Rep</h1>
            <p className="text-gray-500 font-medium">sarah@acme.com</p>
            <div className="flex gap-2 pt-2">
              <span className="px-3 py-1 bg-emerald-50 text-emerald-700 rounded-full text-[12px] font-bold uppercase tracking-wide border border-emerald-100">
                Active
              </span>
              <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-[12px] font-bold uppercase tracking-wide border border-gray-200">
                Support Agent
              </span>
            </div>
          </div>
          <div className="flex gap-3">
            <button className="px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
              Reset Password
            </button>
            <button className="px-4 py-2 bg-rose-50 text-rose-700 border border-rose-200 rounded-lg text-sm font-medium hover:bg-rose-100 transition-colors">
              Suspend User
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm space-y-6">
          <h3 className="font-bold text-slate-900 flex items-center gap-2">
            <Activity size={18} /> Performance Metrics
          </h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center pb-4 border-b border-gray-100">
              <span className="text-sm text-gray-500 font-medium">Tickets Resolved (30d)</span>
              <span className="font-bold text-slate-900 text-lg">142</span>
            </div>
            <div className="flex justify-between items-center pb-4 border-b border-gray-100">
              <span className="text-sm text-gray-500 font-medium">Avg Resolution Time</span>
              <span className="font-bold text-slate-900 text-lg">2.4 hours</span>
            </div>
            <div className="flex justify-between items-center pb-4 border-b border-gray-100">
              <span className="text-sm text-gray-500 font-medium">Customer CSAT</span>
              <span className="font-bold text-emerald-600 text-lg">98%</span>
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm space-y-6">
          <h3 className="font-bold text-slate-900 flex items-center gap-2">
            <UserCircle size={18} /> Role & Permissions
          </h3>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <CheckCircle2 size={18} className="text-emerald-500" />
              <span className="text-sm text-gray-700">View and respond to all tickets</span>
            </div>
            <div className="flex items-center gap-3">
              <CheckCircle2 size={18} className="text-emerald-500" />
              <span className="text-sm text-gray-700">Access customer CRM profiles</span>
            </div>
            <div className="flex items-center gap-3">
              <XCircle size={18} className="text-gray-300" />
              <span className="text-sm text-gray-400 line-through">Delete workspaces</span>
            </div>
            <div className="flex items-center gap-3">
              <XCircle size={18} className="text-gray-300" />
              <span className="text-sm text-gray-400 line-through">Access billing settings</span>
            </div>
          </div>
          <button className="w-full mt-4 py-2 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
            Change Role
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
