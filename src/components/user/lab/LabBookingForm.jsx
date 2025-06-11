import React from 'react';

const LabBookingForm = ({ form, onChange, onSubmit, loading, error }) => {
  const handleChange = (e) => {
    const { name, value } = e.target;
    onChange({ ...form, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit();
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Detail Booking</h3>
      
      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md text-red-600 text-sm">
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="purpose" className="block text-sm font-medium text-gray-700 mb-1">
            Tujuan Booking <span className="text-red-500">*</span>
          </label>
          <select
            id="purpose"
            name="purpose"
            value={form.purpose || ''}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-sm"
          >
            <option value="">Pilih tujuan Booking</option>
            <option value="PRAKTIKUM">Praktikum</option>
            <option value="PENELITIAN">Penelitian</option>
            <option value="KELAS">Kelas</option>
            <option value="WORKSHOP">Workshop</option>
            <option value="LAINNYA">Lainnya</option>
          </select>
        </div>

        {form.purpose === 'LAINNYA' && (
          <div className="mb-4">
            <label htmlFor="customPurpose" className="block text-sm font-medium text-gray-700 mb-1">
              Tujuan Lainnya <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="customPurpose"
              name="customPurpose"
              value={form.customPurpose || ''}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-sm"
              placeholder="Jelaskan tujuan booking"
            />
          </div>
        )}

        <div className="mb-4">
          <label htmlFor="participantCount" className="block text-sm font-medium text-gray-700 mb-1">
            Jumlah Peserta <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            id="participantCount"
            name="participantCount"
            value={form.participantCount || ''}
            onChange={handleChange}
            required
            min="1"
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-sm"
            placeholder="Masukkan jumlah peserta"
          />
        </div>

        <div className="mb-6">
          <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-1">
            Catatan Tambahan
          </label>
          <textarea
            id="notes"
            name="notes"
            value={form.notes || ''}
            onChange={handleChange}
            rows="3"
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-sm"
            placeholder="Tambahkan catatan jika diperlukan"
          ></textarea>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={loading}
            className={`inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
          >
            {loading ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Memproses...
              </>
            ) : (
              'Ajukan Booking'
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default LabBookingForm;