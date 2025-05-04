import { useEffect, useState } from 'react';
import DashboardLayout from '../../components/layouts/DashboardLayout';
import { getAllEquipment, getAllLabs } from '../../api/admin';
import { getAllRepairs, updateRepair, deleteRepair } from '../../api/repairs';
import '../../utils/animations.css';
import IconButton from '../../components/common/IconButton';
import { Link } from 'react-router-dom';

const RepairTasks = () => {
  const [repairs, setRepairs] = useState([]);
  const [equipment, setEquipment] = useState([]);
  const [labs, setLabs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [labFilter, setLabFilter] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [loadingAction, setLoadingAction] = useState(false);
  const [editRepair, setEditRepair] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editForm, setEditForm] = useState({ status: '', description: '', notes: '' });

  const fetchAll = async () => {
    setLoading(true);
    setError(null);
    try {
      const [repairsRes, eqRes, labsRes] = await Promise.all([
        getAllRepairs(),
        getAllEquipment(),
        getAllLabs()
      ]);
      setRepairs(repairsRes);
      setEquipment(eqRes);
      setLabs(labsRes);
    } catch (err) {
      setError('Gagal memuat data repair');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAll();
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case 'PENDING':
        return 'text-yellow-600 bg-yellow-100';
      case 'IN_PROGRESS':
        return 'text-blue-600 bg-blue-100';
      case 'COMPLETED':
        return 'text-green-600 bg-green-100';
      case 'CANCELLED':
        return 'text-red-600 bg-red-100';
      case 'UNREPAIRABLE':
        return 'text-gray-600 bg-gray-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'PENDING':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
      case 'IN_PROGRESS':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        );
      case 'COMPLETED':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        );
      case 'CANCELLED':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        );
      case 'UNREPAIRABLE':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        );
      default:
        return null;
    }
  };

  const filteredRepairs = repairs.filter(repair => {
    const eq = equipment.find(e => e.id === repair.equipmentId);
    const matchesSearch = eq ? (eq.name.toLowerCase().includes(search.toLowerCase()) || (eq.type?.toLowerCase().includes(search.toLowerCase()))) : false;
    const matchesStatus = statusFilter ? repair.status === statusFilter : true;
    const matchesLab = labFilter ? (String(eq?.labId) === String(labFilter) || String(eq?.lab?.id) === String(labFilter)) : true;
    return matchesSearch && matchesStatus && matchesLab;
  });

  const handleUpdateStatus = async (repair, newStatus) => {
    setLoadingAction(true);
    try {
      const payload = { status: newStatus };
      if (newStatus === 'COMPLETED') {
        payload.completedAt = new Date().toISOString();
      }
      await updateRepair(repair.id, payload);
      setSuccessMsg('Status berhasil diperbarui!');
      fetchAll();
      setTimeout(() => setSuccessMsg(''), 2000);
    } catch (err) {
      setError('Gagal memperbarui status: ' + (err.response?.data?.message || err.message));
    } finally {
      setLoadingAction(false);
    }
  };

  const handleEditClick = (repair) => {
    setEditRepair(repair);
    setEditForm({ status: repair.status, description: repair.description, notes: repair.notes || '' });
    setShowEditModal(true);
  };

  const handleEditChange = (e) => {
    setEditForm({ ...editForm, [e.target.name]: e.target.value });
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    setLoadingAction(true);
    try {
      const payload = { ...editForm };
      if (payload.status === 'COMPLETED') {
        payload.completedAt = new Date().toISOString();
      }
      await updateRepair(editRepair.id, payload);
      setSuccessMsg('Repair berhasil diupdate!');
      setShowEditModal(false);
      fetchAll();
      setTimeout(() => setSuccessMsg(''), 2000);
    } catch (err) {
      setError('Gagal update: ' + (err.response?.data?.message || err.message));
    } finally {
      setLoadingAction(false);
    }
  };

  const handleDelete = async (id) => {
    setError('');
    setSuccessMsg('');
    if (!window.confirm('Yakin ingin menghapus repair ini?')) return;
    setLoadingAction(true);
    try {
      await deleteRepair(id);
      setSuccessMsg('Repair berhasil dihapus!');
      await fetchAll();
      setTimeout(() => setSuccessMsg(''), 2000);
    } catch (err) {
      setError('Gagal menghapus: ' + (err.response?.data?.message || err.message));
    } finally {
      setLoadingAction(false);
    }
  };

  const handleMarkUnrepairable = async (repair) => {
    if (!window.confirm('Yakin ingin menandai repair ini sebagai TIDAK BISA DIPERBAIKI? Setelah ini harus dikonfirmasi admin.')) return;
    setLoadingAction(true);
    try {
      await updateRepair(repair.id, { status: 'UNREPAIRABLE' });
      setSuccessMsg('Repair berhasil ditandai sebagai tidak bisa diperbaiki! Menunggu konfirmasi admin.');
      fetchAll();
      setTimeout(() => setSuccessMsg(''), 2000);
    } catch (err) {
      setError('Gagal menandai repair: ' + (err.response?.data?.message || err.message));
    } finally {
      setLoadingAction(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="px-6 py-8 bg-gray-50 min-h-screen">
        <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl shadow-lg mb-8 p-6 text-white animate-fadeIn">
          <div className="flex items-center">
            <div className="mr-4 bg-white bg-opacity-20 p-3 rounded-full">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <div>
              <h1 className="text-3xl font-bold">Repair Tasks</h1>
              <p className="opacity-80">Mengelola dan memantau semua perbaikan peralatan</p>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-5 mb-8 stagger-children">
          <div className="bg-white rounded-xl shadow-md p-5 border border-gray-100 flex items-center card-hover animate-slideInLeft">
            <div className="p-3 rounded-full bg-yellow-100 text-yellow-600 mr-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">Pending</h3>
              <p className="text-2xl font-bold text-yellow-600">{repairs.filter(r => r.status === 'PENDING').length}</p>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-md p-5 border border-gray-100 flex items-center card-hover animate-slideInLeft">
            <div className="p-3 rounded-full bg-blue-100 text-blue-600 mr-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">In Progress</h3>
              <p className="text-2xl font-bold text-blue-600">{repairs.filter(r => r.status === 'IN_PROGRESS').length}</p>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-md p-5 border border-gray-100 flex items-center card-hover animate-slideInLeft">
            <div className="p-3 rounded-full bg-green-100 text-green-600 mr-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">Completed</h3>
              <p className="text-2xl font-bold text-green-600">{repairs.filter(r => r.status === 'COMPLETED').length}</p>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-md p-5 border border-gray-100 flex items-center card-hover animate-slideInLeft">
            <div className="p-3 rounded-full bg-red-100 text-red-600 mr-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">Cancelled</h3>
              <p className="text-2xl font-bold text-red-600">{repairs.filter(r => r.status === 'CANCELLED').length}</p>
            </div>
          </div>
        </div>
        
        {successMsg && (
          <div className="mb-6 px-4 py-3 rounded-lg bg-green-100 text-green-800 border border-green-300 flex items-center animate-slideDown">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-green-500" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            {successMsg}
          </div>
        )}
        
        <div className="bg-white rounded-xl shadow-md p-6 mb-8 animate-scaleIn border border-gray-100 transition-all duration-300 hover:shadow-lg">
          <div className="flex flex-col sm:flex-row gap-4 items-center">
            <div className="relative w-full sm:w-64 flex-grow">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input
                type="text"
                placeholder="Cari berdasarkan nama atau kategori..."
                className="pl-10 w-full border-2 border-gray-200 rounded-lg py-2 px-4 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </div>
            
            <div className="w-full sm:w-auto flex-shrink-0">
              <div className="relative">
                <select
                  className="appearance-none w-full bg-white border-2 border-gray-200 rounded-lg py-2 pl-4 pr-10 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                  value={labFilter}
                  onChange={e => setLabFilter(e.target.value)}
                >
                  <option value="">Semua Lab</option>
                  {labs.map(lab => (
                    <option key={lab.id} value={lab.id}>{lab.name}</option>
                  ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                  <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                    <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                  </svg>
                </div>
              </div>
            </div>
            
            <div className="w-full sm:w-auto flex-shrink-0">
              <div className="relative">
                <select
                  className="appearance-none w-full bg-white border-2 border-gray-200 rounded-lg py-2 pl-4 pr-10 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                  value={statusFilter}
                  onChange={e => setStatusFilter(e.target.value)}
                >
                  <option value="">Semua Status</option>
                  <option value="PENDING">Pending</option>
                  <option value="IN_PROGRESS">In Progress</option>
                  <option value="COMPLETED">Completed</option>
                  <option value="CANCELLED">Cancelled</option>
                  <option value="UNREPAIRABLE">Unrepairable</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                  <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                    <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {loading ? (
          <div className="flex justify-center items-center min-h-[40vh] animate-fadeIn">
            <div className="animate-pulse flex flex-col items-center">
              <div className="h-16 w-16 rounded-full border-4 border-t-indigo-500 border-b-indigo-700 border-r-transparent border-l-transparent animate-spin"></div>
              <p className="mt-4 text-gray-500 font-medium">Memuat data perbaikan...</p>
            </div>
          </div>
        ) : error ? (
          <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded shadow-md animate-fadeIn">
            <div className="flex items-center">
              <svg className="h-6 w-6 mr-3 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p>{error}</p>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100 transition-all duration-300 hover:shadow-lg animate-scaleIn">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Peralatan
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Lab
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Tanggal
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Deskripsi
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Aksi
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredRepairs.length === 0 ? (
                    <tr>
                      <td colSpan="6" className="px-6 py-10 text-center text-gray-500">
                        <div className="flex flex-col items-center">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-gray-400 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </svg>
                          <p className="text-lg font-medium">Tidak ada perbaikan peralatan</p>
                          <p className="text-sm">Coba mengatur filter pencarian Anda</p>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    filteredRepairs.map(repair => {
                      const eq = equipment.find(e => e.id === repair.equipmentId);
                      const labName = eq && labs.find(l => l.id === eq.labId)?.name;
                      return (
                        <tr key={repair.id} className="hover:bg-gray-50 transition-colors">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">{eq ? eq.name : '-'}</div>
                            {eq && <div className="text-xs text-gray-500">{eq.type || 'No type'}</div>}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">{labName || '-'}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">{repair.createdAt ? repair.createdAt.split('T')[0] : '-'}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 py-1 inline-flex items-center text-xs leading-5 font-semibold rounded-full ${getStatusColor(repair.status)}`}>
                              {getStatusIcon(repair.status)}
                              {repair.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900 max-w-xs truncate">{repair.description || '-'}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <div className="flex gap-2">
                              {repair.status === 'PENDING' && (
                                <button
                                  className="flex items-center text-blue-600 hover:text-blue-900 bg-blue-50 hover:bg-blue-100 px-2 py-1 rounded transition-colors"
                                  onClick={() => handleUpdateStatus(repair, 'IN_PROGRESS')}
                                  disabled={loadingAction}
                                  title="Start Repair"
                                >
                                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                  </svg>
                                  Start
                                </button>
                              )}
                              {repair.status === 'IN_PROGRESS' && (
                                <button
                                  className="flex items-center text-green-600 hover:text-green-900 bg-green-50 hover:bg-green-100 px-2 py-1 rounded transition-colors"
                                  onClick={() => handleUpdateStatus(repair, 'COMPLETED')}
                                  disabled={loadingAction}
                                  title="Complete Repair"
                                >
                                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                  </svg>
                                  Complete
                                </button>
                              )}
                              {['PENDING', 'IN_PROGRESS'].includes(repair.status) && (
                                <button
                                  className="flex items-center text-red-700 hover:text-white bg-red-200 hover:bg-red-600 px-2 py-1 rounded transition-colors ml-2"
                                  onClick={() => handleMarkUnrepairable(repair)}
                                  disabled={loadingAction}
                                  title="Tandai Tidak Bisa Diperbaiki (Menunggu Konfirmasi Admin)"
                                >
                                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                                  </svg>
                                  Tidak Bisa Diperbaiki
                                </button>
                              )}
                              <Link to={`/technician/repairs/${repair.id}`} title="Lihat Detail">
                                <IconButton type="view" onClick={() => {}} tooltip="Lihat Detail" size="sm" />
                              </Link>
                              <button
                                onClick={() => handleEditClick(repair)}
                                title="Edit Repair"
                              >
                                <IconButton type="edit" onClick={() => handleEditClick(repair)} tooltip="Edit" size="sm" />
                              </button>
                              <button
                                onClick={() => handleDelete(repair.id)}
                                title="Delete Repair"
                              >
                                <IconButton type="delete" onClick={() => handleDelete(repair.id)} tooltip="Delete" size="sm" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
        {showEditModal && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 animate-fadeIn">
            <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md animate-scaleIn">
              <div className="flex justify-between items-center mb-4 pb-2 border-b">
                <h2 className="text-xl font-bold text-gray-800">Edit Repair Task</h2>
                <button 
                  onClick={() => setShowEditModal(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <form onSubmit={handleEditSubmit}>
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="status">Status</label>
                  <select 
                    id="status"
                    name="status" 
                    value={editForm.status} 
                    onChange={handleEditChange} 
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                  >
                    <option value="PENDING">Pending</option>
                    <option value="IN_PROGRESS">In Progress</option>
                    <option value="COMPLETED">Completed</option>
                    <option value="CANCELLED">Cancelled</option>
                    <option value="UNREPAIRABLE">Unrepairable</option>
                  </select>
                </div>
                
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="description">Description</label>
                  <input 
                    id="description"
                    type="text"
                    name="description" 
                    value={editForm.description} 
                    onChange={handleEditChange} 
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                  />
                </div>
                
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="notes">Notes</label>
                  <textarea 
                    id="notes"
                    name="notes" 
                    value={editForm.notes} 
                    onChange={handleEditChange} 
                    rows="3"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                  ></textarea>
                </div>
                
                <div className="flex justify-end gap-2 mt-6">
                  <button 
                    type="button" 
                    onClick={() => setShowEditModal(false)} 
                    className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100 transition-colors"
                    disabled={loadingAction}
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit" 
                    className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white transition-colors flex items-center"
                    disabled={loadingAction}
                  >
                    {loadingAction ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Saving...
                      </>
                    ) : (
                      'Save Changes'
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default RepairTasks; 