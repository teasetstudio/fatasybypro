import React, { useRef, useEffect, useState, useCallback } from 'react';
import CanvasDraw from 'react-canvas-draw';
import { IFrame } from './types';
import { useFrames } from '../context/FramesContext';
import { useAssets } from '../context/AssetContext';
import { useTasks } from '../context/TaskContext';
import { useToast } from '../context/ToastContext';
import { AssetType, AssetStatus } from '../types/asset';
import { TaskStatus } from '../types/task';
import FrameAssetAnalyzer from './FrameAssetAnalyzer';
import CreateAssetModal from './CreateAssetModal';
import ConfirmationModal from './ConfirmationModal';
import debounce from 'lodash.debounce';

interface FrameProps {
  frame: IFrame;
  index: number;
  brushColor: string;
  brushRadius: number;
  brushSmoothness: number;
  onPreview: (id: string) => void;
}

interface Dependency {
  id: string;
  sourceAssetId: string;
  targetAssetId: string;
  relationshipType: string;
  createdAt: Date;
  updatedAt: Date;
}

const Frame = ({
  frame,
  index,
  brushColor,
  brushRadius,
  brushSmoothness,
  onPreview,
}: FrameProps) => {
  const { currentAspectRatio, updateFrame, deleteFrame, uploadImage, deleteImage, notSavedFrameIds, flushDebouncedSaveFrame } = useFrames();
  const { assets, dependencies, addDependency, removeDependency, addAsset } = useAssets();
  const { tasks, addTask } = useTasks();
  const { showToast } = useToast();
  const canvasRef = useRef<CanvasDraw | null>(null);
  const savedDataRef = useRef<string>(undefined);
  const imageRef = useRef<string | null>(null);
  const [localDescription, setLocalDescription] = useState(frame.description);
  const [selectedAssetType, setSelectedAssetType] = useState<AssetType | 'all'>('all');
  const [isAssetSelectorOpen, setIsAssetSelectorOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [isAssignTaskModalOpen, setIsAssignTaskModalOpen] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskDescription, setNewTaskDescription] = useState('');
  const [newTaskPriority, setNewTaskPriority] = useState<'High' | 'Medium' | 'Low'>('Medium');
  const [newTaskDueDate, setNewTaskDueDate] = useState('');

  const [isBackgroundImage, setIsBackgroundImage] = useState(false);
  const [isImageLoading, setIsImageLoading] = useState(false);
  const [isDrawing, setIsDrawing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isDeletingImage, setIsDeletingImage] = useState(false);

  // Get assigned assets for this frame
  const assignedAssets = assets.filter(asset => 
    dependencies.some((dep: Dependency) => 
      dep.sourceAssetId === asset.id && 
      dep.targetAssetId === frame.id && 
      dep.relationshipType === 'used_in'
    )
  );

  // Filter assets based on selected type and exclude already assigned ones
  const filteredAssets = (selectedAssetType === 'all' 
    ? assets 
    : assets.filter(asset => asset.type === selectedAssetType)
  ).filter(asset => !assignedAssets.some(assigned => assigned.id === asset.id));

  // Get tasks associated with this frame
  const frameTasks = tasks.filter(task => 
    dependencies.some((dep: Dependency) => 
      dep.sourceAssetId === task.id && 
      dep.targetAssetId === frame.id && 
      dep.relationshipType === 'task_in'
    )
  );

  // Get tasks that are not already assigned to this frame
  const availableTasks = tasks.filter(task => 
    !dependencies.some((dep: Dependency) => 
      dep.sourceAssetId === task.id && 
      dep.targetAssetId === frame.id && 
      dep.relationshipType === 'task_in'
    )
  );

  const handleAssetAssign = (assetId: string) => {
    addDependency(assetId, frame.id, 'used_in');
    setIsAssetSelectorOpen(false);
  };

  const handleAssetUnassign = (assetId: string) => {
    removeDependency(assetId, frame.id);
  };

  const handleClear = () => {
    if (canvasRef.current) {
      canvasRef.current.clear();
      // save data is empty after clear()
      const savedData = canvasRef.current.getSaveData();
      savedDataRef.current = savedData;
      imageRef.current = null;
      updateFrame(frame.id, { image: null, canvas: canvasRef.current });
      setIsBackgroundImage(false);
    }
  };

  const handleDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newDescription = e.target.value;
    setLocalDescription(newDescription);
    updateFrame(frame.id, { description: newDescription });
  };

  const handleUndo = () => {
    if (canvasRef.current) {
      canvasRef.current.undo();
      updateFrame(frame.id, { canvas: canvasRef.current });
    }
  };

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Save current drawing state before changing background
      if (canvasRef.current) {
        savedDataRef.current = canvasRef.current.getSaveData();
      }
      // set to false to force a re-render
      setIsBackgroundImage(false);
      setIsImageLoading(true);

      try {
        const imageUrl = await uploadImage(file);
        
        imageRef.current = imageUrl;
        updateFrame(frame.id, { image: imageUrl, canvas: canvasRef.current });
        setIsBackgroundImage(true);
      } catch (error: any) {
        // Show user-friendly error message
        const errorMessage = error.message || 'Failed to upload image';
        showToast(errorMessage, 'error');
        
        // Reset loading state
        setIsBackgroundImage(false);
        imageRef.current = null;
      } finally {
        setIsImageLoading(false);
        // Reset the file input
        event.target.value = '';
      }
    }
  };

  const removeBackgroundImage = async () => {
    // Save current drawing state before removing background
    if (canvasRef.current) {
      savedDataRef.current = canvasRef.current.getSaveData();
    }
    
    setIsDeletingImage(true);
    try {
      // If there's an image URL, delete it from the server
      if (frame.image) {
        await deleteImage(frame.image);
      }
      
      // Clear background image state
      imageRef.current = null;
      setIsBackgroundImage(false);
      updateFrame(frame.id, { image: null, canvas: canvasRef.current });
    } finally {
      setIsDeletingImage(false);
    }
  };

  const handleDrawStart = () => {
    setIsDrawing(true);
  };

  const handleDrawEnd = useCallback(
    debounce(() => {
      setIsDrawing(false);
      if (canvasRef.current) {
        savedDataRef.current = canvasRef.current.getSaveData();
        updateFrame(frame.id, { canvas: canvasRef.current });
      }
    }, 1000),
    [frame.id, updateFrame]
  );

  // Cleanup debounced function on unmount
  useEffect(() => {
    return () => {
      handleDrawEnd.cancel();
    };
  }, [handleDrawEnd]);

  const saveCanvasData = () => {
    if (canvasRef.current) {
      const data = canvasRef.current.getSaveData();
      // setSavedDrawing(data);
      savedDataRef.current = data;
      updateFrame(frame.id, { canvas: canvasRef.current, image: imageRef.current });
      alert("Drawing saved to console. Check browser console for data.");
    }
  };

  const downloadDrawing = () => {
    if (canvasRef.current) {
      try {
        // Access the internal canvas element - this is implementation dependent
        // Using as any instead of @ts-ignore to work around type checking
        const canvasElement = (canvasRef.current as any).canvas?.drawing;
        
        if (canvasElement) {
          // Create a temporary link element
          const link = document.createElement('a');
          
          // Set the download attribute and file name
          link.download = 'canvas-drawing.png';
          
          // Convert the canvas to a data URL
          link.href = canvasElement.toDataURL('image/png');
          
          // Append to the document
          document.body.appendChild(link);
          
          // Trigger the download
          link.click();
          
          // Clean up
          document.body.removeChild(link);
          
          console.log("Drawing downloaded as PNG");
        } else {
          console.error("Canvas element not found");
          alert("Could not access canvas element to download");
        }
      } catch (error) {
        console.error("Error downloading drawing:", error);
        alert("Error downloading drawing. See console for details.");
      }
    }
  };

  const getImageSrc = () => {
    if (isBackgroundImage && imageRef.current) {
      return imageRef.current;
    }
    return undefined;
  };

  const handleCreateAsset = (name: string, type: AssetType, status: AssetStatus) => {
    addAsset({
      name,
      type,
      status,
      description: '',
    });
    setIsCreateModalOpen(false);
  };

  const handleCreateTask = () => {
    if (newTaskTitle.trim()) {
      const newTask = {
        title: newTaskTitle,
        description: newTaskDescription,
        status: 'TODO' as TaskStatus,
        priority: newTaskPriority,
        assignee: '',
        dueDate: newTaskDueDate,
      };
      
      const createdTask = addTask(newTask);
      addDependency(createdTask.id, frame.id, 'task_in');
      
      // Reset form
      setNewTaskTitle('');
      setNewTaskDescription('');
      setNewTaskPriority('Medium');
      setNewTaskDueDate('');
      setIsTaskModalOpen(false);
    }
  };

  const handleDeleteTask = (taskId: string) => {
    removeDependency(taskId, frame.id);
  };

  const handleAssignTask = (taskId: string) => {
    addDependency(taskId, frame.id, 'task_in');
    setIsAssignTaskModalOpen(false);
  };

  useEffect(() => {
    if (imageRef.current !== frame.image) {
      imageRef.current = frame.image;
      // When frame's canvasData changes, load it into the canvas
      setIsBackgroundImage(false)
      setTimeout(() => {
        setIsBackgroundImage(true)
      }, 10)
    }
  }, [frame.image]);

  return (
    <div 
      className={`flex flex-col bg-white rounded-lg shadow-md p-4 relative ${currentAspectRatio.cardWidth} mb-6`}
    >
      {/* Frame number and unsaved indicator container */}
      <div className="absolute -top-3 -left-3 flex items-center gap-1 z-10">
        <div className="w-8 h-8 rounded-full bg-blue-500 text-white flex items-center justify-center shadow-md">
          {index + 1}
        </div>
        {notSavedFrameIds.has(frame.id) && (
          <div className="relative">
            <button 
              onClick={() => flushDebouncedSaveFrame(frame.id)}
              disabled={notSavedFrameIds.get(frame.id) === 'saving'}
              className={`w-6 h-6 rounded-full text-white flex items-center justify-center shadow-md transition-colors group/indicator ${
                notSavedFrameIds.get(frame.id) === 'saving'
                  ? 'bg-yellow-400 cursor-not-allowed'
                  : 'bg-yellow-500 hover:bg-yellow-600 cursor-pointer'
              }`}
              title={notSavedFrameIds.get(frame.id) === 'saving' ? 'Saving changes...' : 'Click to save changes'}
            >
              {notSavedFrameIds.get(frame.id) === 'saving' ? (
                <svg className="animate-spin h-3 w-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
              )}
              {/* Tooltip */}
              <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 opacity-0 invisible group-hover/indicator:opacity-100 group-hover/indicator:visible transition-all duration-200 z-50">
                <div className="bg-gray-900 text-white text-xs rounded py-1 px-2 whitespace-nowrap">
                  {notSavedFrameIds.get(frame.id) === 'saving' 
                    ? 'Saving changes...' 
                    : 'Unsaved changes. Wait 1 min or click here to save changes'}
                </div>
                {/* Tooltip arrow */}
                <div className="absolute left-1/2 -translate-x-1/2 -bottom-1 w-2 h-2 bg-gray-900 transform rotate-45"></div>
              </div>
            </button>
          </div>
        )}
      </div>

      {/* Canvas controls */}
      <div className='flex justify-between'>
        <div>{isDrawing && <p className='text-sm text-gray-500'>Drawing...</p>}</div>

        <div className="mb-3 flex justify-end space-x-2">
          <button
            onClick={() => onPreview(frame.id)}
            className="bg-indigo-500 hover:bg-indigo-600 text-white px-2 py-1 rounded text-sm flex items-center"
            aria-label="Preview frame"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
              <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
              <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
            </svg>
          </button>
          <button
            onClick={handleUndo}
            className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-2 py-1 rounded text-sm"
            aria-label="Undo last stroke"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M7.707 3.293a1 1 0 010 1.414L5.414 7H11a7 7 0 017 7v2a1 1 0 11-2 0v-2a5 5 0 00-5-5H5.414l2.293 2.293a1 1 0 11-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
          </button>
          <button
            onClick={handleClear}
            className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-2 py-1 rounded text-sm"
            aria-label="Clear canvas"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
            </svg>
          </button>

          {/* Image Upload Controls */}
          {isBackgroundImage ? (
            <button
              onClick={removeBackgroundImage}
              disabled={isDeletingImage}
              className={`bg-red-100 hover:bg-red-200 text-red-700 px-2 py-1 rounded text-sm inline-flex items-center ${isDeletingImage ? 'opacity-50 cursor-not-allowed' : ''}`}
              aria-label="Remove background image"
            >
              {isDeletingImage ? (
                <svg className="animate-spin h-4 w-4 mr-1" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              )}
              {isDeletingImage ? 'Deleting...' : 'Delete Image'}
            </button>
          ) : (
            <label className="relative cursor-pointer group/upload">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
                aria-label="Upload background image (max 10MB)"
                disabled={isImageLoading}
              />
              <span className={`bg-blue-500 hover:bg-blue-600 text-white px-2 py-1 rounded text-sm inline-flex items-center ${isImageLoading ? 'opacity-50 cursor-not-allowed' : ''}`}>
                {isImageLoading ? (
                  <svg className="animate-spin h-4 w-4 mr-1" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                  </svg>
                )}
                {isImageLoading ? 'Uploading...' : 'Upload Image'}
              </span>
              {/* Tooltip */}
              <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 opacity-0 invisible group-hover/upload:opacity-100 group-hover/upload:visible transition-all duration-200 z-50">
                <div className="bg-gray-900 text-white text-xs rounded py-1 px-2 whitespace-nowrap">
                  Upload background image (max 10MB)
                </div>
                {/* Tooltip arrow */}
                <div className="absolute left-1/2 -translate-x-1/2 -bottom-1 w-2 h-2 bg-gray-900 transform rotate-45"></div>
              </div>
            </label>
          )}
          <button
            onClick={() => setIsDeleteModalOpen(true)}
            className="bg-red-100 hover:bg-red-200 text-red-700 px-2 py-1 rounded text-sm inline-flex items-center"
            aria-label="Delete frame"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        isOpen={isDeleteModalOpen}
        title="Delete Frame"
        message="Are you sure you want to delete this frame? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        onConfirm={async () => {
          setIsDeleting(true);
          try {
            await deleteFrame(frame.id);
            setIsDeleteModalOpen(false);
          } finally {
            setIsDeleting(false);
          }
        }}
        onCancel={() => setIsDeleteModalOpen(false)}
        variant="danger"
        isLoading={isDeleting}
      />

      {/* Canvas */}
      <div
        className="mb-3 border border-gray-200 rounded flex justify-center"
        onMouseDown={handleDrawStart}
        // onMouseUp={handleDrawEnd}
        // onMouseLeave={handleDrawEnd}
      >
        <CanvasDraw 
          key={`canvas-${frame.id}-${isBackgroundImage ? 'img' : 'no-img'}`}
          ref={canvasRef}
          className="rounded"
          brushColor={brushColor}
          brushRadius={brushRadius}
          lazyRadius={brushSmoothness}
          canvasWidth={currentAspectRatio.width}
          canvasHeight={currentAspectRatio.height}
          catenaryColor={brushColor}
          hideGrid
          immediateLoading
          imgSrc={getImageSrc()}
          // saveData={savedDataRef.current}
          saveData={frame.canvasData}
          onChange={handleDrawEnd}
        />
      </div>

      {/* Description */}
      <textarea
        value={localDescription}
        onChange={handleDescriptionChange}
        placeholder="Enter description"
        className="w-full h-24 p-2 border border-gray-300 rounded resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      />

      {/* Asset Assignment Section */}
      <div className="mt-4">
        <div className="flex justify-between items-center mb-2">
          <h4 className="text-sm font-semibold text-gray-700">Assigned Assets</h4>
          <div className="flex gap-2">
            <button
              onClick={() => setIsAssetSelectorOpen(!isAssetSelectorOpen)}
              className="text-sm text-blue-600 hover:text-blue-700"
          >
              {isAssetSelectorOpen ? 'Cancel' : 'Assign Asset'}
            </button>
            <button
              onClick={() => setIsCreateModalOpen(true)}
              className="text-sm text-blue-600 hover:text-blue-700"
            >
              Create Asset
            </button>
          </div>
        </div>

        {/* Asset Selector */}
        {isAssetSelectorOpen && (
          <div className="mb-4 p-3 bg-gray-50 rounded">
            <div className="mb-2">
              <select
                value={selectedAssetType}
                onChange={(e) => setSelectedAssetType(e.target.value as AssetType | 'all')}
                className="w-full p-2 border border-gray-300 rounded text-sm"
              >
                <option value="all">All Types</option>
                <option value="character">Characters</option>
                <option value="model">Models</option>
                <option value="animation">Animations</option>
                <option value="vfx">VFX</option>
                <option value="environment">Environments</option>
                <option value="prop">Props</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div className="max-h-40 overflow-y-auto">
              {filteredAssets.length > 0 ? (
                <>
                  {filteredAssets.map(asset => (
                    <div
                      key={asset.id}
                      className="flex items-center justify-between p-2 hover:bg-gray-100 rounded cursor-pointer"
                      onClick={() => handleAssetAssign(asset.id)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault();
                          handleAssetAssign(asset.id);
                        }
                      }}
                      role="button"
                      tabIndex={0}
                    >
                      <span className="text-sm">{asset.name}</span>
                      <span className="text-xs text-gray-500 capitalize">{asset.type}</span>
                    </div>
                  ))}
                  <div className="border-t border-gray-200 my-2"></div>
                </>
              ) : (
                <div className="text-center p-4">
                  <p className="text-gray-500 mb-3">No available assets to assign.</p>
                </div>
              )}
              <div className="text-center p-2">
                <button
                  onClick={() => setIsCreateModalOpen(true)}
                  className="w-full px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                >
                  Create New Asset
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Assigned Assets List */}
        <div className="space-y-2">
          {assignedAssets.map(asset => (
            <div key={asset.id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
              <div>
                <span className="text-sm font-medium">{asset.name}</span>
                <span className="text-xs text-gray-500 ml-2 capitalize">{asset.type}</span>
              </div>
              <button
                onClick={() => handleAssetUnassign(asset.id)}
                className="text-red-500 hover:text-red-600"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Create Asset Modal */}
      <CreateAssetModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={handleCreateAsset}
        assetTypes={['character', 'model', 'animation', 'vfx', 'environment', 'prop', 'other']}
        defaultAssetType={selectedAssetType === 'all' ? 'character' : selectedAssetType as AssetType}
      />

      {/* Tasks Section */}
      <div className="mt-4">
        <div className="flex justify-between items-center mb-2">
          <h4 className="text-sm font-semibold text-gray-700">Tasks</h4>
          <div className="flex gap-2">
            <button
              onClick={() => setIsAssignTaskModalOpen(true)}
              className="text-sm text-blue-600 hover:text-blue-700"
            >
              Assign Task
            </button>
            <button
              onClick={() => setIsTaskModalOpen(true)}
              className="text-sm text-blue-600 hover:text-blue-700"
            >
              Create Task
            </button>
          </div>
        </div>

        {/* Task List */}
        <div className="space-y-2">
          {frameTasks.map(task => (
            <div key={task.id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">{task.title}</span>
                  <span className={`text-xs px-2 py-1 rounded ${
                    task.priority === 'High' ? 'bg-red-100 text-red-700' :
                    task.priority === 'Medium' ? 'bg-yellow-100 text-yellow-700' :
                    'bg-green-100 text-green-700'
                  }`}>
                    {task.priority}
                  </span>
                  <span className={`text-xs px-2 py-1 rounded ${
                    task.status === 'TODO' ? 'bg-gray-100 text-gray-700' :
                    task.status === 'IN_PROGRESS' ? 'bg-blue-100 text-blue-700' :
                    'bg-green-100 text-green-700'
                  }`}>
                    {task.status}
                  </span>
                </div>
                {task.description && (
                  <p className="text-xs text-gray-500 mt-1">{task.description}</p>
                )}
                {task.dueDate && (
                  <p className="text-xs text-gray-500 mt-1">Due: {task.dueDate}</p>
                )}
              </div>
              <button
                onClick={() => handleDeleteTask(task.id)}
                className="text-red-500 hover:text-red-600 ml-2"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Assign Task Modal */}
      {isAssignTaskModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Assign Existing Task</h3>
            <div className="max-h-96 overflow-y-auto">
              {availableTasks.length > 0 ? (
                <div className="space-y-2">
                  {availableTasks.map(task => (
                    <div
                      key={task.id}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded hover:bg-gray-100 cursor-pointer"
                      onClick={() => handleAssignTask(task.id)}
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium">{task.title}</span>
                          <span className={`text-xs px-2 py-1 rounded ${
                            task.priority === 'High' ? 'bg-red-100 text-red-700' :
                            task.priority === 'Medium' ? 'bg-yellow-100 text-yellow-700' :
                            'bg-green-100 text-green-700'
                          }`}>
                            {task.priority}
                          </span>
                          <span className={`text-xs px-2 py-1 rounded ${
                            task.status === 'TODO' ? 'bg-gray-100 text-gray-700' :
                            task.status === 'IN_PROGRESS' ? 'bg-blue-100 text-blue-700' :
                            'bg-green-100 text-green-700'
                          }`}>
                            {task.status}
                          </span>
                        </div>
                        {task.description && (
                          <p className="text-xs text-gray-500 mt-1">{task.description}</p>
                        )}
                        {task.dueDate && (
                          <p className="text-xs text-gray-500 mt-1">Due: {task.dueDate}</p>
                        )}
                      </div>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center p-4">
                  <p className="text-gray-500">No available tasks to assign.</p>
                </div>
              )}
            </div>
            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setIsAssignTaskModalOpen(false)}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Create Task Modal */}
      {isTaskModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Create New Task</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Title</label>
                <input
                  type="text"
                  value={newTaskTitle}
                  onChange={(e) => setNewTaskTitle(e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  placeholder="Enter task title"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Description</label>
                <textarea
                  value={newTaskDescription}
                  onChange={(e) => setNewTaskDescription(e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  placeholder="Enter task description"
                  rows={3}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Priority</label>
                <select
                  value={newTaskPriority}
                  onChange={(e) => setNewTaskPriority(e.target.value as 'High' | 'Medium' | 'Low')}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                >
                  <option value="High">High</option>
                  <option value="Medium">Medium</option>
                  <option value="Low">Low</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Due Date</label>
                <input
                  type="date"
                  value={newTaskDueDate}
                  onChange={(e) => setNewTaskDueDate(e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
            </div>
            <div className="mt-6 flex justify-end space-x-3">
              <button
                onClick={() => setIsTaskModalOpen(false)}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateTask}
                className="px-4 py-2 text-white bg-blue-600 rounded hover:bg-blue-700 transition-colors"
              >
                Create Task
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Asset Analysis */}
      <FrameAssetAnalyzer frame={frame} />
    </div>
  );
};

export default Frame;
