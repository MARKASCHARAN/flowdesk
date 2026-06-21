import React from 'react';
import { Link } from 'react-router-dom';
import { FileQuestion } from 'lucide-react';

const NotFound = () => {
  return (
    <div className="min-h-screen bg-[#FAFAFA] flex flex-col items-center justify-center p-6 text-center">
      <div className="w-24 h-24 bg-white rounded-3xl shadow-sm border border-gray-200 flex items-center justify-center mb-8 rotate-12">
        <FileQuestion size={40} className="text-indigo-600 -rotate-12" />
      </div>
      <h1 className="text-7xl font-black text-slate-900 tracking-tighter mb-4">404</h1>
      <h2 className="text-2xl font-bold text-slate-800 tracking-tight mb-2">Page Not Found</h2>
      <p className="text-gray-500 max-w-md mb-8">
        We can't seem to find the page you're looking for. It might have been removed, renamed, or didn't exist in the first place.
      </p>
      <Link 
        to="/app" 
        className="px-8 py-3 bg-slate-900 text-white rounded-xl text-sm font-bold shadow-lg hover:bg-slate-800 transition-all hover:scale-105 active:scale-95"
      >
        Take Me Home
      </Link>
    </div>
  );
};

export default NotFound;
