import { useCallback } from 'react';
import DashboardLayout from '../../../components/layouts/DashboardLayout';
import DataTable from '../../../components/dashboard/DataTable';
import IconButton from '../../../components/common/IconButton';
import PageHeader from '../../../components/common/PageHeader';
import ConfirmModal from '../../../components/common/ConfirmModal';
import UserFormModal from '../../../components/admin/users/UserFormModal';
import useUsersManagement from '../../../hooks/admin/useUsersManagement';

const exportToCSV = (data) => {
  const header = ['ID', 'Username', 'Email', 'Nama Lengkap', 'Role', 'Dibuat', 'Diubah'];
  const rows = data.map(u => [
    u.id,
    u.username,
    u.email,
    u.fullName || '',
    u.role,
    u.createdAt ? new Date(u.createdAt).toLocaleString('id-ID') : '-',
    u.updatedAt ? new Date(u.updatedAt).toLocaleString('id-ID') : '-'
  ]);
  const csvContent = [header, ...rows].map(e => e.map(v => `"${v}"`).join(',')).join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'users_management.csv';
  a.click();
  URL.revokeObjectURL(url);
};

const UsersManagement = () => {
  const {
    isLoading,
    error,
    showModal,
    form,
    isEdit,
    modalError,
    search,
    setSearch,
    roleFilter,
    setRoleFilter,
    confirmDeleteId,
    deleteLoading,
    successMsg,
    handleOpenModal,
    handleCloseModal,
    handleChange,
    handleSubmit,
    handleDelete,
    confirmDelete,
    filteredUsers,
  } = useUsersManagement();

  const getRoleBadgeClass = useCallback((role) => {
    switch (role) {
      case 'ADMIN':
        return 'bg-indigo-100 text-indigo-800';
      case 'TECHNICIAN':
        return 'bg-purple-100 text-purple-800';
      case 'USER':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  }, []);

  const columns = [
    { id: 'id', header: 'ID', sortable: true },
    { id: 'username', header: 'Username', sortable: true },
    { id: 'email', header: 'Email', sortable: true },
    { id: 'fullName', header: 'Nama Lengkap', sortable: true },
    {
      id: 'role',
      header: 'Role',
      sortable: true,
      render: row => (
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRoleBadgeClass(row.role)}`}>
          {row.role}
        </span>
      )
    },
    { id: 'createdAt', header: 'Dibuat', sortable: true, render: row => row.createdAt ? new Date(row.createdAt).toLocaleString('id-ID') : '-' },
    { id: 'updatedAt', header: 'Diubah', sortable: true, render: row => row.updatedAt ? new Date(row.updatedAt).toLocaleString('id-ID') : '-' },
    {
      id: 'actions',
      header: 'Aksi',
      sortable: false,
      render: (row) => (
        <div className="flex gap-2 justify-start">
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
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <PageHeader
            title="Manajemen Pengguna"
            icon={
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            }
          />
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-2 items-stretch sm:items-center w-full sm:w-auto">
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-2 w-full sm:w-auto">
              <input
                type="text"
                placeholder="Cari username, email, nama..."
                className="border rounded-md px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 shadow-sm w-full sm:w-auto text-sm"
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
              <select
                className="border rounded-md px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 shadow-sm w-full sm:w-auto text-sm"
                value={roleFilter}
                onChange={e => setRoleFilter(e.target.value)}
              >
                <option value="">Semua Role</option>
                <option value="ADMIN">Admin</option>
                <option value="TECHNICIAN">Technician</option>
                <option value="USER">User</option>
              </select>
            </div>
            <div className="flex gap-2">
              <button
                className="bg-green-600 hover:bg-green-700 text-white px-3 sm:px-4 py-2 rounded-md shadow-sm flex items-center justify-center gap-1 transition-colors flex-1 sm:flex-none text-sm"
                onClick={() => exportToCSV(filteredUsers)}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 sm:h-5 sm:w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
                <span className="hidden sm:inline">CSV</span>
              </button>
              <button 
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-3 sm:px-4 py-2 rounded-md shadow-sm flex items-center justify-center gap-1 transition-colors flex-1 sm:flex-none text-sm"
                onClick={() => handleOpenModal()}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 sm:h-5 sm:w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                </svg>
                <span className="hidden sm:inline">Tambah User</span>
                <span className="sm:hidden">User</span>
              </button>
            </div>
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
        <DataTable columns={columns} data={filteredUsers} isLoading={isLoading} />
      </div>
      <UserFormModal
        isOpen={showModal}
        isEdit={isEdit}
        form={form}
        error={modalError}
        onChange={handleChange}
        onClose={handleCloseModal}
        onSubmit={handleSubmit}
        loading={isLoading}
      />
      <ConfirmModal
        isOpen={!!confirmDeleteId}
        title="Konfirmasi Hapus"
        message="Apakah Anda yakin ingin menghapus user ini?"
        confirmText="Ya, Hapus"
        cancelText="Batal"
        onConfirm={confirmDelete}
        onCancel={() => handleDelete(null)}
        loading={deleteLoading}
      />
    </DashboardLayout>
  );
};

export default UsersManagement;