import React, { useEffect } from 'react';
import ReactDOM from 'react-dom';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children, size = 'md' }) => {
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };
    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
    }
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const sizeClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
  };

  return ReactDOM.createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-75 transition-opacity duration-300 ease-in-out">
      <div 
        className={`bg-secondary-light rounded-lg shadow-xl overflow-hidden transform transition-all duration-300 ease-in-out w-full ${sizeClasses[size]}`}
        onClick={(e) => e.stopPropagation()} 
      >
        {title && (
          <div className="px-6 py-4 border-b border-secondary-lighter">
            <h3 className="text-xl font-semibold text-primary">{title}</h3>
          </div>
        )}
        <div className="p-6 text-gray-200">
          {children}
        </div>
        <div className="px-6 py-3 bg-secondary-light border-t border-secondary-lighter text-right">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-primary bg-secondary-lighter hover:bg-secondary rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-secondary-light"
          >
            Close
          </button>
        </div>
      </div>
    </div>,
    document.body 
  );
};

export default Modal;