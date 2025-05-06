import { useParams } from 'react-router-dom';
import DashboardLayout from '../../../components/layouts/DashboardLayout';
import EquipmentLoanModal from '../../../components/user/equipment/EquipmentLoanModal';
import EquipmentRepairModal from '../../../components/user/equipment/EquipmentRepairModal';
import useEquipmentDetail from '../../../hooks/user/useEquipmentDetail';

const EquipmentDetail = () => {
  const { id } = useParams();
  const {
    equipment,
    loading,
    error,
    showLoanModal,
    setShowLoanModal,
    showRepairModal,
    setShowRepairModal,
    loanForm,
    repairDesc,
    loadingAction,
    formError,
    handleOpenLoanModal,
    handleLoanFormChange,
    handleLoanSubmit,
    handleOpenRepairModal,
    handleRepairDescChange,
    handleRepairSubmit,
  } = useEquipmentDetail(id);

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
      <div className="max-w-4xl mx-auto px-4 py-8">
        {loading ? (
          <div className="flex justify-center items-center py-20 animate-fadeIn">
            <div className="animate-pulse flex flex-col items-center">
              <div className="h-12 w-12 rounded-full border-4 border-t-indigo-500 border-b-indigo-700 border-r-transparent border-l-transparent animate-spin"></div>
              <p className="mt-4 text-gray-500">Memuat detail peralatan...</p>
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
        ) : equipment ? (
          <div className="animate-fadeIn">
            <div className="bg-white rounded-xl shadow-md border border-gray-100 transition-all duration-300 hover:shadow-lg overflow-hidden">
              {/* Equipment Image Banner */}
              <div className="h-40 w-full bg-gradient-to-r from-indigo-500 via-blue-500 to-purple-500 relative">
                {equipment.image ? (
                  <img 
                    src={equipment.image} 
                    alt={equipment.name} 
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-20 w-20 text-white opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
                    </svg>
                  </div>
                )}
                
                {/* Status Badge */}
                <div className="absolute top-4 right-4">
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium shadow-sm ${getStatusColor(equipment.status)}`}>
                    <span className="mr-1 h-2 w-2 rounded-full bg-white"></span>
                    {equipment.status}
                  </span>
                </div>
              </div>
              
              {/* Content */}
              <div className="p-8">
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
                  <h1 className="text-2xl font-bold text-gray-800 mb-2 md:mb-0">
                    <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-blue-500">
                      {equipment.name}
                    </span>
                  </h1>
                  <div className="flex flex-wrap gap-2">
                    <span className="inline-flex items-center px-3 py-1 rounded-lg bg-indigo-50 text-indigo-700 text-sm font-medium">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                      </svg>
                      {equipment.type || 'Tipe Tidak Diketahui'}
                    </span>
                    <span className="inline-flex items-center px-3 py-1 rounded-lg bg-gray-100 text-gray-700 text-sm font-medium">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      {equipment.location || 'Lokasi belum ditentukan'}
                    </span>
                    <span className="inline-flex items-center px-3 py-1 rounded-lg bg-green-50 text-green-700 text-sm font-medium">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      {equipment.lab?.name || 'Lab tidak diketahui'}
                    </span>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                  <div className="bg-gray-50 rounded-xl p-4">
                    <h3 className="text-sm font-medium text-gray-500 uppercase mb-2">Status</h3>
                    <p className={`text-lg font-semibold ${
                      equipment.status === 'AVAILABLE' ? 'text-green-600' : 
                      equipment.status === 'IN_USE' ? 'text-yellow-600' : 
                      equipment.status === 'MAINTENANCE' ? 'text-blue-600' : 'text-red-600'
                    }`}>
                      {equipment.status}
                    </p>
                  </div>
                  <div className="bg-gray-50 rounded-xl p-4">
                    <h3 className="text-sm font-medium text-gray-500 uppercase mb-2">Ketersediaan</h3>
                    <p className="text-lg font-semibold text-gray-800">{equipment.quantity || 1}</p>
                  </div>
                  <div className="bg-gray-50 rounded-xl p-4">
                    <h3 className="text-sm font-medium text-gray-500 uppercase mb-2">Tersedia untuk pinjam</h3>
                    <p className={`text-lg font-semibold ${equipment.status === 'AVAILABLE' ? 'text-green-600' : 'text-red-600'}`}>
                      {equipment.status === 'AVAILABLE' ? 'Tersedia' : 'Tidak tersedia'}
                    </p>
                  </div>
                </div>
                
                <div className="mb-8">
                  <h2 className="text-lg font-bold text-gray-800 mb-3 flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Deskripsi
                  </h2>
                  <div className="bg-gray-50 p-4 rounded-xl text-gray-700 whitespace-pre-line">
                    {equipment.description || 'No description available for this equipment.'}
                  </div>
                </div>
                
                <div className="border-t border-gray-100 pt-6">
                  <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Aksi
                  </h2>
                  <div className="flex flex-wrap gap-4">
                    <button
                      className={`px-4 py-2 rounded-lg flex items-center font-medium transition-all duration-300 shadow-sm ${
                        equipment.status === 'AVAILABLE'
                          ? 'bg-gradient-to-r from-green-600 to-teal-500 text-white hover:from-green-700 hover:to-teal-600 hover:shadow-md transform hover:-translate-y-0.5'
                          : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                      }`}
                      onClick={equipment.status === 'AVAILABLE' ? handleOpenLoanModal : undefined}
                      disabled={equipment.status !== 'AVAILABLE'}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                      </svg>
                      Ajukan Peminjaman
                    </button>
                    <button
                      className="px-4 py-2 rounded-lg flex items-center font-medium bg-gradient-to-r from-red-600 to-pink-500 text-white hover:from-red-700 hover:to-pink-600 transition-all duration-300 hover:shadow-md transform hover:-translate-y-0.5 shadow-sm"
                      onClick={handleOpenRepairModal}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                      </svg>
                      Lapor Kerusakan
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : null}
      </div>
      
      <EquipmentLoanModal
        isOpen={showLoanModal}
        form={loanForm}
        onChange={handleLoanFormChange}
        onClose={() => setShowLoanModal(false)}
        onSubmit={handleLoanSubmit}
        loading={loadingAction}
        error={formError}
      />
      <EquipmentRepairModal
        isOpen={showRepairModal}
        value={repairDesc}
        onChange={handleRepairDescChange}
        onClose={() => setShowRepairModal(false)}
        onSubmit={handleRepairSubmit}
        loading={loadingAction}
        error={formError}
      />
    </DashboardLayout>
  );
};

export default EquipmentDetail; 