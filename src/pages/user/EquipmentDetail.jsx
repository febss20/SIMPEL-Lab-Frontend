import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import DashboardLayout from '../../components/layouts/DashboardLayout';
import api from '../../api/axios';
import { createLoan } from '../../api/loans';

const EquipmentDetail = () => {
  const { id } = useParams();
  const [equipment, setEquipment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showLoanModal, setShowLoanModal] = useState(false);
  const [showRepairModal, setShowRepairModal] = useState(false);
  const [loanForm, setLoanForm] = useState({ startDate: '', endDate: '', notes: '' });
  const [repairDesc, setRepairDesc] = useState('');
  const [loadingAction, setLoadingAction] = useState(false);
  const [formError, setFormError] = useState('');

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await api.get(`/equipment/${id}`);
        setEquipment(res.data);
      } catch (err) {
        setError('Gagal memuat detail peralatan');
      } finally {
        setLoading(false);
      }
    };
    fetchDetail();
  }, [id]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'AVAILABLE':
        return 'text-green-600 bg-green-100';
      case 'IN_USE':
        return 'text-yellow-600 bg-yellow-100';
      case 'MAINTENANCE':
        return 'text-blue-600 bg-blue-100';
      case 'BROKEN':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const handleOpenLoanModal = () => {
    setShowLoanModal(true);
    setLoanForm({ startDate: '', endDate: '', notes: '' });
    setFormError('');
  };

  const handleLoanSubmit = async (e) => {
    e.preventDefault();
    setFormError('');
    const today = new Date();
    const start = new Date(loanForm.startDate);
    const end = new Date(loanForm.endDate);
    today.setHours(0,0,0,0);
    if (!loanForm.startDate || !loanForm.endDate) {
      setFormError('Tanggal mulai dan selesai wajib diisi.');
      return;
    }
    if (start < today) {
      setFormError('Tanggal mulai tidak boleh sebelum hari ini.');
      return;
    }
    if (end < start) {
      setFormError('Tanggal selesai harus setelah tanggal mulai.');
      return;
    }
    setLoadingAction(true);
    try {
      await createLoan({
        equipmentId: equipment.id,
        startDate: loanForm.startDate,
        endDate: loanForm.endDate,
        notes: loanForm.notes
      });
      alert('Permintaan peminjaman berhasil diajukan!');
      setShowLoanModal(false);
      setLoanForm({ startDate: '', endDate: '', notes: '' });
      const res = await api.get(`/equipment/${id}`);
      setEquipment(res.data);
    } catch (err) {
      setFormError('Gagal mengajukan peminjaman: ' + (err.response?.data?.message || err.message));
    } finally {
      setLoadingAction(false);
    }
  };

  const handleOpenRepairModal = () => {
    setShowRepairModal(true);
    setRepairDesc('');
    setFormError('');
  };

  const handleRepairSubmit = async (e) => {
    e.preventDefault();
    setFormError('');
    if (!repairDesc.trim()) {
      setFormError('Deskripsi kerusakan wajib diisi.');
      return;
    }
    setLoadingAction(true);
    try {
      await api.post('/repairs', {
        equipmentId: equipment.id,
        description: repairDesc
      });
      alert('Laporan kerusakan berhasil dikirim!');
      setShowRepairModal(false);
      setRepairDesc('');
      const res = await api.get(`/equipment/${id}`);
      setEquipment(res.data);
    } catch (err) {
      setFormError('Gagal melapor kerusakan: ' + (err.response?.data?.message || err.message));
    } finally {
      setLoadingAction(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto px-4 py-8">
        {loading ? (
          <div className="flex justify-center items-center py-20 animate-fadeIn">
            <div className="animate-pulse flex flex-col items-center">
              <div className="h-12 w-12 rounded-full border-4 border-t-indigo-500 border-b-indigo-700 border-r-transparent border-l-transparent animate-spin"></div>
              <p className="mt-4 text-gray-500">Memuat detail peralatan...</p>
            </div>
          </div>
        ) : error ? (
          <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-md shadow-sm animate-fadeIn">
            <p className="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <span>{error}</span>
            </p>
          </div>
        ) : equipment ? (
          <div className="animate-fadeIn">
            <div className="bg-white rounded-xl shadow-md border border-gray-100 transition-all duration-300 hover:shadow-lg overflow-hidden">
              {/* Equipment Image Banner */}
              <div className="h-40 w-full bg-gradient-to-r from-indigo-500 via-blue-500 to-purple-500 relative">
                {equipment.image ? (
                  <img 
                    src={equipment.image} 
                    alt={equipment.name} 
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-20 w-20 text-white opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
                    </svg>
                  </div>
                )}
                
                {/* Status Badge */}
                <div className="absolute top-4 right-4">
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium shadow-sm ${getStatusColor(equipment.status)}`}>
                    <span className="mr-1 h-2 w-2 rounded-full bg-white"></span>
                    {equipment.status}
                  </span>
                </div>
              </div>
              
              {/* Content */}
              <div className="p-8">
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
                  <h1 className="text-2xl font-bold text-gray-800 mb-2 md:mb-0">
                    <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-blue-500">
                      {equipment.name}
                    </span>
                  </h1>
                  <div className="flex flex-wrap gap-2">
                    <span className="inline-flex items-center px-3 py-1 rounded-lg bg-indigo-50 text-indigo-700 text-sm font-medium">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                      </svg>
                      {equipment.type || 'Tipe Tidak Diketahui'}
                    </span>
                    <span className="inline-flex items-center px-3 py-1 rounded-lg bg-gray-100 text-gray-700 text-sm font-medium">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      {equipment.location || 'Lokasi belum ditentukan'}
                    </span>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                  <div className="bg-gray-50 rounded-xl p-4">
                    <h3 className="text-sm font-medium text-gray-500 uppercase mb-2">Status</h3>
                    <p className={`text-lg font-semibold ${
                      equipment.status === 'AVAILABLE' ? 'text-green-600' : 
                      equipment.status === 'IN_USE' ? 'text-yellow-600' : 
                      equipment.status === 'MAINTENANCE' ? 'text-blue-600' : 'text-red-600'
                    }`}>
                      {equipment.status}
                    </p>
                  </div>
                  <div className="bg-gray-50 rounded-xl p-4">
                    <h3 className="text-sm font-medium text-gray-500 uppercase mb-2">Ketersediaan</h3>
                    <p className="text-lg font-semibold text-gray-800">{equipment.quantity || 1}</p>
                  </div>
                  <div className="bg-gray-50 rounded-xl p-4">
                    <h3 className="text-sm font-medium text-gray-500 uppercase mb-2">Tersedia untuk pinjam</h3>
                    <p className={`text-lg font-semibold ${equipment.status === 'AVAILABLE' ? 'text-green-600' : 'text-red-600'}`}>
                      {equipment.status === 'AVAILABLE' ? 'Tersedia' : 'Tidak tersedia'}
                    </p>
                  </div>
                </div>
                
                <div className="mb-8">
                  <h2 className="text-lg font-bold text-gray-800 mb-3 flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Deskripsi
                  </h2>
                  <div className="bg-gray-50 p-4 rounded-xl text-gray-700 whitespace-pre-line">
                    {equipment.description || 'No description available for this equipment.'}
                  </div>
                </div>
                
                <div className="border-t border-gray-100 pt-6">
                  <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Aksi
                  </h2>
                  <div className="flex flex-wrap gap-4">
                    <button
                      className={`px-4 py-2 rounded-lg flex items-center font-medium transition-all duration-300 shadow-sm ${
                        equipment.status === 'AVAILABLE'
                          ? 'bg-gradient-to-r from-green-600 to-teal-500 text-white hover:from-green-700 hover:to-teal-600 hover:shadow-md transform hover:-translate-y-0.5'
                          : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                      }`}
                      onClick={equipment.status === 'AVAILABLE' ? handleOpenLoanModal : undefined}
                      disabled={equipment.status !== 'AVAILABLE'}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                      </svg>
                      Ajukan Peminjaman
                    </button>
                    <button
                      className="px-4 py-2 rounded-lg flex items-center font-medium bg-gradient-to-r from-red-600 to-pink-500 text-white hover:from-red-700 hover:to-pink-600 transition-all duration-300 hover:shadow-md transform hover:-translate-y-0.5 shadow-sm"
                      onClick={handleOpenRepairModal}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                      </svg>
                      Lapor Kerusakan
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : null}
      </div>
      
      {showLoanModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-md transform transition-all ease-in-out duration-300 scale-100">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-800">Ajukan Peminjaman</h2>
              <button onClick={() => { setShowLoanModal(false); setFormError(''); }} className="text-gray-400 hover:text-gray-600 focus:outline-none transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <form onSubmit={handleLoanSubmit} className="flex flex-col gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Laboratorium</label>
                <input
                  type="text"
                  className="w-full border-2 border-gray-200 rounded-lg px-3 py-2 bg-gray-100 text-gray-700"
                  value={equipment.lab?.name || '-'}
                  disabled
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tanggal Mulai</label>
                <input
                  type="date"
                  className="w-full border-2 border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                  required
                  value={loanForm.startDate}
                  onChange={e => setLoanForm(f => ({ ...f, startDate: e.target.value }))}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tanggal Selesai</label>
                <input
                  type="date"
                  className="w-full border-2 border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                  required
                  value={loanForm.endDate}
                  onChange={e => setLoanForm(f => ({ ...f, endDate: e.target.value }))}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Catatan (opsional)</label>
                <textarea
                  className="w-full border-2 border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                  rows="3"
                  value={loanForm.notes}
                  onChange={e => setLoanForm(f => ({ ...f, notes: e.target.value }))}
                  placeholder="Catatan untuk peminjaman atau persyaratan khusus..."
                ></textarea>
              </div>
              {formError && (
                <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-3 rounded">
                  <p className="text-sm">{formError}</p>
                </div>
              )}
              <div className="flex justify-end gap-2 mt-2">
                <button
                  type="button"
                  className="px-4 py-2 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors font-medium"
                  onClick={() => { setShowLoanModal(false); setFormError(''); }}
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-gradient-to-r from-indigo-600 to-blue-500 text-white hover:from-indigo-700 hover:to-blue-600 transition-colors font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  disabled={loadingAction}
                >
                  {loadingAction ? (
                    <span className="flex items-center">
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Memproses...
                    </span>
                  ) : (
                    'Ajukan Permintaan'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {showRepairModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-md transform transition-all ease-in-out duration-300 scale-100">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-800">Lapor Kerusakan Peralatan</h2>
              <button onClick={() => { setShowRepairModal(false); setFormError(''); }} className="text-gray-400 hover:text-gray-600 focus:outline-none transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <form onSubmit={handleRepairSubmit} className="flex flex-col gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Deskripsi Kerusakan</label>
                <textarea
                  className="w-full border-2 border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                  rows="5"
                  required
                  value={repairDesc}
                  onChange={e => setRepairDesc(e.target.value)}
                  placeholder="Deskripsi kerusakan secara detail..."
                ></textarea>
              </div>
              {formError && (
                <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-3 rounded">
                  <p className="text-sm">{formError}</p>
                </div>
              )}
              <div className="flex justify-end gap-2 mt-2">
                <button
                  type="button"
                  className="px-4 py-2 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors font-medium"
                  onClick={() => { setShowRepairModal(false); setFormError(''); }}
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-gradient-to-r from-red-600 to-pink-500 text-white hover:from-red-700 hover:to-pink-600 transition-colors font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                  disabled={loadingAction}
                >
                  {loadingAction ? (
                    <span className="flex items-center">
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Memproses...
                    </span>
                  ) : (
                    'Kirim Laporan'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
};

export default EquipmentDetail; 