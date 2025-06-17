import DashboardLayout from '../../../components/layouts/DashboardLayout';
import DataTable from '../../../components/dashboard/DataTable';
import IconButton from '../../../components/common/IconButton';
import PageHeader from '../../../components/common/PageHeader';
import ConfirmModal from '../../../components/common/ConfirmModal';
import LoanStatusModal from '../../../components/admin/loans/LoanStatusModal';
import LoanViewModal from '../../../components/admin/loans/LoanViewModal';
import useLoansManagement from '../../../hooks/admin/useLoansManagement';

const LoansManagement = () => {
  const {
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
    showApproveModal,
    setShowApproveModal,
    showRejectModal,
    setShowRejectModal,
    actionLoading,
    showApproveExtendModal,
    setShowApproveExtendModal,
    showRejectExtendModal,
    setShowRejectExtendModal,
    handleApprove,
    confirmApprove,
    handleReject,
    confirmReject,
    handleApproveExtend,
    confirmApproveExtend,
    handleRejectExtend,
    confirmRejectExtend,
  } = useLoansManagement();

  const columns = [
    { id: 'id', header: 'ID', sortable: true },
    { id: 'equipment', header: 'Equipment', sortable: true, render: row => row.equipment?.name || row.equipmentId || '-' },
    { id: 'user', header: 'User', sortable: true, render: row => row.user?.fullName || row.user?.username || row.userId || '-' },
    { id: 'status', header: 'Status', sortable: true, render: row => (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusBadgeClass(row.status)}`}>
        {row.status}
      </span>
    ) },
    { id: 'startDate', header: 'Tanggal Pinjam', sortable: true, render: row => row.startDate ? new Date(row.startDate).toLocaleDateString('id-ID') : '-' },
    { id: 'endDate', header: 'Tanggal Kembali', sortable: true, render: row => row.endDate ? new Date(row.endDate).toLocaleDateString('id-ID') : '-' },
    { id: 'requestedEndDate', header: 'Req. Perpanjangan', sortable: false, render: row => row.requestedEndDate ? new Date(row.requestedEndDate).toLocaleDateString('id-ID') : '-' },
    {
      id: 'actions',
      header: 'Aksi',
      sortable: false,
      render: (row) => (
        <div className="flex gap-2 justify-start">
          <IconButton
            type="view"
            onClick={() => handleOpenViewModal(row)}
            tooltip="Lihat Detail"
            size="sm"
            icon={
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.477 0 8.268 2.943 9.542 7-1.274 4.057-5.065 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            }
          />
          {row.status === 'PENDING' && row.requestedEndDate ? (
            <>
              <IconButton
                type="approve"
                onClick={() => handleApproveExtend(row.id)}
                tooltip="Approve Perpanjangan"
                size="sm"
              />
              <IconButton
                type="reject"
                onClick={() => handleRejectExtend(row.id)}
                tooltip="Reject Perpanjangan"
                size="sm"
              />
            </>
          ) : row.status === 'PENDING' && !row.requestedEndDate ? (
            <>
              <IconButton
                type="approve"
                onClick={() => handleApprove(row.id)}
                tooltip="Approve"
                size="sm"
              />
              <IconButton
                type="reject"
                onClick={() => handleReject(row.id)}
                tooltip="Reject"
                size="sm"
              />
            </>
          ) : null}
          <IconButton 
            type="edit" 
            onClick={() => handleOpenStatusModal(row)} 
            tooltip="Update Status"
            size="sm"
            disabled={row.status !== 'APPROVED'}
          />
          <IconButton 
            type="delete" 
            onClick={() => handleDelete(row.id)} 
            tooltip="Hapus"
            size="sm"
          />
        </div>
      )
    }
  ];

  return (
    <DashboardLayout>
      <div className="py-6">
        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-2 md:gap-0">
          <PageHeader 
            title="Manajemen Peminjaman" 
            icon={
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            }
          />
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-2 items-stretch sm:items-center w-full sm:w-auto">
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-2 w-full sm:w-auto">
              <input
                type="text"
                placeholder="Cari equipment, user, status..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="border rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 shadow-sm w-full sm:w-auto"
              />
              <select
                className="border rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 shadow-sm w-full sm:w-auto"
                value={statusFilter}
                onChange={e => setStatusFilter(e.target.value)}
              >
                <option value="">Semua Status</option>
                <option value="PENDING">Pending</option>
                <option value="APPROVED">Approved</option>
                <option value="REJECTED">Rejected</option>
                <option value="RETURNED">Returned</option>
                <option value="ACTIVE">Active</option>
                <option value="OVERDUE">Overdue</option>
              </select>
            </div>
            <button
              className="bg-green-600 hover:bg-green-700 text-white px-3 sm:px-4 py-2 rounded-md shadow-sm flex items-center justify-center gap-1 transition-colors text-sm"
              onClick={exportToCSV}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 sm:h-5 sm:w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
              <span className="hidden sm:inline">CSV</span>
            </button>
          </div>
        </div>
        {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">{error}</div>}
        {successMsg && (
          <div className="mb-4 px-4 py-3 rounded-lg bg-green-100 text-green-800 border border-green-300 flex items-center animate-slideDown">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-green-500" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            {successMsg}
          </div>
        )}
        <DataTable columns={columns} data={filteredLoans} isLoading={isLoading} />
        <LoanStatusModal
          isOpen={!!showStatusModal}
          selectedStatus={selectedStatus}
          statusOptions={statusOptions}
          onChange={handleStatusChange}
          onSubmit={handleStatusSubmit}
          onClose={handleCloseStatusModal}
          loading={statusLoading}
        />
        <LoanViewModal
          isOpen={showViewModal}
          onClose={handleCloseViewModal}
          data={viewData}
          getStatusBadgeClass={getStatusBadgeClass}
        />
        <ConfirmModal
          isOpen={!!confirmDeleteId}
          title="Konfirmasi Hapus"
          message="Apakah Anda yakin ingin menghapus data peminjaman ini?"
          confirmText="Ya, Hapus"
          cancelText="Batal"
          onConfirm={confirmDelete}
          onCancel={() => handleDelete(null)}
          loading={deleteLoading}
        />
        
        {/* Modal Konfirmasi Approve */}
        <ConfirmModal
          isOpen={showApproveModal}
          title="Konfirmasi Approve"
          message="Apakah Anda yakin ingin menyetujui peminjaman ini?"
          confirmText="Ya, Approve"
          cancelText="Batal"
          type="success"
          onConfirm={confirmApprove}
          onCancel={() => setShowApproveModal(false)}
          loading={actionLoading}
        />
        
        {/* Modal Konfirmasi Reject */}
        <ConfirmModal
          isOpen={showRejectModal}
          title="Konfirmasi Reject"
          message="Apakah Anda yakin ingin menolak peminjaman ini?"
          confirmText="Ya, Reject"
          cancelText="Batal"
          type="warning"
          onConfirm={confirmReject}
          onCancel={() => setShowRejectModal(false)}
          loading={actionLoading}
        />
        
        {/* Modal Konfirmasi Approve Perpanjangan */}
        <ConfirmModal
          isOpen={showApproveExtendModal}
          title="Konfirmasi Approve Perpanjangan"
          message="Apakah Anda yakin ingin menyetujui perpanjangan peminjaman ini?"
          confirmText="Ya, Approve"
          cancelText="Batal"
          type="success"
          onConfirm={confirmApproveExtend}
          onCancel={() => setShowApproveExtendModal(false)}
          loading={actionLoading}
        />
        
        {/* Modal Konfirmasi Reject Perpanjangan */}
        <ConfirmModal
          isOpen={showRejectExtendModal}
          title="Konfirmasi Reject Perpanjangan"
          message="Apakah Anda yakin ingin menolak perpanjangan peminjaman ini?"
          confirmText="Ya, Reject"
          cancelText="Batal"
          type="warning"
          onConfirm={confirmRejectExtend}
          onCancel={() => setShowRejectExtendModal(false)}
          loading={actionLoading}
        />
      </div>
    </DashboardLayout>
  );
};

export default LoansManagement;