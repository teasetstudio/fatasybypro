import React, { useState } from 'react';
import Page from '../components/layout/Page';
import useScrollToTop from '../hooks/useScrollToTop';

const UserSettingsPage: React.FC = () => {
  useScrollToTop();

  const [profileData, setProfileData] = useState({
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com'
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [preferencesData, setPreferencesData] = useState({
    notifications: {
      email: true,
      push: true,
      marketing: false
    },
    theme: 'dark'
  });

  const [errors, setErrors] = useState({
    firstName: '',
    lastName: '',
    email: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfileData(prev => ({
      ...prev,
      [name]: value
    }));
    if (errors[name as keyof typeof errors]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({
      ...prev,
      [name]: value
    }));
    if (errors[name as keyof typeof errors]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handlePreferencesChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      const checkbox = e.target as HTMLInputElement;
      setPreferencesData(prev => ({
        ...prev,
        notifications: {
          ...prev.notifications,
          [name]: checkbox.checked
        }
      }));
    } else {
      setPreferencesData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleProfileSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Profile form submitted:', profileData);
  };

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Password form submitted:', passwordData);
  };

  const handlePreferencesSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Preferences form submitted:', preferencesData);
  };

  return (
    <Page title="User Settings">
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
                  User Settings
                </h2>
              </div>

              <div className="space-y-12">
                {/* Profile Section */}
                <section className="space-y-6">
                  <h3 className="text-2xl font-semibold text-white border-b border-gray-700/50 pb-4">Profile Information</h3>
                  <form onSubmit={handleProfileSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label htmlFor="firstName" className="block text-sm font-medium text-gray-300 mb-1">
                          First Name
                        </label>
                        <input
                          type="text"
                          id="firstName"
                          name="firstName"
                          value={profileData.firstName}
                          onChange={handleProfileChange}
                          className="appearance-none rounded-lg relative block w-full px-4 py-3 border border-gray-700/50 bg-gray-800/50 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent transition-all duration-200"
                        />
                      </div>
                      <div>
                        <label htmlFor="lastName" className="block text-sm font-medium text-gray-300 mb-1">
                          Last Name
                        </label>
                        <input
                          type="text"
                          id="lastName"
                          name="lastName"
                          value={profileData.lastName}
                          onChange={handleProfileChange}
                          className="appearance-none rounded-lg relative block w-full px-4 py-3 border border-gray-700/50 bg-gray-800/50 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent transition-all duration-200"
                        />
                      </div>
                    </div>
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1">
                        Email Address
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={profileData.email}
                        onChange={handleProfileChange}
                        className="appearance-none rounded-lg relative block w-full px-4 py-3 border border-gray-700/50 bg-gray-800/50 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent transition-all duration-200"
                      />
                    </div>
                    <div className="flex justify-end">
                      <button
                        type="submit"
                        className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium rounded-lg hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all duration-200"
                      >
                        Update Profile
                      </button>
                    </div>
                  </form>
                </section>

                {/* Security Section */}
                <section className="space-y-6">
                  <h3 className="text-2xl font-semibold text-white border-b border-gray-700/50 pb-4">Security</h3>
                  <form onSubmit={handlePasswordSubmit} className="space-y-6">
                    <div>
                      <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-300 mb-1">
                        Current Password
                      </label>
                      <input
                        type="password"
                        id="currentPassword"
                        name="currentPassword"
                        value={passwordData.currentPassword}
                        onChange={handlePasswordChange}
                        className="appearance-none rounded-lg relative block w-full px-4 py-3 border border-gray-700/50 bg-gray-800/50 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent transition-all duration-200"
                      />
                    </div>
                    <div>
                      <label htmlFor="newPassword" className="block text-sm font-medium text-gray-300 mb-1">
                        New Password
                      </label>
                      <input
                        type="password"
                        id="newPassword"
                        name="newPassword"
                        value={passwordData.newPassword}
                        onChange={handlePasswordChange}
                        className="appearance-none rounded-lg relative block w-full px-4 py-3 border border-gray-700/50 bg-gray-800/50 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent transition-all duration-200"
                      />
                    </div>
                    <div>
                      <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-300 mb-1">
                        Confirm New Password
                      </label>
                      <input
                        type="password"
                        id="confirmPassword"
                        name="confirmPassword"
                        value={passwordData.confirmPassword}
                        onChange={handlePasswordChange}
                        className="appearance-none rounded-lg relative block w-full px-4 py-3 border border-gray-700/50 bg-gray-800/50 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent transition-all duration-200"
                      />
                    </div>
                    <div className="flex justify-end">
                      <button
                        type="submit"
                        className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium rounded-lg hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all duration-200"
                      >
                        Update Password
                      </button>
                    </div>
                  </form>
                </section>

                {/* Preferences Section */}
                <section className="space-y-6">
                  <h3 className="text-2xl font-semibold text-white border-b border-gray-700/50 pb-4">Preferences</h3>
                  <form onSubmit={handlePreferencesSubmit} className="space-y-6">
                    <div className="space-y-4">
                      <h4 className="text-lg font-medium text-white">Notifications</h4>
                      <div className="space-y-3">
                        <label className="flex items-center space-x-3">
                          <input
                            type="checkbox"
                            name="email"
                            checked={preferencesData.notifications.email}
                            onChange={handlePreferencesChange}
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-700 rounded bg-gray-800/50"
                          />
                          <span className="text-gray-300">Email Notifications</span>
                        </label>
                        <label className="flex items-center space-x-3">
                          <input
                            type="checkbox"
                            name="push"
                            checked={preferencesData.notifications.push}
                            onChange={handlePreferencesChange}
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-700 rounded bg-gray-800/50"
                          />
                          <span className="text-gray-300">Push Notifications</span>
                        </label>
                        <label className="flex items-center space-x-3">
                          <input
                            type="checkbox"
                            name="marketing"
                            checked={preferencesData.notifications.marketing}
                            onChange={handlePreferencesChange}
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-700 rounded bg-gray-800/50"
                          />
                          <span className="text-gray-300">Marketing Communications</span>
                        </label>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h4 className="text-lg font-medium text-white">Theme</h4>
                      <select
                        name="theme"
                        value={preferencesData.theme}
                        onChange={handlePreferencesChange}
                        className="appearance-none rounded-lg relative block w-full px-4 py-3 border border-gray-700/50 bg-gray-800/50 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent transition-all duration-200"
                      >
                        <option value="dark">Dark</option>
                        <option value="light">Light</option>
                        <option value="system">System</option>
                      </select>
                    </div>

                    <div className="flex justify-end">
                      <button
                        type="submit"
                        className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium rounded-lg hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all duration-200"
                      >
                        Save Preferences
                      </button>
                    </div>
                  </form>
                </section>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Page>
  );
};

export default UserSettingsPage; 