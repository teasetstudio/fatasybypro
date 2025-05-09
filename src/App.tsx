import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { FramesProvider } from './context/FramesContext';
import { AssetProvider } from './context/AssetContext';
import { TaskProvider } from './context/TaskContext';
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

const App: React.FC = () => {
  return (
    <Router>
      <FramesProvider>
        <AssetProvider>
          <TaskProvider>
            <Routes>
              <Route path="/" element={<WelcomePage />} />
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
            </Routes>
          </TaskProvider>
        </AssetProvider>
      </FramesProvider>
    </Router>
  );
};

export default App;
