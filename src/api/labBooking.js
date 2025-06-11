import api from './axios';

export const getAllBookings = async () => {
  const response = await api.get('/lab-bookings');
  return response.data;
};

export const getLabBookings = async (labId) => {
  const response = await api.get(`/lab-bookings/lab/${labId}`);
  return response.data;
};

export const getUserBookings = async () => {
  const response = await api.get('/lab-bookings/user');
  return response.data;
};

export const createBooking = async (bookingData) => {
  const response = await api.post('/lab-bookings', bookingData);
  return response.data;
};

export const updateBookingStatus = async (id, statusData) => {
  const response = await api.patch(`/lab-bookings/${id}/status`, statusData);
  return response.data;
};

export const cancelBooking = async (id) => {
  const response = await api.patch(`/lab-bookings/${id}/cancel`);
  return response.data;
};

export const getAvailableTimeSlots = async (labId, date) => {
  const response = await api.get(`/lab-bookings/available-slots/${labId}/${date}`);
  return response.data;
};

export const updateBooking = async (id, bookingData) => {
  const response = await api.put(`/lab-bookings/${id}`, bookingData);
  return response.data;
};

export const deleteBooking = async (id) => {
  const response = await api.delete(`/lab-bookings/${id}`);
  return response.data;
};