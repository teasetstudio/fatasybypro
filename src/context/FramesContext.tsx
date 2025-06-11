import React, { createContext, useContext, useState, useRef, useCallback, useMemo, useEffect } from 'react';
import { IFrame } from '../components/types';
import { createEmptyCanvasData } from '../components/frameUtils';
import debounce from 'lodash/debounce';
import { aspectRatios } from '../components/DrawingTools';
import { api } from '../services/api';

interface FramesContextType {
  frames: IFrame[];
  framesDataRef: React.RefObject<IFrame[]>;
  addFrame: () => void;
  deleteFrame: (id: string) => void;
  updateFrame: (id: string, data: Partial<IFrame>) => void;
  setFrames: React.Dispatch<React.SetStateAction<IFrame[]>>;
  currentAspectRatio: typeof aspectRatios[0];
  setCurrentAspectRatio: React.Dispatch<React.SetStateAction<typeof aspectRatios[0]>>;
  fetchFramesByProjectId: (projectId: string) => Promise<void>;
  changeFrameOrder: (frameId: string, newOrder: number) => Promise<void>;
  uploadImage: (image: File) => Promise<string>;
  deleteImage: (url: string) => Promise<void>;
}

const FramesContext = createContext<FramesContextType | undefined>(undefined);

export const FramesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const framesDataRef = useRef<IFrame[]>([]);
  const [frames, setFrames] = useState<IFrame[]>([]);
  const [projectId, setProjectId] = useState<string | null>(null);
  const [currentAspectRatio, setCurrentAspectRatio] = useState(aspectRatios[0]);

  // Create a debounced function to update frames state
  const debouncedSetFrames = useMemo(() => 
    debounce((newFrames: IFrame[]) => {
      setFrames([...newFrames]);
    }, 1000),
    []
  );

  const fetchFramesByProjectId = useCallback(async (projectId: string) => {
    try {
      const { data } = await api.get(`/projects/${projectId}/storyboard`);
      
      if (data && data.frames) {
        const formattedFrames = data.frames.map((frame: any) => ({
          id: frame.id,
          description: frame.description || '',
          image: frame.image,
          canvasData: frame.canvasData,
          order: frame.order,
          name: frame.name,
          duration: frame.duration,
          aspectRatio: frame.aspectRatio,
          status: frame.status
        }));

        framesDataRef.current = formattedFrames;

        setProjectId(projectId);
        setFrames(formattedFrames);
      }
    } catch (error) {
      console.error('Error fetching frames:', error);
      throw error;
    }
  }, []);

  // Use useCallback for addFrame to avoid dependency issues
  const addFrame = useCallback(async () => {
    if (!projectId) {
      console.error('No project ID available');
      return;
    }

    try {
      const { data } = await api.post(`/projects/${projectId}/storyboard/create-frame`, {
        name: `Frame ${frames.length + 1}`,
        description: '',
      });

      if (data && data.frame) {
        const newFrame = {
          id: data.frame.id,
          description: data.frame.description || '',
          image: data.frame.image,
          canvasData: data.frame.canvasData,
          order: data.frame.order,
          name: data.frame.name,
          duration: data.frame.duration,
          aspectRatio: data.frame.aspectRatio,
          status: data.frame.status
        };

        framesDataRef.current.push(newFrame);
        setFrames([...framesDataRef.current]);
      }
    } catch (error) {
      console.error('Error creating frame:', error);
    }
  }, [projectId, frames.length, currentAspectRatio.name]);

  const deleteFrame = useCallback(async (idToDelete: string) => {
    if (!projectId) {
      console.error('No project ID available');
      return;
    }

    try {
      const frameToDelete = frames.find(f => f.id === idToDelete);
      if (!frameToDelete) {
        console.error('Frame not found');
        return;
      }

      // Delete the frame from the backend
      await api.delete(`/projects/${projectId}/storyboard/frame/${idToDelete}/delete-frame`);

      // Update local state
      const updatedFrames = frames
        .filter(f => f.id !== idToDelete)
        .map(f => {
          if (f.order > frameToDelete.order) {
            return { ...f, order: f.order - 1 };
          }
          return f;
        })
        .sort((a, b) => a.order - b.order);

      framesDataRef.current = updatedFrames;
      setFrames(updatedFrames);
    } catch (error) {
      console.error('Error deleting frame:', error);
    }
  }, [frames, projectId]);

  const updateFrame = useCallback((id: string, data: Partial<IFrame>) => {
      if (framesDataRef.current && framesDataRef.current.length > 0) {
        const oldFrame = framesDataRef.current.find(f => f.id === id);
        if (!oldFrame) return;

        // Check if there are actual changes
        const hasChanges = Object.entries(data).some(([key, value]) => {
          // Skip canvas property as it contains circular references
          if (key === 'canvas') {
            return oldFrame.canvas?.getSaveData() === data.canvas?.getSaveData();
          }
          return JSON.stringify(oldFrame[key as keyof IFrame]) !== JSON.stringify(value);
        });

        const newFrame = { ...oldFrame, ...data };

        framesDataRef.current = framesDataRef.current.map((f) =>
          f.id === id ? newFrame : f
        );

        // All frames are updated at once and stored in framesDataRef.current
        // debounce makes sense because we want to save all frames at once
        // And reduce the number of rerenders
        debouncedSetFrames(framesDataRef.current);

        if (hasChanges) {
          debouncedSaveFrame(newFrame);
        }
      }
    },
    [debouncedSetFrames, projectId]
  );

  const debouncedSaveFrames = useRef(new Map<string, ReturnType<typeof debounce>>());

  const saveFrame = useCallback(async (frame: IFrame) => {
    if (!projectId) {
      console.error('No project ID available');
      return;
    }
    try {
      const { data } = await api.put(`/projects/${projectId}/storyboard/update-frame`, {
        id: frame.id,
        description: frame.description,
        image: frame.image,
        canvasData: frame.canvas?.getSaveData()
      });

      console.log('Frame saved successfully:', data);
    } catch (error) {
      console.error('Error saving frame:', error);
    }
  }, [projectId]);

  const debouncedSaveFrame = useCallback((frame: IFrame) => {
    if (!debouncedSaveFrames.current.has(frame.id)) {
      debouncedSaveFrames.current.set(
        frame.id,
        debounce(saveFrame, 100000)
      );
    }
    const debouncedFn = debouncedSaveFrames.current.get(frame.id);
    if (debouncedFn) {
      debouncedFn(frame);
    }
  }, [saveFrame]);

  const changeFrameOrder = useCallback(async (frameId: string, newOrder: number) => {
    if (!projectId) {
      console.error('No project ID available');
      return;
    }

    try {
      // Call the API to update the order
      await api.put(`/projects/${projectId}/storyboard/frame/${frameId}/change-order`, {
        newOrder
      });

      // Update local state
      const frameToMove = frames.find(f => f.id === frameId);
      if (!frameToMove) {
        console.error('Frame not found');
        return;
      }

      const oldOrder = frameToMove.order;
      const updatedFrames = frames.map(frame => {
        if (frame.id === frameId) {
          return { ...frame, order: newOrder };
        }
        if (newOrder > oldOrder) {
          // Moving down - decrease order of frames in between
          if (frame.order > oldOrder && frame.order <= newOrder) {
            return { ...frame, order: frame.order - 1 };
          }
        } else if (newOrder < oldOrder) {
          // Moving up - increase order of frames in between
          if (frame.order >= newOrder && frame.order < oldOrder) {
            return { ...frame, order: frame.order + 1 };
          }
        }
        return frame;
      }).sort((a, b) => a.order - b.order);

      framesDataRef.current = updatedFrames;
      setFrames(updatedFrames);
    } catch (error) {
      console.error('Error changing frame order:', error);
      throw error;
    }
  }, [frames, projectId]);

  const uploadImage = useCallback(async (image: File) => {
    if (!projectId) {
      console.error('No project ID available');
      return;
    }

    try {
      const formData = new FormData();
      formData.append('image', image);
      formData.append('projectId', projectId);

      const response = await api.post('/upload-images', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      const { imageUrl } = response.data;
      return imageUrl;
    } catch (error) {
      console.error('Error uploading image:', error);
      // You might want to show an error message to the user here
    }
  }, [projectId]);

  const deleteImage = useCallback(async (url: string) => {
    try {
      const response = await api.delete('/delete-images', {
        data: { url }
      });

      if (response.status !== 200) {
        console.error('Failed to delete image from server');
      }
    } catch (error) {
      console.error('Error deleting image:', error);
    }
  }, [projectId]);

  // Cleanup debounced functions on unmount
  useEffect(() => {
    const handleBeforeUnload = () => {
      // Execute any pending debounced saves
      debouncedSaveFrames.current.forEach(debouncedFn => {
        debouncedFn.flush();
      });
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      debouncedSetFrames.cancel();
      debouncedSaveFrames.current.forEach(debouncedFn => debouncedFn.cancel());
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
    fetchFramesByProjectId,
    changeFrameOrder,
    uploadImage,
    deleteImage,
  };

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