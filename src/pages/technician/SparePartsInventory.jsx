import { useState, useEffect } from 'react';
import DashboardLayout from '../../components/layouts/DashboardLayout';
import { getAllSpareParts, createSparePart, updateSparePart, deleteSparePart } from '../../api/spareparts';
import { getAllMaintenance } from '../../api/maintenance';
import '../../utils/animations.css'; // Import animasi
import IconButton from '../../components/common/IconButton';

const SparePartsInventory = () => {
  const [spareParts, setSpareParts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentSparePart, setCurrentSparePart] = useState(null);
  const [formData, setFormData] = useState({
    maintenanceTaskId: '',
    name: '',
    partNumber: '',
    quantity: 1,
    replacementDate: '',
    notes: ''
  });
  const [maintenanceTasks, setMaintenanceTasks] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    fetchSpareParts();
    fetchMaintenanceTasks();
  }, []);

  const fetchSpareParts = async () => {
    try {
      setIsLoading(true);
      const data = await getAllSpareParts();
      setSpareParts(data);
      setError(null);
    } catch (err) {
      setError('Failed to load spare parts data');
      setSpareParts([]);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchMaintenanceTasks = async () => {
    try {
      const data = await getAllMaintenance();
      setMaintenanceTasks(data);
    } catch (err) {
      setMaintenanceTasks([]);
    }
  };

  const handleOpenModal = (sparePart = null) => {
    if (sparePart) {
      setCurrentSparePart(sparePart);
      setFormData({
        maintenanceTaskId: sparePart.maintenanceTaskId || '',
        name: sparePart.name || '',
        partNumber: sparePart.partNumber || '',
        quantity: sparePart.quantity || 1,
        replacementDate: sparePart.replacementDate ? sparePart.replacementDate.split('T')[0] : '',
        notes: sparePart.notes || ''
      });
    } else {
      setCurrentSparePart(null);
      setFormData({
        maintenanceTaskId: '',
        name: '',
        partNumber: '',
        quantity: 1,
        replacementDate: '',
        notes: ''
      });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setCurrentSparePart(null);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    let parsedValue = value;
    if (name === 'quantity') {
      parsedValue = parseInt(value, 10) || 1;
    }
    setFormData({
      ...formData,
      [name]: parsedValue
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        maintenanceTaskId: Number(formData.maintenanceTaskId),
        name: formData.name,
        partNumber: formData.partNumber,
        quantity: Number(formData.quantity),
        replacementDate: formData.replacementDate ? new Date(formData.replacementDate) : undefined,
        notes: formData.notes
      };
      if (currentSparePart) {
        await updateSparePart(currentSparePart.id, payload);
        setSuccessMessage('Spare part berhasil diperbarui!');
      } else {
        await createSparePart(payload);
        setSuccessMessage('Spare part baru berhasil ditambahkan!');
      }
      handleCloseModal();
      fetchSpareParts();
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      setError(`Failed to ${currentSparePart ? 'update' : 'create'} spare part`);
      setTimeout(() => setError(null), 3000);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus bagian ini?')) {
      try {
        await deleteSparePart(id);
        setSuccessMessage('Spare part berhasil dihapus!');
        fetchSpareParts();
        setTimeout(() => setSuccessMessage(''), 3000);
      } catch (err) {
        setError('Gagal menghapus Spare part');
        setTimeout(() => setError(null), 3000);
      }
    }
  };

  const filteredSpareParts = spareParts.filter(part => {
    const matchesSearch =
      part.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (part.partNumber || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (part.notes || '').toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex justify-center items-center min-h-[60vh]">
          <div className="animate-pulse flex flex-col items-center">
            <div className="h-16 w-16 rounded-full border-4 border-t-indigo-500 border-b-indigo-700 border-r-transparent border-l-transparent animate-spin"></div>
            <p className="mt-4 text-gray-500 font-medium">Memuat data Spare part...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="px-6 py-8 bg-gray-50 min-h-screen">
        <div className="bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl shadow-lg p-6 mb-8 flex justify-between items-center animate-fadeIn">
          <div className="flex items-center text-white">
            <div className="mr-4 bg-white bg-opacity-20 p-3 rounded-full">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
              </svg>
            </div>
            <div>
              <h1 className="text-3xl font-bold">Inventory Spare Part</h1>
              <p className="opacity-80">Mengelola dan memantau semua bagian pengganti peralatan</p>
            </div>
          </div>
          <button
            onClick={() => handleOpenModal()}
            className="bg-white text-indigo-700 hover:bg-indigo-50 py-2 px-4 rounded-md flex items-center shadow-md hover:shadow-lg transition-all duration-200 transform hover:-translate-y-1 btn-pulse"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
            </svg>
            Tambah Spare part
          </button>
        </div>

        {successMessage && (
          <div className="mb-6 px-4 py-3 rounded bg-green-100 text-green-800 border border-green-300 flex items-center animate-slideDown">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-green-500" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            {successMessage}
          </div>
        )}

        {error && (
          <div className="mb-6 px-4 py-3 rounded bg-red-100 text-red-800 border border-red-300 flex items-center animate-slideDown">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-red-500" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 animate-slideUp">
          <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100 card-hover">
            <div className="flex items-center mb-4">
              <div className="p-3 rounded-full bg-blue-100 text-blue-600 mr-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-gray-800">Total Spare part</h3>
            </div>
            <p className="text-3xl font-bold text-blue-600">{spareParts.length}</p>
          </div>
          
          <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100 card-hover">
            <div className="flex items-center mb-4">
              <div className="p-3 rounded-full bg-green-100 text-green-600 mr-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-gray-800">Total Quantity</h3>
            </div>
            <p className="text-3xl font-bold text-green-600">{spareParts.reduce((sum, part) => sum + (part.quantity || 0), 0)}</p>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100 card-hover">
            <div className="flex items-center mb-4">
              <div className="p-3 rounded-full bg-yellow-100 text-yellow-600 mr-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-gray-800">Penggantian Terakhir</h3>
            </div>
            <p className="text-3xl font-bold text-yellow-600">
              {spareParts.filter(part => part.replacementDate && new Date(part.replacementDate) >= new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)).length}
            </p>
            <p className="text-sm text-gray-500 mt-1">30 hari terakhir</p>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100 transition-all duration-300 hover:shadow-lg mb-6 animate-scaleIn">
          <div className="p-6 border-b border-gray-200 bg-gray-50 flex flex-col sm:flex-row justify-between space-y-3 sm:space-y-0 items-center">
            <h2 className="text-xl font-bold text-gray-800 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              Daftar Spare part
            </h2>
            <div className="relative flex w-full sm:w-64">
              <input
                type="text"
                placeholder="Cari Spare part..."
                className="w-full px-4 py-2 pr-10 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 absolute right-3 top-2.5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
              </svg>
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="absolute right-10 top-2.5 text-gray-400 hover:text-gray-600"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </button>
              )}
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Maintenance Task</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nama Spare part</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nomor Spare part</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Jumlah</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tanggal Penggantian</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Catatan</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Aksi</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredSpareParts.length > 0 ? (
                  filteredSpareParts.map((part, index) => (
                    <tr key={part.id} className="hover:bg-gray-50 transition-colors animate-fadeIn" style={{animationDelay: `${index * 0.05}s`}}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900 flex items-center">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                          {part.maintenanceTask?.description || part.maintenanceTaskId}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{part.name}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900 font-mono">{part.partNumber || '-'}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                          {part.quantity}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900 flex items-center">
                          {part.replacementDate ? (
                            <>
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                              </svg>
                              {part.replacementDate.split('T')[0]}
                            </>
                          ) : (
                            <span className="text-gray-400">-</span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900 truncate max-w-[200px]" title={part.notes}>
                          {part.notes || '-'}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleOpenModal(part)}
                            title="Edit"
                          >
                            <IconButton type="edit" onClick={() => handleOpenModal(part)} tooltip="Edit" size="sm" />
                          </button>
                          <button
                            onClick={() => handleDelete(part.id)}
                            title="Delete"
                          >
                            <IconButton type="delete" onClick={() => handleDelete(part.id)} tooltip="Delete" size="sm" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" className="px-6 py-10 text-center">
                      <div className="flex flex-col items-center animate-fadeIn">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-400 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                        </svg>
                        <p className="text-lg font-medium text-gray-500">Tidak ada Spare part</p>
                        {searchTerm ? (
                          <p className="text-sm text-gray-400 mt-1">Coba mengatur kriteria pencarian Anda</p>
                        ) : (
                          <button 
                            onClick={() => handleOpenModal()} 
                            className="mt-3 inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                          >
                            Tambah Spare part
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          {filteredSpareParts.length > 0 && (
            <div className="bg-gray-50 px-6 py-3 flex items-center justify-between border-t border-gray-200">
              <div className="text-sm text-gray-700">
                Showing <span className="font-medium">{filteredSpareParts.length}</span> {filteredSpareParts.length === 1 ? 'item' : 'items'}
              </div>
            </div>
          )}
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 overflow-y-auto z-50" aria-labelledby="modal-title" role="dialog" aria-modal="true">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div 
              className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity animate-fadeIn" 
              aria-hidden="true"
              onClick={handleCloseModal}
            ></div>

            <div className="inline-block align-bottom bg-white rounded-lg overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full animate-scaleIn">
              <div className="bg-gradient-to-r from-blue-500 to-indigo-600 px-6 py-4 flex justify-between items-center">
                <h3 className="text-xl font-bold text-white flex items-center">
                  {currentSparePart ? (
                    <>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                      </svg>
                      Edit Spare part
                    </>
                  ) : (
                    <>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                      </svg>
                      Tambah Spare part
                    </>
                  )}
                </h3>
                <button 
                  onClick={handleCloseModal} 
                  className="text-white hover:text-gray-200 transition-colors"
                  aria-label="Close modal"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <form onSubmit={handleSubmit} className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Maintenance Task</label>
                    <select
                      name="maintenanceTaskId"
                      value={formData.maintenanceTaskId}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm transition-all"
                      required
                    >
                      <option value="">Pilih Maintenance Task</option>
                      {maintenanceTasks.map((task) => (
                        <option key={task.id} value={task.id}>{task.description}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Nama Spare part</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm transition-all"
                      required
                      placeholder="e.g. LCD Screen"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Nomor Spare part</label>
                    <input
                      type="text"
                      name="partNumber"
                      value={formData.partNumber}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm transition-all"
                      placeholder="e.g. LCD-156-HD"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Quantity</label>
                    <input
                      type="number"
                      name="quantity"
                      value={formData.quantity}
                      onChange={handleChange}
                      min="1"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm transition-all"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Tanggal Penggantian</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                      <input
                        type="date"
                        name="replacementDate"
                        value={formData.replacementDate}
                        onChange={handleChange}
                        className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm transition-all"
                      />
                    </div>
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                    <textarea
                      name="notes"
                      value={formData.notes}
                      onChange={handleChange}
                      rows="3"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm transition-all"
                      placeholder="Informasi tambahan tentang Spare part ini..."
                    ></textarea>
                  </div>
                </div>
                <div className="flex justify-end space-x-3 border-t border-gray-200 pt-5">
                  <button 
                    type="button" 
                    onClick={handleCloseModal} 
                    className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 shadow-sm transition-all"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit" 
                    className="px-6 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 shadow-sm transition-all btn-pulse"
                  >
                    {currentSparePart ? 'Update' : 'Save'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
};

export default SparePartsInventory; 