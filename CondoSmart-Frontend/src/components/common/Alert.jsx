import React from 'react';
import { FiAlertCircle, FiCheckCircle, FiInfo, FiX } from 'react-icons/fi';

const Alert = ({ type = 'info', title, message, onClose, closeable = true }) => {
  const typeStyles = {
    success: {
      bg: 'bg-green-50',
      border: 'border-green-200',
      icon: FiCheckCircle,
      iconColor: 'text-green-600',
      titleColor: 'text-green-900',
      textColor: 'text-green-700',
    },
    error: {
      bg: 'bg-red-50',
      border: 'border-red-200',
      icon: FiAlertCircle,
      iconColor: 'text-red-600',
      titleColor: 'text-red-900',
      textColor: 'text-red-700',
    },
    warning: {
      bg: 'bg-yellow-50',
      border: 'border-yellow-200',
      icon: FiAlertCircle,
      iconColor: 'text-yellow-600',
      titleColor: 'text-yellow-900',
      textColor: 'text-yellow-700',
    },
    info: {
      bg: 'bg-blue-50',
      border: 'border-blue-200',
      icon: FiInfo,
      iconColor: 'text-blue-600',
      titleColor: 'text-blue-900',
      textColor: 'text-blue-700',
    },
  };

  const style = typeStyles[type];
  const Icon = style.icon;

  return (
    <div className={`${style.bg} border ${style.border} rounded-lg p-4 flex gap-3 fade-in`}>
      <Icon className={`${style.iconColor} flex-shrink-0 mt-0.5 text-lg`} />
      <div className="flex-1">
        {title && <p className={`${style.titleColor} text-sm font-medium`}>{title}</p>}
        {message && <p className={`${style.textColor} text-sm mt-${title ? '1' : '0'}`}>{message}</p>}
      </div>
      {closeable && onClose && (
        <button
          onClick={onClose}
          className={`${style.textColor} hover:opacity-70 transition flex-shrink-0`}
        >
          <FiX />
        </button>
      )}
    </div>
  );
};

export default Alert;
