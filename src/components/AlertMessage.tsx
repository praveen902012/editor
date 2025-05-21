import React, { useEffect, useState } from 'react';
import { AlertCircle, CheckCircle, X } from 'lucide-react';

interface AlertMessageProps {
  message: string;
  type: 'success' | 'error';
  onDismiss: () => void;
  autoClose?: boolean;
  duration?: number;
}

const AlertMessage: React.FC<AlertMessageProps> = ({
  message,
  type,
  onDismiss,
  autoClose = true,
  duration = 5000,
}) => {
  const [isVisible, setIsVisible] = useState(true);
  
  useEffect(() => {
    if (autoClose) {
      const timer = setTimeout(() => {
        setIsVisible(false);
        setTimeout(onDismiss, 300); // Wait for fade-out animation
      }, duration);
      
      return () => clearTimeout(timer);
    }
  }, [autoClose, duration, onDismiss]);
  
  const colors = {
    success: 'bg-green-50 text-green-800 border-green-200',
    error: 'bg-red-50 text-red-800 border-red-200',
  };
  
  const iconColors = {
    success: 'text-green-500',
    error: 'text-red-500',
  };
  
  return (
    <div
      className={`
        fixed top-4 right-4 z-50 max-w-md w-full transform
        transition-all duration-300 ease-in-out
        ${isVisible ? 'translate-y-0 opacity-100' : '-translate-y-4 opacity-0'}
        ${colors[type]} border rounded-lg shadow-md overflow-hidden
      `}
    >
      <div className="p-4 flex items-start">
        <div className="flex-shrink-0">
          {type === 'success' ? (
            <CheckCircle className={`h-5 w-5 ${iconColors[type]}`} />
          ) : (
            <AlertCircle className={`h-5 w-5 ${iconColors[type]}`} />
          )}
        </div>
        <div className="ml-3 flex-1">
          <p className="text-sm">{message}</p>
        </div>
        <button
          onClick={() => {
            setIsVisible(false);
            setTimeout(onDismiss, 300);
          }}
          className="ml-3 flex-shrink-0 text-gray-400 hover:text-gray-500 focus:outline-none"
        >
          <X className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
};

export default AlertMessage;