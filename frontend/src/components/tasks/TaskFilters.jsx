import { useRef, useEffect } from 'react';
import { Search, X, SlidersHorizontal } from 'lucide-react';

const STATUS_FILTERS = [
  { value: '', label: 'All' },
  { value: 'pending', label: 'Pending' },
  { value: 'completed', label: 'Completed' },
];

const PRIORITY_FILTERS = [
  { value: '', label: 'Any Priority' },
  { value: 'high', label: 'High Priority' },
  { value: 'medium', label: 'Medium Priority' },
  { value: 'low', label: 'Low Priority' },
];

export default function TaskFilters({ filters, onChange }) {
  const searchRef = useRef(null);
  const debounceTimer = useRef(null);

  // Sync the uncontrolled search input when the parent clears filters externally
  useEffect(() => {
    if (searchRef.current && filters.search === '' && searchRef.current.value !== '') {
      searchRef.current.value = '';
    }
  }, [filters.search]);

  useEffect(() => {
    return () => clearTimeout(debounceTimer.current);
  }, []);

  const handleSearch = (e) => {
    const value = e.target.value;
    clearTimeout(debounceTimer.current);
    debounceTimer.current = setTimeout(() => {
      onChange({ ...filters, search: value });
    }, 400);
  };

  const clearSearch = () => {
    if (searchRef.current) searchRef.current.value = '';
    clearTimeout(debounceTimer.current);
    onChange({ ...filters, search: '' });
  };

  return (
    <div className="flex flex-col md:flex-row gap-3">
      {/* Search Bar */}
      <div className="relative flex-1">
        <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-text-secondary pointer-events-none stroke-[2]" />
        <input
          ref={searchRef}
          type="text"
          defaultValue={filters.search}
          onChange={handleSearch}
          placeholder="Search tasks by title or description…"
          className="input-field pl-10 pr-10 py-2.5 font-medium"
        />
        {filters.search && (
          <button
            onClick={clearSearch}
            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-text-secondary hover:text-text transition-colors p-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg"
          >
            <X size={14} />
          </button>
        )}
      </div>

      <div className="flex flex-wrap sm:flex-nowrap gap-3 items-center">
        {/* Status Pill Toggle */}
        <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-900 border border-border rounded-2xl p-1 shadow-inner w-full sm:w-auto">
          <div className="flex items-center gap-1.5 pl-2.5 pr-1 text-text-secondary">
            <SlidersHorizontal size={13} className="stroke-[2.5]" />
          </div>
          {STATUS_FILTERS.map(({ value, label }) => {
            const active = filters.status === value;
            return (
              <button
                key={value}
                onClick={() => onChange({ ...filters, status: value })}
                className={`flex-1 sm:flex-none px-4 py-1.5 rounded-xl text-xs font-bold transition-all duration-300 ${
                  active
                    ? 'bg-card text-indigo-500 dark:text-indigo-400 shadow-sm border border-border'
                    : 'text-text-secondary hover:text-text hover:bg-card/30'
                }`}
              >
                {label}
              </button>
            );
          })}
        </div>

        {/* Priority Select Dropdown */}
        <div className="relative w-full sm:w-auto">
          <select
            value={filters.priority}
            onChange={(e) => onChange({ ...filters, priority: e.target.value })}
            className="input-field py-2 text-xs font-bold text-text-secondary cursor-pointer min-w-[130px] pr-8 appearance-none"
          >
            {PRIORITY_FILTERS.map((pf) => (
              <option key={pf.value} value={pf.value} className="bg-card text-text font-medium">
                {pf.label}
              </option>
            ))}
          </select>
          <div className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none border-l-4 border-r-4 border-t-4 border-transparent border-t-text-secondary w-0 h-0" />
        </div>

        {/* Clear Filters Button */}
        {(filters.status || filters.priority || filters.search) && (
          <button
            onClick={() => onChange({ status: '', priority: '', search: '' })}
            className="text-xs font-bold text-text-secondary hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/20 px-3.5 py-2.5 rounded-xl transition-all border border-transparent hover:border-rose-100 dark:hover:border-rose-950/50 whitespace-nowrap active:scale-95 w-full sm:w-auto text-center"
          >
            Clear Filters
          </button>
        )}
      </div>
    </div>
  );
}
