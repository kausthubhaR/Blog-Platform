import React, { useEffect, useState } from 'react';
import { FiCheckCircle, FiXCircle, FiAlertTriangle, FiInfo, FiX } from 'react-icons/fi';

const typeConfig = {
  success: { bg: 'bg-green-50', border: 'border-green-200', text: 'text-green-800', icon: <FiCheckCircle className="text-green-500 w-5 h-5 flex-shrink-0" /> },
  error:   { bg: 'bg-red-50',   border: 'border-red-200',   text: 'text-red-800',   icon: <FiXCircle className="text-red-500 w-5 h-5 flex-shrink-0" /> },
  warning: { bg: 'bg-yellow-50',border: 'border-yellow-200',text: 'text-yellow-800',icon: <FiAlertTriangle className="text-yellow-500 w-5 h-5 flex-shrink-0" /> },
  info:    { bg: 'bg-blue-50',  border: 'border-blue-200',  text: 'text-blue-800',  icon: <FiInfo className="text-blue-500 w-5 h-5 flex-shrink-0" /> },
};

const Toast = ({ id, message, type, onRemove }) => {
  const [visible, setVisible] = useState(false);
  const cfg = typeConfig[type] || typeConfig.info;

  useEffect(() => {
    const show = setTimeout(() => setVisible(true), 10);
    return () => clearTimeout(show);
  }, []);

  const handleRemove = () => {
    setVisible(false);
    setTimeout(() => onRemove(id), 300);
  };

  return (
    <div
      className={`flex items-start gap-3 p-4 rounded-xl border shadow-md max-w-sm w-full transition-all duration-300 ${cfg.bg} ${cfg.border} ${cfg.text}
        ${visible ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'}`}
    >
      {cfg.icon}
      <p className="text-sm font-medium flex-1 leading-snug">{message}</p>
      <button onClick={handleRemove} className="ml-auto hover:opacity-70 transition-opacity">
        <FiX className="w-4 h-4" />
      </button>
    </div>
  );
};

export default Toast;

