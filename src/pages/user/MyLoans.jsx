import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import DashboardLayout from '../../components/layouts/DashboardLayout';
import api from '../../api/axios';
import { extendLoan } from '../../api/loans';

const MyLoans = () => {
  const { user } = useSelector((state) => state.auth);
  const [loans, setLoans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [returnLoading, setReturnLoading] = useState(null);
  const [showExtendModal, setShowExtendModal] = useState(null);
  const [extendForm, setExtendForm] = useState({ newEndDate: '', notes: '' });
  const [extendLoading, setExtendLoading] = useState(false);
  const [formError, setFormError] = useState('');

  useEffect(() => {
    const fetchLoans = async () => {
      try {
        setLoading(true);
        setError(null);
        const token = localStorage.getItem('token');
        const res = await api.get(`/loans/user/${user.id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setLoans(res.data);
      } catch (err) {
        setError('Gagal memuat data peminjaman');
      } finally {
        setLoading(false);
      }
    };
    if (user?.id) fetchLoans();
  }, [user?.id]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'ACTIVE':
        return 'text-green-600 bg-green-100';
      case 'OVERDUE':
        return 'text-red-600 bg-red-100';
      case 'RETURNED':
        return 'text-blue-600 bg-blue-100';
      case 'PENDING':
        return 'text-yellow-600 bg-yellow-100';
      case 'APPROVED':
        return 'text-indigo-600 bg-indigo-100';
      case 'REJECTED':
        return 'text-gray-600 bg-gray-200';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const filteredLoans = loans.filter(loan => {
    const matchesSearch = loan.equipment?.name?.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter ? loan.status === statusFilter : true;
    return matchesSearch && matchesStatus;
  });

  const handleReturn = async (loanId) => {
    setReturnLoading(loanId);
    try {
      const token = localStorage.getItem('token');
      await api.put(`/loans/${loanId}/return`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const res = await api.get(`/loans/user/${user.id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setLoans(res.data);
    } catch (err) {
      alert('Gagal melakukan pengembalian');
    } finally {
      setReturnLoading(null);
    }
  };

  const handleOpenExtendModal = (loan) => {
    setShowExtendModal(loan.id);
    setExtendForm({ newEndDate: '', notes: '' });
    setFormError('');
  };

  const handleExtendSubmit = async (e) => {
    e.preventDefault();
    setFormError('');
    const loan = loans.find(l => l.id === showExtendModal);
    if (!extendForm.newEndDate) {
      setFormError('Tanggal baru wajib diisi.');
      return;
    }
    const oldEnd = new Date(loan.endDate);
    const newEnd = new Date(extendForm.newEndDate);
    if (newEnd <= oldEnd) {
      setFormError('Tanggal baru harus setelah tanggal kembali lama.');
      return;
    }
    setExtendLoading(true);
    try {
      await extendLoan(showExtendModal, { newEndDate: extendForm.newEndDate, notes: extendForm.notes });
      alert('Permintaan perpanjangan berhasil diajukan!');
      setShowExtendModal(null);
      setExtendForm({ newEndDate: '', notes: '' });
      const token = localStorage.getItem('token');
      const res = await api.get(`/loans/user/${user.id}`, { headers: { Authorization: `Bearer ${token}` } });
      setLoans(res.data);
    } catch (err) {
      setFormError('Gagal memperpanjang: ' + (err.response?.data?.message || err.message));
    } finally {
      setExtendLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="px-4 py-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 animate-fadeIn">
          <h1 className="text-2xl font-bold text-gray-800 mb-4 md:mb-0 flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 mr-2 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-blue-500">
              Peminjaman Saya
            </span>
          </h1>
          <div className="bg-indigo-50 text-indigo-700 rounded-lg px-4 py-2 text-sm flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>Total {loans.length} peminjaman</span>
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
                placeholder="Cari nama peralatan..."
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
                  <option value="PENDING">Pending</option>
                  <option value="APPROVED">Approved</option>
                  <option value="ACTIVE">Active</option>
                  <option value="OVERDUE">Overdue</option>
                  <option value="RETURNED">Returned</option>
                  <option value="REJECTED">Rejected</option>
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
              <p className="mt-4 text-gray-500">Memuat data peminjaman Anda...</p>
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
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Peralatan</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Tanggal Pinjam</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Tanggal Kembali</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Aksi</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredLoans.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="text-center py-12 text-gray-500">
                        <div className="flex flex-col items-center">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-300 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                          </svg>
                          <p>Tidak ada data peminjaman ditemukan</p>
                        </div>
                      </td>
                    </tr>
                  ) : filteredLoans.map((loan, index) => (
                    <tr key={loan.id} className="hover:bg-gray-50 transition-colors" style={{animationDelay: `${index * 0.05}s`}}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="font-medium text-gray-900">{loan.equipment?.name || '-'}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-gray-500">{loan.startDate ? new Date(loan.startDate).toLocaleDateString('id-ID') : '-'}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-gray-500">{loan.endDate ? new Date(loan.endDate).toLocaleDateString('id-ID') : '-'}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(loan.status)}`}>{loan.status}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap flex gap-3">
                        <Link
                          to={`/user/loans/${loan.id}`}
                          className="inline-flex items-center text-indigo-600 hover:text-indigo-800 text-sm font-medium transition-colors"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                          Detail
                        </Link>
                        {(loan.status === 'ACTIVE' || loan.status === 'APPROVED') && (
                          <button
                            className="inline-flex items-center text-purple-600 hover:text-purple-800 text-sm font-medium transition-colors"
                            onClick={() => handleOpenExtendModal(loan)}
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                            </svg>
                            Perpanjang
                          </button>
                        )}
                        {loan.status === 'ACTIVE' && (
                          <button
                            className="inline-flex items-center text-green-600 hover:text-green-800 text-sm font-medium transition-colors"
                            onClick={() => handleReturn(loan.id)}
                            disabled={returnLoading === loan.id}
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            {returnLoading === loan.id ? (
                              <span className="flex items-center">
                                <svg className="animate-spin h-4 w-4 mr-1" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Memproses...
                              </span>
                            ) : (
                              'Kembalikan'
                            )}
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
        
        {showExtendModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm animate-fadeIn">
            <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-md transform transition-all ease-in-out duration-300 scale-100">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-gray-800">Perpanjangan Peminjaman</h2>
                <button onClick={() => { setShowExtendModal(null); setFormError(''); }} className="text-gray-400 hover:text-gray-600 focus:outline-none transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <form onSubmit={handleExtendSubmit} className="flex flex-col gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Tanggal Baru (setelah jatuh tempo lama)</label>
                  <input
                    type="date"
                    className="w-full border-2 border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                    required
                    value={extendForm.newEndDate}
                    onChange={e => setExtendForm(f => ({ ...f, newEndDate: e.target.value }))}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Alasan Perpanjangan (opsional)</label>
                  <textarea
                    className="w-full border-2 border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                    rows="3"
                    value={extendForm.notes}
                    onChange={e => setExtendForm(f => ({ ...f, notes: e.target.value }))}
                    placeholder="Masukkan alasan untuk meminta perpanjangan..."
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
                    onClick={() => { setShowExtendModal(null); setFormError(''); }}
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-lg bg-gradient-to-r from-purple-600 to-indigo-500 text-white hover:from-purple-700 hover:to-indigo-600 transition-colors font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    disabled={extendLoading}
                  >
                    {extendLoading ? (
                      <span className="flex items-center">
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Memproses...
                      </span>
                    ) : (
                      'Perpanjang'
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default MyLoans; 