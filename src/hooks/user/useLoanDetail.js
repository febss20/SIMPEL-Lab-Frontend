import { useState, useEffect } from 'react';
import api from '../../api/axios';

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
  };
} 