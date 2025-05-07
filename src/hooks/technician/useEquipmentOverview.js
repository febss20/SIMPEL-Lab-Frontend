import { useState, useEffect } from 'react';
import { getAllEquipment, getAllLabs } from '../../api/admin';
import { createMaintenance } from '../../api/maintenance';

export default function useEquipmentOverview() {
  const [equipment, setEquipment] = useState([]);
  const [labs, setLabs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [labFilter, setLabFilter] = useState('');
  const [showMaintenanceModal, setShowMaintenanceModal] = useState(null);
  const [maintenanceForm, setMaintenanceForm] = useState({
    scheduledDate: '',
    description: '',
    isPeriodic: false,
    notes: ''
  });
  const [formError, setFormError] = useState('');
  const [loadingAction, setLoadingAction] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [stats, setStats] = useState({
    available: 0,
    inUse: 0,
    maintenance: 0,
    underRepair: 0,
    inactive: 0
  });

  const fetchEquipment = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await getAllEquipment();
      setEquipment(res);
      const available = res.filter(item => item.status === 'AVAILABLE').length;
      const inUse = res.filter(item => item.status === 'IN_USE').length;
      const maintenance = res.filter(item => item.status === 'UNDER_MAINTENANCE').length;
      const underRepair = res.filter(item => item.status === 'UNDER_REPAIR').length;
      const inactive = res.filter(item => item.status === 'INACTIVE').length;
      setStats({ available, inUse, maintenance, underRepair, inactive });
    } catch (err) {
      setError('Gagal memuat data peralatan');
    } finally {
      setLoading(false);
    }
  };

  const fetchLabs = async () => {
    try {
      const res = await getAllLabs();
      setLabs(res);
    } catch {}
  };

  useEffect(() => {
    fetchEquipment();
    fetchLabs();
  }, []);

  const filteredEquipment = equipment.filter(eq => {
    const matchesSearch = eq.name.toLowerCase().includes(search.toLowerCase()) || (eq.type?.toLowerCase().includes(search.toLowerCase()));
    const matchesStatus = statusFilter ? eq.status === statusFilter : true;
    const matchesLab = labFilter ? (
        String(eq.labId) === String(labFilter) || String(eq.lab?.id) === String(labFilter)
      ) : true;
    return matchesSearch && matchesStatus && matchesLab;
  });

  const handleOpenMaintenanceModal = (equipmentId) => {
    setShowMaintenanceModal(equipmentId);
    setMaintenanceForm({ scheduledDate: '', description: '', isPeriodic: false, notes: '' });
    setFormError('');
  };

  const handleMaintenanceFormChange = (form) => {
    setMaintenanceForm(form);
  };

  const handleMaintenanceSubmit = async (e) => {
    e.preventDefault();
    setFormError('');
    if (!maintenanceForm.scheduledDate || !maintenanceForm.description) {
      setFormError('Tanggal dan deskripsi wajib diisi.');
      return;
    }
    setLoadingAction(true);
    try {
      await createMaintenance({
        equipmentId: showMaintenanceModal,
        scheduledDate: maintenanceForm.scheduledDate,
        description: maintenanceForm.description,
        isPeriodic: maintenanceForm.isPeriodic,
        notes: maintenanceForm.notes
      });
      setShowMaintenanceModal(null);
      setMaintenanceForm({ scheduledDate: '', description: '', isPeriodic: false, notes: '' });
      setSuccessMsg('Pemeliharaan berhasil dijadwalkan!');
      fetchEquipment();
      setTimeout(() => setSuccessMsg(''), 3000);
    } catch (err) {
      setFormError('Gagal menjadwalkan pemeliharaan: ' + (err.response?.data?.message || err.message));
    } finally {
      setLoadingAction(false);
    }
  };

  return {
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
    showMaintenanceModal,
    setShowMaintenanceModal,
    maintenanceForm,
    setMaintenanceForm: handleMaintenanceFormChange,
    handleOpenMaintenanceModal,
    handleMaintenanceSubmit,
    loadingAction,
    formError,
    successMsg,
    stats,
    filteredEquipment,
  };
} 