import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const VerifyEmail = () => {
  return (
    <div className="space-y-6 text-center">
      <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
        <span className="text-2xl text-green-600">✓</span>
      </div>
      <h1 className="text-3xl font-bold tracking-tight">Email Verified!</h1>
      <p className="text-muted-foreground">Your email has been successfully verified. You can now access your workspace.</p>
      
      <div className="pt-6">
        <Link to="/app">
          <Button className="w-full h-11 font-bold">Go to Dashboard</Button>
        </Link>
      </div>
    </div>
  );
};

export default VerifyEmail;
