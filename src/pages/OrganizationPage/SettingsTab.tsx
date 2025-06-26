import { useEffect, useState } from 'react';
import { ConfirmationModal } from '@/components/library';
import { useOrganization } from '@/context/OrganizationContext';
import { useNavigate, useParams } from 'react-router-dom';

const SettingsTab = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { selectedOrganization, deleteOrganization, updateOrganization } = useOrganization();

  const [name, setName] = useState(selectedOrganization?.name || '');
  const [description, setDescription] = useState(selectedOrganization?.description || '');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  const onUpdate = async () => {
    if (!name.trim()) return;
    setIsUpdating(true);
    try {
      await updateOrganization(name, description);
    } catch (error) {
      console.error('Error updating organization:', error);
    } finally {
      setIsUpdating(false);
    }
  };

  const onDelete = async () => {
    if (!id) return;
    try {
      await deleteOrganization(id);
      navigate('/dashboard/organizations');
    } catch (error) {
      console.error('Error deleting organization:', error);
    }
  };

  useEffect(() => {
    if (selectedOrganization) {
      setName(selectedOrganization.name);
      setDescription(selectedOrganization.description);
    }
  }, [selectedOrganization]);

  if (!selectedOrganization) {
    return (
      <div className="max-w-4xl mx-auto px-6 py-16">
        <div className="text-center">
          <h2 className="text-lg font-medium text-gray-500">Organization not found. Select an organization from the dashboard.</h2>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="bg-white rounded-lg shadow-sm border border-gray-100">
        <div className="p-6 border-b border-gray-100">
          <h2 className="text-xl font-semibold text-gray-900">Organization Settings</h2>
          <p className="mt-1 text-sm text-gray-500">Manage your organization's basic information</p>
        </div>

        <div className="p-6 space-y-6">
          <div className="space-y-6">
            <div className="space-y-6">
              <div>
                <label 
                  htmlFor="org-name" 
                  className="block text-sm font-medium text-gray-900 mb-1.5"
                >
                  Organization Name
                </label>
                <input
                  id="org-name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-gray-900 placeholder-gray-400"
                  placeholder="Enter organization name"
                  aria-describedby="org-name-help"
                />
                <p id="org-name-help" className="mt-1.5 text-sm text-gray-500">
                  This is the name that will be displayed to all members of your organization.
                </p>
              </div>

              <div>
                <label 
                  htmlFor="org-description" 
                  className="block text-sm font-medium text-gray-900 mb-1.5"
                >
                  Description
                </label>
                <textarea
                  id="org-description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-gray-900 placeholder-gray-400"
                  rows={4}
                  placeholder="Enter organization description"
                  aria-describedby="org-description-help"
                />
                <p id="org-description-help" className="mt-1.5 text-sm text-gray-500">
                  Provide a brief overview of your organization's purpose and goals.
                </p>
              </div>
            </div>

            <div className="flex justify-end">
              <button
                className="px-6 py-2.5 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm"
                onClick={onUpdate}
                disabled={isUpdating || !name.trim()}
              >
                {isUpdating ? (
                  <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Saving...
                  </span>
                ) : (
                  'Save Changes'
                )}
              </button>
            </div>
          </div>
        </div>

        <div className="p-6 bg-gray-50 border-t border-gray-100 rounded-b-lg">
          <div className="space-y-3">
            <h3 className="text-sm font-medium text-gray-900">Danger Zone</h3>
            <p className="text-sm text-gray-500">Once you delete an organization, there is no going back. Please be certain.</p>
            <button
              className="px-4 py-2 bg-white text-red-600 text-sm font-medium border border-red-200 rounded-md hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors"
              onClick={() => setShowDeleteConfirm(true)}
            >
              Delete Organization
            </button>
          </div>
        </div>
      </div>

      <ConfirmationModal
        isOpen={showDeleteConfirm}
        title="Delete Organization"
        message="Are you sure you want to delete this organization? This action cannot be undone and all associated data will be permanently removed."
        confirmText="Delete Organization"
        onConfirm={onDelete}
        onCancel={() => setShowDeleteConfirm(false)}
        variant="danger"
      />
    </>
  );
};

export default SettingsTab;
