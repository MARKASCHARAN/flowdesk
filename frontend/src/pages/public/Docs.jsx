import React from 'react';

const Docs = () => {
  return (
    <div className="container mx-auto px-4 py-20 flex max-w-7xl gap-10">
      <aside className="w-64 hidden lg:block flex-shrink-0">
        <div className="sticky top-24 space-y-8">
          <div>
            <h4 className="font-semibold mb-3">Getting Started</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="text-primary font-medium">Introduction</li>
              <li className="hover:text-foreground cursor-pointer transition-colors">Authentication</li>
              <li className="hover:text-foreground cursor-pointer transition-colors">Environments</li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-3">API Reference</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="hover:text-foreground cursor-pointer transition-colors">Tickets</li>
              <li className="hover:text-foreground cursor-pointer transition-colors">Customers</li>
              <li className="hover:text-foreground cursor-pointer transition-colors">Billing</li>
              <li className="hover:text-foreground cursor-pointer transition-colors">Webhooks</li>
            </ul>
          </div>
        </div>
      </aside>
      
      <div className="flex-1 max-w-3xl">
        <h1 className="text-4xl font-bold tracking-tight mb-6">Introduction to FlowDesk API</h1>
        <div className="prose prose-slate dark:prose-invert max-w-none">
          <p className="text-lg text-muted-foreground mb-8">
            The FlowDesk API is organized around REST. Our API has predictable resource-oriented URLs, accepts form-encoded request bodies, returns JSON-encoded responses, and uses standard HTTP response codes, authentication, and verbs.
          </p>
          
          <h3 className="text-2xl font-bold mb-4 mt-12">Base URL</h3>
          <div className="bg-muted p-4 rounded-lg font-mono text-sm border border-border mb-8">
            https://api.flowdesk.com/v1
          </div>
          
          <h3 className="text-2xl font-bold mb-4">Authentication</h3>
          <p className="text-muted-foreground mb-4">
            The FlowDesk API uses API keys to authenticate requests. You can view and manage your API keys in the FlowDesk Dashboard.
          </p>
          <div className="bg-slate-900 text-slate-50 p-4 rounded-lg font-mono text-sm mb-8 overflow-x-auto">
            curl https://api.flowdesk.com/v1/tickets \<br/>
            &nbsp;&nbsp;-H "Authorization: Bearer fd_test_12345"
          </div>
        </div>
      </div>
    </div>
  );
};

export default Docs;
