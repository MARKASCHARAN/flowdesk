import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/useAuthStore';

const Register = () => {
  const navigate = useNavigate();
  const { register, isLoading, error } = useAuthStore();
  
  const [role, setRole] = useState('agent');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const name = `${firstName} ${lastName}`.trim();
    const payload = { email, password, name, companyName: companyName || 'Default Company' };
    
    const success = await register(payload);
    if (success) {
      navigate('/app');
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl md:text-[2.75rem] font-medium tracking-tight font-serif text-slate-900 mb-2">Sign up</h1>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        
        {/* Role Selection */}
        <div className="space-y-3">
          <label className="text-[14px] font-bold text-slate-900">Select your role</label>
          <div className="grid grid-cols-2 gap-4">
            <div 
              onClick={() => setRole('admin')}
              className={`rounded-xl p-5 cursor-pointer transition-all ${
                role === 'admin' 
                ? 'border-2 border-[#6b46c1] bg-[#f5f3ff] shadow-sm' 
                : 'border border-gray-200 bg-white hover:border-gray-300'
              }`}
            >
              <h4 className="font-bold text-[15px] mb-2 text-slate-900">Workspace Admin</h4>
              <p className="text-[13px] text-gray-500 leading-snug">Create a new workspace and invite team members</p>
            </div>
            
            <div 
              onClick={() => setRole('agent')}
              className={`rounded-xl p-5 cursor-pointer transition-all ${
                role === 'agent' 
                ? 'border-2 border-[#6b46c1] bg-[#f5f3ff] shadow-sm' 
                : 'border border-gray-200 bg-white hover:border-gray-300'
              }`}
            >
              <h4 className="font-bold text-[15px] mb-2 text-slate-900">Support Agent</h4>
              <p className="text-[13px] text-gray-500 leading-snug">Join an existing workspace with an invite code</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-[13px] font-bold text-slate-900" htmlFor="firstName">First name</label>
            <input 
              type="text" 
              id="firstName" 
              className="flex h-[3.25rem] w-full rounded-2xl border border-gray-200 bg-white px-4 py-2 text-sm placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-900 focus-visible:border-transparent transition-all" 
              placeholder="First"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              disabled={isLoading}
              required 
            />
          </div>
          <div className="space-y-2">
            <label className="text-[13px] font-bold text-slate-900" htmlFor="lastName">Last name</label>
            <input 
              type="text" 
              id="lastName" 
              className="flex h-[3.25rem] w-full rounded-2xl border border-gray-200 bg-white px-4 py-2 text-sm placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-900 focus-visible:border-transparent transition-all" 
              placeholder="Last"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              disabled={isLoading}
              required 
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-[13px] font-bold text-slate-900" htmlFor="companyName">Company / Workspace Name</label>
          <input 
            type="text" 
            id="companyName" 
            className="flex h-[3.25rem] w-full rounded-2xl border border-gray-200 bg-white px-4 py-2 text-sm placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-900 focus-visible:border-transparent transition-all" 
            placeholder="Acme Corp" 
            value={companyName}
            onChange={(e) => setCompanyName(e.target.value)}
            disabled={isLoading}
            required 
          />
        </div>

        <div className="space-y-2">
          <label className="text-[13px] font-bold text-slate-900" htmlFor="email">Email address</label>
          <input 
            type="email" 
            id="email" 
            className="flex h-[3.25rem] w-full rounded-2xl border border-gray-200 bg-white px-4 py-2 text-sm placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-900 focus-visible:border-transparent transition-all" 
            placeholder="name@example.com" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={isLoading}
            required 
          />
        </div>
        
        <div className="space-y-2">
          <label className="text-[13px] font-bold text-slate-900" htmlFor="password">Password</label>
          <input 
            type="password" 
            id="password" 
            className="flex h-[3.25rem] w-full rounded-2xl border border-gray-200 bg-white px-4 py-2 text-sm placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-900 focus-visible:border-transparent transition-all" 
            placeholder="Create a secure password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={isLoading}
            required 
          />
        </div>

        {error && (
          <div className="text-red-500 text-sm font-medium">{error}</div>
        )}

        <div className="pt-2">
          <button 
            type="submit" 
            disabled={isLoading}
            className="w-full h-11 rounded-full bg-slate-950 text-white text-[13px] font-medium hover:bg-slate-800 transition-colors shadow-md shadow-slate-900/20 disabled:opacity-70"
          >
            {isLoading ? 'Creating account...' : 'Create account'}
          </button>
        </div>
      </form>

      <div className="pt-2">
        <p className="text-[13px] text-slate-600">
          Already have an account? <Link to="/login" className="font-semibold text-slate-900 hover:underline">Sign in</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
