import React, { useState, useRef, useEffect } from 'react';
import { Outlet, NavLink, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useOrganization } from '../../context/OrganizationContext';

const DashboardLayout: React.FC = () => {
  const { user, logout } = useAuth();
  const { organizations, selectedOrganization, setSelectedOrganization, projects } = useOrganization();
  const [isOrgDropdownOpen, setIsOrgDropdownOpen] = useState(false);
  const [isProjectDropdownOpen, setIsProjectDropdownOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const location = useLocation();

  const isProjectPage = location.pathname.startsWith('/dashboard/projects/');

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOrgDropdownOpen(false);
        setIsProjectDropdownOpen(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setIsUserMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const navigationItems = [
    {
      name: 'Projects',
      path: '/dashboard/projects',
      icon: '📁'
    },
    {
      name: 'Organizations',
      path: '/dashboard/organizations',
      icon: '🏢'
    },
  ];

  const renderDropdown = () => {
    if (isProjectPage) {
      return (
        <div className="mt-4 relative" ref={dropdownRef}>
          <button
            onClick={() => setIsProjectDropdownOpen(!isProjectDropdownOpen)}
            className="w-full flex items-center justify-between px-3 py-2 text-sm bg-gray-50 hover:bg-gray-100 rounded-md border transition-colors duration-200"
          >
            <div className="flex items-center">
              <span className="mr-2">📁</span>
              <span className="truncate">
                {projects.find(p => p.id === location.pathname.split('/')[3])?.name || 'Select Project'}
              </span>
            </div>
            <svg
              className={`w-4 h-4 transition-transform duration-200 ${isProjectDropdownOpen ? 'rotate-180' : ''}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {isProjectDropdownOpen && (
            <div className="absolute z-10 w-full mt-1 bg-white border rounded-md shadow-lg">
              <div className="py-1 max-h-60 overflow-y-auto">
                {projects.map((project) => (
                  <NavLink
                    key={project.id}
                    to={`/dashboard/projects/${project.id}`}
                    className={({ isActive }) =>
                      `block w-full text-left px-4 py-2 text-sm hover:bg-gray-100 transition-colors duration-150 ${
                        isActive ? 'bg-blue-50 text-blue-600' : ''
                      }`
                    }
                    onClick={() => setIsProjectDropdownOpen(false)}
                  >
                    <div className="flex items-center">
                      <span className="mr-2">📁</span>
                      <span className="truncate">{project.name}</span>
                    </div>
                  </NavLink>
                ))}
                <div className="border-t mt-1 pt-1">
                  <NavLink
                    to="/dashboard/projects"
                    className="block px-4 py-2 text-sm text-blue-600 hover:bg-gray-100 transition-colors duration-150"
                    onClick={() => setIsProjectDropdownOpen(false)}
                  >
                    All Projects
                  </NavLink>
                </div>
              </div>
            </div>
          )}
        </div>
      );
    }

    return (
      <div className="mt-4 relative" ref={dropdownRef}>
        <button
          onClick={() => setIsOrgDropdownOpen(!isOrgDropdownOpen)}
          className="w-full flex items-center justify-between px-3 py-2 text-sm bg-gray-50 hover:bg-gray-100 rounded-md border transition-colors duration-200"
        >
          <div className="flex items-center">
            <span className="mr-2">🏢</span>
            <span className="truncate">
              {selectedOrganization?.name || 'Select Organization'}
            </span>
          </div>
          <svg
            className={`w-4 h-4 transition-transform duration-200 ${isOrgDropdownOpen ? 'rotate-180' : ''}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {isOrgDropdownOpen && (
          <div className="absolute z-10 w-full mt-1 bg-white border rounded-md shadow-lg">
            <div className="py-1 max-h-60 overflow-y-auto">
              {organizations.map((org) => (
                <button
                  key={org.id}
                  onClick={() => {
                    setSelectedOrganization(org);
                    setIsOrgDropdownOpen(false);
                  }}
                  className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-100 transition-colors duration-150 ${
                    selectedOrganization?.id === org.id ? 'bg-blue-50 text-blue-600' : ''
                  }`}
                >
                  <div className="flex items-center">
                    <span className="mr-2">🏢</span>
                    <span className="truncate">{org.name}</span>
                  </div>
                </button>
              ))}
              <div className="border-t mt-1 pt-1">
                <NavLink
                  to="/dashboard/organizations"
                  className="block px-4 py-2 text-sm text-blue-600 hover:bg-gray-100 transition-colors duration-150"
                  onClick={() => setIsOrgDropdownOpen(false)}
                >
                  Manage Organizations
                </NavLink>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Side Panel */}
      <div className="w-64 bg-white shadow-lg flex flex-col">
        <div className="p-4 border-b">
          <Link 
            to="/dashboard" 
            className="block hover:bg-gray-50 rounded-lg p-2 -m-2 transition-colors duration-200"
          >
            <h2 className="text-xl font-semibold text-gray-800">Dashboard</h2>
            <p className="text-sm text-gray-600">{user?.email}</p>
          </Link>
          
          {/* Dynamic Dropdown */}
          {renderDropdown()}
        </div>

        <nav className="mt-4 flex-1">
          {navigationItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center px-4 py-3 text-gray-700 hover:bg-gray-100 transition-colors duration-150 ${
                  isActive ? 'bg-gray-100 border-l-4 border-blue-500' : ''
                }`
              }
            >
              <span className="mr-3">{item.icon}</span>
              {item.name}
            </NavLink>
          ))}
        </nav>

        {/* User Profile Menu at Bottom */}
        <div className="p-1 border-t">
          <div className="relative" ref={userMenuRef}>
            <button
              onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
              className="w-full flex items-center justify-between px-4 py-3 text-gray-700 hover:bg-gray-100 transition-colors duration-150 rounded-lg"
            >
              <div className="flex items-center">
                <span className="mr-3">👤</span>
                <span className="truncate">{user?.email}</span>
              </div>
              <svg
                className={`w-4 h-4 transition-transform duration-200 ${isUserMenuOpen ? 'rotate-180' : ''}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {isUserMenuOpen && (
              <div className="absolute bottom-full left-0 w-full mb-2 bg-white border rounded-md shadow-lg">
                <div className="py-1">
                  <NavLink
                    to="/"
                    className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors duration-150"
                    onClick={() => setIsUserMenuOpen(false)}
                  >
                    <span className="mr-3">🏠</span>
                    Home
                  </NavLink>
                  <NavLink
                    to="/dashboard/user-settings"
                    className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors duration-150"
                    onClick={() => setIsUserMenuOpen(false)}
                  >
                    <span className="mr-3">⚙️</span>
                    Settings
                  </NavLink>
                  <button
                    onClick={() => {
                      logout();
                      setIsUserMenuOpen(false);
                    }}
                    className="w-full flex items-center px-4 py-2 text-sm text-red-600 hover:bg-gray-100 transition-colors duration-150"
                  >
                    <span className="mr-3">🚪</span>
                    Sign Out
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <div className="p-6">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout; 