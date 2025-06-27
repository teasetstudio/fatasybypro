import { useState, useRef, useEffect } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import SidePanelDropdown from './SidePanelDropdown';

interface SidePanelProps {
  onClose?: () => void;
}

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

const SidePanel = ({ onClose }: SidePanelProps) => {
  const { user, logout } = useAuth();
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setIsUserMenuOpen(false);
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

  return (
    <div className="w-64 bg-white shadow-lg flex flex-col h-full">
      <div className="p-4 border-b">
        <Link 
          to="/dashboard" 
          className="block hover:bg-gray-50 rounded-lg p-2 -m-2 transition-colors duration-200"
          onClick={handleNavClick}
        >
          <h2 className="text-xl font-semibold text-gray-800">Dashboard</h2>
          <p className="text-sm text-gray-600 truncate">{user?.email}</p>
        </Link>
        
        {/* Dynamic Dropdown */}
        <SidePanelDropdown onClose={handleNavClick} />
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
            onClick={handleNavClick}
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
            <div className="flex items-center max-w-48">
              <span className="mr-3">👤</span>
              <span className="truncate">{user?.email}sfs dfasdfasdf ASdaaa</span>
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
                  onClick={() => {
                    setIsUserMenuOpen(false);
                    handleNavClick();
                  }}
                >
                  <span className="mr-3">🏠</span>
                  Home
                </NavLink>
                <NavLink
                  to="/dashboard/user-settings"
                  className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors duration-150"
                  onClick={() => {
                    setIsUserMenuOpen(false);
                    handleNavClick();
                  }}
                >
                  <span className="mr-3">⚙️</span>
                  Settings
                </NavLink>
                <button
                  onClick={() => {
                    logout();
                    setIsUserMenuOpen(false);
                    handleNavClick();
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
  )
}

export default SidePanel