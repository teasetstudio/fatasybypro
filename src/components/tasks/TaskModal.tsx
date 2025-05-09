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
  const frameDropdownRef = useRef<HTMLDivElement>(null);
  const taskDropdownRef = useRef<HTMLDivElement>(null);
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
  const [frameSearch, setFrameSearch] = useState('');
  const [taskSearch, setTaskSearch] = useState('');
  const [showFrameDropdown, setShowFrameDropdown] = useState(false);
  const [showTaskDropdown, setShowTaskDropdown] = useState(false);
  const [showStatusDropdown, setShowStatusDropdown] = useState(false);
  const [showPriorityDropdown, setShowPriorityDropdown] = useState(false);
  const statusDropdownRef = useRef<HTMLDivElement>(null);
  const priorityDropdownRef = useRef<HTMLDivElement>(null);

  const statusOptions = [
    { value: 'TODO', label: 'To Do', color: 'bg-gray-400' },
    { value: 'IN_PROGRESS', label: 'In Progress', color: 'bg-blue-400' },
    { value: 'DONE', label: 'Done', color: 'bg-green-400' }
  ] as const;

  const priorityOptions = [
    { value: 'Low', label: 'Low', color: 'bg-green-400' },
    { value: 'Medium', label: 'Medium', color: 'bg-yellow-400' },
    { value: 'High', label: 'High', color: 'bg-red-400' }
  ] as const;

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

    const handleDropdownClickOutside = (event: MouseEvent) => {
      // Handle frame dropdown
      if (showFrameDropdown && frameDropdownRef.current && !frameDropdownRef.current.contains(event.target as Node)) {
        setShowFrameDropdown(false);
      }
      // Handle task dropdown
      if (showTaskDropdown && taskDropdownRef.current && !taskDropdownRef.current.contains(event.target as Node)) {
        setShowTaskDropdown(false);
      }
      // Handle status dropdown
      if (showStatusDropdown && statusDropdownRef.current && !statusDropdownRef.current.contains(event.target as Node)) {
        setShowStatusDropdown(false);
      }
      // Handle priority dropdown
      if (showPriorityDropdown && priorityDropdownRef.current && !priorityDropdownRef.current.contains(event.target as Node)) {
        setShowPriorityDropdown(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('mousedown', handleDropdownClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('mousedown', handleDropdownClickOutside);
    };
  }, [isOpen, onClose, showFrameDropdown, showTaskDropdown, showStatusDropdown, showPriorityDropdown]);

  // Filter frames based on search
  const filteredFrames = useMemo(() => 
    frames.filter(frame => 
      frame.description?.toLowerCase().includes(frameSearch.toLowerCase()) ||
      `Frame ${frames.indexOf(frame) + 1}`.toLowerCase().includes(frameSearch.toLowerCase())
    ),
    [frames, frameSearch]
  );

  // Filter tasks based on search
  const filteredTasks = useMemo(() => 
    tasks
      .filter(task => task.id !== initialTask?.id)
      .filter(task => 
        task.title.toLowerCase().includes(taskSearch.toLowerCase()) ||
        task.description?.toLowerCase().includes(taskSearch.toLowerCase())
      ),
    [tasks, taskSearch, initialTask?.id]
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newTask = {
      title,
      description,
      status,
      priority,
      assignee,
      dueDate: dueDate || undefined, // Make dueDate optional
    };

    if (!initialTask) {
      (onSubmit as any)(newTask, selectedFrames, selectedTasks);
    }
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div ref={modalRef} className="bg-white rounded-lg p-8 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">
          {initialTask ? 'Edit Task' : 'Create New Task'}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="title" className="block text-sm font-semibold text-gray-700 mb-2">
              Title
            </label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-semibold text-gray-700 mb-2">
              Description
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              rows={3}
            />
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div className="relative" ref={statusDropdownRef}>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Status
              </label>
              <button
                type="button"
                onClick={() => setShowStatusDropdown(!showStatusDropdown)}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-left flex items-center justify-between"
              >
                <div className="flex items-center gap-2">
                  <span className={`inline-block w-3 h-3 rounded-full ${statusOptions.find(opt => opt.value === status)?.color}`}></span>
                  <span>{statusOptions.find(opt => opt.value === status)?.label}</span>
                </div>
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {showStatusDropdown && (
                <div className="absolute z-[100] w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg">
                  {statusOptions.map((option) => (
                    <div
                      key={option.value}
                      className="flex items-center gap-2 px-4 py-2 hover:bg-gray-50 cursor-pointer"
                      onClick={() => {
                        setStatus(option.value as TaskStatus);
                        setShowStatusDropdown(false);
                      }}
                    >
                      <span className={`inline-block w-3 h-3 rounded-full ${option.color}`}></span>
                      <span>{option.label}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="relative" ref={priorityDropdownRef}>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Priority
              </label>
              <button
                type="button"
                onClick={() => setShowPriorityDropdown(!showPriorityDropdown)}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-left flex items-center justify-between"
              >
                <div className="flex items-center gap-2">
                  <span className={`inline-block w-3 h-3 rounded-full ${priorityOptions.find(opt => opt.value === priority)?.color}`}></span>
                  <span>{priorityOptions.find(opt => opt.value === priority)?.label}</span>
                </div>
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {showPriorityDropdown && (
                <div className="absolute z-[100] w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg">
                  {priorityOptions.map((option) => (
                    <div
                      key={option.value}
                      className="flex items-center gap-2 px-4 py-2 hover:bg-gray-50 cursor-pointer"
                      onClick={() => {
                        setPriority(option.value as TaskPriority);
                        setShowPriorityDropdown(false);
                      }}
                    >
                      <span className={`inline-block w-3 h-3 rounded-full ${option.color}`}></span>
                      <span>{option.label}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div>
              <label htmlFor="assignee" className="block text-sm font-semibold text-gray-700 mb-2">
                Assignee
              </label>
              <input
                type="text"
                id="assignee"
                value={assignee}
                onChange={(e) => setAssignee(e.target.value)}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label htmlFor="dueDate" className="block text-sm font-semibold text-gray-700 mb-2">
                Due Date (Optional)
              </label>
              <input
                type="date"
                id="dueDate"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          {/* Related Frames Dropdown */}
          <div className="relative">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Related Frames
            </label>
            <div className="relative" ref={frameDropdownRef}>
              <input
                type="text"
                value={frameSearch}
                onChange={(e) => setFrameSearch(e.target.value)}
                onFocus={() => setShowFrameDropdown(true)}
                placeholder="Search frames..."
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              {showFrameDropdown && (
                <div className="fixed z-[100] mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto" style={{ width: modalRef.current?.querySelector('.relative')?.getBoundingClientRect().width + 'px' }}>
                  {filteredFrames.map((frame) => (
                    <div
                      key={frame.id}
                      className="flex items-center p-3 hover:bg-gray-50 cursor-pointer"
                      onClick={() => {
                        handleFrameSelection(frame.id);
                        setFrameSearch('');
                        setShowFrameDropdown(false);
                      }}
                    >
                      <input
                        type="checkbox"
                        checked={selectedFrames.includes(frame.id)}
                        onChange={() => {}}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <span className="ml-3 text-sm">
                        Frame {frames.indexOf(frame) + 1}
                        {frame.description && (
                          <span className="text-gray-500 ml-2">- {frame.description}</span>
                        )}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
            {selectedFrames.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-2">
                {selectedFrames.map(frameId => {
                  const frame = frames.find(f => f.id === frameId);
                  return frame ? (
                    <span
                      key={frameId}
                      className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-700"
                    >
                      Frame {frames.indexOf(frame) + 1}
                      <button
                        type="button"
                        onClick={() => handleFrameSelection(frameId)}
                        className="ml-2 text-blue-500 hover:text-blue-700"
                      >
                        ×
                      </button>
                    </span>
                  ) : null;
                })}
              </div>
            )}
          </div>

          {/* Related Tasks Dropdown */}
          <div className="relative">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Related Tasks
            </label>
            <div className="relative" ref={taskDropdownRef}>
              <input
                type="text"
                value={taskSearch}
                onChange={(e) => setTaskSearch(e.target.value)}
                onFocus={() => setShowTaskDropdown(true)}
                placeholder="Search tasks..."
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              {showTaskDropdown && (
                <div className="fixed z-[100] mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto" style={{ width: modalRef.current?.querySelector('.relative')?.getBoundingClientRect().width + 'px' }}>
                  {filteredTasks.map((task) => (
                    <div
                      key={task.id}
                      className="flex items-center p-3 hover:bg-gray-50 cursor-pointer"
                      onClick={() => {
                        handleTaskSelection(task.id);
                        setTaskSearch('');
                        setShowTaskDropdown(false);
                      }}
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
              )}
            </div>
            {selectedTasks.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-2">
                {selectedTasks.map(taskId => {
                  const task = tasks.find(t => t.id === taskId);
                  return task ? (
                    <span
                      key={taskId}
                      className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-700"
                    >
                      {task.title}
                      <button
                        type="button"
                        onClick={() => handleTaskSelection(taskId)}
                        className="ml-2 text-blue-500 hover:text-blue-700"
                      >
                        ×
                      </button>
                    </span>
                  ) : null;
                })}
              </div>
            )}
          </div>

          <div className="flex justify-end space-x-4 mt-8">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              {initialTask ? 'Update' : 'Create'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 