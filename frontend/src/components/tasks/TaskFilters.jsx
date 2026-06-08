import { useRef, useEffect } from 'react';
import { Search, X, SlidersHorizontal } from 'lucide-react';

const STATUS_FILTERS = [
  { value: '', label: 'All' },
  { value: 'pending', label: 'Pending' },
  { value: 'completed', label: 'Completed' },
];

const PRIORITY_FILTERS = [
  { value: '', label: 'Any Priority' },
  { value: 'high', label: 'High' },
  { value: 'medium', label: 'Medium' },
  { value: 'low', label: 'Low' },
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
    <div className="flex flex-col sm:flex-row gap-3">
      {/* Search */}
      <div className="relative flex-1">
        <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
        <input
          ref={searchRef}
          type="text"
          defaultValue={filters.search}
          onChange={handleSearch}
          placeholder="Search tasks…"
          className="input-field pl-9 pr-9 py-2.5"
        />
        {filters.search && (
          <button
            onClick={clearSearch}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
          >
            <X size={14} />
          </button>
        )}
      </div>

      {/* Status filter */}
      <div className="flex items-center gap-1 bg-slate-100 border border-slate-200 rounded-xl p-1">
        <SlidersHorizontal size={12} className="text-slate-400 ml-1.5 flex-shrink-0" />
        {STATUS_FILTERS.map(({ value, label }) => (
          <button
            key={value}
            onClick={() => onChange({ ...filters, status: value })}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-150 ${
              filters.status === value
                ? 'bg-white text-primary shadow-sm border border-slate-200'
                : 'text-slate-500 hover:text-slate-700 hover:bg-white/60'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Priority filter */}
      <select
        value={filters.priority}
        onChange={(e) => onChange({ ...filters, priority: e.target.value })}
        className="input-field max-w-[140px] text-xs py-2"
      >
        {PRIORITY_FILTERS.map((pf) => (
          <option key={pf.value} value={pf.value}>{pf.label}</option>
        ))}
      </select>

      {/* Clear Filters */}
      {(filters.status || filters.priority || filters.search) && (
        <button
          onClick={() => onChange({ status: '', priority: '', search: '' })}
          className="text-xs text-slate-500 hover:text-danger hover:bg-red-50 px-3 py-2 rounded-xl transition-colors border border-transparent hover:border-red-100 whitespace-nowrap"
        >
          Clear Filters
        </button>
      )}
    </div>
  );
}
