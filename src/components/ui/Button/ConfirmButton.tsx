import React, { useState } from 'react';
import { Description, Dialog, DialogBackdrop, DialogPanel, DialogTitle } from '@headlessui/react';
import {ExclamationTriangleIcon } from '@heroicons/react/24/solid'
import Button from './Button';

interface ConfirmButtonProps {
  className?: string;
  children: React.ReactNode;
  onConfirm: () => void;
}

const ConfirmButton: React.FC<ConfirmButtonProps> = ({
  className,
  children,
  onConfirm,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const openModal = () => setIsOpen(true);
  const closeModal = () => setIsOpen(false);

  return (
    <>
      <Button className={className} onClick={openModal}>
        {children}
      </Button>

      <Dialog open={isOpen} onClose={closeModal} className="relative z-50">
        {/* The backdrop, rendered as a fixed sibling to the panel container */}
        <DialogBackdrop className="fixed inset-0 bg-black/30" />

        {/* Full-screen container to center the panel */}
        <div className="fixed inset-0 flex w-screen items-center justify-center p-4">
          {/* The actual dialog panel  */}
          <DialogPanel className="max-w-lg space-y-4 bg-white p-12 rounded-lg shadow-lg transform transition-all duration-300">
            <DialogTitle className="font-bold flex items-center gap-2">
              <ExclamationTriangleIcon className="h-6 w-6 text-red-500" />
              Are you sure?
            </DialogTitle>
            <Description className="text-gray-600">This action cannot be undone. Please confirm your choice.</Description>
            <div className="flex gap-4">
              <button className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300" onClick={() => setIsOpen(false)}>Cancel</button>
              <button className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600" onClick={() => { setIsOpen(false); onConfirm(); }}>Confirm</button>
            </div>
          </DialogPanel>
        </div>
      </Dialog>
    </>
  );
};

export default ConfirmButton;
