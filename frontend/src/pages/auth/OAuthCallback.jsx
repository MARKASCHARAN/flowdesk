import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const OAuthCallback = () => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // In a real app, you would extract the '?code=' from location.search
    // and send it to your backend /api/auth/oauth/callback endpoint.
    
    // Simulate network delay
    const timer = setTimeout(() => {
      navigate('/app');
    }, 1500);
    
    return () => clearTimeout(timer);
  }, [navigate, location]);

  return (
    <div className="flex flex-col items-center justify-center h-full space-y-6 py-20 text-center">
      <div className="w-10 h-10 border-4 border-slate-200 border-t-slate-900 rounded-full animate-spin"></div>
      <div>
        <h2 className="text-2xl font-serif font-medium tracking-tight text-slate-900 mb-1">Authenticating...</h2>
        <p className="text-[13px] text-slate-500">Securing your session.</p>
      </div>
    </div>
  );
};

export default OAuthCallback;
