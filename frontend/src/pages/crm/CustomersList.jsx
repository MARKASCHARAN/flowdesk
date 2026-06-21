import React, { useState } from 'react';
import { 
  Users, CreditCard, Ticket, Shield, MoreHorizontal, Search, 
  ArrowUpRight, ArrowDownRight, Award, Calendar, Heart, Lightbulb, User, Loader2
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { crmService } from '../../services/crm.service';

const CustomersList = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState('Week');
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newCustomer, setNewCustomer] = useState({ name: '', email: '', company: '' });

  const { data: response, isLoading, error } = useQuery({
    queryKey: ['customers'],
    queryFn: () => crmService.getCustomers()
  });

  const customers = response?.data?.customers || [];

  const createMutation = useMutation({
    mutationFn: (data) => crmService.createCustomer(data),
    onSuccess: () => {
      queryClient.invalidateQueries(['customers']);
      setIsModalOpen(false);
      setNewCustomer({ name: '', email: '', company: '' });
    }
  });

  const handleCreate = (e) => {
    e.preventDefault();
    createMutation.mutate(newCustomer);
  };

  const modules = [
    { name: 'Billing Engine', desc: '+120 new tenants', count: '4,120', bg: 'bg-[#F3E8FF]', icon: <CreditCard className="text-[#9333EA]" size={20}/> },
    { name: 'Support Tickets', desc: '+82 joined recently', count: '3,780', bg: 'bg-[#DBEAFE]', icon: <Ticket className="text-[#2563EB]" size={20}/> },
    { name: 'CRM Contacts', desc: '+12 active now', count: '2,980', bg: 'bg-[#FFEDD5]', icon: <Users className="text-[#EA580C]" size={20}/> },
    { name: 'Security Audit', desc: '+34 certified today', count: '3,420', bg: 'bg-[#ECFCCB]', icon: <Shield className="text-[#65A30D]" size={20}/> },
  ];

  const flowerPetals = [
    { label: 'Engagement', value: '87%', color: 'from-[#86EFAC] to-transparent', rotate: 0 },
    { label: 'Consistency', value: '89%', color: 'from-[#D9F99D] to-transparent', rotate: 60 },
    { label: 'Motivation', value: '38%', color: 'from-[#FDE047] to-transparent', rotate: 120 },
    { label: 'Completion', value: '21%', color: 'from-[#FED7AA] to-transparent', rotate: 180 },
    { label: 'Retention', value: '39%', color: 'from-[#FFEDD5] to-transparent', rotate: 240 },
    { label: 'Focus time', value: '90%', color: 'from-[#BBF7D0] to-transparent', rotate: 300 },
  ];

  // Helper for rendering the circular progress ring
  const CircularProgress = ({ percent }) => {
    const radius = 12;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (percent / 100) * circumference;
    return (
      <div className="relative w-8 h-8 flex items-center justify-center">
        <svg className="w-8 h-8 transform -rotate-90">
          <circle cx="16" cy="16" r={radius} stroke="#EEF2F6" strokeWidth="3" fill="none" />
          <circle cx="16" cy="16" r={radius} stroke="#C4B5FD" strokeWidth="3" fill="none" strokeDasharray={circumference} strokeDashoffset={offset} strokeLinecap="round" />
        </svg>
      </div>
    );
  };

  return (
    <div className="max-w-[1400px] mx-auto pb-12 font-sans text-gray-900 selection:bg-indigo-100">
      
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        
        {/* CARD 1: Customers On The Platform */}
        <div className="bg-white rounded-[32px] p-8 shadow-[0_8px_30px_rgba(0,0,0,0.03)] border border-gray-50 flex flex-col justify-between">
          
          <div className="flex justify-between items-start mb-8">
            <div>
              <h2 className="text-[22px] font-bold text-gray-900 flex items-center gap-3">
                <Users className="text-gray-400" /> Customers On The Platform
              </h2>
              <div className="mt-6">
                <div className="text-[56px] font-bold tracking-tight leading-none text-gray-900 mb-1">125,693</div>
                <div className="text-[14px] text-gray-500 font-medium">active organizations on the platform</div>
              </div>
            </div>
            <button className="bg-gray-900 text-white px-5 py-2.5 rounded-full text-[13px] font-medium hover:bg-black transition-colors shadow-sm">
              Full Stats
            </button>
          </div>

          <div className="mb-10 relative">
            <div className="absolute right-0 top-[-40px] text-[13px] font-bold text-[#22C55E]">20% <span className="text-gray-400 font-medium">closer to your goal</span></div>
            
            {/* Gradient Bar */}
            <div className="w-full h-[56px] rounded-full bg-gradient-to-r from-[#FDA4AF] via-[#FDE047] to-[#86EFAC] p-1 shadow-inner relative flex items-center overflow-hidden">
              <div className="absolute right-0 top-0 bottom-0 w-[20%] bg-gray-100 rounded-r-full shadow-inner z-0" />
              
              <div className="w-[80%] h-full relative z-10 flex items-center justify-between px-6">
                <span className="text-[13px] font-bold text-gray-900">10k</span>
              </div>
              <div className="absolute right-[20%] top-2 bottom-2 w-1.5 bg-gray-900 rounded-full z-20 shadow-md" />
              <div className="absolute right-4 z-10 text-[13px] font-bold text-gray-900">200k</div>
            </div>
          </div>

          {/* Daily user activity (Dotted grid chart) */}
          <div className="bg-[#F8FAFC] rounded-[24px] p-6">
            <div className="flex justify-between items-end">
              <div>
                <div className="flex items-center gap-4 text-[12px] font-medium text-gray-500 mb-6">
                  <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-gray-300"/> &lt;5k</div>
                  <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-[#22C55E]"/> &gt;5k</div>
                </div>
                <h3 className="text-[24px] font-bold leading-tight max-w-[150px]">Daily user activity</h3>
              </div>
              
              <div className="flex-1 max-w-[300px]">
                <div className="flex justify-between text-[13px] text-gray-500 mb-3 px-2">
                  <span>June</span><span>July</span><span>August</span>
                </div>
                {/* Simulated scatter plot dots */}
                <div className="grid grid-rows-3 gap-y-2">
                  {[...Array(3)].map((_, rowIdx) => (
                    <div key={rowIdx} className="flex justify-between">
                      {[...Array(15)].map((_, colIdx) => {
                        const isHigh = Math.random() > 0.6;
                        return (
                          <div 
                            key={colIdx} 
                            className={`w-1.5 h-1.5 rounded-full ${isHigh ? 'bg-[#22C55E]' : 'bg-gray-300'}`} 
                          />
                        )
                      })}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* CARD 2: Service Usage */}
        <div className="bg-white rounded-[32px] p-8 shadow-[0_8px_30px_rgba(0,0,0,0.03)] border border-gray-50">
          
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-[22px] font-bold text-gray-900 flex items-center gap-3">
              <Award className="text-gray-400" /> Platform Modules
            </h2>
            <div className="relative w-[200px]">
              <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
              <input 
                type="text" 
                placeholder="Search module..." 
                className="w-full bg-gray-50 border border-gray-200 rounded-full px-5 py-2.5 text-[13px] focus:outline-none focus:ring-2 focus:ring-gray-200 transition-all"
              />
            </div>
          </div>

          <div className="flex flex-col lg:flex-row gap-6">
            
            {/* List */}
            <div className="flex-1 bg-white border border-gray-100 rounded-[24px] p-6">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h3 className="text-[16px] font-bold">Top Modules</h3>
                  <p className="text-[13px] text-gray-500">178 total modules</p>
                </div>
                <button className="text-gray-400 hover:text-black"><MoreHorizontal size={20}/></button>
              </div>

              <div className="space-y-6">
                {modules.map((mod, idx) => (
                  <div key={idx} className="flex justify-between items-center group cursor-pointer">
                    <div className="flex items-center gap-4">
                      <div className={`w-12 h-12 rounded-[14px] flex items-center justify-center ${mod.bg} transition-transform group-hover:scale-105`}>
                        {mod.icon}
                      </div>
                      <div>
                        <div className="text-[14px] font-bold text-gray-900 group-hover:text-indigo-600 transition-colors">{mod.name}</div>
                        <div className="text-[13px] text-gray-500">{mod.desc}</div>
                      </div>
                    </div>
                    <div className="text-[14px] font-bold font-mono text-gray-900">{mod.count}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Side KPIs */}
            <div className="lg:w-[220px] flex flex-col gap-4">
              <div className="bg-[#F8FAFC] rounded-[24px] p-6 flex-1 flex flex-col justify-center">
                <div className="text-[15px] font-bold mb-4">Adoption rate</div>
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-6 h-6 rounded-full bg-[#22C55E] flex items-center justify-center text-white"><ArrowUpRight size={14}/></div>
                  <span className="text-[28px] font-bold tracking-tight">65%</span>
                </div>
                <div className="text-[13px] text-[#22C55E] font-medium">8% from last month</div>
              </div>
              
              <div className="bg-[#F8FAFC] rounded-[24px] p-6 flex-1 flex flex-col justify-center">
                <div className="text-[15px] font-bold mb-4">Active Admins</div>
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-6 h-6 rounded-full bg-[#EF4444] flex items-center justify-center text-white"><ArrowDownRight size={14}/></div>
                  <span className="text-[28px] font-bold tracking-tight">12,639</span>
                </div>
                <div className="text-[13px] text-[#EF4444] font-medium">12% from last month</div>
              </div>
            </div>
          </div>
        </div>

        {/* CARD 3: Top Customers (Interactive List) */}
        <div className="bg-white rounded-[32px] p-8 shadow-[0_8px_30px_rgba(0,0,0,0.03)] border border-gray-50 flex flex-col">
          
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-[22px] font-bold text-gray-900 flex items-center gap-3">
              <Award className="text-gray-400" /> Top Accounts
            </h2>
            <div className="bg-gray-50 p-1 rounded-full flex gap-1 border border-gray-100 mr-4">
              <button 
                onClick={() => setActiveTab('Week')}
                className={`px-4 py-1.5 rounded-full text-[13px] font-medium transition-colors ${activeTab === 'Week' ? 'bg-white shadow-sm' : 'text-gray-500 hover:text-gray-900'}`}
              >Week</button>
              <button 
                onClick={() => setActiveTab('Month')}
                className={`px-4 py-1.5 rounded-full text-[13px] font-medium transition-colors ${activeTab === 'Month' ? 'bg-white shadow-sm' : 'text-gray-500 hover:text-gray-900'}`}
              >Month</button>
            </div>
            <button 
              onClick={() => setIsModalOpen(true)}
              className="bg-indigo-600 text-white px-5 py-2.5 rounded-full text-[13px] font-medium hover:bg-indigo-700 transition-colors shadow-sm"
            >
              Add Customer
            </button>
          </div>

          <div className="flex-1 flex flex-col gap-1 relative z-0">
            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-12 text-gray-500">
                <Loader2 size={24} className="animate-spin text-indigo-600 mb-2" />
                Loading customers...
              </div>
            ) : error ? (
              <div className="py-12 text-center text-rose-500 font-medium">
                Failed to load customers.
              </div>
            ) : customers.length === 0 ? (
              <div className="py-12 text-center text-gray-500 font-medium">
                No customers found.
              </div>
            ) : customers.slice(0, 6).map((customer) => (
              <div 
                key={customer.id} 
                onClick={() => navigate(`/app/crm/customers/${customer.id}`)}
                className="group relative flex items-center justify-between p-4 -mx-4 rounded-[20px] hover:bg-white hover:shadow-[0_20px_40px_rgba(0,0,0,0.06)] hover:-translate-y-1 transition-all duration-300 cursor-pointer z-0 hover:z-10"
              >
                {/* Left: Avatar & Name */}
                <div className="flex items-center gap-4 w-[200px]">
                  <div className="w-10 h-10 rounded-full bg-gray-100 border-2 border-white shadow-sm overflow-hidden flex-shrink-0 flex items-center justify-center text-indigo-600 font-bold bg-indigo-50">
                    {customer.name?.charAt(0) || 'C'}
                  </div>
                  <div>
                    <div className="text-[14px] font-bold text-gray-900 leading-tight truncate w-32 group-hover:text-indigo-600 transition-colors">{customer.name}</div>
                    <div className="text-[12px] text-gray-500 truncate w-32">{customer.email || 'No email'}</div>
                  </div>
                </div>

                {/* Company */}
                <div className="w-[120px]">
                  <div className="inline-flex items-center gap-2 bg-gray-50 px-3 py-1.5 rounded-full text-[12px] font-bold text-gray-700 truncate max-w-full">
                    {customer.company || 'N/A'}
                  </div>
                </div>

                {/* Date */}
                <div className="w-[100px] flex items-center gap-2 text-[13px] text-gray-600 font-medium">
                  <Calendar size={14} className="text-gray-400" /> 
                  {new Date(customer.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                </div>

                {/* Status */}
                <div className="flex items-center gap-3">
                  <span className={`px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wide ${customer.status === 'active' ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-700'}`}>
                    {customer.status}
                  </span>
                </div>
              </div>
            ))}
          </div>

        </div>

        {/* CARD 4: Customer Trends (Radial Flower Chart) */}
        <div className="bg-white rounded-[32px] p-8 shadow-[0_8px_30px_rgba(0,0,0,0.03)] border border-gray-50 relative overflow-hidden flex flex-col">
          
          <div className="flex justify-between items-start mb-8 relative z-10">
            <h2 className="text-[22px] font-bold text-gray-900 flex items-center gap-3">
              <Lightbulb className="text-gray-400" /> Account Health Trends
            </h2>
            <button className="flex items-center gap-2 border border-gray-200 px-4 py-2 rounded-full text-[13px] font-medium hover:bg-gray-50 transition-colors bg-white shadow-sm">
              <Search size={14} className="text-gray-500" /> Filter
            </button>
          </div>

          <div className="flex-1 relative flex flex-col items-center justify-center z-0 h-[300px]">
            {/* The Custom CSS Radial Flower Chart */}
            <div className="relative w-full h-full flex items-center justify-center">
              
              {/* Center Heart/Logo */}
              <div className="w-10 h-10 bg-white rounded-full shadow-md z-20 flex items-center justify-center relative">
                <Heart size={16} fill="black" />
              </div>

              {/* The Petals */}
              <div className="absolute inset-0 flex items-center justify-center mix-blend-multiply opacity-80">
                {flowerPetals.map((petal, i) => (
                  <div 
                    key={i}
                    className="absolute z-10 flex flex-col items-center"
                    style={{ transform: `rotate(${petal.rotate}deg) translateY(-85px)` }}
                  >
                    {/* Glowing Petal Shape */}
                    <div className={`w-28 h-36 bg-gradient-to-b ${petal.color} rounded-[50%] blur-[12px] opacity-70`} />
                    
                    {/* Label (Counter-rotated to stay upright) */}
                    <div className="absolute top-4 flex flex-col items-center" style={{ transform: `rotate(-${petal.rotate}deg)` }}>
                      <span className="text-[16px] font-bold text-gray-900">{petal.value}</span>
                      <span className="text-[11px] font-medium text-gray-600">{petal.label}</span>
                    </div>
                  </div>
                ))}
              </div>

            </div>
          </div>

          {/* Bottom Controls & Insights */}
          <div className="flex justify-between items-end mt-4 relative z-10">
            <div className="flex items-center gap-3 border border-gray-200 rounded-full p-1 pl-4 bg-white shadow-sm">
              <span className="text-[13px] font-medium">Insights</span>
              <div className="w-10 h-6 bg-gray-200 rounded-full relative cursor-pointer">
                <div className="w-5 h-5 bg-white rounded-full shadow-sm absolute left-0.5 top-0.5" />
              </div>
            </div>

            <div className="bg-white border border-gray-100 rounded-2xl p-4 shadow-[0_4px_20px_rgba(0,0,0,0.05)] w-[200px]">
              <div className="flex items-center gap-2 mb-1">
                <Lightbulb size={14} className="text-[#FACC15]" fill="#FACC15" />
                <span className="text-[13px] font-bold">Insight:</span>
              </div>
              <p className="text-[12px] text-gray-500 leading-tight">Upsell intermediate users to premium support packages.</p>
            </div>
          </div>

        </div>

      </div>

    </div>

      {/* New Customer Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center p-6 border-b border-gray-100">
              <h3 className="font-bold text-lg text-slate-900">Add New Customer</h3>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-slate-900 transition-colors p-1"
              >
                ✕
              </button>
            </div>
            <form onSubmit={handleCreate} className="p-6 space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-900">Full Name</label>
                <input 
                  type="text" 
                  value={newCustomer.name}
                  onChange={(e) => setNewCustomer({...newCustomer, name: e.target.value})}
                  required
                  placeholder="John Doe"
                  className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-900">Email Address</label>
                <input 
                  type="email" 
                  value={newCustomer.email}
                  onChange={(e) => setNewCustomer({...newCustomer, email: e.target.value})}
                  required
                  placeholder="john@example.com"
                  className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-900">Company Name</label>
                <input 
                  type="text" 
                  value={newCustomer.company}
                  onChange={(e) => setNewCustomer({...newCustomer, company: e.target.value})}
                  required
                  placeholder="Acme Corp"
                  className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none"
                />
              </div>
              <div className="pt-4 flex justify-end gap-3">
                <button 
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  disabled={createMutation.isLoading}
                  className="px-5 py-2.5 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors flex items-center gap-2 disabled:opacity-70"
                >
                  {createMutation.isLoading && <Loader2 size={16} className="animate-spin" />}
                  Save Customer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default CustomersList;
