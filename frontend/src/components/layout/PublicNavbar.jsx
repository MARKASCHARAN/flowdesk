import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';

export const PublicNavbar = () => {
  const location = useLocation();
  const isLanding = location.pathname === '/';
  
  return (
    <nav className={`w-full z-50 px-8 py-6 flex justify-between items-center ${isLanding ? 'absolute top-0 bg-transparent' : 'sticky top-0 bg-background/95 backdrop-blur border-b border-foreground/10'}`}>
        <div className="hidden md:flex gap-10 text-[10px] font-bold tracking-[0.15em] text-foreground uppercase">
          <Link to="/features" className="hover:opacity-70 transition-opacity">Features</Link>
          <Link to="/pricing" className="hover:opacity-70 transition-opacity">Pricing</Link>
          <Link to="/about" className="hover:opacity-70 transition-opacity">About</Link>
          <Link to="/docs" className="hover:opacity-70 transition-opacity">Docs</Link>
        </div>
        
        <div className={`absolute left-1/2 -translate-x-1/2 flex items-center gap-2`}>
          <Link to="/" className="flex items-center gap-2">
            <div className="w-6 h-3 bg-foreground rounded-full -rotate-45 mb-1"></div>
            <span className="text-2xl font-bold tracking-tight text-foreground">FlowDesk</span>
          </Link>
        </div>

        <div className="hidden md:flex gap-6 items-center">
          <Link to="/login" className="text-sm font-bold uppercase tracking-widest text-foreground hover:opacity-70 transition-opacity">
            SIGN IN
          </Link>
          <Link to="/register">
            <Button className="rounded-full bg-[#6b46c1] hover:bg-[#553c9a] text-white text-sm font-bold uppercase tracking-widest px-8 h-12 shadow-md hover:scale-105 active:scale-95 transition-all">
              GET STARTED
            </Button>
          </Link>
        </div>
    </nav>
  );
};
