import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../../../components/layouts/DashboardLayout';
import EquipmentLoanModal from '../../../components/user/equipment/EquipmentLoanModal';
import EquipmentRepairModal from '../../../components/user/equipment/EquipmentRepairModal';
import useEquipmentBrowse from '../../../hooks/user/useEquipmentBrowse';

const EquipmentBrowse = () => {
  const navigate = useNavigate();
  const {
    equipment,
    loading,
    error,
    search,
    setSearch,
    statusFilter,
    setStatusFilter,
    showLoanModal,
    setShowLoanModal,
    showRepairModal,
    setShowRepairModal,
    loanForm,
    repairDesc,
    loadingAction,
    formError,
    filteredEquipment,
    handleOpenLoanModal,
    handleLoanFormChange,
    handleLoanSubmit,
    handleOpenRepairModal,
    handleRepairDescChange,
    handleRepairSubmit,
  } = useEquipmentBrowse();

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

  return (
    <DashboardLayout>
      <div className="px-4 py-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 animate-fadeIn">
          <h1 className="text-2xl font-bold text-gray-800 mb-4 md:mb-0 flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 mr-2 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2" />
            </svg>
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-blue-500">
              Jelajahi Peralatan
            </span>
          </h1>
          <div className="bg-indigo-50 text-indigo-700 rounded-lg px-4 py-2 text-sm flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>Total {equipment.length} peralatan tersedia</span>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-md p-6 mb-8 animate-fadeIn border border-gray-100 transition-all duration-300 hover:shadow-lg">
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
              <div className="h-12 w-12 rounded-full border-4 border-t-indigo-500 border-b-indigo-700 border-r-transparent border-l-transparent animate-spin"></div>
              <p className="mt-4 text-gray-500">Memuat data peralatan...</p>
            </div>
          </div>
        ) : error ? (
          <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-md shadow-sm animate-fadeIn">
            <p className="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <span>{error}</span>
            </p>
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100 transition-all duration-300 hover:shadow-lg animate-fadeIn">
            <div className="overflow-x-auto modern-scrollbar">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Nama</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Kategori</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Lokasi</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Lab</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Ketersediaan</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Aksi</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredEquipment.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="text-center py-12 text-gray-500">
                        <div className="flex flex-col items-center">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-300 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                          </svg>
                          <p>Tidak ada peralatan yang sesuai dengan kriteria Anda</p>
                        </div>
                      </td>
                    </tr>
                  ) : filteredEquipment.map((eq, index) => (
                    <tr key={eq.id} className="hover:bg-gray-50 transition-colors" style={{animationDelay: `${index * 0.05}s`}}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="font-medium text-gray-900">{eq.name}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <span className="h-2 w-2 rounded-full bg-indigo-200 mr-2"></span>
                          <span className="text-gray-700">{eq.type}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(eq.status)}`}>{eq.status}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-gray-700">{eq.location || '-'}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-gray-700">{eq.lab?.name || '-'}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className={`text-sm ${eq.status === 'AVAILABLE' ? 'text-green-600' : 'text-gray-400'}`}>
                          {eq.status === 'AVAILABLE' ? (eq.quantity || 1) : 0}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap flex gap-3">
                        <button
                          className="inline-flex items-center text-indigo-600 hover:text-indigo-800 text-sm font-medium transition-colors"
                          onClick={() => navigate(`/user/equipment/${eq.id}`)}
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                          Detail
                        </button>
                        {eq.status === 'AVAILABLE' ? (
                          <button
                            className="inline-flex items-center text-green-600 hover:text-green-800 text-sm font-medium transition-colors"
                            onClick={() => handleOpenLoanModal(eq.id)}
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                            </svg>
                            Pinjam
                          </button>
                        ) : (
                          <span className="inline-flex items-center text-gray-400 text-sm font-medium cursor-not-allowed" title="Tidak tersedia untuk pinjam">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            Pinjam
                          </span>
                        )}
                        <button
                          className="inline-flex items-center text-red-600 hover:text-red-800 text-sm font-medium transition-colors"
                          onClick={() => handleOpenRepairModal(eq.id)}
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                          </svg>
                          Lapor
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
      <EquipmentLoanModal
        isOpen={!!showLoanModal}
        form={loanForm}
        onChange={handleLoanFormChange}
        onClose={() => setShowLoanModal(null)}
        onSubmit={handleLoanSubmit}
        loading={loadingAction}
        error={formError}
      />
      <EquipmentRepairModal
        isOpen={!!showRepairModal}
        value={repairDesc}
        onChange={handleRepairDescChange}
        onClose={() => setShowRepairModal(null)}
        onSubmit={handleRepairSubmit}
        loading={loadingAction}
        error={formError}
      />
    </DashboardLayout>
  );
};

export default EquipmentBrowse; 