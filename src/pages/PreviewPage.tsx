import { Link } from 'react-router-dom';
import { useFrames } from '../context/FramesContext';
import AppPage from '../components/layout/AppPage';

const PreviewPage = () => {
  const { frames } = useFrames();

  return (
    <AppPage title="Preview">
      <div className="min-h-screen bg-gray-100">
        {/* Header */}
        <div className="bg-white shadow-md w-full sticky top-0 z-20">
          <div className="container mx-auto px-4 py-3 flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <Link to="/" className="text-gray-600 hover:text-gray-800">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
              </Link>
              <h1 className="text-2xl font-bold text-gray-800 mb-3 md:mb-0">Storyboard Preview</h1>
            </div>
            <Link
              to="/storyboard"
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition duration-200"
            >
              Back to Editor
            </Link>
          </div>
        </div>

        {/* Main Content */}
        <div className="container mx-auto p-4 mt-8">
          <div className="max-w-6xl mx-auto">
            {frames.length === 0 ? (
              <div className="bg-white rounded-lg shadow-lg p-8 text-center">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">No Frames Yet</h2>
                <p className="text-gray-600 mb-6">
                  Start creating your storyboard by adding some frames in the drawing editor.
                </p>
                <Link
                  to="/storyboard"
                  className="inline-block px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-200"
                >
                  Go to Storyboard Editor
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {frames.map((frame, index) => (
                  <div key={index} className="bg-white rounded-lg shadow-lg overflow-hidden">
                    <div className="p-4 bg-gray-50 border-b">
                      <h3 className="text-lg font-semibold text-gray-800">Frame {index + 1}</h3>
                    </div>
                    <div className="p-4">
                      <div className="aspect-w-16 aspect-h-9">
                        <img
                          src={frame.image || ''}
                          alt={`Frame ${index + 1}`}
                          className="w-full h-full object-contain"
                        />
                      </div>
                      {frame.description && (
                        <p className="mt-4 text-gray-600">{frame.description}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </AppPage>
  );
};

export default PreviewPage; 