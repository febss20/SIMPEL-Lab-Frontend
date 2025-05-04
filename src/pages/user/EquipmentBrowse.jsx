import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../../components/layouts/DashboardLayout';
import api from '../../api/axios';
import { createLoan } from '../../api/loans';

const EquipmentBrowse = () => {
  const [equipment, setEquipment] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [showLoanModal, setShowLoanModal] = useState(null);
  const [showRepairModal, setShowRepairModal] = useState(null);
  const [loanForm, setLoanForm] = useState({ startDate: '', endDate: '', notes: '' });
  const [repairDesc, setRepairDesc] = useState('');
  const [loadingAction, setLoadingAction] = useState(false);
  const [formError, setFormError] = useState('');

  useEffect(() => {
    const fetchEquipment = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await api.get('/equipment');
        setEquipment(res.data);
      } catch (err) {
        setError('Gagal memuat data peralatan');
      } finally {
        setLoading(false);
      }
    };
    fetchEquipment();
  }, []);

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

  const filteredEquipment = equipment.filter(eq => {
    const matchesSearch = eq.name.toLowerCase().includes(search.toLowerCase()) || (eq.type?.toLowerCase().includes(search.toLowerCase()));
    const matchesStatus = statusFilter ? eq.status === statusFilter : true;
    return matchesSearch && matchesStatus;
  });

  const handleOpenLoanModal = (equipmentId) => {
    setShowLoanModal(equipmentId);
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
        equipmentId: showLoanModal,
        startDate: loanForm.startDate,
        endDate: loanForm.endDate,
        notes: loanForm.notes
      });
      alert('Permintaan peminjaman berhasil diajukan!');
      setShowLoanModal(null);
      setLoanForm({ startDate: '', endDate: '', notes: '' });
      const res = await api.get('/equipment');
      setEquipment(res.data);
    } catch (err) {
      setFormError('Gagal mengajukan peminjaman: ' + (err.response?.data?.message || err.message));
    } finally {
      setLoadingAction(false);
    }
  };

  const handleOpenRepairModal = (equipmentId) => {
    setShowRepairModal(equipmentId);
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
        equipmentId: showRepairModal,
        description: repairDesc
      });
      alert('Laporan kerusakan berhasil dikirim!');
      setShowRepairModal(null);
      setRepairDesc('');
      const res = await api.get('/equipment');
      setEquipment(res.data);
    } catch (err) {
      setFormError('Gagal melapor kerusakan: ' + (err.response?.data?.message || err.message));
    } finally {
      setLoadingAction(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="px-4 py-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 animate-fadeIn">
          <h1 className="text-2xl font-bold text-gray-800 mb-4 md:mb-0 flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 mr-2 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2" />
            </svg>
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-blue-500">
              Jelajahi Peralatan
            </span>
          </h1>
          <div className="bg-indigo-50 text-indigo-700 rounded-lg px-4 py-2 text-sm flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>Total {equipment.length} peralatan tersedia</span>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-md p-6 mb-8 animate-fadeIn border border-gray-100 transition-all duration-300 hover:shadow-lg">
          <div className="flex flex-col sm:flex-row gap-4 items-center">
            <div className="relative w-full sm:w-64 flex-grow">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input
                type="text"
                placeholder="Cari berdasarkan nama atau kategori..."
                className="pl-10 w-full border-2 border-gray-200 rounded-lg py-2 px-4 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </div>
            <div className="w-full sm:w-auto flex-shrink-0">
              <div className="relative inline-block w-full">
                <select
                  className="appearance-none w-full bg-white border-2 border-gray-200 rounded-lg py-2 px-4 pr-8 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                  value={statusFilter}
                  onChange={e => setStatusFilter(e.target.value)}
                >
                  <option value="">Semua Status</option>
                  <option value="AVAILABLE">Available</option>
                  <option value="IN_USE">In Use</option>
                  <option value="UNDER_MAINTENANCE">Under Maintenance</option>
                  <option value="UNDER_REPAIR">Under Repair</option>
                  <option value="INACTIVE">Inactive</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                  <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                    <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/>
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {loading ? (
          <div className="flex justify-center items-center py-20 animate-fadeIn">
            <div className="animate-pulse flex flex-col items-center">
              <div className="h-12 w-12 rounded-full border-4 border-t-indigo-500 border-b-indigo-700 border-r-transparent border-l-transparent animate-spin"></div>
              <p className="mt-4 text-gray-500">Memuat data peralatan...</p>
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
        ) : (
          <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100 transition-all duration-300 hover:shadow-lg animate-fadeIn">
            <div className="overflow-x-auto modern-scrollbar">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Nama</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Kategori</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Lokasi</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Lab</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Ketersediaan</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Aksi</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredEquipment.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="text-center py-12 text-gray-500">
                        <div className="flex flex-col items-center">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-300 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                          </svg>
                          <p>Tidak ada peralatan yang sesuai dengan kriteria Anda</p>
                        </div>
                      </td>
                    </tr>
                  ) : filteredEquipment.map((eq, index) => (
                    <tr key={eq.id} className="hover:bg-gray-50 transition-colors" style={{animationDelay: `${index * 0.05}s`}}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="font-medium text-gray-900">{eq.name}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <span className="h-2 w-2 rounded-full bg-indigo-200 mr-2"></span>
                          <span className="text-gray-700">{eq.type}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(eq.status)}`}>{eq.status}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-gray-700">{eq.location || '-'}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-gray-700">{eq.lab?.name || '-'}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className={`text-sm ${eq.status === 'AVAILABLE' ? 'text-green-600' : 'text-gray-400'}`}>
                          {eq.status === 'AVAILABLE' ? (eq.quantity || 1) : 0}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap flex gap-3">
                        <button
                          className="inline-flex items-center text-indigo-600 hover:text-indigo-800 text-sm font-medium transition-colors"
                          onClick={() => navigate(`/user/equipment/${eq.id}`)}
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                          Detail
                        </button>
                        {eq.status === 'AVAILABLE' ? (
                          <button
                            className="inline-flex items-center text-green-600 hover:text-green-800 text-sm font-medium transition-colors"
                            onClick={() => handleOpenLoanModal(eq.id)}
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                            </svg>
                            Pinjam
                          </button>
                        ) : (
                          <span className="inline-flex items-center text-gray-400 text-sm font-medium cursor-not-allowed" title="Tidak tersedia untuk pinjam">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            Pinjam
                          </span>
                        )}
                        <button
                          className="inline-flex items-center text-red-600 hover:text-red-800 text-sm font-medium transition-colors"
                          onClick={() => handleOpenRepairModal(eq.id)}
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                          </svg>
                          Lapor
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
      {showLoanModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-md transform transition-all ease-in-out duration-300 scale-100">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-800">Ajukan Peminjaman</h2>
              <button onClick={() => { setShowLoanModal(null); setFormError(''); }} className="text-gray-400 hover:text-gray-600 focus:outline-none transition-colors">
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
                  value={
                    (equipment.find(eq => eq.id === showLoanModal)?.lab?.name) || '-'
                  }
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
                  onClick={() => { setShowLoanModal(null); setFormError(''); }}
                >
                  Cancel
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
              <button onClick={() => { setShowRepairModal(null); setFormError(''); }} className="text-gray-400 hover:text-gray-600 focus:outline-none transition-colors">
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
                  onClick={() => { setShowRepairModal(null); setFormError(''); }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-gradient-to-r from-red-600 to-pink-500 text-white hover:from-red-700 hover:to-pink-600 transition-colors font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
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

export default EquipmentBrowse; 