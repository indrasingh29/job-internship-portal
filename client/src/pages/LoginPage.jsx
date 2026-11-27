import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  Briefcase,
  Lock,
  Mail,
  Eye,
  EyeOff,
  AlertCircle,
  LogIn
} from 'lucide-react';

const LoginPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const from = location.state?.from?.pathname || '/';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await login(email, password);
      if (res?.user?.role === 'student') {
        navigate(from === '/' ? '/student/dashboard' : from);
      } else if (res?.user?.role === 'recruiter') {
        navigate('/recruiter/dashboard');
      } else if (res?.user?.role === 'admin') {
        navigate('/admin/dashboard');
      } else {
        navigate('/');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid email or password.');
    } finally {
      setLoading(false);
    }
  };

  const fillCredentials = (demoEmail, demoPassword) => {
    setEmail(demoEmail);
    setPassword(demoPassword);
    setError(null);
  };

  return (
    <div className="min-h-[80vh] flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center space-y-2 px-4">
        <div className="w-12 h-12 rounded-2xl bg-brand-600 flex items-center justify-center text-white mx-auto shadow-sm">
          <Briefcase className="w-6 h-6" />
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Welcome Back
        </h1>
        <p className="text-xs text-slate-500">
          Sign in to access your JobPortal account and dashboard.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4">
        <div className="bg-white py-8 px-6 sm:px-9 rounded-3xl border border-slate-200 shadow-lg shadow-slate-900/5 space-y-6">
          {error && (
            <div className="p-3.5 rounded-xl text-xs font-semibold bg-red-50 text-red-700 border border-red-200 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="login-email" className="block text-xs font-bold text-slate-700 mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  id="login-email"
                  type="email"
                  required
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full text-xs text-slate-800 pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:border-brand-500"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label htmlFor="login-password" className="block text-xs font-bold text-slate-700">
                  Password
                </label>
                <Link
                  to="/forgot-password"
                  className="text-xs font-semibold text-brand-600 hover:text-brand-700"
                >
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  id="login-password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full text-xs text-slate-800 pl-10 pr-10 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:border-brand-500"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  className="absolute right-3.5 top-2.5 text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <LogIn className="w-4 h-4" />
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          {/* Quick Demo Accounts */}
          <div className="pt-4 border-t border-slate-100 space-y-2.5">
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider text-center">
              Quick Demo Access
            </p>
            <div className="grid grid-cols-3 gap-2 text-[11px] font-semibold">
              <button
                type="button"
                onClick={() => fillCredentials('student@demo.com', 'Student@123')}
                className="py-1.5 px-2 rounded-lg bg-slate-50 text-slate-700 border border-slate-200 hover:bg-brand-50 hover:text-brand-700 hover:border-brand-200 transition-colors"
              >
                Student
              </button>
              <button
                type="button"
                onClick={() => fillCredentials('recruiter@demo.com', 'Recruiter@123')}
                className="py-1.5 px-2 rounded-lg bg-slate-50 text-slate-700 border border-slate-200 hover:bg-brand-50 hover:text-brand-700 hover:border-brand-200 transition-colors"
              >
                Recruiter
              </button>
              <button
                type="button"
                onClick={() => fillCredentials('admin@demo.com', 'Admin@123')}
                className="py-1.5 px-2 rounded-lg bg-slate-50 text-slate-700 border border-slate-200 hover:bg-brand-50 hover:text-brand-700 hover:border-brand-200 transition-colors"
              >
                Admin
              </button>
            </div>
          </div>

          <div className="text-center text-xs text-slate-500 pt-1">
            Don't have an account yet?{' '}
            <Link to="/register" className="font-bold text-brand-600 hover:text-brand-700">
              Create an account
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
