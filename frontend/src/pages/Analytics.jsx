import React from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, ReferenceLine, LineChart, Line, Dot, CartesianGrid
} from 'recharts';
import { MoreHorizontal, ChevronDown, ArrowUp, Loader2 } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { analyticsService } from '../services/analytics.service';

// --- MOCK DATA ---
const performanceData = [
  { name: '1', filled: 19, unfilled: 81, color: '#2C5254' },
  { name: '2', filled: 65, unfilled: 35, color: '#FFFFFF' },
  { name: '3', filled: 87, unfilled: 13, color: '#D6FA4A' },
  { name: '4', filled: 34, unfilled: 66, color: '#2C5254' },
];

const efficiencyData = [
  { name: '14 Jul', value: 40 },
  { name: '15 Jul', value: 35 },
  { name: '16 Jul', value: 87 },
  { name: '17 Jul', value: 20 },
  { name: '18 Jul', value: 30 },
];

const activityData = [
  { name: 'Mon', in: 60, out: -50 },
  { name: 'Tue', in: 20, out: -15 },
  { name: 'Wed', in: 50, out: -35 },
  { name: 'Thu', in: 80, out: -60 },
  { name: 'Fri', in: 45, out: -30 },
  { name: 'Sat', in: 75, out: -40 },
  { name: 'Sun', in: 25, out: -15 },
];

const CustomPerformanceBar = (props) => {
  const { fill, x, y, width, height } = props;
  return <rect x={x} y={y} width={width} height={height} fill={fill} />;
};

const CustomDot = (props) => {
  const { cx, cy, payload } = props;
  return (
    <circle 
      cx={cx} 
      cy={cy} 
      r={4} 
      stroke="#D6FA4A" 
      strokeWidth={2} 
      fill="#1A2226" 
    />
  );
};

const Analytics = () => {
  const { data: response, isLoading } = useQuery({
    queryKey: ['analytics-dashboard'],
    queryFn: () => analyticsService.getDashboardMetrics(),
    retry: false
  });

  // Map API response to chart structures, falling back to gorgeous mock data if missing
  const apiData = response?.data || {};
  
  const currentPerformanceData = apiData.performanceData || performanceData;
  const currentEfficiencyData = apiData.efficiencyData || efficiencyData;
  const currentActivityData = apiData.activityData || activityData;
  
  const budgetUsage = apiData.budgetUsage || "$50,734";
  const customerRating = apiData.customerRating || "4.8";
  const completedTasks = apiData.completedTasks || "85%";
  const avgTime = apiData.avgTime || "3.5";

  if (isLoading) {
    return (
      <div className="bg-[#1A2226] min-h-[calc(100vh-120px)] rounded-[32px] p-6 lg:p-10 text-[#E8F0F2] flex items-center justify-center">
        <Loader2 className="animate-spin text-[#D6FA4A] w-12 h-12" />
      </div>
    );
  }

  return (
    <div className="bg-[#1A2226] min-h-[calc(100vh-120px)] rounded-[32px] p-6 lg:p-10 text-[#E8F0F2] font-sans">
      
      {/* SVG Definitions for Patterns */}
      <svg width="0" height="0" className="absolute">
        <defs>
          <pattern id="diagonalHatch" patternUnits="userSpaceOnUse" width="10" height="10" patternTransform="rotate(45)">
            <line x1="0" y1="0" x2="0" y2="10" stroke="#FFFFFF" strokeWidth="1" strokeOpacity="0.05" />
          </pattern>
          <pattern id="diagonalHatchDark" patternUnits="userSpaceOnUse" width="10" height="10" patternTransform="rotate(45)">
            <line x1="0" y1="0" x2="0" y2="10" stroke="#FFFFFF" strokeWidth="1" strokeOpacity="0.1" />
          </pattern>
        </defs>
      </svg>

      <div className="max-w-[1200px] mx-auto flex flex-col gap-6">
        
        {/* TOP ROW: Budget & Performance */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* BUDGET USAGE */}
          <div className="bg-[#1D262B] border border-[#2A363A] rounded-[24px] p-8 flex flex-col justify-between min-h-[340px]">
            <div>
              <div className="text-[#8B9A9F] font-mono text-[13px] tracking-wide mb-2 uppercase">Budget usage</div>
              <div className="text-[48px] font-medium leading-none mb-10">{budgetUsage}</div>
            </div>

            <div>
              {/* Stacked Progress Bar Visual */}
              <div className="relative h-14 w-full">
                {/* Background Hatched Track */}
                <div className="absolute inset-x-0 bottom-0 h-4 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMCIgaGVpZ2h0PSIxMCI+PHBhdHRlcm4gaWQ9InAiIHdpZHRoPSIxMCIgaGVpZ2h0PSIxMCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSIgcGF0dGVyblRyYW5zZm9ybT0icm90YXRlKDQ1KSI+PGxpbmUgeDE9IjAiIHkxPSIwIiB4Mj0iMCIgeTI9IjEwIiBzdHJva2U9IiMzRDRENTUiIHN0cm9rZS13aWR0aD0iMSIgLz48L3BhdHRlcm4+PHJlY3Qgd2lkdGg9IjEwJSIgaGVpZ2h0PSIxMCUiIGZpbGw9InVybCgjcCkiIC8+PC9zdmc+')] opacity-50" />
                
                {/* Bars */}
                <div className="absolute bottom-0 left-0 h-2 bg-[#D6FA4A] w-[50%] rounded-l-sm" />
                <div className="absolute bottom-0 left-[50%] h-2 bg-[#C4B5FD] w-[30%]" />
                <div className="absolute bottom-0 left-[80%] h-2 bg-[#FFFFFF] w-[20%] rounded-r-sm" />

                {/* Markers */}
                <div className="absolute bottom-4 left-0 text-[#E8F0F2] font-mono text-[12px]">
                  <div className="w-px h-10 bg-[#3D4D55] absolute -bottom-2 left-0" />
                  <span className="relative -top-6">50%</span>
                </div>
                <div className="absolute bottom-4 left-[50%] text-[#E8F0F2] font-mono text-[12px]">
                  <div className="w-px h-10 bg-[#3D4D55] absolute -bottom-2 left-0" />
                  <span className="relative -top-6">30%</span>
                </div>
                <div className="absolute bottom-4 left-[80%] text-[#E8F0F2] font-mono text-[12px]">
                  <div className="w-px h-10 bg-[#3D4D55] absolute -bottom-2 left-0" />
                  <span className="relative -top-6">20%</span>
                </div>
              </div>

              {/* Legend */}
              <div className="flex items-center gap-6 mt-8 font-mono text-[12px] text-[#8B9A9F]">
                <div className="flex items-center gap-2"><div className="w-2.5 h-2.5 rounded-full bg-[#D6FA4A]"/> Unused</div>
                <div className="flex items-center gap-2"><div className="w-2.5 h-2.5 rounded-full bg-[#C4B5FD]"/> Used</div>
                <div className="flex items-center gap-2"><div className="w-2.5 h-2.5 rounded-full bg-[#FFFFFF]"/> Reserved</div>
              </div>
            </div>
          </div>

          {/* PERFORMANCE */}
          <div className="bg-[#1D262B] border border-[#2A363A] rounded-[24px] p-8 min-h-[340px] flex flex-col relative">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-[22px] font-medium">Performance</h2>
              <button className="text-[#8B9A9F] font-mono text-[13px] flex items-center gap-1 hover:text-white transition-colors">
                QA team <ChevronDown size={14} />
              </button>
            </div>

            <div className="flex-1 h-[200px] w-full mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={currentPerformanceData} margin={{ top: 20, right: 0, left: 0, bottom: 0 }} barCategoryGap={15}>
                  {/* Dashed background line at 80% mark */}
                  <ReferenceLine y={80} stroke="#E8F0F2" strokeDasharray="4 4" strokeOpacity={0.5} />
                  
                  {/* Unfilled Part (Hatched) */}
                  <Bar dataKey="unfilled" stackId="a" fill="url(#diagonalHatch)" />
                  
                  {/* Filled Part */}
                  <Bar dataKey="filled" stackId="a" isAnimationActive={false}>
                    {
                      currentPerformanceData.map((entry, index) => (
                        <rect key={`cell-${index}`} fill={entry.color} />
                      ))
                    }
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Custom Overlay for Bar Values and Tooltips */}
            <div className="absolute bottom-[88px] left-[32px] right-[32px] flex justify-between px-6 pointer-events-none">
              <span className="text-[#E8F0F2] font-mono text-[12px]">19%</span>
              <span className="text-[#1A2226] font-mono text-[12px] -ml-2">65%</span>
              <span className="text-[#1A2226] font-mono text-[12px] -ml-2">87%</span>
              <span className="text-[#E8F0F2] font-mono text-[12px]">34%</span>
            </div>

            {/* +12% Pill on 3rd Bar */}
            <div className="absolute top-[80px] right-[32%] z-10 pointer-events-none">
               <div className="bg-[#1A2226] text-white text-[12px] font-mono px-2 py-1 rounded-full flex items-center gap-1 border border-[#2A363A]">
                 <ArrowUp size={12} className="text-white"/> 12%
               </div>
            </div>

            {/* Avatars */}
            <div className="flex justify-between items-center px-4 mt-6">
              <img src="https://i.pravatar.cc/150?img=1" className="w-10 h-10 rounded-full border-2 border-[#1A2226] object-cover" />
              <img src="https://i.pravatar.cc/150?img=5" className="w-10 h-10 rounded-full border-2 border-[#1A2226] object-cover" />
              <img src="https://i.pravatar.cc/150?img=9" className="w-10 h-10 rounded-full border-2 border-[#1A2226] object-cover" />
              <img src="https://i.pravatar.cc/150?img=12" className="w-10 h-10 rounded-full border-2 border-[#1A2226] object-cover" />
            </div>
          </div>
        </div>

        {/* MIDDLE ROW: Efficiency & Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* WORK EFFICIENCY */}
          <div className="bg-[#1D262B] border border-[#2A363A] rounded-[24px] p-8 min-h-[340px] flex flex-col relative">
            <div className="flex justify-between items-center mb-8 relative z-10">
              <h2 className="text-[22px] font-medium">Work efficiency</h2>
              <button className="text-[#8B9A9F] hover:text-white transition-colors">
                <MoreHorizontal size={20} />
              </button>
            </div>

            {/* Background Dashed Line (50%) */}
            <div className="absolute top-[45%] left-0 right-0 border-t border-dashed border-[#8B9A9F]/20 pointer-events-none" />

            {/* Vertical Crosshair Line */}
            <div className="absolute top-[30%] bottom-8 left-[50%] -translate-x-[20px] border-l border-dashed border-[#8B9A9F]/40 pointer-events-none z-0" />

            <div className="flex-1 w-full -mx-4 mt-8 relative z-10">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={currentEfficiencyData} margin={{ top: 20, right: 10, left: 10, bottom: 0 }}>
                  <XAxis 
                    dataKey="name" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: '#8B9A9F', fontSize: 13, fontFamily: 'monospace' }}
                    dy={10}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="value" 
                    stroke="#D6FA4A" 
                    strokeWidth={2} 
                    dot={<CustomDot />} 
                    activeDot={{ r: 6, fill: "#D6FA4A" }} 
                    isAnimationActive={false}
                  />
                </LineChart>
              </ResponsiveContainer>
              
              {/* Tooltip Pill */}
              <div className="absolute top-[5px] left-[50%] -translate-x-[20px] bg-[#1A2226] text-white font-mono text-[12px] px-2 py-1 rounded-full border border-[#2A363A]">
                87%
              </div>
            </div>
          </div>

          {/* ACTIVITY */}
          <div className="bg-[#1D262B] border border-[#2A363A] rounded-[24px] p-8 min-h-[340px] flex flex-col">
            <div className="flex justify-between items-center mb-8 relative z-10">
              <h2 className="text-[22px] font-medium">Activity</h2>
              <button className="text-[#8B9A9F] font-mono text-[13px] flex items-center gap-1 hover:text-white transition-colors">
                QA team <ChevronDown size={14} />
              </button>
            </div>

            <div className="flex-1 w-full relative z-10">
              {/* Zero Axis Line */}
              <div className="absolute top-[50%] left-4 right-4 h-px bg-[#8B9A9F]/30" />
              
              {/* Grid vertical dashed lines */}
              <div className="absolute inset-x-8 top-0 bottom-8 flex justify-between pointer-events-none">
                {[1,2,3,4,5,6,7].map(i => <div key={i} className="w-px h-full border-r border-dashed border-[#8B9A9F]/20" />)}
              </div>

              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={currentActivityData} margin={{ top: 0, right: 0, left: 0, bottom: 0 }} barSize={8}>
                  <XAxis 
                    dataKey="name" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: '#8B9A9F', fontSize: 13, fontFamily: 'monospace' }}
                    dy={10}
                  />
                  <Bar dataKey="in" fill="#C4B5FD" radius={[2, 2, 0, 0]} />
                  <Bar dataKey="out" fill="#2C5254" radius={[0, 0, 2, 2]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* BOTTOM ROW: Small KPIs */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-[#1D262B] border border-[#2A363A] rounded-[24px] p-6 flex justify-between items-center h-[120px]">
            <div>
              <div className="text-[#8B9A9F] font-mono text-[13px] mb-2">Customer rating</div>
              <div className="text-[36px] font-medium leading-none">{customerRating}</div>
            </div>
            <button className="text-[#8B9A9F] hover:text-white mt-[-30px]">
              <MoreHorizontal size={20} />
            </button>
          </div>

          <div className="bg-[#1D262B] border border-[#2A363A] rounded-[24px] p-6 flex justify-between items-center h-[120px]">
            <div>
              <div className="text-[#8B9A9F] font-mono text-[13px] mb-2">Completed tasks</div>
              <div className="text-[36px] font-medium leading-none">{completedTasks}</div>
            </div>
            <button className="text-[#8B9A9F] hover:text-white mt-[-30px]">
              <MoreHorizontal size={20} />
            </button>
          </div>

          <div className="bg-[#1D262B] border border-[#2A363A] rounded-[24px] p-6 flex justify-between items-center h-[120px]">
            <div>
              <div className="text-[#8B9A9F] font-mono text-[13px] mb-2">Avg. time</div>
              <div className="text-[36px] font-medium leading-none">{avgTime} <span className="text-[20px] text-[#8B9A9F] ml-1">h</span></div>
            </div>
            <div className="bg-[#D6FA4A] text-[#1A2226] text-[13px] font-mono px-3 py-1 rounded-full flex items-center gap-1 font-bold mt-[-30px]">
              <ArrowUp size={14} /> 3%
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Analytics;
