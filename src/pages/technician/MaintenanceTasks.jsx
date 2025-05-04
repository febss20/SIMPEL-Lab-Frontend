import { useEffect, useState } from 'react';
import DashboardLayout from '../../components/layouts/DashboardLayout';
import { getAllMaintenance, updateMaintenance, deleteMaintenance, createMaintenance } from '../../api/maintenance';
import { getAllEquipment, getAllLabs } from '../../api/admin';
import '../../utils/animations.css';
import IconButton from '../../components/common/IconButton';
import { Link } from 'react-router-dom';

const MaintenanceTasks = () => {
  const [tasks, setTasks] = useState([]);
  const [equipment, setEquipment] = useState([]);
  const [labs, setLabs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [labFilter, setLabFilter] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [loadingAction, setLoadingAction] = useState(false);
  const [editTask, setEditTask] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editForm, setEditForm] = useState({ status: '', description: '', notes: '' });
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [createForm, setCreateForm] = useState({ equipmentId: '', scheduledDate: '', description: '', notes: '' });
  const [stats, setStats] = useState({
    scheduled: 0,
    inProgress: 0,
    completed: 0,
    cancelled: 0
  });

  const fetchAll = async () => {
    setLoading(true);
    setError(null);
    try {
      const [tasksRes, eqRes, labsRes] = await Promise.all([
        getAllMaintenance(),
        getAllEquipment(),
        getAllLabs()
      ]);
      setTasks(tasksRes);
      
      const scheduled = tasksRes.filter(t => t.status === 'SCHEDULED').length;
      const inProgress = tasksRes.filter(t => t.status === 'IN_PROGRESS').length;
      const completed = tasksRes.filter(t => t.status === 'COMPLETED').length;
      const cancelled = tasksRes.filter(t => t.status === 'CANCELLED').length;
      
      setStats({
        scheduled,
        inProgress,
        completed,
        cancelled
      });
      
      setEquipment(eqRes);
      setLabs(labsRes);
    } catch (err) {
      setError('Gagal memuat data maintenance');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAll();
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case 'SCHEDULED':
        return 'text-yellow-600 bg-yellow-100';
      case 'IN_PROGRESS':
        return 'text-blue-600 bg-blue-100';
      case 'COMPLETED':
        return 'text-green-600 bg-green-100';
      case 'CANCELLED':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'SCHEDULED':
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
      default:
        return null;
    }
  };

  const filteredTasks = tasks.filter(task => {
    const eq = equipment.find(e => e.id === task.equipmentId);
    const matchesSearch = eq ? (eq.name.toLowerCase().includes(search.toLowerCase()) || (eq.type?.toLowerCase().includes(search.toLowerCase()))) : false;
    const matchesStatus = statusFilter ? task.status === statusFilter : true;
    const matchesLab = labFilter ? (String(eq?.labId) === String(labFilter) || String(eq?.lab?.id) === String(labFilter)) : true;
    return matchesSearch && matchesStatus && matchesLab;
  });

  const handleUpdateStatus = async (task, newStatus) => {
    setLoadingAction(true);
    try {
      await updateMaintenance(task.id, { status: newStatus });
      setSuccessMsg('Status berhasil diperbarui!');
      fetchAll();
      setTimeout(() => setSuccessMsg(''), 2000);
    } catch (err) {
      setError('Gagal memperbarui status: ' + (err.response?.data?.message || err.message));
    } finally {
      setLoadingAction(false);
    }
  };

  const handleEditClick = (task) => {
    setEditTask(task);
    setEditForm({ status: task.status, description: task.description, notes: task.notes || '' });
    setShowEditModal(true);
  };

  const handleEditChange = (e) => {
    setEditForm({ ...editForm, [e.target.name]: e.target.value });
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    setLoadingAction(true);
    try {
      await updateMaintenance(editTask.id, editForm);
      setSuccessMsg('Task berhasil diupdate!');
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
    if (!window.confirm('Yakin ingin menghapus task ini?')) return;
    setLoadingAction(true);
    try {
      await deleteMaintenance(id);
      setSuccessMsg('Task berhasil dihapus!');
      await fetchAll();
      setTimeout(() => setSuccessMsg(''), 2000);
    } catch (err) {
      setError('Gagal menghapus: ' + (err.response?.data?.message || err.message));
    } finally {
      setLoadingAction(false);
    }
  };

  const handleCreateChange = (e) => {
    setCreateForm({ ...createForm, [e.target.name]: e.target.value });
  };

  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    setLoadingAction(true);
    try {
      await createMaintenance({
        equipmentId: Number(createForm.equipmentId),
        scheduledDate: createForm.scheduledDate,
        description: createForm.description,
        notes: createForm.notes
      });
      setShowCreateModal(false);
      setCreateForm({ equipmentId: '', scheduledDate: '', description: '', notes: '' });
      setSuccessMsg('Jadwal pemeliharaan berhasil dibuat!');
      fetchAll();
      setTimeout(() => setSuccessMsg(''), 2000);
    } catch (err) {
      setError('Gagal membuat jadwal: ' + (err.response?.data?.message || err.message));
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
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
            <div>
              <h1 className="text-3xl font-bold">Maintenance Tasks</h1>
              <p className="opacity-80">Mengelola semua jadwal dan aktivitas pemeliharaan peralatan</p>
            </div>
            <div className="ml-auto flex gap-2 items-center">
              <button
                className="px-4 py-2 rounded bg-white text-indigo-700 hover:bg-indigo-50 text-sm shadow-md hover:shadow-lg transition-all duration-200 transform hover:-translate-y-1 btn-pulse flex items-center"
                onClick={() => setShowCreateModal(true)}
                title="Jadwalkan Pemeliharaan"
              >
                <svg className="inline w-4 h-4 mr-2" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                </svg>
                Jadwalkan Pemeliharaan
              </button>
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
              <h3 className="text-sm font-medium text-gray-500">Scheduled</h3>
              <p className="text-2xl font-bold text-yellow-600">{stats.scheduled}</p>
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
              <p className="text-2xl font-bold text-blue-600">{stats.inProgress}</p>
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
              <p className="text-2xl font-bold text-green-600">{stats.completed}</p>
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
              <p className="text-2xl font-bold text-red-600">{stats.cancelled}</p>
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

        {error && (
          <div className="mb-6 px-4 py-3 rounded-lg bg-red-100 text-red-800 border border-red-300 flex items-center animate-slideDown">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-red-500" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            {error}
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
                placeholder="Cari berdasarkan nama atau tipe alat..."
                className="w-full pl-10 pr-3 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
              {search && (
                <button 
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                  onClick={() => setSearch('')}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </button>
              )}
            </div>
            <div className="w-full sm:w-auto flex-shrink-0">
              <div className="relative">
                <select
                  className="appearance-none w-full bg-white border-2 border-gray-200 rounded-lg py-2 px-4 pr-8 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
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
                    <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/>
                  </svg>
                </div>
              </div>
            </div>
            <div className="w-full sm:w-auto flex-shrink-0">
              <div className="relative">
                <select
                  className="appearance-none w-full bg-white border-2 border-gray-200 rounded-lg py-2 px-4 pr-8 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                  value={statusFilter}
                  onChange={e => setStatusFilter(e.target.value)}
                >
                  <option value="">Semua Status</option>
                  <option value="SCHEDULED">Scheduled</option>
                  <option value="IN_PROGRESS">In Progress</option>
                  <option value="COMPLETED">Completed</option>
                  <option value="CANCELLED">Cancelled</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                  <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                    <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/>
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-20 animate-fadeIn">
            <div className="animate-pulse flex flex-col items-center">
              <div className="h-16 w-16 rounded-full border-4 border-t-indigo-500 border-b-indigo-700 border-r-transparent border-l-transparent animate-spin"></div>
              <p className="mt-4 text-gray-500 font-medium">Memuat data maintenance...</p>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100 transition-all duration-300 hover:shadow-lg animate-scaleIn">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Alat</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Lab</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tanggal</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Deskripsi</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Aksi</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredTasks.length > 0 ? (
                    filteredTasks.map((task, index) => {
                      const eq = equipment.find(e => e.id === task.equipmentId);
                      const labName = eq && labs.find(l => l.id === eq.labId)?.name;
                      return (
                        <tr key={task.id} className="hover:bg-gray-50 transition-colors animate-fadeIn" style={{animationDelay: `${index * 0.05}s`}}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="flex-shrink-0 h-10 w-10 bg-gray-100 rounded-full flex items-center justify-center text-indigo-600">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
                                </svg>
                              </div>
                              <div className="ml-4">
                                <div className="text-sm font-medium text-gray-900">{eq ? eq.name : '-'}</div>
                                <div className="text-xs text-gray-500">{eq?.type || 'No type'}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">{labName || '-'}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center text-sm text-gray-900">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                              </svg>
                              {task.scheduledDate ? new Date(task.scheduledDate).toLocaleDateString() : '-'}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(task.status)} flex items-center`}>
                              {getStatusIcon(task.status)}
                              {task.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900 max-w-xs truncate" title={task.description}>{task.description}</div>
                            {task.notes && (
                              <div className="text-xs text-gray-500 max-w-xs truncate" title={task.notes}>{task.notes}</div>
                            )}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 flex gap-2">
                            {task.status === 'SCHEDULED' && (
                              <button
                                className="flex items-center px-3 py-1 rounded bg-blue-500 hover:bg-blue-600 text-white text-xs shadow-sm hover:shadow transition-all transform hover:-translate-y-0.5"
                                onClick={() => handleUpdateStatus(task, 'IN_PROGRESS')}
                                disabled={loadingAction}
                              >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                Mulai
                              </button>
                            )}
                            {task.status === 'IN_PROGRESS' && (
                              <button
                                className="flex items-center px-3 py-1 rounded bg-green-600 hover:bg-green-700 text-white text-xs shadow-sm hover:shadow transition-all transform hover:-translate-y-0.5"
                                onClick={() => handleUpdateStatus(task, 'COMPLETED')}
                                disabled={loadingAction}
                              >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4.4L19 7" />
                                </svg>
                                Selesai
                              </button>
                            )}
                            {['SCHEDULED', 'IN_PROGRESS'].includes(task.status) && (
                              <button
                                className="flex items-center px-3 py-1 rounded bg-red-500 hover:bg-red-600 text-white text-xs shadow-sm hover:shadow transition-all transform hover:-translate-y-0.5"
                                onClick={() => handleUpdateStatus(task, 'CANCELLED')}
                                disabled={loadingAction}
                              >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                                Batalkan
                              </button>
                            )}
                            <Link to={`/technician/maintenance/${task.id}`} title="Lihat Detail">
                              <IconButton type="view" onClick={() => {}} tooltip="Lihat Detail" size="sm" />
                            </Link>
                            <button
                              onClick={() => handleEditClick(task)}
                              title="Edit"
                            >
                              <IconButton type="edit" onClick={() => handleEditClick(task)} tooltip="Edit" size="sm" />
                            </button>
                            <button
                              onClick={() => handleDelete(task.id)}
                              title="Delete"
                            >
                              <IconButton type="delete" onClick={() => handleDelete(task.id)} tooltip="Delete" size="sm" />
                            </button>
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan="6" className="px-6 py-10 text-center">
                        <div className="flex flex-col items-center animate-fadeIn">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-gray-300 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                          </svg>
                          <p className="text-lg font-medium text-gray-500">Tidak ada task maintenance yang ditemukan</p>
                          {search || statusFilter || labFilter ? (
                            <p className="text-sm text-gray-400 mt-1">Coba ubah filter pencarian</p>
                          ) : (
                            <div className="mt-4">
                              <button
                                onClick={() => setShowCreateModal(true)}
                                className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 flex items-center shadow-sm"
                              >
                                <svg className="h-4 w-4 mr-2" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                                </svg>
                                Jadwalkan Pemeliharaan Pertama
                              </button>
                            </div>
                          )}
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            {filteredTasks.length > 0 && (
              <div className="bg-gray-50 px-6 py-3 flex items-center justify-between border-t border-gray-200">
                <div className="text-sm text-gray-700">
                  Menampilkan <span className="font-medium">{filteredTasks.length}</span> {filteredTasks.length === 1 ? 'item' : 'item'}
                  {(search || statusFilter || labFilter) && (
                    <span className="ml-1">(difilter dari total {tasks.length})</span>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
        {showEditModal && (
          <div className="fixed inset-0 overflow-y-auto z-50" aria-labelledby="modal-title" role="dialog" aria-modal="true">
            <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
              <div 
                className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity animate-fadeIn" 
                aria-hidden="true"
                onClick={() => setShowEditModal(false)}
              ></div>

              <div className="inline-block align-bottom bg-white rounded-lg overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full animate-scaleIn">
                <div className="bg-gradient-to-r from-indigo-500 to-purple-600 px-6 py-4 flex justify-between items-center">
                  <h3 className="text-xl font-bold text-white flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                    </svg>
                    Edit Maintenance Task
                  </h3>
                  <button onClick={() => setShowEditModal(false)} className="text-white hover:text-gray-200 transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                <form onSubmit={handleEditSubmit} className="p-6">
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                      <div className="relative">
                        <select 
                          name="status" 
                          value={editForm.status} 
                          onChange={handleEditChange} 
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm transition-all appearance-none"
                        >
                          <option value="SCHEDULED">Scheduled</option>
                          <option value="IN_PROGRESS">In Progress</option>
                          <option value="COMPLETED">Completed</option>
                          <option value="CANCELLED">Cancelled</option>
                        </select>
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                          <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                            <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/>
                          </svg>
                        </div>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Deskripsi</label>
                      <input 
                        name="description" 
                        value={editForm.description} 
                        onChange={handleEditChange} 
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm transition-all"
                        placeholder="Deskripsi tugas pemeliharaan"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Catatan</label>
                      <textarea 
                        name="notes" 
                        value={editForm.notes} 
                        onChange={handleEditChange} 
                        rows="3"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm transition-all"
                        placeholder="Catatan tambahan (opsional)"
                      />
                    </div>
                  </div>
                  <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-gray-200">
                    <button 
                      type="button" 
                      onClick={() => setShowEditModal(false)} 
                      className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 shadow-sm transition-all"
                    >
                      Batal
                    </button>
                    <button 
                      type="submit" 
                      className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 shadow-sm transition-all btn-pulse"
                      disabled={loadingAction}
                    >
                      {loadingAction ? (
                        <span className="flex items-center">
                          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Processing...
                        </span>
                      ) : (
                        'Simpan'
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
        {showCreateModal && (
          <div className="fixed inset-0 overflow-y-auto z-50" aria-labelledby="modal-title" role="dialog" aria-modal="true">
            <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
              <div 
                className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity animate-fadeIn" 
                aria-hidden="true"
                onClick={() => setShowCreateModal(false)}
              ></div>

              <div className="inline-block align-bottom bg-white rounded-lg overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full animate-scaleIn">
                <div className="bg-gradient-to-r from-indigo-500 to-purple-600 px-6 py-4 flex justify-between items-center">
                  <h3 className="text-xl font-bold text-white flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    Jadwalkan Pemeliharaan
                  </h3>
                  <button onClick={() => setShowCreateModal(false)} className="text-white hover:text-gray-200 transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                <form onSubmit={handleCreateSubmit} className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Alat</label>
                      <div className="relative">
                        <select
                          name="equipmentId"
                          value={createForm.equipmentId}
                          onChange={handleCreateChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm transition-all appearance-none"
                          required
                        >
                          <option value="">Pilih Alat</option>
                          {equipment.map(eq => (
                            <option key={eq.id} value={eq.id}>
                              {eq.name} {eq.lab?.name ? `(${eq.lab.name})` : ''}
                            </option>
                          ))}
                        </select>
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                          <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                            <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/>
                          </svg>
                        </div>
                      </div>
                      {equipment.length === 0 && (
                        <p className="mt-1 text-xs text-yellow-600">
                          Tidak ada alat tersedia. Hubungi admin untuk menambahkan alat.
                        </p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Tanggal Pemeliharaan</label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                        </div>
                        <input
                          type="date"
                          name="scheduledDate"
                          value={createForm.scheduledDate}
                          onChange={handleCreateChange}
                          className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm transition-all"
                          required
                          min={new Date().toISOString().split('T')[0]}
                        />
                      </div>
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Deskripsi</label>
                      <input
                        type="text"
                        name="description"
                        value={createForm.description}
                        onChange={handleCreateChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm transition-all"
                        placeholder="Contoh: Pemeliharaan rutin printer lab komputer"
                        required
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Catatan (opsional)</label>
                      <textarea
                        name="notes"
                        value={createForm.notes}
                        onChange={handleCreateChange}
                        rows="3"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm transition-all"
                        placeholder="Masukkan catatan atau instruksi tambahan"
                      ></textarea>
                    </div>
                  </div>
                  <div className="flex justify-end space-x-3 border-t border-gray-200 pt-5">
                    <button 
                      type="button" 
                      onClick={() => setShowCreateModal(false)} 
                      className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 shadow-sm transition-all"
                    >
                      Cancel
                    </button>
                    <button 
                      type="submit" 
                      className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 shadow-sm transition-all btn-pulse" 
                      disabled={loadingAction}
                    >
                      {loadingAction ? (
                        <span className="flex items-center">
                          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Processing...
                        </span>
                      ) : (
                        'Simpan'
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default MaintenanceTasks; 