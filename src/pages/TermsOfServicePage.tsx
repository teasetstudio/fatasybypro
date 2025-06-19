import React from 'react';
import Page from '../components/layouts/Page';
import useScrollToTop from '../hooks/useScrollToTop';

const TermsOfServicePage: React.FC = () => {
  // useScrollToTop();
  
  return (
    <Page title="Terms of Service">
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
                  Terms of Service
                </h2>
                <p className="mt-2 text-sm text-gray-400">
                  Last updated: {new Date().toLocaleDateString()}
                </p>
              </div>

              <div className="space-y-8 text-gray-300">
                <section className="p-6 bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700/50">
                  <h3 className="text-2xl font-semibold text-white mb-4">1. Acceptance of Terms</h3>
                  <p className="leading-relaxed">
                    By accessing and using FantasyByPro, you agree to be bound by these Terms of Service and all applicable 
                    laws and regulations. If you do not agree with any of these terms, you are prohibited from using or 
                    accessing this site.
                  </p>
                </section>

                <section className="p-6 bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700/50">
                  <h3 className="text-2xl font-semibold text-white mb-4">2. Use License</h3>
                  <p className="leading-relaxed mb-4">
                    Permission is granted to temporarily use FantasyByPro for personal, non-commercial transitory viewing only. 
                    This is the grant of a license, not a transfer of title, and under this license you may not:
                  </p>
                  <ul className="space-y-3">
                    <li className="flex items-start">
                      <span className="flex-shrink-0 w-6 h-6 flex items-center justify-center rounded-full bg-blue-500/20 text-blue-400 mr-3 mt-1">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </span>
                      <span>Modify or copy the materials</span>
                    </li>
                    <li className="flex items-start">
                      <span className="flex-shrink-0 w-6 h-6 flex items-center justify-center rounded-full bg-blue-500/20 text-blue-400 mr-3 mt-1">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </span>
                      <span>Use the materials for any commercial purpose</span>
                    </li>
                    <li className="flex items-start">
                      <span className="flex-shrink-0 w-6 h-6 flex items-center justify-center rounded-full bg-blue-500/20 text-blue-400 mr-3 mt-1">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </span>
                      <span>Attempt to decompile or reverse engineer any software contained on FantasyByPro</span>
                    </li>
                  </ul>
                </section>

                <section className="p-6 bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700/50">
                  <h3 className="text-2xl font-semibold text-white mb-4">3. User Account</h3>
                  <p className="leading-relaxed mb-4">
                    To access certain features of FantasyByPro, you must create an account. You are responsible for:
                  </p>
                  <ul className="space-y-3">
                    <li className="flex items-start">
                      <span className="flex-shrink-0 w-6 h-6 flex items-center justify-center rounded-full bg-purple-500/20 text-purple-400 mr-3 mt-1">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </span>
                      <span>Maintaining the confidentiality of your account information</span>
                    </li>
                    <li className="flex items-start">
                      <span className="flex-shrink-0 w-6 h-6 flex items-center justify-center rounded-full bg-purple-500/20 text-purple-400 mr-3 mt-1">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </span>
                      <span>All activities that occur under your account</span>
                    </li>
                    <li className="flex items-start">
                      <span className="flex-shrink-0 w-6 h-6 flex items-center justify-center rounded-full bg-purple-500/20 text-purple-400 mr-3 mt-1">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </span>
                      <span>Notifying us immediately of any unauthorized use of your account</span>
                    </li>
                  </ul>
                </section>

                <section className="p-6 bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700/50">
                  <h3 className="text-2xl font-semibold text-white mb-4">4. Intellectual Property</h3>
                  <p className="leading-relaxed">
                    The content, organization, graphics, design, and other matters related to FantasyByPro are protected by 
                    applicable copyrights and other proprietary rights. The copying, redistribution, use, or publication of 
                    any such content is prohibited without our express permission.
                  </p>
                </section>

                <section className="p-6 bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700/50">
                  <h3 className="text-2xl font-semibold text-white mb-4">5. Limitation of Liability</h3>
                  <p className="leading-relaxed">
                    In no event shall FantasyByPro or its suppliers be liable for any damages (including, without limitation, 
                    damages for loss of data or profit, or due to business interruption) arising out of the use or inability 
                    to use the materials on FantasyByPro.
                  </p>
                </section>

                <section className="p-6 bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700/50">
                  <h3 className="text-2xl font-semibold text-white mb-4">6. Contact Information</h3>
                  <p className="leading-relaxed">
                    If you have any questions about these Terms of Service, please contact us at{' '}
                    <a href="mailto:legal@fantasybypro.com" className="text-blue-400 hover:text-blue-300 transition-colors duration-200">
                      legal@fantasybypro.com
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

export default TermsOfServicePage; 