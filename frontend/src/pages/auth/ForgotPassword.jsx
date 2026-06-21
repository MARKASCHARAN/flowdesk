import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const ForgotPassword = () => {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="space-y-6 text-center">
        <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
          <span className="text-2xl">✉️</span>
        </div>
        <h1 className="text-3xl font-bold tracking-tight">Check your email</h1>
        <p className="text-muted-foreground">We've sent a password reset link to your email address.</p>
        <Button onClick={() => setSubmitted(false)} variant="outline" className="mt-8 font-bold">Back to reset</Button>
        <div className="mt-4">
          <Link to="/login" className="text-sm font-bold text-primary hover:underline">Return to sign in</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="space-y-2 text-center md:text-left">
        <h1 className="text-4xl font-bold tracking-tight">Forgot password</h1>
        <p className="text-muted-foreground">Enter your email and we'll send you a reset link.</p>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <label className="text-sm font-bold leading-none" htmlFor="email">Email address</label>
          <input 
            type="email" 
            id="email"
            className="flex h-11 w-full rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2" 
            placeholder="name@example.com" 
            required 
          />
        </div>
        <Button type="submit" className="w-full h-11 font-bold">Send reset link</Button>
      </form>

      <div className="text-center text-sm font-medium">
        Remember your password? <Link to="/login" className="font-bold text-primary hover:underline">Sign in</Link>
      </div>
    </div>
  );
};

export default ForgotPassword;
