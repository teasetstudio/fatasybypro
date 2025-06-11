import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import AppPage from '../components/layout/AppPage';
import ConfirmationModal from '../components/ConfirmationModal';

interface Project {
  id: string;
  name: string;
  description: string;
  organizationId: string;
  organization: {
    id: string;
    name: string;
  };
  createdAt: string;
  updatedAt: string;
}

const ProjectDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [project, setProject] = useState<Project | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  useEffect(() => {
    if (id) {
      fetchProject();
    }
  }, [id]);

  useEffect(() => {
    if (project) {
      setEditName(project.name);
      setEditDescription(project.description);
    }
  }, [project]);

  const fetchProject = async () => {
    try {
      setIsLoading(true);
      const response = await api.get(`/projects/${id}`);
      setProject(response.data);
      setError(null);
    } catch (error) {
      console.error('Error fetching project:', error);
      setError('Failed to load project details');
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateProject = async () => {
    try {
      const response = await api.put(`/projects/${id}`, {
        name: editName,
        description: editDescription,
      });
      setProject(response.data);
      setIsEditing(false);
      setError(null);
    } catch (error) {
      console.error('Error updating project:', error);
      setError('Failed to update project');
    }
  };

  const handleDeleteProject = async () => {
    try {
      await api.delete(`/projects/${id}`);
      navigate('/organizations');
    } catch (error) {
      console.error('Error deleting project:', error);
      setError('Failed to delete project');
    }
  };

  if (isLoading) {
    return (
      <AppPage>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      </AppPage>
    );
  }

  if (error) {
    return (
      <AppPage>
        <div className="text-center text-red-500 p-4">
          <p>{error}</p>
          <button
            onClick={() => fetchProject()}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Retry
          </button>
        </div>
      </AppPage>
    );
  }

  if (!project) {
    return (
      <AppPage>
        <div className="text-center p-4">
          <p>Project not found</p>
        </div>
      </AppPage>
    );
  }

  return (
    <AppPage>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        {/* Header Section */}
        <div className="bg-gray-800 rounded-xl p-4 mb-4 shadow-lg border border-gray-700">
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-3">
            <div className="flex-1">
              {isEditing ? (
                <>
                  <input
                    type="text"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    className="bg-gray-700 text-white text-2xl font-bold px-3 py-1.5 rounded-lg w-full focus:ring-2 focus:ring-blue-500 focus:outline-none mb-3"
                    placeholder="Project name"
                  />
                  <textarea
                    value={editDescription}
                    onChange={(e) => setEditDescription(e.target.value)}
                    className="w-full h-24 bg-gray-700 text-white px-3 py-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    placeholder="Project description"
                  />
                </>
              ) : (
                <>
                  <h1 className="text-2xl font-bold text-white mb-3">{project.name}</h1>
                  <p className="text-gray-300 leading-relaxed text-sm">{project.description || 'No description provided.'}</p>
                </>
              )}
            </div>
            <div className="flex gap-2">
              {isEditing ? (
                <>
                  <button
                    onClick={handleUpdateProject}
                    className="px-3 py-1.5 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors flex items-center gap-1.5 text-sm"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Save
                  </button>
                  <button
                    onClick={() => {
                      setIsEditing(false);
                      setEditName(project.name);
                      setEditDescription(project.description);
                    }}
                    className="px-3 py-1.5 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors text-sm"
                  >
                    Cancel
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => setIsEditing(true)}
                    className="px-3 py-1.5 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center gap-1.5 text-sm"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                    Edit
                  </button>
                  <button
                    onClick={() => setShowDeleteConfirm(true)}
                    className="px-3 py-1.5 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors flex items-center gap-1.5 text-sm"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                    Delete
                  </button>
                </>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2 mt-3">
            <div className="w-7 h-7 bg-gray-700 rounded-lg flex items-center justify-center">
              <svg className="w-4 h-4 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
            <span className="text-blue-400 font-medium">{project.organization.name}</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-4">
            {/* Quick Actions Section */}
            <div className="bg-gray-800 rounded-xl p-4 shadow-lg border border-gray-700">
              <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <svg className="w-4 h-4 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                Quick Actions
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <button
                  onClick={() => navigate(`/projects/${project.id}/storyboard`)}
                  className="p-3 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors text-left group"
                >
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center group-hover:bg-blue-600 transition-colors">
                      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-medium text-white text-sm">Storyboard</h3>
                      <p className="text-xs text-gray-400">Create and edit storyboards</p>
                    </div>
                  </div>
                </button>

                <button
                  onClick={() => navigate(`/assets?projectId=${project.id}`)}
                  className="p-3 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors text-left group"
                >
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center group-hover:bg-green-600 transition-colors">
                      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-medium text-white text-sm">Assets</h3>
                      <p className="text-xs text-gray-400">Manage project assets</p>
                    </div>
                  </div>
                </button>

                <button
                  onClick={() => navigate(`/tasks?projectId=${project.id}`)}
                  className="p-3 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors text-left group"
                >
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-purple-500 rounded-lg flex items-center justify-center group-hover:bg-purple-600 transition-colors">
                      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-medium text-white text-sm">Tasks</h3>
                      <p className="text-xs text-gray-400">View and manage tasks</p>
                    </div>
                  </div>
                </button>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            {/* Project Details */}
            <div className="bg-gray-800 rounded-xl p-4 shadow-lg border border-gray-700">
              <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <svg className="w-4 h-4 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Project Details
              </h2>
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-gray-700 rounded-lg flex items-center justify-center">
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400">Created</p>
                    <p className="text-white font-medium text-sm">
                      {new Date(project.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-gray-700 rounded-lg flex items-center justify-center">
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400">Last Updated</p>
                    <p className="text-white font-medium text-sm">
                      {new Date(project.updatedAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <ConfirmationModal
        isOpen={showDeleteConfirm}
        title="Delete Project"
        message="Are you sure you want to delete this project? This action cannot be undone."
        confirmText="Delete"
        onConfirm={handleDeleteProject}
        onCancel={() => setShowDeleteConfirm(false)}
        variant="danger"
      />
    </AppPage>
  );
};

export default ProjectDetailsPage; 