import { useEffect, useState } from 'react';
import DashboardLayout from '../../components/layouts/DashboardLayout';
import DataTable from '../../components/dashboard/DataTable';
import IconButton from '../../components/common/IconButton';
import { getAllUsers, createUser, updateUser, deleteUser } from '../../api/admin';
import PageHeader from '../../components/common/PageHeader';

const initialForm = {
  id: null,
  username: '',
  email: '',
  fullName: '',
  role: 'USER',
  password: '',
  createdAt: '',
  updatedAt: '',
};

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
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState(initialForm);
  const [isEdit, setIsEdit] = useState(false);
  const [modalError, setModalError] = useState(null);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('');

  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      const data = await getAllUsers();
      setUsers(data);
    } catch (err) {
      setError('Gagal memuat data pengguna');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleOpenModal = (user = null) => {
    setModalError(null);
    if (user) {
      setForm({ ...user, password: '' });
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
        await updateUser(form.id, form);
      } else {
        await createUser(form);
      }
      handleCloseModal();
      fetchUsers();
    } catch (err) {
      setModalError(err?.response?.data?.message || 'Gagal menyimpan data');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Yakin ingin menghapus user ini?')) return;
    try {
      await deleteUser(id);
      fetchUsers();
    } catch (err) {
      alert('Gagal menghapus user');
    }
  };

  const filteredUsers = users.filter(u => {
    const matchRole = roleFilter ? u.role === roleFilter : true;
    const matchSearch = search
      ? (
          u.username?.toLowerCase().includes(search.toLowerCase()) ||
          u.email?.toLowerCase().includes(search.toLowerCase()) ||
          (u.fullName || '').toLowerCase().includes(search.toLowerCase())
        )
      : true;
    return matchRole && matchSearch;
  });

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

  const getRoleBadgeClass = (role) => {
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
  };

  return (
    <DashboardLayout>
      <div className="px-4 py-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <PageHeader 
            title="Manajemen Pengguna" 
            icon={
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            }
          />
          <div className="flex flex-col md:flex-row gap-2 md:gap-4 items-center">
            <input
              type="text"
              placeholder="Cari username, email, nama..."
              className="border rounded-md px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 shadow-sm"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
            <select
              className="border rounded-md px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 shadow-sm"
              value={roleFilter}
              onChange={e => setRoleFilter(e.target.value)}
            >
              <option value="">Semua Role</option>
              <option value="USER">User</option>
              <option value="ADMIN">Admin</option>
              <option value="TECHNICIAN">Technician</option>
            </select>
            <button
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md shadow-sm flex items-center gap-1 transition-colors"
              onClick={() => exportToCSV(filteredUsers)}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
              CSV
            </button>
            <button 
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md shadow-sm flex items-center gap-1 transition-colors"
              onClick={() => handleOpenModal()}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
              </svg>
              Tambah Pengguna
            </button>
          </div>
        </div>
        {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">{error}</div>}
        <DataTable columns={columns} data={filteredUsers} isLoading={isLoading} />
      </div>
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50 backdrop-blur-sm">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md animate-fadeIn">
            <h2 className="text-xl font-semibold mb-4">{isEdit ? 'Edit Pengguna' : 'Tambah Pengguna'}</h2>
            {modalError && <div className="bg-red-100 border border-red-400 text-red-700 px-3 py-2 rounded mb-2">{modalError}</div>}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block mb-1 text-sm font-medium text-gray-700">Username</label>
                <input type="text" name="username" value={form.username} onChange={handleChange} className="w-full border rounded-md px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 shadow-sm" required />
              </div>
              <div>
                <label className="block mb-1 text-sm font-medium text-gray-700">Email</label>
                <input type="email" name="email" value={form.email} onChange={handleChange} className="w-full border rounded-md px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 shadow-sm" required />
              </div>
              <div>
                <label className="block mb-1 text-sm font-medium text-gray-700">Nama Lengkap</label>
                <input type="text" name="fullName" value={form.fullName} onChange={handleChange} className="w-full border rounded-md px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 shadow-sm" />
              </div>
              <div>
                <label className="block mb-1 text-sm font-medium text-gray-700">Role</label>
                <select name="role" value={form.role} onChange={handleChange} className="w-full border rounded-md px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 shadow-sm">
                  <option value="USER">User</option>
                  <option value="ADMIN">Admin</option>
                  <option value="TECHNICIAN">Technician</option>
                </select>
              </div>
              <div>
                <label className="block mb-1 text-sm font-medium text-gray-700">
                  Password {isEdit && <span className="text-xs text-gray-500">(Kosongkan jika tidak ingin mengubah)</span>}
                </label>
                <input type="password" name="password" value={form.password} onChange={handleChange} className="w-full border rounded-md px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 shadow-sm" autoComplete="new-password" required={!isEdit} />
              </div>
              {isEdit && (
                <>
                  <div>
                    <label className="block mb-1 text-xs font-medium text-gray-500">Dibuat</label>
                    <input type="text" value={form.createdAt ? new Date(form.createdAt).toLocaleString('id-ID') : ''} readOnly className="w-full border bg-gray-100 rounded-md px-3 py-2 text-gray-500" />
                  </div>
                  <div>
                    <label className="block mb-1 text-xs font-medium text-gray-500">Diubah</label>
                    <input type="text" value={form.updatedAt ? new Date(form.updatedAt).toLocaleString('id-ID') : ''} readOnly className="w-full border bg-gray-100 rounded-md px-3 py-2 text-gray-500" />
                  </div>
                </>
              )}
              <div className="flex justify-end gap-2 mt-4">
                <button type="button" className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-md transition-colors" onClick={handleCloseModal}>Batal</button>
                <button type="submit" className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md transition-colors">{isEdit ? 'Simpan' : 'Tambah'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
};

export default UsersManagement; 