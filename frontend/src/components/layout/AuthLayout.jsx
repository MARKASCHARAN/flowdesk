import React from 'react';
import { Outlet, Link } from 'react-router-dom';

const AuthLayout = () => {
  return (
    <div className="min-h-screen flex bg-[#FAFAFA] p-4 md:p-6">
      <div className="flex-1 bg-white rounded-3xl border border-gray-100 flex flex-col md:flex-row shadow-sm overflow-hidden relative">
        
        {/* Left Form Side */}
        <div className="flex-1 flex flex-col relative z-10 overflow-y-auto">
          {/* Logo */}
          <div className="pt-10 px-10 md:px-20 lg:px-32">
            <Link to="/" className="text-2xl font-bold tracking-tight text-slate-900 inline-flex items-center gap-2">
              <div className="w-6 h-3 bg-slate-900 rounded-full -rotate-45 mb-1"></div>
              FlowDesk
            </Link>
          </div>
          
          <div className="flex-1 flex items-center justify-center p-10 md:px-20 lg:px-32 py-12">
            <div className="w-full max-w-[380px]">
              <Outlet />
            </div>
          </div>
        </div>
        
        {/* Right Graphic Side */}
        <div className="hidden md:flex flex-1 p-6 md:p-8">
          <div className="w-full h-full rounded-[40px] overflow-hidden relative shadow-inner">
            {/* Mesh Gradient using CSS */}
            <div className="absolute inset-0 bg-[#Fdf1cc]"></div>
            <div className="absolute top-[-20%] left-[-10%] w-[70%] h-[70%] bg-[#6EA6FF] rounded-full mix-blend-multiply filter blur-[100px] opacity-80 animate-blob"></div>
            <div className="absolute top-[20%] right-[-20%] w-[80%] h-[80%] bg-[#FFD371] rounded-full mix-blend-multiply filter blur-[120px] opacity-70 animate-blob" style={{ animationDelay: '2s' }}></div>
            <div className="absolute bottom-[-20%] left-[20%] w-[60%] h-[60%] bg-[#Fdf1cc] rounded-full mix-blend-multiply filter blur-[90px] opacity-90 animate-blob" style={{ animationDelay: '4s' }}></div>
            
            {/* Grain overlay for texture */}
            <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.65%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E")' }}></div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default AuthLayout;
