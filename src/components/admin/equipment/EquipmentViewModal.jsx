import React from 'react';

const EquipmentViewModal = ({ isOpen, onClose, data }) => {
  if (!isOpen || !data) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[85vh] overflow-y-auto animate-fadeIn">
        <div className="bg-gradient-to-r from-blue-600 to-purple-500 p-6 rounded-t-xl">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-white flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              Detail Peralatan
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
              <span className="text-gray-500 w-32">Nama:</span>
              <span className="font-medium text-gray-900">{data.name}</span>
            </div>
            <div className="flex items-center">
              <span className="text-gray-500 w-32">Serial Number:</span>
              <span className="font-medium text-gray-900">{data.serialNumber || '-'}</span>
            </div>
            <div className="flex items-center">
              <span className="text-gray-500 w-32">Tipe:</span>
              <span className="font-medium text-gray-900">{data.type || '-'}</span>
            </div>
            <div className="flex items-center">
              <span className="text-gray-500 w-32">Status:</span>
              <span className="font-medium text-gray-900">{data.status || '-'}</span>
            </div>
            <div className="flex items-center">
              <span className="text-gray-500 w-32">Lokasi:</span>
              <span className="font-medium text-gray-900">{data.location || '-'}</span>
            </div>
            <div className="flex items-center">
              <span className="text-gray-500 w-32">Lab:</span>
              <span className="font-medium text-gray-900">{data.lab?.name || data.labId || '-'}</span>
            </div>
          </div>
          <div className="space-y-3">
            <div className="flex items-center">
              <span className="text-gray-500 w-32">Tanggal Pembelian:</span>
              <span className="font-medium text-gray-900">{data.purchaseDate ? new Date(data.purchaseDate).toLocaleDateString('id-ID') : '-'}</span>
            </div>
            <div className="flex items-center">
              <span className="text-gray-500 w-32">Harga Pembelian:</span>
              <span className="font-medium text-gray-900">{data.purchasePrice ? `Rp${data.purchasePrice.toLocaleString('id-ID')}` : '-'}</span>
            </div>
            <div className="flex items-center">
              <span className="text-gray-500 w-32">Pabrikan:</span>
              <span className="font-medium text-gray-900">{data.manufacturer || '-'}</span>
            </div>
            <div className="flex items-center">
              <span className="text-gray-500 w-32">Model:</span>
              <span className="font-medium text-gray-900">{data.model || '-'}</span>
            </div>
            <div className="flex items-center">
              <span className="text-gray-500 w-32">Dibuat:</span>
              <span className="font-medium text-gray-900">{data.createdAt ? new Date(data.createdAt).toLocaleString('id-ID') : '-'}</span>
            </div>
            <div className="flex items-center">
              <span className="text-gray-500 w-32">Diubah:</span>
              <span className="font-medium text-gray-900">{data.updatedAt ? new Date(data.updatedAt).toLocaleString('id-ID') : '-'}</span>
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

export default EquipmentViewModal; 