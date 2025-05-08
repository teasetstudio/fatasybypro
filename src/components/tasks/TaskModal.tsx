'use client';

import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Task, TaskStatus, TaskPriority } from '../../types/task';
import { useFrames } from '../../context/FramesContext';
import { useAssets } from '../../context/AssetContext';
import { useTasks } from '../../context/TaskContext';

interface TaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (task: Omit<Task, 'id'>) => void;
  initialTask?: Task;
}

export default function TaskModal({
  isOpen,
  onClose,
  onSubmit,
  initialTask,
}: TaskModalProps) { 
  const modalRef = useRef<HTMLDivElement>(null);
  const { frames } = useFrames();
  const { dependencies, addDependency, removeDependency } = useAssets();
  const { tasks } = useTasks();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState<TaskStatus>('TODO');
  const [priority, setPriority] = useState<TaskPriority>('Medium');
  const [assignee, setAssignee] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [selectedFrames, setSelectedFrames] = useState<string[]>([]);
  const [selectedTasks, setSelectedTasks] = useState<string[]>([]);

  // Memoize related frames and tasks calculations
  const relatedFrames = useMemo(() => 
    frames.filter(frame => 
      dependencies.some(dep => 
        dep.sourceAssetId === initialTask?.id && 
        dep.targetAssetId === frame.id && 
        dep.relationshipType === 'task_in'
      )
    ),
    [frames, dependencies, initialTask?.id]
  );

  const relatedTasks = useMemo(() => 
    tasks.filter(task => 
      dependencies.some(dep => 
        dep.sourceAssetId === initialTask?.id && 
        dep.targetAssetId === task.id && 
        dep.relationshipType === 'depends_on'
      )
    ),
    [tasks, dependencies, initialTask?.id]
  );

  // Initialize selected frames and tasks when editing an existing task
  useEffect(() => {
    if (initialTask) {
      const frameIds = relatedFrames.map(frame => frame.id);
      const taskIds = relatedTasks.map(task => task.id);
      setSelectedFrames(frameIds);
      setSelectedTasks(taskIds);
    } else {
      setSelectedFrames([]);
      setSelectedTasks([]);
    }
  }, [initialTask, relatedFrames, relatedTasks]);

  const handleFrameSelection = (frameId: string) => {
    setSelectedFrames(prev => {
      const newSelection = prev.includes(frameId)
        ? prev.filter(id => id !== frameId)
        : [...prev, frameId];
      
      // Only modify dependencies if we're editing an existing task
      if (initialTask) {
        if (prev.includes(frameId)) {
          removeDependency(initialTask.id, frameId);
        } else {
          addDependency(initialTask.id, frameId, 'task_in');
        }
      }
      
      return newSelection;
    });
  };

  const handleTaskSelection = (taskId: string) => {
    setSelectedTasks(prev => {
      const newSelection = prev.includes(taskId)
        ? prev.filter(id => id !== taskId)
        : [...prev, taskId];
      
      // Only modify dependencies if we're editing an existing task
      if (initialTask) {
        if (prev.includes(taskId)) {
          removeDependency(initialTask.id, taskId);
        } else {
          addDependency(initialTask.id, taskId, 'depends_on');
        }
      }
      
      return newSelection;
    });
  };

  useEffect(() => {
    if (initialTask) {
      setTitle(initialTask.title);
      setDescription(initialTask.description);
      setStatus(initialTask.status);
      setPriority(initialTask.priority);
      setAssignee(initialTask.assignee);
      setDueDate(initialTask.dueDate);
    } else {
      setTitle('');
      setDescription('');
      setStatus('TODO');
      setPriority('Medium');
      setAssignee('');
      setDueDate('');
    }
  }, [initialTask]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newTask = {
      title,
      description,
      status,
      priority,
      assignee,
      dueDate,
    };
    
    // If we're creating a new task, we need to wait for the task to be created
    // before we can assign frames and tasks. The parent component should handle this.
    if (!initialTask) {
      // Pass the selected frames and tasks to the parent component
      (onSubmit as any)(newTask, selectedFrames, selectedTasks);
    }
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div ref={modalRef} className="bg-white rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
        <h2 className="text-2xl font-bold mb-4">
          {initialTask ? 'Edit Task' : 'Create New Task'}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700">
              Title
            </label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700">
              Description
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              rows={3}
            />
          </div>

          <div>
            <label htmlFor="status" className="block text-sm font-medium text-gray-700">
              Status
            </label>
            <select
              id="status"
              value={status}
              onChange={(e) => setStatus(e.target.value as TaskStatus)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              <option value="TODO">To Do</option>
              <option value="IN_PROGRESS">In Progress</option>
              <option value="DONE">Done</option>
            </select>
          </div>

          <div>
            <label htmlFor="priority" className="block text-sm font-medium text-gray-700">
              Priority
            </label>
            <select
              id="priority"
              value={priority}
              onChange={(e) => setPriority(e.target.value as TaskPriority)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
            </select>
          </div>

          <div>
            <label htmlFor="assignee" className="block text-sm font-medium text-gray-700">
              Assignee
            </label>
            <input
              type="text"
              id="assignee"
              value={assignee}
              onChange={(e) => setAssignee(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          <div>
            <label htmlFor="dueDate" className="block text-sm font-medium text-gray-700">
              Due Date
            </label>
            <input
              type="date"
              id="dueDate"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          {/* Related Frames Section */}
          <div className="border-t pt-4 mt-4">
            <h3 className="text-sm font-medium text-gray-700 mb-3">Related Frames</h3>
            <div className="max-h-48 overflow-y-auto border rounded-md">
              {frames.map((frame, index) => (
                <div
                  key={frame.id}
                  className={`flex items-center p-2 hover:bg-gray-50 cursor-pointer ${
                    index !== frames.length - 1 ? 'border-b' : ''
                  }`}
                  onClick={() => handleFrameSelection(frame.id)}
                >
                  <input
                    type="checkbox"
                    checked={selectedFrames.includes(frame.id)}
                    onChange={() => {}}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <span className="ml-3 text-sm">
                    Frame {index + 1}
                    {frame.description && (
                      <span className="text-gray-500 ml-2">- {frame.description}</span>
                    )}
                  </span>
                </div>
              ))}
            </div>
            <p className="mt-2 text-xs text-gray-500">
              {selectedFrames.length} frame{selectedFrames.length !== 1 ? 's' : ''} selected
            </p>
          </div>

          {/* Related Tasks Section */}
          <div className="border-t pt-4 mt-4">
            <h3 className="text-sm font-medium text-gray-700 mb-3">Related Tasks</h3>
            <div className="max-h-48 overflow-y-auto border rounded-md">
              {tasks
                .filter(task => task.id !== initialTask?.id) // Exclude current task
                .map(task => (
                  <div
                    key={task.id}
                    className="flex items-center p-2 hover:bg-gray-50 cursor-pointer border-b last:border-b-0"
                    onClick={() => handleTaskSelection(task.id)}
                  >
                    <input
                      type="checkbox"
                      checked={selectedTasks.includes(task.id)}
                      onChange={() => {}}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <div className="ml-3">
                      <span className="text-sm font-medium">{task.title}</span>
                      <div className="flex items-center gap-2 mt-1">
                        <span className={`text-xs px-2 py-0.5 rounded ${
                          task.priority === 'High' ? 'bg-red-100 text-red-700' :
                          task.priority === 'Medium' ? 'bg-yellow-100 text-yellow-700' :
                          'bg-green-100 text-green-700'
                        }`}>
                          {task.priority}
                        </span>
                        <span className={`text-xs px-2 py-0.5 rounded ${
                          task.status === 'TODO' ? 'bg-gray-100 text-gray-700' :
                          task.status === 'IN_PROGRESS' ? 'bg-blue-100 text-blue-700' :
                          'bg-green-100 text-green-700'
                        }`}>
                          {task.status}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
            <p className="mt-2 text-xs text-gray-500">
              {selectedTasks.length} task{selectedTasks.length !== 1 ? 's' : ''} selected
            </p>
          </div>

          <div className="flex justify-end space-x-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              {initialTask ? 'Update' : 'Create'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 