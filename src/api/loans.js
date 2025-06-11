import api from './axios';

export const getAllLoans = async () => {
  const res = await api.get('/loans');
  return res.data;
};

export const getLoanById = async (id) => {
  const res = await api.get(`/loans/${id}`);
  return res.data;
};

export const createLoan = async (loanData) => {
  const res = await api.post('/loans', loanData);
  return res.data;
};

export const updateLoanStatus = async (id, status) => {
  const res = await api.put(`/loans/${id}/status`, { status });
  return res.data;
};

export const extendLoan = async (id, extendData) => {
  const res = await api.put(`/loans/${id}/extend`, extendData);
  return res.data;
};

export const returnLoan = async (id, returnData) => {
  const res = await api.put(`/loans/${id}/return`, returnData);
  return res.data;
};

export const deleteLoan = async (id) => {
  const res = await api.delete(`/loans/${id}`);
  return res.data;
};

export const decideExtendLoan = async (id, decision) => {
  const res = await api.put(`/loans/${id}/extend/decision`, { decision });
  return res.data;
};

export const requestReschedule = async (id, rescheduleData) => {
  const res = await api.post(`/loans/${id}/reschedule`, rescheduleData);
  return res.data;
};

export const respondToReschedule = async (id, responseData) => {
  const res = await api.put(`/loans/${id}/reschedule/response`, responseData);
  return res.data;
};