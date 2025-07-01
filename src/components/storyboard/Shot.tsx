import { useState } from 'react';
import { IShot } from '../../types';
import { useStoryboard } from '../../context/StoryboardContext';
import Indicators from './ShotComponents/Indicators';
import ShotView from './ShotComponents/ShotView';

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

  const handleDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newDescription = e.target.value;
    setLocalDescription(newDescription);
    updateShot(shot.id, { description: newDescription });
  };

  return (
    <div 
      className={`flex flex-col bg-white rounded-lg shadow-md p-4 relative ${currentAspectRatio.cardWidth} mb-6`}
    >
      {/* Shot number and unsaved indicator container */}
      <Indicators shot={shot} index={index} />

      {shot.views?.map((view, viewIndex) => (
        <ShotView 
          key={view.id}
          shot={shot}
          view={view}
          shotIndex={index}
          viewIndex={viewIndex}
          brushColor={brushColor}
          brushRadius={brushRadius}
          brushSmoothness={brushSmoothness}
          onPreview={onPreview}
        />
      ))}

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
