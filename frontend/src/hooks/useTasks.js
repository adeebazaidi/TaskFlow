import { useState, useCallback, useEffect, useRef } from 'react';
import { taskService } from '../services/taskService';
import toast from 'react-hot-toast';

export const useTasks = () => {
  const [tasks, setTasks] = useState([]);
  const [stats, setStats] = useState({ total: 0, pending: 0, completed: 0 });
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [filters, setFilters] = useState({ status: '', priority: '', search: '' });

  // Keep a stable ref to the latest filters so callbacks can read them without
  // becoming stale closures (F2)
  const filtersRef = useRef(filters);
  filtersRef.current = filters;

  const fetchTasks = useCallback(async (params = {}) => {
    setLoading(true);
    try {
      const res = await taskService.getTasks(params);
      setTasks(res.data.tasks);
      setStats(res.data.stats);
    } catch (err) {
      toast.error(err.message || 'Failed to fetch tasks');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const params = {};
    if (filters.status) params.status = filters.status;
    if (filters.priority) params.priority = filters.priority;
    if (filters.search) params.search = filters.search;
    fetchTasks(params);
  }, [filters, fetchTasks]);

  // Helper: refetch using current filters (F2)
  const refetchWithCurrentFilters = useCallback(() => {
    const current = filtersRef.current;
    const params = {};
    if (current.status) params.status = current.status;
    if (current.priority) params.priority = current.priority;
    if (current.search) params.search = current.search;
    fetchTasks(params);
  }, [fetchTasks]);

  const createTask = useCallback(async (data) => {
    setActionLoading(true);
    try {
      const res = await taskService.createTask(data);
      toast.success('Task created!');
      // Refetch using current filters instead of anti-pattern filter identity trick (F2)
      refetchWithCurrentFilters();
      return res.data.task;
    } catch (err) {
      toast.error(err.message || 'Failed to create task');
      throw err;
    } finally {
      setActionLoading(false);
    }
  }, [refetchWithCurrentFilters]);

  const updateTask = useCallback(async (id, data) => {
    setActionLoading(true);
    try {
      const res = await taskService.updateTask(id, data);
      toast.success('Task updated!');
      setTasks((prev) => prev.map((t) => (t._id === id ? res.data.task : t)));
      return res.data.task;
    } catch (err) {
      toast.error(err.message || 'Failed to update task');
      throw err;
    } finally {
      setActionLoading(false);
    }
  }, []);

  const deleteTask = useCallback(async (id) => {
    setActionLoading(true);
    try {
      // Capture the task being deleted so we can update stats correctly (F4)
      const taskToDelete = tasks.find((t) => t._id === id);
      await taskService.deleteTask(id);
      toast.success('Task deleted');
      setTasks((prev) => prev.filter((t) => t._id !== id));
      // Accurately update all stats based on the deleted task's status (F4)
      setStats((s) => ({
        total: Math.max(0, s.total - 1),
        pending: taskToDelete?.status === 'pending' ? Math.max(0, s.pending - 1) : s.pending,
        completed: taskToDelete?.status === 'completed' ? Math.max(0, s.completed - 1) : s.completed,
      }));
    } catch (err) {
      toast.error(err.message || 'Failed to delete task');
    } finally {
      setActionLoading(false);
    }
  }, [tasks]);

  const toggleStatus = useCallback(async (id) => {
    try {
      const res = await taskService.toggleStatus(id);
      const updatedTask = res.data.task;
      setTasks((prev) => prev.map((t) => (t._id === id ? updatedTask : t)));

      // Update stats optimistically based on the new status (F3)
      setStats((s) => {
        if (updatedTask.status === 'completed') {
          // Was pending, now completed
          return {
            ...s,
            pending: Math.max(0, s.pending - 1),
            completed: s.completed + 1,
          };
        } else {
          // Was completed, now pending
          return {
            ...s,
            pending: s.pending + 1,
            completed: Math.max(0, s.completed - 1),
          };
        }
      });
    } catch (err) {
      toast.error(err.message || 'Failed to update status');
    }
  }, []);

  return {
    tasks,
    stats,
    loading,
    actionLoading,
    filters,
    setFilters,
    fetchTasks,
    createTask,
    updateTask,
    deleteTask,
    toggleStatus,
  };
};
