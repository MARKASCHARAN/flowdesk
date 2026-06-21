import React from 'react';
import { Link } from 'react-router-dom';
import { ServerCrash } from 'lucide-react';

const ServerError = () => {
  return (
    <div className="min-h-screen bg-[#FAFAFA] flex flex-col items-center justify-center p-6 text-center">
      <div className="w-24 h-24 bg-rose-50 rounded-3xl shadow-sm border border-rose-100 flex items-center justify-center mb-8 animate-pulse">
        <ServerCrash size={40} className="text-rose-500" />
      </div>
      <h1 className="text-7xl font-black text-slate-900 tracking-tighter mb-4">500</h1>
      <h2 className="text-2xl font-bold text-slate-800 tracking-tight mb-2">Internal Server Error</h2>
      <p className="text-gray-500 max-w-md mb-8">
        Something went wrong on our end. Our engineering team has been notified and is looking into it. Please try again later.
      </p>
      <div className="flex gap-4">
        <button 
          onClick={() => window.location.reload()}
          className="px-8 py-3 bg-white border border-gray-200 text-gray-700 rounded-xl text-sm font-bold shadow-sm hover:bg-gray-50 transition-colors"
        >
          Try Again
        </button>
        <Link 
          to="/app" 
          className="px-8 py-3 bg-indigo-600 text-white rounded-xl text-sm font-bold shadow-lg hover:bg-indigo-700 transition-colors"
        >
          Go to Dashboard
        </Link>
      </div>
    </div>
  );
};

export default ServerError;
