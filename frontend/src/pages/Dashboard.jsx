import React from 'react';
import { 
  MoreVertical, ChevronDown, Monitor, Server, ShoppingCart, ArrowRight, Loader2
} from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { adminService } from '../services/admin.service';
import { ticketsService } from '../services/tickets.service';

const Dashboard = () => {
  const { data: statsRes, isLoading: isStatsLoading } = useQuery({
    queryKey: ['dashboardStats'],
    queryFn: () => adminService.getDashboardStats()
  });

  const { data: ticketsRes, isLoading: isTicketsLoading } = useQuery({
    queryKey: ['tickets'],
    queryFn: () => ticketsService.getTickets()
  });

  const stats = statsRes?.data || { totalTickets: 0, openTickets: 0, resolvedTickets: 0, totalCustomers: 0 };
  const tickets = ticketsRes?.data?.tickets || [];

  // Sort tickets by createdAt descending and take top 4
  const recentTickets = [...tickets]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 4)
    .map((t, i) => ({
      name: t.customer?.name || t.title,
      status: t.status,
      statusColor: t.status === 'open' ? '#FF5A5A' : t.status === 'in_progress' ? '#FDE047' : '#B1F136',
      amount: t.priority,
      date: new Date(t.createdAt).toLocaleDateString(),
      img: `https://i.pravatar.cc/150?img=${(i + 1) * 10}`
    }));

  // Waffle Chart Data (7 cols x 5 rows) - keeping static structure but representing activity
  const waffleData = [
    [0, 0, 0, 0, 1, 0, 0],
    [0, 0, 0, 0, 1, 0, 0],
    [0, 1, 0, 0, 1, 1, 0],
    [0, 1, 1, 1, 1, 1, 0],
    [1, 1, 1, 1, 1, 1, 1],
  ];

  const topCategories = [
    { name: 'Total Customers', count: stats.totalCustomers, growth: '+12%', color: '#E4F4B8', icon: <ShoppingCart size={18} className="text-black" /> },
    { name: 'Open Tickets', count: stats.openTickets, growth: 'Active', color: '#C6DDF8', icon: <Server size={18} className="text-black" /> },
    { name: 'Resolved Tickets', count: stats.resolvedTickets, growth: 'Done', color: '#FACBC5', icon: <Monitor size={18} className="text-black" /> },
  ];

  const returningVisits = [
    { month: 'Jan', percent: 40 },
    { month: 'Feb', percent: 60 },
    { month: 'Mar', percent: 45 },
    { month: 'Apr', percent: 20 },
    { month: 'May', percent: 35 },
    { month: 'Jun', percent: 75 },
  ];

  if (isStatsLoading || isTicketsLoading) {
    return (
      <div className="flex items-center justify-center h-[50vh]">
        <Loader2 className="animate-spin text-indigo-600" size={32} />
      </div>
    );
  }

  return (
    <div className="w-full max-w-[1400px] mx-auto animate-in fade-in duration-500 font-sans text-black">
      
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        
        {/* === LEFT COLUMN === */}
        <div className="xl:col-span-8 flex flex-col gap-6">
          
          {/* CARD 1: Ticket Volume Summary */}
          <div className="bg-white rounded-[32px] p-8 shadow-[0_8px_30px_rgba(0,0,0,0.03)] border border-gray-50">
            <div className="flex justify-between items-center mb-10">
              <h2 className="text-[20px] font-medium text-gray-800">Ticket Volume Summary</h2>
              <button className="text-gray-500 text-[13px] flex items-center gap-1 hover:text-black">
                January - June 2024 <ChevronDown size={14} />
              </button>
            </div>

            <div className="flex flex-col lg:flex-row gap-12 lg:gap-8">
              {/* Stats Side */}
              <div className="flex-1">
                <div className="text-gray-500 text-[13px] mb-1">Total Tickets</div>
                <div className="flex items-center gap-3 mb-10">
                  <span className="text-[36px] font-medium leading-none">{stats.totalTickets}</span>
                  <span className="bg-[#B1F136] text-black text-[12px] font-bold px-2 py-0.5 rounded-[4px]">+12%</span>
                </div>

                <div className="space-y-5 mb-10">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600 text-[13px] w-[120px]">Resolved</span>
                    <div className="flex-1 flex items-center gap-1 max-w-[100px]">
                      <div className="h-1.5 bg-[#4B8DF8]" style={{ width: `${stats.totalTickets ? (stats.resolvedTickets / stats.totalTickets) * 100 : 0}%` }} />
                      <div className="h-1.5 bg-gray-200 flex-1" />
                    </div>
                    <span className="text-black text-[13px] font-mono w-[60px] text-right">{stats.resolvedTickets}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600 text-[13px] w-[120px]">Open</span>
                    <div className="flex-1 flex items-center gap-1 max-w-[100px]">
                      <div className="h-1.5 bg-[#4B8DF8]" style={{ width: `${stats.totalTickets ? (stats.openTickets / stats.totalTickets) * 100 : 0}%` }} />
                      <div className="h-1.5 bg-gray-200 flex-1" />
                    </div>
                    <span className="text-black text-[13px] font-mono w-[60px] text-right">{stats.openTickets}</span>
                  </div>
                </div>

                <div className="pt-6 border-t border-gray-100 flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full border-[3px] border-[#4B8DF8] border-r-transparent rotate-45" />
                  <span className="text-[14px] text-gray-800"><span className="font-bold">92%</span> SLA compliance reached</span>
                </div>
              </div>

              {/* Waffle Chart Side */}
              <div className="lg:w-[340px] flex flex-col pt-4">
                <div className="flex-1 w-full grid grid-cols-7 gap-1">
                  {waffleData.map((row, rIdx) => (
                    row.map((cell, cIdx) => (
                      <div 
                        key={`${rIdx}-${cIdx}`} 
                        className={`aspect-square w-full rounded-[2px] ${cell === 1 ? 'bg-[#4B8DF8]' : 'bg-[#E5E9F0]'}`}
                        style={{ position: 'relative' }}
                      >
                        {/* Fake Tooltip for the specific peak block */}
                        {rIdx === 0 && cIdx === 4 && cell === 1 && (
                          <div className="absolute bottom-[calc(100%+8px)] left-1/2 -translate-x-1/2 bg-[#1E293B] text-white text-[12px] font-mono px-2 py-1 rounded-[4px] whitespace-nowrap z-10">
                            Peak
                            <div className="absolute top-full left-1/2 -translate-x-1/2 border-[4px] border-transparent border-t-[#1E293B]" />
                          </div>
                        )}
                      </div>
                    ))
                  ))}
                </div>
                {/* Labels */}
                <div className="grid grid-cols-7 gap-1 mt-2">
                  {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', ''].map((lbl, i) => (
                    <div key={i} className="text-center text-[12px] text-gray-500">{lbl}</div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* CARD 2: Recent Tickets */}
          <div className="bg-white rounded-[32px] p-8 shadow-[0_8px_30px_rgba(0,0,0,0.03)] border border-gray-50">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-[20px] font-medium text-gray-800">Recent Tickets</h2>
              <button className="text-gray-500 text-[13px] flex items-center gap-2 border border-gray-200 px-3 py-1.5 rounded-[4px] hover:bg-gray-50">
                <CalendarIcon /> Recent Activity
              </button>
            </div>

            <div className="w-full">
              {recentTickets.length === 0 ? (
                <div className="text-center py-8 text-gray-500 text-sm">No recent tickets</div>
              ) : (
                recentTickets.map((order, idx) => (
                  <div key={idx} className="flex items-center justify-between py-4 border-b border-gray-100 last:border-0 hover:bg-gray-50/50 transition-colors -mx-4 px-4 rounded-sm">
                    
                    {/* Avatar & Name */}
                    <div className="flex items-center gap-4 w-[240px]">
                      <div className="w-10 h-10 rounded-[4px] bg-[#EEF2F6] overflow-hidden shrink-0">
                        <img src={order.img} alt={order.name} className="w-full h-full object-cover mix-blend-multiply" />
                      </div>
                      <span className="text-[14px] font-bold text-gray-800 truncate">{order.name}</span>
                    </div>

                    {/* Status */}
                    <div className="flex items-center gap-2 w-[120px]">
                      <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: order.statusColor }} />
                      <span className="text-[13px] text-gray-600 capitalize">{order.status.replace('_', ' ')}</span>
                    </div>

                    {/* Priority */}
                    <div className="text-[13px] font-mono text-gray-800 w-[80px] capitalize">
                      {order.amount}
                    </div>

                    {/* Date */}
                    <div className="text-[13px] font-mono text-gray-500 w-[100px] text-right">
                      {order.date}
                    </div>

                    {/* Action */}
                    <button className="text-gray-400 hover:text-black">
                      <MoreVertical size={18} />
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>

        </div>

        {/* === RIGHT COLUMN === */}
        <div className="xl:col-span-4 flex flex-col gap-6">
          
          {/* CARD 3: Top Categories */}
          <div className="bg-white rounded-[32px] p-8 shadow-[0_8px_30px_rgba(0,0,0,0.03)] border border-gray-50">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-[20px] font-medium text-gray-800">Overview Stats</h2>
              <button className="text-gray-400 hover:text-black">
                <MoreVertical size={18} />
              </button>
            </div>

            <div className="space-y-6">
              {topCategories.map((cat, idx) => (
                <div key={idx} className="flex items-center justify-between pb-6 border-b border-gray-100 last:border-0 last:pb-0">
                  <div className="flex items-center gap-4">
                    <div 
                      className="w-10 h-10 rounded-[4px] flex items-center justify-center shrink-0"
                      style={{ backgroundColor: cat.color }}
                    >
                      {cat.icon}
                    </div>
                    <div>
                      <div className="text-[13px] text-gray-500 mb-0.5">{cat.name}</div>
                      <div className="text-[15px] font-mono font-medium">{cat.count}</div>
                    </div>
                  </div>
                  <div className="text-[13px] text-gray-600">{cat.growth}</div>
                </div>
              ))}
            </div>
          </div>

          {/* CARD 4: CSAT */}
          <div className="bg-white rounded-[32px] p-8 shadow-[0_8px_30px_rgba(0,0,0,0.03)] border border-gray-50">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-[20px] font-medium text-gray-800">Customer Satisfaction</h2>
              <button className="text-gray-400 hover:text-black">
                <MoreVertical size={18} />
              </button>
            </div>

            {/* Horizontal Bar Chart */}
            <div className="space-y-4 mb-10">
              {returningVisits.map((item, idx) => (
                <div key={idx} className="flex items-center gap-4">
                  <div className="flex-1 flex items-center h-4 bg-[#EEF2F6] rounded-sm overflow-hidden">
                    <div 
                      className="h-full bg-[#B1F136]"
                      style={{ width: `${item.percent}%` }}
                    />
                  </div>
                  <div className="w-[30px] text-right text-[12px] text-gray-500">{item.month}</div>
                </div>
              ))}
            </div>

            {/* Footer Stats */}
            <div className="flex items-center gap-4 mb-6">
              <div className="text-[14px] text-gray-600"><span className="font-bold text-black">+730</span> ratings this half year</div>
              <div className="w-px h-4 bg-gray-200" />
              <div className="text-[14px] text-gray-600"><span className="font-bold text-black">4%</span> growth</div>
            </div>

            <button className="w-full bg-[#F5F7FA] hover:bg-[#EDF1F5] transition-colors rounded-[4px] py-3 flex items-center justify-between px-4">
              <span className="text-[13px] text-gray-600">Increasing the response rate</span>
              <ArrowRight size={16} className="text-gray-400" />
            </button>

          </div>

        </div>
      </div>
      
    </div>
  );
};

// SVG Icon for Calendar
const CalendarIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
    <line x1="16" y1="2" x2="16" y2="6"></line>
    <line x1="8" y1="2" x2="8" y2="6"></line>
    <line x1="3" y1="10" x2="21" y2="10"></line>
  </svg>
);

export default Dashboard;
