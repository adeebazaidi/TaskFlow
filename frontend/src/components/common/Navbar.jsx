import { useState, useRef, useEffect } from 'react';
import { LogOut, CheckSquare, ChevronDown } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const menuRef = useRef(null);

  const initials = user?.name
    ?.split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  // Close dropdown when clicking outside the menu
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    if (open) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [open]);

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/95 backdrop-blur-sm shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center shadow-sm shadow-indigo-100">
            <CheckSquare size={17} className="text-white" />
          </div>
          <span className="font-bold text-lg tracking-tight text-slate-900">
            Task<span className="text-gradient">Flow</span>
          </span>
        </div>

        {/* User Menu */}
        <div className="relative" ref={menuRef}>
          <button
            onClick={() => setOpen((prev) => !prev)}
            className="flex items-center gap-2.5 px-3 py-1.5 rounded-xl hover:bg-slate-50 border border-transparent hover:border-slate-200 transition-all duration-150"
          >
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-white text-xs font-bold shadow-sm">
              {initials}
            </div>
            <span className="text-slate-700 text-sm font-medium hidden sm:block">{user?.name}</span>
            <ChevronDown
              size={14}
              className={`text-slate-400 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
            />
          </button>

          {open && (
            <div className="absolute right-0 mt-2 w-56 bg-white border border-slate-200 rounded-2xl shadow-[0_8px_32px_-4px_rgba(0,0,0,0.12)] py-1.5 animate-slide-up">
              <div className="px-4 py-2.5 border-b border-slate-100">
                <p className="text-xs text-slate-400 font-medium">Signed in as</p>
                <p className="text-sm text-slate-800 font-semibold truncate mt-0.5">{user?.email}</p>
              </div>
              <button
                onClick={() => { logout(); setOpen(false); }}
                className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors duration-150 rounded-b-xl"
              >
                <LogOut size={15} />
                Sign out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
