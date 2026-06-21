import React from 'react';
import { CreditCard, CheckCircle2, Zap, ArrowRight, History, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useQuery, useMutation } from '@tanstack/react-query';
import { billingService } from '../../services/billing.service';

const BillingOverview = () => {
  const { data: response, isLoading } = useQuery({
    queryKey: ['subscription'],
    queryFn: () => billingService.getSubscription(),
    retry: false
  });

  const portalMutation = useMutation({
    mutationFn: () => billingService.createPortalSession(),
    onSuccess: (res) => {
      if (res.data?.url) window.location.href = res.data.url;
    }
  });

  const sub = response?.data || {
    plan: 'Professional Plan',
    status: 'active',
    seats: 5,
    endsAt: '2023-11-24T00:00:00.000Z',
    usage: { apiRequests: 8400, limit: 10000 }
  };
  return (
    <div className="p-6 md:p-8 lg:p-10 max-w-5xl mx-auto space-y-8">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <CreditCard className="text-indigo-600" /> Billing & Plan
          </h1>
          <p className="text-sm text-gray-500 mt-1">Manage your subscription, limits, and payment methods.</p>
        </div>
        <Link 
          to="/app/billing/history" 
          className="flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-indigo-600 bg-white border border-gray-200 px-4 py-2 rounded-lg transition-colors shadow-sm"
        >
          <History size={16} /> Payment History
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Current Plan Details */}
        <div className="lg:col-span-2 bg-white rounded-3xl border border-gray-200 shadow-sm p-6 md:p-8 relative">
          {isLoading && (
            <div className="absolute inset-0 bg-white/80 z-10 flex items-center justify-center rounded-3xl">
              <Loader2 className="animate-spin text-indigo-600" />
            </div>
          )}
          <div className="flex justify-between items-start mb-6">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h2 className="text-xl font-bold text-slate-900 capitalize">{sub.plan}</h2>
                <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider ${sub.status === 'active' ? 'bg-indigo-100 text-indigo-700' : 'bg-gray-100 text-gray-700'}`}>
                  {sub.status}
                </span>
              </div>
              <p className="text-sm text-gray-500">Your plan renews on <strong className="text-slate-900">{new Date(sub.endsAt).toLocaleDateString()}</strong>.</p>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold text-slate-900">{sub.plan.toLowerCase().includes('pro') ? '$299' : '$0'}<span className="text-sm text-gray-400 font-normal">/mo</span></div>
            </div>
          </div>

          <div className="space-y-4 mb-8">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="font-medium text-slate-700">Agent Seats ({sub.seats}/10 used)</span>
                <span className="font-bold text-slate-900">{Math.round((sub.seats/10)*100)}%</span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-2">
                <div className="bg-indigo-600 h-2 rounded-full" style={{ width: `${Math.round((sub.seats/10)*100)}%` }}></div>
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="font-medium text-slate-700">API Requests ({(sub.usage?.apiRequests || 0) / 1000}k/{((sub.usage?.limit || 10000) / 1000)}k used)</span>
                <span className="font-bold text-slate-900">{Math.round(((sub.usage?.apiRequests || 0) / (sub.usage?.limit || 10000))*100)}%</span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-2">
                <div className="bg-amber-500 h-2 rounded-full" style={{ width: `${Math.round(((sub.usage?.apiRequests || 0) / (sub.usage?.limit || 10000))*100)}%` }}></div>
              </div>
            </div>
          </div>

          <div className="flex gap-3">
            <button className="px-6 py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-bold shadow-sm hover:bg-indigo-700 transition-colors flex items-center gap-2">
              <Zap size={16} /> Upgrade Plan
            </button>
            <button 
              onClick={() => portalMutation.mutate()}
              disabled={portalMutation.isLoading}
              className="px-6 py-2.5 bg-white border border-gray-200 text-gray-700 rounded-xl text-sm font-bold shadow-sm hover:bg-gray-50 transition-colors disabled:opacity-50 flex items-center gap-2"
            >
              {portalMutation.isLoading && <Loader2 size={16} className="animate-spin" />}
              Manage in Stripe
            </button>
          </div>
        </div>

        {/* Payment Method */}
        <div className="lg:col-span-1 bg-white rounded-3xl border border-gray-200 shadow-sm p-6 md:p-8 flex flex-col">
          <h3 className="font-bold text-slate-900 mb-6">Payment Method</h3>
          <div className="border border-gray-200 rounded-2xl p-4 flex items-center gap-4 mb-4 bg-gray-50/50">
            <div className="w-12 h-8 bg-slate-800 rounded flex items-center justify-center">
              <span className="text-white text-[10px] font-bold tracking-widest italic">VISA</span>
            </div>
            <div>
              <p className="font-bold text-slate-900 text-sm">•••• 4242</p>
              <p className="text-[12px] text-gray-500">Expires 12/2025</p>
            </div>
          </div>
          <button className="text-sm font-medium text-indigo-600 hover:text-indigo-700 text-left transition-colors">
            + Add backup payment method
          </button>
        </div>

      </div>
    </div>
  );
};

export default BillingOverview;
