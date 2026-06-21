import React from 'react';
import { MessageSquare, GitBranch, Mail } from 'lucide-react';

const IntegrationsSettings = () => {
  const integrations = [
    { id: 'slack', name: 'Slack', desc: 'Send notifications to Slack channels.', icon: MessageSquare, connected: true, color: 'text-indigo-600' },
    { id: 'github', name: 'GitHub', desc: 'Link tickets to GitHub issues and PRs.', icon: GitBranch, connected: false, color: 'text-slate-900' },
    { id: 'gmail', name: 'Gmail', desc: 'Convert incoming emails into support tickets.', icon: Mail, connected: false, color: 'text-rose-500' },
  ];

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-100">
          <h2 className="font-bold text-slate-900">Integrations</h2>
          <p className="text-sm text-gray-500 mt-1">Connect FlowDesk to your favorite tools.</p>
        </div>
        
        <div className="divide-y divide-gray-100">
          {integrations.map(int => (
            <div key={int.id} className="p-6 flex items-center justify-between hover:bg-gray-50/30 transition-colors">
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-xl bg-gray-50 border border-gray-200 flex items-center justify-center shadow-sm ${int.color}`}>
                  <int.icon size={24} />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-sm">{int.name}</h3>
                  <p className="text-sm text-gray-500">{int.desc}</p>
                </div>
              </div>
              <div>
                {int.connected ? (
                  <button className="px-4 py-2 border border-rose-200 text-rose-700 bg-rose-50 rounded-lg text-sm font-medium hover:bg-rose-100 transition-colors">
                    Disconnect
                  </button>
                ) : (
                  <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium shadow-sm hover:bg-indigo-700 transition-colors">
                    Connect
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default IntegrationsSettings;
