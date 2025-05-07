import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { FramesProvider } from './context/FramesContext';
import { AssetProvider } from './context/AssetContext';
import StoryboardPage from './pages/StoryboardPage';
import PreviewPage from './pages/PreviewPage';
import HomePage from './pages/HahaPage';
import AssetManager from './pages/AssetManager';

const App = () => {
  return (
    <Router>
      <FramesProvider>
        <AssetProvider>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/storyboard" element={<StoryboardPage />} />
            <Route path="/storyboard/preview" element={<PreviewPage />} />
            <Route path="/assets" element={<AssetManager />} />
          </Routes>
        </AssetProvider>
      </FramesProvider>
    </Router>
  );
};

export default App;
