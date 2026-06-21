import React, { useMemo } from 'react';
import { Plus, MoreHorizontal, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { ticketsService } from '../../services/tickets.service';

const TicketsBoard = () => {
  const navigate = useNavigate();

  const { data: ticketsRes, isLoading } = useQuery({
    queryKey: ['tickets'],
    queryFn: () => ticketsService.getTickets()
  });

  const allTickets = ticketsRes?.data?.tickets || [];

  const columns = useMemo(() => {
    return [
      {
        id: 'new',
        title: 'New',
        color: 'bg-blue-500',
        tickets: allTickets.filter(t => t.status === 'new' || t.status === 'NEW')
      },
      {
        id: 'open',
        title: 'Open',
        color: 'bg-amber-500',
        tickets: allTickets.filter(t => t.status === 'open' || t.status === 'OPEN')
      },
      {
        id: 'pending',
        title: 'Pending',
        color: 'bg-purple-500',
        tickets: allTickets.filter(t => t.status === 'pending' || t.status === 'PENDING')
      },
      {
        id: 'resolved',
        title: 'Resolved',
        color: 'bg-emerald-500',
        tickets: allTickets.filter(t => t.status === 'resolved' || t.status === 'RESOLVED' || t.status === 'closed' || t.status === 'CLOSED')
      }
    ];
  }, [allTickets]);

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
        {isLoading ? (
          <div className="w-full flex items-center justify-center">
            <Loader2 className="animate-spin text-indigo-600 w-8 h-8" />
          </div>
        ) : (
          columns.map((col) => (
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
                        {ticket.ticketNumber || ticket.id.substring(0, 8)}
                      </span>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wide ${getPriorityStyle(ticket.priority)}`}>
                        {ticket.priority}
                      </span>
                    </div>
                    <h4 className="font-bold text-sm text-slate-900 leading-snug mb-3">
                      {ticket.title}
                    </h4>
                    <div className="flex items-center justify-between mt-auto">
                      <div className="flex items-center gap-2">
                        <div className="w-5 h-5 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center font-bold text-[9px]">
                          {ticket.requester?.name?.charAt(0) || ticket.requester?.firstName?.charAt(0) || 'U'}
                        </div>
                        <span className="text-[12px] text-gray-500 font-medium truncate max-w-[120px]">
                          {ticket.requester?.name || ticket.requester?.firstName || 'Unknown'}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default TicketsBoard;
