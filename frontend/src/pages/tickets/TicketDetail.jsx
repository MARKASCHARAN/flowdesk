import React, { useState } from 'react';
import { ArrowLeft, Paperclip, Send, Clock, User, AlertCircle, FileText, Lock, Globe, Loader2 } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ticketsService } from '../../services/tickets.service';
import { commentsService } from '../../services/comments.service';
import { useAuthStore } from '../../store/useAuthStore';

const TicketDetail = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const queryClient = useQueryClient();
  const { user } = useAuthStore();

  const [replyType, setReplyType] = useState('public'); // 'public' | 'internal'
  const [replyText, setReplyText] = useState('');

  const { data: ticketRes, isLoading: ticketLoading } = useQuery({
    queryKey: ['ticket', id],
    queryFn: () => ticketsService.getTicketById(id)
  });

  const { data: commentsRes, isLoading: commentsLoading } = useQuery({
    queryKey: ['comments', id],
    queryFn: () => commentsService.getComments(id)
  });

  const createCommentMutation = useMutation({
    mutationFn: (data) => commentsService.createComment(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries(['comments', id]);
      setReplyText('');
    }
  });

  const handleSendReply = () => {
    if (!replyText.trim()) return;
    createCommentMutation.mutate({
      content: replyText,
      isInternal: replyType === 'internal'
    });
  };

  const ticket = ticketRes?.data;
  const comments = commentsRes?.data?.comments || [];

  if (ticketLoading) {
    return (
      <div className="flex h-[calc(100vh-100px)] items-center justify-center">
        <Loader2 className="animate-spin text-indigo-600" size={32} />
      </div>
    );
  }

  if (!ticket) {
    return (
      <div className="flex h-[calc(100vh-100px)] items-center justify-center text-gray-500">
        Ticket not found
      </div>
    );
  }

  return (
    <div className="p-6 md:p-8 lg:p-10 max-w-7xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <button 
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-slate-900 transition-colors"
        >
          <ArrowLeft size={16} />
          <span>Back to Tickets</span>
        </button>
        <div className="flex gap-2">
          <span className="px-3 py-1 bg-amber-50 text-amber-700 border border-amber-200 rounded-full text-[12px] font-bold uppercase tracking-wide">
            Open
          </span>
          <span className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-[12px] font-bold uppercase tracking-wide">
            High
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        
        {/* Main Conversation Column */}
        <div className="lg:col-span-3 space-y-6">
          <div className="bg-white rounded-3xl border border-gray-200 shadow-sm p-6 md:p-8">
            <h1 className="text-2xl md:text-3xl font-bold text-slate-900 tracking-tight mb-2">
              <span className="text-gray-400 font-mono text-xl mr-3">#{ticket.id.slice(0,8).toUpperCase()}</span>
              {ticket.title}
            </h1>
            <p className="text-sm text-gray-500">Reported by {ticket.customer?.name || 'Unknown'} • {new Date(ticket.createdAt).toLocaleString()}</p>
          </div>

          <div className="bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden flex flex-col min-h-[600px]">
            {/* Conversation Feed */}
            <div className="flex-1 p-6 overflow-y-auto space-y-8 bg-gray-50/30">
              
              {/* Original Ticket Description */}
              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-full bg-indigo-50 text-indigo-600 flex flex-shrink-0 items-center justify-center font-bold text-sm mt-1">
                  {ticket.customer?.name?.charAt(0) || 'U'}
                </div>
                <div className="flex-1 space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900">{ticket.customer?.name || 'Unknown'}</span>
                    <span className="text-[12px] text-gray-500">{new Date(ticket.createdAt).toLocaleString()}</span>
                  </div>
                  <div className="bg-white border border-gray-200 p-5 rounded-2xl rounded-tl-none shadow-sm text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">
                    {ticket.description}
                  </div>
                </div>
              </div>

              {/* Comments */}
              {commentsLoading ? (
                <div className="flex justify-center py-4"><Loader2 className="animate-spin text-gray-400" /></div>
              ) : (
                comments.map((comment) => (
                  <div key={comment.id} className="flex gap-4">
                    <div className={`w-10 h-10 rounded-full flex flex-shrink-0 items-center justify-center font-bold text-sm mt-1 ${comment.isInternal ? 'bg-slate-900 text-white' : 'bg-indigo-50 text-indigo-600'}`}>
                      {comment.author?.firstName?.charAt(0) || 'A'}
                    </div>
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900">{comment.author?.firstName || 'Unknown User'}</span>
                        <span className="text-[12px] text-gray-500">{new Date(comment.createdAt).toLocaleString()}</span>
                        {comment.isInternal && (
                          <span className="px-2 py-0.5 bg-amber-100 text-amber-800 rounded text-[10px] font-bold uppercase tracking-wider ml-2 flex items-center gap-1">
                            <Lock size={10} /> Internal Note
                          </span>
                        )}
                      </div>
                      <div className={`${comment.isInternal ? 'bg-amber-50/50 border border-amber-200' : 'bg-white border border-gray-200'} p-5 rounded-2xl rounded-tl-none shadow-sm text-sm text-gray-700 leading-relaxed whitespace-pre-wrap`}>
                        {comment.content}
                      </div>
                    </div>
                  </div>
                ))
              )}

            </div>

            {/* Reply Box */}
            <div className="border-t border-gray-200 bg-white">
              <div className="flex border-b border-gray-100">
                <button 
                  onClick={() => setReplyType('public')}
                  className={`flex-1 py-3 text-[13px] font-bold uppercase tracking-wider flex justify-center items-center gap-2 transition-colors ${replyType === 'public' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-gray-500 hover:bg-gray-50'}`}
                >
                  <Globe size={16} /> Public Reply
                </button>
                <button 
                  onClick={() => setReplyType('internal')}
                  className={`flex-1 py-3 text-[13px] font-bold uppercase tracking-wider flex justify-center items-center gap-2 transition-colors ${replyType === 'internal' ? 'text-amber-600 border-b-2 border-amber-600 bg-amber-50/30' : 'text-gray-500 hover:bg-gray-50'}`}
                >
                  <Lock size={16} /> Internal Note
                </button>
              </div>
              <div className={`p-4 ${replyType === 'internal' ? 'bg-amber-50/10' : ''}`}>
                <textarea 
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  placeholder={replyType === 'public' ? "Type your reply to the customer..." : "Type an internal note (customers won't see this)..."}
                  className={`w-full border rounded-xl px-4 py-3 text-sm outline-none resize-y min-h-[120px] transition-all ${
                    replyType === 'internal' 
                    ? 'bg-amber-50/30 border-amber-200 focus:border-amber-500 focus:ring-1 focus:ring-amber-500' 
                    : 'bg-white border-gray-200 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500'
                  }`}
                />
                <div className="mt-3 flex justify-between items-center">
                  <button type="button" className="p-2 text-gray-500 hover:text-slate-900 hover:bg-gray-100 rounded-lg transition-colors">
                    <Paperclip size={18} />
                  </button>
                  <button 
                    onClick={handleSendReply}
                    disabled={createCommentMutation.isLoading || !replyText.trim()}
                    className={`px-6 py-2.5 rounded-lg text-white text-sm font-medium shadow-sm transition-colors flex items-center gap-2 ${
                      replyType === 'internal' ? 'bg-amber-600 hover:bg-amber-700' : 'bg-slate-950 hover:bg-slate-800'
                    } disabled:opacity-50`}
                  >
                    {createCommentMutation.isLoading ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
                    <span>{replyType === 'public' ? 'Send Reply' : 'Add Note'}</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="p-4 border-b border-gray-100 bg-gray-50/50">
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Properties</h3>
            </div>
            <div className="p-4 space-y-4">
              
              <div className="space-y-1.5">
                <label className="text-[12px] font-bold text-gray-500 uppercase tracking-wider flex items-center gap-2">
                  <User size={14} /> Assignee
                </label>
                <select 
                  value={ticket.assigneeId || ''}
                  disabled
                  className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-500 font-medium outline-none cursor-not-allowed"
                >
                  <option value="">{ticket.assignee?.firstName || 'Unassigned'}</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-[12px] font-bold text-gray-500 uppercase tracking-wider flex items-center gap-2">
                  <AlertCircle size={14} /> Priority
                </label>
                <select 
                  value={ticket.priority}
                  disabled
                  className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-500 font-medium outline-none cursor-not-allowed"
                >
                  <option value={ticket.priority}>{ticket.priority}</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-[12px] font-bold text-gray-500 uppercase tracking-wider flex items-center gap-2">
                  <Clock size={14} /> SLA Status
                </label>
                <div className="bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-lg px-3 py-2 text-sm font-medium flex items-center justify-between">
                  <span>First response</span>
                  <span className="font-bold">2h 45m left</span>
                </div>
              </div>

            </div>
          </div>

          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="p-4 border-b border-gray-100 bg-gray-50/50 flex justify-between items-center">
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Attachments</h3>
              <span className="text-xs font-bold text-gray-400 bg-gray-200 px-2 py-0.5 rounded-full">1</span>
            </div>
            <div className="p-4">
              <div className="flex items-center gap-3 p-3 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors cursor-pointer group">
                <div className="w-8 h-8 rounded bg-indigo-50 text-indigo-600 flex items-center justify-center">
                  <FileText size={16} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-900 truncate group-hover:text-indigo-600 transition-colors">error_logs.txt</p>
                  <p className="text-[11px] text-gray-500">12 KB</p>
                </div>
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};

export default TicketDetail;
