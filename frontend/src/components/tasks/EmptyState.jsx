import { ClipboardList, SearchX, Plus } from 'lucide-react';

export default function EmptyState({ hasFilters, onAdd }) {
  if (hasFilters) {
    return (
      <div className="flex flex-col items-center justify-center py-20 px-4 text-center animate-fade-in bg-white border border-slate-200 border-dashed rounded-2xl">
        <div className="w-16 h-16 bg-slate-50 border border-slate-100 rounded-2xl flex items-center justify-center mb-5">
          <SearchX size={32} className="text-slate-400" />
        </div>
        <h3 className="text-lg font-semibold text-slate-900 mb-1.5">No matching tasks</h3>
        <p className="text-slate-500 max-w-sm mb-6">
          We couldn't find any tasks matching your current search or filter criteria.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center py-24 px-4 text-center animate-fade-in bg-white border border-slate-200 border-dashed rounded-2xl">
      <div className="w-16 h-16 bg-indigo-50 border border-indigo-100 rounded-2xl flex items-center justify-center mb-5">
        <ClipboardList size={32} className="text-indigo-600" />
      </div>
      <h3 className="text-xl font-bold text-slate-900 mb-2">No tasks yet</h3>
      <p className="text-slate-500 max-w-sm mb-7">
        You have a clean slate! Create your first task to start organizing your work and getting things done.
      </p>
      <button onClick={onAdd} className="btn-primary flex items-center gap-2">
        <Plus size={18} />
        <span>Create your first task</span>
      </button>
    </div>
  );
}
