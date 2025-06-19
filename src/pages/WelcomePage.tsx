import React, { useRef, useState } from 'react';
import Page from '../components/layouts/Page';
import { Link } from 'react-router-dom';
import CanvasDraw from 'react-canvas-draw';
import { smoothnessOptions } from '../components/DrawingTools';
import { useAuth } from '../context/AuthContext';

const WelcomePage: React.FC = () => {
  const { isAuthenticated, user } = useAuth();
  const canvasRef = useRef<CanvasDraw | null>(null);
  const [description, setDescription] = useState('');
  const [brushColor, setBrushColor] = useState('#000000');
  const [brushRadius, setBrushRadius] = useState(2);
  const [brushSmoothness, setBrushSmoothness] = useState(smoothnessOptions[1].value); // Default to medium smoothness
  const [isMouseOverCanvas, setIsMouseOverCanvas] = useState(false);

  const [backgroundImage, setBackgroundImage] = useState<string | null>(null);
  const [isBackgroundImage, setIsBackgroundImage] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [assets, setAssets] = useState<Array<{ id: string; name: string; type: string }>>([{ id: '1', name: 'Main Character', type: 'character' }]);
  const [tasks, setTasks] = useState<Array<{ 
    id: string; 
    name: string; 
    status: 'todo' | 'in-progress' | 'done';
    assetId?: string;
  }>>([{ id: '1', name: 'Model Main Character', status: 'in-progress', assetId: '1' }]);
  const [newAssetName, setNewAssetName] = useState('');
  const [newAssetType, setNewAssetType] = useState('character');
  const [newTaskName, setNewTaskName] = useState('');
  const [newTaskStatus, setNewTaskStatus] = useState<'todo' | 'in-progress' | 'done'>('todo');
  const [newTaskAssetId, setNewTaskAssetId] = useState<string>('');
  const [activeTab, setActiveTab] = useState<'assets' | 'tasks'>('assets');
  const savedDataRef = useRef<string | undefined>(undefined);

  const handleClear = () => {
    if (canvasRef.current) {
      canvasRef.current.clear();
    }
  };

  const handleUndo = () => {
    if (canvasRef.current) {
      canvasRef.current.undo();
    }
  };

  const handleAddAsset = () => {
    if (newAssetName.trim()) {
      setAssets([...assets, {
        id: Date.now().toString(),
        name: newAssetName,
        type: newAssetType
      }]);
      setNewAssetName('');
    }
  };

  const handleAddTask = () => {
    if (newTaskName.trim()) {
      setTasks([...tasks, {
        id: Date.now().toString(),
        name: newTaskName,
        status: newTaskStatus,
        assetId: newTaskAssetId || undefined
      }]);
      setNewTaskName('');
      setNewTaskAssetId('');
    }
  };

  const handleUpdateTaskStatus = (taskId: string, newStatus: 'todo' | 'in-progress' | 'done') => {
    setTasks(tasks.map(task => 
      task.id === taskId ? { ...task, status: newStatus } : task
    ));
  };

  const handleUpdateTaskAsset = (taskId: string, assetId: string) => {
    setTasks(tasks.map(task => 
      task.id === taskId ? { ...task, assetId: assetId || undefined } : task
    ));
  };

  const handleRemoveAsset = (assetId: string) => {
    setAssets(assets.filter(asset => asset.id !== assetId));
  };

  const handleRemoveTask = (taskId: string) => {
    setTasks(tasks.filter(task => task.id !== taskId));
  };

  const handleBackgroundImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Save current drawing state before changing background
      if (canvasRef.current) {
        savedDataRef.current = canvasRef.current.getSaveData();
      }
      // set to false to force a re-render
      setIsBackgroundImage(false);

      const reader = new FileReader();
      reader.onload = (e) => {
        const uploadedImage = e.target?.result as string;
        setBackgroundImage(uploadedImage);
        setIsBackgroundImage(true);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSetMouseOverCanvas = (isMouseOver: boolean) => {
    setIsMouseOverCanvas(isMouseOver);
  };

  const handleClearBackground = () => {
    // Save current drawing state before removing background
    if (canvasRef.current) {
      savedDataRef.current = canvasRef.current.getSaveData();
    }
    
    // Clear background image state
    setBackgroundImage(null);
    setIsBackgroundImage(false);
  };

  return (
    <Page title="Welcome">
      {/* Hero Section */}
      <div className="relative min-h-[100vh] flex items-center justify-center bg-black">
        <div 
          className="absolute inset-0 w-full h-full bg-cover bg-center bg-no-repeat opacity-80"
          style={{ backgroundImage: "url('/15.png')" }}
        />
        <div className="relative z-10 text-center px-6 py-12 bg-black/40 backdrop-blur-md rounded-2xl max-w-4xl mx-4">
          {isAuthenticated ? (
            <div className="space-y-6">
              <h1 className="text-4xl text-white">
                Hello, <span className="text-blue-400">{user?.name}</span>.
              </h1>
              <Link
                to="/dashboard/projects"
                className="inline-block px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
              >
                Go to Dashboard
              </Link>
            </div>
          ) : (
            <>
              <h1 className="text-6xl font-black text-white mb-6 drop-shadow-lg tracking-tight">
                Welcome to FantasyByPro
              </h1>
              <p className="text-xl text-gray-200 max-w-2xl mx-auto mb-8 leading-relaxed">
                The all-in-one platform for animation and film professionals. <br />
                <span className="font-semibold text-blue-400">Create. Organize. Collaborate. Succeed.</span>
              </p>
              <div className="flex flex-col items-center space-y-6">
                <div className="flex flex-col sm:flex-row items-center gap-4 w-full max-w-md">
                  <Link
                    to="/signup" 
                    className="w-full sm:w-auto px-10 py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl font-bold hover:from-blue-700 hover:to-blue-800 transition-all duration-200 text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                  >
                    Start Creating Now
                  </Link>
                  <Link
                    to="/user-settings" 
                    className="w-full sm:w-auto px-10 py-4 bg-white/10 text-white rounded-xl font-semibold hover:bg-white/20 transition-all duration-200 text-lg backdrop-blur-sm"
                  >
                    Sign In
                  </Link>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Try It Out Section */}
      <div className="bg-gray-900 py-24">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-center text-white mb-8">Try It Out</h2>
          <p className="text-xl text-gray-300 text-center mb-12 max-w-3xl mx-auto">
            Experience the power of FantasyByPro firsthand. Create a quick storyboard frame, add assets, and manage tasks to see how it works.
          </p>
          
          <div className="bg-gray-800 rounded-xl p-4 sm:p-8">
            <div className="flex justify-between items-center mb-6 flex-wrap gap-4">
              <h3 className="text-xl sm:text-2xl font-semibold text-white">Create Your First Frame</h3>
              <div className="flex flex-wrap gap-2 sm:gap-4">
                <div className="flex items-center space-x-2">
                  <label className="text-gray-300 text-sm">Color:</label>
                  <input
                    type="color"
                    value={brushColor}
                    onChange={(e) => setBrushColor(e.target.value)}
                    className="w-6 h-6 sm:w-8 sm:h-8 rounded cursor-pointer"
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <label className="text-gray-300 text-sm">Size:</label>
                  <input
                    type="range"
                    min="1"
                    max="100"
                    value={brushRadius}
                    onChange={(e) => setBrushRadius(Number(e.target.value))}
                    className="w-16 sm:w-24"
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <label className="text-gray-300 text-sm">Smoothness:</label>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={brushSmoothness}
                    onChange={(e) => setBrushSmoothness(Number(e.target.value))}
                    className="w-16 sm:w-24"
                  />
                </div>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleBackgroundImageUpload}
                  accept="image/*"
                  className="hidden"
                />
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="bg-gray-700 hover:bg-gray-600 text-white px-3 py-1 rounded text-sm flex items-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  Add Image
                </button>
                {backgroundImage && (
                  <button
                    onClick={handleClearBackground}
                    className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm flex items-center gap-2"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                    Remove Image
                  </button>
                )}
                <button
                  onClick={handleUndo}
                  className="bg-gray-700 hover:bg-gray-600 text-white px-2 py-1 rounded text-sm"
                >
                  Undo
                </button>
                <button
                  onClick={handleClear}
                  className="bg-gray-700 hover:bg-gray-600 text-white px-2 py-1 rounded text-sm"
                >
                  Clear
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-8">
              {/* Drawing Canvas */}
              <div className="lg:col-span-7 bg-gray-600 rounded-lg p-2 sm:p-4">
                <div 
                  className="w-full overflow-x-hidden relative"
                  onMouseEnter={() => handleSetMouseOverCanvas(true)}
                  onMouseLeave={() => handleSetMouseOverCanvas(false)}
                  style={{ cursor: isMouseOverCanvas ? 'crosshair' : 'default' }}
                >
                  <CanvasDraw
                    key={`canvas-${isBackgroundImage ? 'img' : 'no-img'}`}
                    ref={canvasRef}
                    brushColor={isMouseOverCanvas ? brushColor : 'rgba(255, 255, 255, 0)'}
                    brushRadius={isMouseOverCanvas ? brushRadius : 0}
                    loadTimeOffset={0}
                    lazyRadius={brushSmoothness}
                    canvasWidth={Math.min(810, window.innerWidth - 48)}
                    canvasHeight={Math.min(530, (window.innerWidth - 48) * 0.65)}
                    className="border border-gray-700 rounded bg-gray-400"
                    backgroundColor="rgb(217, 224, 229)"
                    immediateLoading
                    imgSrc={isBackgroundImage && backgroundImage ? backgroundImage : undefined}
                    saveData={savedDataRef.current}
                    style={{ cursor: isMouseOverCanvas ? 'crosshair' : 'default' }}
                  />
                </div>
              </div>

              {/* Description, Assets and Tasks */}
              <div className="lg:col-span-5 flex flex-col space-y-4 sm:space-y-8">
                {/* Description */}
                <div>
                  <label className="text-white mb-2 block text-sm sm:text-base">Frame Description</label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Describe your scene... (e.g., 'A wide shot of a medieval castle at sunset. The camera slowly pans to reveal a mysterious figure standing on the battlements.')"
                    className="w-full p-3 sm:p-4 bg-gray-700 text-white rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
                    rows={6}
                  />
                  <div className="mt-2 text-xs sm:text-sm text-gray-400">
                    <p>Tips for great descriptions:</p>
                    <ul className="list-disc list-inside mt-1 space-y-1">
                      <li>Include camera movement and angle</li>
                      <li>Describe key visual elements</li>
                      <li>Note important character actions</li>
                      <li>Mention lighting and atmosphere</li>
                    </ul>
                  </div>
                </div>

                {/* Assets and Tasks Tabs */}
                <div className="bg-gray-700 rounded-lg p-3 sm:p-4">
                  <div className="flex space-x-4 mb-4 border-b border-gray-600">
                    <button 
                      onClick={() => setActiveTab('assets')}
                      className={`px-3 sm:px-4 py-2 font-semibold transition-colors duration-200 text-sm sm:text-base ${
                        activeTab === 'assets'
                          ? 'text-white border-b-2 border-blue-500'
                          : 'text-gray-400 hover:text-white'
                      }`}
                    >
                      Assets
                    </button>
                    <button 
                      onClick={() => setActiveTab('tasks')}
                      className={`px-3 sm:px-4 py-2 font-semibold transition-colors duration-200 text-sm sm:text-base ${
                        activeTab === 'tasks'
                          ? 'text-white border-b-2 border-blue-500'
                          : 'text-gray-400 hover:text-white'
                      }`}
                    >
                      Tasks
                    </button>
                  </div>

                  {/* Assets Section */}
                  {activeTab === 'assets' && (
                    <div>
                      <div className="flex space-x-2 mb-4">
                        <input
                          type="text"
                          value={newAssetName}
                          onChange={(e) => setNewAssetName(e.target.value)}
                          placeholder="Asset name"
                          className="flex-grow p-2 bg-gray-600 text-white rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <select
                          value={newAssetType}
                          onChange={(e) => setNewAssetType(e.target.value)}
                          className="p-2 bg-gray-600 text-white rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="character">Character</option>
                          <option value="model">Model</option>
                          <option value="animation">Animation</option>
                          <option value="prop">Prop</option>
                          <option value="environment">Environment</option>
                          <option value="effect">VFX Effect</option>
                          <option value="other">Other</option>
                        </select>
                        <button
                          onClick={handleAddAsset}
                          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                        >
                          Add
                        </button>
                      </div>
                      <div className="space-y-2 max-h-40 overflow-y-auto">
                        {assets.map(asset => (
                          <div key={asset.id} className="flex items-center justify-between p-2 bg-gray-600 rounded">
                            <div>
                              <span className="text-white">{asset.name}</span>
                              <span className="text-gray-400 text-sm ml-2">({asset.type})</span>
                            </div>
                            <button
                              onClick={() => handleRemoveAsset(asset.id)}
                              className="text-red-400 hover:text-red-300"
                            >
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                              </svg>
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Tasks Section */}
                  {activeTab === 'tasks' && (
                    <div>
                      <div className="flex items-center gap-2 mb-4">
                        <input
                          type="text"
                          value={newTaskName}
                          onChange={(e) => setNewTaskName(e.target.value)}
                          placeholder="Task name"
                          className="flex-grow min-w-[300px] p-2 bg-gray-600 text-white rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <select
                          value={newTaskAssetId}
                          onChange={(e) => setNewTaskAssetId(e.target.value)}
                          className="w-24 p-2 bg-gray-600 text-white rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                        >
                          <option value="">No Asset</option>
                          {assets.map(asset => (
                            <option key={asset.id} value={asset.id}>
                              {asset.name} ({asset.type})
                            </option>
                          ))}
                        </select>
                        <select
                          value={newTaskStatus}
                          onChange={(e) => setNewTaskStatus(e.target.value as 'todo' | 'in-progress' | 'done')}
                          className="w-20 p-2 bg-gray-600 text-white rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                        >
                          <option value="todo">To Do</option>
                          <option value="in-progress">In Progress</option>
                          <option value="done">Done</option>
                        </select>
                        <button
                          onClick={handleAddTask}
                          className="bg-blue-600 text-white px-3 py-2 rounded hover:bg-blue-700 whitespace-nowrap text-sm"
                        >
                          Add
                        </button>
                      </div>
                      <div className="space-y-2 max-h-40 overflow-y-auto">
                        {tasks.map(task => (
                          <div key={task.id} className="p-3 bg-gray-600 rounded">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-2">
                                <span className="text-white">{task.name}</span>
                              </div>
                              <div className="flex items-center space-x-2">
                                <select
                                  value={task.assetId || ''}
                                  onChange={(e) => handleUpdateTaskAsset(task.id, e.target.value)}
                                  className="w-24 p-1 text-sm bg-gray-700 text-white rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                  <option value="">No Asset</option>
                                  {assets.map(asset => (
                                    <option key={asset.id} value={asset.id}>
                                      {asset.name} ({asset.type})
                                    </option>
                                  ))}
                                </select>
                                <select
                                  value={task.status}
                                  onChange={(e) => handleUpdateTaskStatus(task.id, e.target.value as 'todo' | 'in-progress' | 'done')}
                                  className={`p-1 text-sm rounded focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                                    task.status === 'todo' 
                                      ? 'bg-gray-500 text-white' 
                                      : task.status === 'in-progress'
                                      ? 'bg-blue-600 text-white'
                                      : 'bg-green-600 text-white'
                                  }`}
                                >
                                  <option value="todo">To Do</option>
                                  <option value="in-progress">In Progress</option>
                                  <option value="done">Done</option>
                                </select>
                                <button
                                  onClick={() => handleRemoveTask(task.id)}
                                  className="text-red-400 hover:text-red-300"
                                >
                                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                  </svg>
                                </button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="mt-8 text-center">
              <Link 
                to="/storyboard" 
                className="inline-block bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors duration-200"
              >
                Create Full Storyboard
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="bg-gray-900 py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-center text-white mb-16">Everything You Need for Your Creative Projects</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="p-8 bg-gray-800 rounded-xl hover:bg-gray-700 transition-colors duration-200">
              <div className="w-16 h-16 bg-blue-600 rounded-lg flex items-center justify-center mb-6">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-2xl font-semibold text-white mb-4">Storyboard Creation</h3>
              <p className="text-gray-300 text-lg mb-4">
                Create professional storyboards with our intuitive tools. Add scenes, characters, and notes to bring your vision to life.
              </p>
              <ul className="text-gray-300 space-y-2">
                <li className="flex items-center">
                  <svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Scene-by-scene visualization
                </li>
                <li className="flex items-center">
                  <svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Character and prop management
                </li>
                <li className="flex items-center">
                  <svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Timeline and shot planning
                </li>
              </ul>
            </div>

            <div className="p-8 bg-gray-800 rounded-xl hover:bg-gray-700 transition-colors duration-200">
              <div className="w-16 h-16 bg-blue-600 rounded-lg flex items-center justify-center mb-6">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <h3 className="text-2xl font-semibold text-white mb-4">Task Management</h3>
              <p className="text-gray-300 text-lg mb-4">
                Keep your project on track with our comprehensive task management system. Assign, track, and complete tasks efficiently.
              </p>
              <ul className="text-gray-300 space-y-2">
                <li className="flex items-center">
                  <svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Task assignment and tracking
                </li>
                <li className="flex items-center">
                  <svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Deadline management
                </li>
                <li className="flex items-center">
                  <svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Progress monitoring
                </li>
              </ul>
            </div>

            <div className="p-8 bg-gray-800 rounded-xl hover:bg-gray-700 transition-colors duration-200">
              <div className="w-16 h-16 bg-blue-600 rounded-lg flex items-center justify-center mb-6">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-2xl font-semibold text-white mb-4">Asset Management</h3>
              <p className="text-gray-300 text-lg mb-4">
                Organize and manage all your project assets in one central location. Keep your resources easily accessible and well-organized.
              </p>
              <ul className="text-gray-300 space-y-2">
                <li className="flex items-center">
                  <svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Centralized asset library
                </li>
                <li className="flex items-center">
                  <svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Version control
                </li>
                <li className="flex items-center">
                  <svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Quick search and filtering
                </li>
              </ul>
            </div>

            <div className="p-8 bg-gray-800 rounded-xl hover:bg-gray-700 transition-colors duration-200">
              <div className="w-16 h-16 bg-blue-600 rounded-lg flex items-center justify-center mb-6">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-2xl font-semibold text-white mb-4">Team Collaboration</h3>
              <p className="text-gray-300 text-lg mb-4">
                Work seamlessly with your team. Share ideas, provide feedback, and stay connected throughout the project lifecycle.
              </p>
              <ul className="text-gray-300 space-y-2">
                <li className="flex items-center">
                  <svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Real-time collaboration
                </li>
                <li className="flex items-center">
                  <svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Role-based access control
                </li>
                <li className="flex items-center">
                  <svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Communication tools
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Statistics Section */}
      <div className="bg-gray-800 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-4xl font-bold text-blue-400 mb-2">10K+</div>
              <div className="text-gray-300">Active Users</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-blue-400 mb-2">50K+</div>
              <div className="text-gray-300">Projects Created</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-blue-400 mb-2">1M+</div>
              <div className="text-gray-300">Assets Managed</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-blue-400 mb-2">98%</div>
              <div className="text-gray-300">Customer Satisfaction</div>
            </div>
          </div>
        </div>
      </div>

      {/* Testimonials Section */}
      <div className="bg-gray-900 py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-center text-white mb-16">What Our Users Say</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-gray-800 p-8 rounded-xl">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-xl">JD</div>
                <div className="ml-4">
                  <div className="text-white font-semibold">John Doe</div>
                  <div className="text-gray-400 text-sm">Animation Director</div>
                </div>
              </div>
              <p className="text-gray-300 italic">"FantasyByPro has revolutionized how we manage our animation projects. The storyboard tools are intuitive and the collaboration features are a game-changer."</p>
            </div>
            <div className="bg-gray-800 p-8 rounded-xl">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center text-white font-bold text-xl">AS</div>
                <div className="ml-4">
                  <div className="text-white font-semibold">Alice Smith</div>
                  <div className="text-gray-400 text-sm">VFX Supervisor</div>
                </div>
              </div>
              <p className="text-gray-300 italic">"The asset management system is incredible. We can now track all our VFX elements efficiently, and the team collaboration features have improved our workflow significantly."</p>
            </div>
            <div className="bg-gray-800 p-8 rounded-xl">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center text-white font-bold text-xl">RJ</div>
                <div className="ml-4">
                  <div className="text-white font-semibold">Robert Johnson</div>
                  <div className="text-gray-400 text-sm">Film Producer</div>
                </div>
              </div>
              <p className="text-gray-300 italic">"As a producer, I love how FantasyByPro helps us stay on schedule. The task management and progress tracking features are exactly what we needed."</p>
            </div>
          </div>
        </div>
      </div>

      {/* Pricing Section */}
      <div className="bg-gray-800 py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-center text-white mb-8">Simple, Transparent Pricing</h2>
          <p className="text-xl text-gray-300 text-center mb-16 max-w-3xl mx-auto">
            Choose the perfect plan for your needs. Whether you're an individual creator or a large studio, we have you covered.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-gray-900 p-8 rounded-xl border border-gray-700 relative">
              <div className="absolute top-0 right-0 bg-green-400 text-gray-900 px-4 py-1 rounded-bl-lg font-semibold">Best for Individuals</div>
              <h3 className="text-2xl font-bold text-white mb-4">Starter</h3>
              <div className="text-4xl font-bold text-white mb-6">$29<span className="text-gray-400 text-lg">/month</span></div>
              <ul className="space-y-4 mb-8">
                <li className="flex items-center text-gray-300">
                  <svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Up to 5 projects
                </li>
                <li className="flex items-center text-gray-300">
                  <svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Basic storyboard tools
                </li>
                <li className="flex items-center text-gray-300">
                  <svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  10GB storage
                </li>
                <li className="flex items-center text-gray-300">
                  <svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Single user
                </li>
              </ul>
              <Link to="/signup" className="block w-full text-center bg-gray-700 text-white py-3 rounded-lg hover:bg-gray-600 transition-colors duration-200">
                Get Started
              </Link>
            </div>
            <div className="bg-blue-600 p-8 rounded-xl transform scale-105 relative">
              <div className="absolute top-0 right-0 bg-yellow-400 text-gray-900 px-4 py-1 rounded-bl-lg font-semibold">Best for Small Teams</div>
              <h3 className="text-2xl font-bold text-white mb-4">Professional</h3>
              <div className="text-4xl font-bold text-white mb-6">$79<span className="text-blue-200 text-lg">/month</span></div>
              <ul className="space-y-4 mb-8">
                <li className="flex items-center text-white">
                  <svg className="w-5 h-5 text-yellow-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Unlimited projects
                </li>
                <li className="flex items-center text-white">
                  <svg className="w-5 h-5 text-yellow-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Advanced storyboard tools
                </li>
                <li className="flex items-center text-white">
                  <svg className="w-5 h-5 text-yellow-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  100GB storage
                </li>
                <li className="flex items-center text-white">
                  <svg className="w-5 h-5 text-yellow-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Up to 10 team members
                </li>
                <li className="flex items-center text-white">
                  <svg className="w-5 h-5 text-yellow-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Priority support
                </li>
              </ul>
              <Link to="/signup" className="block w-full text-center bg-white text-blue-600 py-3 rounded-lg hover:bg-blue-50 transition-colors duration-200">
                Get Started
              </Link>
            </div>
            <div className="bg-gray-900 p-8 rounded-xl border border-gray-700 relative">
              <div className="absolute top-0 right-0 bg-purple-400 text-gray-900 px-4 py-1 rounded-bl-lg font-semibold">Best for Large Studios</div>
              <h3 className="text-2xl font-bold text-white mb-4">Enterprise</h3>
              <div className="text-4xl font-bold text-white mb-6">Custom</div>
              <ul className="space-y-4 mb-8">
                <li className="flex items-center text-gray-300">
                  <svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Unlimited team members
                </li>
                <li className="flex items-center text-gray-300">
                  <svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Custom solutions & integrations
                </li>
                <li className="flex items-center text-gray-300">
                  <svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Unlimited storage
                </li>
                <li className="flex items-center text-gray-300">
                  <svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  24/7 dedicated support
                </li>
                <li className="flex items-center text-gray-300">
                  <svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Custom training & onboarding
                </li>
              </ul>
              <Link to="/consultation" className="block w-full text-center bg-gray-700 text-white py-3 rounded-lg hover:bg-gray-600 transition-colors duration-200">
                Contact Sales
              </Link>
            </div>
          </div>
          <div className="mt-8 text-center">
            <p className="text-gray-600 mb-4">
              Need a custom solution for your large team? Contact our sales team for personalized pricing and features.
            </p>
            <Link
              to="/consultation"
              className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium"
            >
              Schedule a consultation with our team
              <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gray-800 py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-white mb-8">Ready to Transform Your Creative Process?</h2>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Join thousands of creative professionals who trust FantasyByPro for their project management needs.
          </p>
          <Link to="/menu" className="bg-blue-600 text-white px-8 py-4 rounded-lg font-semibold hover:bg-blue-700 transition-colors duration-200 text-lg">
            Get Started Now
          </Link>
        </div>
      </div>
    </Page>
  );
};

export default WelcomePage;
