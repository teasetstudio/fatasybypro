import { useState, useRef, useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { useOrganization } from '@/context/OrganizationContext';

interface SidePanelDropdownProps {
  onClose?: () => void;
}

const SidePanelDropdown = ({ onClose }: SidePanelDropdownProps) => {
  const { organizations, selectedOrganization, setSelectedOrganization, projects } = useOrganization();
  const [isOrgDropdownOpen, setIsOrgDropdownOpen] = useState(false);
  const [isProjectDropdownOpen, setIsProjectDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const location = useLocation();

  const isProjectPage = location.pathname.startsWith('/dashboard/projects/');

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOrgDropdownOpen(false);
        setIsProjectDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleNavClick = () => {
    // Close sidebar on mobile when navigation item is clicked
    if (onClose) {
      onClose();
    }
  };

  if (isProjectPage) {
    return (
      <div className="mt-4 relative" ref={dropdownRef}>
        <button
          onClick={() => setIsProjectDropdownOpen(!isProjectDropdownOpen)}
          className="w-full flex items-center justify-between px-3 py-2 text-sm bg-gray-50 hover:bg-gray-100 rounded-md border transition-colors duration-200"
        >
          <div className="flex items-center max-w-[160px]">
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
                  onClick={() => {
                    setIsProjectDropdownOpen(false);
                    handleNavClick();
                  }}
                >
                  <div className="flex items-center max-w-[140px]">
                    <span className="mr-2">📁</span>
                    <span className="truncate block">{project.name}</span>
                  </div>
                </NavLink>
              ))}
              <div className="border-t mt-1 pt-1">
                <NavLink
                  to="/dashboard/projects"
                  className="block px-4 py-2 text-sm text-blue-600 hover:bg-gray-100 transition-colors duration-150"
                  onClick={() => {
                    setIsProjectDropdownOpen(false);
                    handleNavClick();
                  }}
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
        <div className="flex items-center max-w-[160px]">
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
                  handleNavClick();
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
                onClick={() => {
                  setIsOrgDropdownOpen(false);
                  handleNavClick();
                }}
              >
                Manage Organizations
              </NavLink>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default SidePanelDropdown
