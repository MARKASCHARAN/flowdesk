import React from 'react';

const AdminBilling = () => {
  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-white tracking-tight">Revenue & Billing</h1>
        <p className="text-slate-400 text-sm mt-1">Stripe synchronization and platform MRR.</p>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 text-center">
        <p className="text-slate-500">Stripe Dashboard Embed / Sync Logs</p>
      </div>
    </div>
  );
};

export default AdminBilling;
