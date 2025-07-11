import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

interface PageProps {
  children: React.ReactNode;
  title?: string;
  container?: boolean;
}

const Page: React.FC<PageProps> = ({ children, title }) => {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const { isAuthenticated, user, logout } = useAuth();

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
  }, [location.pathname]);

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const headerClasses = 'absolute top-0 left-0 right-0 z-50 bg-transparent'

  const linkClasses = (isActive: boolean) => {
    const baseClasses = 'inline-flex items-center px-3 py-2 text-sm font-medium transition-colors duration-200';
      return `${baseClasses} ${
        isActive 
          ? 'text-white border-b-2 border-white' 
          : 'text-white/80 hover:text-white hover:border-b-2 hover:border-white/50'
      }`;
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const getUserInitials = () => {
    if (!user?.name) return '?';
    return user.name
      .split(' ')
      .map((word: string) => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="min-h-screen">
      {/* Navigation */}
      <nav className={headerClasses}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            {/* Logo and Desktop Navigation */}
            <div className="flex items-center">
              <Link 
                to="/" 
                className="text-xl font-bold text-white"
              >
                FantasyByPro
              </Link>
              <div className="hidden md:flex md:ml-10 md:space-x-1">
                <Link
                  to="/"
                  className={linkClasses(isActive('/'))}
                >
                  Home
                </Link>
                {/* <Link
                  to="/menu"
                  className={linkClasses(isActive('/menu'))}
                >
                  Menu
                </Link> */}
                {/* <Link
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
                </Link> */}
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

            {/* Desktop Auth Buttons */}
            <div className="hidden md:flex md:items-center md:space-x-4">
              {isAuthenticated ? (
                <div className="relative">
                  <button
                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                    className="flex items-center justify-center w-10 h-10 rounded-full bg-blue-600 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 ease-in-out cursor-pointer shadow-md hover:shadow-lg"
                  >
                    <span className="font-medium text-sm">{getUserInitials()}</span>
                  </button>
                  
                  {isUserMenuOpen && (
                    <div className="absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 transform origin-top-right transition-all duration-200 ease-in-out z-20">
                      <div className="py-1" role="menu" aria-orientation="vertical">
                        <div className="px-4 py-2 border-b border-gray-100">
                          <p className="text-sm font-medium text-gray-900">{user?.name}</p>
                          <p className="text-xs text-gray-500 truncate">{user?.email}</p>
                        </div>
                        <Link
                          to="/dashboard/projects"
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-blue-600 transition-colors duration-200 cursor-pointer"
                          role="menuitem"
                          onClick={() => setIsUserMenuOpen(false)}
                        >
                          Dashboard
                        </Link>
                        <Link
                          to="/dashboard/user-settings"
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-blue-600 transition-colors duration-200 cursor-pointer"
                          role="menuitem"
                          onClick={() => setIsUserMenuOpen(false)}
                        >
                          Settings
                        </Link>
                        <div className="border-t border-gray-100 my-1"></div>
                        <button
                          onClick={() => {
                            logout();
                            setIsUserMenuOpen(false);
                          }}
                          className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-50 hover:text-red-700 transition-colors duration-200 cursor-pointer"
                          role="menuitem"
                        >
                          Sign out
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <>
                  <Link
                    to="/signin"
                    className={linkClasses(isActive('/signin'))}
                  >
                    Sign in
                  </Link>
                  <Link
                    to="/signup"
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
                  >
                    Sign up
                  </Link>
                </>
              )}
            </div>

            {/* Add click outside handler to close menu */}
            {isUserMenuOpen && (
              <div
                className="fixed inset-0 z-10"
                onClick={() => setIsUserMenuOpen(false)}
              />
            )}

            {/* Mobile menu button */}
            <div className="flex items-center md:hidden">
              <button
                onClick={toggleMobileMenu}
                className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                aria-expanded="false"
              >
                <span className="sr-only">Open main menu</span>
                {/* Icon when menu is closed */}
                <svg
                  className={`${isMobileMenuOpen ? 'hidden' : 'block'} h-6 w-6`}
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
                {/* Icon when menu is open */}
                <svg
                  className={`${isMobileMenuOpen ? 'block' : 'hidden'} h-6 w-6`}
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        <div className={`${isMobileMenuOpen ? 'block' : 'hidden'} md:hidden bg-gray-800`}>
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link
              to="/"
              className={`block px-3 py-2 rounded-md text-base font-medium ${
                isActive('/') ? 'text-white bg-gray-900' : 'text-gray-300 hover:text-white hover:bg-gray-700'
              }`}
            >
              Home
            </Link>
            <Link
              to="/menu"
              className={`block px-3 py-2 rounded-md text-base font-medium ${
                isActive('/menu') ? 'text-white bg-gray-900' : 'text-gray-300 hover:text-white hover:bg-gray-700'
              }`}
            >
              Menu
            </Link>
            <Link
              to="/storyboard"
              className={`block px-3 py-2 rounded-md text-base font-medium ${
                isActive('/storyboard') ? 'text-white bg-gray-900' : 'text-gray-300 hover:text-white hover:bg-gray-700'
              }`}
            >
              Storyboard
            </Link>
            <Link
              to="/assets"
              className={`block px-3 py-2 rounded-md text-base font-medium ${
                isActive('/assets') ? 'text-white bg-gray-900' : 'text-gray-300 hover:text-white hover:bg-gray-700'
              }`}
            >
              Assets
            </Link>
            <Link
              to="/tasks"
              className={`block px-3 py-2 rounded-md text-base font-medium ${
                isActive('/tasks') ? 'text-white bg-gray-900' : 'text-gray-300 hover:text-white hover:bg-gray-700'
              }`}
            >
              Tasks
            </Link>
            <Link
              to="/about"
              className={`block px-3 py-2 rounded-md text-base font-medium ${
                isActive('/about') ? 'text-white bg-gray-900' : 'text-gray-300 hover:text-white hover:bg-gray-700'
              }`}
            >
              About
            </Link>
            <Link
              to="/contact"
              className={`block px-3 py-2 rounded-md text-base font-medium ${
                isActive('/contact') ? 'text-white bg-gray-900' : 'text-gray-300 hover:text-white hover:bg-gray-700'
              }`}
            >
              Contact
            </Link>
          </div>
          <div className="pt-4 pb-3 border-t border-gray-700">
            <div className="flex items-center px-5">
              <div className="flex-shrink-0">
                <Link
                  to="/signin"
                  className="block w-full px-5 py-3 text-center text-base font-medium text-gray-300 hover:text-white hover:bg-gray-700 rounded-md"
                >
                  Sign in
                </Link>
              </div>
              <div className="ml-3">
                <Link
                  to="/signup"
                  className="block w-full px-5 py-3 text-center text-base font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md"
                >
                  Sign up
                </Link>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main>
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Company Info */}
            <div className="space-y-4">
              <h3 className="text-white text-lg font-semibold">FantasyByPro</h3>
              <p className="text-sm">
                Empowering creative professionals with the tools they need to bring their visions to life.
              </p>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 0C8.74 0 8.333.015 7.053.072 5.775.132 4.905.333 4.14.63c-.789.306-1.459.717-2.126 1.384S.935 3.35.63 4.14C.333 4.905.131 5.775.072 7.053.012 8.333 0 8.74 0 12s.015 3.667.072 4.947c.06 1.277.261 2.148.558 2.913.306.788.717 1.459 1.384 2.126.667.666 1.336 1.079 2.126 1.384.766.296 1.636.499 2.913.558C8.333 23.988 8.74 24 12 24s3.667-.015 4.947-.072c1.277-.06 2.148-.262 2.913-.558.788-.306 1.459-.718 2.126-1.384.666-.667 1.079-1.335 1.384-2.126.296-.765.499-1.636.558-2.913.06-1.28.072-1.687.072-4.947s-.015-3.667-.072-4.947c-.06-1.277-.262-2.149-.558-2.913-.306-.789-.718-1.459-1.384-2.126C21.319 1.347 20.651.935 19.86.63c-.765-.297-1.636-.499-2.913-.558C15.667.012 15.26 0 12 0zm0 2.16c3.203 0 3.585.016 4.85.071 1.17.055 1.805.249 2.227.415.562.217.96.477 1.382.896.419.42.679.819.896 1.381.164.422.36 1.057.413 2.227.057 1.266.07 1.646.07 4.85s-.015 3.585-.074 4.85c-.061 1.17-.256 1.805-.421 2.227-.224.562-.479.96-.899 1.382-.419.419-.824.679-1.38.896-.42.164-1.065.36-2.235.413-1.274.057-1.649.07-4.859.07-3.211 0-3.586-.015-4.859-.074-1.171-.061-1.816-.256-2.236-.421-.569-.224-.96-.479-1.379-.899-.421-.419-.69-.824-.9-1.38-.165-.42-.359-1.065-.42-2.235-.045-1.26-.061-1.649-.061-4.844 0-3.196.016-3.586.061-4.861.061-1.17.255-1.814.42-2.234.21-.57.479-.96.9-1.381.419-.419.81-.689 1.379-.898.42-.166 1.051-.361 2.221-.421 1.275-.045 1.65-.06 4.859-.06l.045.03zm0 3.678c-3.405 0-6.162 2.76-6.162 6.162 0 3.405 2.76 6.162 6.162 6.162 3.405 0 6.162-2.76 6.162-6.162 0-3.405-2.76-6.162-6.162-6.162zM12 16c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4zm7.846-10.405c0 .795-.646 1.44-1.44 1.44-.795 0-1.44-.646-1.44-1.44 0-.794.646-1.439 1.44-1.439.793-.001 1.44.645 1.44 1.439z"/>
                  </svg>
                </a>
              </div>
            </div>

            {/* Quick Links */}
            <div className="space-y-4">
              <h3 className="text-white text-lg font-semibold">Quick Links</h3>
              <ul className="space-y-2">
                <li>
                  <Link to="/storyboard" className="text-gray-400 hover:text-white transition-colors">Storyboard Creation</Link>
                </li>
                <li>
                  <Link to="/assets" className="text-gray-400 hover:text-white transition-colors">Asset Management</Link>
                </li>
                <li>
                  <Link to="/tasks" className="text-gray-400 hover:text-white transition-colors">Task Management</Link>
                </li>
                <li>
                  <Link to="/about" className="text-gray-400 hover:text-white transition-colors">About Us</Link>
                </li>
                <li>
                  <Link to="/contact" className="text-gray-400 hover:text-white transition-colors">Contact</Link>
                </li>
              </ul>
            </div>

            {/* Resources */}
            <div className="space-y-4">
              <h3 className="text-white text-lg font-semibold">Resources</h3>
              <ul className="space-y-2">
                <li>
                  <a href="#" className="text-gray-400 hover:text-white transition-colors">Documentation</a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-white transition-colors">Tutorials</a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-white transition-colors">API Reference</a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-white transition-colors">Community</a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-white transition-colors">Blog</a>
                </li>
              </ul>
            </div>

            {/* Newsletter */}
            <div className="space-y-4">
              <h3 className="text-white text-lg font-semibold">Stay Updated</h3>
              <p className="text-sm">Subscribe to our newsletter for the latest updates and features.</p>
              <form className="space-y-2">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
                />
                <button
                  type="submit"
                  className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Subscribe
                </button>
              </form>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="mt-12 pt-8 border-t border-gray-800">
            <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
              <p className="text-sm text-gray-400">
                © {new Date().getFullYear()} FantasyByPro. All rights reserved.
              </p>
              <div className="flex space-x-6">
                <Link to="/privacy-policy" className="text-gray-400 hover:text-white transition-colors text-sm">Privacy Policy</Link>
                <Link to="/terms-of-service" className="text-gray-400 hover:text-white transition-colors text-sm">Terms of Service</Link>
                <Link to="/cookie-policy" className="text-gray-400 hover:text-white transition-colors text-sm">Cookie Policy</Link>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Page;
