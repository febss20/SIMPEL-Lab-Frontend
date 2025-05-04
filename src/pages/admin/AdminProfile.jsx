import { useEffect, useState } from 'react';
import DashboardLayout from '../../components/layouts/DashboardLayout';
import api from '../../api/axios';
import Modal from '../../components/common/Modal';
import PageHeader from '../../components/common/PageHeader';

const AdminProfile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [editForm, setEditForm] = useState({ firstName: '', lastName: '', email: '' });
  const [editLoading, setEditLoading] = useState(false);
  const [editError, setEditError] = useState(null);
  const [editSuccess, setEditSuccess] = useState(null);
  const [pwForm, setPwForm] = useState({ oldPassword: '', newPassword: '', confirmPassword: '' });
  const [pwLoading, setPwLoading] = useState(false);
  const [pwError, setPwError] = useState(null);
  const [pwSuccess, setPwSuccess] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      setError(null);
      try {
        const token = localStorage.getItem('token');
        const res = await api.get('/auth/me', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setProfile(res.data);
      } catch (err) {
        setError('Gagal memuat data akun admin');
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  useEffect(() => {
    if (profile) {
      setEditForm({
        firstName: profile.firstName || '',
        lastName: profile.lastName || '',
        email: profile.email || '',
      });
    }
  }, [profile]);

  const handleEditProfile = async (e) => {
    e.preventDefault();
    setEditLoading(true);
    setEditError(null);
    setEditSuccess(null);
    try {
      const token = localStorage.getItem('token');
      await api.put(`/users/${profile.id}`, editForm, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setEditSuccess('Profil berhasil diperbarui');
      setShowEditModal(false);
      const res = await api.get('/auth/me', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setProfile(res.data);
    } catch (err) {
      setEditError('Gagal memperbarui profil');
    } finally {
      setEditLoading(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setPwLoading(true);
    setPwError(null);
    setPwSuccess(null);
    if (pwForm.newPassword !== pwForm.confirmPassword) {
      setPwError('Konfirmasi password tidak cocok');
      setPwLoading(false);
      return;
    }
    try {
      const token = localStorage.getItem('token');
      await api.put(`/users/${profile.id}`, {
        password: pwForm.newPassword,
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setPwSuccess('Password berhasil diganti');
      setShowPasswordModal(false);
      setPwForm({ oldPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err) {
      setPwError('Gagal mengganti password');
    } finally {
      setPwLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-2xl mx-auto px-4 py-8 animate-fadeIn">
        <div className="relative mb-8">
          <div className="h-32 w-full rounded-t-xl bg-gradient-to-r from-indigo-500 via-blue-500 to-purple-500 shadow-lg"></div>
          <div className="absolute left-1/2 -bottom-12 transform -translate-x-1/2">
            <div className="w-28 h-28 rounded-full bg-white shadow-lg flex items-center justify-center border-4 border-white">
              <div className="w-24 h-24 rounded-full bg-indigo-100 flex items-center justify-center text-5xl font-bold text-indigo-700">
                {profile?.firstName?.[0]}{profile?.lastName?.[0]}
              </div>
            </div>
          </div>
        </div>
        <div className="pt-16">
          <div className="mb-8 flex justify-center">
            <PageHeader 
              title="Profil Akun Admin"
              icon={
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.121 17.804A13.937 13.937 0 0112 15c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              }
            />
          </div>
          {loading ? (
            <div className="bg-white rounded-lg shadow p-8 flex items-center justify-center">
              <span className="text-gray-500">Memuat data...</span>
            </div>
          ) : error ? (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">{error}</div>
          ) : profile ? (
            <div className="bg-white rounded-xl shadow-md p-8 card-shadow flex flex-col items-center gap-4">
              <div className="flex flex-col items-center gap-1">
                <h2 className="text-2xl font-semibold text-gray-800 flex items-center gap-2">
                  {profile.firstName} {profile.lastName}
                  <span className="inline-flex items-center px-2 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-medium ml-2 gap-1">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.121 17.804A13.937 13.937 0 0112 15c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                    {profile.role}
                  </span>
                </h2>
                <div className="text-sm text-gray-500 flex items-center gap-1">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 01-8 0m8 0a4 4 0 00-8 0m8 0V5a2 2 0 00-2-2H8a2 2 0 00-2 2v2m8 0v2a2 2 0 01-2 2H8a2 2 0 01-2-2V7" /></svg>
                  {profile.username}
                </div>
              </div>
              <div className="w-full flex flex-col gap-3 mt-4">
                <div className="flex items-center gap-3 text-gray-700">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 01-8 0m8 0a4 4 0 00-8 0m8 0V5a2 2 0 00-2-2H8a2 2 0 00-2 2v7m8 0v2a2 2 0 01-2 2H8a2 2 0 01-2-2v-2" /></svg>
                  <span className="font-medium w-24">Email:</span>
                  <span className="truncate">{profile.email}</span>
                </div>
                <div className="flex items-center gap-3 text-gray-700">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                  <span className="font-medium w-24">User ID:</span>
                  <span className="truncate">{profile.id}</span>
                </div>
                <div className="flex items-center gap-3 text-gray-700">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10m-7 4h4" /></svg>
                  <span className="font-medium w-24">Dibuat:</span>
                  <span>{profile.createdAt ? new Date(profile.createdAt).toLocaleDateString('id-ID') : '-'}</span>
                </div>
              </div>
              <div className="flex gap-3 mt-6">
                <button
                  className="bg-indigo-50 text-indigo-700 px-4 py-2 rounded-lg font-medium shadow hover:bg-indigo-100 transition"
                  onClick={() => setShowEditModal(true)}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 inline-block mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12h.01M12 12h.01M9 12h.01M21 12c0 4.418-4.03 8-9 8s-9-3.582-9-8a9 9 0 1118 0z" /></svg>
                  Edit Profil
                </button>
                <button
                  className="bg-gray-50 text-gray-700 px-4 py-2 rounded-lg font-medium shadow hover:bg-gray-100 transition"
                  onClick={() => setShowPasswordModal(true)}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 inline-block mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 11c0-1.105.895-2 2-2s2 .895 2 2-.895 2-2 2-2-.895-2-2zm0 0V7m0 4v4m0 0a4 4 0 100-8 4 4 0 000 8z" /></svg>
                  Ganti Password
                </button>
              </div>
            </div>
          ) : null}
        </div>
        <Modal isOpen={showEditModal} onClose={() => setShowEditModal(false)} title="Edit Profil">
          <form onSubmit={handleEditProfile} className="flex flex-col gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Nama Depan</label>
              <input type="text" className="mt-1 w-full border rounded px-3 py-2" value={editForm.firstName} onChange={e => setEditForm(f => ({ ...f, firstName: e.target.value }))} required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Nama Belakang</label>
              <input type="text" className="mt-1 w-full border rounded px-3 py-2" value={editForm.lastName} onChange={e => setEditForm(f => ({ ...f, lastName: e.target.value }))} required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Email</label>
              <input type="email" className="mt-1 w-full border rounded px-3 py-2" value={editForm.email} onChange={e => setEditForm(f => ({ ...f, email: e.target.value }))} required />
            </div>
            {editError && <div className="text-red-500 text-sm">{editError}</div>}
            {editSuccess && <div className="text-green-500 text-sm">{editSuccess}</div>}
            <div className="flex justify-end gap-2 mt-2">
              <button type="button" className="px-4 py-2 rounded bg-gray-100 text-gray-700" onClick={() => setShowEditModal(false)}>Batal</button>
              <button type="submit" className="px-4 py-2 rounded bg-indigo-600 text-white hover:bg-indigo-700 transition" disabled={editLoading}>{editLoading ? 'Menyimpan...' : 'Simpan'}</button>
            </div>
          </form>
        </Modal>
        <Modal isOpen={showPasswordModal} onClose={() => setShowPasswordModal(false)} title="Ganti Password">
          <form onSubmit={handleChangePassword} className="flex flex-col gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Password Lama</label>
              <input type="password" className="mt-1 w-full border rounded px-3 py-2" value={pwForm.oldPassword} onChange={e => setPwForm(f => ({ ...f, oldPassword: e.target.value }))} required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Password Baru</label>
              <input type="password" className="mt-1 w-full border rounded px-3 py-2" value={pwForm.newPassword} onChange={e => setPwForm(f => ({ ...f, newPassword: e.target.value }))} required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Konfirmasi Password Baru</label>
              <input type="password" className="mt-1 w-full border rounded px-3 py-2" value={pwForm.confirmPassword} onChange={e => setPwForm(f => ({ ...f, confirmPassword: e.target.value }))} required />
            </div>
            {pwError && <div className="text-red-500 text-sm">{pwError}</div>}
            {pwSuccess && <div className="text-green-500 text-sm">{pwSuccess}</div>}
            <div className="flex justify-end gap-2 mt-2">
              <button type="button" className="px-4 py-2 rounded bg-gray-100 text-gray-700" onClick={() => setShowPasswordModal(false)}>Batal</button>
              <button type="submit" className="px-4 py-2 rounded bg-indigo-600 text-white hover:bg-indigo-700 transition" disabled={pwLoading}>{pwLoading ? 'Menyimpan...' : 'Simpan'}</button>
            </div>
          </form>
        </Modal>
      </div>
    </DashboardLayout>
  );
};

export default AdminProfile; 