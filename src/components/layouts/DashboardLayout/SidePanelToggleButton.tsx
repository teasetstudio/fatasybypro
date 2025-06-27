import React from 'react'

interface Props {
  toggleDesktopSidebar: () => void;
  isDesktopSidebarOpen: boolean;
}

const SidePanelToggleButton = ({ toggleDesktopSidebar, isDesktopSidebarOpen }: Props) => {
  return (
    <button
      onClick={toggleDesktopSidebar}
      className={`hidden lg:block fixed z-50 top-4  bg-slate-200 p-1.5 rounded-md shadow-md hover:bg-gray-100 transition-all duration-300 ease-in-out border border-gray-500 ${
        isDesktopSidebarOpen ? 'left-56' : 'left-0 rounded-l-none border-l-0 pl-0.5'
      }`}
    >
      <svg
        className="w-5 h-5 text-gray-600"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        {isDesktopSidebarOpen ? (
          // Double arrow pointing left (when sidebar is open)
          <>
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 19l-7-7 7-7" />
          </>
        ) : (
          // Double arrow pointing right (when sidebar is closed)
          <>
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 5l7 7-7 7" />
          </>
        )}
      </svg>
    </button>
  )
}

export default SidePanelToggleButton