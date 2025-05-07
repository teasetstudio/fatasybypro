import React, { createContext, useContext, useState, useCallback } from 'react';
import { Task, TaskStatus } from '../types/task';

interface TaskContextType {
  tasks: Task[];
  addTask: (task: Omit<Task, 'id'>) => void;
  updateTask: (id: string, updates: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  moveTask: (taskId: string, newStatus: TaskStatus) => void;
  reorderTask: (taskId: string, newIndex: number) => void;
}

const TaskContext = createContext<TaskContextType | undefined>(undefined);

const defaultTasks: Task[] = [
  {
    id: '1',
    title: 'Design User Interface',
    description: 'Create wireframes and mockups for the main dashboard',
    status: 'TODO',
    priority: 'High',
    assignee: 'John Doe',
    dueDate: '2024-03-25',
  },
  {
    id: '2',
    title: 'Implement Authentication',
    description: 'Set up user authentication and authorization system',
    status: 'IN_PROGRESS',
    priority: 'Medium',
    assignee: 'Jane Smith',
    dueDate: '2024-03-28',
  },
  {
    id: '3',
    title: 'Write Documentation',
    description: 'Create comprehensive documentation for the API endpoints',
    status: 'DONE',
    priority: 'Low',
    assignee: 'Mike Johnson',
    dueDate: '2024-03-20',
  },
];

export function TaskProvider({ children }: { children: React.ReactNode }) {
  const [tasks, setTasks] = useState<Task[]>(defaultTasks);

  const addTask = useCallback((task: Omit<Task, 'id'>) => {
    const newTask: Task = {
      ...task,
      id: Math.random().toString(36).substr(2, 9),
    };
    setTasks((prevTasks) => [...prevTasks, newTask]);
  }, []);

  const updateTask = useCallback((id: string, updates: Partial<Task>) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === id ? { ...task, ...updates } : task
      )
    );
  }, []);

  const deleteTask = useCallback((id: string) => {
    setTasks((prevTasks) => prevTasks.filter((task) => task.id !== id));
  }, []);

  const moveTask = useCallback((taskId: string, newStatus: TaskStatus) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === taskId ? { ...task, status: newStatus } : task
      )
    );
  }, []);

  const reorderTask = useCallback((taskId: string, newIndex: number) => {
    setTasks((prevTasks) => {
      const taskToMove = prevTasks.find(task => task.id === taskId);
      if (!taskToMove) return prevTasks;

      const tasksInSameStatus = prevTasks.filter(task => task.status === taskToMove.status);
      const otherTasks = prevTasks.filter(task => task.status !== taskToMove.status);
      
      // Remove the task from its current position
      const filteredTasksInStatus = tasksInSameStatus.filter(task => task.id !== taskId);
      
      // Insert the task at the new position
      const newTasksInStatus = [
        ...filteredTasksInStatus.slice(0, newIndex),
        taskToMove,
        ...filteredTasksInStatus.slice(newIndex)
      ];
      
      // Combine with other tasks
      return [...otherTasks, ...newTasksInStatus];
    });
  }, []);

  const value = {
    tasks,
    addTask,
    updateTask,
    deleteTask,
    moveTask,
    reorderTask,
  };

  return <TaskContext.Provider value={value}>{children}</TaskContext.Provider>;
}

export function useTasks() {
  const context = useContext(TaskContext);
  if (context === undefined) {
    throw new Error('useTasks must be used within a TaskProvider');
  }
  return context;
} 