import React from 'react';

const SecuritySettings = () => {
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-100">
          <h2 className="font-bold text-slate-900">Security & Authentication</h2>
          <p className="text-sm text-gray-500 mt-1">Manage passwords, 2FA, and SSO configuration.</p>
        </div>
        
        <div className="p-6 space-y-8">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-slate-900 text-sm">Two-Factor Authentication (2FA)</h3>
              <p className="text-sm text-gray-500 mt-1">Require all workspace users to enable 2FA.</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
            </label>
          </div>

          <div className="pt-6 border-t border-gray-100 flex items-center justify-between">
            <div>
              <h3 className="font-bold text-slate-900 text-sm">Single Sign-On (SSO)</h3>
              <p className="text-sm text-gray-500 mt-1">Configure SAML or Google Workspace SSO.</p>
            </div>
            <button className="px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
              Configure
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SecuritySettings;
