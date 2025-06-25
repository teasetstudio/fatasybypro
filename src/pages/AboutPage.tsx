import React from 'react';
import Page from '../components/layouts/Page';

const AboutPage: React.FC = () => {
  return (
    <Page title="About">
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 py-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <div className="relative mt-16">
            {/* Decorative elements */}
            <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl blur opacity-30"></div>
            <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl"></div>
            
            {/* Main card */}
            <div className="relative bg-gray-900/50 backdrop-blur-xl rounded-2xl p-8 border border-gray-700/50 shadow-2xl">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  About FantasyByPro
                </h2>
              </div>
              
              <div className="space-y-8 text-gray-300">
                <section className="p-6 bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700/50">
                  <h3 className="text-2xl font-semibold text-white mb-4">What is FantasyByPro?</h3>
                  <p className="leading-relaxed">
                    FantasyByPro is a comprehensive storyboard and project management tool designed specifically for creative professionals 
                    working in animation, film, and digital media production. Our platform combines powerful storyboard creation tools 
                    with efficient project management features to streamline your creative workflow.
                  </p>
                </section>

                <section className="p-6 bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700/50">
                  <h3 className="text-2xl font-semibold text-white mb-4">Key Features</h3>
                  <ul className="space-y-3">
                    <li className="flex items-start">
                      <span className="flex-shrink-0 w-6 h-6 flex items-center justify-center rounded-full bg-blue-500/20 text-blue-400 mr-3 mt-1">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </span>
                      <span>
                        <strong className="text-white">Interactive Storyboard Creation:</strong> Create and edit storyboards with an intuitive interface
                      </span>
                    </li>
                    <li className="flex items-start">
                      <span className="flex-shrink-0 w-6 h-6 flex items-center justify-center rounded-full bg-blue-500/20 text-blue-400 mr-3 mt-1">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </span>
                      <span>
                        <strong className="text-white">Asset Management:</strong> Organize and manage all your creative assets in one place
                      </span>
                    </li>
                    <li className="flex items-start">
                      <span className="flex-shrink-0 w-6 h-6 flex items-center justify-center rounded-full bg-blue-500/20 text-blue-400 mr-3 mt-1">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </span>
                      <span>
                        <strong className="text-white">Task Management:</strong> Track project progress with our integrated task management system
                      </span>
                    </li>
                    <li className="flex items-start">
                      <span className="flex-shrink-0 w-6 h-6 flex items-center justify-center rounded-full bg-blue-500/20 text-blue-400 mr-3 mt-1">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </span>
                      <span>
                        <strong className="text-white">Team Collaboration:</strong> Work seamlessly with your team members in real-time
                      </span>
                    </li>
                    <li className="flex items-start">
                      <span className="flex-shrink-0 w-6 h-6 flex items-center justify-center rounded-full bg-blue-500/20 text-blue-400 mr-3 mt-1">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </span>
                      <span>
                        <strong className="text-white">Preview Capabilities:</strong> Preview your storyboards in sequence to visualize the final product
                      </span>
                    </li>
                  </ul>
                </section>

                <section className="p-6 bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700/50">
                  <h3 className="text-2xl font-semibold text-white mb-4">Our Mission</h3>
                  <p className="leading-relaxed">
                    At FantasyByPro, we&apos;re dedicated to empowering creative professionals with tools that enhance their 
                    productivity and creativity. We believe that the right tools can make a significant difference in 
                    bringing creative visions to life.
                  </p>
                </section>

                <section className="p-6 bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700/50">
                  <h3 className="text-2xl font-semibold text-white mb-4">Who is it for?</h3>
                  <p className="mb-4">
                    FantasyByPro is perfect for:
                  </p>
                  <ul className="space-y-3">
                    <li className="flex items-start">
                      <span className="flex-shrink-0 w-6 h-6 flex items-center justify-center rounded-full bg-purple-500/20 text-purple-400 mr-3 mt-1">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </span>
                      <span>Animation studios and production houses</span>
                    </li>
                    <li className="flex items-start">
                      <span className="flex-shrink-0 w-6 h-6 flex items-center justify-center rounded-full bg-purple-500/20 text-purple-400 mr-3 mt-1">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </span>
                      <span>Independent filmmakers and animators</span>
                    </li>
                    <li className="flex items-start">
                      <span className="flex-shrink-0 w-6 h-6 flex items-center justify-center rounded-full bg-purple-500/20 text-purple-400 mr-3 mt-1">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </span>
                      <span>Creative directors and storyboard artists</span>
                    </li>
                    <li className="flex items-start">
                      <span className="flex-shrink-0 w-6 h-6 flex items-center justify-center rounded-full bg-purple-500/20 text-purple-400 mr-3 mt-1">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </span>
                      <span>Project managers in creative industries</span>
                    </li>
                    <li className="flex items-start">
                      <span className="flex-shrink-0 w-6 h-6 flex items-center justify-center rounded-full bg-purple-500/20 text-purple-400 mr-3 mt-1">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </span>
                      <span>Educational institutions teaching animation and film</span>
                    </li>
                  </ul>
                </section>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Page>
  );
};

export default AboutPage; 