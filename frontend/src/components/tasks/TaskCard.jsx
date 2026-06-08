import { useState } from 'react';
import { Pencil, Trash2, CheckCircle2, Circle, Calendar, Flag, GripVertical } from 'lucide-react';
import { useDraggable } from '@dnd-kit/core';

const priorityConfig = {
  low:    { label: 'Low',    class: 'badge-low' },
  medium: { label: 'Medium', class: 'badge-medium' },
  high:   { label: 'High',   class: 'badge-high' },
};

export default function TaskCard({ task, onEdit, onDelete, onToggle }) {
  const [toggling, setToggling] = useState(false);

  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: task._id,
    data: { task },
  });

  const style = transform ? {
    transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
    zIndex: 50,
  } : undefined;

  const handleToggle = async () => {
    setToggling(true);
    await onToggle(task._id);
    setToggling(false);
  };

  const isCompleted = task.status === 'completed';
  const priority = priorityConfig[task.priority] || priorityConfig.medium;

  let dateText = '';
  let isOverdue = false;

  if (task.dueDate) {
    const due = new Date(task.dueDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const dueDay = new Date(due);
    dueDay.setHours(0, 0, 0, 0);

    const diffDays = Math.ceil((dueDay - today) / (1000 * 60 * 60 * 24));
    isOverdue = diffDays < 0 && !isCompleted;
    
    const formattedDate = due.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    
    if (diffDays === 0) dateText = `Due today`;
    else if (diffDays === 1) dateText = `Due tomorrow`;
    else if (diffDays < 0) dateText = `Overdue by ${Math.abs(diffDays)}d`;
    else dateText = `Due in ${diffDays}d (${formattedDate})`;
  } else {
    dateText = new Date(task.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`bg-card border border-border rounded-2xl p-4 sm:p-5 flex gap-3 sm:gap-4 group
        transition-all duration-200
        hover:shadow-card-hover hover:border-slate-300 dark:hover:border-slate-500
        ${isDragging ? 'opacity-50 ring-2 ring-primary shadow-xl scale-[1.02] z-50' : 'animate-slide-up'}
        ${isCompleted && !isDragging ? 'opacity-60' : ''}`}
    >
      {/* Drag Handle */}
      <div
        {...attributes}
        {...listeners}
        className="flex-shrink-0 mt-0.5 text-text-secondary hover:text-text cursor-grab active:cursor-grabbing outline-none"
      >
        <GripVertical size={18} />
      </div>

      {/* Toggle Button */}
      <button
        onClick={handleToggle}
        disabled={toggling}
        className="flex-shrink-0 mt-0.5 text-text-secondary hover:text-primary transition-colors duration-150"
        title={isCompleted ? 'Mark as pending' : 'Mark as completed'}
      >
        {toggling ? (
          <div className="w-5 h-5 border-2 border-border border-t-primary rounded-full animate-spin" />
        ) : isCompleted ? (
          <CheckCircle2 size={20} className="text-success" />
        ) : (
          <Circle size={20} />
        )}
      </button>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2 mb-1.5">
          <h3
            className={`font-semibold text-sm leading-snug break-words ${
              isCompleted ? 'line-through text-text-secondary' : 'text-text'
            }`}
          >
            {task.title}
          </h3>

          {/* Actions — visible on hover */}
          <div className="flex items-center gap-1 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity duration-150">
            <button
              onClick={() => onEdit(task)}
              className="p-1.5 rounded-lg text-text-secondary hover:text-primary hover:bg-slate-50 dark:hover:bg-slate-800 transition-all duration-150"
              title="Edit task"
            >
              <Pencil size={13} />
            </button>
            <button
              onClick={() => onDelete(task._id)}
              className="p-1.5 rounded-lg text-text-secondary hover:text-danger hover:bg-red-50 dark:hover:bg-red-900/30 transition-all duration-150"
              title="Delete task"
            >
              <Trash2 size={13} />
            </button>
          </div>
        </div>

        {task.description && (
          <p className={`text-xs leading-relaxed mb-3 ${isCompleted ? 'text-text-secondary/70' : 'text-text-secondary'}`}>
            {task.description}
          </p>
        )}

        {/* Footer metadata */}
        <div className="flex flex-wrap items-center gap-1.5 mt-2">
          <span className={isCompleted ? 'badge-completed' : 'badge-pending'}>
            {isCompleted ? 'Completed' : 'Pending'}
          </span>

          <span className={priority.class}>
            <Flag size={9} className="inline mr-1" />
            {priority.label}
          </span>

          <span className={`flex items-center gap-1 text-xs ml-auto ${isOverdue ? 'text-danger font-semibold' : 'text-text-secondary'}`}>
            <Calendar size={11} />
            {dateText}
          </span>
        </div>
      </div>
    </div>
  );
}
