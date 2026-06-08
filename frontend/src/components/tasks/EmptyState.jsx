import { ClipboardList, SearchX, Plus } from 'lucide-react';

export default function EmptyState({ hasFilters, onAdd }) {
  if (hasFilters) {
    return (
      <div className="flex flex-col items-center justify-center py-20 px-4 text-center animate-fade-in bg-card border border-border border-dashed rounded-2xl">
        <div className="w-16 h-16 bg-slate-50 dark:bg-slate-800/50 border border-border rounded-2xl flex items-center justify-center mb-5">
          <SearchX size={32} className="text-text-secondary" />
        </div>
        <h3 className="text-lg font-semibold text-text mb-1.5">No matching tasks found.</h3>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center py-24 px-4 text-center animate-fade-in bg-card border border-border border-dashed rounded-2xl">
      <div className="w-16 h-16 bg-indigo-50 border border-indigo-100 rounded-2xl flex items-center justify-center mb-5">
        <ClipboardList size={32} className="text-indigo-600" />
      </div>
      <h3 className="text-xl font-bold text-text mb-2">🎯 No tasks yet.</h3>
      <p className="text-text-secondary max-w-sm mb-7">
        Create your first task and start organizing your work.
      </p>
      <button onClick={onAdd} className="btn-primary flex items-center gap-2">
        <Plus size={18} />
        <span>Create your first task</span>
      </button>
    </div>
  );
}
