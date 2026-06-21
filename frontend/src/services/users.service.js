import { api } from '../lib/api';

export const usersService = {
  getProfile: async () => {
    return api.get('/users/me');
  },
  
  updateProfile: async (data) => {
    return api.patch('/users/me', data);
  },

  // Requires multipart/form-data for image upload
  uploadAvatar: async (file) => {
    const formData = new FormData();
    formData.append('avatar', file);
    
    const token = localStorage.getItem('flowdesk_token');
    
    // We bypass the global api wrapper here because FormData needs 
    // the browser to set the multipart boundary Content-Type automatically.
    const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3000/api'}/users/me/avatar`, {
      method: 'POST',
      headers: {
        ...(token && { Authorization: `Bearer ${token}` })
      },
      body: formData
    });
    
    if (!response.ok) throw new Error('Avatar upload failed');
    return response.json();
  }
};
