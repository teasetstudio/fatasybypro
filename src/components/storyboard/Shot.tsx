import { useState } from 'react';
import { IShot } from '@/types';
import { useStoryboard } from '@/context/StoryboardContext';
import Indicators from './ShotComponents/Indicators';
import ShotView from './ShotComponents/ShotView';
import ShotViewSelector from './ShotComponents/ShotViewSelector';

interface Props {
  shot: IShot;
  index: number;
  brushColor: string;
  brushRadius: number;
  brushSmoothness: number;
  onPreview: (id: string) => void;
}

const Shot = ({
  shot,
  index,
  brushColor,
  brushRadius,
  brushSmoothness,
  onPreview,
}: Props) => {
  const { currentAspectRatio, updateShot } = useStoryboard();
  const [localDescription, setLocalDescription] = useState(shot.description);
  const [currentViewIndex, setCurrentViewIndex] = useState(0);

  const handleDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newDescription = e.target.value;
    setLocalDescription(newDescription);
    updateShot(shot.id, { description: newDescription });
  };

  const handleViewChange = (newIndex: number) => {
    setCurrentViewIndex(newIndex);
  };

  const currentView = shot.views?.[currentViewIndex];

  return (
    <div 
      className={`flex flex-col bg-white rounded-lg shadow-md p-4 relative ${currentAspectRatio.cardWidth}`}
    >
      {/* Shot number and unsaved indicator container */}
      <Indicators shot={shot} index={index} />

      {/* Current view */}
      {currentView && (
        <ShotView 
          key={currentView.id}
          shot={shot}
          view={currentView}
          brushColor={brushColor}
          brushRadius={brushRadius}
          brushSmoothness={brushSmoothness}
          onPreview={onPreview}
        />
      )}

      {/* View selector */}
      <ShotViewSelector
        shot={shot}
        currentViewIndex={currentViewIndex}
        onViewChange={handleViewChange}
      />

      {/* Description */}
      <textarea
        value={localDescription}
        onChange={handleDescriptionChange}
        placeholder="Enter description"
        className="w-full h-24 p-2 border border-gray-300 rounded resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      />
    </div>
  );
};

export default Shot;
