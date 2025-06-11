import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface Project {
  id: string;
  name: string;
  description: string;
  role: 'OWNER' | 'ADMIN' | 'MEMBER';
}

interface Props {
  projects: Project[];
  onCreateProject: (name: string, description: string) => void;
}

const OrganizationProjects: React.FC<Props> = ({ projects, onCreateProject }) => {
  const [showProjectModal, setShowProjectModal] = useState(false);
  const [newProjectName, setNewProjectName] = useState('');
  const [newProjectDescription, setNewProjectDescription] = useState('');

  const navigate = useNavigate();

  const handleCreateProject = () => {
    onCreateProject(newProjectName, newProjectDescription);
    setShowProjectModal(false);
    setNewProjectName('');
    setNewProjectDescription('');
  };

  return (
    <>
      <div className="flex justify-end mb-6">
        <button
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
          onClick={() => setShowProjectModal(true)}
        >
          Create Project
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project) => (
          <div
            key={project.id}
            className="border rounded-lg p-6 hover:shadow-lg transition-shadow cursor-pointer"
            onClick={() => navigate(`/projects/${project.id}`)}
          >
            <h2 className="text-xl font-semibold mb-2">{project.name}</h2>
            <p className="text-gray-600 mb-4">{project.description}</p>
            <span className="text-sm text-blue-500">Role: {project.role}</span>
          </div>
        ))}
      </div>

      {showProjectModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-2xl font-bold mb-4">Create New Project</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Project Name
                </label>
                <input
                  type="text"
                  value={newProjectName}
                  onChange={(e) => setNewProjectName(e.target.value)}
                  className="w-full px-3 py-2 border rounded-md"
                  placeholder="Enter project name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  value={newProjectDescription}
                  onChange={(e) => setNewProjectDescription(e.target.value)}
                  className="w-full px-3 py-2 border rounded-md"
                  rows={3}
                  placeholder="Enter project description"
                />
              </div>
              <div className="flex justify-end space-x-3">
                <button
                  className="px-4 py-2 border rounded-md hover:bg-gray-50"
                  onClick={() => setShowProjectModal(false)}
                >
                  Cancel
                </button>
                <button
                  className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50"
                  onClick={handleCreateProject}
                  disabled={!newProjectName.trim()}
                >
                  Create
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default OrganizationProjects; 