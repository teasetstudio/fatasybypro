import React, { useState } from 'react';
import { useOrganization } from '../../context/OrganizationContext';
import ProjectsTab from './ProjectsTab';
import MembersTab from './MembersTab';
import SettingsTab from './SettingsTab';

const OrganizationDetail: React.FC = () => {
  const { selectedOrganization } = useOrganization();
  const [activeTab, setActiveTab] = useState(0);

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
    <div className="max-w-6xl mx-auto">
      {/* Header Section */}
      <div className="bg-white rounded-lg border border-gray-200 shadow p-6 mb-3">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          <div>
            <h1 className="text-xl font-medium text-gray-900">{selectedOrganization.name}</h1>
            <p className="text-sm text-gray-500 mt-1">{selectedOrganization.description}</p>
          </div>
        </div>
      </div>

      {/* Tabs Section */}
      <div className="bg-white rounded-lg border border-gray-200 shadow mb-2">
        <div className="flex space-x-6 px-6">
          <button
            className={`py-3 px-1 font-medium text-sm ${
              activeTab === 0
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
            onClick={() => setActiveTab(0)}
          >
            Projects
          </button>
          <button
            className={`py-3 px-1 font-medium text-sm ${
              activeTab === 1
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
            onClick={() => setActiveTab(1)}
          >
            Members
          </button>
          <button
            className={`py-3 px-1 font-medium text-sm ${
              activeTab === 2
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
            onClick={() => setActiveTab(2)}
          >
            Settings
          </button>
        </div>
      </div>

      {/* Content Section */}
      <div className="bg-white rounded-lg border border-gray-200 shadow">
        {activeTab === 0 && <ProjectsTab />}
        {activeTab === 1 && <MembersTab/>}
        {activeTab === 2 && <SettingsTab />}
      </div>
    </div>
  );
};

export default OrganizationDetail; 