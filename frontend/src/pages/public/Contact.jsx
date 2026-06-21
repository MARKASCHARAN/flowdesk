import React from 'react';
import { Button } from '@/components/ui/button';

const Contact = () => {
  return (
    <div className="container mx-auto px-4 py-20 max-w-2xl">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold tracking-tight mb-4">Get in touch</h1>
        <p className="text-lg text-muted-foreground">
          Have questions about pricing, features, or enterprise plans? Our team is here to help.
        </p>
      </div>
      
      <form className="space-y-6 bg-card p-8 rounded-3xl border border-border shadow-sm">
        <div className="grid grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-medium">First name</label>
            <input type="text" className="w-full px-3 py-2 border border-input rounded-md bg-transparent" placeholder="Jane" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Last name</label>
            <input type="text" className="w-full px-3 py-2 border border-input rounded-md bg-transparent" placeholder="Doe" />
          </div>
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Email address</label>
          <input type="email" className="w-full px-3 py-2 border border-input rounded-md bg-transparent" placeholder="jane@example.com" />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Message</label>
          <textarea className="w-full px-3 py-2 border border-input rounded-md bg-transparent min-h-[120px]" placeholder="How can we help you?"></textarea>
        </div>
        <Button className="w-full" size="lg">Send Message</Button>
      </form>
    </div>
  );
};

export default Contact;
