import React from 'react';

const Modal = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40 animate-fadeIn">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-md mx-4 relative animate-fadeInUp">
        <button
          className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 transition"
          onClick={onClose}
          aria-label="Tutup"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
        </button>
        {title && <h3 className="text-lg font-semibold text-gray-800 mb-4 text-center mt-4">{title}</h3>}
        <div className="px-6 pb-6">{children}</div>
      </div>
    </div>
  );
};

export default Modal; 