import React from 'react';

const BookingStatusBadge = ({ status, getStatusColor }) => {
  return (
    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(status)}`}>
      {status}
    </span>
  );
};

export default BookingStatusBadge;