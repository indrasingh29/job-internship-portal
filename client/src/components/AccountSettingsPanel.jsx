import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Lock, Eye, EyeOff, CheckCircle2, AlertCircle, ShieldCheck } from 'lucide-react';

const AccountSettingsPanel = () => {
  const { user, changePassword } = useAuth();

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFeedback(null);

    if (newPassword.length < 6) {
      setFeedback({ type: 'error', text: 'New password must be at least 6 characters long.' });
      return;
    }

    if (newPassword !== confirmPassword) {
      setFeedback({ type: 'error', text: 'New password and confirmation password do not match.' });
      return;
    }

    setSubmitting(true);
    try {
      const res = await changePassword({ currentPassword, newPassword, confirmPassword });
      if (res.success) {
        setFeedback({ type: 'success', text: res.message || 'Password updated successfully.' });
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
      }
    } catch (err) {
      setFeedback({
        type: 'error',
        text: err.response?.data?.message || 'Failed to update password. Please verify your current password.'
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Account Summary */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-2xs space-y-4 h-fit">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900">Account Overview</h3>
            <p className="text-xs text-slate-500">Signed-in identity &amp; security</p>
          </div>
        </div>

        <div className="space-y-3 pt-2 border-t border-slate-100 text-xs">
          <div>
            <p className="text-slate-400 font-medium">Full Name</p>
            <p className="font-semibold text-slate-900 mt-0.5">{user?.name}</p>
          </div>
          <div>
            <p className="text-slate-400 font-medium">Email Address</p>
            <p className="font-semibold text-slate-900 mt-0.5 break-all">{user?.email}</p>
          </div>
          <div>
            <p className="text-slate-400 font-medium">Account Role</p>
            <span className="inline-block mt-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-brand-50 text-brand-700 capitalize">
              {user?.role}
            </span>
          </div>
        </div>
      </div>

      {/* Change Password Form */}
      <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-2xs">
        <div className="mb-6">
          <h3 className="text-base font-bold text-slate-900">Change Password</h3>
          <p className="text-xs text-slate-500 mt-1">
            Verify your current password before setting a new one.
          </p>
        </div>

        {feedback && (
          <div
            className={`p-3.5 rounded-xl mb-5 text-xs font-semibold flex items-center gap-2 ${
              feedback.type === 'success'
                ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                : 'bg-red-50 text-red-700 border border-red-200'
            }`}
          >
            {feedback.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0" />
            )}
            <span>{feedback.text}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-xs max-w-md">
          <div>
            <label htmlFor="current-password" className="block font-semibold text-slate-700 mb-1.5">
              Current Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                id="current-password"
                type={showCurrent ? 'text' : 'password'}
                required
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="Enter current password"
                className="w-full text-xs text-slate-800 pl-10 pr-10 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:border-brand-500"
              />
              <button
                type="button"
                onClick={() => setShowCurrent((p) => !p)}
                aria-label={showCurrent ? 'Hide current password' : 'Show current password'}
                className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600"
              >
                {showCurrent ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div>
            <label htmlFor="new-password" className="block font-semibold text-slate-700 mb-1.5">
              New Password (minimum 6 characters)
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                id="new-password"
                type={showNew ? 'text' : 'password'}
                required
                minLength={6}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Enter new password"
                className="w-full text-xs text-slate-800 pl-10 pr-10 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:border-brand-500"
              />
              <button
                type="button"
                onClick={() => setShowNew((p) => !p)}
                aria-label={showNew ? 'Hide new password' : 'Show new password'}
                className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600"
              >
                {showNew ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div>
            <label htmlFor="confirm-new-password" className="block font-semibold text-slate-700 mb-1.5">
              Confirm New Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                id="confirm-new-password"
                type={showConfirm ? 'text' : 'password'}
                required
                minLength={6}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Re-enter new password"
                className="w-full text-xs text-slate-800 pl-10 pr-10 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:border-brand-500"
              />
              <button
                type="button"
                onClick={() => setShowConfirm((p) => !p)}
                aria-label={showConfirm ? 'Hide confirm password' : 'Show confirm password'}
                className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600"
              >
                {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="px-5 py-2.5 bg-brand-600 hover:bg-brand-700 text-white font-semibold rounded-xl shadow-xs transition-colors disabled:opacity-50"
          >
            {submitting ? 'Updating Password...' : 'Update Password'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AccountSettingsPanel;
