import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useOrganization } from '../context/OrganizationContext';

const DashboardPage: React.FC = () => {
  const { user } = useAuth();
  const { organizations, projects } = useOrganization();

  const quickActions = [
    {
      title: 'Create New Project',
      description: 'Start a new project and begin storyboarding',
      icon: '📝',
      path: '/dashboard/projects',
      color: 'from-blue-500 to-blue-600'
    },
    {
      title: 'Manage Organizations',
      description: 'View and manage your organizations',
      icon: '🏢',
      path: '/dashboard/organizations',
      color: 'from-purple-500 to-purple-600'
    },
    {
      title: 'Asset Library',
      description: 'Access and manage your assets',
      icon: '🎨',
      path: '/dashboard/assets',
      color: 'from-green-500 to-green-600'
    },
    {
      title: 'Task Board',
      description: 'View and manage your tasks',
      icon: '📋',
      path: '/dashboard/tasks',
      color: 'from-orange-500 to-orange-600'
    }
  ];

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h1 className="text-2xl font-semibold text-gray-800">
          Welcome back, {user?.name}
        </h1>
        <p className="text-gray-600 mt-2">
          Here's an overview of your workspace
        </p>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {quickActions.map((action) => (
          <Link
            key={action.path}
            to={action.path}
            className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow duration-200"
          >
            <div className={`w-12 h-12 rounded-lg bg-gradient-to-r ${action.color} flex items-center justify-center text-2xl mb-4`}>
              {action.icon}
            </div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              {action.title}
            </h3>
            <p className="text-gray-600 text-sm">
              {action.description}
            </p>
          </Link>
        ))}
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Organizations Overview */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">
            Organizations
          </h2>
          {organizations.length > 0 ? (
            <div className="space-y-3">
              {organizations.slice(0, 3).map((org) => (
                <div key={org.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center">
                    <span className="text-xl mr-3">🏢</span>
                    <span className="font-medium text-gray-700">{org.name}</span>
                  </div>
                  <Link
                    to={`/dashboard/organizations/${org.id}`}
                    className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                  >
                    View
                  </Link>
                </div>
              ))}
              {organizations.length > 3 && (
                <Link
                  to="/dashboard/organizations"
                  className="text-blue-600 hover:text-blue-700 text-sm font-medium block text-center mt-2"
                >
                  View all {organizations.length} organizations
                </Link>
              )}
            </div>
          ) : (
            <p className="text-gray-600">
              No organizations yet. Create one to get started.
            </p>
          )}
        </div>

        {/* Projects Overview */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">
            Recent Projects
          </h2>
          {projects.length > 0 ? (
            <div className="space-y-3">
              {projects.slice(0, 3).map((project) => (
                <div key={project.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center">
                    <span className="text-xl mr-3">📁</span>
                    <span className="font-medium text-gray-700">{project.name}</span>
                  </div>
                  <Link
                    to={`/dashboard/projects/${project.id}`}
                    className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                  >
                    View
                  </Link>
                </div>
              ))}
              {projects.length > 3 && (
                <Link
                  to="/dashboard/projects"
                  className="text-blue-600 hover:text-blue-700 text-sm font-medium block text-center mt-2"
                >
                  View all {projects.length} projects
                </Link>
              )}
            </div>
          ) : (
            <p className="text-gray-600">
              No projects yet. Create one to get started.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardPage; 