import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import TaskCard from './TaskCard';

export default function KanbanColumn({ id, title, tasks, onEdit, onDelete, onToggle }) {
  const { setNodeRef, isOver } = useDroppable({
    id,
  });

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between mb-3 px-1">
        <h3 className="font-bold text-text text-sm uppercase tracking-wider">{title}</h3>
        <span className="bg-slate-100 dark:bg-slate-800 text-text-secondary text-xs font-semibold px-2 py-0.5 rounded-full">
          {tasks.length}
        </span>
      </div>

      <div
        ref={setNodeRef}
        className={`flex-1 rounded-2xl transition-colors duration-200 min-h-[150px]
          ${isOver ? 'bg-slate-50 dark:bg-slate-800/50' : 'bg-transparent'}
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
