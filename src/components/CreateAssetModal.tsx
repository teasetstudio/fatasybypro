import React, { useRef, useEffect } from 'react';
import { AssetType, AssetStatus } from '../types/asset';
import AssetForm from './AssetForm';

interface CreateAssetModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (name: string, type: AssetType, status: AssetStatus) => void;
  assetTypes: AssetType[];
  defaultAssetType: AssetType;
}

const CreateAssetModal: React.FC<CreateAssetModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  assetTypes,
  defaultAssetType,
}) => {
  const [newAssetName, setNewAssetName] = React.useState('');
  const [newAssetType, setNewAssetType] = React.useState<AssetType | ''>('');
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  const handleSubmit = (values: { name: string; type: AssetType; status: AssetStatus; description: string }) => {
    onSubmit(values.name, values.type, values.status);
  };

  const handleClose = () => {
    setNewAssetName('');
    setNewAssetType('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div ref={modalRef} className="bg-white rounded-lg p-6 w-full max-w-md">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Create New Asset</h2>
        <AssetForm
          initialValues={{
            name: '',
            type: defaultAssetType,
            status: 'draft',
            description: '',
          }}
          onSubmit={handleSubmit}
          onCancel={handleClose}
          submitButtonText="Create"
        />
      </div>
    </div>
  );
};

export default CreateAssetModal; 