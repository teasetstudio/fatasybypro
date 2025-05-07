'use client';

import { useDroppable } from '@dnd-kit/core';
import { Task, TaskStatus } from '../../types/task';
import TaskCard from './TaskCard';

interface TaskColumnProps {
  status: TaskStatus;
  tasks: Task[];
  onEditTask: (task: Task) => void;
}

const statusColors: Record<TaskStatus, string> = {
  TODO: 'bg-blue-100',
  IN_PROGRESS: 'bg-yellow-100',
  BLOCKED: 'bg-red-100',
  IN_REVIEW: 'bg-purple-100',
  DONE: 'bg-green-100',
};

const statusTitles: Record<TaskStatus, string> = {
  TODO: 'To Do',
  IN_PROGRESS: 'In Progress',
  BLOCKED: 'Blocked',
  IN_REVIEW: 'In Review',
  DONE: 'Done',
};

export default function TaskColumn({ status, tasks, onEditTask }: TaskColumnProps) {
  const { setNodeRef, isOver } = useDroppable({
    id: status,
  });

  return (
    <div
      ref={setNodeRef}
      className={`rounded-lg p-4 ${statusColors[status]} min-h-[calc(100vh-120px)] flex flex-col transition-all duration-200 ${
        isOver ? 'ring-2 ring-blue-500 ring-opacity-50' : ''
      }`}
    >
      <h2 className="text-xl font-semibold mb-4">{statusTitles[status]}</h2>
      <div className="space-y-4 flex-grow overflow-y-auto">
        {tasks.map((task) => (
          <TaskCard
            key={task.id}
            task={task}
            onEdit={() => onEditTask(task)}
          />
        ))}
        {tasks.length === 0 && (
          <div className={`h-20 border-2 border-dashed rounded-lg flex items-center justify-center text-gray-400 transition-colors duration-200 ${
            isOver ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
          }`}>
            {isOver ? 'Drop here' : 'Drop tasks here'}
          </div>
        )}
      </div>
    </div>
  );
} 