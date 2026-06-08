import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Eye, EyeOff, Loader2, CheckSquare, Mail, Lock } from 'lucide-react';
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
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Subtle background accents */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-48 -right-48 w-96 h-96 bg-indigo-100/60 rounded-full blur-3xl" />
        <div className="absolute -bottom-48 -left-48 w-96 h-96 bg-violet-100/40 rounded-full blur-3xl" />
      </div>

      <div className="w-full max-w-md relative animate-slide-up">
        {/* Logo mark */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-11 h-11 bg-indigo-600 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-200 mb-4">
            <CheckSquare size={22} className="text-white" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Welcome back</h1>
          <p className="text-slate-500 text-sm mt-1.5">Sign in to your TaskFlow account</p>
        </div>

        {/* Card */}
        <div className="bg-white border border-slate-200 rounded-2xl p-7 shadow-[0_4px_24px_-4px_rgba(0,0,0,0.08)]">
          {serverError && (
            <div className="mb-5 px-4 py-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm animate-fade-in flex items-start gap-2">
              <span className="mt-0.5">⚠</span>
              {serverError}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            {/* Email */}
            <div>
              <label className="label">Email address</label>
              <div className="relative">
                <Mail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                  autoComplete="email"
                  className={`input-field pl-9 ${errors.email ? 'border-red-400 focus:border-red-400 focus:ring-red-200' : ''}`}
                />
              </div>
              {errors.email && <p className="mt-1.5 text-xs text-red-600">{errors.email}</p>}
            </div>

            {/* Password */}
            <div>
              <label className="label">Password</label>
              <div className="relative">
                <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  autoComplete="current-password"
                  className={`input-field pl-9 pr-10 ${errors.password ? 'border-red-400 focus:border-red-400 focus:ring-red-200' : ''}`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((s) => !s)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                >
                  {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
              {errors.password && <p className="mt-1.5 text-xs text-red-600">{errors.password}</p>}
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full flex items-center justify-center gap-2 mt-2 py-3"
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
          <div className="flex items-center gap-3 my-5">
            <div className="flex-1 h-px bg-slate-100" />
            <span className="text-xs text-slate-400 font-medium">OR</span>
            <div className="flex-1 h-px bg-slate-100" />
          </div>

          <p className="text-center text-sm text-slate-500">
            Don't have an account?{' '}
            <Link to="/register" className="text-indigo-600 hover:text-indigo-700 font-semibold transition-colors">
              Create one free
            </Link>
          </p>
        </div>

        <p className="text-center text-xs text-slate-400 mt-6">
          © {new Date().getFullYear()} TaskFlow. Built with React & Node.js.
        </p>
      </div>
    </div>
  );
}
