import { useState, useEffect } from 'react';
import api from '../../api/axios';
import { createLoan } from '../../api/loans';

export default function useEquipmentDetail(id) {
  const [equipment, setEquipment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showLoanModal, setShowLoanModal] = useState(false);
  const [showRepairModal, setShowRepairModal] = useState(false);
  const [loanForm, setLoanForm] = useState({ startDate: '', endDate: '', notes: '' });
  const [repairDesc, setRepairDesc] = useState('');
  const [loadingAction, setLoadingAction] = useState(false);
  const [formError, setFormError] = useState('');

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await api.get(`/equipment/${id}`);
        setEquipment(res.data);
      } catch (err) {
        setError('Gagal memuat detail peralatan');
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchDetail();
  }, [id]);

  const handleOpenLoanModal = () => {
    setShowLoanModal(true);
    setLoanForm({ startDate: '', endDate: '', notes: '' });
    setFormError('');
  };

  const handleLoanFormChange = (e) => {
    setLoanForm({ ...loanForm, [e.target.name]: e.target.value });
  };

  const handleLoanSubmit = async (e) => {
    e.preventDefault();
    setFormError('');
    const today = new Date();
    const start = new Date(loanForm.startDate);
    const end = new Date(loanForm.endDate);
    today.setHours(0,0,0,0);
    if (!loanForm.startDate || !loanForm.endDate) {
      setFormError('Tanggal mulai dan selesai wajib diisi.');
      return;
    }
    if (start < today) {
      setFormError('Tanggal mulai tidak boleh sebelum hari ini.');
      return;
    }
    if (end < start) {
      setFormError('Tanggal selesai harus setelah tanggal mulai.');
      return;
    }
    setLoadingAction(true);
    try {
      await createLoan({
        equipmentId: equipment.id,
        startDate: loanForm.startDate,
        endDate: loanForm.endDate,
        notes: loanForm.notes
      });
      alert('Permintaan peminjaman berhasil diajukan!');
      setShowLoanModal(false);
      setLoanForm({ startDate: '', endDate: '', notes: '' });
      const res = await api.get(`/equipment/${id}`);
      setEquipment(res.data);
    } catch (err) {
      setFormError('Gagal mengajukan peminjaman: ' + (err.response?.data?.message || err.message));
    } finally {
      setLoadingAction(false);
    }
  };

  const handleOpenRepairModal = () => {
    setShowRepairModal(true);
    setRepairDesc('');
    setFormError('');
  };

  const handleRepairDescChange = (e) => {
    setRepairDesc(e.target.value);
  };

  const handleRepairSubmit = async (e) => {
    e.preventDefault();
    setFormError('');
    if (!repairDesc.trim()) {
      setFormError('Deskripsi kerusakan wajib diisi.');
      return;
    }
    setLoadingAction(true);
    try {
      await api.post('/repairs', {
        equipmentId: equipment.id,
        description: repairDesc
      });
      alert('Laporan kerusakan berhasil dikirim!');
      setShowRepairModal(false);
      setRepairDesc('');
      const res = await api.get(`/equipment/${id}`);
      setEquipment(res.data);
    } catch (err) {
      setFormError('Gagal melapor kerusakan: ' + (err.response?.data?.message || err.message));
    } finally {
      setLoadingAction(false);
    }
  };

  return {
    equipment,
    loading,
    error,
    showLoanModal,
    setShowLoanModal,
    showRepairModal,
    setShowRepairModal,
    loanForm,
    setLoanForm,
    repairDesc,
    setRepairDesc,
    loadingAction,
    formError,
    setFormError,
    handleOpenLoanModal,
    handleLoanFormChange,
    handleLoanSubmit,
    handleOpenRepairModal,
    handleRepairDescChange,
    handleRepairSubmit,
  };
} 