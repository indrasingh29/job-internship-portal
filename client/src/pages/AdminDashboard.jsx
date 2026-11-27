import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import AccountSettingsPanel from '../components/AccountSettingsPanel';
import { TableSkeleton } from '../components/SkeletonLoader';
import {
  Shield,
  Users,
  Briefcase,
  Search,
  Trash2,
  Server,
  Activity,
  ChevronLeft,
  ChevronRight,
  Settings,
  AlertCircle,
  CheckCircle2,
  X
} from 'lucide-react';

const AdminDashboard = () => {
  const { user } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();

  const [activeTab, setActiveTab] = useState(() => {
    const t = searchParams.get('tab');
    return ['users', 'jobs', 'system', 'settings'].includes(t) ? t : 'users';
  });

  const [stats, setStats] = useState(null);
  const [health, setHealth] = useState(null);
  const [usersList, setUsersList] = useState([]);
  const [jobsList, setJobsList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [feedback, setFeedback] = useState(null);

  // User Filter State
  const [userSearch, setUserSearch] = useState('');
  const [userRole, setUserRole] = useState('All');
  const [userStatus, setUserStatus] = useState('All');
  const [userPage, setUserPage] = useState(1);
  const [totalUserPages, setTotalUserPages] = useState(1);

  // Job Filter State
  const [jobSearch, setJobSearch] = useState('');
  const [jobTypeFilter, setJobTypeFilter] = useState('All');
  const [jobStatusFilter, setJobStatusFilter] = useState('All');
  const [jobPage, setJobPage] = useState(1);
  const [totalJobPages, setTotalJobPages] = useState(1);

  // Confirmation dialog state
  const [confirmAction, setConfirmAction] = useState(null);

  useEffect(() => {
    const t = searchParams.get('tab');
    if (t && ['users', 'jobs', 'system', 'settings'].includes(t)) {
      setActiveTab(t);
    }
  }, [searchParams]);

  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
    setSearchParams({ tab: tabId });
  };

  const loadAdminStats = useCallback(async () => {
    try {
      const [statsRes, healthRes] = await Promise.all([
        api.get('/stats/admin'),
        api.get('/health')
      ]);
      if (statsRes.data.success) setStats(statsRes.data.stats);
      if (healthRes.data) setHealth(healthRes.data);
    } catch (err) {
      console.error('Failed to load admin stats:', err.message);
    }
  }, []);

  const loadUsers = useCallback(async () => {
    try {
      const params = new URLSearchParams();
      if (userSearch.trim()) params.append('search', userSearch.trim());
      if (userRole !== 'All') params.append('role', userRole);
      if (userStatus !== 'All') params.append('status', userStatus);
      params.append('page', String(userPage));
      params.append('limit', '10');

      const res = await api.get(`/admin/users?${params.toString()}`);
      if (res.data.success) {
        setUsersList(res.data.users || []);
        setTotalUserPages(res.data.pages || 1);
      }
    } catch (err) {
      console.error('Failed to load users:', err.message);
    }
  }, [userSearch, userRole, userStatus, userPage]);

  const loadJobs = useCallback(async () => {
    try {
      const params = new URLSearchParams();
      if (jobSearch.trim()) params.append('search', jobSearch.trim());
      if (jobTypeFilter !== 'All') params.append('opportunityType', jobTypeFilter);
      if (jobStatusFilter !== 'All') params.append('status', jobStatusFilter);
      params.append('page', String(jobPage));
      params.append('limit', '10');

      const res = await api.get(`/admin/jobs?${params.toString()}`);
      if (res.data.success) {
        setJobsList(res.data.jobs || []);
        setTotalJobPages(res.data.pages || 1);
      }
    } catch (err) {
      console.error('Failed to load admin jobs:', err.message);
    }
  }, [jobSearch, jobTypeFilter, jobStatusFilter, jobPage]);

  useEffect(() => {
    setLoading(true);
    Promise.all([loadAdminStats(), loadUsers(), loadJobs()]).finally(() => setLoading(false));
  }, [loadAdminStats, loadUsers, loadJobs]);

  const handleToggleUserStatus = async (targetUser) => {
    if (targetUser._id === user?.id) {
      setFeedback({ type: 'error', text: 'You cannot deactivate your own administrator account.' });
      return;
    }
    try {
      const res = await api.put(`/admin/users/${targetUser._id}/toggle-status`);
      if (res.data.success) {
        setFeedback({ type: 'success', text: res.data.message });
        loadUsers();
      }
    } catch (err) {
      setFeedback({ type: 'error', text: err.response?.data?.message || 'Failed to update user status.' });
    }
  };

  const handleToggleJobStatus = async (job) => {
    try {
      const nextStatus = job.status === 'Active' ? 'Closed' : 'Active';
      await api.put(`/jobs/${job._id}`, { status: nextStatus });
      setFeedback({ type: 'success', text: `"${job.title}" updated to ${nextStatus}.` });
      loadJobs();
      loadAdminStats();
    } catch (err) {
      setFeedback({ type: 'error', text: err.response?.data?.message || 'Failed to update job status.' });
    }
  };

  const executeConfirmedDelete = async () => {
    if (!confirmAction) return;
    try {
      if (confirmAction.type === 'user') {
        const res = await api.delete(`/admin/users/${confirmAction.id}`);
        if (res.data.success) {
          setFeedback({ type: 'success', text: res.data.message });
          loadUsers();
          loadAdminStats();
        }
      } else if (confirmAction.type === 'job') {
        const res = await api.delete(`/jobs/${confirmAction.id}`);
        if (res.data.success) {
          setFeedback({ type: 'success', text: res.data.message });
          loadJobs();
          loadAdminStats();
        }
      }
    } catch (err) {
      setFeedback({ type: 'error', text: err.response?.data?.message || 'Operation failed.' });
    } finally {
      setConfirmAction(null);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 space-y-8">
      {/* Admin Header */}
      <div className="bg-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-lg flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center">
            <Shield className="w-7 h-7" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight">Admin Console</h1>
              <span className="text-[10px] font-bold uppercase tracking-wider bg-amber-400/20 text-amber-300 border border-amber-400/30 px-2 py-0.5 rounded">
                Admin
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              User management, opportunity moderation, and platform analytics
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs text-emerald-400 bg-emerald-950/60 border border-emerald-800/60 px-3.5 py-1.5 rounded-full">
          <Activity className="w-3.5 h-3.5" />
          <span>API {health?.status || 'online'} &bull; DB {health?.database?.status || 'connected'}</span>
        </div>
      </div>

      {feedback && (
        <div
          className={`p-3.5 rounded-2xl text-xs font-semibold flex items-center justify-between gap-2 ${
            feedback.type === 'success'
              ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
              : 'bg-red-50 text-red-700 border border-red-200'
          }`}
        >
          <span className="flex items-center gap-2">
            {feedback.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            ) : (
              <AlertCircle className="w-4 h-4 text-red-600" />
            )}
            {feedback.text}
          </span>
          <button type="button" onClick={() => setFeedback(null)} className="text-slate-500 hover:text-slate-800">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Overview Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
          <p className="text-xs font-semibold text-slate-400">Total Users</p>
          <p className="text-2xl font-extrabold text-slate-900 mt-1">{stats?.totalUsers ?? 0}</p>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
          <p className="text-xs font-semibold text-slate-400">Students</p>
          <p className="text-2xl font-extrabold text-brand-600 mt-1">{stats?.totalStudents ?? 0}</p>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
          <p className="text-xs font-semibold text-slate-400">Recruiters</p>
          <p className="text-2xl font-extrabold text-indigo-600 mt-1">{stats?.totalRecruiters ?? 0}</p>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
          <p className="text-xs font-semibold text-slate-400">Companies</p>
          <p className="text-2xl font-extrabold text-slate-900 mt-1">{stats?.totalCompanies ?? 0}</p>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
          <p className="text-xs font-semibold text-slate-400">Jobs &amp; Internships</p>
          <p className="text-2xl font-extrabold text-emerald-600 mt-1">
            {(stats?.totalJobs ?? 0) + (stats?.totalInternships ?? 0)}
          </p>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
          <p className="text-xs font-semibold text-slate-400">Applications</p>
          <p className="text-2xl font-extrabold text-sky-600 mt-1">{stats?.totalApplications ?? 0}</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200 gap-6 text-xs sm:text-sm font-semibold overflow-x-auto">
        <button
          type="button"
          onClick={() => handleTabChange('users')}
          className={`pb-3 border-b-2 whitespace-nowrap flex items-center gap-2 transition-colors ${
            activeTab === 'users'
              ? 'border-brand-600 text-brand-700'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Users className="w-4 h-4" />
          Users ({stats?.totalUsers ?? usersList.length})
        </button>

        <button
          type="button"
          onClick={() => handleTabChange('jobs')}
          className={`pb-3 border-b-2 whitespace-nowrap flex items-center gap-2 transition-colors ${
            activeTab === 'jobs'
              ? 'border-brand-600 text-brand-700'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Briefcase className="w-4 h-4" />
          Job Moderation ({(stats?.totalJobs ?? 0) + (stats?.totalInternships ?? 0)})
        </button>

        <button
          type="button"
          onClick={() => handleTabChange('system')}
          className={`pb-3 border-b-2 whitespace-nowrap flex items-center gap-2 transition-colors ${
            activeTab === 'system'
              ? 'border-brand-600 text-brand-700'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Server className="w-4 h-4" />
          System Telemetry
        </button>

        <button
          type="button"
          onClick={() => handleTabChange('settings')}
          className={`pb-3 border-b-2 whitespace-nowrap flex items-center gap-2 transition-colors ${
            activeTab === 'settings'
              ? 'border-brand-600 text-brand-700'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Settings className="w-4 h-4" />
          Account Settings
        </button>
      </div>

      {/* Tab 1: Users */}
      {activeTab === 'users' && (
        <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-2xs">
          <div className="p-4 sm:p-6 border-b border-slate-100 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="text"
                placeholder="Search user by name or email..."
                value={userSearch}
                onChange={(e) => { setUserSearch(e.target.value); setUserPage(1); }}
                className="w-full text-xs text-slate-800 pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-brand-500"
              />
            </div>

            <div className="flex flex-wrap items-center gap-3 text-xs">
              <select
                aria-label="Filter by role"
                value={userRole}
                onChange={(e) => { setUserRole(e.target.value); setUserPage(1); }}
                className="bg-white border border-slate-200 rounded-xl px-3 py-2 font-medium text-slate-700 focus:outline-none focus:border-brand-500"
              >
                <option value="All">All Roles</option>
                <option value="student">Students</option>
                <option value="recruiter">Recruiters</option>
                <option value="admin">Administrators</option>
              </select>

              <select
                aria-label="Filter by status"
                value={userStatus}
                onChange={(e) => { setUserStatus(e.target.value); setUserPage(1); }}
                className="bg-white border border-slate-200 rounded-xl px-3 py-2 font-medium text-slate-700 focus:outline-none focus:border-brand-500"
              >
                <option value="All">All Statuses</option>
                <option value="Active">Active</option>
                <option value="Deactivated">Deactivated</option>
              </select>
            </div>
          </div>

          {loading ? (
            <div className="p-6">
              <TableSkeleton rows={5} />
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-slate-50/80 text-slate-500 border-b border-slate-100">
                      <th className="py-3 px-6 font-semibold">User</th>
                      <th className="py-3 px-6 font-semibold">Role</th>
                      <th className="py-3 px-6 font-semibold">Status</th>
                      <th className="py-3 px-6 font-semibold">Joined</th>
                      <th className="py-3 px-6 font-semibold text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {usersList.map((u) => (
                      <tr key={u._id} className="hover:bg-slate-50/60 transition-colors">
                        <td className="py-3.5 px-6">
                          <p className="font-bold text-slate-900">{u.name}</p>
                          <p className="text-slate-500 text-[11px]">{u.email}</p>
                        </td>
                        <td className="py-3.5 px-6">
                          <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                            u.role === 'admin'
                              ? 'bg-amber-100 text-amber-800'
                              : u.role === 'recruiter'
                              ? 'bg-brand-100 text-brand-800'
                              : 'bg-sky-100 text-sky-800'
                          }`}>
                            {u.role}
                          </span>
                        </td>
                        <td className="py-3.5 px-6">
                          <span className={`inline-flex items-center gap-1.5 font-semibold text-xs ${
                            u.isActive ? 'text-emerald-600' : 'text-red-500'
                          }`}>
                            <span className={`w-2 h-2 rounded-full ${u.isActive ? 'bg-emerald-500' : 'bg-red-500'}`} />
                            {u.isActive ? 'Active' : 'Deactivated'}
                          </span>
                        </td>
                        <td className="py-3.5 px-6 text-slate-500 whitespace-nowrap">
                          {new Date(u.createdAt).toLocaleDateString()}
                        </td>
                        <td className="py-3.5 px-6 text-right whitespace-nowrap space-x-2">
                          <button
                            type="button"
                            onClick={() => handleToggleUserStatus(u)}
                            className="px-2.5 py-1 rounded-lg text-xs font-semibold border border-slate-200 hover:bg-slate-100 text-slate-700 transition-colors"
                          >
                            {u.isActive ? 'Deactivate' : 'Activate'}
                          </button>
                          <button
                            type="button"
                            onClick={() => setConfirmAction({ type: 'user', id: u._id, label: u.email })}
                            className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Delete User"
                            aria-label="Delete user"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {totalUserPages > 1 && (
                <div className="px-6 py-4 border-t border-slate-100 flex items-center justify-between text-xs">
                  <button
                    type="button"
                    onClick={() => setUserPage((p) => Math.max(1, p - 1))}
                    disabled={userPage === 1}
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-slate-200 font-semibold text-slate-700 disabled:opacity-50"
                  >
                    <ChevronLeft className="w-4 h-4" /> Previous
                  </button>
                  <span className="text-slate-600">
                    Page <strong>{userPage}</strong> of <strong>{totalUserPages}</strong>
                  </span>
                  <button
                    type="button"
                    onClick={() => setUserPage((p) => Math.min(totalUserPages, p + 1))}
                    disabled={userPage === totalUserPages}
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-slate-200 font-semibold text-slate-700 disabled:opacity-50"
                  >
                    Next <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      )}

      {/* Tab 2: Job Moderation */}
      {activeTab === 'jobs' && (
        <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-2xs">
          <div className="p-4 sm:p-6 border-b border-slate-100 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="text"
                placeholder="Search posting by title..."
                value={jobSearch}
                onChange={(e) => { setJobSearch(e.target.value); setJobPage(1); }}
                className="w-full text-xs text-slate-800 pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-brand-500"
              />
            </div>

            <div className="flex flex-wrap items-center gap-3 text-xs">
              <select
                aria-label="Filter by opportunity type"
                value={jobTypeFilter}
                onChange={(e) => { setJobTypeFilter(e.target.value); setJobPage(1); }}
                className="bg-white border border-slate-200 rounded-xl px-3 py-2 font-medium text-slate-700"
              >
                <option value="All">All Types</option>
                <option value="Job">Jobs</option>
                <option value="Internship">Internships</option>
              </select>

              <select
                aria-label="Filter by posting status"
                value={jobStatusFilter}
                onChange={(e) => { setJobStatusFilter(e.target.value); setJobPage(1); }}
                className="bg-white border border-slate-200 rounded-xl px-3 py-2 font-medium text-slate-700"
              >
                <option value="All">All Statuses</option>
                <option value="Active">Active</option>
                <option value="Closed">Closed</option>
              </select>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50/80 text-slate-500 border-b border-slate-100">
                  <th className="py-3 px-6 font-semibold">Title</th>
                  <th className="py-3 px-6 font-semibold">Company</th>
                  <th className="py-3 px-6 font-semibold">Type</th>
                  <th className="py-3 px-6 font-semibold">Status</th>
                  <th className="py-3 px-6 font-semibold">Deadline</th>
                  <th className="py-3 px-6 font-semibold text-right">Moderation</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {jobsList.map((job) => (
                  <tr key={job._id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-3.5 px-6 font-bold text-slate-900">
                      <Link to={`/opportunity/${job._id}`} className="hover:text-brand-600">
                        {job.title}
                      </Link>
                    </td>
                    <td className="py-3.5 px-6 text-slate-600">{job.company?.name || 'Company'}</td>
                    <td className="py-3.5 px-6">
                      <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-slate-100 text-slate-700">
                        {job.opportunityType}
                      </span>
                    </td>
                    <td className="py-3.5 px-6">
                      <button
                        type="button"
                        onClick={() => handleToggleJobStatus(job)}
                        className={`px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${
                          job.status === 'Active'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : 'bg-slate-100 text-slate-600'
                        }`}
                      >
                        {job.status}
                      </button>
                    </td>
                    <td className="py-3.5 px-6 text-slate-500 whitespace-nowrap">
                      {job.deadline ? new Date(job.deadline).toLocaleDateString() : 'Rolling'}
                    </td>
                    <td className="py-3.5 px-6 text-right">
                      <button
                        type="button"
                        onClick={() => setConfirmAction({ type: 'job', id: job._id, label: job.title })}
                        className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Delete Listing"
                        aria-label="Delete listing"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {totalJobPages > 1 && (
            <div className="px-6 py-4 border-t border-slate-100 flex items-center justify-between text-xs">
              <button
                type="button"
                onClick={() => setJobPage((p) => Math.max(1, p - 1))}
                disabled={jobPage === 1}
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-slate-200 font-semibold text-slate-700 disabled:opacity-50"
              >
                <ChevronLeft className="w-4 h-4" /> Previous
              </button>
              <span className="text-slate-600">
                Page <strong>{jobPage}</strong> of <strong>{totalJobPages}</strong>
              </span>
              <button
                type="button"
                onClick={() => setJobPage((p) => Math.min(totalJobPages, p + 1))}
                disabled={jobPage === totalJobPages}
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-slate-200 font-semibold text-slate-700 disabled:opacity-50"
              >
                Next <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      )}

      {/* Tab 3: System Telemetry */}
      {activeTab === 'system' && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-2xs space-y-6 text-xs text-slate-600 max-w-3xl">
          <h3 className="text-base font-bold text-slate-900">Service &amp; Database Telemetry</h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-1">
              <p className="text-slate-400 font-medium">API Service</p>
              <p className="font-bold text-slate-800">{health?.service || 'JobPortal REST API'}</p>
            </div>
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-1">
              <p className="text-slate-400 font-medium">Environment</p>
              <p className="font-bold text-slate-800 capitalize">{health?.environment || 'unknown'}</p>
            </div>
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-1">
              <p className="text-slate-400 font-medium">Database Status</p>
              <p className="font-bold text-slate-800 capitalize">{health?.database?.status || 'unknown'}</p>
            </div>
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-1">
              <p className="text-slate-400 font-medium">Storage Mode</p>
              <p className="font-bold text-slate-800">{health?.database?.provider || 'MongoDB'}</p>
            </div>
          </div>
        </div>
      )}

      {/* Tab 4: Account Settings */}
      {activeTab === 'settings' && <AccountSettingsPanel />}

      {/* Confirmation Modal */}
      {confirmAction && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <h3 className="text-lg font-bold text-slate-900">
              Confirm {confirmAction.type === 'user' ? 'User' : 'Listing'} Deletion
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Are you sure you want to permanently delete <strong>{confirmAction.label}</strong> and all associated records? This action cannot be undone.
            </p>
            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setConfirmAction(null)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={executeConfirmedDelete}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-xl"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
