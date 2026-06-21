import React from 'react';

const Placeholder = ({ title }) => {
  return (
    <div className="p-8 h-full flex flex-col items-center justify-center text-center">
      <div className="w-16 h-16 bg-indigo-100 text-indigo-600 rounded-2xl flex items-center justify-center mb-6 shadow-sm">
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 4L12 20M4 12L20 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
        </svg>
      </div>
      <h2 className="text-2xl font-bold text-slate-900 tracking-tight mb-2">{title}</h2>
      <p className="text-slate-500 max-w-sm">
        This screen is currently under construction. Check back soon for updates to the {title.toLowerCase()} module.
      </p>
    </div>
  );
};

export default Placeholder;
