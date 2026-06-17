import { useState } from 'react';
import { Pencil, Trash2, CheckCircle2, Circle, Calendar, GripVertical } from 'lucide-react';
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

  const handleToggle = async (e) => {
    e.stopPropagation(); // Avoid triggering drag
    setToggling(true);
    await onToggle(task._id);
    setToggling(false);
  };

  const isCompleted = task.status === 'completed';
  const priority = priorityConfig[task.priority] || priorityConfig.medium;

  let dateText = '';
  let isOverdue = false;
  let isDueSoon = false;

  if (task.dueDate) {
    const due = new Date(task.dueDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const dueDay = new Date(due);
    dueDay.setHours(0, 0, 0, 0);

    const diffDays = Math.ceil((dueDay - today) / (1000 * 60 * 60 * 24));
    isOverdue = diffDays < 0 && !isCompleted;
    isDueSoon = diffDays >= 0 && diffDays <= 2 && !isCompleted;
    
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
      className={`bg-white dark:bg-[#151C2C] border border-border/80 rounded-[22px] p-5 flex flex-col gap-3 group
        transition-all duration-300 shadow-[0_8px_30px_rgba(0,0,0,0.03)] dark:shadow-[0_8px_30px_rgba(0,0,0,0.4)]
        hover:shadow-[0_15px_35px_rgba(30,83,135,0.08)] hover:border-blue-500/20 dark:hover:border-blue-400/20 hover:-translate-y-0.5
        ${isDragging ? 'opacity-40 ring-2 ring-blue-500 shadow-2xl scale-[1.01] z-50' : 'animate-slide-up'}
        ${isCompleted && !isDragging ? 'opacity-70 hover:opacity-100' : ''}`}
    >
      {/* Top Row: Drag Handle, Checkbox, Title, Action Buttons */}
      <div className="flex items-center gap-3">
        {/* Drag Handle */}
        <div
          {...attributes}
          {...listeners}
          className="flex-shrink-0 text-text-secondary/40 hover:text-[#1E5387] cursor-grab active:cursor-grabbing outline-none transition-colors duration-200"
          title="Drag to reorder"
        >
          <GripVertical size={16} className="stroke-[2.5]" />
        </div>

        {/* Checkbox */}
        <button
          onClick={handleToggle}
          disabled={toggling}
          className={`flex-shrink-0 transition-all duration-200 active:scale-90 ${
            isCompleted 
              ? 'text-[#0C8F8F]' 
              : 'text-text-secondary/40 hover:text-[#1E5387]'
          }`}
          title={isCompleted ? 'Mark as pending' : 'Mark as completed'}
        >
          {toggling ? (
            <div className="w-5 h-5 border-2 border-border border-t-[#1E5387] rounded-full animate-spin" />
          ) : isCompleted ? (
            <CheckCircle2 size={20} className="stroke-[2] text-[#0C8F8F] fill-[#0C8F8F]/10" />
          ) : (
            <Circle size={20} className="stroke-[2] hover:stroke-[2.5]" />
          )}
        </button>

        {/* Title */}
        <div className="flex-1 min-w-0">
          <h3
            className={`font-bold text-[14px] leading-snug break-words transition-all duration-300 ${
              isCompleted 
                ? 'line-through text-text-secondary/70' 
                : 'text-text group-hover:text-[#1E5387] dark:group-hover:text-blue-400'
            }`}
          >
            {task.title}
          </h3>
        </div>

        {/* Action Buttons (Visible on hover with transition) */}
        <div className="flex items-center gap-1.5 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <button
            onClick={() => onEdit(task)}
            className="p-1.5 rounded-xl text-text-secondary hover:text-[#1E5387] hover:bg-blue-50 dark:hover:bg-blue-950/20 border border-transparent hover:border-blue-100 dark:hover:border-blue-900/30 transition-all duration-200"
            title="Edit task"
          >
            <Pencil size={13} className="stroke-[2.5]" />
          </button>
          <button
            onClick={() => onDelete(task._id)}
            className="p-1.5 rounded-xl text-text-secondary hover:text-[#F06F5A] hover:bg-rose-50 dark:hover:bg-rose-950/20 border border-transparent hover:border-rose-100 dark:hover:border-rose-900/30 transition-all duration-200"
            title="Delete task"
          >
            <Trash2 size={13} className="stroke-[2.5]" />
          </button>
        </div>
      </div>

      {/* Description Row (Grid-aligned: offsets by left margin to line up under the title) */}
      {task.description && (
        <div className="pl-[46px] pr-2">
          <p className={`text-xs leading-relaxed font-medium ${isCompleted ? 'text-text-secondary/60' : 'text-text-secondary/95'}`}>
            {task.description}
          </p>
        </div>
      )}

      {/* Bottom Row: Metadata Badges (Grid-aligned: offset same as description) */}
      <div className="flex flex-wrap items-center gap-2.5 pl-[46px] mt-0.5">
        {/* Status Badge */}
        <span className={isCompleted ? 'badge-completed' : 'badge-pending'}>
          {isCompleted ? 'Completed' : 'Pending'}
        </span>

        {/* Priority Badge */}
        <span className={`${priority.class} select-none`}>
          {priority.label}
        </span>

        {/* Due Date Badge */}
        <span className={`flex items-center gap-1.5 text-[11px] font-bold px-2.5 py-1 rounded-lg border ${
          isOverdue 
            ? 'bg-rose-50 dark:bg-rose-950/20 text-[#F06F5A] border-rose-100 dark:border-rose-950/50' 
            : isDueSoon
            ? 'bg-amber-50 dark:bg-amber-950/20 text-[#FF9800] border-amber-100 dark:border-amber-950/50'
            : 'bg-slate-50 dark:bg-slate-900/40 text-text-secondary border-border/40'
        }`}>
          <Calendar size={11} className="stroke-[2.5]" />
          {dateText}
        </span>
      </div>
    </div>
  );
}
