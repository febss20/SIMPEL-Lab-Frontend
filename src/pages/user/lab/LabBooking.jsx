import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import DashboardLayout from '../../../components/layouts/DashboardLayout';
import LabBookingCalendar from '../../../components/user/lab/LabBookingCalendar';
import LabBookingForm from '../../../components/user/lab/LabBookingForm';
import { getAllLabs } from '../../../api/admin';
import { createBooking } from '../../../api/labBooking';

const LabBooking = () => {
  const { labId } = useParams();
  const navigate = useNavigate();
  const [lab, setLab] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formError, setFormError] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    purpose: '',
    customPurpose: '',
    participantCount: '',
    notes: ''
  });
  const [selectedTimeSlot, setSelectedTimeSlot] = useState(null);

  const fetchLab = useCallback(async () => {
    setLoading(true);
    try {
      const labs = await getAllLabs();
      const foundLab = labs.find(l => l.id === parseInt(labId));
      
      if (!foundLab) {
        setError('Laboratorium tidak ditemukan');
        return;
      }
      
      setLab(foundLab);
      setError(null);
    } catch (err) {
      console.error('Error fetching lab:', err);
      setError('Gagal memuat data laboratorium. Silakan coba lagi.');
    } finally {
      setLoading(false);
    }
  }, [labId]);

  useEffect(() => {
    fetchLab();
  }, [labId, fetchLab]);

  const handleFormChange = (updatedForm) => {
    setForm(updatedForm);
    setFormError(null);
  };

  const handleSelectTimeSlot = (slot) => {
    setSelectedTimeSlot(slot);
    setFormError(null);
  };

  const handleSubmit = async () => {
    if (!selectedTimeSlot) {
      setFormError('Silakan pilih waktu booking terlebih dahulu');
      return;
    }

    if (!form.purpose) {
      setFormError('Silakan pilih tujuan booking');
      return;
    }

    if (form.purpose === 'LAINNYA' && !form.customPurpose) {
      setFormError('Silakan isi tujuan booking lainnya');
      return;
    }

    if (!form.participantCount || form.participantCount <= 0) {
      setFormError('Silakan masukkan jumlah peserta yang valid');
      return;
    }

    setSubmitting(true);
    setFormError(null);

    try {
      const bookingData = {
        labId: parseInt(labId),
        startTime: selectedTimeSlot.startTime,
        endTime: selectedTimeSlot.endTime,
        purpose: form.purpose === 'LAINNYA' ? form.customPurpose : form.purpose,
        participantCount: parseInt(form.participantCount),
        notes: form.notes
      };

      await createBooking(bookingData);
      navigate('/user/lab/bookings', { 
        state: { success: true, message: 'Booking laboratorium berhasil diajukan' } 
      });
    } catch (err) {
      console.error('Error creating booking:', err);
      setFormError(err.response?.data?.message || 'Gagal membuat booking. Silakan coba lagi.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="container mx-auto px-4 py-8">
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500"></div>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout>
        <div className="container mx-auto px-4 py-8">
          <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            </div>
          </div>
          <button
            onClick={() => navigate('/user/lab')}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Kembali ke Daftar Lab
          </button>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <button
            onClick={() => navigate('/user/lab')}
            className="inline-flex items-center text-sm text-indigo-600 hover:text-indigo-800 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
            </svg>
            Kembali ke Daftar Lab
          </button>
        </div>

        <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6">
          <div className="md:flex">
            <div className="md:flex-shrink-0">
              <img
                className="h-48 w-full object-cover md:w-48"
                src={lab.image || '/lab-placeholder.svg'}
                alt={lab.name}
              />
            </div>
            <div className="p-8">
              <div className="uppercase tracking-wide text-sm text-indigo-500 font-semibold">
                Laboratorium
              </div>
              <h2 className="mt-1 text-2xl font-bold text-gray-900 leading-tight">
                {lab.name}
              </h2>
              <div className="mt-2 flex items-center text-sm text-gray-500">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                </svg>
                {lab.location || 'Lokasi tidak tersedia'}
              </div>
              <div className="mt-4 flex items-center">
                <div className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                  Kapasitas: {lab.capacity || 'N/A'} orang
                </div>
              </div>
              <p className="mt-4 text-gray-600">
                {lab.description || 'Tidak ada deskripsi tersedia untuk laboratorium ini.'}
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <LabBookingCalendar 
            labId={parseInt(labId)} 
            onSelectTimeSlot={handleSelectTimeSlot} 
          />
          
          <LabBookingForm 
            form={form} 
            onChange={handleFormChange} 
            onSubmit={handleSubmit} 
            loading={submitting} 
            error={formError} 
          />
        </div>
      </div>
    </DashboardLayout>
  );
};

export default LabBooking;