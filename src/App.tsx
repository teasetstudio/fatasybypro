import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { FramesProvider } from './context/FramesContext';
import { AssetProvider } from './context/AssetContext';
import { TaskProvider } from './context/TaskContext';
import StoryboardPage from './pages/StoryboardPage';
import PreviewPage from './pages/PreviewPage';
import HomePage from './pages/HomePage';
import AssetManager from './pages/AssetManager';
import TaskBoardPage from './pages/TaskBoardPage';

const App = () => {
  return (
    <Router>
      <FramesProvider>
        <AssetProvider>
          <TaskProvider>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/storyboard" element={<StoryboardPage />} />
              <Route path="/storyboard/preview" element={<PreviewPage />} />
              <Route path="/assets" element={<AssetManager />} />
              <Route path="/tasks" element={<TaskBoardPage />} />
            </Routes>
          </TaskProvider>
        </AssetProvider>
      </FramesProvider>
    </Router>
  );
};

export default App;
