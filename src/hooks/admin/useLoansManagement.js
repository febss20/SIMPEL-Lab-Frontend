import { useEffect, useState } from 'react';
import { getAllLoans, updateLoanStatus, deleteLoan } from '../../api/loans';

export default function useLoansManagement() {
  const [loans, setLoans] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [showStatusModal, setShowStatusModal] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState('');
  const [statusLoading, setStatusLoading] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [viewData, setViewData] = useState(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const statusOptions = ['PENDING', 'APPROVED', 'ACTIVE', 'RETURNED', 'REJECTED', 'OVERDUE'];

  const fetchLoans = async () => {
    setIsLoading(true);
    try {
      const data = await getAllLoans();
      setLoans(data);
    } catch (err) {
      setError('Gagal memuat data peminjaman');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchLoans();
  }, []);

  const filteredLoans = loans.filter(item => {
    const matchStatus = statusFilter ? item.status === statusFilter : true;
    const equipmentName = item.equipment?.name || '';
    const userName = item.user?.fullName || item.user?.username || '';
    return matchStatus && (
      equipmentName.toLowerCase().includes(search.toLowerCase()) ||
      userName.toLowerCase().includes(search.toLowerCase()) ||
      (item.status || '').toLowerCase().includes(search.toLowerCase())
    );
  });

  const handleUpdateStatus = async (id, status) => {
    try {
      await updateLoanStatus(id, status);
      setSuccessMsg(
        status === 'APPROVED'
          ? 'Peminjaman berhasil di-approve!'
          : status === 'REJECTED'
          ? 'Peminjaman berhasil di-reject!'
          : 'Status peminjaman berhasil diupdate!'
      );
      setTimeout(() => setSuccessMsg(''), 2000);
      fetchLoans();
    } catch (err) {
      setError('Gagal memperbarui status peminjaman: ' + (err?.response?.data?.message || err.message));
    }
  };

  const handleOpenStatusModal = (loan) => {
    if (loan.status !== 'APPROVED') return;
    setShowStatusModal(loan.id);
    setSelectedStatus(loan.status);
  };
  const handleCloseStatusModal = () => {
    setShowStatusModal(null);
    setSelectedStatus('');
  };
  const handleStatusChange = (e) => {
    setSelectedStatus(e.target.value);
  };
  const handleStatusSubmit = async (e) => {
    e.preventDefault();
    setStatusLoading(true);
    try {
      await handleUpdateStatus(showStatusModal, selectedStatus);
      setSuccessMsg('Peminjaman berhasil diupdate!');
      setTimeout(() => setSuccessMsg(''), 2000);
      handleCloseStatusModal();
    } catch (err) {
      setError('Gagal update: ' + (err?.response?.data?.message || err.message));
    } finally {
      setStatusLoading(false);
    }
  };

  const handleOpenViewModal = (row) => {
    setViewData(row);
    setShowViewModal(true);
  };
  const handleCloseViewModal = () => {
    setShowViewModal(false);
    setViewData(null);
  };

  const handleDelete = (id) => {
    setConfirmDeleteId(id);
  };
  const confirmDelete = async () => {
    if (!confirmDeleteId) return;
    setDeleteLoading(true);
    try {
      await deleteLoan(confirmDeleteId);
      setConfirmDeleteId(null);
      setSuccessMsg('Peminjaman berhasil dihapus!');
      fetchLoans();
      setTimeout(() => setSuccessMsg(''), 2000);
    } catch (err) {
      setError('Gagal menghapus: ' + (err?.response?.data?.message || err.message));
    } finally {
      setDeleteLoading(false);
    }
  };

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800';
      case 'APPROVED':
        return 'bg-green-100 text-green-800';
      case 'REJECTED':
        return 'bg-red-100 text-red-800';
      case 'RETURNED':
        return 'bg-blue-100 text-blue-800';
      case 'ACTIVE':
        return 'bg-indigo-100 text-indigo-800';
      case 'OVERDUE':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const exportToCSV = () => {
    const headers = ['ID', 'Equipment', 'User', 'Status', 'Tanggal Pinjam', 'Tanggal Kembali'];
    const rows = filteredLoans.map(item => [
      item.id,
      item.equipment?.name || item.equipmentId || '-',
      item.user?.fullName || item.user?.username || item.userId || '-',
      item.status,
      item.startDate ? new Date(item.startDate).toLocaleString('id-ID') : '-',
      item.endDate ? new Date(item.endDate).toLocaleString('id-ID') : '-',
    ]);
    let csvContent = 'data:text/csv;charset=utf-8,' +
      headers.join(',') + '\n' +
      rows.map(e => e.map(v => '"' + (v ?? '') + '"').join(',')).join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', 'loans_management.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return {
    loans,
    isLoading,
    error,
    search,
    setSearch,
    statusFilter,
    setStatusFilter,
    showStatusModal,
    selectedStatus,
    statusOptions,
    statusLoading,
    showViewModal,
    viewData,
    confirmDeleteId,
    deleteLoading,
    successMsg,
    filteredLoans,
    handleOpenStatusModal,
    handleCloseStatusModal,
    handleStatusChange,
    handleStatusSubmit,
    handleOpenViewModal,
    handleCloseViewModal,
    handleDelete,
    confirmDelete,
    getStatusBadgeClass,
    exportToCSV,
    handleUpdateStatus,
  };
} 