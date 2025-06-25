import React, { useRef, useEffect, useState, useCallback } from 'react';
import CanvasDraw from 'react-canvas-draw';
import { IShot } from '../types';
import { useStoryboard } from '../context/StoryboardContext';
import { useToast } from '../context/ToastContext';
import ConfirmationModal from './ConfirmationModal';
import debounce from 'lodash.debounce';

interface Props {
  shot: IShot;
  index: number;
  brushColor: string;
  brushRadius: number;
  brushSmoothness: number;
  onPreview: (id: string) => void;
}

const Shot = ({
  shot,
  index,
  brushColor,
  brushRadius,
  brushSmoothness,
  onPreview,
}: Props) => {
  const { statuses, updateShotStatus, currentAspectRatio, updateShot, deleteShot, uploadImage, deleteImage, notSavedShotIds, flushDebouncedSaveShot, getShotRefData } = useStoryboard();
  const { showToast } = useToast();
  const canvasRef = useRef<CanvasDraw | null>(null);
  const savedDataRef = useRef<string>(shot.canvasData);
  const imageRef = useRef<string | null>(null);
  const [localDescription, setLocalDescription] = useState(shot.description);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const [isBackgroundImage, setIsBackgroundImage] = useState(false);
  const [isImageLoading, setIsImageLoading] = useState(false);
  const [isDrawing, setIsDrawing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isDeletingImage, setIsDeletingImage] = useState(false);
  const [isStatusDropdownOpen, setIsStatusDropdownOpen] = useState(false);
  const statusDropdownRef = useRef<HTMLDivElement>(null);

  const handleClear = () => {
    if (canvasRef.current) {
      canvasRef.current.clear();
      imageRef.current = null;
      updateShot(shot.id, { image: null, canvas: canvasRef.current });
      setIsBackgroundImage(false);
    }
  };

  const handleDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newDescription = e.target.value;
    setLocalDescription(newDescription);
    updateShot(shot.id, { description: newDescription });
  };

  const handleUndo = () => {
    if (canvasRef.current) {
      canvasRef.current.undo();
      updateShot(shot.id, { canvas: canvasRef.current });
    }
  };

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // set to false to force a re-render
      setIsBackgroundImage(false);
      setIsImageLoading(true);

      try {
        const imageUrl = await uploadImage(file);
        
        imageRef.current = imageUrl;
        updateShot(shot.id, { image: imageUrl, canvas: canvasRef.current });
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
    setIsDeletingImage(true);
    try {
      // If there's an image URL, delete it from the server
      if (shot.image) {
        await deleteImage(shot.image);
      }
      
      // Clear background image state
      imageRef.current = null;
      setIsBackgroundImage(false);
      updateShot(shot.id, { image: null, canvas: canvasRef.current });
    } finally {
      setIsDeletingImage(false);
    }
  };

  const handleDrawStart = () => {
    setIsDrawing(true);
  };

  const debouncedHandleDrawEnd = useCallback(debounce(() => {
    if (canvasRef.current) {
      updateShot(shot.id, { canvas: canvasRef.current });
    }
  }, 500), [shot.id, updateShot]);

  const handleDrawEnd = () => {
    setIsDrawing(false);
    debouncedHandleDrawEnd()
  };

  const handleStatusSelect = async (statusId: string | null) => {
    try {
      await updateShotStatus(shot.id, statusId);
      setIsStatusDropdownOpen(false);
    } catch (error) {
      console.error('Error updating shot status:', error);
    }
  };

  const getDropdownPosition = () => {
    if (!statusDropdownRef.current) return 'bottom';
    
    const rect = statusDropdownRef.current.getBoundingClientRect();
    const viewportHeight = window.innerHeight;
    const dropdownHeight = 200; // Approximate height of dropdown
    
    // Check if there's enough space below
    const spaceBelow = viewportHeight - rect.bottom;
    const spaceAbove = rect.top;
    
    return spaceBelow >= dropdownHeight || spaceBelow > spaceAbove ? 'bottom' : 'top';
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

  useEffect(() => {
    if (imageRef.current !== shot.image) {
      imageRef.current = shot.image;
      // When shot's canvasData changes, load it into the canvas
      setIsBackgroundImage(false)
      setTimeout(() => {
        setIsBackgroundImage(true)
      }, 10)
    }
  }, [shot.image]);

  // Cleanup debounced function on unmount
  useEffect(() => {
    return () => {
      debouncedHandleDrawEnd.cancel();
    };
  }, [debouncedHandleDrawEnd]);

  // Close status dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (!target.closest('.status-dropdown-container')) {
        setIsStatusDropdownOpen(false);
      }
    };

    if (isStatusDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isStatusDropdownOpen]);

  useEffect(() => {
    if (canvasRef.current) {
      const savedData = getShotRefData(shot.id)?.canvasData;
      if (savedData) {
        savedDataRef.current = savedData;
        canvasRef.current.loadSaveData(savedData);
      }
    }
  }, []);

  return (
    <div 
      className={`flex flex-col bg-white rounded-lg shadow-md p-4 relative ${currentAspectRatio.cardWidth} mb-6`}
    >
      {/* Shot number and unsaved indicator container */}
      <div className="absolute -top-3 -left-3 flex items-center gap-1 z-10">
        <div className="w-8 h-8 rounded-full bg-blue-500 text-white flex items-center justify-center shadow-md">
          {index + 1}
        </div>
        {notSavedShotIds.has(shot.id) && (
          <div className="relative">
            <button 
              onClick={() => flushDebouncedSaveShot(shot.id)}
              disabled={notSavedShotIds.get(shot.id) === 'saving'}
              className={`w-6 h-6 rounded-full text-white flex items-center justify-center shadow-md transition-colors group/indicator ${
                notSavedShotIds.get(shot.id) === 'saving'
                  ? 'bg-yellow-400 cursor-not-allowed'
                  : 'bg-yellow-500 hover:bg-yellow-600 cursor-pointer'
              }`}
              title={notSavedShotIds.get(shot.id) === 'saving' ? 'Saving changes...' : 'Click to save changes'}
            >
              {notSavedShotIds.get(shot.id) === 'saving' ? (
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
                  {notSavedShotIds.get(shot.id) === 'saving' 
                    ? 'Saving changes...' 
                    : 'Unsaved changes. Wait 1 min or click here to save changes'}
                </div>
                {/* Tooltip arrow */}
                <div className="absolute left-1/2 -translate-x-1/2 -bottom-1 w-2 h-2 bg-gray-900 transform rotate-45"></div>
              </div>
            </button>
          </div>
        )}
        <div className='w-6 h-6 rounded-full relative group/status shadow-sm border border-gray-200 cursor-pointer status-dropdown-container' 
             onClick={() => setIsStatusDropdownOpen(!isStatusDropdownOpen)}
             ref={statusDropdownRef}>
          <div 
            className="w-full h-full rounded-full border-2 border-white"
            style={{ backgroundColor: shot.status?.color || '#6B7280' }}
          />
          {/* Status Dropdown */}
          {isStatusDropdownOpen && (
            <div className={`absolute left-1/2 -translate-x-1/2 bg-white border border-gray-200 rounded-lg shadow-lg z-50 min-w-32 status-dropdown-container ${
              getDropdownPosition() === 'bottom' 
                ? 'top-full mt-2' 
                : 'bottom-full mb-2'
            }`}>
              <div className="py-1">
                {/* No status option */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleStatusSelect(null);
                  }}
                  className="w-full px-3 py-2 text-left text-sm hover:bg-gray-100 flex items-center gap-2"
                >
                  <div className="w-3 h-3 rounded-full bg-gray-400"></div>
                  <span>No status</span>
                </button>
                {/* Available statuses */}
                {statuses.map((status) => (
                  <button
                    key={status.id}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleStatusSelect(status.id);
                    }}
                    className="w-full px-3 py-2 text-left text-sm hover:bg-gray-100 flex items-center gap-2"
                  >
                    <div 
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: status.color }}
                    ></div>
                    <span>{status.name}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
          {/* Tooltip */}
          <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 opacity-0 invisible group-hover/status:opacity-100 group-hover/status:visible transition-all duration-200 z-50">
            <div className="bg-gray-900 text-white text-xs rounded py-1 px-2 whitespace-nowrap">
              {shot.status?.name || 'No status'} (Click to change)
            </div>
            {/* Tooltip arrow */}
            <div className="absolute left-1/2 -translate-x-1/2 -bottom-1 w-2 h-2 bg-gray-900 transform rotate-45"></div>
          </div>
        </div>
      </div>

      {/* Canvas controls */}
      <div className='flex justify-between'>
        <div>{isDrawing && <p className='text-sm text-gray-500'>Drawing...</p>}</div>

        <div className="mb-3 flex justify-end space-x-2">
          <button
            onClick={() => onPreview(shot.id)}
            className="bg-indigo-500 hover:bg-indigo-600 text-white px-2 py-1 rounded text-sm flex items-center"
            aria-label="Preview shot"
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
            aria-label="Delete shot"
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
        title="Delete shot"
        message="Are you sure you want to delete this shot? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        onConfirm={async () => {
          setIsDeleting(true);
          try {
            await deleteShot(shot.id);
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
          key={`canvas-${shot.id}-${isBackgroundImage ? 'img' : 'no-img'}`}
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
          saveData={savedDataRef.current}
          // loadTimeOffset={10}
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
    </div>
  );
};

export default Shot;
