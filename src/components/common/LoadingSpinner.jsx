import React from 'react';

const LoadingSpinner = ({ size = 'md', className = '' }) => {
  const sizeClasses = {
    sm: 'h-4 w-4 border-2',
    md: 'h-8 w-8 border-2',
    lg: 'h-12 w-12 border-4',
    xl: 'h-16 w-16 border-4'
  };

  const sizeClass = sizeClasses[size] || sizeClasses.md;

  return (
    <div className={`flex items-center justify-center ${className}`}>
      <div className={`${sizeClass} rounded-full border-t-indigo-500 border-b-indigo-700 border-r-transparent border-l-transparent animate-spin`}></div>
    </div>
  );
};

export default LoadingSpinner;