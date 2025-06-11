import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import MessageService from '../../../api/message';
import LoadingSpinner from '../../common/LoadingSpinner';

const NewConversation = () => {
  const [technicians, setTechnicians] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTechnicians = async () => {
      try {
        setLoading(true);
        const data = await MessageService.getTechnicians();
        setTechnicians(data);
        setError(null);
      } catch (err) {
        console.error('Error fetching technicians:', err);
        setError('Gagal memuat daftar teknisi. Silakan coba lagi.');
      } finally {
        setLoading(false);
      }
    };

    fetchTechnicians();
  }, []);

  const handleSelectTechnician = (technicianId) => {
    navigate(`/user/messages/${technicianId}`);
  };

  if (loading) {
    return (
      <div className="p-6">
        <h2 className="text-xl font-semibold mb-4">Pilih Teknisi</h2>
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <h2 className="text-xl font-semibold mb-4">Pilih Teknisi</h2>
        <div className="p-4 text-center">
          <p className="text-red-500">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="mt-2 text-blue-500 hover:underline"
          >
            Coba lagi
          </button>
        </div>
      </div>
    );
  }

  if (technicians.length === 0) {
    return (
      <div className="p-6">
        <h2 className="text-xl font-semibold mb-4">Pilih Teknisi</h2>
        <p className="text-gray-500 text-center">Tidak ada teknisi yang tersedia saat ini.</p>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h2 className="text-xl font-semibold mb-4">Pilih Teknisi untuk Memulai Percakapan</h2>
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <ul className="divide-y divide-gray-200">
          {technicians.map((technician) => (
            <li 
              key={technician.id} 
              className="hover:bg-gray-50 cursor-pointer"
              onClick={() => handleSelectTechnician(technician.id)}
            >
              <div className="flex items-center px-6 py-4">
                <div className="flex-shrink-0">
                  <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-500">
                    {technician.fullName ? technician.fullName.charAt(0).toUpperCase() : technician.username.charAt(0).toUpperCase()}
                  </div>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-900">
                    {technician.fullName || technician.username}
                  </p>
                  {technician.email && (
                    <p className="text-sm text-gray-500">
                      {technician.email}
                    </p>
                  )}
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default NewConversation;