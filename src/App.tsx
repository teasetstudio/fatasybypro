import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { StoryboardProvider } from './context/StoryboardContext';
import { AssetProvider } from './context/AssetContext';
import { TaskProvider } from './context/TaskContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { OrganizationProvider } from './context/OrganizationContext';
import { ToastProvider } from './context/ToastContext';
import HomePage from './pages/HomePage';
import AssetManager from './pages/AssetManager';
import TaskBoardPage from './pages/TaskBoardPage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import WelcomePage from './pages/WelcomePage';
import SignInPage from './pages/SignInPage';
import SignUpPage from './pages/SignUpPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
// import CookiePolicyPage from './pages/CookiePolicyPage';
// import PrivacyPolicyPage from './pages/PrivacyPolicyPage';
// import TermsOfServicePage from './pages/TermsOfServicePage';
import UserSettingsPage from './pages/UserSettingsPage';
// import ConsultationPage from './pages/ConsultationPage';
import EmailVerificationPage from './pages/EmailVerificationPage';
import OrganizationsPage from './pages/OrganizationsPage';
import OrganizationDetailsPage from './pages/OrganizationPage';
import ProjectDetailsPage from './pages/ProjectPage';
import StoryboardPage from './pages/StoryboardPage';
import ProjectsPage from './pages/ProjectsPage';
import DashboardLayout from './components/layouts/DashboardLayout';
import DashboardPage from './pages/DashboardPage';

const AuthenticatedContent = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/signin" replace />;
  }

  return (
    <OrganizationProvider>
      <StoryboardProvider>
        <AssetProvider>
          <TaskProvider>
            {children}
          </TaskProvider>
        </AssetProvider>
      </StoryboardProvider>
    </OrganizationProvider>
  );
};

const App: React.FC = () => {
  return (
    <Router>
      <AuthProvider>
        <ToastProvider>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<WelcomePage />} />
            <Route path="/home" element={<HomePage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/signin" element={<SignInPage />} />
            <Route path="/signup" element={<SignUpPage />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
            <Route path="/verify-email" element={<EmailVerificationPage />} />

            {/* Protected Routes */}
            <Route
              path="/dashboard"
              element={
                <AuthenticatedContent>
                  <DashboardLayout />
                </AuthenticatedContent>
              }
            >
              <Route index element={<DashboardPage />} />
              <Route path="organizations" element={<OrganizationsPage />} />
              <Route path="organizations/:id" element={<OrganizationDetailsPage />} />
              <Route path="projects" element={<ProjectsPage />} />
              <Route path="projects/:id" element={<ProjectDetailsPage />} />
              <Route path="projects/:id/storyboard" element={<StoryboardPage />} />
              <Route path="projects/:id/assets" element={<AssetManager />} />
              <Route path="projects/:id/tasks" element={<TaskBoardPage />} />
              <Route path="user-settings" element={<UserSettingsPage />} />
            </Route>

            {/* Redirect root to dashboard for authenticated users */}
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </ToastProvider>
      </AuthProvider>
    </Router>
  );
};

export default App;
