import api from './axios';

export const getAllMaintenance = async () => {
  const res = await api.get('/maintenance');
  return res.data;
};

export const getMaintenanceById = async (id) => {
  const res = await api.get(`/maintenance/${id}`);
  return res.data;
};

export const createMaintenance = async (data) => {
  const res = await api.post('/maintenance', data);
  return res.data;
};

export const updateMaintenance = async (id, data) => {
  const res = await api.put(`/maintenance/${id}`, data);
  return res.data;
};

export const deleteMaintenance = async (id) => {
  const res = await api.delete(`/maintenance/${id}`);
  return res.data;
}; 