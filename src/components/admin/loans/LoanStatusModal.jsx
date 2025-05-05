import React from 'react';

const LoanStatusModal = ({
  isOpen,
  selectedStatus,
  statusOptions = [],
  onChange,
  onSubmit,
  onClose,
  loading = false,
  error = null,
}) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50 backdrop-blur-sm">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md animate-fadeIn">
        <h2 className="text-xl font-semibold mb-4">Update Status Peminjaman</h2>
        {error && <div className="bg-red-100 border border-red-400 text-red-700 px-3 py-2 rounded mb-2">{error}</div>}
        <form onSubmit={onSubmit} className="flex flex-col gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Status Baru</label>
            <select
              className="border rounded px-3 py-2 w-full"
              value={selectedStatus}
              onChange={onChange}
              required
            >
              {statusOptions.map(opt => (
                <option key={opt} value={opt}>{opt}</option>
              ))}
            </select>
          </div>
          <div className="flex justify-end gap-2 mt-2">
            <button type="button" className="px-4 py-2 rounded bg-gray-100 text-gray-700" onClick={onClose}>Batal</button>
            <button type="submit" className="px-4 py-2 rounded bg-indigo-600 text-white hover:bg-indigo-700 transition" disabled={loading}>{loading ? 'Memproses...' : 'Update'}</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoanStatusModal; 