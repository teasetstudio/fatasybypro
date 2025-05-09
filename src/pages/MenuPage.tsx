import { Link } from 'react-router-dom'
import Page from '../components/layout/Page'

const MenuPage = () => {
  return (
    <Page title="Home" container={false}>
      {/* Main Content */}
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="relative">
            {/* Decorative elements */}
            <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl blur opacity-30"></div>
            <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl"></div>
            
            {/* Main card */}
            <div className="relative bg-gray-900/50 backdrop-blur-xl rounded-2xl p-8 border border-gray-700/50 shadow-2xl">
              <div className="text-center mb-12">
                <h2 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  Welcome to FantasyByPro
                </h2>
                <p className="mt-4 text-lg text-gray-300">
                  Create beautiful storyboards with our easy-to-use drawing tools. Add frames, draw, and preview your storyboard.
                </p>
              </div>

              <div className="grid grid-cols-1 gap-12">
                {/* Storyboard Creator Card */}
                <Link
                  to="/storyboard"
                  className="group relative overflow-hidden rounded-3xl bg-gray-800/50 backdrop-blur-sm border-2 border-gray-700/50 hover:border-blue-500/50 transition-all duration-300 transform hover:-translate-y-2 hover:shadow-[0_0_30px_rgba(59,130,246,0.3)]"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-600/40 via-purple-600/40 to-blue-600/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="relative p-12 flex items-center space-x-10">
                    <div className="flex-shrink-0 bg-gradient-to-br from-blue-600/30 to-purple-600/30 p-8 rounded-3xl border-2 border-blue-500/30 group-hover:border-blue-500/50 transition-colors duration-300 shadow-lg group-hover:shadow-blue-500/20">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-20 w-20 text-blue-400 group-hover:text-blue-300 transition-colors duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                      </svg>
                    </div>
                    <div className="flex-grow">
                      <h3 className="text-4xl font-bold text-white mb-4 group-hover:text-blue-300 transition-colors duration-300">
                        Storyboard Creator
                      </h3>
                      <p className="text-gray-300 text-xl leading-relaxed">
                        Create and edit your storyboard frames with our powerful drawing tools
                      </p>
                    </div>
                    <div className="flex-shrink-0">
                      <div className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-2xl text-xl font-medium group-hover:from-blue-500 group-hover:to-purple-500 transition-all duration-300 shadow-lg group-hover:shadow-blue-500/25 hover:scale-105">
                        Get Started →
                      </div>
                    </div>
                  </div>
                </Link>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Assets Card */}
                  <Link
                    to="/assets"
                    className="group relative overflow-hidden rounded-xl bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 hover:border-green-500/50 transition-all duration-300"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-green-600/20 to-emerald-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <div className="relative p-6">
                      <div className="bg-gray-900/50 p-4 rounded-xl border border-gray-700/50 group-hover:border-green-500/50 transition-colors duration-300 mb-4">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-400 group-hover:text-green-300 transition-colors duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
                        </svg>
                      </div>
                      <h3 className="text-xl font-bold text-white mb-2 group-hover:text-green-300 transition-colors duration-300">
                        Assets
                      </h3>
                      <p className="text-gray-300 text-sm">
                        Create and edit your Assets and use them to organize your work
                      </p>
                    </div>
                  </Link>

                  {/* Preview Card */}
                  <Link
                    to="/storyboard/preview"
                    className="group relative overflow-hidden rounded-xl bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 hover:border-purple-500/50 transition-all duration-300"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-indigo-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <div className="relative p-6">
                      <div className="bg-gray-900/50 p-4 rounded-xl border border-gray-700/50 group-hover:border-purple-500/50 transition-colors duration-300 mb-4">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-purple-400 group-hover:text-purple-300 transition-colors duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      </div>
                      <h3 className="text-xl font-bold text-white mb-2 group-hover:text-purple-300 transition-colors duration-300">
                        Preview
                      </h3>
                      <p className="text-gray-300 text-sm">
                        View your storyboard in presentation format
                      </p>
                    </div>
                  </Link>

                  {/* Task Board Card */}
                  <Link
                    to="/tasks"
                    className="group relative overflow-hidden rounded-xl bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 hover:border-blue-500/50 transition-all duration-300"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <div className="relative p-6">
                      <div className="bg-gray-900/50 p-4 rounded-xl border border-gray-700/50 group-hover:border-blue-500/50 transition-colors duration-300 mb-4">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-400 group-hover:text-blue-300 transition-colors duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                        </svg>
                      </div>
                      <h3 className="text-xl font-bold text-white mb-2 group-hover:text-blue-300 transition-colors duration-300">
                        Task Board
                      </h3>
                      <p className="text-gray-300 text-sm">
                        Manage your tasks and track progress with our Kanban board
                      </p>
                    </div>
                  </Link>
                </div>

                {/* Features Section */}
                <div className="mt-12">
                  <h3 className="text-2xl font-bold text-white mb-6">Features</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="p-6 bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700/50">
                      <h4 className="font-semibold text-white mb-2">Drawing Tools</h4>
                      <p className="text-gray-300">Powerful drawing tools with customizable brushes and colors</p>
                    </div>
                    <div className="p-6 bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700/50">
                      <h4 className="font-semibold text-white mb-2">Multiple Frames</h4>
                      <p className="text-gray-300">Create and organize multiple frames for your storyboard</p>
                    </div>
                    <div className="p-6 bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700/50">
                      <h4 className="font-semibold text-white mb-2">Drag & Drop</h4>
                      <p className="text-gray-300">Easily reorder frames with drag and drop functionality</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Page>
  )
}

export default MenuPage
