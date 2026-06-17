import { useState, useRef, useEffect } from 'react';
import { LogOut, CheckCircle2, ChevronDown, Sun, Moon } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [open, setOpen] = useState(false);
  const menuRef = useRef(null);

  const avatarUrl = user?.name 
    ? `https://api.dicebear.com/7.x/lorelei/svg?seed=${encodeURIComponent(user.name)}&backgroundColor=b6e3f4,c0aede,d1d4f9` 
    : '';

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
    <div className="pt-4 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto sticky top-0 z-40 bg-transparent">
      <header className="bg-card border border-border rounded-[22px] px-4 sm:px-6 h-16 flex items-center justify-between shadow-[0_10px_30px_rgba(0,0,0,0.05)] dark:shadow-[0_10px_30px_rgba(0,0,0,0.3)] backdrop-blur-md">
        {/* Logo */}
        <div className="flex items-center gap-3 group cursor-default">
          <div className="w-9 h-9 bg-gradient-to-tr from-[#1E5387] to-[#2E6CA4] rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20 group-hover:scale-105 transition-transform duration-300">
            <CheckCircle2 size={18} className="text-white stroke-[2.5]" />
          </div>
          <span className="font-extrabold text-xl tracking-tight text-text">
            Task<span className="bg-gradient-to-r from-[#1E5387] to-[#0C8F8F] bg-clip-text text-transparent">Flow</span>
          </span>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="p-2.5 rounded-xl text-text-secondary hover:text-text hover:bg-slate-50 dark:hover:bg-slate-800/80 border border-transparent hover:border-border transition-all duration-300 active:scale-95"
            title="Toggle theme"
          >
            {theme === 'dark' ? (
              <Sun size={18} className="transition-all duration-300 hover:rotate-45" />
            ) : (
              <Moon size={18} className="transition-all duration-300 hover:-rotate-12" />
            )}
          </button>

          {/* User Menu */}
          <div className="relative" ref={menuRef}>
            <button
              onClick={() => setOpen((prev) => !prev)}
              className="flex items-center gap-2.5 px-3 py-1.5 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/50 border border-transparent hover:border-border transition-all duration-200"
            >
              <img 
                src={avatarUrl} 
                alt="User Avatar" 
                className="w-8 h-8 rounded-lg shadow-inner border border-border/60 bg-blue-50 dark:bg-slate-800" 
              />
              <span className="text-text text-sm font-semibold hidden sm:block">{user?.name}</span>
              <ChevronDown
                size={14}
                className={`text-text-secondary transition-transform duration-300 ${open ? 'rotate-180' : ''}`}
              />
            </button>

            {open && (
              <div className="absolute right-0 mt-2.5 w-60 bg-card border border-border rounded-2xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.12)] dark:shadow-[0_15px_50px_-10px_rgba(0,0,0,0.5)] py-2 animate-slide-up overflow-hidden z-50">
                <div className="px-5 py-3 border-b border-border/80">
                  <p className="text-[10px] text-text-secondary font-bold uppercase tracking-wider">Signed in as</p>
                  <p className="text-sm text-text font-bold truncate mt-0.5">{user?.name}</p>
                  <p className="text-xs text-text-secondary truncate mt-0.5">{user?.email}</p>
                </div>
                <div className="p-1">
                  <button
                    onClick={() => { logout(); setOpen(false); }}
                    className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm font-semibold text-[#F06F5A] hover:bg-rose-50 dark:hover:bg-rose-950/20 transition-colors duration-200 rounded-xl"
                  >
                    <LogOut size={16} />
                    Sign out
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>
    </div>
  );
}
