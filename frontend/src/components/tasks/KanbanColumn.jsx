import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import TaskCard from './TaskCard';

export default function KanbanColumn({ id, title, tasks, onEdit, onDelete, onToggle }) {
  const { setNodeRef, isOver } = useDroppable({
    id,
  });

  const headerColors = {
    pending: 'bg-indigo-500 shadow-[0_0_8px_rgba(99,102,241,0.5)]',
    completed: 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]',
  };

  const activeHeaderColor = headerColors[id] || headerColors.pending;

  return (
    <div className="flex flex-col h-full bg-slate-500/5 dark:bg-slate-400/5 rounded-3xl p-4 sm:p-5 border border-border/30 backdrop-blur-sm">
      {/* Column Header */}
      <div className="flex items-center justify-between mb-4 px-1">
        <div className="flex items-center gap-2">
          <span className={`w-2 h-2 rounded-full ${activeHeaderColor}`} />
          <h3 className="font-extrabold text-text text-sm uppercase tracking-wider">{title}</h3>
        </div>
        <span className="bg-card border border-border/80 text-text-secondary text-xs font-bold px-2.5 py-0.5 rounded-full shadow-sm">
          {tasks.length}
        </span>
      </div>

      {/* Droppable Zone */}
      <div
        ref={setNodeRef}
        className={`flex-1 rounded-2xl transition-all duration-300 min-h-[200px] p-1 border-2 border-transparent
          ${isOver ? 'bg-indigo-500/5 dark:bg-indigo-400/5 border-dashed border-indigo-500/30 dark:border-indigo-400/30 scale-[0.99]' : 'bg-transparent'}
        `}
      >
        <div className="space-y-3">
          <SortableContext items={tasks.map(t => t._id)} strategy={verticalListSortingStrategy}>
            {tasks.map(task => (
              <TaskCard
                key={task._id}
                task={task}
                onEdit={onEdit}
                onDelete={onDelete}
                onToggle={onToggle}
              />
            ))}
          </SortableContext>
        </div>
      </div>
    </div>
  );
}
