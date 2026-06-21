import React from 'react';

const GeneralSettings = () => {
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-100">
          <h2 className="font-bold text-slate-900">Workspace Profile</h2>
          <p className="text-sm text-gray-500 mt-1">This information will be displayed publicly on your support portal.</p>
        </div>
        
        <div className="p-6 space-y-6">
          <div className="flex items-center gap-6">
            <div className="w-20 h-20 bg-slate-900 rounded-2xl flex items-center justify-center shadow-inner">
              <span className="text-white font-bold text-2xl">A</span>
            </div>
            <button className="px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors">
              Change Logo
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[13px] font-bold text-slate-900">Workspace Name</label>
              <input type="text" defaultValue="Acme Corp" className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm focus:border-indigo-500 focus:ring-1 outline-none" />
            </div>
            <div className="space-y-2">
              <label className="text-[13px] font-bold text-slate-900">Support Email</label>
              <input type="email" defaultValue="support@acme.com" className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm focus:border-indigo-500 focus:ring-1 outline-none" />
            </div>
          </div>
        </div>
        
        <div className="bg-gray-50/50 p-4 border-t border-gray-100 flex justify-end">
          <button className="px-6 py-2.5 bg-indigo-600 text-white rounded-lg text-sm font-medium shadow-sm hover:bg-indigo-700 transition-colors">
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};

export default GeneralSettings;
