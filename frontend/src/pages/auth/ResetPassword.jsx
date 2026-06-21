import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const ResetPassword = () => {
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    navigate('/login');
  };

  return (
    <div className="space-y-8">
      <div className="space-y-2 text-center md:text-left">
        <h1 className="text-4xl font-bold tracking-tight">Reset password</h1>
        <p className="text-muted-foreground">Please enter your new password below.</p>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <label className="text-sm font-bold leading-none" htmlFor="password">New password</label>
          <input 
            type="password" 
            id="password"
            className="flex h-11 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2" 
            required 
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-bold leading-none" htmlFor="confirmPassword">Confirm new password</label>
          <input 
            type="password" 
            id="confirmPassword"
            className="flex h-11 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2" 
            required 
          />
        </div>
        <Button type="submit" className="w-full h-11 font-bold">Update password</Button>
      </form>
    </div>
  );
};

export default ResetPassword;
