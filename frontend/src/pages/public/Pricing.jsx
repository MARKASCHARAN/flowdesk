import React from 'react';
import { Button } from '@/components/ui/button';

const Pricing = () => {
  return (
    <div className="container mx-auto px-4 py-20">
      <div className="text-center mb-16">
        <h1 className="text-4xl font-bold tracking-tight mb-4">Simple, transparent pricing</h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          No hidden fees. No surprise charges. Choose the plan that fits your team's needs.
        </p>
      </div>
      
      <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
        {[
          { name: "Starter", price: "$29", desc: "Perfect for small teams just getting started.", features: ["Up to 3 agents", "Basic reporting", "Email support"] },
          { name: "Professional", price: "$79", desc: "Everything you need for a growing support operation.", features: ["Up to 10 agents", "Advanced workflows", "Priority support", "Custom domains"], popular: true },
          { name: "Enterprise", price: "Custom", desc: "Advanced security and control for large organizations.", features: ["Unlimited agents", "Dedicated success manager", "SSO integration", "Custom SLA"] },
        ].map((plan, i) => (
          <div key={i} className={`p-8 rounded-3xl border ${plan.popular ? 'border-primary shadow-xl scale-105 bg-card relative' : 'border-border bg-card/50'}`}>
            {plan.popular && <span className="absolute -top-4 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground px-3 py-1 rounded-full text-xs font-semibold">Most Popular</span>}
            <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
            <div className="text-4xl font-extrabold mb-4">{plan.price}<span className="text-lg font-normal text-muted-foreground">/mo</span></div>
            <p className="text-muted-foreground mb-6">{plan.desc}</p>
            <Button className="w-full mb-8" variant={plan.popular ? 'default' : 'outline'}>Get Started</Button>
            <div className="space-y-3">
              {plan.features.map((feature, j) => (
                <div key={j} className="flex items-center text-sm">
                  <svg className="w-4 h-4 mr-3 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                  {feature}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Pricing;
