import { ClipboardList, SearchX, Plus } from 'lucide-react';

export default function EmptyState({ hasFilters, onAdd }) {
  if (hasFilters) {
    return (
      <div className="flex flex-col items-center justify-center py-20 px-4 text-center animate-fade-in bg-slate-500/5 dark:bg-slate-400/5 border border-dashed border-border/80 rounded-[24px]">
        <div className="w-16 h-16 bg-slate-500/10 border border-border/40 rounded-2xl flex items-center justify-center mb-5">
          <SearchX size={28} className="text-text-secondary stroke-[2]" />
        </div>
        <h3 className="text-base font-extrabold text-text mb-1">No matching tasks found</h3>
        <p className="text-xs text-text-secondary font-medium">Try adjusting your filters or search query.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center py-20 px-4 text-center animate-fade-in bg-slate-500/5 dark:bg-slate-400/5 border border-dashed border-border/80 rounded-[24px]">
      <div className="w-16 h-16 bg-indigo-500/10 border border-indigo-500/20 rounded-2xl flex items-center justify-center mb-5">
        <ClipboardList size={28} className="text-indigo-500 stroke-[2]" />
      </div>
      <h3 className="text-lg font-extrabold text-text mb-2">No tasks yet</h3>
      <p className="text-xs text-text-secondary max-w-xs mb-6 font-medium leading-relaxed">
        Create your first task and start organizing your schedule with TaskFlow.
      </p>
      <button onClick={onAdd} className="btn-primary flex items-center gap-2 py-3">
        <Plus size={16} className="stroke-[2.5]" />
        <span>Create your first task</span>
      </button>
    </div>
  );
}
