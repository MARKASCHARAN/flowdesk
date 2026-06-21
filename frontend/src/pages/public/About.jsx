import React from 'react';

const About = () => {
  return (
    <div className="container mx-auto px-4 py-20 max-w-4xl">
      <h1 className="text-5xl font-bold tracking-tight mb-8">About FlowDesk</h1>
      <div className="prose prose-lg dark:prose-invert">
        <p className="text-xl text-muted-foreground leading-relaxed mb-8">
          FlowDesk was founded with a single mission: to unify the fragmented tools that modern businesses use to manage their customers. We believe that customer support, CRM, and billing should exist in one seamless, real-time environment.
        </p>
        <div className="aspect-video w-full rounded-2xl bg-muted border border-border flex items-center justify-center mb-12">
          <span className="text-muted-foreground font-medium">Team Photo Placeholder</span>
        </div>
        <h2 className="text-2xl font-bold mb-4">Our Values</h2>
        <ul className="space-y-4 text-muted-foreground list-disc pl-6">
          <li><strong>Customer Obsession:</strong> We build features that solve real problems.</li>
          <li><strong>Engineering Excellence:</strong> We value robust, backend-heavy systems that scale reliably.</li>
          <li><strong>Design Elegance:</strong> Powerful tools don't have to be complicated or ugly.</li>
        </ul>
      </div>
    </div>
  );
};

export default About;
