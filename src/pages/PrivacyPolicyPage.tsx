import React from 'react';
import Page from '../components/layout/Page';
import useScrollToTop from '../hooks/useScrollToTop';

const PrivacyPolicyPage: React.FC = () => {
  useScrollToTop();
  
  return (
    <Page title="Privacy Policy" container={false} headerStyle="transparent">
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="relative mt-16">
            {/* Decorative elements */}
            <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl blur opacity-30"></div>
            <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl"></div>
            
            {/* Main card */}
            <div className="relative bg-gray-900/50 backdrop-blur-xl rounded-2xl p-8 border border-gray-700/50 shadow-2xl">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  Privacy Policy
                </h2>
                <p className="mt-2 text-sm text-gray-400">
                  Last updated: {new Date().toLocaleDateString()}
                </p>
              </div>

              <div className="space-y-8 text-gray-300">
                <section className="p-6 bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700/50">
                  <h3 className="text-2xl font-semibold text-white mb-4">Information We Collect</h3>
                  <ul className="space-y-3">
                    <li className="flex items-start">
                      <span className="flex-shrink-0 w-6 h-6 flex items-center justify-center rounded-full bg-blue-500/20 text-blue-400 mr-3 mt-1">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </span>
                      <span>
                        <strong className="text-white">Personal Information:</strong> Name, email address, and contact details
                      </span>
                    </li>
                    <li className="flex items-start">
                      <span className="flex-shrink-0 w-6 h-6 flex items-center justify-center rounded-full bg-blue-500/20 text-blue-400 mr-3 mt-1">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </span>
                      <span>
                        <strong className="text-white">Usage Data:</strong> How you interact with our platform
                      </span>
                    </li>
                    <li className="flex items-start">
                      <span className="flex-shrink-0 w-6 h-6 flex items-center justify-center rounded-full bg-blue-500/20 text-blue-400 mr-3 mt-1">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </span>
                      <span>
                        <strong className="text-white">Device Information:</strong> Browser type, IP address, and device details
                      </span>
                    </li>
                  </ul>
                </section>

                <section className="p-6 bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700/50">
                  <h3 className="text-2xl font-semibold text-white mb-4">How We Use Your Information</h3>
                  <p className="leading-relaxed mb-4">
                    We use the collected information to:
                  </p>
                  <ul className="space-y-3">
                    <li className="flex items-start">
                      <span className="flex-shrink-0 w-6 h-6 flex items-center justify-center rounded-full bg-purple-500/20 text-purple-400 mr-3 mt-1">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </span>
                      <span>Provide and maintain our service</span>
                    </li>
                    <li className="flex items-start">
                      <span className="flex-shrink-0 w-6 h-6 flex items-center justify-center rounded-full bg-purple-500/20 text-purple-400 mr-3 mt-1">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </span>
                      <span>Improve user experience</span>
                    </li>
                    <li className="flex items-start">
                      <span className="flex-shrink-0 w-6 h-6 flex items-center justify-center rounded-full bg-purple-500/20 text-purple-400 mr-3 mt-1">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </span>
                      <span>Send important updates and notifications</span>
                    </li>
                  </ul>
                </section>

                <section className="p-6 bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700/50">
                  <h3 className="text-2xl font-semibold text-white mb-4">Data Security</h3>
                  <p className="leading-relaxed">
                    We implement appropriate security measures to protect your personal information. However, no method of 
                    transmission over the Internet is 100% secure, and we cannot guarantee absolute security.
                  </p>
                </section>

                <section className="p-6 bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700/50">
                  <h3 className="text-2xl font-semibold text-white mb-4">Your Rights</h3>
                  <p className="leading-relaxed mb-4">
                    You have the right to:
                  </p>
                  <ul className="space-y-3">
                    <li className="flex items-start">
                      <span className="flex-shrink-0 w-6 h-6 flex items-center justify-center rounded-full bg-blue-500/20 text-blue-400 mr-3 mt-1">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </span>
                      <span>Access your personal data</span>
                    </li>
                    <li className="flex items-start">
                      <span className="flex-shrink-0 w-6 h-6 flex items-center justify-center rounded-full bg-blue-500/20 text-blue-400 mr-3 mt-1">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </span>
                      <span>Request correction of your data</span>
                    </li>
                    <li className="flex items-start">
                      <span className="flex-shrink-0 w-6 h-6 flex items-center justify-center rounded-full bg-blue-500/20 text-blue-400 mr-3 mt-1">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </span>
                      <span>Request deletion of your data</span>
                    </li>
                  </ul>
                </section>

                <section className="p-6 bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700/50">
                  <h3 className="text-2xl font-semibold text-white mb-4">Contact Us</h3>
                  <p className="leading-relaxed">
                    If you have any questions about this Privacy Policy, please contact us at{' '}
                    <a href="mailto:privacy@fantasybypro.com" className="text-blue-400 hover:text-blue-300 transition-colors duration-200">
                      privacy@fantasybypro.com
                    </a>
                  </p>
                </section>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Page>
  );
};

export default PrivacyPolicyPage; 