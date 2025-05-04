import api from './axios';

export const getAllRepairs = async () => {
  const res = await api.get('/repairs');
  return res.data;
};

export const getRepairById = async (id) => {
  const res = await api.get(`/repairs/${id}`);
  return res.data;
};

export const createRepair = async (data) => {
  const res = await api.post('/repairs', data);
  return res.data;
};

export const updateRepair = async (id, data) => {
  const res = await api.put(`/repairs/${id}`, data);
  return res.data;
};

export const deleteRepair = async (id) => {
  const res = await api.delete(`/repairs/${id}`);
  return res.data;
};

export const confirmUnrepairableRepair = async (id) => {
  const res = await api.put(`/repairs/${id}/admin-confirm`, { status: 'UNREPAIRABLE', adminConfirmed: true });
  return res.data;
}; 