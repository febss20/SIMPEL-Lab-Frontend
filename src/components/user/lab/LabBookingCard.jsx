import React from 'react';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';

const LabBookingCard = ({ booking, onCancel }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800';
      case 'APPROVED':
        return 'bg-green-100 text-green-800';
      case 'REJECTED':
        return 'bg-red-100 text-red-800';
      case 'CANCELLED':
        return 'bg-gray-100 text-gray-800';
      case 'COMPLETED':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'PENDING':
        return 'Menunggu Persetujuan';
      case 'APPROVED':
        return 'Disetujui';
      case 'REJECTED':
        return 'Ditolak';
      case 'CANCELLED':
        return 'Dibatalkan';
      case 'COMPLETED':
        return 'Selesai';
      default:
        return status;
    }
  };

  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      return format(date, 'EEEE, d MMMM yyyy', { locale: id });
    } catch (error) {
      console.error('Error formatting date:', error);
      return dateString || 'Tanggal tidak valid';
    }
  };

  const formatTime = (dateString) => {
    try {
      const date = new Date(dateString);
      return format(date, 'HH:mm');
    } catch (error) {
      console.error('Error formatting time:', error);
      return '';
    }
  };

  const canCancel = booking.status === 'PENDING' || booking.status === 'APPROVED';

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-100 transition-all hover:shadow-lg duration-200">
      <div className="p-5">
        <div className="flex justify-between items-start mb-3">
          <div>
            <h3 className="text-lg font-bold text-gray-900">{booking.lab?.name || 'Lab tidak tersedia'}</h3>
            <p className="text-sm text-gray-500">{booking.lab?.location || 'Lokasi tidak tersedia'}</p>
          </div>
          <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(booking.status)}`}>
            {getStatusText(booking.status)}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <p className="text-sm text-gray-500 mb-1">Tanggal</p>
            <p className="text-sm font-medium">{formatDate(booking.startTime)}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500 mb-1">Waktu</p>
            <p className="text-sm font-medium">
              {formatTime(booking.startTime)} - {formatTime(booking.endTime)}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <p className="text-sm text-gray-500 mb-1">Tujuan</p>
            <p className="text-sm font-medium">{booking.purpose || 'Tidak ada tujuan'}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500 mb-1">Jumlah Peserta</p>
            <p className="text-sm font-medium">{booking.participantCount !== null && booking.participantCount !== undefined ? booking.participantCount : 'Tidak diketahui'} orang</p>
          </div>
        </div>

        {booking.notes && (
          <div className="mb-4">
            <p className="text-sm text-gray-500 mb-1">Catatan</p>
            <p className="text-sm">{booking.notes}</p>
          </div>
        )}

        <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-100">
          <div className="text-xs text-gray-500">
            Dibuat pada: {format(new Date(booking.createdAt), 'dd/MM/yyyy HH:mm', { locale: id })}
          </div>
          
          {canCancel && (
            <button
              onClick={() => onCancel(booking.id)}
              className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-red-700 bg-red-50 hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
              Batalkan
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default LabBookingCard;