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
      <div className="py-6">
        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-2 md:gap-0">
          <PageHeader 
            title="Manajemen Booking Laboratorium" 
            icon={
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            }
          />
          <BookingFilters
            statusFilter={statusFilter}
            onStatusFilterChange={setStatusFilter}
            search={search}
            onSearchChange={setSearch}
            onExportCSV={exportToCSV}
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