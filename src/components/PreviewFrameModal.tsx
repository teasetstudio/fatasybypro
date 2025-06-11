import React, { useRef, useState } from 'react';
import CanvasDraw from 'react-canvas-draw';
import { Dialog, DialogPanel, DialogTitle, Transition, TransitionChild } from '@headlessui/react';
import DrawingTools, { aspectRatios } from './DrawingTools';
import { IFrame } from './types';

interface PreviewFrameModalProps {
  frame: IFrame | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: () => void;
  selectedFrameId: string | null;
  frames: IFrame[];
  modalFrameRef: React.RefObject<IFrame>;
  currentAspectRatio: typeof aspectRatios[0];
  brushColor: string;
  brushRadius: number;
  brushSmoothness: number;
  handleColorChange: (color: string) => void;
  handleBrushSizeChange: (size: number) => void;
  handleSmoothnessChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  handleAspectRatioChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  addFrame: () => void;
  setFrames: React.Dispatch<React.SetStateAction<IFrame[]>>;
}

const PreviewFrameModal: React.FC<PreviewFrameModalProps> = ({
  frame,
  isOpen,
  onClose,
  onSave,
  selectedFrameId,
  frames,
  modalFrameRef,
  currentAspectRatio,
  brushColor,
  brushRadius,
  brushSmoothness,
  handleColorChange,
  handleBrushSizeChange,
  handleSmoothnessChange,
  handleAspectRatioChange,
  addFrame,
  setFrames,
}) => {
  const [isBackgroundImage, setIsBackgroundImage] = useState(false);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Save current drawing state before changing background
      if (modalFrameRef.current.canvas) {
        modalFrameRef.current.canvasData = modalFrameRef.current.canvas.getSaveData();
      }
      // set to false to force a re-render
      setIsBackgroundImage(false);

      const reader = new FileReader();
      reader.onload = (e) => {
        const uploadedImage = e.target?.result as string;
        modalFrameRef.current.image = uploadedImage;
        // updateGlobalFramesData(id, { image: uploadedImage, canvas: canvasRef.current });
        setIsBackgroundImage(true);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeBackgroundImage = () => {
    // Save current drawing state before removing background
    if (modalFrameRef.current.canvas) {
      modalFrameRef.current.canvasData = modalFrameRef.current.canvas.getSaveData();
    }

    // Clear background image state
    modalFrameRef.current.image = null;
    setIsBackgroundImage(false);
    setTimeout(() => {
      setIsBackgroundImage(true);
    }, 10);
  };

  const getImageSrc = () => {
    if (modalFrameRef.current && modalFrameRef.current.image) {
      return modalFrameRef.current.image;
    }
    return undefined;
  };

  return (
    <Transition appear show={isOpen} as={React.Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <TransitionChild
          as={React.Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-50" />
        </TransitionChild>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <TransitionChild
              as={React.Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <DialogPanel className="w-full max-w-5xl transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                <DialogTitle
                  as="h3"
                  className="text-lg font-medium leading-6 text-gray-900 mb-4"
                >
                  Frame Preview (Editable)
                  {frame && frame.description && 
                    `: ${frame.description}`
                  }
                </DialogTitle>

                {/* Drawing Tools */}
                <div className="mb-4 flex flex-wrap items-center gap-4 border-b border-gray-200 pb-4">
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
                    showTooltip={false}
                    showAddFrame={false}
                  />

                  {/* Canvas controls */}
                  <div className="flex items-center space-x-2 ml-auto">
                    <button
                      onClick={() => {
                        if (modalFrameRef.current && modalFrameRef.current.canvas) {
                          modalFrameRef.current.canvas.undo();
                        }
                      }}
                      className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-2 py-1 rounded text-sm"
                      aria-label="Undo last stroke"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M7.707 3.293a1 1 0 010 1.414L5.414 7H11a7 7 0 017 7v2a1 1 0 11-2 0v-2a5 5 0 00-5-5H5.414l2.293 2.293a1 1 0 11-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </button>
                    <button
                      onClick={() => {
                        if (modalFrameRef.current && modalFrameRef.current.canvas) {
                          modalFrameRef.current.canvas.clear();
                        }
                      }}
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
                    {frame?.image && (
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
                
                <div className="mt-2 flex justify-center">
                  <div className="border border-gray-200 rounded">
                    <CanvasDraw
                      key={`modal-canvas-${frame?.id}-${isBackgroundImage ? 'img' : 'no-img'}`}
                      ref={(canvasDraw: CanvasDraw | null) => {
                        if (modalFrameRef && modalFrameRef.current) {
                          modalFrameRef.current.canvas = canvasDraw;
                        }
                      }}
                      canvasWidth={currentAspectRatio.width * 2}
                      canvasHeight={currentAspectRatio.height * 2}
                      brushRadius={brushRadius}
                      brushColor={brushColor}
                      lazyRadius={brushSmoothness}
                      catenaryColor={brushColor}
                      hideGrid={true}
                      enablePanAndZoom={false}
                      immediateLoading={true}
                      imgSrc={getImageSrc()}
                      saveData={modalFrameRef.current?.canvasData}
                      className="rounded"
                    />
                  </div>
                </div>

                <div className="mt-6 flex justify-end space-x-3">
                  <button
                    type="button"
                    className="inline-flex justify-center rounded-md border border-transparent bg-green-100 px-4 py-2 text-sm font-medium text-green-900 hover:bg-green-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-green-500 focus-visible:ring-offset-2"
                    onClick={onSave}
                  >
                    Save Changes
                  </button>
                  <button
                    type="button"
                    className="inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                    onClick={onClose}
                  >
                    Close
                  </button>
                </div>
              </DialogPanel>
            </TransitionChild>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default PreviewFrameModal; 