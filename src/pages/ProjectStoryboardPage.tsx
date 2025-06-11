import { useFrames } from '../context/FramesContext';
import { Link, useParams, useNavigate } from 'react-router-dom';
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { DndContext, DragEndEvent } from "@dnd-kit/core";

import { createEmptyCanvasData, safelyGetCanvasData, safelyLoadCanvasData } from '../components/frameUtils';
import DrawingTools, { smoothnessOptions, aspectRatios } from '../components/DrawingTools';
import PreviewFrameModal from '../components/PreviewFrameModal';
import { IFrame } from '../components/types';
import DraggableFrame from '../components/DraggableFrame';
import AppPage from '../components/layout/AppPage';

const ProjectStoryboardPage = () => {
  const { id: projectId } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const {
    frames,
    framesDataRef,
    addFrame,
    setFrames,
    currentAspectRatio,
    setCurrentAspectRatio,
    fetchFramesByProjectId,
    changeFrameOrder,
  } = useFrames();

  const modalFrameRef = useRef<IFrame>({
    id: '',
    description: '',
    image: null,
    canvas: null,
    canvasData: '',
    order: 0
  });

  const [brushColor, setBrushColor] = useState("#000000");
  const [brushRadius, setBrushRadius] = useState(2);
  const [brushSmoothness, setBrushSmoothness] = useState(smoothnessOptions[1].value);

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedFrame, setSelectedFrame] = useState<IFrame | null>(null);
  const [selectedFrameId, setSelectedFrameId] = useState<string | null>(null);

  // Add state to track modal canvas changes
  const [modalCanvasChanged, setModalCanvasChanged] = useState(false);
  const [currentModalCanvasData, setCurrentModalCanvasData] = useState<string | null>(null);

  const [isAddingFrame, setIsAddingFrame] = useState(false);
  const [isReordering, setIsReordering] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Add a function to handle drawing tool changes that preserves modal canvas state
  const handleDrawingToolChange = (action: () => void) => {
    if (isModalOpen && modalFrameRef.current && modalFrameRef.current.canvas) {
      try {
        const currentData = modalFrameRef.current.canvas.getSaveData();
        setCurrentModalCanvasData(currentData);
        setModalCanvasChanged(true);
      } catch (error) {
        console.error("Error saving modal canvas state:", error);
      }
    }
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
    const frame = frames.find(f => f.id === frameId);
    if (!frame) {
      console.error(`Frame with ID ${frameId} not found`);
      return;
    }

    const frameData = framesDataRef.current.find(f => f.id === frameId);
    const canvas = frameData?.canvas || null;

    if (frameData && canvas) {
      try {
        const canvasData = safelyGetCanvasData(canvas, currentAspectRatio.width * 2, currentAspectRatio.height * 2);
        modalFrameRef.current.canvas = canvas;
        modalFrameRef.current.canvasData = canvasData;
        modalFrameRef.current.image = frameData.image;
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
    setModalCanvasChanged(false);
    setCurrentModalCanvasData(null);
  };

  const saveModalChanges = () => {
    if (selectedFrame && modalFrameRef.current && modalFrameRef.current.canvas) {
      try {
        const saveData = modalFrameRef.current.canvas.getSaveData();
        const frameToUpdate = framesDataRef.current.find(f => f.id === selectedFrame.id);

        if (!frameToUpdate) {
          console.error(`Could not find frame with ID ${selectedFrame.id} in framesDataRef`);
          return;
        }

        if (frameToUpdate.canvas) {
          safelyLoadCanvasData(frameToUpdate.canvas, saveData, currentAspectRatio.width, currentAspectRatio.height, true);
        }

        framesDataRef.current = framesDataRef.current.map(f => 
          f.id === selectedFrame.id 
            ? { ...f, canvasData: saveData, image: modalFrameRef.current.image } 
            : f
        );

        setFrames(
          frames.map(frame => 
            frame.id === selectedFrame.id 
              ? { ...frame, canvasData: saveData, image: modalFrameRef.current.image } 
              : frame
          )
        );

        console.log(`Successfully saved changes for frame ${selectedFrame.id}`);
        closeModal();
      } catch (error) {
        console.error("Error saving canvas data:", error);
        alert("Failed to save changes. Please try again.");
      }
    }
  };

  useEffect(() => {
    if (isModalOpen && modalFrameRef.current && modalFrameRef.current.canvas && selectedFrameId !== null) {
      try {
        const frameId = selectedFrameId;

        if (!frameId) {
          console.error("Invalid frame index or frame ID not found");
          closeModal();
          return;
        }

        setTimeout(() => {
          if (modalFrameRef.current && modalFrameRef.current.canvas) {
            if (modalCanvasChanged && currentModalCanvasData) {
              console.log(`Loading preserved modal canvas data after tool change`);
              safelyLoadCanvasData(modalFrameRef.current.canvas, currentModalCanvasData, currentAspectRatio.width * 2, currentAspectRatio.height * 2, true);
              return;
            }

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

  const handleDescriptionChange = useCallback((index: number, description: string) => {
    setFrames(frames => frames.map((f, i) =>
      i === index ? { ...f, description } : f
    ));
  }, []);

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    
    if (!over || active.id === over.id || isReordering) return;

    const draggedFrame = frames.find((frame) => frame.id === active.id);
    const targetFrame = frames.find((frame) => frame.id === over.id);

    if (!draggedFrame || !targetFrame) return;

    // Update local state immediately for instant UI feedback
    const oldIndex = frames.findIndex((frame) => frame.id === active.id);
    const newIndex = frames.findIndex((frame) => frame.id === over.id);
    
    const newFrames = [...frames];
    const [movedFrame] = newFrames.splice(oldIndex, 1);
    newFrames.splice(newIndex, 0, movedFrame);
    
    setFrames(newFrames);
    framesDataRef.current = newFrames;

    // Then update the backend
    try {
      setIsReordering(true);
      await changeFrameOrder(draggedFrame.id, targetFrame.order);
    } catch (error) {
      console.error('Error reordering frame:', error);
      // Revert the local state if the API call fails
      setFrames(frames);
      framesDataRef.current = frames;
    } finally {
      setIsReordering(false);
    }
  };

  useEffect(() => {
    if (projectId) {
      setIsLoading(true);
      fetchFramesByProjectId(projectId)
        .finally(() => {
          setIsLoading(false);
        });
    }
  }, [projectId, fetchFramesByProjectId]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <svg className="animate-spin h-12 w-12 text-blue-500 mx-auto mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <p className="text-gray-600 font-medium">Loading frames...</p>
        </div>
      </div>
    );
  }

  return (
    <AppPage title={`Project Storyboard - ${projectId}`}>
      <div className="min-h-screen bg-gray-100">
        {/* Compact Header with Title and Drawing Tools */}
        <div className="bg-white shadow-md w-full sticky top-0 z-20">
          <div className="container mx-auto px-4 py-3">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
              {/* Title and Navigation */}
              <div className="flex items-center space-x-4">
                <Link to={`/projects/${projectId}`} className="text-gray-600 hover:text-gray-800">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                  </svg>
                </Link>
                <h1 className="text-2xl font-bold text-gray-800 mb-3 md:mb-0">Project Storyboard</h1>
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
              <div className={`relative ${isReordering ? 'pointer-events-none' : ''}`}>
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
                      isDisabled={isReordering}
                    />
                  ))}
                  {/* Add Frame button */}
                  <div className="flex items-center justify-center mb-6">
                    <button
                      onClick={async () => {
                        setIsAddingFrame(true);
                        await addFrame();
                        setIsAddingFrame(false)
                      }}
                      disabled={isAddingFrame}
                      className={`flex flex-col items-center justify-center bg-white bg-opacity-70 border-2 border-dashed border-blue-300 rounded-lg hover:bg-blue-50 hover:border-blue-400 transition duration-200 ${currentAspectRatio.cardWidth} h-64 ${isAddingFrame ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                      {isAddingFrame ? (
                        <>
                          <svg className="animate-spin h-12 w-12 text-blue-500 mb-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          <span className="text-blue-600 font-medium">Adding Frame...</span>
                        </>
                      ) : (
                        <>
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-blue-500 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                          </svg>
                          <span className="text-blue-600 font-medium">Add Frame</span>
                        </>
                      )}
                    </button>
                  </div>
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

export default ProjectStoryboardPage; 