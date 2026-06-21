import React from 'react';
import { Link } from 'react-router-dom';

export const PublicFooter = () => {
  return (
    <footer className="bg-foreground text-white pt-24 pb-8 relative overflow-hidden mt-auto">
        <div className="container mx-auto px-4 max-w-7xl relative z-10">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-24">
            <div className="col-span-2 md:col-span-1">
              <h2 className="text-4xl font-black tracking-tighter">FlowDesk</h2>
            </div>
            
            <div className="space-y-4">
              <h4 className="text-primary text-xs font-bold mb-6">Home</h4>
              <ul className="space-y-3 text-sm font-bold opacity-90">
                <li><Link to="/" className="hover:text-primary transition-colors">Home</Link></li>
                <li><Link to="/features" className="hover:text-primary transition-colors">Product tour</Link></li>
                <li><Link to="/login" className="hover:text-primary transition-colors">Login</Link></li>
              </ul>
            </div>

            <div className="space-y-4">
              <h4 className="text-primary text-xs font-bold mb-6">Platform</h4>
              <ul className="space-y-3 text-sm font-bold opacity-90">
                <li><Link to="/features" className="hover:text-primary transition-colors">CRM</Link></li>
                <li><Link to="/features" className="hover:text-primary transition-colors">Ticketing</Link></li>
                <li><Link to="/features" className="hover:text-primary transition-colors">Billing</Link></li>
                <li><Link to="/features" className="hover:text-primary transition-colors">Integrations</Link></li>
              </ul>
            </div>

            <div className="space-y-4">
              <h4 className="text-primary text-xs font-bold mb-6">Features</h4>
              <ul className="space-y-3 text-sm font-bold opacity-90">
                <li><Link to="/features" className="hover:text-primary transition-colors">Real-time Comments</Link></li>
                <li><Link to="/features" className="hover:text-primary transition-colors">SLA Tracking</Link></li>
                <li><Link to="/features" className="hover:text-primary transition-colors">Webhooks</Link></li>
                <li><Link to="/features" className="hover:text-primary transition-colors">Role-based Access</Link></li>
              </ul>
            </div>

            <div className="space-y-4">
              <h4 className="text-primary text-xs font-bold mb-6">About</h4>
              <ul className="space-y-3 text-sm font-bold opacity-90">
                <li><Link to="/about" className="hover:text-primary transition-colors">About FlowDesk</Link></li>
                <li><Link to="/about" className="hover:text-primary transition-colors">Partner Program</Link></li>
                <li><Link to="/about" className="hover:text-primary transition-colors">Careers</Link></li>
              </ul>
            </div>
          </div>


          <div className="flex flex-col md:flex-row justify-between text-xs font-bold opacity-50 mb-20">
            <p>© 2026 FlowDesk AI. All Rights Reserved.</p>
            <div className="flex gap-8 mt-4 md:mt-0">
              <a href="#" className="hover:text-white transition-colors">Terms and Privacy</a>
              <a href="#" className="hover:text-white transition-colors">Terms and Conditions</a>
              <a href="#" className="hover:text-white transition-colors">Cookie Preferences</a>
            </div>
          </div>
        </div>

        {/* Huge Text */}
        <div className="w-full text-center relative z-0 overflow-hidden leading-[0.8]">
          <h1 className="text-[14vw] font-black tracking-tighter text-primary whitespace-nowrap px-4 select-none">
            Unify your flow.
          </h1>
        </div>
    </footer>
  );
};
