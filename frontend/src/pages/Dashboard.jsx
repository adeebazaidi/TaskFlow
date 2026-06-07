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
import LoadingSpinner from '../components/common/LoadingSpinner';

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

  // Greeting based on time
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <Navbar />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8 animate-fade-in">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
              {greeting}, {user?.name?.split(' ')[0]} 👋
            </h2>
            <p className="text-slate-500 text-sm mt-1.5">
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
                fetchTasks(params);
              }}
              className="p-2.5 rounded-xl border border-slate-200 bg-white text-slate-500 hover:text-slate-700 hover:bg-slate-50 hover:border-slate-300 transition-all shadow-sm"
              title="Refresh"
            >
              <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
            </button>
            <button
              onClick={openCreateModal}
              className="btn-primary flex items-center gap-2"
            >
              <Plus size={18} />
              <span>New Task</span>
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3 sm:gap-4 mb-8">
          <StatsCard label="Total" value={stats.total} icon={ListTodo} color="indigo" />
          <StatsCard label="Pending" value={stats.pending} icon={Clock} color="amber" />
          <StatsCard label="Done" value={stats.completed} icon={CheckCheck} color="emerald" />
        </div>

        {/* Filters */}
        <div className="mb-5">
          <TaskFilters filters={filters} onChange={setFilters} />
        </div>

        {/* Task List */}
        <section>
          {loading ? (
            <div className="flex justify-center py-20">
              <LoadingSpinner size="lg" />
            </div>
          ) : tasks.length === 0 ? (
            <EmptyState hasFilters={hasFilters} onAdd={openCreateModal} />
          ) : (
            <div className="space-y-2.5">
              {/* Results count */}
              <div className="flex items-center justify-between mb-2">
                <p className="text-xs text-slate-400 font-medium">
                  {tasks.length} task{tasks.length !== 1 ? 's' : ''}
                  {hasFilters ? ' matching filters' : ''}
                </p>
              </div>

              {tasks.map((task) => (
                <TaskCard
                  key={task._id}
                  task={task}
                  onEdit={openEditModal}
                  onDelete={(id) => setDeletingTaskId(id)}
                  onToggle={toggleStatus}
                />
              ))}
            </div>
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
