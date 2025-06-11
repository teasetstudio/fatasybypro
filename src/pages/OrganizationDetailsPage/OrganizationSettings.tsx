import React from 'react';
import ConfirmationModal from '../../components/ConfirmationModal';

interface Props {
  name: string;
  description: string;
  onNameChange: (value: string) => void;
  onDescriptionChange: (value: string) => void;
  onUpdate: () => void;
  isUpdating: boolean;
  onDelete: () => void;
  showDeleteConfirm: boolean;
  onShowDeleteConfirm: (show: boolean) => void;
}

const OrganizationSettings: React.FC<Props> = ({
  name, description, onNameChange, onDescriptionChange, onUpdate, isUpdating,
  onDelete, showDeleteConfirm, onShowDeleteConfirm
}) => (
  <div className="max-w-lg mx-auto bg-white rounded-lg shadow p-6">
    <h2 className="text-2xl font-bold mb-4">Organization Settings</h2>
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
        <input
          type="text"
          value={name}
          onChange={(e) => onNameChange(e.target.value)}
          className="w-full px-3 py-2 border rounded-md"
          placeholder="Organization name"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
        <textarea
          value={description}
          onChange={(e) => onDescriptionChange(e.target.value)}
          className="w-full px-3 py-2 border rounded-md"
          rows={3}
          placeholder="Organization description"
        />
      </div>
      <div className="flex justify-end space-x-3">
        <button
          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50"
          onClick={onUpdate}
          disabled={isUpdating || !name.trim()}
        >
          {isUpdating ? 'Updating...' : 'Update'}
        </button>
      </div>
      <hr className="my-6" />
      <div>
        <button
          className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
          onClick={() => onShowDeleteConfirm(true)}
        >
          Delete Organization
        </button>
      </div>
    </div>

    <ConfirmationModal
      isOpen={showDeleteConfirm}
      title="Delete Organization"
      message="Are you sure you want to delete this organization? This action cannot be undone."
      confirmText="Delete"
      onConfirm={onDelete}
      onCancel={() => onShowDeleteConfirm(false)}
      variant="danger"
    />
  </div>
);

export default OrganizationSettings; 