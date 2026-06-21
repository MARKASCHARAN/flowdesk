import React from 'react';
import { FileText, Download, CheckCircle2, Clock, Plus, Loader2 } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { reportingService } from '../services/reporting.service';

const Reports = () => {
  const { data: response, isLoading, error } = useQuery({
    queryKey: ['reports'],
    queryFn: () => reportingService.getReports()
  });

  const reports = response?.data || [];

  return (
    <div className="p-6 md:p-8 lg:p-10 max-w-5xl mx-auto space-y-8 flex flex-col h-full animate-in fade-in duration-700 font-sans">
      
      {/* Header section with slide down animation */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 flex-shrink-0 animate-in slide-in-from-top-4 duration-500">
        <div>
          <h1 className="text-[28px] font-bold text-slate-900 tracking-tight leading-tight flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600">
              <FileText size={20} />
            </div>
            Reports & Exports
          </h1>
          <p className="text-[15px] text-gray-500 mt-2">Generate CSV/PDF reports and view your export history.</p>
        </div>
        <button className="h-10 px-5 rounded-xl bg-indigo-600 text-white text-[14px] font-medium hover:bg-indigo-700 hover:shadow-lg hover:-translate-y-0.5 hover:ring-4 ring-indigo-500/30 transition-all duration-300 flex items-center gap-2">
          <Plus size={16} />
          <span>Generate New Report</span>
        </button>
      </div>

      {/* Main Table Container */}
      <div className="bg-white border border-gray-100 rounded-3xl shadow-[0_8px_30px_rgba(0,0,0,0.03)] flex flex-col flex-1 min-h-0 overflow-hidden animate-in slide-in-from-bottom-8 duration-700 delay-100 fill-mode-both p-2">
        
        <div className="p-5 flex flex-col sm:flex-row gap-4 justify-between items-center bg-white flex-shrink-0">
          <h3 className="font-bold text-slate-900 text-[16px]">Export History</h3>
        </div>
        
        <div className="overflow-x-auto overflow-y-auto flex-1">
          <table className="w-full text-left text-sm text-gray-600 border-separate border-spacing-y-2">
            <thead className="text-gray-400 text-[11px] uppercase tracking-[0.1em] font-bold sticky top-0 z-10 bg-white">
              <tr>
                <th className="px-6 py-4 font-semibold">Report Name</th>
                <th className="px-6 py-4 font-semibold">Type</th>
                <th className="px-6 py-4 font-semibold">Status</th>
                <th className="px-6 py-4 font-semibold">Generated Date</th>
                <th className="px-6 py-4 text-right font-semibold">Action</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan="5" className="px-6 py-10 text-center text-gray-500">
                    <Loader2 size={24} className="animate-spin mx-auto text-indigo-600 mb-2" />
                    Loading reports...
                  </td>
                </tr>
              ) : error ? (
                <tr>
                  <td colSpan="5" className="px-6 py-10 text-center text-rose-500 font-medium">
                    Failed to load reports.
                  </td>
                </tr>
              ) : reports.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-10 text-center text-gray-500 font-medium">
                    No export history found.
                  </td>
                </tr>
              ) : reports.map((r, index) => (
                <tr 
                  key={r.id} 
                  className="group bg-white hover:bg-[#F8FAFC] transition-all duration-300 animate-in slide-in-from-bottom-4 fade-in fill-mode-both"
                  style={{ animationDelay: `${200 + (index * 100)}ms` }}
                >
                  <td className="px-6 py-5 rounded-l-2xl">
                    <p className="font-bold text-[14px] text-slate-900 group-hover:text-indigo-600 transition-colors">{r.name || r.type}</p>
                    <p className="text-[12px] text-gray-400 font-mono mt-1 group-hover:text-indigo-400/70 transition-colors">{r.id}</p>
                  </td>
                  <td className="px-6 py-5 text-[14px] text-gray-500 font-medium">{r.type}</td>
                  <td className="px-6 py-5">
                    {r.status === 'Completed' || r.status === 'completed' ? (
                      <span className="flex items-center gap-1.5 text-emerald-600 font-bold text-[13px] group-hover:scale-105 transition-transform origin-left inline-flex">
                        <CheckCircle2 size={16} /> Completed
                      </span>
                    ) : (
                      <span className="flex items-center gap-1.5 text-amber-500 font-bold text-[13px] group-hover:scale-105 transition-transform origin-left inline-flex">
                        <Clock size={16} className="animate-pulse" /> Processing...
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-5 text-gray-500 text-[14px]">{new Date(r.createdAt).toLocaleDateString()}</td>
                  <td className="px-6 py-5 text-right rounded-r-2xl">
                    {r.status === 'Completed' || r.status === 'completed' ? (
                      <button className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-50 text-indigo-600 hover:bg-indigo-600 hover:text-white rounded-xl text-[13px] font-bold transition-all duration-300 hover:shadow-md hover:-translate-y-0.5">
                        <Download size={16} />
                        Download <span className="font-normal opacity-70 group-hover:opacity-100">({r.size || 'CSV'})</span>
                      </button>
                    ) : (
                      <button disabled className="inline-flex items-center gap-2 px-4 py-2 bg-gray-50 text-gray-400 rounded-xl text-[13px] font-bold cursor-not-allowed">
                        Queued
                      </button>
                    )}
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

export default Reports;
