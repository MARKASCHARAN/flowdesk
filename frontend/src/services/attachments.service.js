import { api } from '../lib/api';

export const attachmentsService = {
  uploadAttachment: async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    
    const token = localStorage.getItem('flowdesk_token');
    
    // We bypass the global api wrapper here because FormData needs 
    // the browser to set the multipart boundary Content-Type automatically.
    const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3000/api/v1'}/attachments`, {
      method: 'POST',
      headers: {
        ...(token && { Authorization: `Bearer ${token}` })
      },
      body: formData
    });
    
    if (!response.ok) throw new Error('Attachment upload failed');
    return response.json();
  },
  
  getAttachment: async (id) => api.get(`/attachments/${id}`),
  deleteAttachment: async (id) => api.delete(`/attachments/${id}`)
};
