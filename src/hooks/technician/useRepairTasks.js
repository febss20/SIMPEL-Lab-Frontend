import { useState, useEffect } from 'react';
import { getAllRepairs, updateRepair, deleteRepair } from '../../api/repairs';
import { getAllEquipment, getAllLabs } from '../../api/admin';

export default function useRepairTasks() {
  const [repairs, setRepairs] = useState([]);
  const [equipment, setEquipment] = useState([]);
  const [labs, setLabs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [labFilter, setLabFilter] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [loadingAction, setLoadingAction] = useState(false);
  const [editRepair, setEditRepair] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editForm, setEditForm] = useState({ status: '', description: '', notes: '' });
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const fetchAll = async () => {
    setLoading(true);
    setError(null);
    try {
      const [repairsRes, eqRes, labsRes] = await Promise.all([
        getAllRepairs(),
        getAllEquipment(),
        getAllLabs()
      ]);
      setRepairs(repairsRes);
      setEquipment(eqRes);
      setLabs(labsRes);
    } catch (err) {
      setError('Gagal memuat data repair');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAll();
  }, []);

  const filteredRepairs = repairs.filter(repair => {
    const eq = equipment.find(e => e.id === repair.equipmentId);
    const matchesSearch = eq ? (eq.name.toLowerCase().includes(search.toLowerCase()) || (eq.type?.toLowerCase().includes(search.toLowerCase()))) : false;
    const matchesStatus = statusFilter ? repair.status === statusFilter : true;
    const matchesLab = labFilter ? (String(eq?.labId) === String(labFilter) || String(eq?.lab?.id) === String(labFilter)) : true;
    return matchesSearch && matchesStatus && matchesLab;
  });

  const handleUpdateStatus = async (repair, newStatus) => {
    setLoadingAction(true);
    try {
      const payload = { status: newStatus };
      if (newStatus === 'COMPLETED') {
        payload.completedAt = new Date().toISOString();
      }
      await updateRepair(repair.id, payload);
      setSuccessMsg('Status berhasil diperbarui!');
      fetchAll();
      setTimeout(() => setSuccessMsg(''), 2000);
    } catch (err) {
      setError('Gagal memperbarui status: ' + (err.response?.data?.message || err.message));
    } finally {
      setLoadingAction(false);
    }
  };

  const handleEditClick = (repair) => {
    setEditRepair(repair);
    setEditForm({ status: repair.status, description: repair.description, notes: repair.notes || '' });
    setShowEditModal(true);
  };

  const handleEditChange = (e) => {
    setEditForm({ ...editForm, [e.target.name]: e.target.value });
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    setLoadingAction(true);
    try {
      const payload = { ...editForm };
      if (payload.status === 'COMPLETED') {
        payload.completedAt = new Date().toISOString();
      }
      await updateRepair(editRepair.id, payload);
      setSuccessMsg('Repair berhasil diupdate!');
      setShowEditModal(false);
      fetchAll();
      setTimeout(() => setSuccessMsg(''), 2000);
    } catch (err) {
      setError('Gagal update: ' + (err.response?.data?.message || err.message));
    } finally {
      setLoadingAction(false);
    }
  };

  const handleDelete = (id) => {
    setConfirmDeleteId(id);
  };

  const confirmDelete = async () => {
    if (!confirmDeleteId) return;
    setLoadingAction(true);
    setDeleteLoading(true);
    try {
      await deleteRepair(confirmDeleteId);
      setConfirmDeleteId(null);
      setSuccessMsg('Repair berhasil dihapus!');
      await fetchAll();
      setTimeout(() => setSuccessMsg(''), 2000);
    } catch (err) {
      setError('Gagal menghapus: ' + (err.response?.data?.message || err.message));
    } finally {
      setLoadingAction(false);
      setDeleteLoading(false);
    }
  };

  const handleMarkUnrepairable = async (repair) => {
    // This should be handled by a confirmation modal in the page, not here
    setLoadingAction(true);
    try {
      await updateRepair(repair.id, { status: 'UNREPAIRABLE' });
      setSuccessMsg('Repair berhasil ditandai sebagai tidak bisa diperbaiki! Menunggu konfirmasi admin.');
      fetchAll();
      setTimeout(() => setSuccessMsg(''), 2000);
    } catch (err) {
      setError('Gagal menandai repair: ' + (err.response?.data?.message || err.message));
    } finally {
      setLoadingAction(false);
    }
  };

  return {
    repairs,
    equipment,
    labs,
    loading,
    error,
    search,
    setSearch,
    statusFilter,
    setStatusFilter,
    labFilter,
    setLabFilter,
    successMsg,
    setSuccessMsg,
    loadingAction,
    editRepair,
    setEditRepair,
    showEditModal,
    setShowEditModal,
    editForm,
    setEditForm,
    confirmDeleteId,
    setConfirmDeleteId,
    deleteLoading,
    filteredRepairs,
    handleUpdateStatus,
    handleEditClick,
    handleEditChange,
    handleEditSubmit,
    handleDelete,
    confirmDelete,
    handleMarkUnrepairable,
  };
} 