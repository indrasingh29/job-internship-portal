import React, { useState, useEffect, useCallback } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import OpportunityCard from '../components/OpportunityCard';
import OpportunityDiscovery from '../components/OpportunityDiscovery';
import AccountSettingsPanel from '../components/AccountSettingsPanel';
import { CardSkeleton, TableSkeleton } from '../components/SkeletonLoader';
import {
  LayoutDashboard,
  User,
  Briefcase,
  GraduationCap,
  Bookmark,
  CheckCircle2,
  Save,
  AlertCircle,
  Building2,
  ArrowRight,
  Settings,
  Plus,
  Trash2,
  FileText,
  ExternalLink
} from 'lucide-react';

const TABS = [
  { id: 'overview', label: 'Overview', icon: LayoutDashboard },
  { id: 'jobs', label: 'Browse Jobs', icon: Briefcase },
  { id: 'internships', label: 'Browse Internships', icon: GraduationCap },
  { id: 'applications', label: 'My Applications', icon: FileText },
  { id: 'saved', label: 'Saved Jobs', icon: Bookmark },
  { id: 'profile', label: 'Profile', icon: User },
  { id: 'settings', label: 'Account Settings', icon: Settings }
];

const StudentDashboard = () => {
  const { user, updateProfile, refreshSavedJobs } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();

  const [activeTab, setActiveTab] = useState(() => {
    const t = searchParams.get('tab');
    return TABS.some((tab) => tab.id === t) ? t : 'overview';
  });

  const [stats, setStats] = useState(null);
  const [applications, setApplications] = useState([]);
  const [savedJobs, setSavedJobs] = useState([]);
  const [latestOpportunities, setLatestOpportunities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [profileForm, setProfileForm] = useState({
    name: '',
    headline: '',
    bio: '',
    phone: '',
    location: '',
    experienceLevel: 'Fresher',
    skills: '',
    resumeUrl: '',
    githubUrl: '',
    linkedinUrl: '',
    portfolioUrl: '',
    education: []
  });
  const [profileSaving, setProfileSaving] = useState(false);
  const [profileFeedback, setProfileFeedback] = useState(null);

  useEffect(() => {
    const t = searchParams.get('tab');
    if (t && TABS.some((tab) => tab.id === t)) {
      setActiveTab(t);
    }
  }, [searchParams]);

  useEffect(() => {
    if (user) {
      setProfileForm({
        name: user.name || '',
        headline: user.profile?.headline || '',
        bio: user.profile?.bio || '',
        phone: user.profile?.phone || '',
        location: user.profile?.location || '',
        experienceLevel: user.profile?.experienceLevel || 'Fresher',
        skills: Array.isArray(user.profile?.skills) ? user.profile.skills.join(', ') : '',
        resumeUrl: user.profile?.resumeUrl || '',
        githubUrl: user.profile?.githubUrl || '',
        linkedinUrl: user.profile?.linkedinUrl || '',
        portfolioUrl: user.profile?.portfolioUrl || '',
        education: Array.isArray(user.profile?.education) ? user.profile.education : []
      });
    }
  }, [user]);

  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
    setSearchParams({ tab: tabId });
  };

  const loadStudentData = useCallback(async (showSpinner = true) => {
    if (showSpinner) setLoading(true);
    setError(null);
    try {
      const [statsRes, appsRes, savedRes, latestRes] = await Promise.all([
        api.get('/stats/student'),
        api.get('/applications/my-applications'),
        api.get('/saved-jobs'),
        api.get('/jobs?limit=6&sort=latest')
      ]);

      if (statsRes.data.success) setStats(statsRes.data.stats);
      if (appsRes.data.success) setApplications(appsRes.data.applications || []);
      if (savedRes.data.success) setSavedJobs(savedRes.data.savedJobs || []);
      if (latestRes.data.success) setLatestOpportunities(latestRes.data.jobs || []);
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to load dashboard data.');
    } finally {
      if (showSpinner) setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadStudentData(true);
  }, [loadStudentData]);

  const handleBookmarkChange = async () => {
    await refreshSavedJobs();
    loadStudentData(false);
  };

  const handleAddEducation = () => {
    setProfileForm((prev) => ({
      ...prev,
      education: [
        ...prev.education,
        { degree: '', institution: '', yearOfCompletion: '', score: '' }
      ]
    }));
  };

  const handleEducationChange = (index, field, value) => {
    setProfileForm((prev) => {
      const updated = [...prev.education];
      updated[index] = { ...updated[index], [field]: value };
      return { ...prev, education: updated };
    });
  };

  const handleRemoveEducation = (index) => {
    setProfileForm((prev) => ({
      ...prev,
      education: prev.education.filter((_, i) => i !== index)
    }));
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setProfileSaving(true);
    setProfileFeedback(null);
    try {
      await updateProfile({
        name: profileForm.name,
        headline: profileForm.headline,
        bio: profileForm.bio,
        phone: profileForm.phone,
        location: profileForm.location,
        experienceLevel: profileForm.experienceLevel,
        skills: profileForm.skills.split(',').map((s) => s.trim()).filter(Boolean),
        resumeUrl: profileForm.resumeUrl,
        githubUrl: profileForm.githubUrl,
        linkedinUrl: profileForm.linkedinUrl,
        portfolioUrl: profileForm.portfolioUrl,
        education: profileForm.education
      });
      setProfileFeedback({ type: 'success', text: 'Profile updated successfully!' });
      loadStudentData(false);
    } catch (err) {
      setProfileFeedback({
        type: 'error',
        text: err.response?.data?.message || 'Failed to update profile.'
      });
    } finally {
      setProfileSaving(false);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Shortlisted':
        return (
          <span className="inline-block bg-sky-50 text-sky-700 border border-sky-200 px-2.5 py-0.5 rounded-full text-xs font-semibold">
            Shortlisted
          </span>
        );
      case 'Selected':
        return (
          <span className="inline-block bg-emerald-50 text-emerald-700 border border-emerald-200 px-2.5 py-0.5 rounded-full text-xs font-semibold">
            Selected
          </span>
        );
      case 'Rejected':
        return (
          <span className="inline-block bg-red-50 text-red-700 border border-red-200 px-2.5 py-0.5 rounded-full text-xs font-semibold">
            Rejected
          </span>
        );
      default:
        return (
          <span className="inline-block bg-amber-50 text-amber-800 border border-amber-200 px-2.5 py-0.5 rounded-full text-xs font-semibold">
            Applied
          </span>
        );
    }
  };

  const profileCompletion = stats?.profileCompletion ?? 0;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 space-y-8">
      {/* Welcome Banner */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-2xs flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-brand-600 flex items-center justify-center text-white font-extrabold text-2xl shadow-sm flex-shrink-0">
            {user?.name?.charAt(0)?.toUpperCase() || 'S'}
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-bold text-slate-900">
                Welcome back, {user?.name}
              </h1>
              <span className="text-xs font-semibold bg-brand-50 text-brand-700 border border-brand-200 px-2.5 py-0.5 rounded-full">
                Candidate
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              {user?.profile?.headline || 'Complete your profile to stand out to hiring teams.'}
            </p>
          </div>
        </div>

        {/* Profile Completion Bar */}
        <div className="w-full md:w-64 bg-slate-50 p-4 rounded-2xl border border-slate-200">
          <div className="flex justify-between items-center text-xs font-bold text-slate-700 mb-1.5">
            <span>Profile Completion</span>
            <span className="text-brand-600">{profileCompletion}%</span>
          </div>
          <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
            <div
              className="bg-brand-600 h-full rounded-full transition-all duration-500"
              style={{ width: `${profileCompletion}%` }}
            />
          </div>
          {profileCompletion < 100 && (
            <button
              type="button"
              onClick={() => handleTabChange('profile')}
              className="mt-2 text-[11px] font-semibold text-brand-600 hover:text-brand-700"
            >
              Complete profile &rarr;
            </button>
          )}
        </div>
      </div>

      {/* Error Notice */}
      {error && (
        <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-xs font-semibold text-red-700 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Metrics Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
          <p className="text-xs font-semibold text-slate-400">Total Applications</p>
          <p className="text-2xl font-extrabold text-slate-900 mt-1">{stats?.totalApplied ?? 0}</p>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
          <p className="text-xs font-semibold text-slate-400">Pending Review</p>
          <p className="text-2xl font-extrabold text-amber-600 mt-1">{stats?.pendingCount ?? 0}</p>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
          <p className="text-xs font-semibold text-slate-400">Shortlisted</p>
          <p className="text-2xl font-extrabold text-sky-600 mt-1">{stats?.shortlistedCount ?? 0}</p>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
          <p className="text-xs font-semibold text-slate-400">Saved Jobs</p>
          <p className="text-2xl font-extrabold text-brand-600 mt-1">{stats?.savedCount ?? savedJobs.length}</p>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex border-b border-slate-200 gap-2 sm:gap-6 overflow-x-auto text-xs sm:text-sm font-semibold">
        {TABS.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          let countSuffix = '';
          if (tab.id === 'applications') countSuffix = ` (${applications.length})`;
          if (tab.id === 'saved') countSuffix = ` (${savedJobs.length})`;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => handleTabChange(tab.id)}
              className={`pb-3 px-1 border-b-2 whitespace-nowrap transition-colors flex items-center gap-1.5 ${
                isActive
                  ? 'border-brand-600 text-brand-700'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}{countSuffix}</span>
            </button>
          );
        })}
      </div>

      {/* Tab: Overview */}
      {activeTab === 'overview' && (
        <div className="space-y-8">
          {/* Latest Opportunities */}
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h2 className="text-lg font-bold text-slate-900">Latest Opportunities</h2>
                <p className="text-xs text-slate-500">Freshly posted jobs and internships from hiring teams</p>
              </div>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => handleTabChange('jobs')}
                  className="text-xs font-semibold text-brand-600 hover:text-brand-700 inline-flex items-center gap-1"
                >
                  Explore Jobs <ArrowRight className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => handleTabChange('internships')}
                  className="text-xs font-semibold text-slate-600 hover:text-slate-900 inline-flex items-center gap-1"
                >
                  Internships <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                <CardSkeleton />
                <CardSkeleton />
                <CardSkeleton />
              </div>
            ) : latestOpportunities.length === 0 ? (
              <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center text-xs text-slate-500">
                No active opportunities available right now.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {latestOpportunities.map((opp) => (
                  <OpportunityCard
                    key={opp._id}
                    opportunity={opp}
                    onBookmarkToggle={handleBookmarkChange}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Recent Applications Summary */}
          <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-2xs">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
              <h3 className="font-bold text-slate-900 text-sm">Recent Applications</h3>
              <button
                type="button"
                onClick={() => handleTabChange('applications')}
                className="text-xs font-semibold text-brand-600 hover:text-brand-700"
              >
                View all
              </button>
            </div>
            {applications.length === 0 ? (
              <div className="p-8 text-center text-xs text-slate-500">
                You have not applied to any roles yet.
              </div>
            ) : (
              <div className="divide-y divide-slate-100">
                {applications.slice(0, 4).map((app) => (
                  <div key={app._id} className="px-6 py-4 flex items-center justify-between gap-4 text-xs">
                    <div className="min-w-0">
                      {app.job?._id ? (
                        <Link to={`/opportunity/${app.job._id}`} className="font-bold text-slate-900 hover:text-brand-600 truncate block">
                          {app.job.title}
                        </Link>
                      ) : (
                        <p className="font-bold text-slate-500">Unavailable Listing</p>
                      )}
                      <p className="text-slate-500 mt-0.5">
                        {app.job?.company?.name || 'Company'} &bull; Applied {new Date(app.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    {getStatusBadge(app.status)}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Tab: Browse Jobs */}
      {activeTab === 'jobs' && (
        <OpportunityDiscovery opportunityType="Job" embedded={true} syncUrl={false} />
      )}

      {/* Tab: Browse Internships */}
      {activeTab === 'internships' && (
        <OpportunityDiscovery opportunityType="Internship" embedded={true} syncUrl={false} />
      )}

      {/* Tab: My Applications */}
      {activeTab === 'applications' && (
        <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-2xs">
          <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
            <h3 className="font-bold text-slate-900 text-sm">My Applications</h3>
            <span className="text-xs text-slate-400">Live status tracking</span>
          </div>

          {loading ? (
            <div className="p-6">
              <TableSkeleton rows={4} />
            </div>
          ) : applications.length === 0 ? (
            <div className="p-12 text-center space-y-3">
              <Briefcase className="w-10 h-10 text-slate-300 mx-auto" />
              <p className="font-semibold text-slate-700 text-sm">No applications submitted yet</p>
              <p className="text-xs text-slate-400">Explore active jobs and internships to submit your first application.</p>
              <button
                type="button"
                onClick={() => handleTabChange('jobs')}
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-brand-600 text-white rounded-xl text-xs font-semibold hover:bg-brand-700 transition-colors"
              >
                Browse Jobs <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-50/80 text-slate-500 border-b border-slate-100">
                    <th className="py-3.5 px-6 font-semibold">Role</th>
                    <th className="py-3.5 px-6 font-semibold">Company</th>
                    <th className="py-3.5 px-6 font-semibold">Applied Date</th>
                    <th className="py-3.5 px-6 font-semibold">Status</th>
                    <th className="py-3.5 px-6 font-semibold">Recruiter Notes</th>
                    <th className="py-3.5 px-6 font-semibold text-right">Details</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {applications.map((app) => (
                    <tr key={app._id} className="hover:bg-slate-50/60 transition-colors">
                      <td className="py-4 px-6 font-bold text-slate-900">
                        {app.job?._id ? (
                          <Link to={`/opportunity/${app.job._id}`} className="hover:text-brand-600">
                            {app.job.title}
                          </Link>
                        ) : (
                          <span className="text-slate-400">Removed Opportunity</span>
                        )}
                      </td>
                      <td className="py-4 px-6 text-slate-600">
                        <span className="inline-flex items-center gap-1.5">
                          <Building2 className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                          <span>{app.job?.company?.name || 'Company'}</span>
                        </span>
                      </td>
                      <td className="py-4 px-6 text-slate-500 whitespace-nowrap">
                        {new Date(app.createdAt).toLocaleDateString()}
                      </td>
                      <td className="py-4 px-6">
                        {getStatusBadge(app.status)}
                      </td>
                      <td className="py-4 px-6 text-slate-500 max-w-xs truncate">
                        {app.recruiterNotes || '—'}
                      </td>
                      <td className="py-4 px-6 text-right">
                        {app.job?._id ? (
                          <Link
                            to={`/opportunity/${app.job._id}`}
                            className="inline-flex items-center gap-1 font-semibold text-brand-600 hover:text-brand-800"
                          >
                            View <ExternalLink className="w-3 h-3" />
                          </Link>
                        ) : (
                          <span className="text-slate-400">Unavailable</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Tab: Saved Jobs */}
      {activeTab === 'saved' && (
        <div>
          {savedJobs.length === 0 ? (
            <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center space-y-3">
              <Bookmark className="w-10 h-10 text-slate-300 mx-auto" />
              <p className="font-semibold text-slate-700 text-sm">No saved opportunities yet</p>
              <p className="text-xs text-slate-400">
                Save any job or internship card to keep it bookmarked here.
              </p>
              <button
                type="button"
                onClick={() => handleTabChange('jobs')}
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-brand-600 text-white rounded-xl text-xs font-semibold hover:bg-brand-700 transition-colors"
              >
                Browse Jobs <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {savedJobs.map((job) => (
                <OpportunityCard
                  key={job._id}
                  opportunity={job}
                  isBookmarked={true}
                  onBookmarkToggle={handleBookmarkChange}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab: Profile */}
      {activeTab === 'profile' && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-2xs max-w-4xl">
          <h3 className="text-base font-bold text-slate-900 mb-1">Candidate Profile</h3>
          <p className="text-xs text-slate-500 mb-6">
            Keep your resume, skills, education, and profile links up to date for recruiters.
          </p>

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

          <form onSubmit={handleProfileSubmit} className="space-y-5 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Full Name *</label>
                <input
                  type="text"
                  required
                  value={profileForm.name}
                  onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                  className="w-full text-xs text-slate-800 px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:border-brand-500"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Headline</label>
                <input
                  type="text"
                  placeholder="e.g. Full-Stack Developer | React & Node.js"
                  value={profileForm.headline}
                  onChange={(e) => setProfileForm({ ...profileForm, headline: e.target.value })}
                  className="w-full text-xs text-slate-800 px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:border-brand-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
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

              <div>
                <label className="block font-bold text-slate-700 mb-1">Experience Level</label>
                <select
                  value={profileForm.experienceLevel}
                  onChange={(e) => setProfileForm({ ...profileForm, experienceLevel: e.target.value })}
                  className="w-full text-xs text-slate-800 px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white focus:outline-none focus:border-brand-500"
                >
                  <option value="Fresher">Fresher / Student</option>
                  <option value="0-1 Years">0–1 Years</option>
                  <option value="1-3 Years">1–3 Years</option>
                  <option value="3+ Years">3+ Years</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Technical Skills (Comma Separated)</label>
              <input
                type="text"
                placeholder="JavaScript, React, Node.js, Express, MongoDB"
                value={profileForm.skills}
                onChange={(e) => setProfileForm({ ...profileForm, skills: e.target.value })}
                className="w-full text-xs text-slate-800 px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:border-brand-500"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Resume URL</label>
              <input
                type="url"
                placeholder="https://drive.google.com/... or portfolio link"
                value={profileForm.resumeUrl}
                onChange={(e) => setProfileForm({ ...profileForm, resumeUrl: e.target.value })}
                className="w-full text-xs text-slate-800 px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:border-brand-500"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block font-bold text-slate-700 mb-1">GitHub URL</label>
                <input
                  type="url"
                  placeholder="https://github.com/username"
                  value={profileForm.githubUrl}
                  onChange={(e) => setProfileForm({ ...profileForm, githubUrl: e.target.value })}
                  className="w-full text-xs text-slate-800 px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:border-brand-500"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">LinkedIn URL</label>
                <input
                  type="url"
                  placeholder="https://linkedin.com/in/username"
                  value={profileForm.linkedinUrl}
                  onChange={(e) => setProfileForm({ ...profileForm, linkedinUrl: e.target.value })}
                  className="w-full text-xs text-slate-800 px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:border-brand-500"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Portfolio URL</label>
                <input
                  type="url"
                  placeholder="https://yourportfolio.dev"
                  value={profileForm.portfolioUrl}
                  onChange={(e) => setProfileForm({ ...profileForm, portfolioUrl: e.target.value })}
                  className="w-full text-xs text-slate-800 px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:border-brand-500"
                />
              </div>
            </div>

            {/* Education Section */}
            <div className="pt-2 space-y-3">
              <div className="flex items-center justify-between">
                <label className="font-bold text-slate-700">Education</label>
                <button
                  type="button"
                  onClick={handleAddEducation}
                  className="inline-flex items-center gap-1 text-brand-600 hover:text-brand-700 font-semibold"
                >
                  <Plus className="w-3.5 h-3.5" /> Add Education
                </button>
              </div>

              {profileForm.education.length === 0 ? (
                <p className="text-[11px] text-slate-400">No education entries added yet.</p>
              ) : (
                <div className="space-y-3">
                  {profileForm.education.map((edu, idx) => (
                    <div key={idx} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 grid grid-cols-1 sm:grid-cols-12 gap-3 items-end">
                      <div className="sm:col-span-4">
                        <label className="block text-[11px] font-semibold text-slate-600 mb-1">Degree / Course</label>
                        <input
                          type="text"
                          placeholder="e.g. B.Tech CSE"
                          value={edu.degree || ''}
                          onChange={(e) => handleEducationChange(idx, 'degree', e.target.value)}
                          className="w-full text-xs bg-white px-3 py-2 rounded-lg border border-slate-300"
                        />
                      </div>
                      <div className="sm:col-span-4">
                        <label className="block text-[11px] font-semibold text-slate-600 mb-1">Institution</label>
                        <input
                          type="text"
                          placeholder="University / College"
                          value={edu.institution || ''}
                          onChange={(e) => handleEducationChange(idx, 'institution', e.target.value)}
                          className="w-full text-xs bg-white px-3 py-2 rounded-lg border border-slate-300"
                        />
                      </div>
                      <div className="sm:col-span-2">
                        <label className="block text-[11px] font-semibold text-slate-600 mb-1">Year</label>
                        <input
                          type="text"
                          placeholder="2026"
                          value={edu.yearOfCompletion || ''}
                          onChange={(e) => handleEducationChange(idx, 'yearOfCompletion', e.target.value)}
                          className="w-full text-xs bg-white px-3 py-2 rounded-lg border border-slate-300"
                        />
                      </div>
                      <div className="sm:col-span-1">
                        <label className="block text-[11px] font-semibold text-slate-600 mb-1">Score</label>
                        <input
                          type="text"
                          placeholder="8.5"
                          value={edu.score || ''}
                          onChange={(e) => handleEducationChange(idx, 'score', e.target.value)}
                          className="w-full text-xs bg-white px-2 py-2 rounded-lg border border-slate-300"
                        />
                      </div>
                      <div className="sm:col-span-1 flex justify-end">
                        <button
                          type="button"
                          onClick={() => handleRemoveEducation(idx)}
                          aria-label="Remove education entry"
                          className="p-2 text-slate-400 hover:text-red-600 rounded-lg hover:bg-red-50"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Bio / Summary</label>
              <textarea
                rows={3}
                placeholder="Brief summary of your background, projects, and technical interests..."
                value={profileForm.bio}
                onChange={(e) => setProfileForm({ ...profileForm, bio: e.target.value })}
                className="w-full text-xs text-slate-800 p-3 rounded-xl border border-slate-300 focus:outline-none focus:border-brand-500"
              />
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={profileSaving}
                className="px-6 py-2.5 bg-brand-600 hover:bg-brand-700 text-white font-bold rounded-xl shadow-xs transition-colors flex items-center gap-2 disabled:opacity-50"
              >
                <Save className="w-4 h-4" />
                {profileSaving ? 'Saving Changes...' : 'Save Profile'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Tab: Account Settings */}
      {activeTab === 'settings' && <AccountSettingsPanel />}
    </div>
  );
};

export default StudentDashboard;
