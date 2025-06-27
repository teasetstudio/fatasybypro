import { Outlet } from 'react-router-dom';
import { useState } from 'react';
import SidePanel from './SidePanel';
import { BurgerButton } from '@/components/library';
import SidePanelToggleButton from './SidePanelToggleButton';

const DashboardLayout = () => {
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isDesktopSidebarOpen, setIsDesktopSidebarOpen] = useState(true);

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
      {/* Mobile Overlay */}
      {isMobileSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={closeMobileSidebar}
        />
      )}

      {/* Side Panel */}
      <div className={`
        fixed inset-y-0 left-0 z-50 transform transition-transform duration-300 ease-in-out
        ${isMobileSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        ${!isDesktopSidebarOpen && 'lg:-translate-x-full'}
      `}>
        <SidePanel onClose={closeMobileSidebar} />
      </div>

      {/* Main Content */}
      <div className={`flex-1 overflow-auto transition-all duration-300 ease-in-out ${isDesktopSidebarOpen ? 'lg:ml-64' : 'lg:ml-0'}`}>
        {/* Floating Mobile Toggle Button */}
        <BurgerButton className='lg:hidden fixed top-1 left-1 z-50' isOpen={isMobileSidebarOpen} onClose={closeMobileSidebar} onOpen={openMobileSidebar} />
        
        {/* Desktop Toggle Button */}
        <SidePanelToggleButton toggleDesktopSidebar={toggleDesktopSidebar} isDesktopSidebarOpen={isDesktopSidebarOpen} />

        <Outlet />
      </div>
    </div>
  );
};

export default DashboardLayout; 