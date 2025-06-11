import React from 'react';

interface ConfirmationModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel: () => void;
  variant?: 'danger' | 'warning' | 'info';
  isLoading?: boolean;
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  isOpen,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  onConfirm,
  onCancel,
  variant = 'danger',
  isLoading = false
}) => {
  if (!isOpen) return null;

  const getVariantClasses = () => {
    switch (variant) {
      case 'danger':
        return 'bg-red-500 hover:bg-red-600';
      case 'warning':
        return 'bg-yellow-500 hover:bg-yellow-600';
      case 'info':
        return 'bg-blue-500 hover:bg-blue-600';
      default:
        return 'bg-red-500 hover:bg-red-600';
    }
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onCancel();
    }
  };

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      onClick={handleBackdropClick}
    >
      <div className="bg-gray-800 rounded-lg p-6 w-full max-w-sm border border-gray-700">
        <h3 className="text-lg font-bold text-white mb-4">{title}</h3>
        <p className="mb-4 text-gray-300">{message}</p>
        <div className="flex justify-end space-x-3">
          <button
            className="px-4 py-2 border border-gray-600 rounded-md text-gray-300 hover:bg-gray-700"
            onClick={onCancel}
            disabled={isLoading}
          >
            {cancelText}
          </button>
          <button
            className={`px-4 py-2 text-white rounded-md ${getVariantClasses()} ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
            onClick={onConfirm}
            disabled={isLoading}
          >
            {isLoading ? (
              <div className="flex items-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Loading...
              </div>
            ) : (
              confirmText
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal; 