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
import HomePage from './pages/HomePage1';

const App = () => {
  return (
    <Router>
      <FramesProvider>
        <AssetProvider>
          <TaskProvider>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/menu" element={<MenuPage />} />
              <Route path="/storyboard" element={<StoryboardPage />} />
              <Route path="/storyboard/preview" element={<PreviewPage />} />
              <Route path="/assets" element={<AssetManager />} />
              <Route path="/tasks" element={<TaskBoardPage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/contact" element={<ContactPage />} />
            </Routes>
          </TaskProvider>
        </AssetProvider>
      </FramesProvider>
    </Router>
  );
};

export default App;
