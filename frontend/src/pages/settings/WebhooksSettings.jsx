import React, { useState } from 'react';
import { Plus, Trash2, Loader2, X } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { webhooksService } from '../../services/webhooks.service';

const WebhooksSettings = () => {
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newUrl, setNewUrl] = useState('');
  const [newEventType, setNewEventType] = useState('ticket.created');

  const { data: response, isLoading } = useQuery({
    queryKey: ['webhooks'],
    queryFn: () => webhooksService.getWebhooks()
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => webhooksService.deleteWebhook(id),
    onSuccess: () => queryClient.invalidateQueries(['webhooks'])
  });

  const createMutation = useMutation({
    mutationFn: (data) => webhooksService.createWebhook(data),
    onSuccess: () => {
      queryClient.invalidateQueries(['webhooks']);
      setIsModalOpen(false);
      setNewUrl('');
      setNewEventType('ticket.created');
    }
  });

  const handleCreate = (e) => {
    e.preventDefault();
    if (!newUrl) return;
    createMutation.mutate({ url: newUrl, eventType: newEventType });
  };

  const webhooks = response?.data || [];

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex justify-between items-center">
          <div>
            <h2 className="font-bold text-slate-900">Webhooks</h2>
            <p className="text-sm text-gray-500 mt-1">Receive real-time HTTP POST payloads when events happen.</p>
          </div>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 shadow-sm transition-colors flex items-center gap-2"
          >
            <Plus size={16} /> Add Webhook
          </button>
        </div>
        
        <div className="p-0">
          <table className="w-full text-left text-sm text-gray-600">
            <thead className="bg-gray-50/50 text-gray-400 border-b border-gray-100 text-[12px] uppercase tracking-wider font-semibold">
              <tr>
                <th className="px-6 py-4">Payload URL</th>
                <th className="px-6 py-4">Events</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {isLoading ? (
                <tr>
                  <td colSpan="4" className="px-6 py-8 text-center text-gray-500">
                    <Loader2 size={24} className="animate-spin mx-auto text-indigo-600 mb-2" />
                    Loading webhooks...
                  </td>
                </tr>
              ) : webhooks.length === 0 ? (
                <tr>
                  <td colSpan="4" className="px-6 py-8 text-center text-gray-500">
                    No webhooks configured.
                  </td>
                </tr>
              ) : webhooks.map((w) => (
                <tr key={w.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-4 font-mono text-xs text-slate-700">{w.url || w.provider}</td>
                  <td className="px-6 py-4 text-xs bg-gray-50">{w.eventType || w.events}</td>
                  <td className="px-6 py-4">
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-50 text-emerald-700">
                      {w.status || 'Active'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button 
                      onClick={() => deleteMutation.mutate(w.id)}
                      disabled={deleteMutation.isLoading}
                      className="text-rose-500 hover:text-rose-700 p-1.5 rounded-lg hover:bg-rose-50 transition-colors disabled:opacity-50"
                    >
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create Webhook Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center p-6 border-b border-gray-100">
              <h3 className="font-bold text-lg text-slate-900">Add Webhook</h3>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-slate-900 transition-colors p-1"
              >
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleCreate} className="p-6 space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-900">Payload URL</label>
                <input 
                  type="url" 
                  value={newUrl}
                  onChange={(e) => setNewUrl(e.target.value)}
                  placeholder="https://example.com/webhook"
                  required
                  className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-900">Event Type</label>
                <select 
                  value={newEventType}
                  onChange={(e) => setNewEventType(e.target.value)}
                  className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none"
                >
                  <option value="ticket.created">ticket.created</option>
                  <option value="ticket.updated">ticket.updated</option>
                  <option value="customer.created">customer.created</option>
                </select>
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
                  Save Webhook
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default WebhooksSettings;
