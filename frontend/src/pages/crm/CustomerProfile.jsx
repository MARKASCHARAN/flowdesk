import React, { useState } from 'react';
import { Mail, Phone, Building2, MapPin, ExternalLink, Send, MoreHorizontal, ArrowLeft, Ticket, DollarSign, Activity, Loader2 } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { crmService } from '../../services/crm.service';

const CustomerProfile = () => {
  const { id } = useParams();
  const queryClient = useQueryClient();
  const [note, setNote] = useState('');

  const { data: customerRes, isLoading } = useQuery({
    queryKey: ['customer', id],
    queryFn: () => crmService.getCustomerById(id)
  });

  const addNoteMutation = useMutation({
    mutationFn: (content) => crmService.addNoteToCustomer(id, { content }),
    onSuccess: () => {
      queryClient.invalidateQueries(['customer', id]);
      setNote('');
    }
  });

  const handleAddNote = (e) => {
    e.preventDefault();
    if (!note.trim()) return;
    addNoteMutation.mutate(note);
  };

  const customer = customerRes?.data;

  if (isLoading) {
    return <div className="flex justify-center p-12"><Loader2 className="animate-spin text-indigo-600" size={32}/></div>;
  }

  if (!customer) {
    return <div className="flex justify-center p-12 text-gray-500">Customer not found</div>;
  }

  return (
    <div className="max-w-[1400px] mx-auto pb-12 font-sans text-gray-900 selection:bg-indigo-100">
      
      {/* Top Navigation */}
      <div className="mb-6">
        <Link to="/app/crm/customers" className="inline-flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors">
          <ArrowLeft size={16} /> Back to Customers
        </Link>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        
        {/* === LEFT COLUMN: Profile & Contact === */}
        <div className="xl:col-span-1 flex flex-col gap-6">
          
          {/* Main Profile Card */}
          <div className="bg-white rounded-[32px] p-8 shadow-[0_8px_30px_rgba(0,0,0,0.03)] border border-gray-50 flex flex-col items-center text-center">
            <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-indigo-100 to-purple-100 border-4 border-white shadow-sm flex items-center justify-center text-indigo-600 text-4xl font-bold mb-4 relative">
              {customer.name?.charAt(0) || 'C'}
              <div className={`absolute bottom-0 right-0 w-5 h-5 rounded-full border-2 border-white ${customer.status === 'active' ? 'bg-[#22C55E]' : 'bg-gray-400'}`} />
            </div>
            <h1 className="text-[24px] font-bold text-gray-900 tracking-tight mb-1">{customer.name}</h1>
            <p className="text-[14px] text-gray-500 font-medium mb-6">{customer.company || 'N/A'}</p>
            
            <div className="flex gap-3 w-full">
              <button className="flex-1 bg-gray-900 text-white px-4 py-2.5 rounded-full text-[13px] font-medium hover:bg-black transition-colors shadow-sm">
                Create Ticket
              </button>
              <button className="flex-1 bg-gray-50 text-gray-700 px-4 py-2.5 rounded-full text-[13px] font-medium hover:bg-gray-100 transition-colors border border-gray-200">
                Edit Profile
              </button>
            </div>
          </div>

          {/* Contact Details Card */}
          <div className="bg-white rounded-[32px] p-8 shadow-[0_8px_30px_rgba(0,0,0,0.03)] border border-gray-50 flex-1">
            <h3 className="text-[18px] font-bold text-gray-900 mb-6">Contact Details</h3>
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-500 shrink-0">
                  <Mail size={18} />
                </div>
                <div>
                  <div className="text-[12px] text-gray-500 font-medium">Email Address</div>
                  <div className="text-[14px] font-bold text-gray-900">{customer.email || 'N/A'}</div>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-500 shrink-0">
                  <Phone size={18} />
                </div>
                <div>
                  <div className="text-[12px] text-gray-500 font-medium">Phone Number</div>
                  <div className="text-[14px] font-bold text-gray-900">{customer.phone || 'N/A'}</div>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-amber-50 flex items-center justify-center text-amber-500 shrink-0">
                  <Building2 size={18} />
                </div>
                <div>
                  <div className="text-[12px] text-gray-500 font-medium">Company</div>
                  <div className="text-[14px] font-bold text-gray-900 flex items-center gap-1 cursor-pointer hover:text-indigo-600 transition-colors">
                    {customer.company || 'N/A'} <ExternalLink size={14} />
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-rose-50 flex items-center justify-center text-rose-500 shrink-0">
                  <MapPin size={18} />
                </div>
                <div>
                  <div className="text-[12px] text-gray-500 font-medium">Location</div>
                  <div className="text-[14px] font-bold text-gray-900">N/A</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* === RIGHT COLUMN: Stats & Activity === */}
        <div className="xl:col-span-2 flex flex-col gap-6">
          
          {/* Stats Row */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-[32px] p-6 shadow-[0_8px_30px_rgba(0,0,0,0.03)] border border-gray-50 flex flex-col justify-center items-center text-center relative overflow-hidden">
              <div className="w-full h-1 bg-gradient-to-r from-blue-400 to-indigo-500 absolute top-0 left-0" />
              <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center text-blue-500 mb-3">
                <Ticket size={20} />
              </div>
              <div className="text-[32px] font-bold text-gray-900 leading-none mb-1">42</div>
              <div className="text-[13px] text-gray-500 font-medium">Total Tickets</div>
            </div>
            
            <div className="bg-white rounded-[32px] p-6 shadow-[0_8px_30px_rgba(0,0,0,0.03)] border border-gray-50 flex flex-col justify-center items-center text-center relative overflow-hidden">
              <div className="w-full h-1 bg-gradient-to-r from-amber-400 to-orange-500 absolute top-0 left-0" />
              <div className="w-12 h-12 rounded-full bg-amber-50 flex items-center justify-center text-amber-500 mb-3">
                <Activity size={20} />
              </div>
              <div className="text-[32px] font-bold text-gray-900 leading-none mb-1">3</div>
              <div className="text-[13px] text-gray-500 font-medium">Open Tickets</div>
            </div>

            <div className="bg-white rounded-[32px] p-6 shadow-[0_8px_30px_rgba(0,0,0,0.03)] border border-gray-50 flex flex-col justify-center items-center text-center relative overflow-hidden">
              <div className="w-full h-1 bg-gradient-to-r from-emerald-400 to-teal-500 absolute top-0 left-0" />
              <div className="w-12 h-12 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-500 mb-3">
                <DollarSign size={20} />
              </div>
              <div className="text-[32px] font-bold text-gray-900 leading-none mb-1">$4.2k</div>
              <div className="text-[13px] text-gray-500 font-medium">Lifetime Value</div>
            </div>
          </div>

          {/* Notes & Activity Timeline */}
          <div className="bg-white rounded-[32px] p-8 shadow-[0_8px_30px_rgba(0,0,0,0.03)] border border-gray-50 flex-1 flex flex-col">
            <div className="flex justify-between items-center mb-8">
              <h3 className="text-[20px] font-bold text-gray-900">Notes & Activity</h3>
              <MoreHorizontal size={20} className="text-gray-400 cursor-pointer hover:text-gray-900 transition-colors" />
            </div>

            {/* Note Input */}
            <form onSubmit={handleAddNote} className="bg-[#F8FAFC] rounded-[24px] p-2 pl-4 flex gap-3 items-center mb-8 border border-gray-100">
              <div className="w-8 h-8 rounded-full bg-gray-900 text-white flex items-center justify-center font-bold text-[11px] shrink-0">ME</div>
              <input 
                type="text" 
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Leave a note about this customer..."
                className="flex-1 bg-transparent border-none text-[14px] focus:outline-none text-gray-900 placeholder:text-gray-400"
              />
              <button type="submit" disabled={addNoteMutation.isLoading} className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center text-gray-900 hover:bg-gray-50 transition-colors disabled:opacity-50">
                {addNoteMutation.isLoading ? <Loader2 size={16} className="animate-spin text-gray-400" /> : <Send size={16} className="ml-1" />}
              </button>
            </form>

            {/* Timeline Feed */}
            <div className="flex-1 space-y-6">
              
              {customer.notes?.length === 0 ? (
                <div className="text-gray-400 text-sm text-center py-4">No notes yet.</div>
              ) : (
                customer.notes?.map(n => (
                  <div key={n.id} className="flex gap-4">
                    <div className="w-10 h-10 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold text-[12px] shrink-0 shadow-sm z-10 relative">
                      {n.author?.firstName?.charAt(0) || 'U'}
                    </div>
                    <div className="bg-white border border-gray-100 p-5 rounded-[24px] rounded-tl-sm shadow-sm flex-1 hover:shadow-md transition-shadow">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-[14px] font-bold text-gray-900">{n.author?.firstName || 'Unknown'}</span>
                        <span className="text-[12px] font-medium text-gray-400">{new Date(n.createdAt).toLocaleString()}</span>
                      </div>
                      <p className="text-[14px] text-gray-600 leading-relaxed whitespace-pre-wrap">
                        {n.content}
                      </p>
                    </div>
                  </div>
                ))
              )}

            </div>

          </div>

        </div>

      </div>

    </div>
  );
};

export default CustomerProfile;
