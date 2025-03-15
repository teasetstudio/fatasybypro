// src/App.tsx
import React, { useState, useRef, useEffect, useCallback } from 'react';
import CanvasDraw from 'react-canvas-draw';
import { Dialog, Transition } from '@headlessui/react';

// Define color options
const colorOptions = [
  "#000000", // Black
  "#FF0000", // Red
  "#0000FF", // Blue
  "#008000", // Green
  "#FFA500", // Orange
  "#800080", // Purple
  "#FF69B4", // Pink
  "#A52A2A", // Brown
];

// Define brush size options
const brushSizes = [2, 4, 6, 8, 10];

// Define smoothness options
const smoothnessOptions = [
  { name: 'None', value: 0 },
  { name: 'Slight', value: 10 },
  { name: 'Medium', value: 30 },
  { name: 'High', value: 60 }
];

// Define aspect ratio options with adjusted card widths
const aspectRatios = [
  { name: '16:9', width: 420, height: 240, cardWidth: 'w-[450px]' }, // Wider card for 16:9
  { name: '4:3', width: 240, height: 180, cardWidth: 'w-64' },
  { name: '1:1', width: 230, height: 230, cardWidth: 'w-64' },
];

// Define a Frame interface
interface Frame {
  id: string;
  description: string;
  image: string | null;
  canvasData?: string;
}

// Helper function to create empty canvas data
const createEmptyCanvasData = (width: number, height: number) => {
  // Ensure width and height are valid numbers
  const validWidth = typeof width === 'number' && !isNaN(width) && width > 0 ? width : 400;
  const validHeight = typeof height === 'number' && !isNaN(height) && height > 0 ? height : 400;
  
  // Create a valid empty canvas data structure
  const emptyData = {
    lines: [],
    width: validWidth,
    height: validHeight
  };
  
  try {
    // Validate by parsing and stringifying
    return JSON.stringify(emptyData);
  } catch (error) {
    console.error("Error creating empty canvas data:", error);
    // Fallback to hardcoded string if JSON.stringify fails
    return '{"lines":[],"width":400,"height":400}';
  }
};

// Helper function to safely get canvas data
const safelyGetCanvasData = (canvas: CanvasDraw | null, width: number, height: number) => {
  if (!canvas) {
    return createEmptyCanvasData(width, height);
  }
  
  try {
    const saveData = canvas.getSaveData();
    
    // Validate that it's a non-empty string
    if (!saveData || saveData.trim() === '') {
      return createEmptyCanvasData(width, height);
    }
    
    // Validate JSON format
    try {
      const parsedData = JSON.parse(saveData);
      
      // Ensure the parsed data has the expected structure
      if (!parsedData.lines || !Array.isArray(parsedData.lines)) {
        console.error("Invalid canvas data structure from getSaveData");
        return createEmptyCanvasData(width, height);
      }
      
      return saveData;
    } catch (jsonError) {
      console.error("Error parsing JSON from getSaveData:", jsonError);
      return createEmptyCanvasData(width, height);
    }
  } catch (error) {
    console.error("Error getting canvas data:", error);
    return createEmptyCanvasData(width, height);
  }
};

// Helper function to safely load canvas data
const safelyLoadCanvasData = (canvas: CanvasDraw | null, saveData: string, width: number, height: number, immediate = false) => {
  if (!canvas) {
    return;
  }
  
  try {
    // Validate that it's a non-empty string
    if (!saveData || saveData.trim() === '') {
      console.log("Empty save data provided, using empty canvas");
      canvas.loadSaveData(createEmptyCanvasData(width, height), immediate);
      return;
    }
    
    // Validate JSON format
    try {
      const parsedData = JSON.parse(saveData);
      
      // Ensure the parsed data has the expected structure
      if (!parsedData.lines || !Array.isArray(parsedData.lines)) {
        console.error("Invalid canvas data structure, missing lines array");
        canvas.loadSaveData(createEmptyCanvasData(width, height), immediate);
        return;
      }
      
      // Ensure the width and height are present
      if (typeof parsedData.width !== 'number' || typeof parsedData.height !== 'number') {
        console.error("Invalid canvas data structure, missing width or height");
        canvas.loadSaveData(createEmptyCanvasData(width, height), immediate);
        return;
      }
      
      // If we got here, the data is valid
      canvas.loadSaveData(saveData, immediate);
    } catch (jsonError) {
      console.error("Error parsing JSON:", jsonError);
      console.error("Invalid JSON data:", saveData);
      canvas.loadSaveData(createEmptyCanvasData(width, height), immediate);
    }
  } catch (error) {
    console.error("Error loading canvas data:", error);
    try {
      canvas.loadSaveData(createEmptyCanvasData(width, height), immediate);
    } catch (fallbackError) {
      console.error("Critical error, even fallback failed:", fallbackError);
    }
  }
};

const App = () => {
  const [frames, setFrames] = useState<Frame[]>([]);
  const [currentBrushColor, setCurrentBrushColor] = useState("#000000");
  const [currentBrushRadius, setCurrentBrushRadius] = useState(2);
  const [currentAspectRatio, setCurrentAspectRatio] = useState(aspectRatios[0]); // Default to 16:9
  const [brushSmoothness, setBrushSmoothness] = useState(smoothnessOptions[2].value); // Default to medium smoothness
  const canvasRefs = useRef<{ [key: string]: CanvasDraw | null }>({});
  
  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedFrameIndex, setSelectedFrameIndex] = useState<number | null>(null);
  const [modalCanvasData, setModalCanvasData] = useState<string | null>(null);
  const modalCanvasRef = useRef<CanvasDraw | null>(null);

  // Use useCallback for addFrame to avoid dependency issues
  const addFrame = useCallback(() => {
    // Create a valid empty canvas data structure
    const emptyCanvasData = createEmptyCanvasData(currentAspectRatio.width, currentAspectRatio.height);
    
    setFrames(prevFrames => [...prevFrames, { 
      id: `frame-${prevFrames.length}`, 
      description: '', 
      image: null,
      canvasData: emptyCanvasData
    }]);
  }, [currentAspectRatio.width, currentAspectRatio.height]);

  // Initialize with one frame
  useEffect(() => {
    if (frames.length === 0) {
      addFrame();
    }
  }, [frames.length, addFrame]);

  const deleteFrame = (indexToDelete: number) => {
    // Don't allow deleting if it's the last frame
    if (frames.length <= 1) {
      return;
    }
    
    // Get the frame ID before deleting
    const frameIdToDelete = frames[indexToDelete].id;
    
    // If the preview modal is open for this frame, close it
    if (isModalOpen && selectedFrameIndex === indexToDelete) {
      closeModal();
    }
    
    // Create a new array without the frame to delete
    const updatedFrames = frames.filter((_, index) => index !== indexToDelete);
    
    // Update the frames state
    setFrames(updatedFrames);
    
    // Clean up the canvas ref for the deleted frame
    if (canvasRefs.current[frameIdToDelete]) {
      delete canvasRefs.current[frameIdToDelete];
    }
    
    console.log(`Deleted frame ${frameIdToDelete} at index ${indexToDelete}`);
  };

  const handleColorChange = (color: string) => {
    setCurrentBrushColor(color);
  };

  const handleBrushSizeChange = (size: number) => {
    setCurrentBrushRadius(size);
  };

  const handleSmoothnessChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const smoothness = parseInt(e.target.value);
    setBrushSmoothness(smoothness);
  };

  const handleAspectRatioChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedRatio = aspectRatios.find(ratio => ratio.name === e.target.value);
    if (selectedRatio) {
      // Save current canvas data before changing aspect ratio
      const updatedFrames = frames.map(frame => {
        const canvasRef = canvasRefs.current[frame.id];
        const canvasData = safelyGetCanvasData(canvasRef, selectedRatio.width, selectedRatio.height);
        
        return {
          ...frame,
          canvasData
        };
      });
      
      setFrames(updatedFrames);
      setCurrentAspectRatio(selectedRatio);
      
      // Need to give time for state to update before reloading canvas data
      setTimeout(() => {
        updatedFrames.forEach(frame => {
          const canvasRef = canvasRefs.current[frame.id];
          if (canvasRef && frame.canvasData) {
            safelyLoadCanvasData(canvasRef, frame.canvasData, selectedRatio.width, selectedRatio.height, true);
          }
        });
      }, 100);
    }
  };

  const clearCanvas = (index: number) => {
    const canvas = canvasRefs.current[frames[index].id];
    if (canvas) {
      canvas.clear();
    }
  };

  const undoCanvas = (index: number) => {
    const canvas = canvasRefs.current[frames[index].id];
    if (canvas) {
      canvas.undo();
    }
  };

  const openPreviewModal = (index: number) => {
    // Store the frame ID to ensure we're working with the correct frame
    const frameId = frames[index].id;
    const canvas = canvasRefs.current[frameId];
    
    if (canvas) {
      try {
        // Get the save data and ensure it's valid
        const saveData = safelyGetCanvasData(canvas, currentAspectRatio.width * 2, currentAspectRatio.height * 2);
        
        console.log(`Opening modal for frame ${frameId} at index ${index}`);
        console.log("Canvas data type:", typeof saveData);
        console.log("Canvas data length:", saveData ? saveData.length : 0);
        
        // Store both the index and the frame ID to ensure consistency
        setSelectedFrameIndex(index);
        setModalCanvasData(saveData);
        setIsModalOpen(true);
      } catch (error) {
        console.error(`Error preparing canvas data for modal for frame ${frameId}:`, error);
        alert("There was an error opening the preview. Please try again.");
      }
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedFrameIndex(null);
    setModalCanvasData(null);
  };

  // Add a function to save changes from modal to the main canvas
  const saveModalChanges = () => {
    if (selectedFrameIndex !== null && modalCanvasRef.current) {
      try {
        // Ensure we're working with the correct frame by getting its ID
        const frameId = frames[selectedFrameIndex].id;
        
        // Get the save data from the modal canvas
        const saveData = safelyGetCanvasData(modalCanvasRef.current, currentAspectRatio.width * 2, currentAspectRatio.height * 2);
        
        console.log(`Saving modal canvas data for frame ${frameId} at index ${selectedFrameIndex}`);
        console.log("Modal canvas save data type:", typeof saveData);
        console.log("Modal canvas save data length:", saveData ? saveData.length : 0);
        
        // Update the frame's canvas with the modal canvas data
        const mainCanvas = canvasRefs.current[frameId];
        
        if (mainCanvas) {
          // Update the main canvas with the modal canvas data
          safelyLoadCanvasData(mainCanvas, saveData, currentAspectRatio.width * 2, currentAspectRatio.height * 2, true);
          
          // Update the frames state with the new canvas data
          setFrames(
            frames.map((frame, index) => 
              frame.id === frameId 
                ? { ...frame, canvasData: saveData } 
                : frame
            )
          );
          
          console.log(`Successfully saved changes for frame ${frameId} with smoothness: ${brushSmoothness}`);
        } else {
          console.error(`Could not find main canvas for frame ${frameId}`);
        }
        
        // Close the modal
        closeModal();
      } catch (error) {
        console.error("Error saving canvas data:", error);
        alert("Failed to save changes. Please try again.");
      }
    }
  };

  // Effect to load canvas data into modal when it opens
  useEffect(() => {
    if (isModalOpen && modalCanvasRef.current && selectedFrameIndex !== null) {
      try {
        // Get the frame ID to ensure we're working with the correct frame
        const frameId = frames[selectedFrameIndex]?.id;
        
        if (!frameId) {
          console.error("Invalid frame index or frame ID not found");
          closeModal();
          return;
        }
        
        console.log(`Modal opened for frame ${frameId} at index ${selectedFrameIndex}`);
        
        // Add a small delay to ensure the canvas is fully rendered
        setTimeout(() => {
          if (modalCanvasRef.current) {
            if (!modalCanvasData) {
              console.log(`No modal canvas data available for frame ${frameId}, using empty canvas`);
              const emptyCanvasData = createEmptyCanvasData(currentAspectRatio.width * 2, currentAspectRatio.height * 2);
              safelyLoadCanvasData(modalCanvasRef.current, emptyCanvasData, currentAspectRatio.width * 2, currentAspectRatio.height * 2, true);
              return;
            }
            
            console.log(`Loading modal canvas data for frame ${frameId}:`);
            console.log("Modal canvas data type:", typeof modalCanvasData);
            console.log("Modal canvas data length:", modalCanvasData.length);
            
            safelyLoadCanvasData(modalCanvasRef.current, modalCanvasData, currentAspectRatio.width * 2, currentAspectRatio.height * 2, true);
            console.log(`Successfully loaded canvas data into modal for frame ${frameId}`);
          }
        }, 100);
      } catch (error) {
        console.error("Error in modal canvas effect:", error);
        closeModal();
      }
    }
  }, [isModalOpen, modalCanvasData, currentAspectRatio.width, currentAspectRatio.height, selectedFrameIndex, frames, closeModal]);

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Compact Header with Title and Drawing Tools */}
      <div className="bg-white shadow-md w-full sticky top-0 z-20">
        <div className="container mx-auto px-4 py-3">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            {/* Title */}
            <h1 className="text-2xl font-bold text-gray-800 mb-3 md:mb-0">Storyboard Creator</h1>
            
            {/* Drawing Tools */}
            <div className="flex flex-wrap items-center gap-4">
              {/* Color picker */}
              <div className="flex items-center">
                <span className="text-sm text-gray-600 mr-2">Color:</span>
                <div className="flex space-x-1">
                  {colorOptions.map((color) => (
                    <button
                      key={color}
                      className={`w-6 h-6 rounded-full border ${currentBrushColor === color ? 'border-gray-800 border-2' : 'border-gray-300'}`}
                      style={{ backgroundColor: color }}
                      onClick={() => handleColorChange(color)}
                      aria-label={`Select ${color} color`}
                    />
                  ))}
                </div>
              </div>
              
              {/* Brush size picker */}
              <div className="flex items-center">
                <span className="text-sm text-gray-600 mr-2">Size:</span>
                <div className="flex space-x-1">
                  {brushSizes.map((size) => (
                    <button
                      key={size}
                      className={`w-7 h-7 rounded flex items-center justify-center ${currentBrushRadius === size ? 'bg-gray-200 border border-gray-400' : 'bg-white border border-gray-300'}`}
                      onClick={() => handleBrushSizeChange(size)}
                      aria-label={`Select brush size ${size}`}
                    >
                      <div 
                        className="rounded-full bg-black" 
                        style={{ width: size, height: size }}
                      />
                    </button>
                  ))}
                </div>
              </div>
              
              {/* Smoothness Selector */}
              <div className="flex items-center">
                <span className="text-sm text-gray-600 mr-2">Smoothness:</span>
                <select 
                  value={brushSmoothness}
                  onChange={handleSmoothnessChange}
                  className="bg-white border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {smoothnessOptions.map(option => (
                    <option key={option.name} value={option.value}>
                      {option.name}
                    </option>
                  ))}
                </select>
                <div className="ml-2 relative group">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500 cursor-help" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                  </svg>
                  <div className="absolute left-0 bottom-full mb-2 w-48 bg-black text-white text-xs rounded py-1 px-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
                    Higher smoothness creates more fluid lines but may feel less responsive. Adjust based on your drawing style.
                  </div>
                </div>
              </div>
              
              {/* Aspect Ratio Selector */}
              <div className="flex items-center">
                <span className="text-sm text-gray-600 mr-2">Ratio:</span>
                <select 
                  value={currentAspectRatio.name}
                  onChange={handleAspectRatioChange}
                  className="bg-white border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {aspectRatios.map(ratio => (
                    <option key={ratio.name} value={ratio.name}>
                      {ratio.name}
                    </option>
                  ))}
                </select>
              </div>
              
              {/* Add Frame Button */}
              <button 
                onClick={addFrame}
                className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-1 px-3 rounded-lg shadow transition duration-200 text-sm"
              >
                Add Frame
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Main Content */}
      <div className="container mx-auto p-4 mt-4">
        <div className="overflow-visible pb-4">
          {/* Changed from flex-row to flex-wrap to allow wrapping to next line */}
          <div className="flex flex-wrap gap-6 justify-start p-4">
            {frames.map((frame, index) => (
              <div 
                key={frame.id} 
                className={`flex flex-col bg-white rounded-lg shadow-md p-4 relative ${currentAspectRatio.cardWidth} mb-6`}
              >
                {/* Delete button */}
                <button
                  onClick={() => deleteFrame(index)}
                  className={`absolute -top-3 -right-3 w-8 h-8 rounded-full bg-red-500 text-white flex items-center justify-center shadow-md hover:bg-red-600 transition duration-200 z-10 ${frames.length <= 1 ? 'opacity-50 cursor-not-allowed' : ''}`}
                  disabled={frames.length <= 1}
                  aria-label="Delete frame"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
                
                {/* Canvas controls */}
                <div className="mb-3 flex justify-end space-x-2">
                  <button
                    onClick={() => openPreviewModal(index)}
                    className="bg-indigo-500 hover:bg-indigo-600 text-white px-2 py-1 rounded text-sm flex items-center"
                    aria-label="Preview frame"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                      <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                    </svg>
                    Preview
                  </button>
                  <button
                    onClick={() => undoCanvas(index)}
                    className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-2 py-1 rounded text-sm"
                    aria-label="Undo last stroke"
                  >
                    Undo
                  </button>
                  <button
                    onClick={() => clearCanvas(index)}
                    className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-2 py-1 rounded text-sm"
                    aria-label="Clear canvas"
                  >
                    Clear
                  </button>
                </div>
                
                {/* Canvas */}
                <div className="mb-3 border border-gray-200 rounded flex justify-center">
                  <CanvasDraw 
                    ref={(canvasDraw: CanvasDraw | null) => {
                      if (canvasDraw) {
                        canvasRefs.current[frame.id] = canvasDraw;
                      }
                    }}
                    canvasWidth={currentAspectRatio.width}
                    canvasHeight={currentAspectRatio.height}
                    brushRadius={currentBrushRadius}
                    brushColor={currentBrushColor}
                    lazyRadius={brushSmoothness}
                    catenaryColor={currentBrushColor}
                    hideGrid={true}
                    enablePanAndZoom={false}
                    className="rounded"
                  />
                </div>

                {/* Description */}
                <textarea
                  value={frame.description}
                  onChange={(e) =>
                    setFrames(
                      frames.map((f, i) =>
                        i === index ? { ...f, description: e.target.value } : f
                      )
                    )
                  }
                  placeholder="Enter description"
                  className="w-full h-24 p-2 border border-gray-300 rounded resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            ))}
            {/* Always show Add Frame button in the flex container */}
            <div className="flex items-center justify-center mb-6">
              <button
                onClick={addFrame}
                className={`flex flex-col items-center justify-center bg-white bg-opacity-70 border-2 border-dashed border-blue-300 rounded-lg hover:bg-blue-50 hover:border-blue-400 transition duration-200 ${currentAspectRatio.cardWidth} h-64`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-blue-500 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                <span className="text-blue-600 font-medium">Add Frame</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Preview Modal */}
      <Transition appear show={isModalOpen} as={React.Fragment}>
        <Dialog as="div" className="relative z-50" onClose={closeModal}>
          <Transition.Child
            as={React.Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-50" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={React.Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-5xl transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                  <Dialog.Title
                    as="h3"
                    className="text-lg font-medium leading-6 text-gray-900 mb-4"
                  >
                    Frame Preview (Editable)
                    {selectedFrameIndex !== null && frames[selectedFrameIndex] && 
                      frames[selectedFrameIndex].description && 
                      `: ${frames[selectedFrameIndex].description}`
                    }
                  </Dialog.Title>
                  
                  {/* Drawing Tools */}
                  <div className="mb-4 flex flex-wrap items-center gap-4 border-b border-gray-200 pb-4">
                    {/* Color picker */}
                    <div className="flex items-center">
                      <span className="text-sm text-gray-600 mr-2">Color:</span>
                      <div className="flex space-x-1">
                        {colorOptions.map((color) => (
                          <button
                            key={color}
                            className={`w-6 h-6 rounded-full border ${currentBrushColor === color ? 'border-gray-800 border-2' : 'border-gray-300'}`}
                            style={{ backgroundColor: color }}
                            onClick={() => handleColorChange(color)}
                            aria-label={`Select ${color} color`}
                          />
                        ))}
                      </div>
                    </div>
                    
                    {/* Brush size picker */}
                    <div className="flex items-center">
                      <span className="text-sm text-gray-600 mr-2">Size:</span>
                      <div className="flex space-x-1">
                        {brushSizes.map((size) => (
                          <button
                            key={size}
                            className={`w-7 h-7 rounded flex items-center justify-center ${currentBrushRadius === size ? 'bg-gray-200 border border-gray-400' : 'bg-white border border-gray-300'}`}
                            onClick={() => handleBrushSizeChange(size)}
                            aria-label={`Select brush size ${size}`}
                          >
                            <div 
                              className="rounded-full bg-black" 
                              style={{ width: size, height: size }}
                            />
                          </button>
                        ))}
                      </div>
                    </div>
                    
                    {/* Smoothness Selector */}
                    <div className="flex items-center">
                      <span className="text-sm text-gray-600 mr-2">Smoothness:</span>
                      <select 
                        value={brushSmoothness}
                        onChange={handleSmoothnessChange}
                        className="bg-white border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        {smoothnessOptions.map(option => (
                          <option key={option.name} value={option.value}>
                            {option.name}
                          </option>
                        ))}
                      </select>
                    </div>
                    
                    {/* Canvas controls */}
                    <div className="flex items-center space-x-2 ml-auto">
                      <button
                        onClick={() => {
                          if (modalCanvasRef.current) {
                            modalCanvasRef.current.undo();
                          }
                        }}
                        className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-2 py-1 rounded text-sm"
                        aria-label="Undo last stroke"
                      >
                        Undo
                      </button>
                      <button
                        onClick={() => {
                          if (modalCanvasRef.current) {
                            modalCanvasRef.current.clear();
                          }
                        }}
                        className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-2 py-1 rounded text-sm"
                        aria-label="Clear canvas"
                      >
                        Clear
                      </button>
                    </div>
                  </div>
                  
                  <div className="mt-2 flex justify-center">
                    <div className="border border-gray-200 rounded">
                      <CanvasDraw 
                        ref={(canvasDraw: CanvasDraw | null) => {
                          modalCanvasRef.current = canvasDraw;
                        }}
                        canvasWidth={currentAspectRatio.width * 2}
                        canvasHeight={currentAspectRatio.height * 2}
                        brushRadius={currentBrushRadius}
                        brushColor={currentBrushColor}
                        lazyRadius={brushSmoothness}
                        catenaryColor={currentBrushColor}
                        hideGrid={true}
                        enablePanAndZoom={false}
                        immediateLoading={true}
                        saveData={modalCanvasData && modalCanvasData.trim() !== '' ? 
                          modalCanvasData : 
                          createEmptyCanvasData(currentAspectRatio.width * 2, currentAspectRatio.height * 2)}
                        className="rounded"
                      />
                    </div>
                  </div>

                  <div className="mt-6 flex justify-end space-x-3">
                    <button
                      type="button"
                      className="inline-flex justify-center rounded-md border border-transparent bg-green-100 px-4 py-2 text-sm font-medium text-green-900 hover:bg-green-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-green-500 focus-visible:ring-offset-2"
                      onClick={saveModalChanges}
                    >
                      Save Changes
                    </button>
                    <button
                      type="button"
                      className="inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                      onClick={closeModal}
                    >
                      Close
                    </button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </div>
  );
};

export default App;
