import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

interface PageProps {
  children: React.ReactNode;
  title?: string;
}

const AppPage: React.FC<PageProps> = ({ children, title }) => {
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
  }, [location.pathname]);

  return (
    <>
      <>
        {children}
      </>

      {/* Footer */}
      <footer className="bg-white border-t">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <p className="text-center text-gray-500 text-sm">
            © {new Date().getFullYear()} FantasyByPro. All rights reserved.
          </p>
        </div>
      </footer>
    </>
  );
};

export default AppPage;
