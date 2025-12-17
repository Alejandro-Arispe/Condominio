import React from 'react';

const Card = ({ 
  title, 
  subtitle, 
  children, 
  footer, 
  className = '',
  hoverable = false 
}) => {
  return (
    <div
      className={`bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden transition ${
        hoverable ? 'hover:shadow-md cursor-pointer' : ''
      } ${className}`}
    >
      {/* Header */}
      {(title || subtitle) && (
        <div className="p-6 border-b border-gray-200">
          {title && <h3 className="text-lg font-bold text-gray-900">{title}</h3>}
          {subtitle && <p className="text-sm text-gray-600 mt-1">{subtitle}</p>}
        </div>
      )}

      {/* Content */}
      <div className="p-6">
        {children}
      </div>

      {/* Footer */}
      {footer && (
        <div className="p-6 border-t border-gray-200 bg-gray-50">
          {footer}
        </div>
      )}
    </div>
  );
};

export default Card;
