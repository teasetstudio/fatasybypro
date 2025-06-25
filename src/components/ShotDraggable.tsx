import React, { useState } from 'react';
import { useDraggable, useDroppable } from "@dnd-kit/core";
import Shot from './Shot';
import { IShot } from '../types';

interface Props {
  shot: IShot;
  index: number;
  brushColor: string;
  brushRadius: number;
  brushSmoothness: number;
  onPreview: (id: string) => void;
  isDisabled?: boolean
}

const ShotDraggable = (props: Props) => {
  const [dragDirection, setDragDirection] = useState<'left' | 'right' | null>(null);

  const { attributes, listeners, setNodeRef: setDraggableRef, transform, isDragging } = useDraggable({
    id: props.shot.id,
    disabled: props.isDisabled,
  });

  const { setNodeRef: setDroppableRef, isOver } = useDroppable({
    id: props.shot.id,
  });

  const style = transform ? {
    transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
    zIndex: 1,
  } : undefined;

  // Combine refs for drag and drop
  const setRefs = (element: HTMLDivElement) => {
    setDraggableRef(element);
    setDroppableRef(element);
  };

  // Update drag direction based on transform
  React.useEffect(() => {
    if (transform) {
      setDragDirection(transform.x > 0 ? 'right' : 'left');
    } else {
      setDragDirection(null);
    }
  }, [transform]);

  return (
    <div className="relative">
      {/* Left Gap Indicator */}
      {isOver && !isDragging && dragDirection === 'right' && (
        <div className="absolute -left-3 top-0 bottom-0 w-6 bg-green-500 bg-opacity-50 rounded-full" />
      )}

      {/* Right Gap Indicator */}
      {isOver && !isDragging && dragDirection === 'left' && (
        <div className="absolute -right-3 top-0 bottom-0 w-6 bg-green-500 bg-opacity-50 rounded-full" />
      )}

      <div 
        ref={setRefs}
        style={style}
        className="relative group"
      >
        {/* Drag Handle */}
        <div 
          {...attributes} 
          {...listeners}
          className="absolute -left-8 top-1/2 -translate-y-1/2 w-6 h-6 bg-gray-100 rounded-full flex items-center justify-center cursor-move opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-gray-200"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
            <path d="M7 2a2 2 0 1 1-4 0 2 2 0 0 1 4 0zM7 10a2 2 0 1 1-4 0 2 2 0 0 1 4 0zM7 18a2 2 0 1 1-4 0 2 2 0 0 1 4 0zM17 2a2 2 0 1 1-4 0 2 2 0 0 1 4 0zM17 10a2 2 0 1 1-4 0 2 2 0 0 1 4 0zM17 18a2 2 0 1 1-4 0 2 2 0 0 1 4 0z" />
          </svg>
        </div>

        {/* Shot Component */}
        <div className={`transition-opacity duration-200 ${isDragging ? 'opacity-50' : 'opacity-100'}`}>
          <Shot {...props} />
        </div>

        {/* Placeholder */}
        {isDragging && (
          <div className="absolute inset-0 border-2 border-dashed border-blue-400 bg-blue-50 bg-opacity-50 rounded-lg" />
        )}

        {/* Drop Indicator */}
        {isOver && !isDragging && (
          <div className="absolute inset-0 border-2 border-solid border-green-500 bg-green-50 bg-opacity-50 rounded-lg animate-pulse" />
        )}
      </div>
    </div>
  );
};

export default ShotDraggable;
