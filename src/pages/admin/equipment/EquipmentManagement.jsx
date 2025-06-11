import DashboardLayout from '../../../components/layouts/DashboardLayout';
import DataTable from '../../../components/dashboard/DataTable';
import IconButton from '../../../components/common/IconButton';
import PageHeader from '../../../components/common/PageHeader';
import { Link } from 'react-router-dom';
import ConfirmModal from '../../../components/common/ConfirmModal';
import EquipmentFormModal from '../../../components/admin/equipment/EquipmentFormModal';
import EquipmentViewModal from '../../../components/admin/equipment/EquipmentViewModal';
import useEquipmentManagement from '../../../hooks/admin/useEquipmentManagement';

const EquipmentManagement = () => {
  const {
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
  } = useEquipmentManagement();

  const columns = [
    { id: 'id', header: 'ID', sortable: true },
    { id: 'name', header: 'Nama', sortable: true },
    { id: 'serialNumber', header: 'Serial Number', sortable: true },
    { id: 'type', header: 'Tipe', sortable: true },
    { 
      id: 'status', 
      header: 'Status', 
      sortable: true,
      render: row => (
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusBadgeClass(row.status)}`}>
          {row.status}
        </span>
      )
    },
    { id: 'location', header: 'Lokasi', sortable: true },
    { id: 'lab', header: 'Lab', sortable: true, render: row => (row.lab && row.lab.name ? row.lab.name : (row.labId ? row.labId : '-')) },
    { id: 'createdAt', header: 'Dibuat', sortable: true, render: row => new Date(row.createdAt).toLocaleDateString('id-ID') },
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
          <IconButton 
            type="edit" 
            onClick={() => handleOpenModal(row)} 
            tooltip="Edit"
            size="sm"
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
            title="Manajemen Peralatan" 
            icon={
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            }
          />
          <div className="flex gap-2 items-center">
            <input
              type="text"
              placeholder="Cari peralatan..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="border rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
            <select
              className="border rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value)}
            >
              <option value="">Semua Status</option>
              <option value="AVAILABLE">Available</option>
              <option value="IN_USE">In Use</option>
              <option value="UNDER_MAINTENANCE">Under Maintenance</option>
              <option value="UNDER_REPAIR">Under Repair</option>
              <option value="INACTIVE">Inactive</option>
            </select>
            <button
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md shadow-sm flex items-center gap-1 transition-colors"
              onClick={exportToCSV}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
              CSV
            </button>
            <Link to="/admin/confirm-unrepairable" className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md shadow-sm flex items-center gap-1 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-1.414 1.414A9 9 0 105.636 18.364l1.414-1.414A7 7 0 1116.95 7.05z" />
              </svg>
              Konfirmasi Rusak Permanen
            </Link>
            <button 
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md shadow-sm flex items-center gap-1 transition-colors"
              onClick={() => handleOpenModal()}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
              </svg>
              Tambah Peralatan
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
        <DataTable columns={columns} data={filteredEquipment} isLoading={isLoading} />
      </div>
      {/* Modular Form Modal */}
      <EquipmentFormModal
        isOpen={showModal}
        onClose={handleCloseModal}
        onSubmit={handleSubmit}
        form={form}
        onChange={handleChange}
        isEdit={isEdit}
        modalError={modalError}
        labs={labs}
        loading={isLoading}
      />
      {/* Modular View Modal */}
      <EquipmentViewModal
        isOpen={showViewModal}
        onClose={handleCloseViewModal}
        data={viewData}
      />
      <ConfirmModal
        isOpen={!!confirmDeleteId}
        title="Konfirmasi Hapus"
        message="Apakah Anda yakin ingin menghapus peralatan ini?"
        confirmText="Ya, Hapus"
        cancelText="Batal"
        onConfirm={confirmDelete}
        onCancel={() => handleDelete(null)}
        loading={deleteLoading}
      />
    </DashboardLayout>
  );
};

export default EquipmentManagement;