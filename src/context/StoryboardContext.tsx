import React, { createContext, useContext, useState, useRef, useCallback, useMemo, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import debounce from 'lodash.debounce';
import { IShot, IShotStatus, IShotView, IStoryboard, IUpdateShot } from '@/types';
import { aspectRatios } from '@/components/storyboard/DrawingTools';
import { api } from '@/services/api';
import { getFileSizeError, TOAST_MESSAGES } from '@/utils';
import { useToast } from './ToastContext';

interface StoryboardContextType {
  storyboard: IStoryboard | null;
  shots: IShot[];
  statuses: IShotStatus[];
  notSavedShotIds: Map<string, string>;
  flushDebouncedSaveShot: (shotId: string) => void;
  shotsDataRef: React.RefObject<IShot[]>;
  getShotRefData: (shotId: string) => IShot | undefined;
  addShot: () => void;
  deleteShot: (id: string) => void;
  updateShot: (id: string, data: IUpdateShot) => void;
  updateShotStatus: (shotId: string, statusId: string | null) => Promise<void>;
  setShots: React.Dispatch<React.SetStateAction<IShot[]>>;
  currentAspectRatio: typeof aspectRatios[0];
  setCurrentAspectRatio: React.Dispatch<React.SetStateAction<typeof aspectRatios[0]>>;
  getStoryboard: (projectId: string) => Promise<void>;
  changeShotOrder: (shotId: string, newOrder: number) => Promise<void>;
  uploadImage: (image: File, shotId: string, viewId: string) => Promise<string>;
  deleteImage: (url: string) => Promise<void>;
  addShotView: (shotId: string) => Promise<void>;
  deleteShotView: (shotId: string, viewId: string) => Promise<void>;
}

const StoryboardContext = createContext<StoryboardContextType | undefined>(undefined);

export const StoryboardProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const shotsDataRef = useRef<IShot[]>([]);
  const debouncedSaveShots = useRef(new Map<string, ReturnType<typeof debounce>>());

  const [storyboard, setStoryboard] = useState<IStoryboard | null>(null);
  const [shots, setShots] = useState<IShot[]>([]);
  const [statuses, setStatuses] = useState<IShotStatus[]>([]);
  const [notSavedShotIds, setNotSavedShotIds] = useState<Map<string, string>>(new Map());
  const [projectId, setProjectId] = useState<string | null>(null);
  const [currentAspectRatio, setCurrentAspectRatio] = useState(aspectRatios[0]);
  const location = useLocation();
  const { showSuccess } = useToast();

  // Create a debounced function to update shots state
  const debouncedSetShots = useMemo(() => 
    debounce((newShots: IShot[]) => {
      setShots([...newShots]);
    }, 300),
    []
  );

  const getStoryboard = useCallback(async (projectId: string) => {
    try {
      const { data } = await api.get(`/projects/${projectId}/storyboard`);
      
      if (data) {
        shotsDataRef.current = data.shots;

        setProjectId(projectId);
        setStoryboard({
          id: data.id,
          name: data.name,
          description: data.description,
          projectId: data.projectId,
          createdAt: data.createdAt,
          updatedAt: data.updatedAt,
        });
        setShots(data.shots);
        setStatuses(data.statuses);
      }
    } catch (error) {
      console.error('Error fetching shots:', error);
      throw error;
    }
  }, []);

  // Use useCallback for addShot to avoid dependency issues
  const addShot = useCallback(async () => {
    if (!projectId) {
      console.error('No project ID available');
      return;
    }

    try {
      const { data } = await api.post(`/projects/${projectId}/storyboard/create-shot`, {
        name: `Shot ${shots.length + 1}`,
        description: '',
      });

      if (data && data.shot) {
        const newShot = {
          id: data.shot.id,
          name: data.shot.name,
          description: data.shot.description || '',
          // image: data.shot.image,
          // canvasData: data.shot.canvasData,
          order: data.shot.order,
          duration: data.shot.duration,
          aspectRatio: data.shot.aspectRatio,
          status: data.shot.status,
          views: data.shot.views,
        };

        shotsDataRef.current.push(newShot);
        setShots([...shotsDataRef.current]);
        showSuccess(TOAST_MESSAGES.SHOT_CREATED);
      }
    } catch (error) {
      console.error('Error creating shot:', error);
    }
  }, [projectId, shots.length, showSuccess]);

  const deleteShot = useCallback(async (idToDelete: string) => {
    if (!projectId) {
      console.error('No project ID available');
      return;
    }

    try {
      const shotToDelete = shots.find(s => s.id === idToDelete);
      if (!shotToDelete) {
        console.error('Shot not found');
        return;
      }

      // Delete the shot from the backend
      await api.delete(`/projects/${projectId}/storyboard/shot/${idToDelete}/delete-shot`);

      // Update local state
      const updatedShots = shots
        .filter(s => s.id !== idToDelete)
        .map(s => {
          if (s.order > shotToDelete.order) {
            return { ...s, order: s.order - 1 };
          }
          return s;
        })
        .sort((a, b) => a.order - b.order);

      shotsDataRef.current = updatedShots;
      setShots(updatedShots);
      showSuccess(TOAST_MESSAGES.SHOT_DELETED);
    } catch (error) {
      console.error('Error deleting shot:', error);
    }
  }, [shots, projectId, showSuccess]);

  const saveShot = useCallback(async (shot: IShot) => {
    if (!projectId) {
      console.error('No project ID available');
      return;
    }
    try {
      setNotSavedShotIds(prev => {
        const newMap = new Map(prev);
        newMap.set(shot.id, 'saving');
        return newMap;
      });
      const { data } = await api.put(`/projects/${projectId}/storyboard/update-shot`, {
        id: shot.id,
        description: shot.description,
        views: shot.views?.map(view => ({
          id: view.id,
          image: view.image,
          canvasData: view.canvas?.getSaveData()
        }))
      });

      console.log('Shot saved successfully:', data);
      // Delete the debounced function after successful save
      debouncedSaveShots.current.delete(shot.id);
      setNotSavedShotIds(prev => {
        const newMap = new Map(prev);
        newMap.delete(shot.id);
        return newMap;
      });
    } catch (error) {
      console.error('Error saving shot:', error);
    }
  }, [projectId]);

  const debouncedSaveShot = useCallback((shot: IShot) => {
    if (!debouncedSaveShots.current.has(shot.id)) {
      debouncedSaveShots.current.set(
        shot.id,
        debounce(saveShot, 100000)
      );
      setNotSavedShotIds(prev => {
        const newMap = new Map(prev);
        newMap.set(shot.id, shot.id);
        return newMap;
      });
    }
    const debouncedFn = debouncedSaveShots.current.get(shot.id);
    if (debouncedFn) {
      debouncedFn(shot);
    }
  }, [saveShot]);

  const updateShot = useCallback((id: string, data: IUpdateShot) => {
      if (shotsDataRef.current && shotsDataRef.current.length > 0) {
        const oldShot = shotsDataRef.current.find(s => s.id === id);
        if (!oldShot) return;

        // Check if there are actual changes
        const hasChanges = Object.entries(data).some(([key, value]) => {
          // Skip canvas property as it contains circular references
          if (key === 'views') {
            return data.views?.some((subobject) => {
              const hasChanges = Object.entries(subobject).some(([subkey, subvalue]) => {
                const oldView = oldShot.views?.find(v => v.id === subobject.id);
                if (subkey === 'canvas') {
                  const newCanvasData = subobject.canvas?.getSaveData();
                  return oldView?.canvasData !== newCanvasData;
                }
                return JSON.stringify(oldView?.[subkey as keyof IShotView]) !== JSON.stringify(subvalue);
              })
              return hasChanges
            })
          }
          return JSON.stringify(oldShot[key as keyof IShot]) !== JSON.stringify(value);
        });

        if (data.views) {
          data.views = data.views.map((view, index) => {
            if (view.canvas) {
              const newCanvasData = view.canvas?.getSaveData();
              if (data.views) {
                data.views[index].canvasData = newCanvasData;
              }
              return { ...view, canvasData: newCanvasData };
            }
            return view;
          })
        }

        const newShot = { ...oldShot, ...data, views: oldShot.views?.map(view => ({ ...view, ...data.views?.find(v => v.id === view.id) })) };

        shotsDataRef.current = shotsDataRef.current.map((s) =>
          s.id === id ? newShot : s
        );

        // All shots are updated at once and stored in shotsDataRef.current
        // debounce makes sense because we want to save all shots at once
        // And reduce the number of rerenders
        debouncedSetShots(shotsDataRef.current);

        if (hasChanges) {
          debouncedSaveShot(newShot);
        }
      }
    },
    [debouncedSetShots, debouncedSaveShot]
  );

  const flushDebouncedSaveShot = (shotId: string) => {
    const debouncedFn = debouncedSaveShots.current.get(shotId);
    if (debouncedFn) {
      debouncedFn.flush();
    }
  };

  const changeShotOrder = useCallback(async (shotId: string, newOrder: number) => {
    if (!projectId) {
      console.error('No project ID available');
      return;
    }

    try {
      // Call the API to update the order
      await api.put(`/projects/${projectId}/storyboard/shot/${shotId}/change-order`, {
        newOrder
      });

      // Update local state
      const shotToMove = shots.find(s => s.id === shotId);
      if (!shotToMove) {
        console.error('Shot not found');
        return;
      }

      const oldOrder = shotToMove.order;
      const updatedShots = shots.map(shot => {
        if (shot.id === shotId) {
          return { ...shot, order: newOrder };
        }
        if (newOrder > oldOrder) {
          // Moving down - decrease order of shots in between
          if (shot.order > oldOrder && shot.order <= newOrder) {
            return { ...shot, order: shot.order - 1 };
          }
        } else if (newOrder < oldOrder) {
          // Moving up - increase order of shots in between
          if (shot.order >= newOrder && shot.order < oldOrder) {
            return { ...shot, order: shot.order + 1 };
          }
        }
        return shot;
      }).sort((a, b) => a.order - b.order);

      shotsDataRef.current = updatedShots;
      setShots(updatedShots);
    } catch (error) {
      console.error('Error changing shot order:', error);
      throw error;
    }
  }, [shots, projectId]);

  const updateShotStatus = useCallback(async (shotId: string, statusId: string | null) => {
    if (!projectId) {
      console.error('No project ID available');
      return;
    }

    try {
      // Call the API to update the status
      const { data } = await api.put(`/projects/${projectId}/storyboard/shot/${shotId}/change-status`, {
        statusId
      });

      if (data && data.shot) {
        // Update local state
        const updatedShots = shots.map(shot => 
          shot.id === shotId 
            ? { ...shot, status: data.shot.status }
            : shot
        );

        shotsDataRef.current = updatedShots;
        setShots(updatedShots);
        showSuccess('Shot status updated successfully');
      }
    } catch (error) {
      console.error('Error updating shot status:', error);
      throw error;
    }
  }, [shots, projectId, showSuccess]);

  const uploadImage = useCallback(async (image: File, shotId: string, viewId: string) => {
    if (!projectId) {
      console.error('No project ID available');
      throw new Error('No project ID available');
    }

    // Validate file using utility function
    const maxFileSize = 10 * 1024 * 1024; // 10MB
    const fileError = getFileSizeError(image, maxFileSize);
    if (fileError) {
      throw new Error(fileError);
    }

    try {
      const formData = new FormData();
      formData.append('image', image);
      formData.append('projectId', projectId);
      formData.append('shotId', shotId);
      formData.append('viewId', viewId);

      const response = await api.post('/upload-images', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      const { imageUrl } = response.data;
      showSuccess(TOAST_MESSAGES.IMAGE_UPLOADED);
      return imageUrl;
    } catch (error: any) {
      console.error('Error uploading image:', error);

      // Handle specific server errors
      if (error.response?.data?.error) {
        const serverError = error.response.data.error;

        // Check for Cloudinary file size limit error
        if (serverError.includes('File size too large') && serverError.includes('cloudinary.com')) {
          throw new Error('File size too large. Maximum size is 10MB for free accounts. Please compress your image or upgrade your plan.');
        }

        // Check for other server-side file size errors
        if (serverError.includes('File too large')) {
          throw new Error('File size too large. Please compress your image before uploading.');
        }

        // Check for file type errors
        if (serverError.includes('Only image files are allowed')) {
          throw new Error('Only image files are allowed. Please select a valid image file.');
        }

        // Return the server error message
        throw new Error(serverError);
      }

      // Handle network errors
      if (error.code === 'NETWORK_ERROR' || error.message.includes('Network Error')) {
        throw new Error('Network error. Please check your internet connection and try again.');
      }

      // Handle timeout errors
      if (error.code === 'ECONNABORTED' || error.message.includes('timeout')) {
        throw new Error('Upload timeout. Please try again with a smaller file or check your connection.');
      }

      // Generic error fallback
      throw new Error('Failed to upload image. Please try again.');
    }
  }, [projectId, showSuccess]);

  const deleteImage = useCallback(async (url: string) => {
    try {
      const response = await api.delete('/delete-images', {
        data: { url }
      });

      if (response.status !== 200) {
        console.error('Failed to delete image from server');
      } else {
        showSuccess(TOAST_MESSAGES.IMAGE_DELETED);
      }
    } catch (error) {
      console.error('Error deleting image:', error);
    }
  }, [showSuccess]);

  const addShotView = useCallback(async (shotId: string) => {
    if (!projectId) {
      console.error('No project ID available');
      return;
    }

    try {
      const { data } = await api.post(`/projects/${projectId}/storyboard/shot/${shotId}/views`, {
        name: '',
        description: ''
      });

      if (data && data.view) {
        // Update the shot in local state to include the new view
        const updatedShots = shots.map(shot => {
          if (shot.id === shotId) {
            const newView = {
              id: data.view.id,
              name: data.view.name,
              description: data.view.description,
              order: data.view.order,
              image: data.view.image,
              canvasData: data.view.canvasData
            };

            return {
              ...shot,
              views: [...(shot.views || []), newView]
            };
          }
          return shot;
        });

        shotsDataRef.current = updatedShots;
        setShots(updatedShots);
        showSuccess('Shot view created successfully');
      }
    } catch (error) {
      console.error('Error creating shot view:', error);
    }
  }, [projectId, shots, showSuccess]);

  const deleteShotView = useCallback(async (shotId: string, viewId: string) => {
    if (!projectId) {
      console.error('No project ID available');
      return;
    }

    try {
      await api.delete(`/projects/${projectId}/storyboard/shot/${shotId}/views/${viewId}`);

      // Update the shot in local state to remove the deleted view
      const updatedShots = shots.map(shot => {
        if (shot.id === shotId) {
          const updatedViews = (shot.views || []).filter(view => view.id !== viewId);
          return {
            ...shot,
            views: updatedViews
          };
        }
        return shot;
      });

      shotsDataRef.current = updatedShots;
      setShots(updatedShots);
      showSuccess('Shot view deleted successfully');
    } catch (error) {
      console.error('Error deleting shot view:', error);
    }
  }, [projectId, shots, showSuccess]);

  const getShotRefData = (shotId: string) => {
    return shotsDataRef.current.find(s => s.id === shotId);
  }

  // Cleanup debounced functions on unmount
  useEffect(() => {
    const handleBeforeUnload = () => {
      debouncedSaveShots.current.forEach(debouncedFn => {
        debouncedFn.flush();
      });
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      debouncedSetShots.cancel();
    };
  }, [debouncedSetShots]);

  // Flush debounced functions on navigation
  useEffect(() => {
    // Flush all pending saves
    debouncedSaveShots.current.forEach(debouncedFn => {
      debouncedFn.flush();
    });
    // Clear the Map after flushing
    debouncedSaveShots.current.clear();
  }, [location.pathname]); // This will trigger whenever the route changes

  const value = {
    storyboard,
    shots,
    statuses,
    getStoryboard,
    notSavedShotIds,
    flushDebouncedSaveShot,
    shotsDataRef,
    getShotRefData,
    addShot,
    deleteShot,
    updateShot,
    setShots,
    currentAspectRatio,
    setCurrentAspectRatio,
    changeShotOrder,
    updateShotStatus,
    uploadImage,
    deleteImage,
    addShotView,
    deleteShotView,
  };

  return (
    <StoryboardContext.Provider value={value}>
      {children}
    </StoryboardContext.Provider>
  );
};

export const useStoryboard = () => {
  const context = useContext(StoryboardContext);
  if (context === undefined) {
    throw new Error('useStoryboard must be used within a StoryboardProvider');
  }
  return context;
};
