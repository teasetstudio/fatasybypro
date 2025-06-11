import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';

interface Organization {
  id: string;
  name: string;
  description: string;
  role: 'OWNER' | 'ADMIN' | 'MEMBER';
}

const OrganizationDashboard: React.FC = () => {
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newOrgName, setNewOrgName] = useState('');
  const [newOrgDescription, setNewOrgDescription] = useState('');
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchOrganizations();
  }, []);

  const fetchOrganizations = async () => {
    try {
      const response = await api.get('/organizations');
      setOrganizations(response.data);
    } catch (error) {
      console.error('Error fetching organizations:', error);
    }
  };

  const handleCreateOrganization = async () => {
    try {
      await api.post('/organizations', {
        name: newOrgName,
        description: newOrgDescription,
      });
      setShowCreateModal(false);
      setNewOrgName('');
      setNewOrgDescription('');
      fetchOrganizations();
    } catch (error) {
      console.error('Error creating organization:', error);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Organizations</h1>
        <button
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
          onClick={() => setShowCreateModal(true)}
        >
          Create Organization
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {organizations.map((org) => (
          <div
            key={org.id}
            className="border rounded-lg p-6 hover:shadow-lg transition-shadow cursor-pointer"
            onClick={() => navigate(`/organizations/${org.id}`)}
          >
            <h2 className="text-xl font-semibold mb-2">{org.name}</h2>
            <p className="text-gray-600 mb-4">{org.description}</p>
            <span className="text-sm text-blue-500">Role: {org.role}</span>
          </div>
        ))}
      </div>

      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-2xl font-bold mb-4">Create New Organization</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Organization Name
                </label>
                <input
                  type="text"
                  value={newOrgName}
                  onChange={(e) => setNewOrgName(e.target.value)}
                  className="w-full px-3 py-2 border rounded-md"
                  placeholder="Enter organization name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  value={newOrgDescription}
                  onChange={(e) => setNewOrgDescription(e.target.value)}
                  className="w-full px-3 py-2 border rounded-md"
                  rows={3}
                  placeholder="Enter organization description"
                />
              </div>
              <div className="flex justify-end space-x-3">
                <button
                  className="px-4 py-2 border rounded-md hover:bg-gray-50"
                  onClick={() => setShowCreateModal(false)}
                >
                  Cancel
                </button>
                <button
                  className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50"
                  onClick={handleCreateOrganization}
                  disabled={!newOrgName.trim()}
                >
                  Create
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrganizationDashboard; 