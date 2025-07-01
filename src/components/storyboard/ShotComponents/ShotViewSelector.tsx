import React, { useState } from 'react';
import { IShot } from '@/types';
import { useStoryboard } from '@/context/StoryboardContext';
import { ConfirmationModal } from '@/components/library';

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
  const { addShotView, deleteShotView } = useStoryboard();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [viewToDelete, setViewToDelete] = useState<{ id: string; index: number; name: string } | null>(null);

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

              {shot.views && shot.views.length > 1 && (
                <button
                  onClick={() => handleDeleteView(view.id, viewIndex)}
                  className="group-hover/view:opacity-100 opacity-0 absolute -top-2 -right-2 w-5 h-5 rounded-full text-xs bg-gray-500 text-white hover:bg-red-600 transition-all flex items-center justify-center shadow-md"
                  title="Delete view"
                >
                  X
                </button>
              )}
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
    </>
  );
};

export default ShotViewSelector;
