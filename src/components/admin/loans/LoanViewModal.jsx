import React from 'react';

const LoanViewModal = ({ isOpen, onClose, data, getStatusBadgeClass }) => {
  if (!isOpen || !data) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 backdrop-blur-sm transition-opacity duration-300">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[85vh] overflow-y-auto animate-fadeIn">
        <div className="bg-gradient-to-r from-blue-600 to-purple-500 p-6 rounded-t-xl">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-white flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              Detail Peminjaman
            </h2>
            <button onClick={onClose} className="text-white hover:text-gray-200 transition-colors duration-200">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-3">
            <div className="flex items-center">
              <span className="text-gray-500 w-32">ID:</span>
              <span className="font-medium text-gray-900">{data.id}</span>
            </div>
            <div className="flex items-center">
              <span className="text-gray-500 w-32">User:</span>
              <span className="font-medium text-gray-900">{data.user?.fullName || data.user?.username || data.userId || '-'}</span>
            </div>
            <div className="flex items-center">
              <span className="text-gray-500 w-32">Equipment:</span>
              <span className="font-medium text-gray-900">{data.equipment?.name || data.equipmentId || '-'}</span>
            </div>
            <div className="flex items-center">
              <span className="text-gray-500 w-32">Status:</span>
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusBadgeClass ? getStatusBadgeClass(data.status) : ''}`}>
                {data.status}
              </span>
            </div>
          </div>
          <div className="space-y-3">
            <div className="flex items-center">
              <span className="text-gray-500 w-32">Tgl Pinjam:</span>
              <span className="font-medium text-gray-900">{data.startDate ? new Date(data.startDate).toLocaleString('id-ID') : '-'}</span>
            </div>
            <div className="flex items-center">
              <span className="text-gray-500 w-32">Tgl Kembali:</span>
              <span className="font-medium text-gray-900">{data.endDate ? new Date(data.endDate).toLocaleString('id-ID') : '-'}</span>
            </div>
            <div className="flex items-center">
              <span className="text-gray-500 w-32">Tgl Pengembalian:</span>
              <span className="font-medium text-gray-900">{data.returnDate ? <span className="text-green-600">{new Date(data.returnDate).toLocaleString('id-ID')}</span> : <span className="text-gray-400 italic">Belum dikembalikan</span>}</span>
            </div>
          </div>
          <div className="col-span-2">
            <div className="bg-green-50 p-3 rounded border border-green-100 h-24 overflow-y-auto">
              <span className="text-gray-500 block mb-1">Catatan:</span>
              {data.notes || <span className="text-gray-400 italic">Tidak ada catatan</span>}
            </div>
          </div>
          <div className="col-span-2">
            <div className="flex gap-6">
              <div>
                <span className="text-gray-500 block mb-1">Dibuat:</span>
                <span className="font-medium text-gray-900">{data.createdAt ? new Date(data.createdAt).toLocaleString('id-ID') : '-'}</span>
              </div>
              <div>
                <span className="text-gray-500 block mb-1">Diubah:</span>
                <span className="font-medium text-gray-900">{data.updatedAt ? new Date(data.updatedAt).toLocaleString('id-ID') : '-'}</span>
              </div>
            </div>
          </div>
        </div>
        <div className="bg-gray-50 px-6 py-4 rounded-b-xl border-t">
          <div className="flex justify-end">
            <button type="button" className="px-5 py-2.5 bg-gradient-to-r from-blue-600 to-purple-500 hover:from-blue-700 hover:to-purple-600 text-white rounded-md shadow-md transition-all duration-200 flex items-center" onClick={onClose}>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
              Tutup
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoanViewModal; 