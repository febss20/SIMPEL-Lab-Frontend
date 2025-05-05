import React, { useEffect } from 'react';

const Modal = ({ isOpen, onClose, title, children }) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      
      const handleEscKey = (e) => {
        if (e.key === 'Escape') onClose();
      };
      
      document.addEventListener('keydown', handleEscKey);
      
      return () => {
        document.body.style.overflow = 'auto';
        document.removeEventListener('keydown', handleEscKey);
      };
    }
  }, [isOpen, onClose]);
  
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center transition-opacity duration-300 bg-black bg-opacity-50 backdrop-blur-sm animate-fadeIn">
      <div 
        className="bg-white rounded-xl shadow-xl w-full max-w-md mx-4 relative animate-scaleIn transform transition-all duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="absolute top-0 right-0 pt-4 pr-4">
          <button
            className="bg-white rounded-full p-1.5 text-gray-400 hover:text-gray-600 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-200"
            onClick={onClose}
            aria-label="Tutup"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        {title && (
          <div className="px-6 pt-5 pb-2">
            <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
          </div>
        )}
        
        <div className={`px-6 ${title ? 'pt-2' : 'pt-8'} pb-6`}>
          {children}
        </div>
      </div>
    </div>
  );
};

export default Modal; 