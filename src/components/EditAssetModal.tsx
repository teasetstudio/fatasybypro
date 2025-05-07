import React, { useRef, useEffect } from 'react';
import { Asset, AssetType, AssetStatus } from '../types/asset';
import AssetForm from './AssetForm';
import DependencyManager from './DependencyManager';
import { useAssets } from '../context/AssetContext';

interface EditAssetModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (asset: Partial<Asset>) => void;
  asset: Asset | null;
}

const EditAssetModal: React.FC<EditAssetModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  asset,
}) => {
  const { assets, addDependency, removeDependency } = useAssets();
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

  if (!isOpen || !asset) return null;

  const handleSubmit = (values: { name: string; type: AssetType; status: AssetStatus; description: string }) => {
    onSubmit({
      name: values.name,
      type: values.type,
      status: values.status,
      description: values.description,
    });
  };

  const handleAddDependency = (sourceAssetId: string, targetAssetId: string, relationshipType: string) => {
    addDependency(sourceAssetId, targetAssetId, relationshipType);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div ref={modalRef} className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Edit Asset</h2>
        <AssetForm
          initialValues={{
            name: asset.name,
            type: asset.type,
            status: asset.status,
            description: asset.description || '',
          }}
          onSubmit={handleSubmit}
          onCancel={onClose}
          submitButtonText="Save Changes"
        />
        <DependencyManager
          currentAsset={asset}
          allAssets={assets}
          onAddDependency={handleAddDependency}
          onRemoveDependency={removeDependency}
        />
      </div>
    </div>
  );
};

export default EditAssetModal; 