import { useState, useEffect } from 'react';
import api from '../../api/axios';
import { requestReschedule } from '../../api/loans';

export default function useLoanDetail(id, navigate) {
  const [loan, setLoan] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [returnLoading, setReturnLoading] = useState(false);
  const [showExtendModal, setShowExtendModal] = useState(false);
  const [extendDate, setExtendDate] = useState('');
  const [extendLoading, setExtendLoading] = useState(false);
  const [extendError, setExtendError] = useState(null);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  
  const [showRescheduleModal, setShowRescheduleModal] = useState(false);
  const [rescheduleForm, setRescheduleForm] = useState({ newStartDate: '', newEndDate: '', reason: '' });
  const [rescheduleLoading, setRescheduleLoading] = useState(false);
  const [rescheduleError, setRescheduleError] = useState(null);

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        setLoading(true);
        setError(null);
        const token = localStorage.getItem('token');
        const res = await api.get(`/loans/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setLoan(res.data);
      } catch (err) {
        setError('Gagal memuat detail pinjaman');
      } finally {
        setLoading(false);
      }
    };
    fetchDetail();
  }, [id]);

  const handleReturn = async () => {
    setReturnLoading(true);
    try {
      const token = localStorage.getItem('token');
      await api.put(`/loans/${id}/return`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSuccessMsg('Pengembalian berhasil!');
      setTimeout(() => setSuccessMsg(''), 2000);
      setTimeout(() => navigate('/user/loans'), 1000);
    } catch (err) {
      setErrorMsg('Gagal melakukan pengembalian: ' + (err.response?.data?.message || err.message));
      setTimeout(() => setErrorMsg(''), 2000);
    } finally {
      setReturnLoading(false);
    }
  };

  const handleOpenExtendModal = () => {
    setShowExtendModal(true);
    setExtendDate('');
    setExtendError(null);
  };

  const handleExtendDateChange = (e) => {
    setExtendDate(e.target.value);
  };

  const handleExtend = async (e) => {
    e.preventDefault();
    setExtendLoading(true);
    setExtendError(null);
    try {
      const token = localStorage.getItem('token');
      await api.put(`/loans/${id}/extend`, {
        newEndDate: extendDate,
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setShowExtendModal(false);
      setExtendDate('');
      setSuccessMsg('Permintaan perpanjangan berhasil diajukan!');
      setTimeout(() => setSuccessMsg(''), 2000);
      const res = await api.get(`/loans/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setLoan(res.data);
    } catch (err) {
      setErrorMsg('Gagal memperpanjang: ' + (err.response?.data?.message || err.message));
      setTimeout(() => setErrorMsg(''), 2000);
    } finally {
      setExtendLoading(false);
    }
  };

  const handleOpenRescheduleModal = () => {
    setShowRescheduleModal(true);
    setRescheduleForm({ newStartDate: '', newEndDate: '', reason: '' });
    setRescheduleError(null);
  };

  const handleRescheduleFormChange = (e) => {
    const { name, value } = e.target;
    setRescheduleForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleReschedule = async (e) => {
    e.preventDefault();
    setRescheduleLoading(true);
    setRescheduleError(null);
    try {
      await requestReschedule(id, rescheduleForm);
      setShowRescheduleModal(false);
      setRescheduleForm({ newStartDate: '', newEndDate: '', reason: '' });
      setSuccessMsg('Permintaan penjadwalan ulang berhasil diajukan!');
      setTimeout(() => setSuccessMsg(''), 2000);
      
      const token = localStorage.getItem('token');
      const res = await api.get(`/loans/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setLoan(res.data);
    } catch (err) {
      setRescheduleError('Gagal mengajukan penjadwalan ulang: ' + (err.response?.data?.message || err.message));
    } finally {
      setRescheduleLoading(false);
    }
  };

  return {
    loan,
    loading,
    error,
    returnLoading,
    showExtendModal,
    setShowExtendModal,
    extendDate,
    setExtendDate,
    extendLoading,
    extendError,
    handleReturn,
    handleOpenExtendModal,
    handleExtendDateChange,
    handleExtend,
    successMsg,
    errorMsg,
    showRescheduleModal,
    setShowRescheduleModal,
    rescheduleForm,
    rescheduleLoading,
    rescheduleError,
    handleOpenRescheduleModal,
    handleRescheduleFormChange,
    handleReschedule
  };
}