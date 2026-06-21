import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const Unauthorized = () => {
  return (
    <div className="space-y-6 text-center">
      <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
        <span className="text-2xl">🚫</span>
      </div>
      <h1 className="text-3xl font-bold tracking-tight">Access Denied</h1>
      <p className="text-muted-foreground">You do not have permission to view this page. If you believe this is a mistake, please contact your workspace administrator.</p>
      
      <div className="pt-6">
        <Link to="/app">
          <Button variant="outline" className="w-full h-11 font-bold">Return to Dashboard</Button>
        </Link>
      </div>
    </div>
  );
};

export default Unauthorized;
