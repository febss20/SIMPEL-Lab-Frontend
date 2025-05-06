import { useState, useEffect } from 'react';
import api from '../../api/axios';
import { extendLoan } from '../../api/loans';
import { useSelector } from 'react-redux';

export default function useMyLoans() {
  const { user } = useSelector((state) => state.auth);
  const [loans, setLoans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [returnLoading, setReturnLoading] = useState(null);
  const [showExtendModal, setShowExtendModal] = useState(null);
  const [extendForm, setExtendForm] = useState({ newEndDate: '', notes: '' });
  const [extendLoading, setExtendLoading] = useState(false);
  const [formError, setFormError] = useState('');

  useEffect(() => {
    const fetchLoans = async () => {
      try {
        setLoading(true);
        setError(null);
        const token = localStorage.getItem('token');
        const res = await api.get(`/loans/user/${user.id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setLoans(res.data);
      } catch (err) {
        setError('Gagal memuat data peminjaman');
      } finally {
        setLoading(false);
      }
    };
    if (user?.id) fetchLoans();
  }, [user?.id]);

  const filteredLoans = loans.filter(loan => {
    const matchesSearch = loan.equipment?.name?.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter ? loan.status === statusFilter : true;
    return matchesSearch && matchesStatus;
  });

  const handleReturn = async (loanId) => {
    setReturnLoading(loanId);
    try {
      const token = localStorage.getItem('token');
      await api.put(`/loans/${loanId}/return`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const res = await api.get(`/loans/user/${user.id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setLoans(res.data);
    } catch (err) {
      alert('Gagal melakukan pengembalian');
    } finally {
      setReturnLoading(null);
    }
  };

  const handleOpenExtendModal = (loan) => {
    setShowExtendModal(loan.id);
    setExtendForm({ newEndDate: '', notes: '' });
    setFormError('');
  };

  const handleExtendFormChange = (e) => {
    setExtendForm({ ...extendForm, [e.target.name]: e.target.value });
  };

  const handleExtendSubmit = async (e) => {
    e.preventDefault();
    setFormError('');
    const loan = loans.find(l => l.id === showExtendModal);
    if (!extendForm.newEndDate) {
      setFormError('Tanggal baru wajib diisi.');
      return;
    }
    const oldEnd = new Date(loan.endDate);
    const newEnd = new Date(extendForm.newEndDate);
    if (newEnd <= oldEnd) {
      setFormError('Tanggal baru harus setelah tanggal kembali lama.');
      return;
    }
    setExtendLoading(true);
    try {
      await extendLoan(showExtendModal, { newEndDate: extendForm.newEndDate, notes: extendForm.notes });
      alert('Permintaan perpanjangan berhasil diajukan!');
      setShowExtendModal(null);
      setExtendForm({ newEndDate: '', notes: '' });
      const token = localStorage.getItem('token');
      const res = await api.get(`/loans/user/${user.id}`, { headers: { Authorization: `Bearer ${token}` } });
      setLoans(res.data);
    } catch (err) {
      setFormError('Gagal memperpanjang: ' + (err.response?.data?.message || err.message));
    } finally {
      setExtendLoading(false);
    }
  };

  return {
    loans,
    loading,
    error,
    search,
    setSearch,
    statusFilter,
    setStatusFilter,
    returnLoading,
    showExtendModal,
    setShowExtendModal,
    extendForm,
    setExtendForm,
    extendLoading,
    formError,
    setFormError,
    filteredLoans,
    handleReturn,
    handleOpenExtendModal,
    handleExtendFormChange,
    handleExtendSubmit,
  };
} 