import { IShot } from '@/types';
import { ConfirmationModal, Tooltip } from '@/components/library';
import { useState } from 'react';
import { useStoryboard } from '@/context';

interface IProps {
  shot: IShot;
  isDrawing: boolean;
  onPreview: (id: string) => void;
  handleUndo: () => void;
  handleClear: () => void;
  handleImageUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
  removeBackgroundImage: () => void;
  isBackgroundImage: boolean;
  isImageLoading: boolean;
  isDeletingImage: boolean;
}

const ShotViewControls = ({ shot, isDrawing, onPreview, handleUndo, handleClear, handleImageUpload, removeBackgroundImage, isBackgroundImage, isImageLoading, isDeletingImage }: IProps) => {
  const { deleteShot } = useStoryboard();

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  return (
    <div className='flex justify-between'>
      <div>{isDrawing && <p className='text-sm text-gray-500'>Drawing...</p>}</div>

      <div className="mb-3 flex justify-end space-x-2">
        <button
          onClick={() => onPreview(shot.id)}
          className="bg-indigo-500 hover:bg-indigo-600 text-white px-2 py-1 rounded text-sm flex items-center"
          aria-label="Preview shot"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
            <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
            <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
          </svg>
        </button>
        <button
          onClick={handleUndo}
          className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-2 py-1 rounded text-sm"
          aria-label="Undo last stroke"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M7.707 3.293a1 1 0 010 1.414L5.414 7H11a7 7 0 017 7v2a1 1 0 11-2 0v-2a5 5 0 00-5-5H5.414l2.293 2.293a1 1 0 11-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
        </button>
        <button
          onClick={handleClear}
          className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-2 py-1 rounded text-sm"
          aria-label="Clear canvas"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
          </svg>
        </button>

        {/* Image Upload Controls */}
        {isBackgroundImage ? (
          <button
            onClick={removeBackgroundImage}
            disabled={isDeletingImage}
            className={`bg-red-100 hover:bg-red-200 text-red-700 px-2 py-1 rounded text-sm inline-flex items-center ${isDeletingImage ? 'opacity-50 cursor-not-allowed' : ''}`}
            aria-label="Remove background image"
          >
            {isDeletingImage ? (
              <svg className="animate-spin h-4 w-4 mr-1" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            )}
            {isDeletingImage ? 'Deleting...' : 'Delete Image'}
          </button>
        ) : (
          <Tooltip content="Upload background image (max 10MB)">
            <label className="relative cursor-pointer group/upload">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
                aria-label="Upload background image (max 10MB)"
                disabled={isImageLoading}
              />
              <span className={`bg-blue-500 hover:bg-blue-600 text-white px-2 py-1 rounded text-sm inline-flex items-center ${isImageLoading ? 'opacity-50 cursor-not-allowed' : ''}`}>
                {isImageLoading ? (
                  <svg className="animate-spin h-4 w-4 mr-1" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                  </svg>
                )}
                {isImageLoading ? 'Uploading...' : 'Upload Image'}
              </span>
            </label>
          </Tooltip>
        )}
        <button
          onClick={() => setIsDeleteModalOpen(true)}
          className="bg-red-100 hover:bg-red-200 text-red-700 px-2 py-1 rounded text-sm inline-flex items-center"
          aria-label="Delete shot"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
        </button>
      </div>

      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        isOpen={isDeleteModalOpen}
        title="Delete shot"
        message="Are you sure you want to delete this shot? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        onConfirm={async () => {
          setIsDeleting(true);
          try {
            await deleteShot(shot.id);
            setIsDeleteModalOpen(false);
          } finally {
            setIsDeleting(false);
          }
        }}
        onCancel={() => setIsDeleteModalOpen(false)}
        variant="danger"
        isLoading={isDeleting}
      />
    </div>
  )
}

export default ShotViewControls