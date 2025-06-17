import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import DashboardLayout from '../../../components/layouts/DashboardLayout';
import { getMaintenanceById } from '../../../api/maintenance';
import '../../../utils/animations.css';

const MaintenanceTaskDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [task, setTask] = useState(null);
  const [equipment, setEquipment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTask = async () => {
      try {
        setLoading(true);
        const data = await getMaintenanceById(id);
        setTask(data);
        if (data && data.equipment) setEquipment(data.equipment);
      } catch (err) {
        setError('Gagal memuat detail maintenance task');
      } finally {
        setLoading(false);
      }
    };
    fetchTask();
  }, [id]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'SCHEDULED':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'IN_PROGRESS':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'COMPLETED':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'CANCELLED':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'SCHEDULED':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
      case 'IN_PROGRESS':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        );
      case 'COMPLETED':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        );
      case 'CANCELLED':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        );
      default:
        return null;
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex justify-center items-center min-h-[60vh]">
          <div className="animate-pulse flex flex-col items-center">
            <div className="h-16 w-16 rounded-full border-4 border-t-indigo-500 border-b-indigo-700 border-r-transparent border-l-transparent animate-spin"></div>
            <p className="mt-4 text-gray-500 font-medium">Memuat data maintenance task...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout>
        <div className="max-w-4xl mx-auto mt-8 px-4 bg-gray-50 min-h-screen">
          <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded shadow-md animate-fadeIn">
            <div className="flex items-center">
              <svg className="h-6 w-6 mr-3 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p>{error}</p>
            </div>
          </div>
          <div className="mt-4 text-center">
            <button onClick={() => navigate(-1)} className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition-colors">
              Kembali
            </button>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (!task) return null;

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto px-4 py-8 animate-fadeIn">
        <div className="bg-white rounded-xl shadow-md overflow-hidden mb-6 transition-all hover:shadow-lg border border-gray-100">
          <div className="bg-gradient-to-r from-indigo-500 to-purple-600 py-6 px-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between">
              <h1 className="text-2xl font-bold text-white flex items-center mb-4 md:mb-0">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                Detail Pemeliharaan #{task.id}
              </h1>
              <div 
                className={`px-4 py-2 rounded-lg flex items-center ${getStatusColor(task.status)} border shadow-sm animate-fadeIn`}
              >
                {getStatusIcon(task.status)}
                <span className="font-semibold">{task.status}</span>
              </div>
            </div>
          </div>
          
          <div className="p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div className="bg-gray-50 rounded-lg p-4 border border-gray-100 shadow-sm hover:shadow transition-all card-hover">
                  <h3 className="text-lg font-semibold text-gray-800 mb-3 border-b pb-2">Informasi Dasar</h3>
                  
                  <div className="grid grid-cols-1 gap-4">
                    <div className="flex items-start stagger-item animate-fadeIn">
                      <div className="flex-shrink-0 h-8 w-8 rounded-md bg-indigo-100 flex items-center justify-center mr-3">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                        </svg>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Peralatan</p>
                        <p className="font-medium text-gray-900">{task.equipment ? task.equipment.name : `ID: ${task.equipmentId}`}</p>
                        {equipment && equipment.type && (
                          <span className="text-sm text-gray-500">{equipment.type}</span>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex items-start stagger-item animate-fadeIn">
                      <div className="flex-shrink-0 h-8 w-8 rounded-md bg-indigo-100 flex items-center justify-center mr-3">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Technician</p>
                        <p className="font-medium text-gray-900">{task.technician ? (task.technician.fullName || task.technician.username) : `ID: ${task.technicianId}`}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start stagger-item animate-fadeIn">
                      <div className="flex-shrink-0 h-8 w-8 rounded-md bg-indigo-100 flex items-center justify-center mr-3">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h7" />
                        </svg>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Deskripsi</p>
                        <p className="font-medium text-gray-900">{task.description}</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="bg-gray-50 rounded-lg p-4 border border-gray-100 shadow-sm hover:shadow transition-all card-hover slide-in-right">
                  <h3 className="text-lg font-semibold text-gray-800 mb-3 border-b pb-2">Pengaturan</h3>
                  
                  <div className="flex items-center justify-between py-3">
                    <div className="flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-indigo-600 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                      </svg>
                      <span className="text-gray-700">Pemeliharaan Berkala</span>
                    </div>
                    <div className={`px-3 py-1 rounded-full text-sm font-medium ${task.isPeriodic ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                      {task.isPeriodic ? 'Ya' : 'Tidak'}
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="space-y-6">
                <div className="bg-gray-50 rounded-lg p-4 border border-gray-100 shadow-sm hover:shadow transition-all card-hover">
                  <h3 className="text-lg font-semibold text-gray-800 mb-3 border-b pb-2">Timeline</h3>
                  
                  <div className="space-y-4">
                    <div className="flex items-start stagger-item animate-fadeIn">
                      <div className="flex-shrink-0 h-8 w-8 rounded-md bg-indigo-100 flex items-center justify-center mr-3">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Tanggal Pemeliharaan</p>
                        <p className="font-medium text-gray-900">{formatDate(task.scheduledDate)}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start stagger-item animate-fadeIn">
                      <div className="flex-shrink-0 h-8 w-8 rounded-md bg-indigo-100 flex items-center justify-center mr-3">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Tanggal Selesai</p>
                        <p className="font-medium text-gray-900">{formatDate(task.completionDate)}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start stagger-item animate-fadeIn">
                      <div className="flex-shrink-0 h-8 w-8 rounded-md bg-indigo-100 flex items-center justify-center mr-3">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Dibuat</p>
                        <p className="font-medium text-gray-900">{formatDate(task.createdAt)}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start stagger-item animate-fadeIn">
                      <div className="flex-shrink-0 h-8 w-8 rounded-md bg-indigo-100 flex items-center justify-center mr-3">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                        </svg>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Diperbarui</p>
                        <p className="font-medium text-gray-900">{formatDate(task.updatedAt)}</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="bg-gray-50 rounded-lg p-4 border border-gray-100 shadow-sm hover:shadow transition-all card-hover slide-in-right">
                  <h3 className="text-lg font-semibold text-gray-800 mb-3 border-b pb-2">Catatan</h3>
                  
                  <div className="bg-white rounded-md p-4 border border-gray-200">
                    <p className="text-gray-700 whitespace-pre-line">{task.notes || 'Tidak ada catatan.'}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
                        
        <div className="flex flex-wrap gap-3 mt-6 justify-end">
          <button 
            onClick={() => navigate(-1)} 
            className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 bg-white hover:bg-gray-50 flex items-center transition-colors shadow-sm btn-transition"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Kembali
          </button>
          
          <Link
            to={`/technician/maintenance`}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 flex items-center transition-colors shadow-sm btn-transition"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            Lihat Semua Pemeliharaan
          </Link>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default MaintenanceTaskDetail;