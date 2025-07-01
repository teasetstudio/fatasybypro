import React, { useState } from 'react';
import { IShot } from '@/types';
import { useStoryboard } from '@/context/StoryboardContext';
import { ConfirmationModal } from '@/components/library';
import { Dialog } from '@headlessui/react';

interface Props {
  shot: IShot;
  currentViewIndex: number;
  onViewChange: (index: number) => void;
}

const ShotViewSelector: React.FC<Props> = ({
  shot,
  currentViewIndex,
  onViewChange,
}) => {
  const { addShotView, deleteShotView, updateShotView } = useStoryboard();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [viewToDelete, setViewToDelete] = useState<{ id: string; index: number; name: string } | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [viewToEdit, setViewToEdit] = useState<{ id: string; name: string } | null>(null);
  const [editName, setEditName] = useState('');

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
      <div className="flex gap-1 mb-1 items-center flex-wrap">
        {shot.views.map((view, viewIndex) => (
          <div key={view.id} className="relative group/view border border-gray-100 rounded-md p-1">
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
                <button
                  onClick={() => handleEditView(view.id, view.name || `View ${viewIndex + 1}`)}
                  className="w-6 h-6 rounded-md bg-blue-300/90 backdrop-blur-sm text-white hover:bg-blue-600 hover:scale-105 transition-all duration-200 flex items-center justify-center shadow-md"
                  title="Edit view"
                >
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </button>
                {shot.views && shot.views.length > 1 && (
                  <button
                    onClick={() => handleDeleteView(view.id, viewIndex)}
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
        ))}
        <button
          onClick={handleAddView}
          className="px-3 py-1 rounded text-sm font-medium border-2 border-green-500 text-green-500 hover:bg-green-500 hover:text-white transition-colors"
        >
          + Add View
        </button>
      </div>

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
          <Dialog.Panel className="mx-auto max-w-sm rounded-lg bg-white p-6 shadow-xl">
            <Dialog.Title className="text-lg font-medium text-gray-900 mb-4">
              Edit View Name
            </Dialog.Title>

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
          </Dialog.Panel>
        </div>
      </Dialog>
    </>
  );
};

export default ShotViewSelector;
