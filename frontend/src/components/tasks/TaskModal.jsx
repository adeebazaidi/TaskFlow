import { useState, useEffect, useRef } from 'react';
import { X, Loader2 } from 'lucide-react';

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
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-fade-in"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="w-full max-w-md bg-white border border-slate-200 rounded-2xl shadow-[0_20px_60px_-10px_rgba(0,0,0,0.18)] animate-slide-up">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100">
          <div>
            <h2 className="text-base font-bold text-slate-900">
              {isEditing ? 'Edit Task' : 'New Task'}
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              {isEditing ? 'Update the task details below' : 'Fill in the details to create a task'}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-all duration-150"
          >
            <X size={17} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
          {/* Title */}
          <div>
            <label className="label">
              Title <span className="text-red-500">*</span>
            </label>
            <input
              ref={inputRef}
              type="text"
              name="title"
              value={form.title}
              onChange={handleChange}
              placeholder="e.g. Design landing page"
              className={`input-field ${errors.title ? 'border-red-400 focus:border-red-400 focus:ring-red-200' : ''}`}
              maxLength={100}
            />
            <div className="flex justify-between mt-1.5">
              {errors.title ? (
                <p className="text-xs text-red-600">{errors.title}</p>
              ) : <span />}
              <span className="text-xs text-slate-400">{form.title.length}/100</span>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="label">Description</label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="Add more details about this task…"
              rows={3}
              className={`input-field resize-none ${errors.description ? 'border-red-400 focus:border-red-400 focus:ring-red-200' : ''}`}
              maxLength={500}
            />
            <div className="flex justify-between mt-1.5">
              {errors.description ? (
                <p className="text-xs text-red-600">{errors.description}</p>
              ) : <span />}
              <span className="text-xs text-slate-400">{form.description.length}/500</span>
            </div>
          </div>

          {/* Priority */}
          <div>
            <label className="label">Priority</label>
            <div className="grid grid-cols-3 gap-2">
              {['low', 'medium', 'high'].map((p) => {
                const active = form.priority === p;
                const styles = {
                  low:    active ? 'bg-slate-100 border-slate-400 text-slate-800 font-semibold' : 'border-slate-200 text-slate-500 hover:border-slate-300 hover:bg-slate-50',
                  medium: active ? 'bg-blue-50 border-blue-500 text-blue-700 font-semibold' : 'border-slate-200 text-slate-500 hover:border-slate-300 hover:bg-slate-50',
                  high:   active ? 'bg-red-50 border-red-400 text-red-700 font-semibold' : 'border-slate-200 text-slate-500 hover:border-slate-300 hover:bg-slate-50',
                };
                return (
                  <button
                    key={p}
                    type="button"
                    onClick={() => setForm((f) => ({ ...f, priority: p }))}
                    className={`py-2 px-3 rounded-xl border text-sm capitalize transition-all duration-150 ${styles[p]}`}
                  >
                    {p}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Due Date */}
          <div>
            <label className="label">Due Date</label>
            <input
              type="date"
              name="dueDate"
              value={form.dueDate}
              onChange={handleChange}
              className="input-field"
            />
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-1">
            <button type="button" onClick={onClose} className="btn-secondary flex-1">
              Cancel
            </button>
            <button type="submit" disabled={loading} className="btn-primary flex-1 flex items-center justify-center gap-2">
              {loading ? (
                <>
                  <Loader2 size={15} className="animate-spin" />
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
