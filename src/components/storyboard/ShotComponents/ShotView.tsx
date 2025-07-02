import { useStoryboard } from '@/context';
import { IShot, IShotView } from '@/types';
import debounce from 'lodash.debounce';
import { useCallback, useEffect, useRef, useState } from 'react';
import CanvasDraw from 'react-canvas-draw';
import ShotViewControls from './ShotViewControls';
import { useToast } from '@/context/ToastContext';

interface IProps {
  shot: IShot;
  view: IShotView;
  brushColor: string;
  brushRadius: number;
  brushSmoothness: number;
  onPreview: (id: string) => void;
}

const ShotView = ({ shot, view, brushColor, brushRadius, brushSmoothness, onPreview }: IProps) => {
  const { currentAspectRatio, updateShot, uploadImage, deleteImage, getShotRefData } = useStoryboard();
  const canvasRef = useRef<CanvasDraw | null>(null);
  const savedDataRef = useRef<string>(view.canvasData);
  const imageRef = useRef<string | null>(null);

  const { showToast } = useToast();

  const [isBackgroundImage, setIsBackgroundImage] = useState(!!view.image);
  const [isImageLoading, setIsImageLoading] = useState(false);
  const [isDrawing, setIsDrawing] = useState(false);
  const [isDeletingImage, setIsDeletingImage] = useState(false);

  const debouncedHandleDrawEnd = useCallback(debounce(() => {
    if (canvasRef.current) {
      updateShot(shot.id, { views: [{ id: view.id, canvas: canvasRef.current }] });
    }
  }, 100), [shot.id, view.id]);

  const handleDrawEnd = () => {
    setIsDrawing(false);
    if (canvasRef.current) {
      savedDataRef.current = canvasRef.current.getSaveData();
    }
    debouncedHandleDrawEnd()
  };

  const handleDrawStart = () => {
    setIsDrawing(true);
  };

  const getImageSrc = () => {
    if (isBackgroundImage && imageRef.current) {
      return imageRef.current;
    }
    return undefined;
  };

  const handleUndo = () => {
    if (canvasRef.current) {
      canvasRef.current.undo();
      if (canvasRef.current) {
        savedDataRef.current = canvasRef.current.getSaveData();
      }
      updateShot(shot.id, { views: [{ id: view.id, canvas: canvasRef.current }] });
    }
  };

  const handleClear = () => {
    if (canvasRef.current) {
      canvasRef.current.clear();
      imageRef.current = null;
      if (canvasRef.current) {
        savedDataRef.current = canvasRef.current.getSaveData();
      }
      updateShot(shot.id, { views: [{ id: view.id, canvas: canvasRef.current, image: null }] });
      setIsBackgroundImage(false);
    }
  };

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // set to false to force a re-render
      setIsBackgroundImage(false);
      setIsImageLoading(true);

      try {
        const imageUrl = await uploadImage(file, shot.id, view.id);
        
        imageRef.current = imageUrl;
        updateShot(shot.id, { views: [{ id: view.id, image: imageUrl, canvas: canvasRef.current }] });
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
      if (view.image) {
        await deleteImage(view.image);
      }
      
      // Clear background image state
      imageRef.current = null;
      setIsBackgroundImage(false);
      updateShot(shot.id, { views: [{ id: view.id, image: null, canvas: canvasRef.current }] });
    } finally {
      setIsDeletingImage(false);
    }
  };

  useEffect(() => {
    if (imageRef.current !== view.image) {
      imageRef.current = view.image || null;
      // When shot's canvasData changes, load it into the canvas
      setIsBackgroundImage(false)
      setTimeout(() => {
        setIsBackgroundImage(true)
      }, 10)
    }
  }, [view.image]);

  // Cleanup debounced function on unmount
  useEffect(() => {
    return () => {
      debouncedHandleDrawEnd.cancel();
    };
  }, [debouncedHandleDrawEnd]);

  useEffect(() => {
    if (canvasRef.current) {
      const savedData = getShotRefData(shot.id)?.views?.find(v => v.id === view.id)?.canvasData;
      if (savedData) {
        savedDataRef.current = savedData;
        canvasRef.current.loadSaveData(savedData);
      }
    }
  }, []);

  return (
    <div>
      <ShotViewControls
        shot={shot}
        isDrawing={isDrawing}
        onPreview={onPreview}
        handleUndo={handleUndo}
        handleClear={handleClear}
        handleImageUpload={handleImageUpload}
        removeBackgroundImage={removeBackgroundImage}
        isBackgroundImage={isBackgroundImage}
        isImageLoading={isImageLoading}
        isDeletingImage={isDeletingImage}
      />

      <div
        className="mb-3 border border-gray-200 rounded flex justify-center"
        onMouseDown={handleDrawStart}
      >
        <CanvasDraw 
          key={`canvas-${view.id}-${isBackgroundImage ? 'img' : 'no-img'}`}
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
          onChange={handleDrawEnd}
        />
      </div>
    </div>
  )
}

export default ShotView
