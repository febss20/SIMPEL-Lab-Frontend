import { useState, useEffect } from 'react';
import { getAllUsers, createUser, updateUser, deleteUser } from '../../api/admin';

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

export default function useUsersManagement() {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState(initialForm);
  const [isEdit, setIsEdit] = useState(false);
  const [modalError, setModalError] = useState(null);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

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
        setSuccessMsg('Pengguna berhasil diupdate!');
        setTimeout(() => setSuccessMsg(''), 2000);
      } else {
        await createUser(form);
      }
      handleCloseModal();
      fetchUsers();
    } catch (err) {
      setModalError(err?.response?.data?.message || 'Gagal menyimpan data');
      if (isEdit) setError('Gagal update: ' + (err?.response?.data?.message || err.message));
    }
  };

  const handleDelete = (id) => {
    setConfirmDeleteId(id);
  };

  const confirmDelete = async () => {
    if (!confirmDeleteId) return;
    setDeleteLoading(true);
    try {
      await deleteUser(confirmDeleteId);
      setConfirmDeleteId(null);
      setSuccessMsg('Pengguna berhasil dihapus!');
      fetchUsers();
      setTimeout(() => setSuccessMsg(''), 2000);
    } catch (err) {
      setError('Gagal menghapus: ' + (err?.response?.data?.message || err.message));
    } finally {
      setDeleteLoading(false);
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

  return {
    users,
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
    setSuccessMsg,
  };
} 