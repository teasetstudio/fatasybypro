import React, { useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';

interface PageProps {
  children: React.ReactNode;
  title?: string;
  container?: boolean;
  headerStyle?: 'default' | 'transparent';
}

const Page: React.FC<PageProps> = ({ children, title, container = true, headerStyle = 'default' }) => {
  const location = useLocation();

  useEffect(() => {
    // Get the page name from the current path
    const path = location.pathname;
    let pageName = 'Home';
    
    if (path !== '/') {
      // Remove leading slash and capitalize first letter
      pageName = path.slice(1).split('/')[0].replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
    }

    // Set the document title
    document.title = title ? `${title} | FantasyByPro` : `${pageName} | FantasyByPro`;
  }, [location.pathname, title]);

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const headerClasses = headerStyle === 'transparent' 
    ? 'absolute top-0 left-0 right-0 z-50 bg-transparent'
    : 'bg-white shadow-sm';

  const linkClasses = (isActive: boolean) => {
    const baseClasses = 'inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium';
    if (headerStyle === 'transparent') {
      return `${baseClasses} ${
        isActive 
          ? 'border-white text-white' 
          : 'border-transparent text-white/80 hover:border-white/50 hover:text-white'
      }`;
    }
    return `${baseClasses} ${
      isActive 
        ? 'border-blue-500 text-gray-900' 
        : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
    }`;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className={headerClasses}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <Link 
                  to="/" 
                  className={`text-xl font-bold ${headerStyle === 'transparent' ? 'text-white' : 'text-blue-600'}`}
                >
                  FantasyByPro
                </Link>
              </div>
              <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                <Link
                  to="/"
                  className={linkClasses(isActive('/'))}
                >
                  Home
                </Link>
                <Link
                  to="/menu"
                  className={linkClasses(isActive('/menu'))}
                >
                  Menu
                </Link>
                <Link
                  to="/storyboard"
                  className={linkClasses(isActive('/storyboard'))}
                >
                  Storyboard
                </Link>
                <Link
                  to="/assets"
                  className={linkClasses(isActive('/assets'))}
                >
                  Assets
                </Link>
                <Link
                  to="/tasks"
                  className={linkClasses(isActive('/tasks'))}
                >
                  Tasks
                </Link>
                <Link
                  to="/about"
                  className={linkClasses(isActive('/about'))}
                >
                  About
                </Link>
                <Link
                  to="/contact"
                  className={linkClasses(isActive('/contact'))}
                >
                  Contact
                </Link>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className={`${container ? 'max-w-7xl mx-auto py-6 sm:px-6 lg:px-8' : ''}`}>
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <p className="text-center text-gray-500 text-sm">
            © {new Date().getFullYear()} FantasyByPro. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Page; 