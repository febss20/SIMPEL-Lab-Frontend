import { useParams, useNavigate } from 'react-router-dom';
import DashboardLayout from '../../../components/layouts/DashboardLayout';
import useLoanDetail from '../../../hooks/user/useLoanDetail';
import LoanExtendModal from '../../../components/user/loans/LoanExtendModal';
import LoanRescheduleModal from '../../../components/user/loans/LoanRescheduleModal';

const LoanDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const {
    loan,
    loading,
    error,
    returnLoading,
    showExtendModal,
    setShowExtendModal,
    extendDate,
    extendLoading,
    extendError,
    handleReturn,
    handleExtendDateChange,
    handleExtend,
    successMsg,
    errorMsg,
    showRescheduleModal,
    setShowRescheduleModal,
    rescheduleForm,
    rescheduleLoading,
    rescheduleError,
    handleOpenRescheduleModal,
    handleRescheduleFormChange,
    handleReschedule
  } = useLoanDetail(id, navigate);

  const getStatusColor = (status) => {
    switch (status) {
      case 'ACTIVE':
        return 'text-green-600 bg-green-100';
      case 'OVERDUE':
        return 'text-red-600 bg-red-100';
      case 'RETURNED':
        return 'text-blue-600 bg-blue-100';
      case 'PENDING':
        return 'text-yellow-600 bg-yellow-100';
      case 'APPROVED':
        return 'text-indigo-600 bg-indigo-100';
      case 'REJECTED':
        return 'text-gray-600 bg-gray-200';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'ACTIVE':
        return 'Active';
      case 'OVERDUE':
        return 'Overdue';
      case 'RETURNED':
        return 'Returned';
      case 'PENDING':
        return 'Pending';
      case 'APPROVED':
        return 'Approved';
      case 'REJECTED':
        return 'Rejected';
      default:
        return status;
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto px-4 py-8">
        {successMsg && (
          <div className="mb-4 px-4 py-3 rounded-lg bg-green-100 text-green-800 border border-green-300 flex items-center animate-slideDown">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-green-500" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            {successMsg}
          </div>
        )}
        {errorMsg && (
          <div className="mb-4 px-4 py-3 rounded-lg bg-red-100 text-red-800 border border-red-300 flex items-center animate-slideDown">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-red-500" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 10A8 8 0 1110 2a8 8 0 018 8zm-4.293-1.707a1 1 0 00-1.414 1.414L11 11.586V7a1 1 0 10-2 0v4.586l-1.293-1.293a1 1 0 00-1.414 1.414l3 3a1 1 0 001.414 0l3-3z" clipRule="evenodd" />
            </svg>
            {errorMsg}
          </div>
        )}
        {loading ? (
          <div className="flex justify-center items-center py-20 animate-fadeIn">
            <div className="animate-pulse flex flex-col items-center">
              <div className="h-12 w-12 rounded-full border-4 border-t-indigo-500 border-b-indigo-700 border-r-transparent border-l-transparent animate-spin"></div>
              <p className="mt-4 text-gray-500">Memuat detail pinjaman...</p>
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
        ) : loan ? (
          <div className="animate-fadeIn">
            <div className="bg-white rounded-xl shadow-md border border-gray-100 transition-all duration-300 hover:shadow-lg overflow-hidden">
              <div className="h-32 w-full bg-gradient-to-r from-purple-500 via-indigo-500 to-blue-500 relative">
                <div className="absolute inset-0 bg-black bg-opacity-20"></div>
                <div className="h-full flex items-center justify-center">
                  <div className="text-white z-10 text-center">
                    <div className="text-sm uppercase tracking-wider mb-1 opacity-80">Peminjaman ID: #{loan.id}</div>
                    <h1 className="text-2xl md:text-3xl font-bold">{loan.equipment?.name || 'Peralatan Laboratorium'}</h1>
                  </div>
                </div>
                
                <div className="absolute top-4 right-4">
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium shadow-md ${getStatusColor(loan.status)}`}>
                    <span className="mr-1 h-2 w-2 rounded-full bg-white"></span>
                    {getStatusText(loan.status)}
                  </span>
                </div>
              </div>
              
              <div className="p-6 md:p-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                  <div className="bg-gray-50 rounded-xl p-4 transform transition-all duration-300 hover:shadow-md hover:-translate-y-1">
                    <h3 className="text-sm font-medium text-gray-500 uppercase mb-2 flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      Tanggal Pinjam
                    </h3>
                    <p className="text-lg font-semibold text-gray-800">
                      {loan.startDate ? new Date(loan.startDate).toLocaleDateString('id-ID', { 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                      }) : '-'}
                    </p>
                  </div>
                  
                  <div className="bg-gray-50 rounded-xl p-4 transform transition-all duration-300 hover:shadow-md hover:-translate-y-1">
                    <h3 className="text-sm font-medium text-gray-500 uppercase mb-2 flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Jatuh Tempo
                    </h3>
                    <p className={`text-lg font-semibold ${loan.status === 'OVERDUE' ? 'text-red-600' : 'text-gray-800'}`}>
                      {loan.endDate ? new Date(loan.endDate).toLocaleDateString('id-ID', { 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                      }) : '-'}
                    </p>
                  </div>
                  
                  {loan.returnDate ? (
                    <div className="bg-gray-50 rounded-xl p-4 transform transition-all duration-300 hover:shadow-md hover:-translate-y-1">
                      <h3 className="text-sm font-medium text-gray-500 uppercase mb-2 flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        Tanggal Pengembalian
                      </h3>
                      <p className="text-lg font-semibold text-gray-800">
                        {new Date(loan.returnDate).toLocaleDateString('id-ID', { 
                          year: 'numeric', 
                          month: 'long', 
                          day: 'numeric' 
                        })}
                      </p>
                    </div>
                  ) : (
                    <div className="bg-gray-50 rounded-xl p-4 transform transition-all duration-300 hover:shadow-md hover:-translate-y-1">
                      <h3 className="text-sm font-medium text-gray-500 uppercase mb-2 flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                        </svg>
                        Status Pinjaman
                      </h3>
                      <p className={`text-lg font-semibold ${
                        loan.status === 'ACTIVE' ? 'text-green-600' : 
                        loan.status === 'OVERDUE' ? 'text-red-600' : 
                        loan.status === 'PENDING' ? 'text-yellow-600' :
                        loan.status === 'APPROVED' ? 'text-indigo-600' :
                        loan.status === 'RETURNED' ? 'text-blue-600' : 'text-gray-600'
                      }`}>
                        {getStatusText(loan.status)}
                      </p>
                    </div>
                  )}
                </div>
                
                <div className="mb-8">
                  <h2 className="text-lg font-bold text-gray-800 mb-3 flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    Detail Peralatan
                  </h2>
                  {loan.equipment ? (
                    <div className="bg-gray-50 p-4 rounded-xl">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <h3 className="text-sm font-medium text-gray-500 mb-1">Nama Peralatan</h3>
                          <p className="text-gray-800 font-semibold">{loan.equipment.name}</p>
                        </div>
                        <div>
                          <h3 className="text-sm font-medium text-gray-500 mb-1">Kategori</h3>
                          <p className="text-gray-800">{loan.equipment.type || '-'}</p>
                        </div>
                        <div>
                          <h3 className="text-sm font-medium text-gray-500 mb-1">Lokasi</h3>
                          <p className="text-gray-800">{loan.equipment.location || '-'}</p>
                        </div>
                        <div>
                          <h3 className="text-sm font-medium text-gray-500 mb-1">Status Peralatan</h3>
                          <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(loan.equipment.status)}`}>
                            {loan.equipment.status}
                          </span>
                        </div>
                      </div>
                      {loan.equipment.description && (
                        <div className="mt-4 pt-4 border-t border-gray-200">
                          <h3 className="text-sm font-medium text-gray-500 mb-1">Deskripsi</h3>
                          <p className="text-gray-700 whitespace-pre-line">
                            {loan.equipment.description.length > 300 
                              ? loan.equipment.description.slice(0, 300) + '...' 
                              : loan.equipment.description}
                          </p>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="bg-gray-50 p-4 rounded-xl text-gray-500 italic">
                      Detail peralatan tidak tersedia
                    </div>
                  )}
                </div>
                
                {loan.notes && (
                  <div className="mb-8">
                    <h2 className="text-lg font-bold text-gray-800 mb-3 flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                      Catatan Pinjaman
                    </h2>
                    <div className="bg-yellow-50 p-4 rounded-xl text-gray-700 border-l-4 border-yellow-400">
                      {loan.notes}
                    </div>
                  </div>
                )}
                
                {loan.requestedEndDate && (
                  <div className="mb-4 px-4 py-3 rounded-lg bg-yellow-100 text-yellow-800 border border-yellow-300 flex items-center animate-slideDown">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-yellow-500" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    Permintaan perpanjangan: {new Date(loan.requestedEndDate).toLocaleDateString('id-ID')}<br />
                    {loan.status === 'PENDING' && <span className="ml-2">(Menunggu persetujuan admin)</span>}
                  </div>
                )}
                
                <div className="border-t border-gray-100 pt-6">
                  <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Aksi
                  </h2>
                  <div className="flex flex-wrap gap-4">
                    {(loan.status === 'ACTIVE' || loan.status === 'APPROVED') && (
                      <button
                        className="px-4 py-2 rounded-lg flex items-center font-medium bg-gradient-to-r from-purple-600 to-indigo-500 text-white hover:from-purple-700 hover:to-indigo-600 transition-all duration-300 hover:shadow-md transform hover:-translate-y-0.5"
                        onClick={() => setShowExtendModal(true)}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        </svg>
                        Perpanjang
                      </button>
                    )}
                    {(loan.status === 'ACTIVE' || loan.status === 'APPROVED') && (
                      <button
                        className="px-4 py-2 rounded-lg flex items-center font-medium bg-gradient-to-r from-blue-600 to-cyan-500 text-white hover:from-blue-700 hover:to-cyan-600 transition-all duration-300 hover:shadow-md transform hover:-translate-y-0.5"
                        onClick={handleOpenRescheduleModal}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        Jadwal Ulang
                      </button>
                    )}
                    {loan.status === 'ACTIVE' && !loan.requestedEndDate && (
                      <button
                        className="px-4 py-2 rounded-lg flex items-center font-medium bg-gradient-to-r from-green-600 to-teal-500 text-white hover:from-green-700 hover:to-teal-600 transition-all duration-300 hover:shadow-md transform hover:-translate-y-0.5"
                        onClick={handleReturn}
                        disabled={returnLoading}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        {returnLoading ? (
                          <span className="flex items-center">
                            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Memproses...
                          </span>
                        ) : (
                          'Kembalikan'
                        )}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : null}
        
        <LoanExtendModal
          isOpen={showExtendModal}
          form={{ newEndDate: extendDate, notes: '' }}
          onChange={handleExtendDateChange}
          onClose={() => setShowExtendModal(false)}
          onSubmit={handleExtend}
          loading={extendLoading}
          error={extendError}
          oldEndDate={loan ? new Date(loan.endDate).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' }) : ''}
        />
        
        <LoanRescheduleModal
          isOpen={showRescheduleModal}
          form={rescheduleForm}
          onChange={handleRescheduleFormChange}
          onClose={() => setShowRescheduleModal(false)}
          onSubmit={handleReschedule}
          loading={rescheduleLoading}
          error={rescheduleError}
          oldStartDate={loan ? new Date(loan.startDate).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' }) : ''}
          oldEndDate={loan ? new Date(loan.endDate).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' }) : ''}
        />
      </div>
    </DashboardLayout>
  );
};

export default LoanDetail;