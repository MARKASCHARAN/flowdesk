import React from 'react';
import { Plus, MoreHorizontal } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const TicketsBoard = () => {
  const navigate = useNavigate();

  const columns = [
    {
      id: 'new',
      title: 'New',
      color: 'bg-blue-500',
      tickets: [
        { id: 'T-1040', subject: 'Feature request: Webhooks for Zendesk', requester: 'Charlie Davis', priority: 'Low' },
        { id: 'T-1043', subject: 'Cannot invite new users to workspace', requester: 'Eve Smith', priority: 'Normal' },
      ]
    },
    {
      id: 'open',
      title: 'Open',
      color: 'bg-amber-500',
      tickets: [
        { id: 'T-1042', subject: 'API Rate limit exceeded on production', requester: 'Alice Freeman', priority: 'High' },
      ]
    },
    {
      id: 'pending',
      title: 'Pending',
      color: 'bg-purple-500',
      tickets: [
        { id: 'T-1041', subject: 'Billing cycle clarification needed', requester: 'Bob Smith', priority: 'Normal' },
      ]
    },
    {
      id: 'resolved',
      title: 'Resolved',
      color: 'bg-emerald-500',
      tickets: [
        { id: 'T-1039', subject: 'Login issue with SSO integration', requester: 'Diana Prince', priority: 'Urgent' },
        { id: 'T-1038', subject: 'Export to CSV is failing', requester: 'Tom Jones', priority: 'Normal' },
      ]
    }
  ];

  const getPriorityStyle = (priority) => {
    switch(priority) {
      case 'Urgent': return 'bg-rose-100 text-rose-700';
      case 'High': return 'bg-orange-100 text-orange-700';
      case 'Normal': return 'bg-blue-100 text-blue-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="p-6 md:p-8 h-full flex flex-col">
      <div className="flex justify-between items-center mb-8 flex-shrink-0">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Board View</h1>
          <p className="text-sm text-gray-500">Visual pipeline of all active support tickets.</p>
        </div>
        <button 
          onClick={() => navigate('/app/tickets/new')}
          className="h-10 px-4 rounded-lg bg-indigo-600 text-white text-sm font-medium hover:bg-indigo-700 shadow-sm transition-colors flex items-center gap-2"
        >
          <Plus size={16} />
          <span>New Ticket</span>
        </button>
      </div>

      <div className="flex gap-6 overflow-x-auto flex-1 min-h-0 pb-4 custom-scrollbar">
        {columns.map((col) => (
          <div key={col.id} className="flex flex-col w-[320px] flex-shrink-0 bg-gray-100/50 rounded-2xl border border-gray-200/60 p-4">
            
            <div className="flex items-center justify-between mb-4 px-1">
              <div className="flex items-center gap-2">
                <div className={`w-2.5 h-2.5 rounded-full ${col.color}`}></div>
                <h3 className="font-bold text-slate-900">{col.title}</h3>
                <span className="bg-gray-200 text-gray-600 text-xs font-bold px-2 py-0.5 rounded-full">{col.tickets.length}</span>
              </div>
              <button className="text-gray-400 hover:text-gray-600 transition-colors">
                <MoreHorizontal size={18} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto space-y-3 custom-scrollbar pr-1">
              {col.tickets.map(ticket => (
                <div 
                  key={ticket.id} 
                  onClick={() => navigate(`/app/tickets/${ticket.id}`)}
                  className="bg-white rounded-xl p-4 shadow-sm border border-gray-200 cursor-pointer hover:border-indigo-300 hover:shadow-md transition-all group"
                >
                  <div className="flex justify-between items-start mb-2">
                    <span className="font-mono text-xs font-semibold text-slate-400 group-hover:text-indigo-600 transition-colors">
                      {ticket.id}
                    </span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wide ${getPriorityStyle(ticket.priority)}`}>
                      {ticket.priority}
                    </span>
                  </div>
                  <h4 className="font-bold text-sm text-slate-900 leading-snug mb-3">
                    {ticket.subject}
                  </h4>
                  <div className="flex items-center justify-between mt-auto">
                    <div className="flex items-center gap-2">
                      <div className="w-5 h-5 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center font-bold text-[9px]">
                        {ticket.requester.charAt(0)}
                      </div>
                      <span className="text-[12px] text-gray-500 font-medium truncate max-w-[120px]">{ticket.requester}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

          </div>
        ))}
      </div>
    </div>
  );
};

export default TicketsBoard;
