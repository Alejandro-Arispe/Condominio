import React from 'react';

const PageHeader = ({ title, subtitle, action, children }) => {
  return (
    <div className="mb-8">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{title}</h1>
          {subtitle && <p className="text-gray-600 mt-2">{subtitle}</p>}
        </div>
        {action && <div className="ml-4">{action}</div>}
      </div>
      {children && <div className="mt-4">{children}</div>}
    </div>
  );
};

export default PageHeader;
