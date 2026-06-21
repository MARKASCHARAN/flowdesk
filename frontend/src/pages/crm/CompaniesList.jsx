import React from 'react';
import { Search, Filter, Plus, MoreHorizontal } from 'lucide-react';

const CompaniesList = () => {
  const companies = [
    { id: '1', name: 'Acme Corp', industry: 'Software', mrr: '$4,500', health: 'Excellent' },
    { id: '2', name: 'Globex', industry: 'Manufacturing', mrr: '$1,200', health: 'Good' },
    { id: '3', name: 'Initech', industry: 'Technology', mrr: '$8,000', health: 'At Risk' },
  ];

  const getHealthStyle = (health) => {
    switch(health) {
      case 'Excellent': return 'bg-emerald-50 text-emerald-700';
      case 'Good': return 'bg-blue-50 text-blue-700';
      case 'At Risk': return 'bg-rose-50 text-rose-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="p-6 md:p-8 lg:p-10 max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Companies</h1>
          <p className="text-sm text-gray-500">Manage organizations and view account health.</p>
        </div>
        <button className="h-10 px-4 rounded-lg bg-indigo-600 text-white text-sm font-medium hover:bg-indigo-700 shadow-sm transition-colors flex items-center gap-2">
          <Plus size={16} />
          <span>Add Company</span>
        </button>
      </div>

      <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
        {/* Toolbar */}
        <div className="p-4 border-b border-gray-200 flex flex-col sm:flex-row gap-4 justify-between items-center bg-gray-50/50">
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            <input 
              type="text" 
              placeholder="Search companies..." 
              className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition-all"
            />
          </div>
          <button className="flex items-center gap-2 px-4 py-2 border border-gray-200 bg-white rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors w-full sm:w-auto">
            <Filter size={16} />
            <span>Filters</span>
          </button>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-600">
            <thead className="bg-gray-50/50 text-gray-500 border-b border-gray-200 text-[12px] uppercase tracking-wider font-semibold">
              <tr>
                <th className="px-6 py-4">Company Name</th>
                <th className="px-6 py-4">Industry</th>
                <th className="px-6 py-4">Monthly Recurring Revenue (MRR)</th>
                <th className="px-6 py-4">Account Health</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {companies.map((c) => (
                <tr key={c.id} className="hover:bg-gray-50/50 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center font-bold text-xs">
                        {c.name.substring(0,2).toUpperCase()}
                      </div>
                      <p className="font-bold text-slate-900 cursor-pointer group-hover:text-indigo-600 transition-colors">{c.name}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-500">{c.industry}</td>
                  <td className="px-6 py-4 font-bold text-slate-900">{c.mrr}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 rounded-full text-[12px] font-bold ${getHealthStyle(c.health)}`}>
                      {c.health}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="text-gray-400 hover:text-gray-600 p-1.5 rounded-lg hover:bg-gray-100 transition-colors">
                      <MoreHorizontal size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default CompaniesList;
