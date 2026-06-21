import React, { useState, useEffect, useRef } from 'react';
import { Camera, Shield, LogOut, CheckCircle2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';
import { usersService } from '../services/users.service';

const Profile = () => {
  const navigate = useNavigate();
  const { user, logout, fetchProfile } = useAuthStore();
  
  const [formData, setFormData] = useState({ firstName: '', lastName: '', email: '' });
  const [isSaving, setIsSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (user) {
      setFormData({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        email: user.email || ''
      });
    }
  }, [user]);

  const handleSave = async () => {
    setIsSaving(true);
    setSuccessMsg('');
    try {
      await usersService.updateProfile(formData);
      await fetchProfile(); // refresh store
      setSuccessMsg('Profile updated successfully!');
      setTimeout(() => setSuccessMsg(''), 3000);
    } catch (error) {
      alert(error.message || 'Failed to update profile');
    } finally {
      setIsSaving(false);
    }
  };

  const handleAvatarUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    try {
      await usersService.uploadAvatar(file);
      await fetchProfile(); // get new avatar URL
    } catch (error) {
      alert('Failed to upload avatar');
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const getInitials = () => {
    if (!user) return 'U';
    return `${user.firstName?.charAt(0) || ''}${user.lastName?.charAt(0) || ''}`.toUpperCase() || user.email?.charAt(0).toUpperCase() || 'U';
  };

  return (
    <div className="p-6 md:p-8 lg:p-10 max-w-4xl mx-auto space-y-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight mb-1">My Profile</h1>
        <p className="text-sm text-gray-500">Manage your personal account settings and sessions.</p>
      </div>

      <div className="bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="p-8 border-b border-gray-100 flex flex-col md:flex-row gap-8 items-start md:items-center">
          <div className="relative group cursor-pointer" onClick={() => fileInputRef.current?.click()}>
            {user?.avatar ? (
              <img src={user.avatar} alt="Avatar" className="w-24 h-24 rounded-full object-cover shadow-inner" />
            ) : (
              <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold text-3xl shadow-inner">
                {getInitials()}
              </div>
            )}
            <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <Camera className="text-white" size={24} />
            </div>
            <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleAvatarUpload} />
          </div>
          <div className="flex-1 space-y-4 w-full">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-[13px] font-bold text-slate-900">First Name</label>
                <input 
                  type="text" 
                  value={formData.firstName}
                  onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:border-indigo-500 focus:bg-white focus:ring-1 outline-none transition-colors" 
                />
              </div>
              <div className="space-y-2">
                <label className="text-[13px] font-bold text-slate-900">Last Name</label>
                <input 
                  type="text" 
                  value={formData.lastName}
                  onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:border-indigo-500 focus:bg-white focus:ring-1 outline-none transition-colors" 
                />
              </div>
              <div className="space-y-2 sm:col-span-2">
                <label className="text-[13px] font-bold text-slate-900">Email Address</label>
                <input 
                  type="email" 
                  value={formData.email}
                  disabled // usually email changes require a separate flow
                  className="w-full bg-gray-100 border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-500 outline-none cursor-not-allowed" 
                />
              </div>
            </div>
            <div className="flex items-center gap-4">
              <button 
                onClick={handleSave}
                disabled={isSaving}
                className="px-6 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 shadow-sm transition-colors disabled:opacity-70"
              >
                {isSaving ? 'Saving...' : 'Save Profile'}
              </button>
              {successMsg && <span className="text-emerald-600 text-sm font-medium flex items-center gap-1"><CheckCircle2 size={16}/> {successMsg}</span>}
            </div>
          </div>
        </div>

        <div className="p-8 border-b border-gray-100">
          <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
            <Shield size={18} className="text-indigo-600" /> Active Sessions
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-emerald-50/50 border border-emerald-100 rounded-2xl">
              <div>
                <p className="font-bold text-slate-900 text-sm">Mac OS • Chrome</p>
                <p className="text-[12px] text-gray-500 mt-0.5">San Francisco, CA • Current Session</p>
              </div>
              <span className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-[11px] font-bold uppercase tracking-wide">Active</span>
            </div>
            <div className="flex items-center justify-between p-4 bg-gray-50 border border-gray-200 rounded-2xl">
              <div>
                <p className="font-bold text-slate-900 text-sm">iPhone 14 • Safari</p>
                <p className="text-[12px] text-gray-500 mt-0.5">San Francisco, CA • Last active 2 hours ago</p>
              </div>
              <button className="text-[13px] font-bold text-rose-600 hover:text-rose-700 transition-colors">Revoke</button>
            </div>
          </div>
        </div>
        
        <div className="p-8 bg-gray-50/50">
          <button 
            onClick={handleLogout}
            className="flex items-center gap-2 text-sm font-bold text-rose-600 hover:text-rose-700 transition-colors"
          >
            <LogOut size={16} /> Sign out of FlowDesk
          </button>
        </div>
      </div>
    </div>
  );
};

export default Profile;
