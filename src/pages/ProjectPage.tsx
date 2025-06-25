import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import AppPage from '../components/layouts/AppPage';
import ConfirmationModal from '../components/ConfirmationModal';
import { useOrganization } from '../context/OrganizationContext';

interface ProjectDetails {
  id: string;
  name: string;
  description: string;
  updatedAt: string;
  organizationId: string;
  createdAt: string;
  organization: {
    id: string;
    name: string;
    description: string;
    createdAt: string;
    updatedAt: string;
  };
  storyboard: {
    id: string;
    name: string;
    createdAt: string;
    updatedAt: string;
    projectId: string;
  };
}

const ProjectPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getProject, deleteProject, updateProject } = useOrganization();
  const [project, setProject] = useState<ProjectDetails | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updateError, setUpdateError] = useState<string | null>(null);
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
      const storedProject = await getProject(id!); 

      if (storedProject) {
        setProject(storedProject);
        return;
      }
      setProject(null);
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
      const updatedProject = await updateProject(id!, editName, editDescription);
      setProject(updatedProject || null);
      setIsEditing(false);
      setUpdateError(null);
    } catch (error: any) {
      console.error('Error updating project:', error);
      setUpdateError(error.response?.data?.message || 'Failed to update project');
    }
  };

  const handleDeleteProject = async () => {
    try {
      await deleteProject(id!);
      navigate('/dashboard/projects');
    } catch (error) {
      console.error('Error deleting project:', error);
      setError('Failed to delete project');
    }
  };

  if (isLoading) {
    return (
      <AppPage>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-2 border-blue-500 border-t-transparent"></div>
        </div>
      </AppPage>
    );
  }

  if (error) {
    return (
      <AppPage>
        <div className="text-center p-4">
          <p className="text-red-500">{error}</p>
          <button
            onClick={() => fetchProject()}
            className="mt-4 px-4 py-2 text-blue-500 hover:text-blue-600 transition-colors"
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
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Section */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-8 mb-8">
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
            <div className="flex-1">
              {isEditing ? (
                <div className="space-y-6">
                  <div>
                    <label htmlFor="projectName" className="block text-sm font-medium text-gray-500 mb-2">
                      Project Name
                    </label>
                    <input
                      id="projectName"
                      type="text"
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      className="text-2xl font-medium px-3 py-2 rounded-lg w-full border border-gray-200 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 focus:outline-none transition-colors"
                      placeholder="Project name"
                    />
                  </div>
                  <div>
                    <label htmlFor="projectDescription" className="block text-sm font-medium text-gray-500 mb-2">
                      Description
                    </label>
                    <textarea
                      id="projectDescription"
                      value={editDescription}
                      onChange={(e) => setEditDescription(e.target.value)}
                      className="w-full h-32 px-3 py-2 rounded-lg border border-gray-200 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 focus:outline-none transition-colors resize-none"
                      placeholder="Project description"
                    />
                  </div>
                  {updateError && (
                    <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                      <p className="text-sm text-red-600">{updateError}</p>
                    </div>
                  )}
                  <div className="flex justify-end gap-3 pt-6 border-t border-gray-100">
                    <button
                      onClick={() => {
                        setIsEditing(false);
                        setEditName(project.name);
                        setEditDescription(project.description);
                        setUpdateError(null);
                      }}
                      className="px-4 py-2 text-gray-600 hover:text-gray-900 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleUpdateProject}
                      className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center gap-2"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      Save Changes
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="flex items-center justify-between mb-4">
                    <h1 className="text-2xl font-medium text-gray-900">{project.name}</h1>
                    <button
                      onClick={() => setIsEditing(true)}
                      className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </button>
                  </div>
                  <p className="text-gray-600 leading-relaxed">{project.description || 'No description provided.'}</p>
                </>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2 mt-6 pt-6 border-t border-gray-100">
            <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
            <span className="text-blue-500 font-medium">{project.organization.name}</span>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-8">
          {/* Main Content */}
          <div className="space-y-8">
            {/* Quick Actions Section */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-8">
              <h2 className="text-xl font-medium text-gray-900 mb-10 flex items-center gap-3">
                <svg className="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                Quick Actions
              </h2>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <button
                  onClick={() => navigate(`/dashboard/projects/${project.id}/storyboard`)}
                  className="group relative p-10 bg-gradient-to-br from-blue-50 to-white rounded-2xl border border-blue-100 hover:border-blue-200 hover:shadow-lg transition-all duration-200 text-left h-full"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl"></div>
                  <div className="relative flex flex-col items-center text-center gap-6">
                    <div className="w-20 h-20 bg-blue-500 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
                      <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900 text-xl mb-2">Storyboard</h3>
                      <p className="text-gray-500">Create and edit storyboards</p>
                    </div>
                  </div>
                </button>

                <button
                  onClick={() => navigate(`/dashboard/projects/${project.id}/assets`)}
                  className="group relative p-10 bg-gradient-to-br from-green-50 to-white rounded-2xl border border-green-100 hover:border-green-200 hover:shadow-lg transition-all duration-200 text-left h-full"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl"></div>
                  <div className="relative flex flex-col items-center text-center gap-6">
                    <div className="w-20 h-20 bg-green-500 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
                      <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900 text-xl mb-2">Assets</h3>
                      <p className="text-gray-500">Manage project assets</p>
                    </div>
                  </div>
                </button>

                <button
                  onClick={() => navigate(`/dashboard/projects/${project.id}/tasks`)}
                  className="group relative p-10 bg-gradient-to-br from-purple-50 to-white rounded-2xl border border-purple-100 hover:border-purple-200 hover:shadow-lg transition-all duration-200 text-left h-full"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl"></div>
                  <div className="relative flex flex-col items-center text-center gap-6">
                    <div className="w-20 h-20 bg-purple-500 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
                      <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900 text-xl mb-2">Tasks</h3>
                      <p className="text-gray-500">View and manage tasks</p>
                    </div>
                  </div>
                </button>
              </div>
            </div>
          </div>

          {/* Project Details */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-8">
            <h2 className="text-lg font-medium text-gray-900 mb-6 flex items-center gap-2">
              <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Project Details
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gray-50 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Created</p>
                  <p className="text-gray-900 font-medium">
                    {new Date(project.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gray-50 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Last Updated</p>
                  <p className="text-gray-900 font-medium">
                    {new Date(project.updatedAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Danger Zone */}
        <div className="mt-8 border-t border-gray-100 pt-8">
          <div className="bg-white rounded-lg border border-red-100 p-8">
            <h2 className="text-lg font-medium text-red-600 mb-6 flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              Danger Zone
            </h2>
            <div className="space-y-6">
              {/* Delete Project */}
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium text-gray-900">Delete Project</h3>
                  <p className="text-sm text-gray-500 mt-1">
                    Once you delete a project, there is no going back. Please be certain.
                  </p>
                </div>
                <button
                  onClick={() => setShowDeleteConfirm(true)}
                  className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors flex items-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                  Delete Project
                </button>
              </div>

              {/* Transfer Ownership */}
              <div className="flex items-center justify-between pt-6 border-t border-gray-100">
                <div>
                  <h3 className="font-medium text-gray-900">Transfer Project Ownership</h3>
                  <p className="text-sm text-gray-500 mt-1">
                    Transfer this project to another organization. This action cannot be undone.
                  </p>
                </div>
                <button
                  onClick={() => {/* TODO: Implement transfer ownership */}}
                  className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors flex items-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                  </svg>
                  Transfer Ownership
                </button>
              </div>

              {/* Archive Project */}
              <div className="flex items-center justify-between pt-6 border-t border-gray-100">
                <div>
                  <h3 className="font-medium text-gray-900">Archive Project</h3>
                  <p className="text-sm text-gray-500 mt-1">
                    Archive this project. It will be hidden from the main view but can be restored later.
                  </p>
                </div>
                <button
                  onClick={() => {/* TODO: Implement archive project */}}
                  className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors flex items-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                  </svg>
                  Archive Project
                </button>
              </div>

              {/* Reset Project */}
              <div className="flex items-center justify-between pt-6 border-t border-gray-100">
                <div>
                  <h3 className="font-medium text-gray-900">Reset Project</h3>
                  <p className="text-sm text-gray-500 mt-1">
                    Reset all project data to its initial state. This will remove all storyboards and assets.
                  </p>
                </div>
                <button
                  onClick={() => {/* TODO: Implement reset project */}}
                  className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors flex items-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  Reset Project
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <ConfirmationModal
        isOpen={showDeleteConfirm}
        onCancel={() => setShowDeleteConfirm(false)}
        onConfirm={handleDeleteProject}
        title="Delete Project"
        message="Are you sure you want to delete this project? This action cannot be undone."
        confirmText="Delete"
        variant="danger"
      />
    </AppPage>
  );
};

export default ProjectPage;
