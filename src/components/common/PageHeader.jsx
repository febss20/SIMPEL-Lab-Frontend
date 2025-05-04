import React from 'react';
import PropTypes from 'prop-types';

const PageHeader = ({ title, icon }) => {
  return (
    <div className="relative mb-6 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/10 to-blue-500/5 rounded-xl" />
      <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-indigo-500/10 rounded-full blur-xl" />
      <div className="absolute -top-6 -left-6 w-24 h-24 bg-blue-500/10 rounded-full blur-xl" />
      
      <div 
        className="relative z-10 py-4 px-6 rounded-xl border-l-4 border-indigo-500 shadow-sm bg-white/80 backdrop-blur-sm"
        style={{
          animation: 'fadeInRight 0.5s ease-out forwards',
        }}
      >
        <div className="flex items-center">
          {icon && (
            <div className="mr-4 text-indigo-600 bg-indigo-100 p-3 rounded-lg shadow-sm transform transition-transform hover:scale-105">
              {icon}
            </div>
          )}
          <div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-700 to-blue-700 text-transparent bg-clip-text">
              {title}
            </h1>
            <div className="h-1 w-16 bg-gradient-to-r from-indigo-500 to-blue-500 rounded-full mt-1" />
          </div>
        </div>
      </div>
      
      <style jsx>{`
        @keyframes fadeInRight {
          from {
            opacity: 0;
            transform: translateX(-20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
      `}</style>
    </div>
  );
};

PageHeader.propTypes = {
  title: PropTypes.string.isRequired,
  icon: PropTypes.node,
};

export default PageHeader; 