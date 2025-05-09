import React, { createContext, useContext, useState, useRef, useCallback, useMemo, useEffect } from 'react';
import { IFrame } from '../components/types';
import { createEmptyCanvasData } from '../components/frameUtils';
import debounce from 'lodash.debounce';
import { aspectRatios } from '../components/DrawingTools';

interface FramesContextType {
  frames: IFrame[];
  framesDataRef: React.RefObject<IFrame[]>;
  addFrame: () => void;
  deleteFrame: (id: string) => void;
  updateFrame: (id: string, data: Partial<IFrame>) => void;
  setFrames: React.Dispatch<React.SetStateAction<IFrame[]>>;
  currentAspectRatio: typeof aspectRatios[0];
  setCurrentAspectRatio: React.Dispatch<React.SetStateAction<typeof aspectRatios[0]>>;
}

const FramesContext = createContext<FramesContextType | undefined>(undefined);

export const FramesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const framesDataRef = useRef<IFrame[]>([]);
  const [frames, setFrames] = useState<IFrame[]>([]);
  const [currentAspectRatio, setCurrentAspectRatio] = useState(aspectRatios[0]);

  // Create a debounced function to update frames state
  const debouncedSetFrames = useMemo(() => 
    debounce((newFrames: IFrame[]) => {
      setFrames([...newFrames]);
    }, 300),
    []
  );

  // Use useCallback for addFrame to avoid dependency issues
  const addFrame = useCallback(() => {
    const emptyCanvasData = createEmptyCanvasData(currentAspectRatio.width, currentAspectRatio.height);
    let newId: string;
    let counter = 0;
    do {
      newId = `frame-${Date.now()}${counter > 0 ? `-${counter}` : ''}`;
      counter++;
    } while (framesDataRef.current.some(frame => frame.id === newId));

    framesDataRef.current.push({ 
      id: newId,
      description: '', 
      image: null,
      canvas: JSON.parse(emptyCanvasData)
    });

    setFrames([...framesDataRef.current]);
  }, [currentAspectRatio.width, currentAspectRatio.height]);

  const deleteFrame = useCallback((idToDelete: string) => {
    const updatedFrames = frames.filter((f) => f.id !== idToDelete);
    framesDataRef.current = framesDataRef.current.filter((f) => f.id !== idToDelete);
    setFrames(updatedFrames);
  }, [frames]);

  const updateFrame = useCallback((id: string, data: Partial<IFrame>) => {
    if (framesDataRef.current && framesDataRef.current.length > 0) {
      framesDataRef.current = framesDataRef.current.map((f) =>
        f.id === id ? { ...f, ...data } : f
      );
      debouncedSetFrames(framesDataRef.current);
    }
  }, [debouncedSetFrames]);

  // Use useEffect cleanup to cancel pending debounced calls when component unmounts
  useEffect(() => {
    return () => {
      debouncedSetFrames.cancel();
    };
  }, [debouncedSetFrames]);

  const value = {
    frames,
    framesDataRef,
    addFrame,
    deleteFrame,
    updateFrame,
    setFrames,
    currentAspectRatio,
    setCurrentAspectRatio,
  };

  // Initialize with one frame
  useEffect(() => {
    if (framesDataRef.current.length === 0) {
      addFrame();
      addFrame();
    }
  }, []);

  return (
    <FramesContext.Provider value={value}>
      {children}
    </FramesContext.Provider>
  );
};

export const useFrames = () => {
  const context = useContext(FramesContext);
  if (context === undefined) {
    throw new Error('useFrames must be used within a FramesProvider');
  }
  return context;
}; 