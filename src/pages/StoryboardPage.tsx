import { useFrames } from '../context/FramesContext';
import { Link } from 'react-router-dom';
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { DndContext, DragEndEvent } from "@dnd-kit/core";


import { createEmptyCanvasData, safelyGetCanvasData, safelyLoadCanvasData } from '../components/frameUtils';
import DrawingTools, { smoothnessOptions, aspectRatios } from '../components/DrawingTools';
import PreviewFrameModal from '../components/PreviewFrameModal';
import { IFrame } from '../components/types';
import DraggableFrame from '../components/DraggableFrame';
import AppPage from '../components/layout/AppPage';

const StoryboardPage = () => {
  const {
    frames,
    framesDataRef,
    addFrame,
    setFrames,
    currentAspectRatio,
    setCurrentAspectRatio,
  } = useFrames();

  const modalFrameRef = useRef<IFrame>({
    id: '',
    description: '',
    image: null,
    canvas: null,
    canvasData: ''
  });

  const [brushColor, setBrushColor] = useState("#000000");
  const [brushRadius, setBrushRadius] = useState(2);
  const [brushSmoothness, setBrushSmoothness] = useState(smoothnessOptions[1].value); // Default to medium smoothness

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedFrame, setSelectedFrame] = useState<IFrame | null>(null);
  const [selectedFrameId, setSelectedFrameId] = useState<string | null>(null);

  // Add state to track modal canvas changes
  const [modalCanvasChanged, setModalCanvasChanged] = useState(false);
  const [currentModalCanvasData, setCurrentModalCanvasData] = useState<string | null>(null);

  // Initialize with one frame
  useEffect(() => {
    if (frames.length === 0) {
      addFrame();
    }
  }, []);

  // Add a function to handle drawing tool changes that preserves modal canvas state
  const handleDrawingToolChange = (action: () => void) => {
    // If modal is open, save current canvas state first
    if (isModalOpen && modalFrameRef.current && modalFrameRef.current.canvas) {
      try {
        const currentData = modalFrameRef.current.canvas.getSaveData();

        setCurrentModalCanvasData(currentData);
        setModalCanvasChanged(true);
      } catch (error) {
        console.error("Error saving modal canvas state:", error);
      }
    }

    // Then perform the action (color change, brush size change, etc.)
    action();
  };

  const handleColorChange = (color: string) => {
    handleDrawingToolChange(() => setBrushColor(color));
  };

  const handleBrushSizeChange = (size: number) => {
    handleDrawingToolChange(() => setBrushRadius(size));
  };

  const handleSmoothnessChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const smoothness = parseInt(e.target.value);
    handleDrawingToolChange(() => setBrushSmoothness(smoothness));
  };

  const handleAspectRatioChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedRatio = aspectRatios.find(ratio => ratio.name === e.target.value);
    if (selectedRatio) {
      // Save current canvas data before changing aspect ratio
      const updatedFrames = frames.map(frame => {

        const canvas = framesDataRef.current.find(f => f.id === frame.id)?.canvas || null;
        const canvasData = safelyGetCanvasData(canvas, selectedRatio.width, selectedRatio.height);

        return {
          ...frame,
          canvasData,
        };
      });

      setFrames(updatedFrames);
      setCurrentAspectRatio(selectedRatio);

      // Need to give time for state to update before reloading canvas data
      setTimeout(() => {
        updatedFrames.forEach(frame => {
          const canvas = framesDataRef.current.find(f => f.id === frame.id)?.canvas || null;

          if (canvas && frame.canvasData) {
            safelyLoadCanvasData(canvas, frame.canvasData, selectedRatio.width, selectedRatio.height, true);
          }
        });
      }, 100);
    }
  };

  const openPreviewModal = (frameId: string) => {
    // Find the frame in the frames array
    const frame = frames.find(f => f.id === frameId);
    if (!frame) {
      console.error(`Frame with ID ${frameId} not found`);
      return;
    }

    const frameData = framesDataRef.current.find(f => f.id === frameId);
    const canvas = frameData?.canvas || null;

    if (frameData && canvas) {
      try {
        // Get the save data and ensure it's valid
        const canvasData = safelyGetCanvasData(canvas, currentAspectRatio.width * 2, currentAspectRatio.height * 2);
        // modalCanvasRef.current = canvas;
        modalFrameRef.current.canvas = canvas;
        modalFrameRef.current.canvasData = canvasData;
        modalFrameRef.current.image = frameData.image;
        // Store the frame ID to ensure consistency
        setSelectedFrame(frame);
        setSelectedFrameId(frameId);
        setIsModalOpen(true);
      } catch (error) {
        console.error(`Error preparing canvas data for modal for frame ${frameId}:`, error);
        alert("There was an error opening the preview. Please try again.");
      }
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedFrameId(null);
    // modalFrameRef.current.canvasData = undefined;
    setModalCanvasChanged(false);
    setCurrentModalCanvasData(null);
  };

  // Add a function to save changes from modal to the main canvas
  const saveModalChanges = () => {
    if (selectedFrame && modalFrameRef.current && modalFrameRef.current.canvas) {
      try {
        // Get the save data from the modal canvas
        const saveData = modalFrameRef.current.canvas.getSaveData();

        // Find the frame to update in both arrays
        const frameToUpdate = framesDataRef.current.find(f => f.id === selectedFrame.id);

        if (!frameToUpdate) {
          console.error(`Could not find frame with ID ${selectedFrame.id} in framesDataRef`);
          return;
        }

        // If the frame has a canvas property, update it with the new canvas data
        if (frameToUpdate.canvas) {
          safelyLoadCanvasData(frameToUpdate.canvas, saveData, currentAspectRatio.width, currentAspectRatio.height, true);
        }

        // Update the framesDataRef
        framesDataRef.current = framesDataRef.current.map(f => 
          f.id === selectedFrame.id 
            ? { ...f, canvasData: saveData, image: modalFrameRef.current.image } 
            : f
        );

        // Update the frames state immediately (don't use debounce here)
        setFrames(
          frames.map(frame => 
            frame.id === selectedFrame.id 
              ? { ...frame, canvasData: saveData, image: modalFrameRef.current.image           } 
              : frame
          )
        );

        console.log(`Successfully saved changes for frame ${selectedFrame.id}`);
        
        // Close the modal
        closeModal();
      } catch (error) {
        console.error("Error saving canvas data:", error);
        console.error(error);
        alert("Failed to save changes. Please try again.");
      }
    } else {
      console.error("Cannot save changes: missing data");
      if (!selectedFrameId) console.error("selectedFrameId is null");
      if (!modalFrameRef.current) console.error("modalFrameRef.current is null");
      if (modalFrameRef.current && !modalFrameRef.current.canvas) console.error("modalFrameRef.current.canvas is null");
    }
  };

  // Effect to load canvas data into modal when it opens
  useEffect(() => {
    if (isModalOpen && modalFrameRef.current && modalFrameRef.current.canvas && selectedFrameId !== null) {
      try {
        // Get the frame ID to ensure we're working with the correct frame
        const frameId = selectedFrameId;

        if (!frameId) {
          console.error("Invalid frame index or frame ID not found");
          closeModal();
          return;
        }

        // Add a small delay to ensure the canvas is fully rendered
        setTimeout(() => {
          if (modalFrameRef.current && modalFrameRef.current.canvas) {
            // If we have changed the canvas in the modal and are just updating tools, use that data
            if (modalCanvasChanged && currentModalCanvasData) {
              console.log(`Loading preserved modal canvas data after tool change`);
              safelyLoadCanvasData(modalFrameRef.current.canvas, currentModalCanvasData, currentAspectRatio.width * 2, currentAspectRatio.height * 2, true);
              return;
            }

            // Otherwise load from the original data
            if (!modalFrameRef.current.canvasData) {
              console.log(`No modal canvas data available for frame ${frameId}, using empty canvas`);
              const emptyCanvasData = createEmptyCanvasData(currentAspectRatio.width * 2, currentAspectRatio.height * 2);
              safelyLoadCanvasData(modalFrameRef.current.canvas, emptyCanvasData, currentAspectRatio.width * 2, currentAspectRatio.height * 2, true);
              return;
            }
            safelyLoadCanvasData(modalFrameRef.current.canvas, modalFrameRef.current.canvasData, currentAspectRatio.width * 2, currentAspectRatio.height * 2, true);
            console.log(`Successfully loaded canvas data into modal for frame ${frameId}`);
          }
        }, 100);
      } catch (error) {
        console.error("Error in modal canvas effect:", error);
        closeModal();
      }
    }
  }, [
    isModalOpen, 
    currentAspectRatio, 
    selectedFrameId, 
    frames, 
    closeModal, 
    modalCanvasChanged, 
    currentModalCanvasData
  ]);

  // Callback for handling description changes
  const handleDescriptionChange = useCallback((index: number, description: string) => {
    setFrames(frames => frames.map((f, i) =>
      i === index ? { ...f, description } : f
    ));
  }, []);

  // Add drag and drop handlers
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    
    if (over && active.id !== over.id) {
      const oldIndex = frames.findIndex((frame) => frame.id === active.id);
      const newIndex = frames.findIndex((frame) => frame.id === over.id);
      
      const newFrames = [...frames];
      const [movedFrame] = newFrames.splice(oldIndex, 1);
      newFrames.splice(newIndex, 0, movedFrame);
      
      setFrames(newFrames);
      framesDataRef.current = newFrames;
    }
  };

  return (
    <AppPage title="Storyboard">
      <div className="min-h-screen bg-gray-100">
        {/* Compact Header with Title and Drawing Tools */}
        <div className="bg-white shadow-md w-full sticky top-0 z-20">
          <div className="container mx-auto px-4 py-3">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
              {/* Title */}
              <div className="flex items-center space-x-4">
                <Link to="/" className="text-gray-600 hover:text-gray-800">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                  </svg>
                </Link>
                <h1 className="text-2xl font-bold text-gray-800 mb-3 md:mb-0">Storyboard Creator</h1>
              </div>
              

              {/* Drawing Tools */}
              <DrawingTools
                brushColor={brushColor}
                brushRadius={brushRadius}
                brushSmoothness={brushSmoothness}
                currentAspectRatio={currentAspectRatio}
                setBrushColor={handleColorChange}
                setBrushSize={handleBrushSizeChange}
                onSmoothnessChange={handleSmoothnessChange}
                onAspectRatioChange={handleAspectRatioChange}
                onAddFrame={addFrame}
              />
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="container-full mx-auto p-4 mt-4">
          <div className="overflow-visible pb-4">
            <DndContext onDragEnd={handleDragEnd}>
              <div className="flex flex-wrap gap-6 justify-center p-4">
                {frames.map((frame, index) => (
                  <DraggableFrame
                    key={frame.id}
                    frame={frame}
                    index={index}
                    brushColor={brushColor}
                    brushRadius={brushRadius}
                    brushSmoothness={brushSmoothness}
                    onPreview={openPreviewModal}
                  />
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
            </DndContext>
          </div>
        </div>

        {/* Preview Modal */}
        <PreviewFrameModal
          frame={selectedFrame}
          isOpen={isModalOpen}
          onClose={closeModal}
          onSave={saveModalChanges}
          selectedFrameId={selectedFrameId}
          frames={frames}
          modalFrameRef={modalFrameRef}
          currentAspectRatio={currentAspectRatio}
          brushColor={brushColor}
          brushRadius={brushRadius}
          brushSmoothness={brushSmoothness}
          handleColorChange={handleColorChange}
          handleBrushSizeChange={handleBrushSizeChange}
          handleSmoothnessChange={handleSmoothnessChange}
          handleAspectRatioChange={handleAspectRatioChange}
          addFrame={addFrame}
          setFrames={setFrames}
        />
      </div>
    </AppPage>
  );
};

export default StoryboardPage; 