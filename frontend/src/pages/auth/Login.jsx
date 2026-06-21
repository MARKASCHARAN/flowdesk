import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/useAuthStore';

const Login = () => {
  const navigate = useNavigate();
  const { login, isLoading, error } = useAuthStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const success = await login({ email, password });
    if (success) {
      navigate('/app');
    }
  };

  return (
    <div className="space-y-10">
      <div>
        <h1 className="text-4xl md:text-[2.75rem] font-medium tracking-tight font-serif text-slate-900 mb-2">Sign in</h1>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <label className="text-[13px] font-bold text-slate-900" htmlFor="email">Email address</label>
          <div className="relative">
            <input 
              type="email" 
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="flex h-[3.25rem] w-full rounded-2xl border border-gray-200 bg-white px-4 py-2 text-sm placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-900 focus-visible:border-transparent transition-all" 
              placeholder="Enter your email" 
              required 
              disabled={isLoading}
            />
            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none opacity-40">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M15 12C15 13.6569 13.6569 15 12 15C10.3431 15 9 13.6569 9 12C9 10.3431 10.3431 9 12 9C13.6569 9 15 10.3431 15 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M12 9V5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-[13px] font-bold text-slate-900" htmlFor="password">Password</label>
          <input 
            type="password" 
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="flex h-[3.25rem] w-full rounded-2xl border border-gray-200 bg-white px-4 py-2 text-sm placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-900 focus-visible:border-transparent transition-all" 
            placeholder="Enter your password" 
            required 
            disabled={isLoading}
          />
        </div>

        {error && (
          <div className="text-red-500 text-sm font-medium">{error}</div>
        )}

        <div className="flex items-center justify-between pt-2">
          <button 
            type="submit" 
            disabled={isLoading}
            className="h-11 px-8 rounded-full bg-slate-950 text-white text-[13px] font-medium hover:bg-slate-800 transition-colors shadow-md shadow-slate-900/20 disabled:opacity-70 flex items-center gap-2"
          >
            {isLoading ? 'Signing in...' : 'Sign in'}
          </button>
          
          <Link to="/forgot-password" className="text-[13px] font-semibold text-slate-600 hover:text-slate-900 transition-colors">
            Forgot password?
          </Link>
        </div>
      </form>

      <div className="pt-8">
        <p className="text-[13px] text-slate-600">
          Don't have an account? <Link to="/register" className="font-semibold text-slate-900 hover:underline">Sign up</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
