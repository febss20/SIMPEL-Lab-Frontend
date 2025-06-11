import React from 'react';

const BookingNotifications = ({ successMsg, error }) => {
  return (
    <>
      {successMsg && (
        <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-md text-green-600 text-sm">
          {successMsg}
        </div>
      )}

      {error && (
        <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md text-red-600 text-sm">
          {error}
        </div>
      )}
    </>
  );
};

export default BookingNotifications;