import { useStoryboard } from '../context/StoryboardContext';
import { Link, useParams } from 'react-router-dom';
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { DndContext, DragEndEvent } from "@dnd-kit/core";

import { createEmptyCanvasData, safelyGetCanvasData, safelyLoadCanvasData } from '../utils';
import DrawingTools, { smoothnessOptions, aspectRatios } from '../components/storyboard/DrawingTools';
import PreviewShotModal from '../components/storyboard/PreviewShotModal';
import { IShot } from '../types';
import ShotDraggable from '../components/storyboard/ShotDraggable';
import AppPage from '../components/layouts/AppPage';

const StoryboardPage = () => {
  const { id: projectId } = useParams<{ id: string }>();

  const {
    shots,
    shotsDataRef,
    getStoryboard,
    addShot,
    setShots,
    currentAspectRatio,
    setCurrentAspectRatio,
    changeShotOrder,
  } = useStoryboard();

  const modalShotRef = useRef<IShot>({
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
  const [selectedShot, setSelectedShot] = useState<IShot | null>(null);
  const [selectedShotId, setSelectedShotId] = useState<string | null>(null);

  // Add state to track modal canvas changes
  const [modalCanvasChanged, setModalCanvasChanged] = useState(false);
  const [currentModalCanvasData, setCurrentModalCanvasData] = useState<string | null>(null);

  const [isAddingShot, setIsAddingShot] = useState(false);
  const [isReordering, setIsReordering] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Add a function to handle drawing tool changes that preserves modal canvas state
  const handleDrawingToolChange = (action: () => void) => {
    if (isModalOpen && modalShotRef.current && modalShotRef.current.canvas) {
      try {
        const currentData = modalShotRef.current.canvas.getSaveData();
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
      const updatedShots = shots.map(shot => {
        const canvas = shotsDataRef.current.find(s => s.id === shot.id)?.canvas || null;
        const canvasData = safelyGetCanvasData(canvas, selectedRatio.width, selectedRatio.height);
        return {
          ...shot,
          canvasData,
        };
      });

      setShots(updatedShots);
      setCurrentAspectRatio(selectedRatio);

      setTimeout(() => {
        updatedShots.forEach(shot => {
          const canvas = shotsDataRef.current.find(s => s.id === shot.id)?.canvas || null;
          if (canvas && shot.canvasData) {
            safelyLoadCanvasData(canvas, shot.canvasData, selectedRatio.width, selectedRatio.height, true);
          }
        });
      }, 100);
    }
  };

  const openPreviewModal = (shotId: string) => {
    const shot = shots.find(s => s.id === shotId);
    if (!shot) {
      console.error(`Shot with ID ${shotId} not found`);
      return;
    }

    const shotData = shotsDataRef.current.find(s => s.id === shotId);
    const canvas = shotData?.canvas || null;

    if (shotData && canvas) {
      try {
        const canvasData = safelyGetCanvasData(canvas, currentAspectRatio.width * 2, currentAspectRatio.height * 2);
        modalShotRef.current.canvas = canvas;
        modalShotRef.current.canvasData = canvasData;
        modalShotRef.current.image = shotData.image;
        setSelectedShot(shot);
        setSelectedShotId(shotId);
        setIsModalOpen(true);
      } catch (error) {
        console.error(`Error preparing canvas data for modal for shot ${shotId}:`, error);
        alert("There was an error opening the preview. Please try again.");
      }
    }
  };

  const closeModal = useCallback(() => {
    setIsModalOpen(false);
    setSelectedShotId(null);
    setModalCanvasChanged(false);
    setCurrentModalCanvasData(null);
  }, []);

  const saveModalChanges = () => {
    if (selectedShot && modalShotRef.current && modalShotRef.current.canvas) {
      try {
        const saveData = modalShotRef.current.canvas.getSaveData();
        const shotToUpdate = shotsDataRef.current.find(s => s.id === selectedShot.id);

        if (!shotToUpdate) {
          console.error(`Could not find shot with ID ${selectedShot.id} in shotsDataRef`);
          return;
        }

        if (shotToUpdate.canvas) {
          safelyLoadCanvasData(shotToUpdate.canvas, saveData, currentAspectRatio.width, currentAspectRatio.height, true);
        }

        shotsDataRef.current = shotsDataRef.current.map(s => 
          s.id === selectedShot.id 
            ? { ...s, canvasData: saveData, image: modalShotRef.current.image } 
            : s
        );

        setShots(
          shots.map(shot => 
            shot.id === selectedShot.id 
              ? { ...shot, canvasData: saveData, image: modalShotRef.current.image } 
              : shot
          )
        );

        console.log(`Successfully saved changes for shot ${selectedShot.id}`);
        closeModal();
      } catch (error) {
        console.error("Error saving canvas data:", error);
        alert("Failed to save changes. Please try again.");
      }
    }
  };

  useEffect(() => {
    if (isModalOpen && modalShotRef.current && modalShotRef.current.canvas && selectedShotId !== null) {
      try {
        const shotId = selectedShotId;

        if (!shotId) {
          console.error("Invalid shot index or shot ID not found");
          closeModal();
          return;
        }

        setTimeout(() => {
          if (modalShotRef.current && modalShotRef.current.canvas) {
            if (modalCanvasChanged && currentModalCanvasData) {
              console.log(`Loading preserved modal canvas data after tool change`);
              safelyLoadCanvasData(modalShotRef.current.canvas, currentModalCanvasData, currentAspectRatio.width * 2, currentAspectRatio.height * 2, true);
              return;
            }

            if (!modalShotRef.current.canvasData) {
              console.log(`No modal canvas data available for shot ${shotId}, using empty canvas`);
              const emptyCanvasData = createEmptyCanvasData(currentAspectRatio.width * 2, currentAspectRatio.height * 2);
              safelyLoadCanvasData(modalShotRef.current.canvas, emptyCanvasData, currentAspectRatio.width * 2, currentAspectRatio.height * 2, true);
              return;
            }
            safelyLoadCanvasData(modalShotRef.current.canvas, modalShotRef.current.canvasData, currentAspectRatio.width * 2, currentAspectRatio.height * 2, true);
            console.log(`Successfully loaded canvas data into modal for shot ${shotId}`);
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
    selectedShotId,
    shots,
    closeModal,
    modalCanvasChanged,
    currentModalCanvasData
  ]);

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    
    if (!over || active.id === over.id || isReordering) return;

    const draggedShot = shots.find((shot) => shot.id === active.id);
    const targetShot = shots.find((shot) => shot.id === over.id);

    if (!draggedShot || !targetShot) return;

    // Update local state immediately for instant UI feedback
    const oldIndex = shots.findIndex((shot) => shot.id === active.id);
    const newIndex = shots.findIndex((shot) => shot.id === over.id);
    
    const newShots = [...shots];
    const [movedShot] = newShots.splice(oldIndex, 1);
    newShots.splice(newIndex, 0, movedShot);
    
    setShots(newShots);
    shotsDataRef.current = newShots;

    // Then update the backend
    try {
      setIsReordering(true);
      await changeShotOrder(draggedShot.id, targetShot.order);
    } catch (error) {
      console.error('Error reordering shot:', error);
      // Revert the local state if the API call fails
      setShots(shots);
      shotsDataRef.current = shots;
    } finally {
      setIsReordering(false);
    }
  };

  useEffect(() => {
    if (projectId) {
      setIsLoading(true);
      getStoryboard(projectId)
        .finally(() => {
          setIsLoading(false);
        });
    }
  }, [projectId, getStoryboard]);

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
                <Link to={`/dashboard/projects/${projectId}`} className="text-gray-600 hover:text-gray-800">
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
                onAddShot={addShot}
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
                  {shots.map((shot, index) => (
                    <ShotDraggable
                      key={shot.id}
                      shot={shot}
                      index={index}
                      brushColor={brushColor}
                      brushRadius={brushRadius}
                      brushSmoothness={brushSmoothness}
                      onPreview={openPreviewModal}
                      isDisabled={isReordering}
                    />
                  ))}
                  {/* Add Shot button */}
                  <div className="flex items-center justify-center mb-6">
                    <button
                      onClick={async () => {
                        setIsAddingShot(true);
                        await addShot();
                        setIsAddingShot(false)
                      }}
                      disabled={isAddingShot}
                      className={`flex flex-col items-center justify-center bg-white bg-opacity-70 border-2 border-dashed border-blue-300 rounded-lg hover:bg-blue-50 hover:border-blue-400 transition duration-200 ${currentAspectRatio.cardWidth} h-64 ${isAddingShot ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                      {isAddingShot ? (
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
        <PreviewShotModal
          shot={selectedShot}
          isOpen={isModalOpen}
          onClose={closeModal}
          onSave={saveModalChanges}
          modalShotRef={modalShotRef}
          currentAspectRatio={currentAspectRatio}
          brushColor={brushColor}
          brushRadius={brushRadius}
          brushSmoothness={brushSmoothness}
          handleColorChange={handleColorChange}
          handleBrushSizeChange={handleBrushSizeChange}
          handleSmoothnessChange={handleSmoothnessChange}
          handleAspectRatioChange={handleAspectRatioChange}
          addShot={addShot}
        />
      </div>
    </AppPage>
  );
};

export default StoryboardPage;
