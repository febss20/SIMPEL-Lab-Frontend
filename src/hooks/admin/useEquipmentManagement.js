import { useEffect, useState } from 'react';
import { getAllEquipment, getAllLabs } from '../../api/admin';
import api from '../../api/axios';

const initialForm = {
  id: null,
  name: '',
  description: '',
  serialNumber: '',
  type: '',
  status: 'AVAILABLE',
  location: '',
  purchaseDate: '',
  purchasePrice: '',
  manufacturer: '',
  model: '',
  labId: '',
  createdAt: '',
  updatedAt: '',
};

export default function useEquipmentManagement() {
  const [equipment, setEquipment] = useState([]);
  const [labs, setLabs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState(initialForm);
  const [isEdit, setIsEdit] = useState(false);
  const [modalError, setModalError] = useState(null);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [showViewModal, setShowViewModal] = useState(false);
  const [viewData, setViewData] = useState(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  const fetchEquipment = async () => {
    setIsLoading(true);
    try {
      const data = await getAllEquipment();
      setEquipment(data);
    } catch (err) {
      setError('Gagal memuat data peralatan');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchLabs = async () => {
    try {
      const data = await getAllLabs();
      setLabs(data);
    } catch {}
  };

  useEffect(() => {
    fetchEquipment();
    fetchLabs();
  }, []);

  const handleOpenModal = (item = null) => {
    setModalError(null);
    if (item) {
      setForm({ ...item, labId: item.labId || '' });
      setIsEdit(true);
    } else {
      setForm(initialForm);
      setIsEdit(false);
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setForm(initialForm);
    setIsEdit(false);
    setModalError(null);
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setModalError(null);
    try {
      if (isEdit) {
        await api.put(`/equipment/${form.id}`, form);
        setSuccessMsg('Peralatan berhasil diupdate!');
        setTimeout(() => setSuccessMsg(''), 2000);
      } else {
        await api.post('/equipment', form);
      }
      handleCloseModal();
      fetchEquipment();
    } catch (err) {
      setModalError(err?.response?.data?.message || 'Gagal menyimpan data');
      if (isEdit) setError('Gagal update: ' + (err?.response?.data?.message || err.message));
    }
  };

  const handleDelete = async (id) => {
    setConfirmDeleteId(id);
  };

  const confirmDelete = async () => {
    if (!confirmDeleteId) return;
    setDeleteLoading(true);
    try {
      await api.delete(`/equipment/${confirmDeleteId}`);
      setConfirmDeleteId(null);
      setSuccessMsg('Peralatan berhasil dihapus!');
      fetchEquipment();
      setTimeout(() => setSuccessMsg(''), 2000);
    } catch (err) {
      setError('Gagal menghapus: ' + (err?.response?.data?.message || err.message));
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleOpenViewModal = (item) => {
    setViewData(item);
    setShowViewModal(true);
  };

  const handleCloseViewModal = () => {
    setShowViewModal(false);
    setViewData(null);
  };

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'AVAILABLE':
        return 'bg-green-100 text-green-800';
      case 'IN_USE':
        return 'bg-blue-100 text-blue-800';
      case 'UNDER_MAINTENANCE':
        return 'bg-yellow-100 text-yellow-800';
      case 'UNDER_REPAIR':
        return 'bg-orange-100 text-orange-800';
      case 'INACTIVE':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredEquipment = equipment.filter(item => {
    const labName = (item.lab && item.lab.name) ? item.lab.name : (labs.find(l => l.id === item.labId)?.name || '');
    const matchStatus = statusFilter ? item.status === statusFilter : true;
    return (
      matchStatus && (
        item.name.toLowerCase().includes(search.toLowerCase()) ||
        item.serialNumber.toLowerCase().includes(search.toLowerCase()) ||
        (item.type || '').toLowerCase().includes(search.toLowerCase()) ||
        (item.location || '').toLowerCase().includes(search.toLowerCase()) ||
        labName.toLowerCase().includes(search.toLowerCase())
      )
    );
  });

  const exportToCSV = () => {
    const headers = ['ID', 'Nama', 'Serial Number', 'Tipe', 'Status', 'Lokasi', 'Lab', 'Dibuat', 'Diubah'];
    const rows = filteredEquipment.map(item => [
      item.id,
      item.name,
      item.serialNumber,
      item.type,
      item.status,
      item.location,
      (item.lab && item.lab.name) ? item.lab.name : (labs.find(l => l.id === item.labId)?.name || '-'),
      item.createdAt ? new Date(item.createdAt).toLocaleString('id-ID') : '-',
      item.updatedAt ? new Date(item.updatedAt).toLocaleString('id-ID') : '-'
    ]);
    let csvContent = 'data:text/csv;charset=utf-8,' +
      headers.join(',') + '\n' +
      rows.map(e => e.map(v => '"' + (v ?? '') + '"').join(',')).join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', 'equipment_management.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return {
    equipment,
    labs,
    isLoading,
    error,
    showModal,
    form,
    isEdit,
    modalError,
    search,
    setSearch,
    statusFilter,
    setStatusFilter,
    showViewModal,
    viewData,
    confirmDeleteId,
    deleteLoading,
    successMsg,
    handleOpenModal,
    handleCloseModal,
    handleChange,
    handleSubmit,
    handleDelete,
    confirmDelete,
    handleOpenViewModal,
    handleCloseViewModal,
    getStatusBadgeClass,
    filteredEquipment,
    exportToCSV,
    setError,
  };
} 