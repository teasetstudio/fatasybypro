import React, { useRef, useEffect, useState, forwardRef } from 'react';
import CanvasDraw from 'react-canvas-draw';
import { aspectRatios } from './DrawingTools';
import { IFrame } from './types';

interface FrameProps {
  id: string;
  frame: IFrame;
  description: string;
  index: number;
  currentAspectRatio: typeof aspectRatios[0];
  brushColor: string;
  brushRadius: number;
  brushSmoothness: number;
  onDelete: (id: string) => void;
  onPreview: (id: string) => void;
  onDescriptionChange: (index: number, description: string) => void;
  updateGlobalFramesData: (id: string, data: Partial<IFrame>) => void;
}

const Frame = forwardRef<IFrame[], FrameProps>(({
  id,
  frame,
  description,
  index,
  currentAspectRatio,
  brushColor,
  brushRadius,
  brushSmoothness,
  onDelete,
  onPreview,
  onDescriptionChange,
  updateGlobalFramesData,
}, framesDataRef) => {
  const canvasRef = useRef<CanvasDraw | null>(null);
  const savedDataRef = useRef<string>(undefined);
  const imageRef = useRef<string | null>(null);

  const [isBackgroundImage, setIsBackgroundImage] = useState(false);
  const [isDrawing, setIsDrawing] = useState(false);

  const handleClear = () => {
    if (canvasRef.current) {
      canvasRef.current.clear();
      // save data is empty after clear()
      const savedData = canvasRef.current.getSaveData();
      savedDataRef.current = savedData;
      imageRef.current = null;
      updateGlobalFramesData(id, { image: null, canvas: canvasRef.current });
      setIsBackgroundImage(false);
    }
  };

  const handleUndo = () => {
    if (canvasRef.current) {
      canvasRef.current.undo();
      updateGlobalFramesData(id, { canvas: canvasRef.current });
    }
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
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
        imageRef.current = uploadedImage;
        updateGlobalFramesData(id, { image: uploadedImage, canvas: canvasRef.current });
        setIsBackgroundImage(true);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeBackgroundImage = () => {
    // Save current drawing state before removing background
    if (canvasRef.current) {
      savedDataRef.current = canvasRef.current.getSaveData();
    }
    
    // Clear background image state
    imageRef.current = null;
    setIsBackgroundImage(false);
    updateGlobalFramesData(id, { image: null, canvas: canvasRef.current });
  };

  const handleDrawStart = () => {
    setIsDrawing(true);
  };

  const handleDrawEnd = () => {
    setIsDrawing(false);
    if (canvasRef.current) {
      savedDataRef.current = canvasRef.current.getSaveData();
      updateGlobalFramesData(id, { canvas: canvasRef.current });
    }
  };

  const saveCanvasData = () => {
    if (canvasRef.current) {
      const data = canvasRef.current.getSaveData();
      // setSavedDrawing(data);
      savedDataRef.current = data;
      updateGlobalFramesData(id, { canvas: canvasRef.current, image: imageRef.current });
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

  useEffect(() => {
    if (canvasRef.current && frame.canvasData) {
      // When frame's canvasData changes, load it into the canvas
      canvasRef.current.loadSaveData(frame.canvasData, true);
    }
  }, [frame.canvasData]);

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
      {/* Delete button */}
      <button
        onClick={() => onDelete(id)}
        className='absolute -top-3 -right-3 w-8 h-8 rounded-full bg-red-500 text-white flex items-center justify-center shadow-md hover:bg-red-600 transition duration-200 z-10'
        aria-label="Delete frame"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
        </svg>
      </button>

      {/* Canvas controls */}
      <div className='flex justify-between'>
        <div>{isDrawing && <p className='text-sm text-gray-500'>Drawing...</p>}</div>

        <div className="mb-3 flex justify-end space-x-2">
          <button
            onClick={() => onPreview(id)}
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
          <label className="relative cursor-pointer">
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
              aria-label="Upload background image"
            />
            <span className="bg-blue-500 hover:bg-blue-600 text-white px-2 py-1 rounded text-sm inline-flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
              </svg>
            </span>
          </label>
          {isBackgroundImage && (
            <button
              onClick={removeBackgroundImage}
              className="bg-red-100 hover:bg-red-200 text-red-700 px-2 py-1 rounded text-sm inline-flex items-center"
              aria-label="Remove background image"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </button>
          )}
        </div>
      </div>

      {/* Canvas */}
      <div
        className="mb-3 border border-gray-200 rounded flex justify-center"
        onMouseDown={handleDrawStart}
        // onMouseUp={handleDrawEnd}
        // onMouseLeave={handleDrawEnd}
      >
        <CanvasDraw 
          key={`canvas-${id}-${isBackgroundImage ? 'img' : 'no-img'}`}
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
          onChange={() => handleDrawEnd()}
        />
      </div>

      {/* Description */}
      <textarea
        value={description}
        onChange={(e) => onDescriptionChange(index, e.target.value)}
        placeholder="Enter description"
        className="w-full h-24 p-2 border border-gray-300 rounded resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      />
    </div>
  );
});

Frame.displayName = 'Frame';

export default Frame;
