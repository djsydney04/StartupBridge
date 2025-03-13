import React from 'react';

interface PageContainerProps {
  children: React.ReactNode;
  className?: string;
}

const PageContainer: React.FC<PageContainerProps> = ({ children, className = '' }) => {
  return (
    <div className={`max-w-7xl mx-auto px-5 sm:px-7 lg:px-9 py-9 w-full ${className}`}>
      {children}
    </div>
  );
};

export default PageContainer; 