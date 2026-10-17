import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { TableSkeleton } from '../components/SkeletonLoader';
import {
  Shield,
  Users,
  Building2,
  Briefcase,
  FileText,
  Search,
  Trash2,
  Power,
  CheckCircle2,
  AlertTriangle,
  Server,
  Activity,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

const AdminDashboard = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('users');

  const [stats, setStats] = useState(null);
  const [usersList, setUsersList] = useState([]);
  const [jobsList, setJobsList] = useState([]);
  const [loading, setLoading] = useState(true);

  // User Filter State
  const [userSearch, setUserSearch] = useState('');
  const [userRole, setUserRole] = useState('All');
  const [userPage, setUserPage] = useState(1);
  const [totalUserPages, setTotalUserPages] = useState(1);

  // Job Search State
  const [jobSearch, setJobSearch] = useState('');
  const [jobPage, setJobPage] = useState(1);
  const [totalJobPages, setTotalJobPages] = useState(1);

  const loadAdminStats = async () => {
    try {
      const res = await api.get('/stats/admin');
      if (res.data.success) setStats(res.data.stats);
    } catch (err) {
      console.error('Failed to load admin stats:', err.message);
    }
  };

  const loadUsers = async () => {
    try {
      const params = new URLSearchParams();
      if (userSearch) params.append('search', userSearch);
      if (userRole !== 'All') params.append('role', userRole);
      params.append('page', userPage);
      params.append('limit', '10');

      const res = await api.get(`/admin/users?${params.toString()}`);
      if (res.data.success) {
        setUsersList(res.data.users);
        setTotalUserPages(res.data.pages);
      }
    } catch (err) {
      console.error('Failed to load users:', err.message);
    }
  };

  const loadJobs = async () => {
    try {
      const params = new URLSearchParams();
      if (jobSearch) params.append('search', jobSearch);
      params.append('page', jobPage);
      params.append('limit', '10');

      const res = await api.get(`/admin/jobs?${params.toString()}`);
      if (res.data.success) {
        setJobsList(res.data.jobs);
        setTotalJobPages(res.data.pages);
      }
    } catch (err) {
      console.error('Failed to load admin jobs:', err.message);
    }
  };

  useEffect(() => {
    setLoading(true);
    Promise.all([loadAdminStats(), loadUsers(), loadJobs()]).finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    loadUsers();
  }, [userSearch, userRole, userPage]);

  useEffect(() => {
    loadJobs();
  }, [jobSearch, jobPage]);

  const handleToggleUserStatus = async (targetUser) => {
    if (targetUser._id === user?.id) {
      alert('You cannot deactivate your own administrator account.');
      return;
    }
    try {
      const res = await api.put(`/admin/users/${targetUser._id}/toggle-status`);
      if (res.data.success) {
        loadUsers();
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update user status.');
    }
  };

  const handleDeleteUser = async (targetUserId) => {
    if (!window.confirm('Are you sure you want to delete this user and all associated records?')) return;
    try {
      const res = await api.delete(`/admin/users/${targetUserId}`);
      if (res.data.success) {
        loadUsers();
        loadAdminStats();
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete user.');
    }
  };

  const handleDeleteJob = async (jobId) => {
    if (!window.confirm('Delete this opportunity from the entire platform?')) return;
    try {
      await api.delete(`/jobs/${jobId}`);
      loadJobs();
      loadAdminStats();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to remove posting.');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Admin Header */}
      <div className="bg-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center font-extrabold text-2xl">
            <Shield className="w-7 h-7" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold tracking-tight">System Administration</h1>
              <span className="text-[10px] font-bold uppercase tracking-wider bg-amber-400/20 text-amber-300 border border-amber-400/30 px-2 py-0.5 rounded">
                Admin Role
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1">Platform moderation, user management, and system telemetry</p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs text-emerald-400 bg-emerald-950/50 border border-emerald-800/60 px-3.5 py-1.5 rounded-full">
          <Activity className="w-3.5 h-3.5 animate-pulse" />
          <span>System Online &bull; REST API Protected</span>
        </div>
      </div>

      {/* Overview Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
          <p className="text-xs font-semibold text-slate-400">Total Users</p>
          <p className="text-2xl font-extrabold text-slate-900 mt-1">{stats?.totalUsers || 0}</p>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
          <p className="text-xs font-semibold text-slate-400">Students</p>
          <p className="text-2xl font-extrabold text-brand-600 mt-1">{stats?.totalStudents || 0}</p>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
          <p className="text-xs font-semibold text-slate-400">Recruiters</p>
          <p className="text-2xl font-extrabold text-purple-600 mt-1">{stats?.totalRecruiters || 0}</p>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
          <p className="text-xs font-semibold text-slate-400">Companies</p>
          <p className="text-2xl font-extrabold text-indigo-600 mt-1">{stats?.totalCompanies || 50}</p>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
          <p className="text-xs font-semibold text-slate-400">Job Postings</p>
          <p className="text-2xl font-extrabold text-slate-900 mt-1">{stats?.totalJobs || 0}</p>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
          <p className="text-xs font-semibold text-slate-400">Internships</p>
          <p className="text-2xl font-extrabold text-emerald-600 mt-1">{stats?.totalInternships || 0}</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200 space-x-6 text-sm font-semibold">
        <button
          onClick={() => setActiveTab('users')}
          className={`pb-3 border-b-2 transition-colors flex items-center gap-2 ${
            activeTab === 'users'
              ? 'border-brand-600 text-brand-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Users className="w-4 h-4" />
          User Management ({stats?.totalUsers || usersList.length})
        </button>

        <button
          onClick={() => setActiveTab('jobs')}
          className={`pb-3 border-b-2 transition-colors flex items-center gap-2 ${
            activeTab === 'jobs'
              ? 'border-brand-600 text-brand-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Briefcase className="w-4 h-4" />
          Job Moderation ({stats?.totalJobs + stats?.totalInternships || jobsList.length})
        </button>

        <button
          onClick={() => setActiveTab('system')}
          className={`pb-3 border-b-2 transition-colors flex items-center gap-2 ${
            activeTab === 'system'
              ? 'border-brand-600 text-brand-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Server className="w-4 h-4" />
          System Info
        </button>
      </div>

      {/* Tab 1: User Management */}
      {activeTab === 'users' && (
        <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs space-y-4">
          {/* Search & Filter Bar */}
          <div className="p-4 sm:p-6 border-b border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              <input
                type="text"
                placeholder="Search user by name or email..."
                value={userSearch}
                onChange={(e) => { setUserSearch(e.target.value); setUserPage(1); }}
                className="w-full text-xs text-slate-800 pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-brand-500"
              />
            </div>

            <div className="flex items-center gap-2 text-xs w-full sm:w-auto">
              <span className="font-semibold text-slate-500">Role:</span>
              <select
                value={userRole}
                onChange={(e) => { setUserRole(e.target.value); setUserPage(1); }}
                className="bg-white border border-slate-200 rounded-lg px-3 py-1.5 font-medium text-slate-700 focus:outline-none focus:border-brand-500"
              >
                <option value="All">All Roles</option>
                <option value="student">Students</option>
                <option value="recruiter">Recruiters</option>
                <option value="admin">Administrators</option>
              </select>
            </div>
          </div>

          {loading ? (
            <div className="p-6">
              <TableSkeleton rows={5} />
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-50/80 text-slate-500 border-b border-slate-100">
                    <th className="py-3 px-6 font-semibold">User</th>
                    <th className="py-3 px-6 font-semibold">Role</th>
                    <th className="py-3 px-6 font-semibold">Status</th>
                    <th className="py-3 px-6 font-semibold">Joined Date</th>
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
                            ? 'bg-purple-100 text-purple-800'
                            : 'bg-blue-100 text-blue-800'
                        }`}>
                          {u.role}
                        </span>
                      </td>
                      <td className="py-3.5 px-6">
                        <span className={`inline-flex items-center gap-1 font-semibold text-xs ${
                          u.isActive ? 'text-emerald-600' : 'text-red-500'
                        }`}>
                          <span className={`w-2 h-2 rounded-full ${u.isActive ? 'bg-emerald-500' : 'bg-red-500'}`} />
                          {u.isActive ? 'Active' : 'Deactivated'}
                        </span>
                      </td>
                      <td className="py-3.5 px-6 text-slate-500">
                        {new Date(u.createdAt).toLocaleDateString()}
                      </td>
                      <td className="py-3.5 px-6 text-right space-x-2">
                        <button
                          onClick={() => handleToggleUserStatus(u)}
                          className="px-2.5 py-1 rounded-lg text-xs font-semibold border border-slate-200 hover:bg-slate-100 text-slate-700 transition-colors"
                          title="Toggle Active/Deactivated"
                        >
                          {u.isActive ? 'Deactivate' : 'Activate'}
                        </button>
                        <button
                          onClick={() => handleDeleteUser(u._id)}
                          className="p-1 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete User"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Tab 2: Job Moderation */}
      {activeTab === 'jobs' && (
        <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs space-y-4">
          <div className="p-4 sm:p-6 border-b border-slate-100 flex items-center justify-between gap-4">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              <input
                type="text"
                placeholder="Search posting by title..."
                value={jobSearch}
                onChange={(e) => { setJobSearch(e.target.value); setJobPage(1); }}
                className="w-full text-xs text-slate-800 pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-brand-500"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50/80 text-slate-500 border-b border-slate-100">
                  <th className="py-3 px-6 font-semibold">Title</th>
                  <th className="py-3 px-6 font-semibold">Company</th>
                  <th className="py-3 px-6 font-semibold">Type</th>
                  <th className="py-3 px-6 font-semibold">Deadline</th>
                  <th className="py-3 px-6 font-semibold text-right">Moderation</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {jobsList.map((job) => (
                  <tr key={job._id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-3.5 px-6 font-bold text-slate-900">{job.title}</td>
                    <td className="py-3.5 px-6 text-slate-600">{job.company?.name || 'Company'}</td>
                    <td className="py-3.5 px-6">
                      <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-slate-100 text-slate-700">
                        {job.opportunityType}
                      </span>
                    </td>
                    <td className="py-3.5 px-6 text-slate-500">
                      {new Date(job.deadline).toLocaleDateString()}
                    </td>
                    <td className="py-3.5 px-6 text-right">
                      <button
                        onClick={() => handleDeleteJob(job._id)}
                        className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Remove Inappropriate Listing"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 3: System Architecture & Telemetry */}
      {activeTab === 'system' && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6 text-xs text-slate-600 max-w-3xl">
          <h3 className="text-base font-bold text-slate-900">Project Telemetry & Host Configuration</h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-1">
              <p className="text-slate-400 font-medium">Project Name</p>
              <p className="font-bold text-slate-800">Job &amp; Internship Portal (MERN)</p>
            </div>
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-1">
              <p className="text-slate-400 font-medium">Project Owner</p>
              <p className="font-bold text-slate-800">Indra Singh Jeena</p>
            </div>
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-1">
              <p className="text-slate-400 font-medium">Academic Session</p>
              <p className="font-bold text-slate-800">2026–27 (B.Tech CSE Minor Project)</p>
            </div>
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-1">
              <p className="text-slate-400 font-medium">Database Layer</p>
              <p className="font-bold text-slate-800">MongoDB Atlas / Mongoose ODM</p>
            </div>
          </div>

          <div className="p-4 bg-brand-50/60 rounded-2xl border border-brand-200 text-brand-900 leading-relaxed">
            <p className="font-semibold mb-1">Authorization Enforcement</p>
            <p className="text-[11px] text-slate-600">
              Privileged endpoints under <code>/api/admin/*</code> are protected with server-side middleware checking both JWT cryptographic signature and database role verification. Public registration never grants admin access.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
