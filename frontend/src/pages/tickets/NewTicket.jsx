import React, { useState } from 'react';
import { ArrowLeft, Paperclip, Send, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { crmService } from '../../services/crm.service';
import { ticketsService } from '../../services/tickets.service';

const NewTicket = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [customerId, setCustomerId] = useState('');
  const [title, setTitle] = useState('');
  const [priority, setPriority] = useState('medium');
  const [description, setDescription] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  // Fetch customers to populate the Requester dropdown
  const { data: customersResponse, isLoading: isLoadingCustomers } = useQuery({
    queryKey: ['customers'],
    queryFn: () => crmService.getCustomers()
  });
  const customers = customersResponse?.data?.customers || [];

  const createMutation = useMutation({
    mutationFn: (payload) => ticketsService.createTicket(payload),
    onSuccess: () => {
      queryClient.invalidateQueries(['tickets']);
      navigate('/app/tickets');
    },
    onError: (error) => {
      setErrorMsg(error.message || 'Failed to create ticket');
    }
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!customerId) {
      setErrorMsg('Please select a requester (customer).');
      return;
    }
    
    createMutation.mutate({
      customerId,
      title,
      description,
      priority
    });
  };

  return (
    <div className="p-6 md:p-8 lg:p-10 max-w-4xl mx-auto space-y-6">
      <button 
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-slate-900 transition-colors"
      >
        <ArrowLeft size={16} />
        <span>Back to Tickets</span>
      </button>

      <div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Create a New Ticket</h1>
        <p className="text-sm text-gray-500 mt-1">Fill out the details below to open a new support request.</p>
      </div>

      <div className="bg-white border border-gray-200 rounded-3xl p-6 md:p-8 shadow-sm">
        <form onSubmit={handleSubmit} className="space-y-6">
          
          {errorMsg && (
            <div className="p-3 bg-rose-50 text-rose-600 rounded-lg text-sm font-medium">
              {errorMsg}
            </div>
          )}

          <div className="space-y-2">
            <label className="text-[13px] font-bold text-slate-900">Requester (Customer)</label>
            <select 
              value={customerId}
              onChange={(e) => setCustomerId(e.target.value)}
              required
              className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-700 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none"
            >
              <option value="" disabled>Select a customer...</option>
              {isLoadingCustomers ? (
                <option disabled>Loading customers...</option>
              ) : (
                customers.map(c => (
                  <option key={c.id} value={c.id}>{c.name} ({c.email})</option>
                ))
              )}
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-[13px] font-bold text-slate-900">Subject</label>
            <input 
              type="text" 
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              placeholder="Brief summary of the issue..."
              className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm font-medium focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[13px] font-bold text-slate-900">Assignee (Optional)</label>
              <select disabled className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-400 outline-none appearance-none cursor-not-allowed">
                <option value="">Coming soon...</option>
              </select>
            </div>
            
            <div className="space-y-2">
              <label className="text-[13px] font-bold text-slate-900">Priority</label>
              <select 
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-700 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="critical">Critical</option>
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[13px] font-bold text-slate-900">Description</label>
            <div className="border border-gray-200 rounded-xl overflow-hidden focus-within:border-indigo-500 focus-within:ring-1 focus-within:ring-indigo-500 transition-all">
              <div className="bg-gray-50 border-b border-gray-200 px-4 py-2 flex items-center gap-2">
                <button type="button" className="p-1.5 text-gray-500 hover:text-slate-900 hover:bg-gray-200 rounded-md transition-colors">
                  <Paperclip size={16} />
                </button>
              </div>
              <textarea 
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
                placeholder="Detailed description of the issue..."
                className="w-full bg-white px-4 py-3 text-sm outline-none resize-y min-h-[200px]"
              />
            </div>
          </div>

          <div className="pt-4 border-t border-gray-100 flex justify-end gap-3">
            <button 
              type="button"
              onClick={() => navigate(-1)}
              className="px-6 py-2.5 rounded-lg border border-gray-200 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button 
              type="submit"
              disabled={createMutation.isLoading}
              className="px-6 py-2.5 rounded-lg bg-indigo-600 text-white text-sm font-medium hover:bg-indigo-700 shadow-sm transition-colors flex items-center gap-2 disabled:opacity-70"
            >
              {createMutation.isLoading ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
              <span>Submit Ticket</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NewTicket;
