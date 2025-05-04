import { useEffect, useState } from 'react';
import DashboardLayout from '../../components/layouts/DashboardLayout';
import { getAllEquipment, getAllLabs } from '../../api/admin';
import { createMaintenance } from '../../api/maintenance';
import '../../utils/animations.css';  
import { Link } from 'react-router-dom';

const EquipmentOverview = () => {
  const [equipment, setEquipment] = useState([]);
  const [labs, setLabs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [labFilter, setLabFilter] = useState('');
  const [showMaintenanceModal, setShowMaintenanceModal] = useState(null);
  const [maintenanceForm, setMaintenanceForm] = useState({
    scheduledDate: '',
    description: '',
    isPeriodic: false,
    notes: ''
  });
  const [formError, setFormError] = useState('');
  const [loadingAction, setLoadingAction] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [stats, setStats] = useState({
    available: 0,
    inUse: 0,
    maintenance: 0,
    underRepair: 0,
    inactive: 0
  });

  const fetchEquipment = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await getAllEquipment();
      setEquipment(res);
      
      const available = res.filter(item => item.status === 'AVAILABLE').length;
      const inUse = res.filter(item => item.status === 'IN_USE').length;
      const maintenance = res.filter(item => item.status === 'UNDER_MAINTENANCE').length;
      const underRepair = res.filter(item => item.status === 'UNDER_REPAIR').length;
      const inactive = res.filter(item => item.status === 'INACTIVE').length;
      
      setStats({
        available,
        inUse,
        maintenance,
        underRepair,
        inactive
      });
    } catch (err) {
      setError('Gagal memuat data peralatan');
    } finally {
      setLoading(false);
    }
  };

  const fetchLabs = async () => {
    try {
      const res = await getAllLabs();
      setLabs(res);
    } catch {}
  };

  useEffect(() => {
    fetchEquipment();
    fetchLabs();
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case 'AVAILABLE':
        return 'text-green-600 bg-green-100';
      case 'IN_USE':
        return 'text-yellow-600 bg-yellow-100';
      case 'MAINTENANCE':
        return 'text-blue-600 bg-blue-100';
      case 'BROKEN':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };
  
  const getStatusIcon = (status) => {
    switch (status) {
      case 'AVAILABLE':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        );
      case 'IN_USE':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
      case 'UNDER_MAINTENANCE':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        );
      case 'UNDER_REPAIR':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        );
      case 'INACTIVE':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        );
      default:
        return null;
    }
  };

  const filteredEquipment = equipment.filter(eq => {
    const matchesSearch = eq.name.toLowerCase().includes(search.toLowerCase()) || (eq.type?.toLowerCase().includes(search.toLowerCase()));
    const matchesStatus = statusFilter ? eq.status === statusFilter : true;
    const matchesLab = labFilter ? (
        String(eq.labId) === String(labFilter) || String(eq.lab?.id) === String(labFilter)
      ) : true;
    return matchesSearch && matchesStatus && matchesLab;
  });

  const handleOpenMaintenanceModal = (equipmentId) => {
    setShowMaintenanceModal(equipmentId);
    setMaintenanceForm({ scheduledDate: '', description: '', isPeriodic: false, notes: '' });
    setFormError('');
  };

  const handleMaintenanceSubmit = async (e) => {
    e.preventDefault();
    setFormError('');
    if (!maintenanceForm.scheduledDate || !maintenanceForm.description) {
      setFormError('Tanggal dan deskripsi wajib diisi.');
      return;
    }
    setLoadingAction(true);
    try {
      await createMaintenance({
        equipmentId: showMaintenanceModal,
        scheduledDate: maintenanceForm.scheduledDate,
        description: maintenanceForm.description,
        isPeriodic: maintenanceForm.isPeriodic,
        notes: maintenanceForm.notes
      });
      setShowMaintenanceModal(null);
      setMaintenanceForm({ scheduledDate: '', description: '', isPeriodic: false, notes: '' });
      setSuccessMsg('Maintenance berhasil dijadwalkan!');
      fetchEquipment();
      setTimeout(() => setSuccessMsg(''), 3000);
    } catch (err) {
      setFormError('Gagal menjadwalkan maintenance: ' + (err.response?.data?.message || err.message));
    } finally {
      setLoadingAction(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="px-6 py-8 bg-gray-50 min-h-screen">
        <div className="bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl shadow-lg mb-8 p-6 text-white animate-fadeIn">
          <div className="flex items-center">
            <div className="mr-4 bg-white bg-opacity-20 p-3 rounded-full">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
              </svg>
            </div>
            <div>
              <h1 className="text-3xl font-bold">Overview Peralatan</h1>
              <p className="opacity-80">Mengelola dan memantau semua peralatan laboratorium</p>
            </div>
            <div className="ml-auto flex gap-2 items-center">
              <div className="bg-white bg-opacity-20 rounded-lg px-4 py-2 text-sm flex items-center shadow-sm">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>Total {equipment.length} peralatan</span>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-5 mb-8 stagger-children">
          <div className="bg-white rounded-xl shadow-md p-5 border border-gray-100 flex items-center card-hover animate-slideInLeft">
            <div className="p-3 rounded-full bg-green-100 text-green-600 mr-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">Available</h3>
              <p className="text-2xl font-bold text-green-600">{stats.available}</p>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-md p-5 border border-gray-100 flex items-center card-hover animate-slideInLeft">
            <div className="p-3 rounded-full bg-yellow-100 text-yellow-600 mr-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">In Use</h3>
              <p className="text-2xl font-bold text-yellow-600">{stats.inUse}</p>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-md p-5 border border-gray-100 flex items-center card-hover animate-slideInLeft">
            <div className="p-3 rounded-full bg-blue-100 text-blue-600 mr-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">Maintenance</h3>
              <p className="text-2xl font-bold text-blue-600">{stats.maintenance}</p>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-md p-5 border border-gray-100 flex items-center card-hover animate-slideInLeft">
            <div className="p-3 rounded-full bg-red-100 text-red-600 mr-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">Inactive</h3>
              <p className="text-2xl font-bold text-red-600">{stats.inactive}</p>
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
              <div className="relative inline-block w-full">
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
              <div className="relative inline-block w-full">
                <select
                  className="appearance-none w-full bg-white border-2 border-gray-200 rounded-lg py-2 px-4 pr-8 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
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
              <p className="mt-4 text-gray-500 font-medium">Memuat data peralatan...</p>
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
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nama</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tipe</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Lokasi</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Aksi</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredEquipment.length > 0 ? (
                    filteredEquipment.map((eq, index) => (
                      <tr key={eq.id} className="hover:bg-gray-50 transition-colors animate-fadeIn" style={{animationDelay: `${index * 0.05}s`}}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10 bg-gray-100 rounded-full flex items-center justify-center text-indigo-600">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
                              </svg>
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">{eq.name}</div>
                              <div className="text-xs text-gray-500">{eq.brand || 'No brand'}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{eq.type}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(eq.status)} flex items-center`}>
                            {getStatusIcon(eq.status)}
                            {eq.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900 flex items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                            {eq.location || '-'}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex space-x-2">
                            <Link to={`/technician/equipment/${eq.id}`} className="text-indigo-600 hover:text-indigo-900 bg-indigo-50 hover:bg-indigo-100 px-2 py-1 rounded transition-colors" title="Lihat Detail">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M10 12.5a2.5 2.5 0 100-5 2.5 2.5 0 000 5z" />
                                <path fillRule="evenodd" d="M.664 10.59a1.651 1.651 0 010-1.186A10.004 10.004 0 0110 3c4.257 0 7.893 2.66 9.336 6.41.147.381.146.804 0 1.186A10.004 10.004 0 0110 17c-4.257 0-7.893-2.66-9.336-6.41zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                              </svg>
                            </Link>
                            <button
                              className={`text-green-600 hover:text-green-900 bg-green-50 hover:bg-green-100 rounded-md p-1.5 transition-colors ${eq.status === 'IN_USE' ? 'opacity-50 cursor-not-allowed' : ''}`}
                              onClick={() => eq.status !== 'IN_USE' && handleOpenMaintenanceModal(eq.id)}
                              disabled={eq.status === 'IN_USE'}
                              title={eq.status === 'IN_USE' ? 'Tidak bisa menjadwalkan maintenance saat alat sedang digunakan' : 'Jadwalkan Maintenance'}
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                              </svg>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="5" className="px-6 py-10 text-center">
                        <div className="flex flex-col items-center animate-fadeIn">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-gray-300 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                          </svg>
                          <p className="text-lg font-medium text-gray-500">Tidak ada peralatan yang ditemukan</p>
                          {search || statusFilter || labFilter ? (
                            <p className="text-sm text-gray-400 mt-1">Coba ubah filter pencarian</p>
                          ) : (
                            <p className="text-sm text-gray-400 mt-1">Tidak ada peralatan terdaftar</p>
                          )}
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            {filteredEquipment.length > 0 && (
              <div className="bg-gray-50 px-6 py-3 flex items-center justify-between border-t border-gray-200">
                <div className="text-sm text-gray-700">
                  Menampilkan <span className="font-medium">{filteredEquipment.length}</span> {filteredEquipment.length === 1 ? 'item' : 'item'}
                  {(search || statusFilter || labFilter) && (
                    <span className="ml-1">(difilter dari total {equipment.length})</span>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Modal Jadwalkan Maintenance */}
      {showMaintenanceModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md animate-fadeIn">
            <h2 className="text-lg font-semibold mb-4">Jadwalkan Maintenance</h2>
            <form onSubmit={handleMaintenanceSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Tanggal Maintenance</label>
                <input
                  type="date"
                  className="mt-1 block w-full border border-gray-300 rounded px-3 py-2"
                  value={maintenanceForm.scheduledDate}
                  onChange={e => setMaintenanceForm(f => ({ ...f, scheduledDate: e.target.value }))}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Deskripsi</label>
                <textarea
                  className="mt-1 block w-full border border-gray-300 rounded px-3 py-2"
                  value={maintenanceForm.description}
                  onChange={e => setMaintenanceForm(f => ({ ...f, description: e.target.value }))}
                  required
                />
              </div>
              <div>
                <label className="inline-flex items-center">
                  <input
                    type="checkbox"
                    className="form-checkbox"
                    checked={maintenanceForm.isPeriodic}
                    onChange={e => setMaintenanceForm(f => ({ ...f, isPeriodic: e.target.checked }))}
                  />
                  <span className="ml-2">Maintenance Berkala</span>
                </label>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Catatan (opsional)</label>
                <input
                  type="text"
                  className="mt-1 block w-full border border-gray-300 rounded px-3 py-2"
                  value={maintenanceForm.notes}
                  onChange={e => setMaintenanceForm(f => ({ ...f, notes: e.target.value }))}
                />
              </div>
              {formError && <div className="text-red-600 text-sm">{formError}</div>}
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400 text-gray-800"
                  onClick={() => setShowMaintenanceModal(null)}
                  disabled={loadingAction}
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded bg-green-600 hover:bg-green-700 text-white"
                  disabled={loadingAction}
                >
                  {loadingAction ? 'Menyimpan...' : 'Jadwalkan'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
};

export default EquipmentOverview; 