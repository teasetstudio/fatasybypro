import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Page from '../components/layout/Page';

const ForgotPasswordPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    setError('');
  };

  const validateEmail = (email: string) => {
    return /\S+@\S+\.\S+/.test(email);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      setError('Email is required');
      return;
    }
    
    if (!validateEmail(email)) {
      setError('Please enter a valid email address');
      return;
    }

    // Handle password reset logic here
    console.log('Password reset requested for:', email);
    setIsSubmitted(true);
  };

  return (
    <Page title="Forgot Password" container={false} headerStyle="transparent">
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full">
          <div className="relative">
            {/* Decorative elements */}
            <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl blur opacity-30"></div>
            <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl"></div>
            
            {/* Main card */}
            <div className="relative bg-gray-900/50 backdrop-blur-xl rounded-2xl p-8 border border-gray-700/50 shadow-2xl">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  Reset Password
                </h2>
                <p className="mt-2 text-sm text-gray-400">
                  Enter your email address and we&apos;ll send you a link to reset your password
                </p>
              </div>

              {!isSubmitted ? (
                <form className="space-y-6" onSubmit={handleSubmit}>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1">
                      Email address
                    </label>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      required
                      value={email}
                      onChange={handleChange}
                      className={`appearance-none rounded-lg relative block w-full px-4 py-3 border ${
                        error ? 'border-red-500' : 'border-gray-700/50'
                      } bg-gray-800/50 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent transition-all duration-200`}
                      placeholder="Enter your email"
                    />
                    {error && (
                      <p className="mt-1 text-sm text-red-400">{error}</p>
                    )}
                  </div>

                  <div>
                    <button
                      type="submit"
                      className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 transform hover:-translate-y-0.5"
                    >
                      Send Reset Link
                    </button>
                  </div>

                  <div className="text-center">
                    <Link 
                      to="/signin" 
                      className="text-sm font-medium text-blue-400 hover:text-blue-300 transition-colors duration-200"
                    >
                      Back to Sign In
                    </Link>
                  </div>
                </form>
              ) : (
                <div className="text-center space-y-6">
                  <div className="rounded-full bg-green-500/20 p-3 w-16 h-16 mx-auto flex items-center justify-center">
                    <svg className="w-8 h-8 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-white">Check your email</h3>
                    <p className="mt-2 text-sm text-gray-400">
                      We&apos;ve sent a password reset link to {email}
                    </p>
                  </div>
                  <div>
                    <Link 
                      to="/signin" 
                      className="text-sm font-medium text-blue-400 hover:text-blue-300 transition-colors duration-200"
                    >
                      Return to Sign In
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </Page>
  );
};

export default ForgotPasswordPage; 