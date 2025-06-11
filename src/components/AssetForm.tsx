import React from 'react';
import { AssetType, AssetStatus } from '../types/asset';

interface AssetFormProps {
  initialValues: {
    name: string;
    type: AssetType;
    status: AssetStatus;
    description: string;
  };
  onSubmit: (values: {
    name: string;
    type: AssetType;
    status: AssetStatus;
    description: string;
  }) => void;
  onCancel: () => void;
  submitButtonText: string;
}

const AssetForm: React.FC<AssetFormProps> = ({
  initialValues,
  onSubmit,
  onCancel,
  submitButtonText,
}) => {
  const [name, setName] = React.useState(initialValues.name);
  const [type, setType] = React.useState<AssetType>(initialValues.type);
  const [status, setStatus] = React.useState<AssetStatus>(initialValues.status);
  const [description, setDescription] = React.useState(initialValues.description);

  // Update form when initialValues change
  React.useEffect(() => {
    setName(initialValues.name);
    setType(initialValues.type);
    setStatus(initialValues.status);
    setDescription(initialValues.description);
  }, [initialValues]);

  const handleSubmit = () => {
    if (name.trim()) {
      onSubmit({
        name: name.trim(),
        type,
        status,
        description: description.trim(),
      });
    }
  };

  const assetTypes: AssetType[] = ['character', 'model', 'animation', 'vfx', 'environment', 'prop', 'other'];
  const assetStatuses: AssetStatus[] = ['draft', 'in_progress', 'review', 'approved', 'completed'];

  return (
    <div className="space-y-4">
      <div>
        <label htmlFor="assetName" className="block text-sm font-medium text-gray-700 mb-1">
          Asset Name
        </label>
        <input
          type="text"
          id="assetName"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Enter asset name"
        />
      </div>
      <div>
        <label htmlFor="assetType" className="block text-sm font-medium text-gray-700 mb-1">
          Asset Type
        </label>
        <select
          id="assetType"
          value={type}
          onChange={(e) => setType(e.target.value as AssetType)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {assetTypes.map((type) => (
            <option key={type} value={type}>
              {type.charAt(0).toUpperCase() + type.slice(1)}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label htmlFor="assetStatus" className="block text-sm font-medium text-gray-700 mb-1">
          Status
        </label>
        <select
          id="assetStatus"
          value={status}
          onChange={(e) => setStatus(e.target.value as AssetStatus)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {assetStatuses.map((status) => (
            <option key={status} value={status}>
              {status.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label htmlFor="assetDescription" className="block text-sm font-medium text-gray-700 mb-1">
          Description
        </label>
        <textarea
          id="assetDescription"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Enter asset description"
          rows={3}
        />
      </div>
      <div className="flex justify-end space-x-2 mt-6">
        <button
          onClick={onCancel}
          className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
        >
          Cancel
        </button>
        <button
          onClick={handleSubmit}
          disabled={!name.trim()}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {submitButtonText}
        </button>
      </div>
    </div>
  );
};

export default AssetForm; 