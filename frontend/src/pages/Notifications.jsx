import React from 'react';
import { Bell, Ticket, Users, CreditCard, MessageSquare, CheckCircle2, Loader2 } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { notificationsService } from '../services/notifications.service';

const getIconForType = (type) => {
  switch(type) {
    case 'ticket': return { icon: Ticket, color: 'bg-indigo-100 text-indigo-600' };
    case 'mention': return { icon: MessageSquare, color: 'bg-amber-100 text-amber-600' };
    case 'team': return { icon: Users, color: 'bg-emerald-100 text-emerald-600' };
    case 'billing': return { icon: CreditCard, color: 'bg-blue-100 text-blue-600' };
    default: return { icon: Bell, color: 'bg-gray-100 text-gray-600' };
  }
};

const Notifications = () => {
  const queryClient = useQueryClient();

  const { data: response, isLoading } = useQuery({
    queryKey: ['notifications'],
    queryFn: () => notificationsService.getNotifications()
  });

  const markAllAsReadMutation = useMutation({
    mutationFn: () => notificationsService.markAllAsRead(),
    onSuccess: () => queryClient.invalidateQueries(['notifications'])
  });

  const markAsReadMutation = useMutation({
    mutationFn: (id) => notificationsService.markAsRead(id),
    onSuccess: () => queryClient.invalidateQueries(['notifications'])
  });

  const notifs = response?.data || [];


  return (
    <div className="p-6 md:p-8 lg:p-10 max-w-3xl mx-auto space-y-6">
      <div className="flex justify-between items-center mb-2">
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
          <Bell className="text-indigo-600" /> Notifications
        </h1>
        <button 
          onClick={() => markAllAsReadMutation.mutate()}
          className="flex items-center gap-2 text-sm font-medium text-indigo-600 hover:text-indigo-700 transition-colors disabled:opacity-50"
          disabled={markAllAsReadMutation.isLoading}
        >
          <CheckCircle2 size={16} /> Mark all as read
        </button>
      </div>

      <div className="bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="divide-y divide-gray-100">
          {isLoading ? (
            <div className="p-12 flex justify-center">
              <Loader2 className="animate-spin text-indigo-600" />
            </div>
          ) : notifs.length === 0 ? (
            <div className="p-12 text-center text-gray-500 font-medium">
              You're all caught up!
            </div>
          ) : (
            notifs.map(n => {
              const { icon: Icon, color } = getIconForType(n.type);
              return (
                <div 
                  key={n.id} 
                  onClick={() => !n.isRead && markAsReadMutation.mutate(n.id)}
                  className={`p-6 hover:bg-gray-50/50 transition-colors cursor-pointer flex gap-4 ${!n.isRead ? 'bg-indigo-50/20' : ''}`}
                >
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${color}`}>
                    <Icon size={18} />
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <h4 className={`text-sm ${!n.isRead ? 'font-bold' : 'font-medium'} text-slate-900`}>{n.title}</h4>
                      <span className="text-[11px] font-medium text-gray-400">
                        {new Date(n.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500 mt-1">{n.body}</p>
                  </div>
                  {!n.isRead && (
                    <div className="w-2 h-2 rounded-full bg-indigo-600 mt-1.5" />
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};

export default Notifications;
