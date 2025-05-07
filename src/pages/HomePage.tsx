import { Link } from 'react-router-dom'

const HomePage = () => {
  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-white shadow-md w-full sticky top-0 z-20">
        <div className="container mx-auto px-4 py-3">
          <h1 className="text-2xl font-bold text-gray-800">Storyboard Creator</h1>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto p-4 mt-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-3xl font-bold text-gray-800 mb-6">Welcome to Storyboard Creator</h2>
            <p className="text-gray-600 mb-8">
              Create beautiful storyboards with our easy-to-use drawing tools. Add frames, draw, and preview your storyboard.
            </p>

            <div className="grid grid-cols-1 gap-6">
              {/* Drawing Page Link */}
              <Link
                to="/storyboard"
                className="group flex flex-col items-center p-10 bg-gradient-to-br from-blue-50 via-indigo-50 to-blue-100 rounded-2xl hover:from-blue-100 hover:via-indigo-100 hover:to-blue-200 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 border-2 border-blue-100 hover:border-blue-200"
              >
                <div className="bg-white p-5 rounded-full shadow-lg group-hover:shadow-xl transition-all duration-300 mb-8 ring-4 ring-blue-100 group-hover:ring-blue-200">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-20 w-20 text-blue-600 group-hover:text-blue-700 transition-colors duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                  </svg>
                </div>
                <h3 className="text-3xl font-bold text-gray-800 mb-4 group-hover:text-blue-700 transition-colors duration-300">Storyboard Creator</h3>
                <p className="text-gray-600 text-center leading-relaxed text-lg max-w-2xl">
                  Create and edit your storyboard frames with our powerful drawing tools
                </p>
                <div className="mt-6 px-6 py-2 bg-blue-600 text-white rounded-full text-sm font-semibold group-hover:bg-blue-700 transition-colors duration-300">
                  Get Started →
                </div>
              </Link>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Link
                  to="/assets"
                  className="group flex flex-col items-center p-8 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl hover:from-green-100 hover:to-emerald-100 transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-1"
                >
                  <div className="bg-white p-4 rounded-full shadow-md group-hover:shadow-lg transition-all duration-300 mb-6">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-green-600 group-hover:text-green-700 transition-colors duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-800 mb-3 group-hover:text-green-700 transition-colors duration-300">Assets</h3>
                  <p className="text-gray-600 text-center leading-relaxed">
                    Create and edit your Assets and use them to organize your work
                  </p>
                </Link>

                {/* Preview Page Link */}
                <Link
                  to="/storyboard/preview"
                  className="group flex flex-col items-center p-8 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl hover:from-gray-100 hover:to-gray-200 transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-1"
                >
                  <div className="bg-white p-4 rounded-full shadow-md group-hover:shadow-lg transition-all duration-300 mb-6">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-gray-500 group-hover:text-gray-600 transition-colors duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-800 mb-3 group-hover:text-gray-700 transition-colors duration-300">Preview</h3>
                  <p className="text-gray-600 text-center leading-relaxed">
                    View your storyboard in presentation format
                  </p>
                </Link>

                {/* Task Board Link */}
                <Link
                  to="/tasks"
                  className="group flex flex-col items-center p-8 bg-gradient-to-br from-purple-50 to-indigo-50 rounded-xl hover:from-purple-100 hover:to-indigo-100 transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-1"
                >
                  <div className="bg-white p-4 rounded-full shadow-md group-hover:shadow-lg transition-all duration-300 mb-6">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-purple-600 group-hover:text-purple-700 transition-colors duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-800 mb-3 group-hover:text-purple-700 transition-colors duration-300">Task Board</h3>
                  <p className="text-gray-600 text-center leading-relaxed">
                    Manage your tasks and track progress with our Kanban board
                  </p>
                </Link>
              </div>
            </div>

            {/* Features Section */}
            <div className="mt-12">
              <h3 className="text-2xl font-bold text-gray-800 mb-4">Features</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-semibold text-gray-800 mb-2">Drawing Tools</h4>
                  <p className="text-gray-600">Powerful drawing tools with customizable brushes and colors</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-semibold text-gray-800 mb-2">Multiple Frames</h4>
                  <p className="text-gray-600">Create and organize multiple frames for your storyboard</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-semibold text-gray-800 mb-2">Drag & Drop</h4>
                  <p className="text-gray-600">Easily reorder frames with drag and drop functionality</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default HomePage