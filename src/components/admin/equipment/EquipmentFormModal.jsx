import React from 'react';

const EquipmentFormModal = ({
  isOpen,
  onClose,
  onSubmit,
  form,
  onChange,
  isEdit,
  modalError,
  labs = [],
  loading = false,
}) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50 backdrop-blur-sm">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md max-h-[80vh] overflow-y-auto animate-fadeIn">
        <h2 className="text-xl font-semibold mb-4">{isEdit ? 'Edit Peralatan' : 'Tambah Peralatan'}</h2>
        {modalError && <div className="bg-red-100 border border-red-400 text-red-700 px-3 py-2 rounded mb-2">{modalError}</div>}
        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">Nama</label>
            <input type="text" name="name" value={form.name} onChange={onChange} className="w-full border rounded-md px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500" required />
          </div>
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">Serial Number</label>
            <input type="text" name="serialNumber" value={form.serialNumber} onChange={onChange} className="w-full border rounded-md px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500" />
          </div>
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">Tipe</label>
            <input type="text" name="type" value={form.type} onChange={onChange} className="w-full border rounded-md px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500" />
          </div>
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">Status</label>
            <select name="status" value={form.status} onChange={onChange} className="w-full border rounded-md px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500">
              <option value="AVAILABLE">Available</option>
              <option value="IN_USE">In Use</option>
              <option value="UNDER_MAINTENANCE">Under Maintenance</option>
              <option value="UNDER_REPAIR">Under Repair</option>
              <option value="INACTIVE">Inactive</option>
            </select>
          </div>
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">Lokasi</label>
            <input type="text" name="location" value={form.location} onChange={onChange} className="w-full border rounded-md px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500" />
          </div>
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">Lab</label>
            <select name="labId" value={form.labId} onChange={onChange} className="w-full border rounded-md px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500">
              <option value="">Pilih Lab</option>
              {labs.map(lab => (
                <option key={lab.id} value={lab.id}>{lab.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">Tanggal Pembelian</label>
            <input type="date" name="purchaseDate" value={form.purchaseDate ? form.purchaseDate.split('T')[0] : ''} onChange={onChange} className="w-full border rounded-md px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500" />
          </div>
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">Harga Pembelian</label>
            <input type="number" name="purchasePrice" value={form.purchasePrice} onChange={onChange} className="w-full border rounded-md px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500" min="0" />
          </div>
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">Pabrikan</label>
            <input type="text" name="manufacturer" value={form.manufacturer} onChange={onChange} className="w-full border rounded-md px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500" />
          </div>
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">Model</label>
            <input type="text" name="model" value={form.model} onChange={onChange} className="w-full border rounded-md px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500" />
          </div>
          {isEdit && (
            <>
              <div>
                <label className="block mb-1 text-xs font-medium text-gray-500">Dibuat</label>
                <input type="text" value={form.createdAt ? new Date(form.createdAt).toLocaleString('id-ID') : ''} readOnly className="w-full border bg-gray-100 rounded-md px-3 py-2 text-gray-500" />
              </div>
              <div>
                <label className="block mb-1 text-xs font-medium text-gray-500">Diubah</label>
                <input type="text" value={form.updatedAt ? new Date(form.updatedAt).toLocaleString('id-ID') : ''} readOnly className="w-full border bg-gray-100 rounded-md px-3 py-2 text-gray-500" />
              </div>
            </>
          )}
          <div className="flex justify-end gap-2 mt-4">
            <button type="button" className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-md transition-colors" onClick={onClose}>Batal</button>
            <button type="submit" className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md transition-colors" disabled={loading}>{isEdit ? 'Simpan' : 'Tambah'}</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EquipmentFormModal; 