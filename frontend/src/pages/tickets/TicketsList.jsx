import React from 'react';
import { Search, Filter, Plus, Columns, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { ticketsService } from '../../services/tickets.service';

const TicketsList = () => {
  const navigate = useNavigate();
  
  const { data: response, isLoading, error } = useQuery({
    queryKey: ['tickets'],
    queryFn: () => ticketsService.getTickets()
  });

  const tickets = response?.data?.tickets || [];


  const getPriorityStyle = (priority) => {
    switch(priority) {
      case 'Urgent': return 'bg-rose-100 text-rose-700';
      case 'High': return 'bg-orange-100 text-orange-700';
      case 'Normal': return 'bg-blue-100 text-blue-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getStatusStyle = (status) => {
    switch(status) {
      case 'New': return 'border-blue-200 text-blue-700 bg-blue-50';
      case 'Open': return 'border-amber-200 text-amber-700 bg-amber-50';
      case 'Pending': return 'border-purple-200 text-purple-700 bg-purple-50';
      case 'Resolved': return 'border-emerald-200 text-emerald-700 bg-emerald-50';
      default: return 'border-gray-200 text-gray-700 bg-gray-50';
    }
  };

  return (
    <div className="p-6 md:p-8 lg:p-10 max-w-7xl mx-auto space-y-8 flex flex-col h-full animate-in fade-in duration-700 font-sans">
      
      {/* Header section with slide down animation */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 flex-shrink-0 animate-in slide-in-from-top-4 duration-500">
        <div>
          <h1 className="text-[28px] font-bold text-slate-900 tracking-tight leading-tight">All Tickets</h1>
          <p className="text-[15px] text-gray-500 mt-1">Manage and respond to customer support requests.</p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={() => navigate('/app/tickets/board')}
            className="h-10 px-4 rounded-xl bg-white border border-gray-200 text-gray-700 text-[14px] font-medium hover:bg-gray-50 hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 flex items-center gap-2"
          >
            <Columns size={16} />
            <span className="hidden sm:inline">Board View</span>
          </button>
          <button 
            onClick={() => navigate('/app/tickets/new')}
            className="h-10 px-5 rounded-xl bg-indigo-600 text-white text-[14px] font-medium hover:bg-indigo-700 hover:shadow-lg hover:-translate-y-0.5 hover:ring-4 ring-indigo-500/30 transition-all duration-300 flex items-center gap-2"
          >
            <Plus size={16} />
            <span>New Ticket</span>
          </button>
        </div>
      </div>

      {/* Main Table Container */}
      <div className="bg-white border border-gray-100 rounded-3xl shadow-[0_8px_30px_rgba(0,0,0,0.03)] flex flex-col flex-1 min-h-0 overflow-hidden animate-in slide-in-from-bottom-8 duration-700 delay-100 fill-mode-both">
        
        {/* Toolbar */}
        <div className="p-5 border-b border-gray-100 flex flex-col sm:flex-row gap-4 justify-between items-center bg-white flex-shrink-0">
          <div className="relative w-full sm:w-[400px] group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-indigo-500 transition-colors" size={16} />
            <input 
              type="text" 
              placeholder="Search tickets by ID, subject, or requester..." 
              className="w-full pl-11 pr-4 py-2.5 bg-gray-50/50 border border-gray-200 rounded-xl text-[14px] focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all duration-300"
            />
          </div>
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button className="flex-1 sm:flex-none flex justify-center items-center gap-2 px-5 py-2.5 border border-gray-200 bg-white rounded-xl text-[14px] font-medium text-gray-700 hover:bg-gray-50 hover:shadow-sm hover:-translate-y-0.5 transition-all duration-300">
              <Filter size={16} />
              <span>Filter</span>
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto overflow-y-auto flex-1 p-2">
          <table className="w-full text-left text-sm text-gray-600 border-separate border-spacing-y-2">
            <thead className="text-gray-400 text-[11px] uppercase tracking-[0.1em] font-bold sticky top-0 z-10 bg-white">
              <tr>
                <th className="px-6 py-4 font-semibold">ID</th>
                <th className="px-6 py-4 w-1/3 font-semibold">Subject</th>
                <th className="px-6 py-4 font-semibold">Requester</th>
                <th className="px-6 py-4 font-semibold">Assignee</th>
                <th className="px-6 py-4 font-semibold">Priority</th>
                <th className="px-6 py-4 font-semibold">Status</th>
                <th className="px-6 py-4 font-semibold">Updated</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan="7" className="px-6 py-10 text-center text-gray-500">
                    <Loader2 size={24} className="animate-spin mx-auto text-indigo-600 mb-2" />
                    Loading tickets...
                  </td>
                </tr>
              ) : error ? (
                <tr>
                  <td colSpan="7" className="px-6 py-10 text-center text-rose-500 font-medium">
                    Failed to load tickets. Please try again.
                  </td>
                </tr>
              ) : tickets.length === 0 ? (
                <tr>
                  <td colSpan="7" className="px-6 py-10 text-center text-gray-500 font-medium">
                    No tickets found.
                  </td>
                </tr>
              ) : (
                tickets.map((t, index) => (
                  <tr 
                    key={t.id} 
                    onClick={() => navigate(`/app/tickets/${t.id}`)}
                    className="group cursor-pointer bg-white hover:bg-[#F8FAFC] transition-all duration-300 animate-in slide-in-from-bottom-4 fade-in fill-mode-both"
                    style={{ animationDelay: `${200 + (index * 100)}ms` }}
                  >
                    {/* Subtle border radius logic for table rows using first/last child classes */}
                    <td className="px-6 py-5 font-mono text-[13px] font-bold text-slate-400 group-hover:text-indigo-600 transition-colors rounded-l-2xl">
                      {t.id}
                    </td>
                    <td className="px-6 py-5">
                      <p className="font-bold text-[14px] text-slate-900 truncate group-hover:text-indigo-600 transition-colors">{t.subject}</p>
                    </td>
                    <td className="px-6 py-5 font-medium text-[14px] text-slate-700">{t.requester?.firstName || 'System'}</td>
                    <td className="px-6 py-5 text-[14px] text-gray-500">{t.assignee?.firstName || 'Unassigned'}</td>
                    <td className="px-6 py-5">
                      <span className={`px-2.5 py-1 rounded-md text-[11px] font-bold uppercase tracking-wide transition-transform duration-300 group-hover:scale-105 inline-block ${getPriorityStyle(t.priority)}`}>
                        {t.priority}
                      </span>
                    </td>
                    <td className="px-6 py-5">
                      <span className={`px-3 py-1 rounded-full text-[12px] font-bold border transition-all duration-300 group-hover:shadow-sm inline-block ${getStatusStyle(t.status)}`}>
                        {t.status}
                      </span>
                    </td>
                    <td className="px-6 py-5 text-gray-400 text-[13px] rounded-r-2xl">
                      {new Date(t.updatedAt || t.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default TicketsList;
