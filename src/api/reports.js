import api from './axios';

export const getTotalLoans = async () => {
  const response = await api.get('/reports/total-loans');
  return response.data;
};

export const getMostBorrowedEquipment = async () => {
  const response = await api.get('/reports/most-borrowed-equipment');
  return response.data;
};

export const getMostRepairedEquipment = async () => {
  const response = await api.get('/reports/most-repaired-equipment');
  return response.data;
};

export const getMaintenancePerTechnician = async () => {
  const response = await api.get('/reports/maintenance-per-technician');
  return response.data;
};

export const getEquipmentPerLab = async () => {
  const response = await api.get('/reports/equipment-per-lab');
  return response.data;
};

export const getDashboardStats = async () => {
  const response = await api.get('/admin/dashboard-stats');
  return response.data;
}; 