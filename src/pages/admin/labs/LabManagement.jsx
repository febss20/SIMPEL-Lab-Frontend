import { useEffect, useState } from 'react';
import DashboardLayout from '../../../components/layouts/DashboardLayout';
import DataTable from '../../../components/dashboard/DataTable';
import IconButton from '../../../components/common/IconButton';
import { getAllLabs, createLab, updateLab, deleteLab } from '../../../api/admin';
import PageHeader from '../../../components/common/PageHeader';
import ConfirmModal from '../../../components/common/ConfirmModal';

const initialForm = {
  id: null,
  name: '',
  location: '',
  description: '',
  capacity: '',
  createdAt: '',
  updatedAt: '',
};

const LabManagement = () => {
  const [labs, setLabs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState(initialForm);
  const [isEdit, setIsEdit] = useState(false);
  const [modalError, setModalError] = useState(null);
  const [search, setSearch] = useState('');
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  const fetchLabs = async () => {
    setIsLoading(true);
    try {
      const data = await getAllLabs();
      setLabs(data);
    } catch (err) {
      setError('Gagal memuat data laboratorium');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchLabs();
  }, []);

  const handleOpenModal = (item = null) => {
    setModalError(null);
    if (item) {
      setForm({ ...item });
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
        await updateLab(form.id, form);
        setSuccessMsg('Laboratorium berhasil diupdate!');
        setTimeout(() => setSuccessMsg(''), 2000);
      } else {
        await createLab(form);
      }
      handleCloseModal();
      fetchLabs();
    } catch (err) {
      setModalError(err?.response?.data?.message || 'Gagal menyimpan data');
      if (isEdit) setError('Gagal update: ' + (err?.response?.data?.message || err.message));
    }
  };

  const handleDelete = async (id) => {
    setConfirmDeleteId(id);
  };

  const confirmDelete = async () => {
    if (!confirmDeleteId) return;
    setDeleteLoading(true);
    try {
      await deleteLab(confirmDeleteId);
      setConfirmDeleteId(null);
      setSuccessMsg('Laboratorium berhasil dihapus!');
      fetchLabs();
      setTimeout(() => setSuccessMsg(''), 2000);
    } catch (err) {
      setError('Gagal menghapus: ' + (err?.response?.data?.message || err.message));
    } finally {
      setDeleteLoading(false);
    }
  };

  const exportToCSV = () => {
    const headers = ['ID', 'Nama Lab', 'Lokasi', 'Deskripsi', 'Kapasitas', 'Dibuat', 'Diubah'];
    const rows = filteredLabs.map(item => [
      item.id,
      item.name,
      item.location,
      item.description || '-',
      item.capacity,
      item.createdAt ? new Date(item.createdAt).toLocaleString('id-ID') : '-',
      item.updatedAt ? new Date(item.updatedAt).toLocaleString('id-ID') : '-'
    ]);
    let csvContent = 'data:text/csv;charset=utf-8,' +
      headers.join(',') + '\n' +
      rows.map(e => e.map(v => '"' + (v ?? '') + '"').join(',')).join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', 'labs_management.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  
  const filteredLabs = labs.filter(item => (
    item.name.toLowerCase().includes(search.toLowerCase()) ||
    (item.location || '').toLowerCase().includes(search.toLowerCase()) ||
    String(item.capacity || '').toLowerCase().includes(search.toLowerCase())
  ));

  const columns = [
    { id: 'id', header: 'ID', sortable: true },
    { id: 'name', header: 'Nama Lab', sortable: true },
    { id: 'location', header: 'Lokasi', sortable: true },
    { id: 'description', header: 'Deskripsi', sortable: true },
    { id: 'capacity', header: 'Kapasitas', sortable: true },
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
      <div className="px-4 py-6">
        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-2 md:gap-0">
          <PageHeader 
            title="Manajemen Laboratorium" 
            icon={
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
              </svg>
            }
          />
          <div className="flex gap-2 items-center">
            <input
              type="text"
              placeholder="Cari lab..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="border rounded px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
            <button
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md shadow-sm flex items-center gap-1 transition-colors"
              onClick={exportToCSV}
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
              Lab Baru
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
        <DataTable columns={columns} data={filteredLabs} isLoading={isLoading} />
      </div>
      {/* Modal Form */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50 backdrop-blur-sm">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md max-h-[80vh] overflow-y-auto animate-fadeIn">
            <h2 className="text-xl font-semibold mb-4">{isEdit ? 'Edit Lab' : 'Tambah Lab'}</h2>
            {modalError && <div className="bg-red-100 border border-red-400 text-red-700 px-3 py-2 rounded mb-2">{modalError}</div>}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block mb-1 text-sm font-medium text-gray-700">Nama Lab</label>
                <input type="text" name="name" value={form.name} onChange={handleChange} className="w-full border rounded-md px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500" required />
              </div>
              <div>
                <label className="block mb-1 text-sm font-medium text-gray-700">Lokasi</label>
                <input type="text" name="location" value={form.location} onChange={handleChange} className="w-full border rounded-md px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500" />
              </div>
              <div>
                <label className="block mb-1 text-sm font-medium text-gray-700">Deskripsi</label>
                <textarea name="description" value={form.description} onChange={handleChange} className="w-full border rounded-md px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500" rows={2} />
              </div>
              <div>
                <label className="block mb-1 text-sm font-medium text-gray-700">Kapasitas</label>
                <input type="number" name="capacity" value={form.capacity} onChange={handleChange} className="w-full border rounded-md px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500" min="0" />
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
      <ConfirmModal
        isOpen={!!confirmDeleteId}
        title="Konfirmasi Hapus"
        message="Apakah Anda yakin ingin menghapus laboratorium ini?"
        confirmText="Ya, Hapus"
        cancelText="Batal"
        onConfirm={confirmDelete}
        onCancel={() => setConfirmDeleteId(null)}
        loading={deleteLoading}
      />
    </DashboardLayout>
  );
};

export default LabManagement; 