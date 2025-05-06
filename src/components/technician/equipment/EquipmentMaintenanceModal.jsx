import React from 'react';

const EquipmentMaintenanceModal = ({
  isOpen,
  form,
  onChange,
  onClose,
  onSubmit,
  loading,
  error
}) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md animate-fadeIn">
        <h2 className="text-lg font-semibold mb-4">Jadwalkan Maintenance</h2>
        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Tanggal Maintenance</label>
            <input
              type="date"
              className="mt-1 block w-full border border-gray-300 rounded px-3 py-2"
              value={form.scheduledDate}
              onChange={e => onChange({ ...form, scheduledDate: e.target.value })}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Deskripsi</label>
            <textarea
              className="mt-1 block w-full border border-gray-300 rounded px-3 py-2"
              value={form.description}
              onChange={e => onChange({ ...form, description: e.target.value })}
              required
            />
          </div>
          <div>
            <label className="inline-flex items-center">
              <input
                type="checkbox"
                className="form-checkbox"
                checked={form.isPeriodic}
                onChange={e => onChange({ ...form, isPeriodic: e.target.checked })}
              />
              <span className="ml-2">Maintenance Berkala</span>
            </label>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Catatan (opsional)</label>
            <input
              type="text"
              className="mt-1 block w-full border border-gray-300 rounded px-3 py-2"
              value={form.notes}
              onChange={e => onChange({ ...form, notes: e.target.value })}
            />
          </div>
          {error && <div className="text-red-600 text-sm">{error}</div>}
          <div className="flex justify-end gap-2">
            <button
              type="button"
              className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400 text-gray-800"
              onClick={onClose}
              disabled={loading}
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded bg-green-600 hover:bg-green-700 text-white"
              disabled={loading}
            >
              {loading ? 'Menyimpan...' : 'Jadwalkan'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EquipmentMaintenanceModal; 