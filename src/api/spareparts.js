import api from './axios';

export const getAllSpareParts = async () => {
  try {
    const response = await api.get('/spareparts');
    return response.data;
  } catch (error) {
    console.error('Error fetching spare parts:', error);
    throw error;
  }
};

export const getSparePartById = async (id) => {
  try {
    const response = await api.get(`/spareparts/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching spare part ${id}:`, error);
    throw error;
  }
};

export const createSparePart = async (sparePartData) => {
  try {
    const response = await api.post('/spareparts', sparePartData);
    return response.data;
  } catch (error) {
    console.error('Error creating spare part:', error);
    throw error;
  }
};

export const updateSparePart = async (id, sparePartData) => {
  try {
    const response = await api.put(`/spareparts/${id}`, sparePartData);
    return response.data;
  } catch (error) {
    console.error(`Error updating spare part ${id}:`, error);
    throw error;
  }
};

export const deleteSparePart = async (id) => {
  try {
    const response = await api.delete(`/spareparts/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error deleting spare part ${id}:`, error);
    throw error;
  }
}; 