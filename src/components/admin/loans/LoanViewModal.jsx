import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const LoanViewModal = ({ isOpen, onClose, data, getStatusBadgeClass }) => {
  const [activeTab, setActiveTab] = useState('details');
  
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isOpen]);

  if (!isOpen || !data) return null;
  
  
  const formatDateTime = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  
  const getLoanStatusClass = (status) => {
    if (getStatusBadgeClass) return getStatusBadgeClass(status);
    
    const baseStyle = "px-3 py-1 rounded-full text-sm font-medium";
    
    switch(status?.toLowerCase()) {
      case 'pending':
        return `${baseStyle} bg-yellow-100 text-yellow-800`;
      case 'active':
        return `${baseStyle} bg-blue-100 text-blue-800`;
      case 'returned':
        return `${baseStyle} bg-green-100 text-green-800`;
      case 'overdue':
        return `${baseStyle} bg-red-100 text-red-800`;
      case 'cancelled':
        return `${baseStyle} bg-gray-100 text-gray-800`;
      default:
        return `${baseStyle} bg-gray-100 text-gray-800`;
    }
  };
  
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div 
          className="fixed inset-0 bg-black/60 flex items-start justify-center z-50 backdrop-blur-sm p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <motion.div 
            className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[85vh] overflow-hidden flex flex-col mt-20 md:mt-20"
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          >
            <div className="bg-gradient-to-r from-indigo-600 to-violet-500 p-6 rounded-t-2xl">
              <div className="flex justify-between items-center">
                <motion.h2 
                  className="text-2xl font-bold text-white flex items-center"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 }}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  Detail Peminjaman
                </motion.h2>
                <motion.button 
                  onClick={onClose} 
                  className="text-white hover:text-gray-200 transition-colors duration-200 p-2 rounded-full hover:bg-white/10"
                  whileHover={{ rotate: 90 }}
                  transition={{ duration: 0.2 }}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </motion.button>
              </div>
              
              <div className="mt-4 flex text-white/90 font-medium space-x-4 border-b border-white/20 pb-2">
                <button 
                  className={`pb-2 px-2 transition-all duration-200 ${activeTab === 'details' ? 'border-b-2 border-white text-white' : 'hover:text-white'}`}
                  onClick={() => setActiveTab('details')}
                >
                  Informasi Pinjaman
                </button>
                <button 
                  className={`pb-2 px-2 transition-all duration-200 ${activeTab === 'notes' ? 'border-b-2 border-white text-white' : 'hover:text-white'}`}
                  onClick={() => setActiveTab('notes')}
                >
                  Catatan & Rekam Jejak
                </button>
              </div>
            </div>
            
            <div className="flex-1 overflow-y-auto p-6">
              {activeTab === 'details' && (
                <motion.div 
                  className="space-y-4"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-gray-900">ID Peminjaman</h3>
                    <div className="flex items-center bg-gray-100 rounded-lg px-3 py-1.5">
                      <span className="text-indigo-600 font-mono font-medium">{data.id}</span>
                    </div>
                  </div>
                  
                  <div className="bg-gradient-to-r from-indigo-50 to-violet-50 rounded-xl p-4 border border-indigo-100 shadow-sm">
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Status Peminjaman</h3>
                    <div className="flex items-start space-x-3">
                      <div className="bg-indigo-100 p-2 rounded-lg">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                        </svg>
                      </div>
                      <div className="flex-1">
                        <p className="text-sm text-gray-500">Status Saat Ini</p>
                        <div className="mt-1">
                          <span className={getLoanStatusClass(data.status)}>
                            {data.status || 'Unknown'}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Informasi Peminjam</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="flex items-start">
                        <div className="bg-indigo-100 p-2 rounded-lg mr-3">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                          </svg>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Pengguna</p>
                          <p className="font-medium text-gray-900">{data.user?.fullName || data.user?.username || data.userId || '-'}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-start">
                        <div className="bg-blue-100 p-2 rounded-lg mr-3">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
                          </svg>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Peralatan</p>
                          <p className="font-medium text-gray-900">{data.equipment?.name || data.equipmentId || '-'}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Periode Peminjaman</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="flex items-start">
                        <div className="bg-green-100 p-2 rounded-lg mr-3">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Tanggal Pinjam</p>
                          <p className="font-medium text-gray-900">{formatDateTime(data.startDate)}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-start">
                        <div className="bg-amber-100 p-2 rounded-lg mr-3">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Batas Waktu Kembali</p>
                          <p className="font-medium text-gray-900">{formatDateTime(data.endDate)}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-start col-span-2">
                        <div className={`p-2 rounded-lg mr-3 ${data.returnDate ? 'bg-emerald-100' : 'bg-gray-100'}`}>
                          <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 ${data.returnDate ? 'text-emerald-600' : 'text-gray-400'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Tanggal Pengembalian</p>
                          {data.returnDate ? (
                            <p className="font-medium text-emerald-600">{formatDateTime(data.returnDate)}</p>
                          ) : (
                            <p className="text-gray-400 italic">Belum dikembalikan</p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
              
              {activeTab === 'notes' && (
                <motion.div 
                  className="space-y-4"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="bg-gradient-to-r from-indigo-50 to-violet-50 rounded-xl p-5 border border-indigo-100 shadow-sm">
                    <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                      Catatan
                    </h3>
                    <div className="bg-white p-4 rounded-lg border border-indigo-100 min-h-[100px]">
                      {data.notes ? (
                        <p className="text-gray-700 whitespace-pre-line">{data.notes}</p>
                      ) : (
                        <p className="text-gray-400 italic">Tidak ada catatan</p>
                      )}
                    </div>
                  </div>
                  
                  <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Informasi Sistem</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="flex items-start">
                        <div className="bg-green-100 p-2 rounded-lg mr-3">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Dibuat</p>
                          <p className="font-medium text-gray-900">{data.createdAt ? new Date(data.createdAt).toLocaleString('id-ID') : '-'}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-start">
                        <div className="bg-purple-100 p-2 rounded-lg mr-3">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                          </svg>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Diubah</p>
                          <p className="font-medium text-gray-900">{data.updatedAt ? new Date(data.updatedAt).toLocaleString('id-ID') : '-'}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </div>
            
            <div className="bg-gray-50 px-6 py-4 rounded-b-2xl border-t">
              <div className="flex justify-end">
                <motion.button 
                  type="button" 
                  className="px-5 py-2.5 bg-gradient-to-r from-indigo-600 to-violet-500 hover:from-indigo-700 hover:to-violet-600 text-white rounded-lg shadow-md transition-all duration-200 flex items-center"
                  onClick={onClose}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                  Tutup
                </motion.button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default LoanViewModal; 