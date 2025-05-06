import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import DashboardLayout from '../../../components/layouts/DashboardLayout';
import { getRepairById } from '../../../api/repairs';
import api from '../../../api/axios';
import '../../../utils/animations.css';

const RepairDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [repair, setRepair] = useState(null);
  const [equipment, setEquipment] = useState(null);
  const [, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRepair = async () => {
      try {
        setLoading(true);
        const data = await getRepairById(id);
        setRepair(data);
        
        if (data && data.equipmentId) {
          try {
            const equipRes = await api.get(`/admin/equipment/${data.equipmentId}`);
            setEquipment(equipRes.data);
          } catch (err) {
            console.error("Failed to fetch equipment details", err);
          }
        }
        
        if (data && data.userId) {
          try {
            const userRes = await api.get(`/admin/users/${data.userId}`);
            setUser(userRes.data);
          } catch (err) {
            console.error("Failed to fetch user details", err);
          }
        }
      } catch (err) {
        setError('Gagal memuat detail repair');
      } finally {
        setLoading(false);
      }
    };
    fetchRepair();
  }, [id]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'IN_PROGRESS':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'COMPLETED':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'CANCELLED':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'UNREPAIRABLE':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'PENDING':
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
      case 'UNREPAIRABLE':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
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

  const getAdminConfirmationStatus = () => {
    if (repair.adminConfirmed === true) {
      return (
        <div className="flex items-center text-green-600">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
          <span>Confirmed</span>
        </div>
      );
    } else if (repair.adminConfirmed === false) {
      return (
        <div className="flex items-center text-red-600">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
          </svg>
          <span>Rejected</span>
        </div>
      );
    } else {
      return (
        <div className="flex items-center text-yellow-600">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          <span>Pending</span>
        </div>
      );
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex justify-center items-center min-h-[60vh]">
          <div className="animate-pulse flex flex-col items-center">
            <div className="h-16 w-16 rounded-full border-4 border-t-orange-500 border-b-orange-700 border-r-transparent border-l-transparent animate-spin"></div>
            <p className="mt-4 text-gray-500 font-medium">Memuat data repair...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout>
        <div className="max-w-4xl mx-auto mt-8 px-4">
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

  if (!repair) return null;

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto px-4 py-8 animate-fadeIn">
        <div className="bg-white rounded-xl shadow-md overflow-hidden mb-6 transition-all hover:shadow-lg border border-gray-100">
          <div className="bg-gradient-to-r from-orange-500 to-amber-600 py-6 px-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between">
              <h1 className="text-2xl font-bold text-white flex items-center mb-4 md:mb-0">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                Detail Perbaikan #{repair.id}
              </h1>
              <div 
                className={`px-4 py-2 rounded-lg flex items-center ${getStatusColor(repair.status)} border shadow-sm animate-fadeIn status-badge`}
              >
                {getStatusIcon(repair.status)}
                <span className="font-semibold">{repair.status}</span>
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
                      <div className="flex-shrink-0 h-8 w-8 rounded-md bg-orange-100 flex items-center justify-center mr-3">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-orange-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                        </svg>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Peralatan</p>
                        <p className="font-medium text-gray-900">{repair.equipment ? repair.equipment.name : `ID: ${repair.equipmentId}`}</p>
                        {equipment && equipment.type && (
                          <span className="text-xs text-gray-500">{equipment.type}</span>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex items-start stagger-item animate-fadeIn">
                      <div className="flex-shrink-0 h-8 w-8 rounded-md bg-orange-100 flex items-center justify-center mr-3">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-orange-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Dilaporkan Oleh</p>
                        <p className="font-medium text-gray-900">
                          {repair.user ? (repair.user.fullName || repair.user.username) : `User ID: ${repair.userId}`}
                        </p>
                        {repair.user && repair.user.role && (
                          <span className="text-xs text-gray-500">{repair.user.role}</span>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex items-start stagger-item animate-fadeIn">
                      <div className="flex-shrink-0 h-8 w-8 rounded-md bg-orange-100 flex items-center justify-center mr-3">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-orange-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h7" />
                        </svg>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Deskripsi</p>
                        <p className="font-medium text-gray-900">{repair.description}</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="bg-gray-50 rounded-lg p-4 border border-gray-100 shadow-sm hover:shadow transition-all card-hover slide-in-right">
                  <h3 className="text-lg font-semibold text-gray-800 mb-3 border-b pb-2">Konfirmasi Admin</h3>
                  
                  <div className="flex items-center py-3">
                    <div className="flex-shrink-0 h-8 w-8 rounded-md bg-orange-100 flex items-center justify-center mr-3">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-orange-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Status Konfirmasi Admin</p>
                      {getAdminConfirmationStatus()}
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="space-y-6">
                <div className="bg-gray-50 rounded-lg p-4 border border-gray-100 shadow-sm hover:shadow transition-all card-hover">
                  <h3 className="text-lg font-semibold text-gray-800 mb-3 border-b pb-2">Timeline</h3>
                  
                  <div className="space-y-4">
                    <div className="flex items-start stagger-item animate-fadeIn">
                      <div className="flex-shrink-0 h-8 w-8 rounded-md bg-orange-100 flex items-center justify-center mr-3">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-orange-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Tanggal Dilaporkan</p>
                        <p className="font-medium text-gray-900">{formatDate(repair.reportedDate)}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start stagger-item animate-fadeIn">
                      <div className="flex-shrink-0 h-8 w-8 rounded-md bg-orange-100 flex items-center justify-center mr-3">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-orange-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Tanggal Selesai</p>
                        <p className="font-medium text-gray-900">{formatDate(repair.completionDate)}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start stagger-item animate-fadeIn">
                      <div className="flex-shrink-0 h-8 w-8 rounded-md bg-orange-100 flex items-center justify-center mr-3">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-orange-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Dibuat</p>
                        <p className="font-medium text-gray-900">{formatDate(repair.createdAt)}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start stagger-item animate-fadeIn">
                      <div className="flex-shrink-0 h-8 w-8 rounded-md bg-orange-100 flex items-center justify-center mr-3">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-orange-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                        </svg>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Diperbarui</p>
                        <p className="font-medium text-gray-900">{formatDate(repair.updatedAt)}</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="bg-gray-50 rounded-lg p-4 border border-gray-100 shadow-sm hover:shadow transition-all card-hover slide-in-right">
                  <h3 className="text-lg font-semibold text-gray-800 mb-3 border-b pb-2">Catatan</h3>
                  
                  <div className="bg-white rounded-md p-4 border border-gray-200">
                    <p className="text-gray-700 whitespace-pre-line">{repair.notes || 'Tidak ada catatan.'}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
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
            to={`/technician/repairs`}
            className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 flex items-center transition-colors shadow-sm btn-transition"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            Lihat Semua Perbaikan
          </Link>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default RepairDetail; 