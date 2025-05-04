import api from './axios';

export const getAllUsers = async () => {
  const response = await api.get('/users');
  return response.data;
};

export const getUserById = async (id) => {
  const response = await api.get(`/users/${id}`);
  return response.data;
};

export const createUser = async (userData) => {
  const response = await api.post('/users', userData);
  return response.data;
};

export const updateUser = async (id, userData) => {
  const response = await api.put(`/users/${id}`, userData);
  return response.data;
};

export const deleteUser = async (id) => {
  const response = await api.delete(`/users/${id}`);
  return response.data;
};

export const getAllEquipment = async () => {
  const response = await api.get('/equipment');
  return response.data;
};

export const getAllLabs = async () => {
  const response = await api.get('/labs');
  return response.data;
};

export const getAllLoans = async () => {
  const response = await api.get('/loans');
  return response.data;
};

export const updateLoanStatus = async (id, status) => {
  const response = await api.put(`/loans/${id}/status`, { status });
  return response.data;
};

export const createLab = async (labData) => {
  const response = await api.post('/labs', labData);
  return response.data;
};

export const updateLab = async (id, labData) => {
  const response = await api.put(`/labs/${id}`, labData);
  return response.data;
};

export const deleteLab = async (id) => {
  const response = await api.delete(`/labs/${id}`);
  return response.data;
}; 