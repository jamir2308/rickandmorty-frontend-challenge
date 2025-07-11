import React from 'react';

interface AlertMessageProps {
  type?: 'success' | 'error' | 'info' | 'warning';
  message: string;
  onClose?: () => void;
}

const typeStyles = {
  success: 'bg-green-100 text-green-800 border-green-300',
  error: 'bg-red-100 text-red-800 border-red-300',
  info: 'bg-blue-100 text-blue-800 border-blue-300',
  warning: 'bg-yellow-100 text-yellow-800 border-yellow-300',
};

export const AlertMessage: React.FC<AlertMessageProps> = ({ type = 'info', message, onClose }) => {
  return (
    <div className={`flex items-center border-l-4 p-4 rounded shadow-sm mb-4 ${typeStyles[type]}`}> 
      <span className="flex-1">{message}</span>
      {onClose && (
        <button
          onClick={onClose}
          className="ml-4 text-xl font-bold focus:outline-none text-inherit hover:opacity-70"
          aria-label="Close alert"
        >
          ×
        </button>
      )}
    </div>
  );
}; 