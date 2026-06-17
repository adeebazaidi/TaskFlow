import { useState, useEffect, useRef } from 'react';
import { X, Loader2, Calendar, Flag, AlignLeft, Type } from 'lucide-react';

const defaultForm = { title: '', description: '', priority: 'medium', dueDate: '' };

export default function TaskModal({ isOpen, onClose, onSubmit, task, loading }) {
  const [form, setForm] = useState(defaultForm);
  const [errors, setErrors] = useState({});
  const inputRef = useRef(null);

  const isEditing = Boolean(task);

  useEffect(() => {
    if (isOpen) {
      setForm(
        task
          ? { title: task.title, description: task.description || '', priority: task.priority || 'medium', dueDate: task.dueDate ? new Date(task.dueDate).toISOString().split('T')[0] : '' }
          : defaultForm
      );
      setErrors({});
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen, task]);

  // Close on Escape
  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') onClose(); };
    if (isOpen) window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [isOpen, onClose]);

  const validate = () => {
    const errs = {};
    if (!form.title.trim()) errs.title = 'Title is required';
    else if (form.title.trim().length > 100) errs.title = 'Max 100 characters';
    if (form.description.length > 500) errs.description = 'Max 500 characters';
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    try {
      await onSubmit({ title: form.title.trim(), description: form.description.trim(), priority: form.priority, dueDate: form.dueDate || null });
      onClose();
    } catch {
      // error already toasted in hook
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
    if (errors[name]) setErrors((err) => ({ ...err, [name]: '' }));
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-md animate-fade-in"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="w-full max-w-md bg-card border border-border/80 rounded-[24px] shadow-[0_25px_60px_-15px_rgba(0,0,0,0.3)] dark:shadow-[0_25px_60px_-15px_rgba(0,0,0,0.7)] animate-slide-up overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-border/80 bg-slate-500/5">
          <div>
            <h2 className="text-base font-extrabold text-text">
              {isEditing ? 'Edit Task' : 'New Task'}
            </h2>
            <p className="text-xs text-text-secondary mt-0.5 font-medium">
              {isEditing ? 'Update the task details below' : 'Fill in the details to create a task'}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-text-secondary hover:text-text hover:bg-slate-100 dark:hover:bg-slate-800 transition-all duration-200"
          >
            <X size={16} className="stroke-[2.5]" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
          {/* Title */}
          <div>
            <label className="label flex items-center gap-1.5">
              <Type size={13} className="text-indigo-500" />
              <span>Title <span className="text-rose-500">*</span></span>
            </label>
            <input
              ref={inputRef}
              type="text"
              name="title"
              value={form.title}
              onChange={handleChange}
              placeholder="e.g., Design landing page layout"
              className={`input-field font-semibold ${errors.title ? 'border-rose-400 focus:border-rose-400 focus:ring-rose-200' : ''}`}
              maxLength={100}
            />
            <div className="flex justify-between mt-1.5">
              {errors.title ? (
                <p className="text-xs text-rose-500 font-semibold">{errors.title}</p>
              ) : <span />}
              <span className="text-[10px] text-text-secondary font-bold">{form.title.length}/100</span>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="label flex items-center gap-1.5">
              <AlignLeft size={13} className="text-indigo-500" />
              <span>Description</span>
            </label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="Add more details or notes about this task…"
              rows={3}
              className={`input-field resize-none font-medium ${errors.description ? 'border-rose-400 focus:border-rose-400 focus:ring-rose-200' : ''}`}
              maxLength={500}
            />
            <div className="flex justify-between mt-1.5">
              {errors.description ? (
                <p className="text-xs text-rose-500 font-semibold">{errors.description}</p>
              ) : <span />}
              <span className="text-[10px] text-text-secondary font-bold">{form.description.length}/500</span>
            </div>
          </div>

          {/* Priority */}
          <div>
            <label className="label flex items-center gap-1.5">
              <Flag size={13} className="text-indigo-500" />
              <span>Priority Level</span>
            </label>
            <div className="grid grid-cols-3 gap-2.5">
              {['low', 'medium', 'high'].map((p) => {
                const active = form.priority === p;
                const styles = {
                  low:    active ? 'bg-teal-500/10 border-teal-500 text-teal-700 dark:text-teal-400 font-bold' : 'border-border text-text-secondary hover:border-slate-300 dark:hover:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800/50',
                  medium: active ? 'bg-amber-500/10 border-amber-500 text-amber-700 dark:text-amber-400 font-bold' : 'border-border text-text-secondary hover:border-slate-300 dark:hover:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800/50',
                  high:   active ? 'bg-rose-500/10 border-rose-500 text-rose-700 dark:text-rose-400 font-bold' : 'border-border text-text-secondary hover:border-slate-300 dark:hover:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800/50',
                };
                return (
                  <button
                    key={p}
                    type="button"
                    onClick={() => setForm((f) => ({ ...f, priority: p }))}
                    className={`py-2 px-3 rounded-xl border text-xs capitalize transition-all duration-300 active:scale-95 ${styles[p]}`}
                  >
                    {p}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Due Date */}
          <div>
            <label className="label flex items-center gap-1.5">
              <Calendar size={13} className="text-indigo-500" />
              <span>Due Date</span>
            </label>
            <input
              type="date"
              name="dueDate"
              value={form.dueDate}
              onChange={handleChange}
              className="input-field font-semibold text-text-secondary cursor-pointer"
            />
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="btn-secondary flex-1 py-3 text-sm">
              Cancel
            </button>
            <button type="submit" disabled={loading} className="btn-primary flex-1 flex items-center justify-center gap-2 py-3 text-sm">
              {loading ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  {isEditing ? 'Saving…' : 'Creating…'}
                </>
              ) : (
                isEditing ? 'Save Changes' : 'Create Task'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
