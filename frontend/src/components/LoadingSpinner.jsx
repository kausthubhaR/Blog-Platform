import React from 'react';

const LoadingSpinner = ({ size = 'md', className = '' }) => {
  const sizes = { sm: 'h-6 w-6', md: 'h-10 w-10', lg: 'h-16 w-16' };
  return (
    <div className={`flex justify-center items-center ${className}`}>
      <div className={`${sizes[size] || sizes.md} animate-spin rounded-full border-4 border-indigo-100 border-t-indigo-600`}></div>
    </div>
  );
};

export default LoadingSpinner;

