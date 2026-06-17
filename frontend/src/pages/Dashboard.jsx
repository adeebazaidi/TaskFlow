import { useState } from 'react';
import { Plus, ListTodo, Clock, CheckCheck, RefreshCw } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTasks } from '../hooks/useTasks';
import Navbar from '../components/common/Navbar';
import StatsCard from '../components/common/StatsCard';
import TaskCard from '../components/tasks/TaskCard';
import TaskModal from '../components/tasks/TaskModal';
import DeleteConfirmModal from '../components/tasks/DeleteConfirmModal';
import TaskFilters from '../components/tasks/TaskFilters';
import EmptyState from '../components/tasks/EmptyState';
import TaskSkeleton from '../components/tasks/TaskSkeleton';
import KanbanColumn from '../components/tasks/KanbanColumn';
import { DndContext, closestCorners, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { sortableKeyboardCoordinates } from '@dnd-kit/sortable';

export default function Dashboard() {
  const { user } = useAuth();
  const {
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
  } = useTasks();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [deletingTaskId, setDeletingTaskId] = useState(null);

  const openCreateModal = () => { setEditingTask(null); setIsModalOpen(true); };
  const openEditModal = (task) => { setEditingTask(task); setIsModalOpen(true); };
  const closeModal = () => { setIsModalOpen(false); setEditingTask(null); };

  const handleSubmit = async (data) => {
    if (editingTask) {
      await updateTask(editingTask._id, data);
    } else {
      await createTask(data);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deletingTaskId) return;
    await deleteTask(deletingTaskId);
    setDeletingTaskId(null);
  };

  const hasFilters = Boolean(filters.status || filters.search);

  const pendingTasks = tasks.filter((t) => t.status === 'pending');
  const completedTasks = tasks.filter((t) => t.status === 'completed');

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const handleDragEnd = async (event) => {
    const { active, over } = event;
    if (!over) return;

    const taskId = active.id;
    const task = tasks.find((t) => t._id === taskId);
    if (!task) return;

    let newStatus = over.id;
    if (newStatus !== 'pending' && newStatus !== 'completed') {
      const overTask = tasks.find((t) => t._id === over.id);
      if (overTask) newStatus = overTask.status;
    }

    if (newStatus && task.status !== newStatus) {
      await toggleStatus(taskId);
    }
  };

  // Greeting based on time
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Ambient glowing circles */}
      <div className="bg-glow-purple top-24 -left-48" />
      <div className="bg-glow-rose top-[400px] -right-48" />

      <Navbar />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 relative z-10">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8 animate-fade-in">
          <div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-text tracking-tight">
              {greeting}, <span className="bg-gradient-to-r from-[#1E5387] to-[#2E6CA4] bg-clip-text text-transparent">{user?.name?.split(' ')[0]}</span> 👋
            </h2>
            <p className="text-text-secondary text-sm sm:text-base mt-2 font-medium">
              {stats.pending > 0
                ? `You have ${stats.pending} pending task${stats.pending !== 1 ? 's' : ''} to complete.`
                : stats.total > 0
                ? 'All tasks completed — great work! 🎉'
                : 'No tasks yet. Create one to get started.'}
            </p>
          </div>
          <div className="flex gap-2.5">
            <button
              onClick={() => {
                const params = {};
                if (filters.status) params.status = filters.status;
                if (filters.search) params.search = filters.search;
                if (filters.priority) params.priority = filters.priority;
                fetchTasks(params);
              }}
              className="p-2.5 rounded-xl border border-border bg-card text-text-secondary hover:text-text hover:bg-slate-50 dark:hover:bg-slate-800 transition-all duration-300 shadow-sm hover:shadow-md active:scale-95"
              title="Refresh"
            >
              <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
            </button>
            <button
              onClick={openCreateModal}
              className="btn-primary flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-[#1E5387] to-[#2E6CA4] shadow-[0_6px_20px_rgba(30,83,135,0.35)] hover:shadow-[0_8px_25px_rgba(30,83,135,0.5)] font-bold transition-all duration-300 active:scale-95 text-white"
            >
              <Plus size={18} className="stroke-[2.5]" />
              <span>New Task</span>
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-5 mb-8">
          <StatsCard label="Total Tasks" value={stats.total} icon={ListTodo} color="coral" />
          <StatsCard label="Pending Tasks" value={stats.pending} icon={Clock} color="teal" />
          <StatsCard label="Completed Tasks" value={stats.completed} icon={CheckCheck} color="blue" />
          <StatsCard label="Completion" value={stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0} isCompletion={true} />
        </div>

        {/* Filters */}
        <div className="mb-5">
          <TaskFilters filters={filters} onChange={setFilters} />
        </div>

        {/* Task List */}
        <section>
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2.5">
                {[1, 2].map((i) => <TaskSkeleton key={i} />)}
              </div>
              <div className="space-y-2.5">
                {[1].map((i) => <TaskSkeleton key={`c-${i}`} />)}
              </div>
            </div>
          ) : tasks.length === 0 ? (
            <EmptyState hasFilters={hasFilters} onAdd={openCreateModal} />
          ) : (
            <>
              <div className="flex items-center justify-between mb-4">
                <p className="text-xs text-text-secondary font-medium">
                  {tasks.length} task{tasks.length !== 1 ? 's' : ''}
                  {hasFilters ? ' matching filters' : ''}
                </p>
              </div>

              <DndContext sensors={sensors} collisionDetection={closestCorners} onDragEnd={handleDragEnd}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
                  <KanbanColumn
                    id="pending"
                    title="To Do"
                    tasks={pendingTasks}
                    onEdit={openEditModal}
                    onDelete={(id) => setDeletingTaskId(id)}
                    onToggle={toggleStatus}
                  />
                  <KanbanColumn
                    id="completed"
                    title="Completed"
                    tasks={completedTasks}
                    onEdit={openEditModal}
                    onDelete={(id) => setDeletingTaskId(id)}
                    onToggle={toggleStatus}
                  />
                </div>
              </DndContext>
            </>
          )}
        </section>
      </main>

      {/* Modals */}
      <TaskModal
        isOpen={isModalOpen}
        onClose={closeModal}
        onSubmit={handleSubmit}
        task={editingTask}
        loading={actionLoading}
      />

      <DeleteConfirmModal
        isOpen={Boolean(deletingTaskId)}
        onClose={() => setDeletingTaskId(null)}
        onConfirm={handleDeleteConfirm}
        loading={actionLoading}
      />
    </div>
  );
}
