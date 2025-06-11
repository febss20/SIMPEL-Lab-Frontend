import api from './axios';

const MessageService = {
  getConversations: async () => {
    try {
      const response = await api.get('/messages/conversations');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  getConversation: async (userId) => {
    try {
      const response = await api.get(`/messages/conversation/${userId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  sendMessage: async (receiverId, content) => {
    try {
      const response = await api.post('/messages', { receiverId, content });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  getUnreadCount: async () => {
    try {
      const response = await api.get('/messages/unread-count');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

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