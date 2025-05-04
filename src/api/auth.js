import api from './axios';

const normalizeRole = (role) => {
  if (!role) return 'USER';
  
  const upperRole = role.toUpperCase();
  
  if (['ADMIN', 'TECHNICIAN', 'USER'].includes(upperRole)) {
    return upperRole;
  }
  
  return 'USER';
};

const AuthService = {
  login: async (credentials) => {
    const response = await api.post('/auth/login', credentials);
    if (response.data.token) {
      if (response.data.user) {
        response.data.user.role = normalizeRole(response.data.user.role);
      }
      
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    return response.data;
  },

  register: async (userData) => {
    const response = await api.post('/auth/register', userData);
    return response.data;
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/login';
  },

  getCurrentUser: async () => {
    try {
      const response = await api.get('/auth/me');
      
      if (response.data) {
        response.data.role = normalizeRole(response.data.role);
      }
      
      return response.data;
    } catch (error) {
      return null;
    }
  },

  getUserFromLocalStorage: () => {
    try {
      const user = localStorage.getItem('user');
      if (!user) return null;
      
      const parsedUser = JSON.parse(user);
      
      parsedUser.role = normalizeRole(parsedUser.role);
      
      return parsedUser;
    } catch (error) {
      console.error('Error parsing user from localStorage:', error);
      return null;
    }
  },

  isAuthenticated: () => {
    return !!localStorage.getItem('token');
  },

  hasRole: (roles) => {
    const user = AuthService.getUserFromLocalStorage();
    if (!user) return false;
    
    const normalizedUserRole = normalizeRole(user.role);
    
    if (Array.isArray(roles)) {
      return roles.map(r => normalizeRole(r)).includes(normalizedUserRole);
    }
    
    return normalizedUserRole === normalizeRole(roles);
  }
};

export default AuthService; 