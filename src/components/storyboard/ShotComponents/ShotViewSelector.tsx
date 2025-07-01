import React, { useState } from 'react';
import { IShot } from '@/types';
import { useStoryboard } from '@/context/StoryboardContext';
import { ConfirmationModal, Tooltip } from '@/components/library';
import { Dialog, DialogPanel, DialogTitle } from '@headlessui/react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  horizontalListSortingStrategy,
} from '@dnd-kit/sortable';
import {
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

interface Props {
  shot: IShot;
  currentViewIndex: number;
  onViewChange: (index: number) => void;
}

interface SortableViewItemProps {
  view: any;
  viewIndex: number;
  currentViewIndex: number;
  onViewChange: (index: number) => void;
  onEditView: (viewId: string, viewName: string) => void;
  onDeleteView: (viewId: string, viewIndex: number) => void;
  canDelete: boolean;
}

const SortableViewItem: React.FC<SortableViewItemProps> = ({
  view,
  viewIndex,
  currentViewIndex,
  onViewChange,
  onEditView,
  onDeleteView,
  canDelete,
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: view.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div 
      ref={setNodeRef} 
      style={style}
      className="relative group/view border border-gray-100 rounded-md p-1 flex-shrink-0"
    >
      <div className="inline-block relative">
        <button
          onClick={() => onViewChange(viewIndex)}
          className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
            viewIndex === currentViewIndex
              ? 'bg-blue-500 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          {view.name}
        </button>

        <div className="absolute -top-3 -right-1 group-hover/view:-top-6 group-hover/view:opacity-100 opacity-0 transition-all duration-150 flex gap-1">
          {/* Drag Handle */}
          <button
            {...attributes}
            {...listeners}
            className="w-6 h-6 rounded-md bg-gray-300/90 backdrop-blur-sm text-gray-600 hover:bg-gray-500 hover:text-white hover:scale-105 transition-all duration-200 flex items-center justify-center shadow-md cursor-grab active:cursor-grabbing"
            title="Drag to reorder"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8h16M4 16h16" />
            </svg>
          </button>
          
          <button
            onClick={() => onEditView(view.id, view.name || `View ${viewIndex + 1}`)}
            className="w-6 h-6 rounded-md bg-blue-300/90 backdrop-blur-sm text-white hover:bg-blue-600 hover:scale-105 transition-all duration-200 flex items-center justify-center shadow-md"
            title="Edit view"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </button>
          
          {canDelete && (
            <button
              onClick={() => onDeleteView(view.id, viewIndex)}
              className="w-6 h-6 rounded-md bg-red-300/90 backdrop-blur-sm text-white hover:bg-red-600 hover:scale-105 transition-all duration-200 flex items-center justify-center shadow-md"
              title="Delete view"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

const ShotViewSelector: React.FC<Props> = ({
  shot,
  currentViewIndex,
  onViewChange,
}) => {
  const { addShotView, deleteShotView, updateShotView, reorderShotViews } = useStoryboard();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [viewToDelete, setViewToDelete] = useState<{ id: string; index: number; name: string } | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [viewToEdit, setViewToEdit] = useState<{ id: string; name: string } | null>(null);
  const [editName, setEditName] = useState('');

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;

    if (active.id !== over?.id) {
      const oldIndex = shot.views?.findIndex(view => view.id === active.id) ?? -1;
      const newIndex = shot.views?.findIndex(view => view.id === over?.id) ?? -1;

      if (oldIndex !== -1 && newIndex !== -1 && shot.views) {
        const reorderedViews = arrayMove(shot.views, oldIndex, newIndex);
        
        try {
          await reorderShotViews(shot.id, reorderedViews);
          
          // Update the current view index if the active view was moved
          if (oldIndex === currentViewIndex) {
            onViewChange(newIndex);
          } else if (oldIndex < currentViewIndex && newIndex >= currentViewIndex) {
            onViewChange(currentViewIndex - 1);
          } else if (oldIndex > currentViewIndex && newIndex <= currentViewIndex) {
            onViewChange(currentViewIndex + 1);
          }
        } catch (error) {
          console.error('Error reordering views:', error);
        }
      }
    }
  };

  const handleAddView = async () => {
    try {
      await addShotView(shot.id);
      if (shot.views) {
        onViewChange(shot.views.length);
      }
    } catch (error) {
      console.error('Error adding new view:', error);
    }
  };

  const handleDeleteView = (viewId: string, viewIndex: number) => {
    const view = shot.views?.[viewIndex];
    if (view) {
      setViewToDelete({
        id: viewId,
        index: viewIndex,
        name: view.name || `View ${viewIndex + 1}`
      });
      setShowDeleteModal(true);
    }
  };

  const confirmDeleteView = async () => {
    if (!viewToDelete) return;

    try {
      await deleteShotView(shot.id, viewToDelete.id);

      if (shot.views && shot.views.length > 1) {
        if (viewToDelete.index === currentViewIndex) {
          onViewChange(Math.max(0, currentViewIndex - 1));
        } else if (viewToDelete.index < currentViewIndex) {
          onViewChange(currentViewIndex - 1);
        }
      }
    } catch (error) {
      console.error('Error deleting view:', error);
    } finally {
      setShowDeleteModal(false);
      setViewToDelete(null);
    }
  };

  const cancelDeleteView = () => {
    setShowDeleteModal(false);
    setViewToDelete(null);
  };

  const handleEditView = (viewId: string, viewName: string) => {
    setViewToEdit({ id: viewId, name: viewName });
    setEditName(viewName);
    setShowEditModal(true);
  };

  const confirmEditView = async () => {
    if (!viewToEdit || !editName.trim()) return;

    try {
      await updateShotView(shot.id, viewToEdit.id, { name: editName.trim() });
      setShowEditModal(false);
      setViewToEdit(null);
      setEditName('');
    } catch (error) {
      console.error('Error updating view:', error);
    }
  };

  const cancelEditView = () => {
    setShowEditModal(false);
    setViewToEdit(null);
    setEditName('');
  };

  if (!shot.views) {
    return null;
  }

    return (
    <>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={shot.views.map(view => view.id)}
          strategy={horizontalListSortingStrategy}
        >
          {/* overflow-x-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 pb-1 min-w-0 */}
          <div className="flex gap-1 mb-1 items-center flex-wrap">
            {shot.views.map((view, viewIndex) => (
              <SortableViewItem
                key={view.id}
                view={view}
                viewIndex={viewIndex}
                currentViewIndex={currentViewIndex}
                onViewChange={onViewChange}
                onEditView={handleEditView}
                onDeleteView={handleDeleteView}
                canDelete={!!(shot.views && shot.views.length > 1)}
              />
            ))}
            <Tooltip content="Add Shot View">
              <button
                onClick={handleAddView}
                className="w-7 h-7 rounded-lg bg-gray-100 text-gray-500 hover:bg-gray-200 hover:text-gray-700 transition-all duration-200 flex items-center justify-center border border-gray-200"
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
              </button>
            </Tooltip>
          </div>
        </SortableContext>
      </DndContext>

      <ConfirmationModal
        isOpen={showDeleteModal}
        title="Delete View"
        message={`Are you sure you want to delete "${viewToDelete?.name}"? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        onConfirm={confirmDeleteView}
        onCancel={cancelDeleteView}
        variant="danger"
      />

      {/* Edit View Modal */}
      <Dialog
        open={showEditModal}
        onClose={cancelEditView}
        className="relative z-50"
      >
        {/* Background overlay */}
        <div className="fixed inset-0 bg-black/30" aria-hidden="true" />

        {/* Full-screen container to center the panel */}
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <DialogPanel className="mx-auto max-w-sm rounded-lg bg-white p-6 shadow-xl">
            <DialogTitle className="text-lg font-medium text-gray-900 mb-4">
              Edit View Name
            </DialogTitle>

            <div className="mb-4">
              <label htmlFor="viewName" className="block text-sm font-medium text-gray-700 mb-2">
                View Name
              </label>
              <input
                type="text"
                id="viewName"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter view name"
              />
            </div>

            <div className="flex justify-end space-x-3">
              <button
                onClick={cancelEditView}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
              >
                Cancel
              </button>
              <button
                onClick={confirmEditView}
                disabled={!editName.trim()}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Save
              </button>
            </div>
          </DialogPanel>
        </div>
      </Dialog>
    </>
  );
};

export default ShotViewSelector;
