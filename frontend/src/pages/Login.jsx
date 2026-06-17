import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Eye, EyeOff, Loader2, CheckCircle2, Mail, Lock } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

export default function Login() {
  const { login } = useAuth();
  const [form, setForm] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');

  const validate = () => {
    const errs = {};
    if (!form.email.trim()) errs.email = 'Email is required';
    else if (!/^\S+@\S+\.\S+$/.test(form.email)) errs.email = 'Enter a valid email';
    if (!form.password) errs.password = 'Password is required';
    return errs;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
    if (errors[name]) setErrors((err) => ({ ...err, [name]: '' }));
    if (serverError) setServerError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setLoading(true);
    try {
      await login(form);
    } catch (err) {
      const msg = err.message || 'Login failed. Please try again.';
      setServerError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Decorative ambient gradients */}
      <div className="absolute top-0 left-0 right-0 bottom-0 pointer-events-none overflow-hidden">
        <div className="bg-glow-purple -top-48 -right-48" style={{ width: '600px', height: '600px' }} />
        <div className="bg-glow-rose -bottom-48 -left-48" style={{ width: '600px', height: '600px' }} />
      </div>

      <div className="w-full max-w-[420px] relative z-10 animate-slide-up">
        {/* Brand Logo Header */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-12 h-12 bg-gradient-to-tr from-indigo-500 to-violet-600 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-500/20 mb-4 animate-pulse">
            <CheckCircle2 size={24} className="text-white stroke-[2.5]" />
          </div>
          <h1 className="text-2xl font-extrabold text-text tracking-tight">Welcome back</h1>
          <p className="text-text-secondary text-sm font-medium mt-1">Sign in to manage your tasks</p>
        </div>

        {/* Glassmorphic Form Card */}
        <div className="glass-card p-8 border border-border/80 shadow-2xl">
          {serverError && (
            <div className="mb-5 px-4 py-3 bg-rose-50 dark:bg-rose-950/20 border border-rose-200/50 dark:border-rose-900/50 rounded-2xl text-rose-600 dark:text-rose-400 text-xs font-bold animate-fade-in flex items-start gap-2">
              <span className="mt-0.5">⚠️</span>
              <span>{serverError}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            {/* Email Address */}
            <div>
              <label className="label">Email address</label>
              <div className="relative">
                <Mail size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-text-secondary pointer-events-none stroke-[2]" />
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                  autoComplete="email"
                  className={`input-field pl-10 ${errors.email ? 'border-rose-400 focus:border-rose-400 focus:ring-rose-200' : ''}`}
                />
              </div>
              {errors.email && <p className="mt-1.5 text-xs text-rose-500 font-semibold">{errors.email}</p>}
            </div>

            {/* Password */}
            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="label !mb-0">Password</label>
              </div>
              <div className="relative">
                <Lock size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-text-secondary pointer-events-none stroke-[2]" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  autoComplete="current-password"
                  className={`input-field pl-10 pr-10 ${errors.password ? 'border-rose-400 focus:border-rose-400 focus:ring-rose-200' : ''}`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((s) => !s)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-text-secondary/70 hover:text-text transition-colors p-1"
                >
                  {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
              {errors.password && <p className="mt-1.5 text-xs text-rose-500 font-semibold">{errors.password}</p>}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full flex items-center justify-center gap-2 mt-4 py-3 text-sm font-bold shadow-lg"
            >
              {loading ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  Signing in…
                </>
              ) : (
                'Sign in'
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-3 my-6">
            <div className="flex-1 h-px bg-border/80" />
            <span className="text-[10px] text-text-secondary font-bold uppercase tracking-wider">OR</span>
            <div className="flex-1 h-px bg-border/80" />
          </div>

          <p className="text-center text-sm font-medium text-text-secondary">
            Don't have an account?{' '}
            <Link to="/register" className="text-indigo-500 hover:text-indigo-600 dark:text-indigo-400 dark:hover:text-indigo-300 font-bold transition-colors">
              Create one free
            </Link>
          </p>
        </div>

        {/* Demo Credentials Box */}
        <div className="mt-6 p-4 rounded-[18px] bg-slate-500/5 border border-border/40 backdrop-blur-sm text-center text-xs text-text-secondary font-medium">
          <p className="font-bold text-text mb-1 text-[11px] uppercase tracking-wider text-indigo-500">Quick Test Credentials</p>
          <div className="flex justify-center gap-4 mt-1.5">
            <p>Email: <span className="font-bold text-text select-all">test@test.com</span></p>
            <p>Password: <span className="font-bold text-text select-all">test@123</span></p>
          </div>
        </div>
      </div>
    </div>
  );
}
