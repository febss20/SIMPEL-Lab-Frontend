import { useState, useEffect } from 'react';
import api from '../../api/axios';
import { createLoan } from '../../api/loans';

export default function useEquipmentBrowse() {
  const [equipment, setEquipment] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [showLoanModal, setShowLoanModal] = useState(null);
  const [showRepairModal, setShowRepairModal] = useState(null);
  const [loanForm, setLoanForm] = useState({ startDate: '', endDate: '', notes: '' });
  const [repairDesc, setRepairDesc] = useState('');
  const [loadingAction, setLoadingAction] = useState(false);
  const [formError, setFormError] = useState('');
  const [showRepairSuccess, setShowRepairSuccess] = useState(false);
  const [showLoanSuccess, setShowLoanSuccess] = useState(false);

  useEffect(() => {
    const fetchEquipment = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await api.get('/equipment');
        setEquipment(res.data);
      } catch (err) {
        setError('Gagal memuat data peralatan');
      } finally {
        setLoading(false);
      }
    };
    fetchEquipment();
  }, []);

  const filteredEquipment = equipment.filter(eq => {
    const matchesSearch = eq.name.toLowerCase().includes(search.toLowerCase()) || (eq.type?.toLowerCase().includes(search.toLowerCase()));
    const matchesStatus = statusFilter ? eq.status === statusFilter : true;
    return matchesSearch && matchesStatus;
  });

  const handleOpenLoanModal = (equipmentId) => {
    setShowLoanModal(equipmentId);
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
        equipmentId: showLoanModal,
        startDate: loanForm.startDate,
        endDate: loanForm.endDate,
        notes: loanForm.notes
      });
      setShowLoanModal(null);
      setLoanForm({ startDate: '', endDate: '', notes: '' });
      setShowLoanSuccess(true);
      const res = await api.get('/equipment');
      setEquipment(res.data);
    } catch (err) {
      setFormError('Gagal mengajukan peminjaman: ' + (err.response?.data?.message || err.message));
    } finally {
      setLoadingAction(false);
    }
  };

  const handleOpenRepairModal = (equipmentId) => {
    setShowRepairModal(equipmentId);
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
        equipmentId: showRepairModal,
        description: repairDesc
      });
      setShowRepairModal(null);
      setRepairDesc('');
      setShowRepairSuccess(true);
      const res = await api.get('/equipment');
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
    search,
    setSearch,
    statusFilter,
    setStatusFilter,
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
    filteredEquipment,
    handleOpenLoanModal,
    handleLoanFormChange,
    handleLoanSubmit,
    handleOpenRepairModal,
    handleRepairDescChange,
    handleRepairSubmit,
    showRepairSuccess,
    setShowRepairSuccess,
    showLoanSuccess,
    setShowLoanSuccess,
  };
} 