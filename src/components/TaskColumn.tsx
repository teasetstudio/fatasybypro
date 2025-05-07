import React from 'react';
import { useDroppable } from '@dnd-kit/core';

interface TaskColumnProps {
  id: string;
  title: string;
  color: string;
  children: React.ReactNode;
}

export const TaskColumn = ({ id, title, color, children }: TaskColumnProps) => {
  const { setNodeRef } = useDroppable({
    id,
  });

  return (
    <div
      ref={setNodeRef}
      className={`flex-shrink-0 w-80 ${color} rounded-lg p-4`}
    >
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-semibold text-gray-800">{title}</h2>
        <span className="text-sm text-gray-600">
          {React.Children.count(children)} tasks
        </span>
      </div>
      <div className="space-y-2">{children}</div>
    </div>
  );
}; 