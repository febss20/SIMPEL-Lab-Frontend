import React from 'react';

const LoanRescheduleModal = ({
  isOpen,
  form,
  onChange,
  onClose,
  onSubmit,
  loading,
  error,
  oldStartDate,
  oldEndDate
}) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md animate-fadeIn max-h-[80vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Jadwal Ulang Peminjaman</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <form onSubmit={onSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Tanggal Mulai Lama</label>
              <input
                type="text"
                value={oldStartDate}
                className="w-full px-3 py-2 border border-gray-200 rounded-md bg-gray-100 text-gray-700"
                disabled
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Tanggal Selesai Lama</label>
              <input
                type="text"
                value={oldEndDate}
                className="w-full px-3 py-2 border border-gray-200 rounded-md bg-gray-100 text-gray-700"
                disabled
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Tanggal Mulai Baru</label>
              <input
                type="date"
                name="newStartDate"
                value={form.newStartDate}
                onChange={onChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Tanggal Selesai Baru</label>
              <input
                type="date"
                name="newEndDate"
                value={form.newEndDate}
                onChange={onChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Alasan Penjadwalan Ulang</label>
            <textarea
              name="reason"
              value={form.reason}
              onChange={onChange}
              rows="2"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Alasan penjadwalan ulang"
              required
            />
          </div>
          {error && <div className="bg-red-100 border border-red-400 text-red-700 px-3 py-2 rounded text-sm">{error}</div>}
          <div className="flex justify-end gap-2 mt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
              disabled={loading}
            >
              {loading ? 'Memproses...' : 'Ajukan'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoanRescheduleModal;