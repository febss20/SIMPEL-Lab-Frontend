import React from 'react';

const ErrorAlert = ({ message, className = '' }) => {
  return (
    <div className={`bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-md shadow-sm ${className}`}>
      <p className="font-medium">Oops! Terjadi kesalahan</p>
      <p>{message}</p>
    </div>
  );
};

export default ErrorAlert;