import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  DndContext,
  closestCorners,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
  DragOverEvent,
  DragOverlay,
  defaultDropAnimation,
} from '@dnd-kit/core';
import { 
  SortableContext, 
  verticalListSortingStrategy,
  sortableKeyboardCoordinates,
  arrayMove,
} from '@dnd-kit/sortable';
import TaskColumn from '../components/tasks/TaskColumn';
import TaskModal from '../components/tasks/TaskModal';
import { useTasks } from '../context/TaskContext';
import { Task, TaskStatus } from '../types/task';

const TASK_STATUSES: TaskStatus[] = ['TODO', 'IN_PROGRESS', 'BLOCKED', 'IN_REVIEW', 'DONE'];

const dropAnimation = {
  ...defaultDropAnimation,
  dragSourceOpacity: 0.5,
};

export default function TaskBoardPage() {
  const { tasks, addTask, updateTask, moveTask, reorderTask } = useTasks();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | undefined>();
  const [activeId, setActiveId] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const findTaskStatus = (taskId: string | null): TaskStatus | null => {
    if (!taskId) return null;
    if (TASK_STATUSES.includes(taskId as TaskStatus)) {
      return taskId as TaskStatus;
    }
    const task = tasks.find(t => t.id === taskId);
    return task ? task.status : null;
  };

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over, delta } = event;
    if (!over) return;

    const activeId = String(active.id);
    const overId = String(over.id);
    const activeStatus = findTaskStatus(activeId);
    const overStatus = findTaskStatus(overId);

    if (!activeStatus || !overStatus || activeStatus === overStatus) return;

    const activeTask = tasks.find(task => task.id === activeId);
    if (!activeTask) return;

    moveTask(activeId, overStatus);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over) return;

    const activeId = String(active.id);
    const overId = String(over.id);
    const activeStatus = findTaskStatus(activeId);
    const overStatus = findTaskStatus(overId);

    if (!activeStatus || !overStatus || activeStatus !== overStatus) return;

    const tasksInStatus = tasks.filter(task => task.status === activeStatus);
    const activeIndex = tasksInStatus.findIndex(task => task.id === activeId);
    const overIndex = tasksInStatus.findIndex(task => task.id === overId);

    if (activeIndex !== overIndex) {
      reorderTask(activeId, overIndex);
    }
  };

  const handleDragStart = (event: any) => {
    setActiveId(event.active.id);
  };

  const handleDragCancel = () => {
    setActiveId(null);
  };

  const activeTask = activeId ? tasks.find(task => task.id === activeId) : null;

  const handleCreateTask = () => {
    setSelectedTask(undefined);
    setIsModalOpen(true);
  };

  const handleEditTask = (task: Task) => {
    setSelectedTask(task);
    setIsModalOpen(true);
  };

  const handleTaskSubmit = (taskData: Omit<Task, 'id'>) => {
    if (selectedTask) {
      updateTask(selectedTask.id, taskData);
    } else {
      addTask(taskData);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-white shadow-md w-full sticky top-0 z-20">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <Link to="/" className="text-gray-600 hover:text-gray-800">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
            </Link>
            <h1 className="text-2xl font-bold text-gray-800">Task Board</h1>
          </div>
          <button
            onClick={handleCreateTask}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition duration-200"
          >
            Create New Task
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="container-full mx-auto p-4 mt-4">
        <DndContext
          sensors={sensors}
          collisionDetection={closestCorners}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
          onDragOver={handleDragOver}
          onDragCancel={handleDragCancel}
        >
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 h-full">
            {TASK_STATUSES.map((status) => {
              const columnTasks = tasks.filter((task) => task.status === status);
              return (
                <SortableContext
                  key={status}
                  items={columnTasks.map(task => task.id)}
                  strategy={verticalListSortingStrategy}
                >
                  <TaskColumn
                    status={status}
                    tasks={columnTasks}
                    onEditTask={handleEditTask}
                  />
                </SortableContext>
              );
            })}
          </div>

          <DragOverlay dropAnimation={dropAnimation}>
            {activeTask ? (
              <div className="bg-white rounded-lg shadow-lg p-4 w-[calc(100%-2rem)] max-w-sm">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-semibold text-lg">{activeTask.title}</h3>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    activeTask.priority === 'High' ? 'bg-red-100 text-red-800' :
                    activeTask.priority === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {activeTask.priority}
                  </span>
                </div>
                <p className="text-gray-600 text-sm mb-4">{activeTask.description}</p>
                <div className="flex justify-between items-center text-sm text-gray-500">
                  <span>{activeTask.assignee}</span>
                  <span>{activeTask.dueDate}</span>
                </div>
              </div>
            ) : null}
          </DragOverlay>
        </DndContext>
      </div>

      <TaskModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleTaskSubmit}
        initialTask={selectedTask}
      />
    </div>
  );
} 