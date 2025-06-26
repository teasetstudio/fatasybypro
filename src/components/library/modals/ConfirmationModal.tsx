import React from 'react';
import { Dialog, DialogPanel, DialogTitle, Description } from '@headlessui/react';
import { Theme, Variant } from '../types';

interface Props {
  isOpen: boolean;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel: () => void;
  variant?: Variant;
  isLoading?: boolean;
  theme?: Theme;
}

const ConfirmationModal: React.FC<Props> = ({
  isOpen,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  onConfirm,
  onCancel,
  variant = 'danger',
  isLoading = false,
  theme = 'light'
}) => {
  const getVariantClasses = () => {
    switch (variant) {
      case 'danger':
        return theme === 'light' 
          ? 'bg-red-500 hover:bg-red-600 text-white' 
          : theme === 'scifi'
          ? 'bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white shadow-lg shadow-red-500/25'
          : 'bg-red-500 hover:bg-red-600 text-white';
      case 'warning':
        return theme === 'light'
          ? 'bg-yellow-500 hover:bg-yellow-600 text-white'
          : theme === 'scifi'
          ? 'bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white shadow-lg shadow-yellow-500/25'
          : 'bg-yellow-500 hover:bg-yellow-600 text-white';
      case 'info':
        return theme === 'light'
          ? 'bg-blue-500 hover:bg-blue-600 text-white'
          : theme === 'scifi'
          ? 'bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white shadow-lg shadow-blue-500/25'
          : 'bg-blue-500 hover:bg-blue-600 text-white';
      default:
        return theme === 'light'
          ? 'bg-red-500 hover:bg-red-600 text-white'
          : theme === 'scifi'
          ? 'bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white shadow-lg shadow-red-500/25'
          : 'bg-red-500 hover:bg-red-600 text-white';
    }
  };

  const getThemeClasses = () => {
    switch (theme) {
      case 'light':
        return {
          backdrop: 'fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm',
          panel: 'bg-white rounded-xl p-6 w-full max-w-sm border border-gray-200 shadow-2xl',
          title: 'text-xl font-bold text-gray-900 mb-4',
          message: 'mb-6 text-gray-600 leading-relaxed',
          cancelButton: 'px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors duration-200',
          confirmButton: `${getVariantClasses()} px-4 py-2 rounded-lg font-medium transition-all duration-200 shadow-sm`
        };
      case 'scifi':
        return {
          backdrop: 'fixed inset-0 bg-black bg-opacity-70 backdrop-blur-md',
          panel: 'bg-gradient-to-br from-gray-900 via-gray-800 to-black rounded-2xl p-8 w-full max-w-sm border border-cyan-500/30 shadow-2xl shadow-cyan-500/20 relative overflow-hidden',
          title: 'text-xl font-bold text-cyan-400 mb-4 tracking-wide',
          message: 'mb-6 text-gray-300 leading-relaxed',
          cancelButton: 'px-4 py-2 border border-gray-600 rounded-lg text-gray-300 hover:bg-gray-700 hover:border-gray-500 transition-all duration-200',
          confirmButton: `${getVariantClasses()} px-4 py-2 rounded-lg font-medium transition-all duration-200`
        };
      case 'dark':
      default:
        return {
          backdrop: 'fixed inset-0 bg-black bg-opacity-50',
          panel: 'bg-gray-800 rounded-lg p-6 w-full max-w-sm border border-gray-700 shadow-xl',
          title: 'text-lg font-bold text-white mb-4',
          message: 'mb-4 text-gray-300',
          cancelButton: 'px-4 py-2 border border-gray-600 rounded-md text-gray-300 hover:bg-gray-700',
          confirmButton: `${getVariantClasses()} px-4 py-2 rounded-md`
        };
    }
  };

  const themeClasses = getThemeClasses();

  return (
    <Dialog open={isOpen} onClose={onCancel} className="relative z-50">
      <div className={themeClasses.backdrop} aria-hidden="true" />
      
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <DialogPanel className={themeClasses.panel}>
          {theme === 'scifi' && (
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500"></div>
          )}
          
          <DialogTitle className={themeClasses.title}>
            {title}
          </DialogTitle>
          
          <Description className={themeClasses.message}>
            {message}
          </Description>
          
          <div className="flex justify-end space-x-3">
            <button
              className={themeClasses.cancelButton}
              onClick={onCancel}
              disabled={isLoading}
            >
              {cancelText}
            </button>
            <button
              className={`${themeClasses.confirmButton} ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
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
        </DialogPanel>
      </div>
    </Dialog>
  );
};

export default ConfirmationModal;
