import { useEffect, useState } from 'react';
import DashboardLayout from '../../../components/layouts/DashboardLayout';
import api from '../../../api/axios';
import { createLoan } from '../../../api/loans';

const RequestEquipment = () => {
  const [equipmentList, setEquipmentList] = useState([]);
  const [form, setForm] = useState({ equipmentId: '', startDate: '', endDate: '', notes: '' });
  const [loading, setLoading] = useState(false);
  const [formError, setFormError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [loadingEquipments, setLoadingEquipments] = useState(true);

  useEffect(() => {
    const fetchEquipment = async () => {
      try {
        setLoadingEquipments(true);
        const res = await api.get('/equipment');
        setEquipmentList(res.data.filter(eq => eq.status === 'AVAILABLE'));
      } catch (err) {
        setEquipmentList([]);
      } finally {
        setLoadingEquipments(false);
      }
    };
    fetchEquipment();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setFormError('');
    setSuccessMsg('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');
    setSuccessMsg('');
    if (!form.equipmentId) {
      setFormError('Silakan pilih peralatan terlebih dahulu.');
      return;
    }
    if (!form.startDate || !form.endDate) {
      setFormError('Tanggal mulai dan selesai wajib diisi.');
      return;
    }
    const today = new Date();
    const start = new Date(form.startDate);
    const end = new Date(form.endDate);
    today.setHours(0,0,0,0);
    if (start < today) {
      setFormError('Tanggal mulai tidak boleh sebelum hari ini.');
      return;
    }
    if (end <= start) {
      setFormError('Tanggal selesai harus setelah tanggal mulai.');
      return;
    }
    setLoading(true);
    try {
      await createLoan({
        equipmentId: form.equipmentId,
        startDate: form.startDate,
        endDate: form.endDate,
        notes: form.notes
      });
      setSuccessMsg('Permintaan peminjaman berhasil diajukan!');
      setForm({ equipmentId: '', startDate: '', endDate: '', notes: '' });
    } catch (err) {
      setFormError('Gagal mengajukan permintaan: ' + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-2xl mx-auto px-4 py-8 animate-fadeIn">
        <div className="flex items-center mb-8">
          <div className="h-10 w-10 rounded-lg bg-indigo-100 flex items-center justify-center mr-3">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-800">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-blue-500">
              Ajukan Peminjaman
            </span>
          </h1>
        </div>
        
        <div className="bg-white rounded-xl shadow-md p-8 border border-gray-100 transition-all duration-300 hover:shadow-lg">
          {loadingEquipments ? (
            <div className="flex justify-center items-center py-8">
              <div className="animate-pulse flex flex-col items-center">
                <div className="h-10 w-10 rounded-full border-4 border-t-indigo-500 border-b-indigo-700 border-r-transparent border-l-transparent animate-spin"></div>
                <p className="mt-4 text-gray-500">Memuat peralatan yang tersedia...</p>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-6">
              <div className="bg-indigo-50 text-indigo-700 rounded-lg p-4 mb-2 flex items-start">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="text-sm">Silakan isi formulir ini untuk mengajukan peminjaman. Hanya peralatan yang tersedia yang dapat dipinjam.</span>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Pilih Peralatan</label>
                <div className="relative">
                  <select
                    name="equipmentId"
                    value={form.equipmentId}
                    onChange={handleChange}
                    className="appearance-none w-full bg-white border-2 border-gray-200 rounded-lg py-2.5 px-4 pr-8 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                    required
                  >
                    <option value="">-- Pilih Peralatan --</option>
                    {equipmentList.map(eq => (
                      <option key={eq.id} value={eq.id}>{eq.name} ({eq.type})</option>
                    ))}
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                    <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                      <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/>
                    </svg>
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Tanggal Mulai</label>
                  <input
                    type="date"
                    name="startDate"
                    value={form.startDate}
                    onChange={handleChange}
                    className="w-full border-2 border-gray-200 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Tanggal Selesai</label>
                  <input
                    type="date"
                    name="endDate"
                    value={form.endDate}
                    onChange={handleChange}
                    className="w-full border-2 border-gray-200 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                    required
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Catatan (opsional)</label>
                <textarea
                  name="notes"
                  value={form.notes}
                  onChange={handleChange}
                  className="w-full border-2 border-gray-200 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                  rows={3}
                  placeholder="Alasan peminjaman atau kebutuhan khusus..."
                />
              </div>
              
              {formError && (
                <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded">
                  <div className="flex">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    <span>{formError}</span>
                  </div>
                </div>
              )}
              
              {successMsg && (
                <div className="bg-green-50 border-l-4 border-green-500 text-green-700 p-4 rounded animate-fadeIn">
                  <div className="flex">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span>{successMsg}</span>
                  </div>
                </div>
              )}
              
              <div className="flex justify-end mt-2">
                <button
                  type="submit"
                  className="px-6 py-3 rounded-lg bg-gradient-to-r from-indigo-600 to-blue-500 text-white hover:from-indigo-700 hover:to-blue-600 transition-colors font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-300"
                  disabled={loading}
                >
                  {loading ? (
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
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default RequestEquipment; 