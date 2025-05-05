import React from 'react';

const UserFormModal = ({
  isOpen,
  isEdit,
  form,
  error,
  onChange,
  onClose,
  onSubmit,
  loading
}) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50 backdrop-blur-sm">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md max-h-[80vh] overflow-y-auto animate-fadeIn">
        <h2 className="text-xl font-semibold mb-4">{isEdit ? 'Edit Pengguna' : 'Tambah Pengguna'}</h2>
        {error && <div className="bg-red-100 border border-red-400 text-red-700 px-3 py-2 rounded mb-2">{error}</div>}
        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">Username</label>
            <input type="text" name="username" value={form.username} onChange={onChange} className="w-full border rounded-md px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 shadow-sm" required />
          </div>
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">Email</label>
            <input type="email" name="email" value={form.email} onChange={onChange} className="w-full border rounded-md px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 shadow-sm" required />
          </div>
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">Nama Lengkap</label>
            <input type="text" name="fullName" value={form.fullName} onChange={onChange} className="w-full border rounded-md px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 shadow-sm" />
          </div>
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">Role</label>
            <select name="role" value={form.role} onChange={onChange} className="w-full border rounded-md px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 shadow-sm">
              <option value="USER">User</option>
              <option value="ADMIN">Admin</option>
              <option value="TECHNICIAN">Technician</option>
            </select>
          </div>
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">
              Password {isEdit && <span className="text-xs text-gray-500">(Kosongkan jika tidak ingin mengubah)</span>}
            </label>
            <input type="password" name="password" value={form.password} onChange={onChange} className="w-full border rounded-md px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 shadow-sm" autoComplete="new-password" required={!isEdit} />
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
            <button type="button" className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-md transition-colors" onClick={onClose} disabled={loading}>Batal</button>
            <button type="submit" className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md transition-colors" disabled={loading}>{isEdit ? 'Simpan' : 'Tambah'}</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserFormModal; 