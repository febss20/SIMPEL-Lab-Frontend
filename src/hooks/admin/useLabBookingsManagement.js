import { useEffect, useState } from 'react';
import { format, parseISO } from 'date-fns';
import { id } from 'date-fns/locale';
import { getAllBookings, updateBookingStatus, deleteBooking } from '../../api/labBooking';

export default function useLabBookingsManagement() {
  const [bookings, setBookings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [showApproveModal, setShowApproveModal] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedBookingId, setSelectedBookingId] = useState(null);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [rejectionReason, setRejectionReason] = useState('');
  const [actionLoading, setActionLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [editForm, setEditForm] = useState({ status: '' });
  const [modalError, setModalError] = useState(null);

  const fetchBookings = async () => {
    setIsLoading(true);
    try {
      const data = await getAllBookings();
      setBookings(data);
    } catch (err) {
      setError('Gagal memuat data booking laboratorium');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const filteredBookings = bookings.filter(item => {
    if (statusFilter !== 'ALL' && item.status !== statusFilter) {
      return false;
    }
    
    const searchLower = search.toLowerCase();
    return (
      (item.user?.fullName || '').toLowerCase().includes(searchLower) ||
      (item.user?.username || '').toLowerCase().includes(searchLower) ||
      (item.lab?.name || '').toLowerCase().includes(searchLower) ||
      (item.purpose || '').toLowerCase().includes(searchLower) ||
      String(item.id).includes(searchLower)
    );
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800';
      case 'APPROVED':
        return 'bg-green-100 text-green-800';
      case 'REJECTED':
        return 'bg-red-100 text-red-800';
      case 'CANCELLED':
        return 'bg-gray-100 text-gray-800';
      case 'COMPLETED':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleApprove = (id) => {
    setSelectedBookingId(id);
    setShowApproveModal(true);
  };

  const handleReject = (id) => {
    setSelectedBookingId(id);
    setRejectionReason('');
    setShowRejectModal(true);
  };

  const handleEdit = (booking) => {
    setSelectedBooking(booking);
    setEditForm({ status: booking.status || '' });
    setShowEditModal(true);
    setModalError(null);
  };

  const handleDelete = (id) => {
    setSelectedBookingId(id);
    setShowDeleteModal(true);
  };

  const handleEditFormChange = (e) => {
    const { name, value } = e.target;
    setEditForm(prev => ({ ...prev, [name]: value }));
  };

  const confirmApprove = async () => {
    if (!selectedBookingId) return;
    setActionLoading(true);
    try {
      await updateBookingStatus(selectedBookingId, { status: 'APPROVED' });
      setSuccessMsg('Booking berhasil disetujui!');
      fetchBookings();
      setTimeout(() => setSuccessMsg(''), 2000);
    } catch (err) {
      setError('Gagal menyetujui booking: ' + (err?.response?.data?.message || err.message));
    } finally {
      setActionLoading(false);
      setShowApproveModal(false);
    }
  };

  const confirmReject = async () => {
    if (!selectedBookingId) return;
    setActionLoading(true);
    try {
      await updateBookingStatus(selectedBookingId, { 
        status: 'REJECTED',
        rejectionReason: rejectionReason || 'Tidak ada alasan yang diberikan'
      });
      setSuccessMsg('Booking berhasil ditolak!');
      fetchBookings();
      setTimeout(() => setSuccessMsg(''), 2000);
    } catch (err) {
      setError('Gagal menolak booking: ' + (err?.response?.data?.message || err.message));
    } finally {
      setActionLoading(false);
      setShowRejectModal(false);
    }
  };

  const confirmEdit = async (e) => {
    e.preventDefault();
    if (!selectedBooking) return;
    setActionLoading(true);
    setModalError(null);
    try {
      await updateBookingStatus(selectedBooking.id, { status: editForm.status });
      setSuccessMsg('Status booking berhasil diupdate!');
      fetchBookings();
      setShowEditModal(false);
      setTimeout(() => setSuccessMsg(''), 2000);
    } catch (err) {
      setModalError('Gagal mengupdate status booking: ' + (err?.response?.data?.message || err.message));
    } finally {
      setActionLoading(false);
    }
  };

  const confirmDelete = async () => {
    if (!selectedBookingId) return;
    setActionLoading(true);
    try {
      await deleteBooking(selectedBookingId);
      setSuccessMsg('Booking berhasil dihapus!');
      fetchBookings();
      setShowDeleteModal(false);
      setTimeout(() => setSuccessMsg(''), 2000);
    } catch (err) {
      setError('Gagal menghapus booking: ' + (err?.response?.data?.message || err.message));
    } finally {
      setActionLoading(false);
    }
  };

  const exportToCSV = () => {
    const headers = ['ID', 'Pengguna', 'Lab', 'Mulai', 'Selesai', 'Tujuan', 'Jumlah Peserta', 'Status', 'Dibuat'];
    const rows = filteredBookings.map(item => [
      item.id,
      item.user?.fullName || item.user?.username || '-',
      item.lab?.name || '-',
      item.startTime ? format(parseISO(item.startTime), 'dd MMM yyyy HH:mm', { locale: id }) : '-',
      item.endTime ? format(parseISO(item.endTime), 'dd MMM yyyy HH:mm', { locale: id }) : '-',
      item.purpose || '-',
      item.participantCount || '-',
      item.status,
      item.createdAt ? format(parseISO(item.createdAt), 'dd MMM yyyy HH:mm', { locale: id }) : '-'
    ]);
    let csvContent = 'data:text/csv;charset=utf-8,' +
      headers.join(',') + '\n' +
      rows.map(e => e.map(v => '"' + (v ?? '') + '"').join(',')).join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', 'lab_bookings.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return {
    bookings,
    isLoading,
    error,
    search,
    setSearch,
    statusFilter,
    setStatusFilter,
    filteredBookings,
    successMsg,
  
    showApproveModal,
    setShowApproveModal,
    showRejectModal,
    setShowRejectModal,
    showEditModal,
    setShowEditModal,
    showDeleteModal,
    setShowDeleteModal,
    selectedBookingId,
    selectedBooking,
    rejectionReason,
    setRejectionReason,
    actionLoading,
    editForm,
    modalError,
    
    handleApprove,
    handleReject,
    handleEdit,
    handleDelete,
    handleEditFormChange,
    confirmApprove,
    confirmReject,
    confirmEdit,
    confirmDelete,
    getStatusColor,
    exportToCSV,
    fetchBookings
  };
}