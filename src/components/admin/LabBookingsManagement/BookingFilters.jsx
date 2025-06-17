import React from 'react';

const BookingFilters = ({ 
  statusFilter, 
  setStatusFilter, 
  search, 
  setSearch, 
  exportToCSV 
}) => {
  return (
    <div className="flex flex-col sm:flex-row gap-2 sm:gap-2 items-stretch sm:items-center w-full sm:w-auto">
      <div className="flex flex-col sm:flex-row gap-2 sm:gap-2 w-full sm:w-auto">
        <select
          value={statusFilter}
          onChange={e => setStatusFilter(e.target.value)}
          className="border rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 shadow-sm w-full sm:w-auto"
        >
          <option value="ALL">Semua Status</option>
          <option value="PENDING">Menunggu</option>
          <option value="APPROVED">Disetujui</option>
          <option value="REJECTED">Ditolak</option>
          <option value="CANCELLED">Dibatalkan</option>
          <option value="COMPLETED">Selesai</option>
        </select>
        
        <input
          type="text"
          placeholder="Cari booking..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="border rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 shadow-sm w-full sm:w-auto"
        />
      </div>
      
      <button
        className="bg-green-600 hover:bg-green-700 text-white px-3 sm:px-4 py-2 rounded-md shadow-sm flex items-center justify-center gap-1 transition-colors text-sm w-full sm:w-auto"
        onClick={exportToCSV}
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 sm:h-5 sm:w-5" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
        </svg>
        <span className="hidden sm:inline">CSV</span>
      </button>
    </div>
  );
};

export default BookingFilters;