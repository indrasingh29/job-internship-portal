import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import {
  Briefcase,
  Lock,
  Eye,
  EyeOff,
  CheckCircle2,
  AlertCircle,
  ArrowLeft,
  ShieldCheck
} from 'lucide-react';

const getPasswordStrength = (pw) => {
  if (!pw) return { label: '', color: 'bg-slate-200', width: '0%' };
  let score = 0;
  if (pw.length >= 6) score += 1;
  if (pw.length >= 10) score += 1;
  if (/[A-Z]/.test(pw) && /[a-z]/.test(pw)) score += 1;
  if (/\d/.test(pw)) score += 1;
  if (/[^A-Za-z0-9]/.test(pw)) score += 1;

  if (score <= 2) return { label: 'Weak', color: 'bg-red-500', width: '33%' };
  if (score <= 3) return { label: 'Fair', color: 'bg-amber-500', width: '66%' };
  return { label: 'Strong', color: 'bg-emerald-500', width: '100%' };
};

const ResetPasswordPage = () => {
  const { token } = useParams();
  const navigate = useNavigate();

  const [checkingToken, setCheckingToken] = useState(true);
  const [tokenValid, setTokenValid] = useState(false);
  const [tokenError, setTokenError] = useState(null);

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  useEffect(() => {
    const validateToken = async () => {
      setCheckingToken(true);
      setTokenError(null);
      try {
        const res = await api.get(`/auth/reset-password/${token}`);
        if (res.data.success) {
          setTokenValid(true);
        }
      } catch (err) {
        setTokenValid(false);
        setTokenError(
          err.response?.data?.message ||
            'This password reset link is invalid or has expired.'
        );
      } finally {
        setCheckingToken(false);
      }
    };
    if (token) {
      validateToken();
    } else {
      setCheckingToken(false);
      setTokenValid(false);
      setTokenError('Missing password reset token.');
    }
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setSubmitting(true);
    try {
      const res = await api.post(`/auth/reset-password/${token}`, {
        password,
        confirmPassword
      });
      if (res.data.success) {
        setSuccess(res.data.message || 'Password reset successful! Redirecting to login...');
        setTimeout(() => {
          navigate('/login', { replace: true });
        }, 2000);
      }
    } catch (err) {
      setError(
        err.response?.data?.message ||
          'Failed to reset password. The link may have expired.'
      );
    } finally {
      setSubmitting(false);
    }
  };

  const strength = getPasswordStrength(password);

  return (
    <div className="min-h-[80vh] flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center space-y-2 px-4">
        <div className="w-12 h-12 rounded-2xl bg-brand-600 flex items-center justify-center text-white mx-auto shadow-sm">
          <Briefcase className="w-6 h-6" />
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Reset Password
        </h1>
        <p className="text-xs text-slate-500">
          Choose a new password for your JobPortal account.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4">
        <div className="bg-white py-8 px-6 sm:px-9 rounded-3xl border border-slate-200 shadow-lg shadow-slate-900/5 space-y-5">
          {checkingToken ? (
            <div className="py-8 text-center space-y-3">
              <div className="w-8 h-8 border-4 border-brand-600 border-t-transparent rounded-full animate-spin mx-auto" />
              <p className="text-xs text-slate-500 font-medium">Validating reset link...</p>
            </div>
          ) : !tokenValid ? (
            <div className="text-center space-y-4 py-4">
              <div className="w-12 h-12 rounded-full bg-red-50 text-red-600 flex items-center justify-center mx-auto">
                <AlertCircle className="w-6 h-6" />
              </div>
              <div className="space-y-1.5">
                <h2 className="text-base font-bold text-slate-900">Link Invalid or Expired</h2>
                <p className="text-xs text-slate-500 leading-relaxed">{tokenError}</p>
              </div>
              <div className="flex flex-col gap-2 pt-2">
                <Link
                  to="/forgot-password"
                  className="w-full py-2.5 bg-brand-600 hover:bg-brand-700 text-white font-semibold text-xs rounded-xl transition-colors"
                >
                  Request a New Reset Link
                </Link>
                <Link
                  to="/login"
                  className="inline-flex items-center justify-center gap-1 text-xs font-semibold text-slate-600 hover:text-slate-900 py-2"
                >
                  <ArrowLeft className="w-3.5 h-3.5" /> Back to Login
                </Link>
              </div>
            </div>
          ) : success ? (
            <div className="text-center space-y-4 py-4">
              <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <div className="space-y-1.5">
                <h2 className="text-base font-bold text-slate-900">Password Updated</h2>
                <p className="text-xs text-slate-600">{success}</p>
              </div>
              <Link
                to="/login"
                className="inline-block px-5 py-2.5 bg-brand-600 hover:bg-brand-700 text-white font-semibold text-xs rounded-xl transition-colors"
              >
                Go to Sign In
              </Link>
            </div>
          ) : (
            <>
              {error && (
                <div className="p-3.5 rounded-xl text-xs font-semibold bg-red-50 text-red-700 border border-red-200 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4 text-xs">
                <div>
                  <label htmlFor="reset-password" className="block font-bold text-slate-700 mb-1.5">
                    New Password (min 6 characters)
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                    <input
                      id="reset-password"
                      type={showPassword ? 'text' : 'password'}
                      required
                      minLength={6}
                      placeholder="Enter new password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full text-xs text-slate-800 pl-10 pr-10 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:border-brand-500"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((prev) => !prev)}
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                      className="absolute right-3.5 top-2.5 text-slate-400 hover:text-slate-600"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>

                  {password && (
                    <div className="mt-2 space-y-1">
                      <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                        <div
                          className={`h-full transition-all duration-300 ${strength.color}`}
                          style={{ width: strength.width }}
                        />
                      </div>
                      <p className="text-[11px] text-slate-500">
                        Password strength: <span className="font-semibold text-slate-700">{strength.label}</span>
                      </p>
                    </div>
                  )}
                </div>

                <div>
                  <label htmlFor="reset-confirm" className="block font-bold text-slate-700 mb-1.5">
                    Confirm New Password
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                    <input
                      id="reset-confirm"
                      type={showConfirm ? 'text' : 'password'}
                      required
                      minLength={6}
                      placeholder="Re-enter new password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full text-xs text-slate-800 pl-10 pr-10 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:border-brand-500"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirm((prev) => !prev)}
                      aria-label={showConfirm ? 'Hide confirm password' : 'Show confirm password'}
                      className="absolute right-3.5 top-2.5 text-slate-400 hover:text-slate-600"
                    >
                      {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-3 bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  <ShieldCheck className="w-4 h-4" />
                  {submitting ? 'Resetting Password...' : 'Reset Password'}
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ResetPasswordPage;
