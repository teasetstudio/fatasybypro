import { Outlet } from 'react-router-dom';
import { useState, useEffect } from 'react';
import SidePanel from './SidePanel';
import { BurgerButton } from '@/components/library';
import SidePanelToggleButton from './SidePanelToggleButton';
import { useBreakpoints } from '@/hooks/useBreakpoints';

const DashboardLayout = () => {
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isDesktopSidebarOpen, setIsDesktopSidebarOpen] = useState(() => {
    // Initialize from localStorage, default to true if not found
    const saved = localStorage.getItem('isDesktopSidebarOpen');
    return saved !== null ? JSON.parse(saved) : true;
  });

  const { lg } = useBreakpoints();

  // Save to localStorage whenever the state changes
  useEffect(() => {
    localStorage.setItem('isDesktopSidebarOpen', JSON.stringify(isDesktopSidebarOpen));
  }, [isDesktopSidebarOpen]);

  const openMobileSidebar = () => {
    setIsMobileSidebarOpen(true);
  };

  const closeMobileSidebar = () => {
    setIsMobileSidebarOpen(false);
  };

  const toggleDesktopSidebar = () => {
    setIsDesktopSidebarOpen(!isDesktopSidebarOpen);
  };

  return (
    <div className="relative h-screen bg-gray-100">
      {/* Floating Mobile Toggle Button */}
      <BurgerButton className={`lg:hidden fixed top-1 z-50 ${isMobileSidebarOpen ? 'right-1' : 'left-1'}`} isOpen={isMobileSidebarOpen} onClose={closeMobileSidebar} onOpen={openMobileSidebar} />
      {/* Mobile Overlay */}
      {isMobileSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
          onClick={closeMobileSidebar}
        />
      )}

      {/* Desktop Toggle Button */}
      <SidePanelToggleButton className='hidden lg:block fixed z-50 top-4' isDesktopSidebarOpen={isDesktopSidebarOpen} toggleDesktopSidebar={toggleDesktopSidebar} />

      {/* Side Panel */}
      <div className={`
        fixed inset-y-0 left-0 z-40 transform transition-transform duration-300 ease-in-out
        ${lg ?
          !isDesktopSidebarOpen && '-translate-x-full'
          : isMobileSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }
      `}>
        <SidePanel onClose={closeMobileSidebar} />
      </div>

      {/* Main Content */}
      <div className={`flex-1 overflow-auto transition-all duration-300 ease-in-out ${isDesktopSidebarOpen ? 'lg:ml-64' : 'lg:ml-0'}`}>
        <Outlet />
      </div>
    </div>
  );
};

export default DashboardLayout; 