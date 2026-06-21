import React from 'react';
import { ArrowLeft, Download, FileText, CheckCircle2, Loader2, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { billingService } from '../../services/billing.service';

const BillingHistory = () => {
  const navigate = useNavigate();

  const { data: response, isLoading } = useQuery({
    queryKey: ['invoices'],
    queryFn: () => billingService.getInvoices()
  });

  const invoices = response?.data || [];



  return (
    <div className="p-6 md:p-8 lg:p-10 max-w-5xl mx-auto space-y-6">
      <button 
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-slate-900 transition-colors"
      >
        <ArrowLeft size={16} />
        <span>Back to Billing</span>
      </button>

      <div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
          Payment History
        </h1>
        <p className="text-sm text-gray-500 mt-1">View and download past invoices and receipts.</p>
      </div>

      <div className="bg-white border border-gray-200 rounded-3xl overflow-hidden shadow-sm">
        <table className="w-full text-left text-sm text-gray-600">
          <thead className="bg-gray-50/50 text-gray-500 border-b border-gray-200 text-[12px] uppercase tracking-wider font-semibold">
            <tr>
              <th className="px-6 py-4">Invoice</th>
              <th className="px-6 py-4">Date</th>
              <th className="px-6 py-4">Amount</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4 text-right">Receipt</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {isLoading ? (
              <tr>
                <td colSpan="5" className="px-6 py-12 text-center text-gray-500">
                  <Loader2 size={24} className="animate-spin mx-auto text-indigo-600 mb-2" />
                  Loading payment history...
                </td>
              </tr>
            ) : invoices.length === 0 ? (
              <tr>
                <td colSpan="5" className="px-6 py-12 text-center text-gray-500">
                  No payment history found.
                </td>
              </tr>
            ) : invoices.map((inv) => (
              <tr key={inv.id} className="hover:bg-gray-50/30 transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <FileText size={16} className="text-gray-400" />
                    <div>
                      <p className="font-bold text-slate-900">{inv.invoiceNumber || inv.id}</p>
                      <p className="text-[12px] text-gray-500">{inv.plan || 'Subscription'}</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 text-slate-700 font-medium">{inv.date || new Date(inv.createdAt).toLocaleDateString()}</td>
                <td className="px-6 py-4 text-slate-900 font-bold">{inv.amount || `$${(inv.total / 100).toFixed(2)}`}</td>
                <td className="px-6 py-4">
                  <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[12px] font-bold ${inv.status?.toLowerCase() === 'paid' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'}`}>
                    {inv.status?.toLowerCase() === 'paid' ? <CheckCircle2 size={12} /> : <AlertCircle size={12} />} 
                    {inv.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <a 
                    href={inv.pdfUrl || '#'}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 px-3 py-1.5 border border-gray-200 hover:bg-gray-50 rounded-lg text-[13px] font-bold transition-colors text-slate-700"
                  >
                    <Download size={14} /> Download PDF
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default BillingHistory;
