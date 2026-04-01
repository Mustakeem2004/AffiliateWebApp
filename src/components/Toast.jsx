import React from 'react';

const Toast = ({ message, type = 'success', onClose }) => {
  const bg = type === 'error' ? 'bg-red-500' : type === 'info' ? 'bg-blue-500' : 'bg-green-500';
  
  return (
    <div className="fixed bottom-4 right-4 z-50 animate-slideUp">
      <div className={`${bg} text-white px-5 py-3 rounded-lg shadow-lg flex items-center gap-3`}>
        <span>{message}</span>
        <button onClick={onClose} className="hover:opacity-70">✕</button>
      </div>
    </div>
  );
};

export default Toast;
