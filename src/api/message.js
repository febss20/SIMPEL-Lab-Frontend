import api from './axios';

const MessageService = {
  // Mendapatkan semua percakapan untuk pengguna saat ini
  getConversations: async () => {
    try {
      const response = await api.get('/messages/conversations');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Mendapatkan percakapan dengan pengguna tertentu
  getConversation: async (userId) => {
    try {
      const response = await api.get(`/messages/conversation/${userId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Mengirim pesan
  sendMessage: async (receiverId, content) => {
    try {
      const response = await api.post('/messages', { receiverId, content });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Mendapatkan jumlah pesan yang belum dibaca
  getUnreadCount: async () => {
    try {
      const response = await api.get('/messages/unread-count');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Mendapatkan daftar teknisi untuk dihubungi
  getTechnicians: async () => {
    try {
      const response = await api.get('/messages/technicians');
      return response.data;
    } catch (error) {
      throw error;
    }
  }
};

export default MessageService;