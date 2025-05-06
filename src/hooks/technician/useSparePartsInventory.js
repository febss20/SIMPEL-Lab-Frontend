import { useState, useEffect } from 'react';
import { getAllSpareParts, createSparePart, updateSparePart, deleteSparePart } from '../../api/spareparts';
import { getAllMaintenance } from '../../api/maintenance';

export default function useSparePartsInventory() {
  const [spareParts, setSpareParts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentSparePart, setCurrentSparePart] = useState(null);
  const [formData, setFormData] = useState({
    maintenanceTaskId: '',
    name: '',
    partNumber: '',
    quantity: 1,
    replacementDate: '',
    notes: ''
  });
  const [maintenanceTasks, setMaintenanceTasks] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [loadingAction, setLoadingAction] = useState(false);

  useEffect(() => {
    fetchSpareParts();
    fetchMaintenanceTasks();
  }, []);

  const fetchSpareParts = async () => {
    try {
      setIsLoading(true);
      const data = await getAllSpareParts();
      setSpareParts(data);
      setError(null);
    } catch (err) {
      setError('Failed to load spare parts data');
      setSpareParts([]);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchMaintenanceTasks = async () => {
    try {
      const data = await getAllMaintenance();
      setMaintenanceTasks(data);
    } catch (err) {
      setMaintenanceTasks([]);
    }
  };

  const handleOpenModal = (sparePart = null) => {
    if (sparePart) {
      setCurrentSparePart(sparePart);
      setFormData({
        maintenanceTaskId: sparePart.maintenanceTaskId || '',
        name: sparePart.name || '',
        partNumber: sparePart.partNumber || '',
        quantity: sparePart.quantity || 1,
        replacementDate: sparePart.replacementDate ? sparePart.replacementDate.split('T')[0] : '',
        notes: sparePart.notes || ''
      });
    } else {
      setCurrentSparePart(null);
      setFormData({
        maintenanceTaskId: '',
        name: '',
        partNumber: '',
        quantity: 1,
        replacementDate: '',
        notes: ''
      });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setCurrentSparePart(null);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    let parsedValue = value;
    if (name === 'quantity') {
      parsedValue = parseInt(value, 10) || 1;
    }
    setFormData({
      ...formData,
      [name]: parsedValue
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoadingAction(true);
    try {
      const payload = {
        maintenanceTaskId: Number(formData.maintenanceTaskId),
        name: formData.name,
        partNumber: formData.partNumber,
        quantity: Number(formData.quantity),
        replacementDate: formData.replacementDate ? new Date(formData.replacementDate) : undefined,
        notes: formData.notes
      };
      if (currentSparePart) {
        await updateSparePart(currentSparePart.id, payload);
        setSuccessMessage('Spare part berhasil diperbarui!');
      } else {
        await createSparePart(payload);
        setSuccessMessage('Spare part baru berhasil ditambahkan!');
      }
      handleCloseModal();
      fetchSpareParts();
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      setError(`Failed to ${currentSparePart ? 'update' : 'create'} spare part`);
      setTimeout(() => setError(null), 3000);
    } finally {
      setLoadingAction(false);
    }
  };

  const handleDelete = (id) => {
    setConfirmDeleteId(id);
  };

  const confirmDelete = async () => {
    if (!confirmDeleteId) return;
    setDeleteLoading(true);
    setLoadingAction(true);
    try {
      await deleteSparePart(confirmDeleteId);
      setConfirmDeleteId(null);
      setSuccessMessage('Spare part berhasil dihapus!');
      fetchSpareParts();
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      setError('Gagal menghapus Spare part');
      setTimeout(() => setError(null), 3000);
    } finally {
      setDeleteLoading(false);
      setLoadingAction(false);
    }
  };

  const filteredSpareParts = spareParts.filter(part => {
    const matchesSearch =
      part.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (part.partNumber || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (part.notes || '').toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  return {
    spareParts,
    isLoading,
    error,
    isModalOpen,
    setIsModalOpen,
    currentSparePart,
    setCurrentSparePart,
    formData,
    setFormData,
    maintenanceTasks,
    searchTerm,
    setSearchTerm,
    successMessage,
    setSuccessMessage,
    confirmDeleteId,
    setConfirmDeleteId,
    deleteLoading,
    loadingAction,
    handleOpenModal,
    handleCloseModal,
    handleChange,
    handleSubmit,
    handleDelete,
    confirmDelete,
    filteredSpareParts,
  };
} 