import React from 'react';
import Page from '../components/layout/Page';
import useScrollToTop from '../hooks/useScrollToTop';

const CookiePolicyPage: React.FC = () => {
  useScrollToTop();
  
  return (
    <Page title="Cookie Policy" container={false} headerStyle="transparent">
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
                  Cookie Policy
                </h2>
                <p className="mt-2 text-sm text-gray-400">
                  Last updated: {new Date().toLocaleDateString()}
                </p>
              </div>

              <div className="space-y-8 text-gray-300">
                <section className="p-6 bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700/50">
                  <h3 className="text-2xl font-semibold text-white mb-4">What Are Cookies</h3>
                  <p className="leading-relaxed">
                    Cookies are small text files that are placed on your computer or mobile device when you visit our website. 
                    They are widely used to make websites work more efficiently and provide a better user experience.
                  </p>
                </section>

                <section className="p-6 bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700/50">
                  <h3 className="text-2xl font-semibold text-white mb-4">How We Use Cookies</h3>
                  <ul className="space-y-3">
                    <li className="flex items-start">
                      <span className="flex-shrink-0 w-6 h-6 flex items-center justify-center rounded-full bg-blue-500/20 text-blue-400 mr-3 mt-1">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </span>
                      <span>
                        <strong className="text-white">Essential Cookies:</strong> Required for the website to function properly
                      </span>
                    </li>
                    <li className="flex items-start">
                      <span className="flex-shrink-0 w-6 h-6 flex items-center justify-center rounded-full bg-blue-500/20 text-blue-400 mr-3 mt-1">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </span>
                      <span>
                        <strong className="text-white">Performance Cookies:</strong> Help us understand how visitors interact with our website
                      </span>
                    </li>
                    <li className="flex items-start">
                      <span className="flex-shrink-0 w-6 h-6 flex items-center justify-center rounded-full bg-blue-500/20 text-blue-400 mr-3 mt-1">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </span>
                      <span>
                        <strong className="text-white">Functionality Cookies:</strong> Remember your preferences and settings
                      </span>
                    </li>
                  </ul>
                </section>

                <section className="p-6 bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700/50">
                  <h3 className="text-2xl font-semibold text-white mb-4">Managing Cookies</h3>
                  <p className="leading-relaxed mb-4">
                    You can control and/or delete cookies as you wish. You can delete all cookies that are already on your computer 
                    and you can set most browsers to prevent them from being placed.
                  </p>
                  <p className="leading-relaxed">
                    To learn more about cookies and how to manage them, visit{' '}
                    <a href="https://www.aboutcookies.org" className="text-blue-400 hover:text-blue-300 transition-colors duration-200">
                      www.aboutcookies.org
                    </a>
                  </p>
                </section>

                <section className="p-6 bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700/50">
                  <h3 className="text-2xl font-semibold text-white mb-4">Updates to This Policy</h3>
                  <p className="leading-relaxed">
                    We may update this Cookie Policy from time to time. We will notify you of any changes by posting the new 
                    Cookie Policy on this page and updating the &quot;Last updated&quot; date.
                  </p>
                </section>

                <section className="p-6 bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700/50">
                  <h3 className="text-2xl font-semibold text-white mb-4">Contact Us</h3>
                  <p className="leading-relaxed">
                    If you have any questions about our Cookie Policy, please contact us at{' '}
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

export default CookiePolicyPage; 