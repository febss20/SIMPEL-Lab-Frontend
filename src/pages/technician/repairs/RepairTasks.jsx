import DashboardLayout from '../../../components/layouts/DashboardLayout';
import '../../../utils/animations.css';
import IconButton from '../../../components/common/IconButton';
import { Link } from 'react-router-dom';
import ConfirmModal from '../../../components/common/ConfirmModal';
import RepairEditModal from '../../../components/technician/repairs/RepairEditModal';
import useRepairTasks from '../../../hooks/technician/useRepairTasks';

const RepairTasks = () => {
  const {
    repairs,
    equipment,
    labs,
    loading,
    error,
    search,
    setSearch,
    statusFilter,
    setStatusFilter,
    labFilter,
    setLabFilter,
    successMsg,
    loadingAction,
    showEditModal,
    setShowEditModal,
    editForm,
    handleEditChange,
    handleEditSubmit,
    handleEditClick,
    handleUpdateStatus,
    handleDelete,
    confirmDelete,
    confirmDeleteId,
    setConfirmDeleteId,
    deleteLoading,
    filteredRepairs,
    handleMarkUnrepairable,
  } = useRepairTasks();

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

  return (
    <DashboardLayout>
      <div className="py-6 bg-gray-50 min-h-screen">
        <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl shadow-lg mb-8 p-6 text-white animate-fadeIn">
          <div className="flex items-center">
            <div className="mr-4 bg-white bg-opacity-20 p-3 rounded-full">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <div>
              <h1 className="text-3xl font-bold">Perbaikan</h1>
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
                                  title="Mulai Perbaikan"
                                >
                                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                  </svg>
                                  Mulai
                                </button>
                              )}
                              {repair.status === 'IN_PROGRESS' && (
                                <button
                                  className="flex items-center text-green-600 hover:text-green-900 bg-green-50 hover:bg-green-100 px-2 py-1 rounded transition-colors"
                                  onClick={() => handleUpdateStatus(repair, 'COMPLETED')}
                                  disabled={loadingAction}
                                  title="Selesaikan Perbaikan"
                                >
                                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                  </svg>
                                  Selesaikan
                                </button>
                              )}
                              {['PENDING', 'IN_PROGRESS'].includes(repair.status) && (
                                <button
                                  className="flex items-center text-red-500 hover:text-white bg-red-100 hover:bg-red-600 px-2 py-1 rounded transition-colors ml-2"
                                  onClick={() => handleUpdateStatus(repair, 'CANCELLED')}
                                  disabled={loadingAction}
                                  title="Batalkan Pebaikan"
                                >
                                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                  </svg>
                                  Batalkan
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
        <RepairEditModal
          isOpen={showEditModal}
          form={editForm}
          onChange={handleEditChange}
          onClose={() => setShowEditModal(false)}
          onSubmit={handleEditSubmit}
          loading={loadingAction}
        />
        <ConfirmModal
          isOpen={!!confirmDeleteId}
          title="Konfirmasi Hapus"
          message="Apakah Anda yakin ingin menghapus repair ini?"
          confirmText="Ya, Hapus"
          cancelText="Batal"
          onConfirm={confirmDelete}
          onCancel={() => setConfirmDeleteId(null)}
          loading={deleteLoading}
        />
      </div>
    </DashboardLayout>
  );
};

export default RepairTasks;