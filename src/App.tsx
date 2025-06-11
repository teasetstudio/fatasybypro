import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { FramesProvider } from './context/FramesContext';
import { AssetProvider } from './context/AssetContext';
import { TaskProvider } from './context/TaskContext';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import HomePage from './pages/HomePage';
import StoryboardPage from './pages/StoryboardPage';
import PreviewPage from './pages/PreviewPage';
import MenuPage from './pages/MenuPage';
import AssetManager from './pages/AssetManager';
import TaskBoardPage from './pages/TaskBoardPage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import WelcomePage from './pages/WelcomePage';
import SignInPage from './pages/SignInPage';
import SignUpPage from './pages/SignUpPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import CookiePolicyPage from './pages/CookiePolicyPage';
import PrivacyPolicyPage from './pages/PrivacyPolicyPage';
import TermsOfServicePage from './pages/TermsOfServicePage';
import UserSettingsPage from './pages/UserSettingsPage';
import ConsultationPage from './pages/ConsultationPage';
import EmailVerificationPage from './pages/EmailVerificationPage';
import OrganizationDashboard from './pages/OrganizationDashboard';
import OrganizationDetailsPage from './pages/OrganizationDetailsPage';
import ProjectDetailsPage from './pages/ProjectDetailsPage';
import ProjectStoryboardPage from './pages/ProjectStoryboardPage';

const App: React.FC = () => {
  return (
    <Router>
      <AuthProvider>
        <FramesProvider>
          <AssetProvider>
            <TaskProvider>
              <Routes>
                <Route path="/" element={<WelcomePage />} />
                <Route path="/home" element={<HomePage />} />
                <Route path="/menu" element={<MenuPage />} />
                <Route path="/storyboard" element={<StoryboardPage />} />
                <Route path="/storyboard/preview" element={<PreviewPage />} />
                <Route path="/assets" element={<AssetManager />} />
                <Route path="/tasks" element={<TaskBoardPage />} />
                <Route path="/about" element={<AboutPage />} />
                <Route path="/contact" element={<ContactPage />} />
                <Route path="/signin" element={<SignInPage />} />
                <Route path="/signup" element={<SignUpPage />} />
                <Route path="/forgot-password" element={<ForgotPasswordPage />} />
                <Route path="/cookie-policy" element={<CookiePolicyPage />} />
                <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
                <Route path="/terms-of-service" element={<TermsOfServicePage />} />
                <Route path="/user-settings" element={<UserSettingsPage />} />
                <Route path="/consultation" element={<ConsultationPage />} />
                <Route path="/verify-email" element={<EmailVerificationPage />} />
                
                {/* Protected Organization Routes */}
                <Route
                  path="/organizations"
                  element={
                    <ProtectedRoute>
                      <OrganizationDashboard />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/organizations/:id"
                  element={
                    <ProtectedRoute>
                      <OrganizationDetailsPage />
                    </ProtectedRoute>
                  }
                />

                {/* Protected Project Routes */}
                <Route
                  path="/projects/:id"
                  element={
                    <ProtectedRoute>
                      <ProjectDetailsPage />
                    </ProtectedRoute>
                  }
                />

                {/* Project Storyboard Route */}
                <Route
                  path="/projects/:id/storyboard"
                  element={
                    <ProtectedRoute>
                      <ProjectStoryboardPage />
                    </ProtectedRoute>
                  }
                />
              </Routes>
            </TaskProvider>
          </AssetProvider>
        </FramesProvider>
      </AuthProvider>
    </Router>
  );
};

export default App;
