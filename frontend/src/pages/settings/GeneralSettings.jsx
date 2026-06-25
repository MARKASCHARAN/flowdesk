import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { tenantsService } from '../../services/tenants.service';
import { Loader2, CheckCircle2 } from 'lucide-react';

const GeneralSettings = () => {
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState({ name: '', supportEmail: '' });

  const { data: tenantRes, isLoading } = useQuery({
    queryKey: ['tenant'],
    queryFn: () => tenantsService.getTenant()
  });

  const tenant = tenantRes?.data;

  useEffect(() => {
    if (tenant) {
      setFormData({
        name: tenant.name || '',
        supportEmail: tenant.supportEmail || ''
      });
    }
  }, [tenant]);

  const updateMutation = useMutation({
    mutationFn: (data) => tenantsService.updateTenant(data),
    onSuccess: () => {
      queryClient.invalidateQueries(['tenant']);
      setTimeout(() => updateMutation.reset(), 3000);
    }
  });

  const handleSave = () => {
    updateMutation.mutate(formData);
  };
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-100">
          <h2 className="font-bold text-slate-900">Workspace Profile</h2>
          <p className="text-sm text-gray-500 mt-1">This information will be displayed publicly on your support portal.</p>
        </div>
        
        <div className="p-6 space-y-6">
          <div className="flex items-center gap-6">
            <div className="w-20 h-20 bg-slate-900 rounded-2xl flex items-center justify-center shadow-inner text-white font-bold text-2xl">
              {formData.name ? formData.name.charAt(0).toUpperCase() : 'W'}
            </div>
            <button className="px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors">
              Change Logo
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[13px] font-bold text-slate-900">Workspace Name</label>
              <input 
                type="text" 
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm focus:border-indigo-500 focus:ring-1 outline-none transition-colors" 
              />
            </div>
            <div className="space-y-2">
              <label className="text-[13px] font-bold text-slate-900">Support Email</label>
              <input 
                type="email" 
                value={formData.supportEmail}
                onChange={(e) => setFormData({...formData, supportEmail: e.target.value})}
                className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm focus:border-indigo-500 focus:ring-1 outline-none transition-colors" 
              />
            </div>
          </div>
        </div>
        
        <div className="bg-gray-50/50 p-4 border-t border-gray-100 flex justify-end items-center gap-4">
          {updateMutation.isSuccess && <span className="text-emerald-600 text-sm font-medium flex items-center gap-1"><CheckCircle2 size={16}/> Saved</span>}
          <button 
            onClick={handleSave}
            disabled={updateMutation.isLoading}
            className="px-6 py-2.5 bg-indigo-600 text-white rounded-lg text-sm font-medium shadow-sm hover:bg-indigo-700 transition-colors disabled:opacity-50 flex items-center gap-2"
          >
            {updateMutation.isLoading ? <Loader2 size={16} className="animate-spin" /> : 'Save Changes'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default GeneralSettings;
