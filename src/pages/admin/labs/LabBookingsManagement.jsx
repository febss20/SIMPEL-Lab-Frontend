import React from 'react';
import { format, parseISO } from 'date-fns';
import { id } from 'date-fns/locale';
import DashboardLayout from '../../../components/layouts/DashboardLayout';
import DataTable from '../../../components/dashboard/DataTable';
import PageHeader from '../../../components/common/PageHeader';
import ConfirmModal from '../../../components/common/ConfirmModal';
import BookingEditModal from '../../../components/admin/LabBookingsManagement/BookingEditModal';
import BookingFilters from '../../../components/admin/LabBookingsManagement/BookingFilters';
import BookingNotifications from '../../../components/admin/LabBookingsManagement/BookingNotifications';
import BookingStatusBadge from '../../../components/admin/LabBookingsManagement/BookingStatusBadge';
import BookingActionButtons from '../../../components/admin/LabBookingsManagement/BookingActionButtons';
import useLabBookingsManagement from '../../../hooks/admin/useLabBookingsManagement';

const LabBookingsManagement = () => {
  const {
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
    exportToCSV
  } = useLabBookingsManagement();

  const columns = [
    { 
      id: 'id', 
      header: 'ID', 
      sortable: true 
    },
    { 
      id: 'user', 
      header: 'Pengguna', 
      sortable: true, 
      render: row => row.user?.fullName || row.user?.username || '-' 
    },
    { 
      id: 'lab', 
      header: 'Lab', 
      sortable: true, 
      render: row => row.lab?.name || '-' 
    },
    { 
      id: 'startTime', 
      header: 'Mulai', 
      sortable: true, 
      render: row => row.startTime ? format(parseISO(row.startTime), 'dd MMM yyyy HH:mm', { locale: id }) : '-' 
    },
    { 
      id: 'endTime', 
      header: 'Selesai', 
      sortable: true, 
      render: row => row.endTime ? format(parseISO(row.endTime), 'dd MMM yyyy HH:mm', { locale: id }) : '-' 
    },
    { 
      id: 'purpose', 
      header: 'Tujuan', 
      sortable: true,
      render: row => row.purpose || '-'
    },
    { 
      id: 'participantCount', 
      header: 'Jumlah Peserta', 
      sortable: true,
      render: row => row.participantCount || '-'
    },
    { 
      id: 'status', 
      header: 'Status', 
      sortable: true,
      render: row => <BookingStatusBadge status={row.status} getStatusColor={getStatusColor} />
    },
    {
      id: 'actions',
      header: 'Aksi',
      sortable: false,
      render: (row) => (
        <BookingActionButtons
          booking={row}
          onApprove={handleApprove}
          onReject={handleReject}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      )
    }
  ];



  return (
    <DashboardLayout>
      <div className="px-4 py-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <PageHeader 
            title="Manajemen Booking Lab" 
            description="Kelola semua booking laboratorium"
          />
          <BookingFilters 
            statusFilter={statusFilter}
            setStatusFilter={setStatusFilter}
            search={search}
            setSearch={setSearch}
            exportToCSV={exportToCSV}
          />
        </div>

        <BookingNotifications successMsg={successMsg} error={error} />

        <div className="mt-6">
          <DataTable
            columns={columns}
            data={filteredBookings}
            isLoading={isLoading}
            emptyMessage="Tidak ada data booking laboratorium"
          />
        </div>
      </div>

      {/* Approve Modal */}
      <ConfirmModal
        isOpen={showApproveModal}
        title="Setujui Booking"
        message="Apakah Anda yakin ingin menyetujui booking laboratorium ini? Laboratorium akan menjadi tidak tersedia pada waktu yang telah ditentukan."
        confirmText="Setujui"
        cancelText="Batal"
        type="success"
        onConfirm={confirmApprove}
        onCancel={() => setShowApproveModal(false)}
        isLoading={actionLoading}
      />

      {/* Reject Modal */}
      <ConfirmModal
        isOpen={showRejectModal}
        title="Tolak Booking"
        confirmText="Tolak"
        cancelText="Batal"
        type="warning"
        onConfirm={confirmReject}
        onCancel={() => setShowRejectModal(false)}
        isLoading={actionLoading}
      >
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Alasan Penolakan (Opsional)
          </label>
          <textarea
            value={rejectionReason}
            onChange={(e) => setRejectionReason(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            rows="3"
            placeholder="Berikan alasan mengapa booking ini ditolak"
          />
        </div>
      </ConfirmModal>

      {/* Modal Edit Booking */}
      <BookingEditModal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        onSubmit={confirmEdit}
        editForm={editForm}
        onChange={handleEditFormChange}
        isLoading={actionLoading}
        error={modalError}
      />

      {/* Modal Delete Booking */}
      <ConfirmModal
        isOpen={showDeleteModal}
        title="Konfirmasi Hapus"
        message="Apakah Anda yakin ingin menghapus booking ini? Tindakan ini tidak dapat dibatalkan."
        confirmText="Ya, Hapus"
        cancelText="Batal"
        onConfirm={confirmDelete}
        onCancel={() => setShowDeleteModal(false)}
        isLoading={actionLoading}
      />
    </DashboardLayout>
  );
};

export default LabBookingsManagement;