import { useState, useRef, useEffect } from 'react';
import { LogOut, CheckSquare, ChevronDown, Sun, Moon } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [open, setOpen] = useState(false);
  const menuRef = useRef(null);

  const avatarUrl = user?.name ? `https://api.dicebear.com/7.x/notionists/svg?seed=${encodeURIComponent(user.name)}&backgroundColor=e0e7ff` : '';

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
    <header className="sticky top-0 z-40 border-b border-border bg-card/95 backdrop-blur-sm shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center shadow-sm shadow-indigo-100 dark:shadow-none">
            <CheckSquare size={17} className="text-white" />
          </div>
          <span className="font-bold text-lg tracking-tight text-text">
            Task<span className="text-gradient">Flow</span>
          </span>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 sm:gap-4">
          <button
            onClick={toggleTheme}
            className="p-2 rounded-xl text-text-secondary hover:text-text hover:bg-slate-100 dark:bg-slate-800 dark:hover:bg-slate-800 transition-colors"
            title="Toggle theme"
          >
            {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
          </button>

          {/* User Menu */}
          <div className="relative" ref={menuRef}>
          <button
            onClick={() => setOpen((prev) => !prev)}
            className="flex items-center gap-2.5 px-3 py-1.5 rounded-xl hover:bg-slate-50 dark:bg-slate-800/50 dark:hover:bg-slate-800 border border-transparent hover:border-border transition-all duration-150"
          >
            <img src={avatarUrl} alt="User Avatar" className="w-8 h-8 rounded-lg shadow-sm border border-border bg-slate-50 dark:bg-slate-800/50 dark:bg-slate-800" />
            <span className="text-text text-sm font-medium hidden sm:block">{user?.name}</span>
            <ChevronDown
              size={14}
              className={`text-text-secondary transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
            />
          </button>

          {open && (
            <div className="absolute right-0 mt-2 w-56 bg-card border border-border rounded-2xl shadow-[0_8px_32px_-4px_rgba(0,0,0,0.12)] py-1.5 animate-slide-up">
              <div className="px-4 py-2.5 border-b border-border">
                <p className="text-xs text-text-secondary font-medium">Signed in as</p>
                <p className="text-sm text-text font-semibold truncate mt-0.5">{user?.email}</p>
              </div>
              <button
                onClick={() => { logout(); setOpen(false); }}
                className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-danger hover:bg-red-50 dark:hover:bg-red-900/30 transition-colors duration-150 rounded-b-xl"
              >
                <LogOut size={15} />
                Sign out
              </button>
            </div>
          )}
        </div>
        </div>
      </div>
    </header>
  );
}
