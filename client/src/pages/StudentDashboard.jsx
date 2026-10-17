import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import OpportunityCard from '../components/OpportunityCard';
import { TableSkeleton } from '../components/SkeletonLoader';
import {
  User,
  Briefcase,
  Bookmark,
  CheckCircle2,
  Clock,
  XCircle,
  Award,
  Edit3,
  ExternalLink,
  Save,
  AlertCircle,
  Building2,
  ArrowRight
} from 'lucide-react';

const StudentDashboard = () => {
  const { user, updateProfile } = useAuth();
  const [activeTab, setActiveTab] = useState('applications');

  const [stats, setStats] = useState(null);
  const [applications, setApplications] = useState([]);
  const [savedJobs, setSavedJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  // Profile Editor Form State
  const [profileForm, setProfileForm] = useState({
    name: user?.name || '',
    headline: user?.profile?.headline || '',
    bio: user?.profile?.bio || '',
    phone: user?.profile?.phone || '',
    location: user?.profile?.location || '',
    skills: user?.profile?.skills?.join(', ') || '',
    resumeUrl: user?.profile?.resumeUrl || '',
    githubUrl: user?.profile?.githubUrl || '',
    linkedinUrl: user?.profile?.linkedinUrl || ''
  });
  const [profileSaving, setProfileSaving] = useState(false);
  const [profileFeedback, setProfileFeedback] = useState(null);

  const loadStudentData = async () => {
    setLoading(true);
    try {
      const [statsRes, appsRes, savedRes] = await Promise.all([
        api.get('/stats/student'),
        api.get('/applications/my-applications'),
        api.get('/saved-jobs')
      ]);

      if (statsRes.data.success) setStats(statsRes.data.stats);
      if (appsRes.data.success) setApplications(appsRes.data.applications);
      if (savedRes.data.success) setSavedJobs(savedRes.data.savedJobs);
    } catch (err) {
      console.error('Failed to load student dashboard:', err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStudentData();
  }, []);

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setProfileSaving(true);
    setProfileFeedback(null);
    try {
      await updateProfile({
        ...profileForm,
        skills: profileForm.skills.split(',').map((s) => s.trim()).filter(Boolean)
      });
      setProfileFeedback({ type: 'success', text: 'Profile updated successfully!' });
      loadStudentData();
    } catch (err) {
      setProfileFeedback({ type: 'error', text: err.response?.data?.message || 'Failed to update profile.' });
    } finally {
      setProfileSaving(false);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Shortlisted':
        return <span className="bg-blue-50 text-blue-700 border border-blue-200 px-2.5 py-0.5 rounded-full text-xs font-semibold">Shortlisted</span>;
      case 'Selected':
        return <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 px-2.5 py-0.5 rounded-full text-xs font-semibold">Selected</span>;
      case 'Rejected':
        return <span className="bg-red-50 text-red-700 border border-red-200 px-2.5 py-0.5 rounded-full text-xs font-semibold">Rejected</span>;
      default:
        return <span className="bg-amber-50 text-amber-700 border border-amber-200 px-2.5 py-0.5 rounded-full text-xs font-semibold">Under Review</span>;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Welcome Banner */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-brand-600 to-indigo-600 flex items-center justify-center text-white font-extrabold text-2xl shadow-md">
            {user?.name?.charAt(0)}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold text-slate-900">{user?.name}</h1>
              <span className="text-xs font-semibold bg-brand-50 text-brand-700 border border-brand-200 px-2 py-0.5 rounded">
                Student Applicant
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1">{user?.profile?.headline || 'Aspiring Software Developer'}</p>
          </div>
        </div>

        {/* Profile Completion Bar */}
        <div className="w-full md:w-64 bg-slate-50 p-4 rounded-2xl border border-slate-200">
          <div className="flex justify-between items-center text-xs font-bold text-slate-700 mb-1.5">
            <span>Profile Completion</span>
            <span className="text-brand-600">{stats?.profileCompletion || 75}%</span>
          </div>
          <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
            <div
              className="bg-brand-600 h-full rounded-full transition-all duration-500"
              style={{ width: `${stats?.profileCompletion || 75}%` }}
            />
          </div>
        </div>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
          <p className="text-xs font-semibold text-slate-400">Total Applications</p>
          <p className="text-2xl font-extrabold text-slate-900 mt-1">{stats?.totalApplied || 0}</p>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
          <p className="text-xs font-semibold text-slate-400">In Review</p>
          <p className="text-2xl font-extrabold text-amber-600 mt-1">{stats?.pendingCount || 0}</p>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
          <p className="text-xs font-semibold text-slate-400">Shortlisted</p>
          <p className="text-2xl font-extrabold text-blue-600 mt-1">{stats?.shortlistedCount || 0}</p>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
          <p className="text-xs font-semibold text-slate-400">Bookmarked</p>
          <p className="text-2xl font-extrabold text-brand-600 mt-1">{stats?.savedCount || 0}</p>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex border-b border-slate-200 space-x-6 text-sm font-semibold">
        <button
          onClick={() => setActiveTab('applications')}
          className={`pb-3 border-b-2 transition-colors flex items-center gap-2 ${
            activeTab === 'applications'
              ? 'border-brand-600 text-brand-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Briefcase className="w-4 h-4" />
          My Applications ({applications.length})
        </button>

        <button
          onClick={() => setActiveTab('saved')}
          className={`pb-3 border-b-2 transition-colors flex items-center gap-2 ${
            activeTab === 'saved'
              ? 'border-brand-600 text-brand-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Bookmark className="w-4 h-4" />
          Saved Opportunities ({savedJobs.length})
        </button>

        <button
          onClick={() => setActiveTab('profile')}
          className={`pb-3 border-b-2 transition-colors flex items-center gap-2 ${
            activeTab === 'profile'
              ? 'border-brand-600 text-brand-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <User className="w-4 h-4" />
          Edit Profile
        </button>
      </div>

      {/* Tab 1: Application History */}
      {activeTab === 'applications' && (
        <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs">
          <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
            <h3 className="font-bold text-slate-900 text-sm">Submitted Applications</h3>
            <span className="text-xs text-slate-400">Track real-time hiring decisions</span>
          </div>

          {loading ? (
            <div className="p-6">
              <TableSkeleton rows={4} />
            </div>
          ) : applications.length === 0 ? (
            <div className="p-12 text-center space-y-3">
              <Briefcase className="w-10 h-10 text-slate-300 mx-auto" />
              <p className="font-semibold text-slate-700 text-sm">No applications submitted yet</p>
              <p className="text-xs text-slate-400">Start discovering opportunities suited for freshers.</p>
              <Link
                to="/jobs"
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-brand-600 text-white rounded-xl text-xs font-semibold hover:bg-brand-700 transition-colors"
              >
                Browse Jobs <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-50/80 text-slate-500 border-b border-slate-100">
                    <th className="py-3.5 px-6 font-semibold">Opportunity Role</th>
                    <th className="py-3.5 px-6 font-semibold">Company</th>
                    <th className="py-3.5 px-6 font-semibold">Applied On</th>
                    <th className="py-3.5 px-6 font-semibold">Status</th>
                    <th className="py-3.5 px-6 font-semibold">Feedback / Notes</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {applications.map((app) => (
                    <tr key={app._id} className="hover:bg-slate-50/60 transition-colors">
                      <td className="py-4 px-6 font-bold text-slate-900">
                        <Link to={`/opportunity/${app.job?._id}`} className="hover:text-brand-600">
                          {app.job?.title || 'Opportunity'}
                        </Link>
                      </td>
                      <td className="py-4 px-6 text-slate-600 flex items-center gap-1.5">
                        <Building2 className="w-3.5 h-3.5 text-slate-400" />
                        {app.job?.company?.name || 'Company'}
                      </td>
                      <td className="py-4 px-6 text-slate-500">
                        {new Date(app.createdAt).toLocaleDateString()}
                      </td>
                      <td className="py-4 px-6">
                        {getStatusBadge(app.status)}
                      </td>
                      <td className="py-4 px-6 text-slate-500 italic max-w-xs truncate">
                        {app.recruiterNotes || 'No notes provided yet.'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Tab 2: Saved Opportunities */}
      {activeTab === 'saved' && (
        <div>
          {savedJobs.length === 0 ? (
            <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center space-y-3">
              <Bookmark className="w-10 h-10 text-slate-300 mx-auto" />
              <p className="font-semibold text-slate-700 text-sm">No opportunities saved yet</p>
              <p className="text-xs text-slate-400">Click the bookmark icon on any opportunity card to save it here for later.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {savedJobs.map((job) => (
                <OpportunityCard
                  key={job._id}
                  opportunity={job}
                  isBookmarked={true}
                  onBookmarkToggle={loadStudentData}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab 3: Profile Editor */}
      {activeTab === 'profile' && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs max-w-3xl">
          <h3 className="text-base font-bold text-slate-900 mb-1">Update Student Profile</h3>
          <p className="text-xs text-slate-500 mb-6">Keep your technical skills and resume URL up to date for recruiters.</p>

          {profileFeedback && (
            <div className={`p-3.5 rounded-xl mb-5 text-xs font-semibold flex items-center gap-2 ${
              profileFeedback.type === 'success'
                ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                : 'bg-red-50 text-red-800 border border-red-200'
            }`}>
              {profileFeedback.type === 'success' ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
              ) : (
                <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0" />
              )}
              <span>{profileFeedback.text}</span>
            </div>
          )}

          <form onSubmit={handleProfileSubmit} className="space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={profileForm.name}
                  onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                  className="w-full text-xs text-slate-800 px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:border-brand-500"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Professional Headline</label>
                <input
                  type="text"
                  placeholder="e.g. MERN Stack Developer | CSE Final Year"
                  value={profileForm.headline}
                  onChange={(e) => setProfileForm({ ...profileForm, headline: e.target.value })}
                  className="w-full text-xs text-slate-800 px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:border-brand-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Phone Number</label>
                <input
                  type="text"
                  placeholder="+91 98765 43210"
                  value={profileForm.phone}
                  onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                  className="w-full text-xs text-slate-800 px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:border-brand-500"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Location</label>
                <input
                  type="text"
                  placeholder="e.g. Bangalore, India"
                  value={profileForm.location}
                  onChange={(e) => setProfileForm({ ...profileForm, location: e.target.value })}
                  className="w-full text-xs text-slate-800 px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:border-brand-500"
                />
              </div>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Technical Skills (Comma Separated)</label>
              <input
                type="text"
                placeholder="JavaScript, React.js, Node.js, Express, MongoDB, Tailwind CSS"
                value={profileForm.skills}
                onChange={(e) => setProfileForm({ ...profileForm, skills: e.target.value })}
                className="w-full text-xs text-slate-800 px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:border-brand-500"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Resume Link (Google Drive / GitHub / Cloud)</label>
              <input
                type="url"
                placeholder="https://example.com/my-resume.pdf"
                value={profileForm.resumeUrl}
                onChange={(e) => setProfileForm({ ...profileForm, resumeUrl: e.target.value })}
                className="w-full text-xs text-slate-800 px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:border-brand-500"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-bold text-slate-700 mb-1">GitHub Profile URL</label>
                <input
                  type="url"
                  placeholder="https://github.com/your-username"
                  value={profileForm.githubUrl}
                  onChange={(e) => setProfileForm({ ...profileForm, githubUrl: e.target.value })}
                  className="w-full text-xs text-slate-800 px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:border-brand-500"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">LinkedIn Profile URL</label>
                <input
                  type="url"
                  placeholder="https://linkedin.com/in/your-profile"
                  value={profileForm.linkedinUrl}
                  onChange={(e) => setProfileForm({ ...profileForm, linkedinUrl: e.target.value })}
                  className="w-full text-xs text-slate-800 px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:border-brand-500"
                />
              </div>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Short Bio</label>
              <textarea
                rows={3}
                placeholder="Brief summary of your academic background and technical interests..."
                value={profileForm.bio}
                onChange={(e) => setProfileForm({ ...profileForm, bio: e.target.value })}
                className="w-full text-xs text-slate-800 p-3 rounded-xl border border-slate-300 focus:outline-none focus:border-brand-500"
              />
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={profileSaving}
                className="px-6 py-2.5 bg-brand-600 hover:bg-brand-700 text-white font-bold rounded-xl shadow-sm transition-all flex items-center gap-2 disabled:opacity-50"
              >
                <Save className="w-4 h-4" />
                {profileSaving ? 'Saving Changes...' : 'Save Profile Changes'}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default StudentDashboard;
