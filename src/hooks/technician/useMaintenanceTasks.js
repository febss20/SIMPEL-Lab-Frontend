import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { getAllMaintenance, updateMaintenance, deleteMaintenance, createMaintenance } from '../../api/maintenance';
import { getAllEquipment, getAllLabs } from '../../api/admin';

export default function useMaintenanceTasks() {
  const { user } = useSelector((state) => state.auth);
  const [tasks, setTasks] = useState([]);
  const [equipment, setEquipment] = useState([]);
  const [labs, setLabs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [labFilter, setLabFilter] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [loadingAction, setLoadingAction] = useState(false);
  const [editTask, setEditTask] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editForm, setEditForm] = useState({ status: '', description: '', notes: '' });
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [createForm, setCreateForm] = useState({ equipmentId: '', scheduledDate: '', description: '', notes: '' });
  const [stats, setStats] = useState({
    scheduled: 0,
    inProgress: 0,
    completed: 0,
    cancelled: 0
  });
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const fetchAll = async () => {
    setLoading(true);
    setError(null);
    try {
      const [tasksRes, eqRes, labsRes] = await Promise.all([
        getAllMaintenance(),
        getAllEquipment(),
        getAllLabs()
      ]);
      setTasks(tasksRes);
      const scheduled = tasksRes.filter(t => t.status === 'SCHEDULED').length;
      const inProgress = tasksRes.filter(t => t.status === 'IN_PROGRESS').length;
      const completed = tasksRes.filter(t => t.status === 'COMPLETED').length;
      const cancelled = tasksRes.filter(t => t.status === 'CANCELLED').length;
      setStats({ scheduled, inProgress, completed, cancelled });
      setEquipment(eqRes);
      setLabs(labsRes);
    } catch (err) {
      setError('Gagal memuat data maintenance');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAll();
  }, []);

  const filteredTasks = tasks.filter(task => {
    const eq = equipment.find(e => e.id === task.equipmentId);
    const matchesSearch = eq ? (eq.name.toLowerCase().includes(search.toLowerCase()) || (eq.type?.toLowerCase().includes(search.toLowerCase()))) : false;
    const matchesStatus = statusFilter ? task.status === statusFilter : true;
    const matchesLab = labFilter ? (String(eq?.labId) === String(labFilter) || String(eq?.lab?.id) === String(labFilter)) : true;
    return matchesSearch && matchesStatus && matchesLab;
  });

  const handleUpdateStatus = async (task, newStatus) => {
    setLoadingAction(true);
    try {
      await updateMaintenance(task.id, { status: newStatus });
      setSuccessMsg('Status berhasil diperbarui!');
      fetchAll();
      setTimeout(() => setSuccessMsg(''), 2000);
    } catch (err) {
      setError('Gagal memperbarui status: ' + (err.response?.data?.message || err.message));
    } finally {
      setLoadingAction(false);
    }
  };

  const handleEditClick = (task) => {
    setEditTask(task);
    setEditForm({ status: task.status, description: task.description, notes: task.notes || '' });
    setShowEditModal(true);
  };

  const handleEditChange = (e) => {
    setEditForm({ ...editForm, [e.target.name]: e.target.value });
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    setLoadingAction(true);
    try {
      await updateMaintenance(editTask.id, editForm);
      setSuccessMsg('Task berhasil diupdate!');
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
      await deleteMaintenance(confirmDeleteId);
      setConfirmDeleteId(null);
      setSuccessMsg('Task berhasil dihapus!');
      await fetchAll();
      setTimeout(() => setSuccessMsg(''), 2000);
    } catch (err) {
      setError('Gagal menghapus: ' + (err.response?.data?.message || err.message));
    } finally {
      setLoadingAction(false);
      setDeleteLoading(false);
    }
  };

  const handleCreateChange = (e) => {
    setCreateForm({ ...createForm, [e.target.name]: e.target.value });
  };

  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    setLoadingAction(true);
    try {
      await createMaintenance({
        equipmentId: Number(createForm.equipmentId),
        scheduledDate: createForm.scheduledDate,
        description: createForm.description,
        notes: createForm.notes,
        technicianId: user.id
      });
      setShowCreateModal(false);
      setCreateForm({ equipmentId: '', scheduledDate: '', description: '', notes: '' });
      setSuccessMsg('Jadwal pemeliharaan berhasil dibuat!');
      fetchAll();
      setTimeout(() => setSuccessMsg(''), 2000);
    } catch (err) {
      setError('Gagal membuat jadwal: ' + (err.response?.data?.message || err.message));
    } finally {
      setLoadingAction(false);
    }
  };

  return {
    tasks,
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
    editTask,
    setEditTask,
    showEditModal,
    setShowEditModal,
    editForm,
    setEditForm,
    showCreateModal,
    setShowCreateModal,
    createForm,
    setCreateForm,
    stats,
    confirmDeleteId,
    setConfirmDeleteId,
    deleteLoading,
    filteredTasks,
    handleUpdateStatus,
    handleEditClick,
    handleEditChange,
    handleEditSubmit,
    handleDelete,
    confirmDelete,
    handleCreateChange,
    handleCreateSubmit,
  };
}