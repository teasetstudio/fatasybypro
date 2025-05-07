'use client';

import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Task, TaskPriority } from '../../types/task';

interface TaskCardProps {
  task: Task;
  onEdit: () => void;
}

const priorityColors: Record<TaskPriority, string> = {
  Low: 'bg-gray-100 text-gray-800',
  Medium: 'bg-yellow-100 text-yellow-800',
  High: 'bg-red-100 text-red-800',
};

export default function TaskCard({ task, onEdit }: TaskCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
    isOver,
  } = useSortable({
    id: task.id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 999 : 'auto',
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`relative bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow ${
        isDragging ? 'ring-2 ring-blue-500 ring-opacity-50' : ''
      } ${isOver ? 'border-t-2 border-blue-500' : ''}`}
    >
      <div {...attributes} {...listeners} className="cursor-move">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-semibold text-lg">{task.title}</h3>
          <span
            className={`px-2 py-1 rounded-full text-xs font-medium ${priorityColors[task.priority]}`}
          >
            {task.priority}
          </span>
        </div>
        <p className="text-gray-600 text-sm mb-4">{task.description}</p>
        <div className="flex justify-between items-center text-sm text-gray-500">
          <span>{task.assignee}</span>
          <span>{task.dueDate}</span>
        </div>
      </div>
      <button
        onClick={(e) => {
          e.stopPropagation();
          e.preventDefault();
          onEdit();
        }}
        className="mt-4 w-full px-3 py-1 text-sm text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded transition-colors"
      >
        Edit
      </button>
    </div>
  );
} 