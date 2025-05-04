import { useEffect, useState } from 'react';
import DashboardLayout from '../../components/layouts/DashboardLayout';
import DataTable from '../../components/dashboard/DataTable';
import IconButton from '../../components/common/IconButton';
import { getAllEquipment, getAllLabs } from '../../api/admin';
import api from '../../api/axios';
import PageHeader from '../../components/common/PageHeader';
import { Link } from 'react-router-dom';

const initialForm = {
  id: null,
  name: '',
  description: '',
  serialNumber: '',
  type: '',
  status: 'AVAILABLE',
  location: '',
  purchaseDate: '',
  purchasePrice: '',
  manufacturer: '',
  model: '',
  labId: '',
  createdAt: '',
  updatedAt: '',
};

const EquipmentManagement = () => {
  const [equipment, setEquipment] = useState([]);
  const [labs, setLabs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState(initialForm);
  const [isEdit, setIsEdit] = useState(false);
  const [modalError, setModalError] = useState(null);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [showViewModal, setShowViewModal] = useState(false);
  const [viewData, setViewData] = useState(null);

  const fetchEquipment = async () => {
    setIsLoading(true);
    try {
      const data = await getAllEquipment();
      setEquipment(data);
    } catch (err) {
      setError('Gagal memuat data peralatan');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchLabs = async () => {
    try {
      const data = await getAllLabs();
      setLabs(data);
    } catch {}
  };

  useEffect(() => {
    fetchEquipment();
    fetchLabs();
  }, []);

  const handleOpenModal = (item = null) => {
    setModalError(null);
    if (item) {
      setForm({ ...item, labId: item.labId || '' });
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
        await api.put(`/equipment/${form.id}`, form);
      } else {
        await api.post('/equipment', form);
      }
      handleCloseModal();
      fetchEquipment();
    } catch (err) {
      setModalError(err?.response?.data?.message || 'Gagal menyimpan data');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Yakin ingin menghapus peralatan ini?')) return;
    try {
      await api.delete(`/equipment/${id}`);
      fetchEquipment();
    } catch (err) {
      alert('Gagal menghapus peralatan');
    }
  };

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
            onClick={() => { setViewData(row); setShowViewModal(true); }}
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
  
  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'AVAILABLE':
        return 'bg-green-100 text-green-800';
      case 'IN_USE':
        return 'bg-blue-100 text-blue-800';
      case 'UNDER_MAINTENANCE':
        return 'bg-yellow-100 text-yellow-800';
      case 'UNDER_REPAIR':
        return 'bg-orange-100 text-orange-800';
      case 'INACTIVE':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const exportToCSV = () => {
    const headers = ['ID', 'Nama', 'Serial Number', 'Tipe', 'Status', 'Lokasi', 'Lab', 'Dibuat', 'Diubah'];
    const rows = filteredEquipment.map(item => [
      item.id,
      item.name,
      item.serialNumber,
      item.type,
      item.status,
      item.location,
      (item.lab && item.lab.name) ? item.lab.name : (labs.find(l => l.id === item.labId)?.name || '-'),
      item.createdAt ? new Date(item.createdAt).toLocaleString('id-ID') : '-',
      item.updatedAt ? new Date(item.updatedAt).toLocaleString('id-ID') : '-'
    ]);
    let csvContent = 'data:text/csv;charset=utf-8,' +
      headers.join(',') + '\n' +
      rows.map(e => e.map(v => '"' + (v ?? '') + '"').join(',')).join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', 'equipment_management.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filteredEquipment = equipment.filter(item => {
    const labName = (item.lab && item.lab.name) ? item.lab.name : (labs.find(l => l.id === item.labId)?.name || '');
    const matchStatus = statusFilter ? item.status === statusFilter : true;
    return (
      matchStatus && (
        item.name.toLowerCase().includes(search.toLowerCase()) ||
        item.serialNumber.toLowerCase().includes(search.toLowerCase()) ||
        (item.type || '').toLowerCase().includes(search.toLowerCase()) ||
        (item.location || '').toLowerCase().includes(search.toLowerCase()) ||
        labName.toLowerCase().includes(search.toLowerCase())
      )
    );
  });

  return (
    <DashboardLayout>
      <div className="px-4 py-6">
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
        <DataTable columns={columns} data={filteredEquipment} isLoading={isLoading} />
      </div>
      {/* Modal Form */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50 backdrop-blur-sm">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md max-h-[80vh] overflow-y-auto animate-fadeIn">
            <h2 className="text-xl font-semibold mb-4">{isEdit ? 'Edit Peralatan' : 'Tambah Peralatan'}</h2>
            {modalError && <div className="bg-red-100 border border-red-400 text-red-700 px-3 py-2 rounded mb-2">{modalError}</div>}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block mb-1 text-sm font-medium text-gray-700">Nama</label>
                <input type="text" name="name" value={form.name} onChange={handleChange} className="w-full border rounded-md px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500" required />
              </div>
              <div>
                <label className="block mb-1 text-sm font-medium text-gray-700">Deskripsi</label>
                <textarea name="description" value={form.description} onChange={handleChange} className="w-full border rounded-md px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500" rows={2} />
              </div>
              <div>
                <label className="block mb-1 text-sm font-medium text-gray-700">Serial Number</label>
                <input type="text" name="serialNumber" value={form.serialNumber} onChange={handleChange} className="w-full border rounded-md px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500" required />
              </div>
              <div>
                <label className="block mb-1 text-sm font-medium text-gray-700">Tipe</label>
                <input type="text" name="type" value={form.type} onChange={handleChange} className="w-full border rounded-md px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500" />
              </div>
              <div>
                <label className="block mb-1 text-sm font-medium text-gray-700">Status</label>
                <select name="status" value={form.status} onChange={handleChange} className="w-full border rounded-md px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500">
                  <option value="AVAILABLE">Available</option>
                  <option value="IN_USE">In Use</option>
                  <option value="UNDER_MAINTENANCE">Under Maintenance</option>
                  <option value="UNDER_REPAIR">Under Repair</option>
                  <option value="INACTIVE">Inactive</option>
                </select>
              </div>
              <div>
                <label className="block mb-1 text-sm font-medium text-gray-700">Lokasi</label>
                <input type="text" name="location" value={form.location} onChange={handleChange} className="w-full border rounded-md px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500" />
              </div>
              <div>
                <label className="block mb-1 text-sm font-medium text-gray-700">Tanggal Pembelian</label>
                <input type="date" name="purchaseDate" value={form.purchaseDate ? form.purchaseDate.slice(0,10) : ''} onChange={handleChange} className="w-full border rounded-md px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500" />
              </div>
              <div>
                <label className="block mb-1 text-sm font-medium text-gray-700">Harga Pembelian</label>
                <input type="number" name="purchasePrice" value={form.purchasePrice} onChange={handleChange} className="w-full border rounded-md px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500" min="0" step="0.01" />
              </div>
              <div>
                <label className="block mb-1 text-sm font-medium text-gray-700">Pabrikan</label>
                <input type="text" name="manufacturer" value={form.manufacturer} onChange={handleChange} className="w-full border rounded-md px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500" />
              </div>
              <div>
                <label className="block mb-1 text-sm font-medium text-gray-700">Model</label>
                <input type="text" name="model" value={form.model} onChange={handleChange} className="w-full border rounded-md px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500" />
              </div>
              <div>
                <label className="block mb-1 text-sm font-medium text-gray-700">Lab</label>
                <select name="labId" value={form.labId} onChange={handleChange} className="w-full border rounded-md px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500">
                  <option value="">-</option>
                  {labs.map(lab => (
                    <option key={lab.id} value={lab.id}>{lab.name}</option>
                  ))}
                </select>
              </div>
              <div className="flex justify-end gap-2 mt-4">
                <button type="button" className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-md transition-colors" onClick={handleCloseModal}>Batal</button>
                <button type="submit" className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md transition-colors">{isEdit ? 'Simpan' : 'Tambah'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* Modal View */}
      {showViewModal && viewData && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 backdrop-blur-sm transition-opacity duration-300">
          <div 
            className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[85vh] overflow-y-auto transform transition-all duration-300 ease-in-out animate-fadeIn" 
            style={{animation: 'fadeInScale 0.3s ease-out'}}
          >
            <div className="bg-gradient-to-r from-indigo-600 to-blue-500 p-6 rounded-t-xl">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-white flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                  Detail Peralatan
                </h2>
                <button 
                  onClick={() => setShowViewModal(false)}
                  className="text-white hover:text-gray-200 transition-colors duration-200"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-indigo-50 p-4 rounded-lg">
                  <h3 className="text-lg font-semibold text-indigo-700 mb-3 border-b border-indigo-200 pb-2">Informasi Utama</h3>
                  <div className="space-y-3">
                    <div className="flex items-center">
                      <span className="text-gray-500 w-32">ID:</span>
                      <span className="font-medium text-gray-900">{viewData.id}</span>
                    </div>
                    <div className="flex items-center">
                      <span className="text-gray-500 w-32">Nama:</span>
                      <span className="font-medium text-gray-900">{viewData.name}</span>
                    </div>
                    <div>
                      <span className="text-gray-500 block mb-1">Deskripsi:</span>
                      <div className="font-medium text-gray-900 bg-white p-2 rounded border border-indigo-100">
                        {viewData.description || <span className="text-gray-400 italic">Tidak ada deskripsi</span>}
                      </div>
                    </div>
                    <div className="flex items-center">
                      <span className="text-gray-500 w-32">Serial Number:</span>
                      <span className="font-medium text-gray-900">{viewData.serialNumber}</span>
                    </div>
                    <div className="flex items-center">
                      <span className="text-gray-500 w-32">Tipe:</span>
                      <span className="font-medium text-gray-900">{viewData.type || '-'}</span>
                    </div>
                    <div className="flex items-center">
                      <span className="text-gray-500 w-32">Status:</span>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusBadgeClass(viewData.status)}`}>
                        {viewData.status}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h3 className="text-lg font-semibold text-blue-700 mb-3 border-b border-blue-200 pb-2">Lokasi & Kepemilikan</h3>
                  <div className="space-y-3">
                    <div className="flex items-center">
                      <span className="text-gray-500 w-32">Lokasi:</span>
                      <span className="font-medium text-gray-900">{viewData.location || '-'}</span>
                    </div>
                    <div className="flex items-center">
                      <span className="text-gray-500 w-32">Lab:</span>
                      <span className="font-medium text-gray-900">
                        {viewData.lab && viewData.lab.name ? viewData.lab.name : (labs.find(l => l.id === viewData.labId)?.name || '-')}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="bg-green-50 p-4 rounded-lg">
                  <h3 className="text-lg font-semibold text-green-700 mb-3 border-b border-green-200 pb-2">Spesifikasi Produk</h3>
                  <div className="space-y-3">
                    <div className="flex items-center">
                      <span className="text-gray-500 w-32">Pabrikan:</span>
                      <span className="font-medium text-gray-900">{viewData.manufacturer || '-'}</span>
                    </div>
                    <div className="flex items-center">
                      <span className="text-gray-500 w-32">Model:</span>
                      <span className="font-medium text-gray-900">{viewData.model || '-'}</span>
                    </div>
                  </div>
                </div>
                <div className="bg-purple-50 p-4 rounded-lg">
                  <h3 className="text-lg font-semibold text-purple-700 mb-3 border-b border-purple-200 pb-2">Pembelian & Waktu</h3>
                  <div className="space-y-3">
                    <div className="flex items-center">
                      <span className="text-gray-500 w-32">Tanggal Pembelian:</span>
                      <span className="font-medium text-gray-900">
                        {viewData.purchaseDate ? new Date(viewData.purchaseDate).toLocaleDateString('id-ID') : '-'}
                      </span>
                    </div>
                    <div className="flex items-center">
                      <span className="text-gray-500 w-32">Harga:</span>
                      <span className="font-medium text-gray-900">
                        {viewData.purchasePrice ? `Rp${Number(viewData.purchasePrice).toLocaleString('id-ID')}` : '-'}
                      </span>
                    </div>
                    <div className="flex items-center">
                      <span className="text-gray-500 w-32">Dibuat:</span>
                      <span className="font-medium text-gray-900">
                        {viewData.createdAt ? new Date(viewData.createdAt).toLocaleString('id-ID') : '-'}
                      </span>
                    </div>
                    <div className="flex items-center">
                      <span className="text-gray-500 w-32">Diubah:</span>
                      <span className="font-medium text-gray-900">
                        {viewData.updatedAt ? new Date(viewData.updatedAt).toLocaleString('id-ID') : '-'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-gray-50 px-6 py-4 rounded-b-xl border-t">
              <div className="flex justify-end">
                <button 
                  type="button" 
                  className="px-5 py-2.5 bg-gradient-to-r from-indigo-600 to-blue-500 hover:from-indigo-700 hover:to-blue-600 text-white rounded-md shadow-md transition-all duration-200 flex items-center" 
                  onClick={() => setShowViewModal(false)}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                  Tutup
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
};

export default EquipmentManagement; 