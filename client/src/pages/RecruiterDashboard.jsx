import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import AccountSettingsPanel from '../components/AccountSettingsPanel';
import { OPPORTUNITY_CATEGORIES } from '../constants/categories';
import { TableSkeleton } from '../components/SkeletonLoader';
import { safeExternalUrl } from '../utils/safeUrl';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import {
  Briefcase,
  Users,
  PlusCircle,
  Trash2,
  X,
  ExternalLink,
  Building2,
  AlertCircle,
  CheckCircle2,
  Edit3,
  LayoutDashboard,
  Settings,
  Save
} from 'lucide-react';

const COLORS = ['#6366f1', '#3b82f6', '#10b981', '#ef4444'];

const EMPTY_JOB_FORM = {
  title: '',
  opportunityType: 'Job',
  jobType: 'Full-time',
  workplaceType: 'Hybrid',
  location: 'Bangalore, India',
  category: 'Software Engineering',
  description: '',
  responsibilities: '',
  requirements: '',
  requiredSkills: '',
  experienceLevel: 'Fresher / Entry Level',
  isFresherEligible: true,
  salaryMin: 6,
  salaryMax: 12,
  stipendAmount: 25000,
  openings: 1,
  deadline: ''
};

const RecruiterDashboard = () => {
  const { user, setUser } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();

  const [activeTab, setActiveTab] = useState(() => {
    const t = searchParams.get('tab');
    return ['overview', 'company', 'settings'].includes(t) ? t : 'overview';
  });

  const [stats, setStats] = useState(null);
  const [postings, setPostings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [bannerFeedback, setBannerFeedback] = useState(null);

  // Create / Edit Job Modal
  const [isPostModalOpen, setIsPostModalOpen] = useState(searchParams.get('action') === 'new-job');
  const [editingJobId, setEditingJobId] = useState(null);
  const [jobForm, setJobForm] = useState(EMPTY_JOB_FORM);
  const [postingSubmitting, setPostingSubmitting] = useState(false);
  const [postError, setPostError] = useState(null);

  // Delete confirmation modal
  const [jobToDelete, setJobToDelete] = useState(null);
  const [deletingJob, setDeletingJob] = useState(false);

  // Applicants Modal
  const [selectedJobForApplicants, setSelectedJobForApplicants] = useState(null);
  const [applicantsList, setApplicantsList] = useState([]);
  const [loadingApplicants, setLoadingApplicants] = useState(false);
  const [applicantsError, setApplicantsError] = useState(null);

  // Company Profile Form
  const [companyForm, setCompanyForm] = useState({
    name: '',
    industry: '',
    headquarters: '',
    employeeCount: '',
    website: '',
    description: ''
  });
  const [savingCompany, setSavingCompany] = useState(false);
  const [companyFeedback, setCompanyFeedback] = useState(null);

  useEffect(() => {
    const t = searchParams.get('tab');
    if (t && ['overview', 'company', 'settings'].includes(t)) {
      setActiveTab(t);
    }
    if (searchParams.get('action') === 'new-job') {
      setEditingJobId(null);
      setJobForm(EMPTY_JOB_FORM);
      setIsPostModalOpen(true);
    }
  }, [searchParams]);

  useEffect(() => {
    if (user?.company) {
      setCompanyForm({
        name: user.company.name || '',
        industry: user.company.industry || '',
        headquarters: user.company.headquarters || '',
        employeeCount: user.company.employeeCount || '',
        website: user.company.website || '',
        description: user.company.description || ''
      });
    }
  }, [user]);

  const loadRecruiterData = useCallback(async (showSpinner = true) => {
    if (showSpinner) setLoading(true);
    try {
      const [statsRes, postingsRes] = await Promise.all([
        api.get('/stats/recruiter'),
        api.get('/jobs/recruiter/my-postings')
      ]);

      if (statsRes.data.success) setStats(statsRes.data.stats);
      if (postingsRes.data.success) setPostings(postingsRes.data.jobs || []);
    } catch (err) {
      console.error('Failed to load recruiter data:', err.message);
    } finally {
      if (showSpinner) setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadRecruiterData(true);
  }, [loadRecruiterData]);

  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
    setSearchParams({ tab: tabId });
  };

  const openCreateModal = () => {
    setEditingJobId(null);
    setJobForm(EMPTY_JOB_FORM);
    setPostError(null);
    setIsPostModalOpen(true);
  };

  const openEditModal = (job) => {
    setEditingJobId(job._id);
    setPostError(null);
    setJobForm({
      title: job.title || '',
      opportunityType: job.opportunityType || 'Job',
      jobType: job.jobType || (job.opportunityType === 'Internship' ? 'Internship' : 'Full-time'),
      workplaceType: job.workplaceType || 'Hybrid',
      location: job.location || '',
      category: job.category || 'Software Engineering',
      description: job.description || '',
      responsibilities: Array.isArray(job.responsibilities) ? job.responsibilities.join('\n') : '',
      requirements: Array.isArray(job.requirements) ? job.requirements.join('\n') : '',
      requiredSkills: Array.isArray(job.requiredSkills) ? job.requiredSkills.join(', ') : '',
      experienceLevel: job.experienceLevel || 'Fresher / Entry Level',
      isFresherEligible: job.isFresherEligible !== undefined ? job.isFresherEligible : true,
      salaryMin: job.salaryMin ?? 0,
      salaryMax: job.salaryMax ?? 0,
      stipendAmount: job.stipendAmount ?? 0,
      openings: job.openings ?? 1,
      deadline: job.deadline ? new Date(job.deadline).toISOString().split('T')[0] : ''
    });
    setIsPostModalOpen(true);
  };

  const handleSaveJob = async (e) => {
    e.preventDefault();
    if (postingSubmitting) return;
    setPostingSubmitting(true);
    setPostError(null);

    try {
      const payload = {
        ...jobForm,
        jobType: jobForm.opportunityType === 'Internship' ? 'Internship' : jobForm.jobType,
        responsibilities: jobForm.responsibilities.split('\n').map((s) => s.trim()).filter(Boolean),
        requirements: jobForm.requirements.split('\n').map((s) => s.trim()).filter(Boolean),
        requiredSkills: jobForm.requiredSkills.split(',').map((s) => s.trim()).filter(Boolean),
        salaryMin: Number(jobForm.salaryMin) || 0,
        salaryMax: Number(jobForm.salaryMax) || 0,
        stipendAmount: Number(jobForm.stipendAmount) || 0,
        openings: Math.max(1, parseInt(jobForm.openings, 10) || 1)
      };

      const res = editingJobId
        ? await api.put(`/jobs/${editingJobId}`, payload)
        : await api.post('/jobs', payload);

      if (res.data.success) {
        setIsPostModalOpen(false);
        setEditingJobId(null);
        setJobForm(EMPTY_JOB_FORM);
        setBannerFeedback({
          type: 'success',
          text: editingJobId ? 'Job posting updated successfully.' : 'New opportunity published successfully.'
        });
        loadRecruiterData(false);
      }
    } catch (err) {
      setPostError(err.response?.data?.message || 'Failed to save opportunity.');
    } finally {
      setPostingSubmitting(false);
    }
  };

  const handleToggleJobStatus = async (job) => {
    try {
      const newStatus = job.status === 'Active' ? 'Closed' : 'Active';
      await api.put(`/jobs/${job._id}`, { status: newStatus });
      setBannerFeedback({
        type: 'success',
        text: `"${job.title}" is now ${newStatus}.`
      });
      loadRecruiterData(false);
    } catch (err) {
      setBannerFeedback({
        type: 'error',
        text: err.response?.data?.message || 'Failed to update posting status.'
      });
    }
  };

  const confirmDeleteJob = async () => {
    if (!jobToDelete || deletingJob) return;
    setDeletingJob(true);
    try {
      await api.delete(`/jobs/${jobToDelete._id}`);
      setBannerFeedback({ type: 'success', text: `"${jobToDelete.title}" has been deleted.` });
      setJobToDelete(null);
      loadRecruiterData(false);
    } catch (err) {
      setBannerFeedback({
        type: 'error',
        text: err.response?.data?.message || 'Failed to delete posting.'
      });
    } finally {
      setDeletingJob(false);
    }
  };

  const handleViewApplicants = async (job) => {
    setSelectedJobForApplicants(job);
    setLoadingApplicants(true);
    setApplicantsError(null);
    try {
      const res = await api.get(`/applications/job/${job._id}`);
      if (res.data.success) {
        setApplicantsList(res.data.applicants || []);
      }
    } catch (err) {
      setApplicantsError(err.response?.data?.message || 'Failed to load applicants.');
    } finally {
      setLoadingApplicants(false);
    }
  };

  const handleUpdateApplicantStatus = async (applicationId, newStatus) => {
    try {
      await api.put(`/applications/${applicationId}/status`, { status: newStatus });
      setApplicantsList((prev) =>
        prev.map((app) => (app._id === applicationId ? { ...app, status: newStatus } : app))
      );
      loadRecruiterData(false);
    } catch (err) {
      setApplicantsError(err.response?.data?.message || 'Failed to update applicant status.');
    }
  };

  const handleCompanySubmit = async (e) => {
    e.preventDefault();
    setSavingCompany(true);
    setCompanyFeedback(null);
    try {
      const res = await api.put('/companies/my-company', companyForm);
      if (res.data.success) {
        setCompanyFeedback({ type: 'success', text: 'Company profile updated successfully.' });
        if (user) {
          const updatedUser = { ...user, company: res.data.company };
          setUser(updatedUser);
          localStorage.setItem('user', JSON.stringify(updatedUser));
        }
      }
    } catch (err) {
      setCompanyFeedback({
        type: 'error',
        text: err.response?.data?.message || 'Failed to update company profile.'
      });
    } finally {
      setSavingCompany(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 space-y-8">
      {/* Top Banner */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-2xs flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-brand-600 flex items-center justify-center text-white font-extrabold text-2xl shadow-sm flex-shrink-0">
            {user?.name?.charAt(0)?.toUpperCase() || 'R'}
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-bold text-slate-900">{user?.name}</h1>
              <span className="text-xs font-semibold bg-brand-50 text-brand-700 border border-brand-200 px-2.5 py-0.5 rounded-full">
                Recruiter
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1 flex items-center gap-1.5">
              <Building2 className="w-3.5 h-3.5 text-slate-400" />
              {user?.company?.name || 'Employer Workspace'}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={openCreateModal}
          className="px-5 py-3 bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center gap-2"
        >
          <PlusCircle className="w-4 h-4" /> Post New Opportunity
        </button>
      </div>

      {bannerFeedback && (
        <div
          className={`p-3.5 rounded-2xl text-xs font-semibold flex items-center justify-between gap-2 ${
            bannerFeedback.type === 'success'
              ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
              : 'bg-red-50 text-red-700 border border-red-200'
          }`}
        >
          <span className="flex items-center gap-2">
            {bannerFeedback.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            ) : (
              <AlertCircle className="w-4 h-4 text-red-600" />
            )}
            {bannerFeedback.text}
          </span>
          <button
            type="button"
            onClick={() => setBannerFeedback(null)}
            className="text-slate-500 hover:text-slate-800"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Metrics Row */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
          <p className="text-xs font-semibold text-slate-400">Total Postings</p>
          <p className="text-2xl font-extrabold text-slate-900 mt-1">{stats?.totalPostings ?? 0}</p>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
          <p className="text-xs font-semibold text-slate-400">Active Jobs</p>
          <p className="text-2xl font-extrabold text-emerald-600 mt-1">{stats?.activePostings ?? 0}</p>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
          <p className="text-xs font-semibold text-slate-400">Closed Jobs</p>
          <p className="text-2xl font-extrabold text-slate-500 mt-1">{stats?.closedPostings ?? 0}</p>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
          <p className="text-xs font-semibold text-slate-400">Total Applicants</p>
          <p className="text-2xl font-extrabold text-brand-600 mt-1">{stats?.totalApplicants ?? 0}</p>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs col-span-2 sm:col-span-1">
          <p className="text-xs font-semibold text-slate-400">Shortlisted</p>
          <p className="text-2xl font-extrabold text-sky-600 mt-1">{stats?.shortlistedCount ?? 0}</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200 gap-6 text-xs sm:text-sm font-semibold overflow-x-auto">
        <button
          type="button"
          onClick={() => handleTabChange('overview')}
          className={`pb-3 border-b-2 whitespace-nowrap flex items-center gap-2 transition-colors ${
            activeTab === 'overview'
              ? 'border-brand-600 text-brand-700'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <LayoutDashboard className="w-4 h-4" />
          Postings &amp; Analytics
        </button>

        <button
          type="button"
          onClick={() => handleTabChange('company')}
          className={`pb-3 border-b-2 whitespace-nowrap flex items-center gap-2 transition-colors ${
            activeTab === 'company'
              ? 'border-brand-600 text-brand-700'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Building2 className="w-4 h-4" />
          Company Profile
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

      {activeTab === 'overview' && (
        <div className="space-y-8">
          {/* Analytics Charts */}
          {stats && (stats.jobApplicationsData?.length > 0 || stats.statusDistribution?.some((d) => d.value > 0)) && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-2xs">
                <h3 className="font-bold text-slate-900 text-sm mb-4">Applications by Role</h3>
                <div className="h-60 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={stats.jobApplicationsData}>
                      <XAxis dataKey="role" stroke="#94a3b8" fontSize={11} />
                      <YAxis stroke="#94a3b8" fontSize={11} allowDecimals={false} />
                      <Tooltip />
                      <Bar dataKey="applicants" fill="#7c3aed" radius={[6, 6, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-2xs">
                <h3 className="font-bold text-slate-900 text-sm mb-4">Applicant Status Distribution</h3>
                <div className="h-60 w-full flex items-center justify-center">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={stats.statusDistribution}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        innerRadius={55}
                        outerRadius={80}
                        paddingAngle={4}
                      >
                        {stats.statusDistribution.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="flex flex-wrap justify-center gap-4 text-xs font-semibold text-slate-600 mt-2">
                  <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-indigo-500" /> Applied</span>
                  <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-blue-500" /> Shortlisted</span>
                  <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-emerald-500" /> Selected</span>
                  <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-red-500" /> Rejected</span>
                </div>
              </div>
            </div>
          )}

          {/* Postings Management Table */}
          <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-2xs">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
              <h3 className="font-bold text-slate-900 text-sm">Your Postings ({postings.length})</h3>
              <span className="text-xs text-slate-400">Click status to close or reopen</span>
            </div>

            {loading ? (
              <div className="p-6">
                <TableSkeleton rows={4} />
              </div>
            ) : postings.length === 0 ? (
              <div className="p-12 text-center space-y-3">
                <Briefcase className="w-10 h-10 text-slate-300 mx-auto" />
                <p className="font-semibold text-slate-700 text-sm">No opportunities posted yet</p>
                <p className="text-xs text-slate-400">Create your first job or internship listing to start receiving applications.</p>
                <button
                  type="button"
                  onClick={openCreateModal}
                  className="inline-flex items-center gap-1.5 px-4 py-2 bg-brand-600 text-white rounded-xl text-xs font-semibold hover:bg-brand-700"
                >
                  <PlusCircle className="w-4 h-4" /> Post Opportunity
                </button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-slate-50/80 text-slate-500 border-b border-slate-100">
                      <th className="py-3.5 px-6 font-semibold">Title &amp; Category</th>
                      <th className="py-3.5 px-6 font-semibold">Type</th>
                      <th className="py-3.5 px-6 font-semibold">Deadline</th>
                      <th className="py-3.5 px-6 font-semibold">Status</th>
                      <th className="py-3.5 px-6 font-semibold">Applicants</th>
                      <th className="py-3.5 px-6 font-semibold text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {postings.map((job) => (
                      <tr key={job._id} className="hover:bg-slate-50/60 transition-colors">
                        <td className="py-4 px-6">
                          <Link to={`/opportunity/${job._id}`} className="font-bold text-slate-900 hover:text-brand-600">
                            {job.title}
                          </Link>
                          <p className="text-[11px] text-slate-500">{job.category} &bull; {job.workplaceType}</p>
                        </td>
                        <td className="py-4 px-6">
                          <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-brand-50 text-brand-700">
                            {job.opportunityType}
                          </span>
                        </td>
                        <td className="py-4 px-6 text-slate-500 whitespace-nowrap">
                          {job.deadline ? new Date(job.deadline).toLocaleDateString() : 'Rolling'}
                        </td>
                        <td className="py-4 px-6">
                          <button
                            type="button"
                            onClick={() => handleToggleJobStatus(job)}
                            title={job.status === 'Active' ? 'Click to close posting' : 'Click to reopen posting'}
                            className={`inline-flex items-center gap-1 font-semibold px-2.5 py-0.5 rounded-full text-xs transition-colors ${
                              job.status === 'Active'
                                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100'
                                : 'bg-slate-100 text-slate-600 border border-slate-200 hover:bg-slate-200'
                            }`}
                          >
                            {job.status}
                          </button>
                        </td>
                        <td className="py-4 px-6">
                          <button
                            type="button"
                            onClick={() => handleViewApplicants(job)}
                            className="inline-flex items-center gap-1.5 font-bold text-brand-700 hover:text-brand-800 bg-brand-50 hover:bg-brand-100 px-3 py-1 rounded-lg transition-colors whitespace-nowrap"
                          >
                            <Users className="w-3.5 h-3.5" />
                            {job.applicantCount || 0} Applicants
                          </button>
                        </td>
                        <td className="py-4 px-6 text-right whitespace-nowrap space-x-1">
                          <button
                            type="button"
                            onClick={() => openEditModal(job)}
                            className="p-1.5 text-slate-500 hover:text-brand-600 hover:bg-brand-50 rounded-lg transition-colors"
                            title="Edit Posting"
                            aria-label="Edit posting"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => setJobToDelete(job)}
                            className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Delete Posting"
                            aria-label="Delete posting"
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
        </div>
      )}

      {/* Company Profile Tab */}
      {activeTab === 'company' && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-2xs max-w-3xl">
          <h3 className="text-base font-bold text-slate-900 mb-1">Company Profile</h3>
          <p className="text-xs text-slate-500 mb-6">
            This information is shown to candidates on your job listings and company page.
          </p>

          {companyFeedback && (
            <div className={`p-3.5 rounded-xl mb-5 text-xs font-semibold flex items-center gap-2 ${
              companyFeedback.type === 'success'
                ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                : 'bg-red-50 text-red-800 border border-red-200'
            }`}>
              {companyFeedback.type === 'success' ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              ) : (
                <AlertCircle className="w-4 h-4 text-red-600" />
              )}
              <span>{companyFeedback.text}</span>
            </div>
          )}

          <form onSubmit={handleCompanySubmit} className="space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Company Name *</label>
                <input
                  type="text"
                  required
                  value={companyForm.name}
                  onChange={(e) => setCompanyForm({ ...companyForm, name: e.target.value })}
                  className="w-full text-xs text-slate-800 px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:border-brand-500"
                />
              </div>
              <div>
                <label className="block font-bold text-slate-700 mb-1">Industry *</label>
                <input
                  type="text"
                  required
                  value={companyForm.industry}
                  onChange={(e) => setCompanyForm({ ...companyForm, industry: e.target.value })}
                  className="w-full text-xs text-slate-800 px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:border-brand-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Headquarters</label>
                <input
                  type="text"
                  placeholder="e.g. Bangalore, India"
                  value={companyForm.headquarters}
                  onChange={(e) => setCompanyForm({ ...companyForm, headquarters: e.target.value })}
                  className="w-full text-xs text-slate-800 px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:border-brand-500"
                />
              </div>
              <div>
                <label className="block font-bold text-slate-700 mb-1">Company Size</label>
                <input
                  type="text"
                  placeholder="e.g. 200+"
                  value={companyForm.employeeCount}
                  onChange={(e) => setCompanyForm({ ...companyForm, employeeCount: e.target.value })}
                  className="w-full text-xs text-slate-800 px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:border-brand-500"
                />
              </div>
              <div>
                <label className="block font-bold text-slate-700 mb-1">Website</label>
                <input
                  type="url"
                  placeholder="https://company.com"
                  value={companyForm.website}
                  onChange={(e) => setCompanyForm({ ...companyForm, website: e.target.value })}
                  className="w-full text-xs text-slate-800 px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:border-brand-500"
                />
              </div>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Company Description *</label>
              <textarea
                rows={4}
                required
                value={companyForm.description}
                onChange={(e) => setCompanyForm({ ...companyForm, description: e.target.value })}
                className="w-full text-xs text-slate-800 p-3.5 rounded-xl border border-slate-300 focus:outline-none focus:border-brand-500"
              />
            </div>

            <button
              type="submit"
              disabled={savingCompany}
              className="px-6 py-2.5 bg-brand-600 hover:bg-brand-700 text-white font-bold rounded-xl shadow-xs transition-colors flex items-center gap-2 disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              {savingCompany ? 'Saving...' : 'Save Company Profile'}
            </button>
          </form>
        </div>
      )}

      {/* Account Settings Tab */}
      {activeTab === 'settings' && <AccountSettingsPanel />}

      {/* Modal: Create / Edit Job */}
      {isPostModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto relative">
            <button
              type="button"
              onClick={() => setIsPostModalOpen(false)}
              aria-label="Close modal"
              className="absolute right-5 top-5 p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-xl font-bold text-slate-900 mb-1">
              {editingJobId ? 'Edit Opportunity' : 'Post New Opportunity'}
            </h3>
            <p className="text-xs text-slate-500 mb-5">
              {editingJobId
                ? 'Update role details, compensation, or deadline.'
                : 'Publish a job or internship listing visible immediately to candidates.'}
            </p>

            {postError && (
              <div className="p-3.5 rounded-xl mb-4 text-xs font-semibold bg-red-50 text-red-700 border border-red-200">
                {postError}
              </div>
            )}

            <form onSubmit={handleSaveJob} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Opportunity Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Junior Full-Stack Developer"
                  value={jobForm.title}
                  onChange={(e) => setJobForm({ ...jobForm, title: e.target.value })}
                  className="w-full text-xs text-slate-800 px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:border-brand-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Opportunity Type</label>
                  <select
                    value={jobForm.opportunityType}
                    onChange={(e) => {
                      const nextType = e.target.value;
                      setJobForm({
                        ...jobForm,
                        opportunityType: nextType,
                        jobType: nextType === 'Internship' ? 'Internship' : 'Full-time'
                      });
                    }}
                    className="w-full text-xs text-slate-800 px-3 py-2.5 rounded-xl border border-slate-300 bg-white"
                  >
                    <option value="Job">Job</option>
                    <option value="Internship">Internship</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Employment Type</label>
                  <select
                    value={jobForm.jobType}
                    onChange={(e) => setJobForm({ ...jobForm, jobType: e.target.value })}
                    className="w-full text-xs text-slate-800 px-3 py-2.5 rounded-xl border border-slate-300 bg-white"
                  >
                    {jobForm.opportunityType === 'Internship' ? (
                      <>
                        <option value="Internship">Internship</option>
                        <option value="Part-time">Part-time</option>
                      </>
                    ) : (
                      <>
                        <option value="Full-time">Full-time</option>
                        <option value="Part-time">Part-time</option>
                        <option value="Contract">Contract</option>
                      </>
                    )}
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Workplace Mode</label>
                  <select
                    value={jobForm.workplaceType}
                    onChange={(e) => setJobForm({ ...jobForm, workplaceType: e.target.value })}
                    className="w-full text-xs text-slate-800 px-3 py-2.5 rounded-xl border border-slate-300 bg-white"
                  >
                    <option value="Remote">Remote</option>
                    <option value="Hybrid">Hybrid</option>
                    <option value="Onsite">Onsite</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Category *</label>
                  <select
                    value={jobForm.category}
                    onChange={(e) => setJobForm({ ...jobForm, category: e.target.value })}
                    className="w-full text-xs text-slate-800 px-3 py-2.5 rounded-xl border border-slate-300 bg-white"
                  >
                    {OPPORTUNITY_CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Location *</label>
                  <input
                    type="text"
                    required
                    value={jobForm.location}
                    onChange={(e) => setJobForm({ ...jobForm, location: e.target.value })}
                    className="w-full text-xs text-slate-800 px-3.5 py-2.5 rounded-xl border border-slate-300"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Application Deadline *</label>
                  <input
                    type="date"
                    required
                    value={jobForm.deadline}
                    onChange={(e) => setJobForm({ ...jobForm, deadline: e.target.value })}
                    className="w-full text-xs text-slate-800 px-3.5 py-2.5 rounded-xl border border-slate-300"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {jobForm.opportunityType === 'Internship' ? (
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Monthly Stipend (₹)</label>
                    <input
                      type="number"
                      min={0}
                      value={jobForm.stipendAmount}
                      onChange={(e) => setJobForm({ ...jobForm, stipendAmount: e.target.value })}
                      className="w-full text-xs text-slate-800 px-3.5 py-2.5 rounded-xl border border-slate-300"
                    />
                  </div>
                ) : (
                  <>
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Min Salary (LPA)</label>
                      <input
                        type="number"
                        min={0}
                        step="0.5"
                        value={jobForm.salaryMin}
                        onChange={(e) => setJobForm({ ...jobForm, salaryMin: e.target.value })}
                        className="w-full text-xs text-slate-800 px-3.5 py-2.5 rounded-xl border border-slate-300"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Max Salary (LPA)</label>
                      <input
                        type="number"
                        min={0}
                        step="0.5"
                        value={jobForm.salaryMax}
                        onChange={(e) => setJobForm({ ...jobForm, salaryMax: e.target.value })}
                        className="w-full text-xs text-slate-800 px-3.5 py-2.5 rounded-xl border border-slate-300"
                      />
                    </div>
                  </>
                )}

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Openings</label>
                  <input
                    type="number"
                    min={1}
                    value={jobForm.openings}
                    onChange={(e) => setJobForm({ ...jobForm, openings: e.target.value })}
                    className="w-full text-xs text-slate-800 px-3.5 py-2.5 rounded-xl border border-slate-300"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Experience Level</label>
                  <input
                    type="text"
                    placeholder="e.g. Fresher / 0-2 Years"
                    value={jobForm.experienceLevel}
                    onChange={(e) => setJobForm({ ...jobForm, experienceLevel: e.target.value })}
                    className="w-full text-xs text-slate-800 px-3.5 py-2.5 rounded-xl border border-slate-300"
                  />
                </div>
              </div>

              <div>
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={jobForm.isFresherEligible}
                    onChange={(e) => setJobForm({ ...jobForm, isFresherEligible: e.target.checked })}
                    className="w-4 h-4 text-brand-600 rounded border-slate-300"
                  />
                  <span className="font-bold text-slate-700">Fresher / Student Eligible</span>
                </label>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Required Skills (Comma separated)</label>
                <input
                  type="text"
                  placeholder="React, Node.js, Express, MongoDB"
                  value={jobForm.requiredSkills}
                  onChange={(e) => setJobForm({ ...jobForm, requiredSkills: e.target.value })}
                  className="w-full text-xs text-slate-800 px-3.5 py-2.5 rounded-xl border border-slate-300"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Description *</label>
                <textarea
                  rows={3}
                  required
                  placeholder="Describe the opportunity, team, and expectations..."
                  value={jobForm.description}
                  onChange={(e) => setJobForm({ ...jobForm, description: e.target.value })}
                  className="w-full text-xs text-slate-800 p-3.5 rounded-xl border border-slate-300"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Responsibilities (One per line)</label>
                  <textarea
                    rows={3}
                    placeholder="Build REST APIs&#10;Write unit tests"
                    value={jobForm.responsibilities}
                    onChange={(e) => setJobForm({ ...jobForm, responsibilities: e.target.value })}
                    className="w-full text-xs text-slate-800 p-3 rounded-xl border border-slate-300"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Requirements (One per line)</label>
                  <textarea
                    rows={3}
                    placeholder="B.Tech / B.E. in CS or equivalent&#10;Strong JavaScript fundamentals"
                    value={jobForm.requirements}
                    onChange={(e) => setJobForm({ ...jobForm, requirements: e.target.value })}
                    className="w-full text-xs text-slate-800 p-3 rounded-xl border border-slate-300"
                  />
                </div>
              </div>

              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsPostModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={postingSubmitting}
                  className="px-5 py-2.5 bg-brand-600 hover:bg-brand-700 text-white font-bold rounded-xl shadow-xs transition-colors disabled:opacity-50"
                >
                  {postingSubmitting
                    ? (editingJobId ? 'Saving Changes...' : 'Publishing...')
                    : (editingJobId ? 'Save Changes' : 'Publish Opportunity')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Confirm Delete Posting */}
      {jobToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <h3 className="text-lg font-bold text-slate-900">Delete Opportunity?</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Are you sure you want to permanently delete <strong>{jobToDelete.title}</strong>? All associated applications will also be removed.
            </p>
            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setJobToDelete(null)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={deletingJob}
                onClick={confirmDeleteJob}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-xl disabled:opacity-50"
              >
                {deletingJob ? 'Deleting...' : 'Delete Posting'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: View Applicants */}
      {selectedJobForApplicants && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4">
          <div className="bg-white rounded-3xl max-w-3xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 max-h-[85vh] overflow-y-auto relative">
            <button
              type="button"
              onClick={() => setSelectedJobForApplicants(null)}
              aria-label="Close applicants modal"
              className="absolute right-5 top-5 p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-xl font-bold text-slate-900 mb-1">
              Applicants for &ldquo;{selectedJobForApplicants.title}&rdquo;
            </h3>
            <p className="text-xs text-slate-500 mb-6">
              Review candidate profiles, resumes, and update application statuses.
            </p>

            {applicantsError && (
              <div className="p-3.5 rounded-xl mb-4 text-xs font-semibold bg-red-50 text-red-700 border border-red-200">
                {applicantsError}
              </div>
            )}

            {loadingApplicants ? (
              <TableSkeleton rows={3} />
            ) : applicantsList.length === 0 ? (
              <div className="p-8 text-center text-xs text-slate-400">
                No candidates have applied for this opportunity yet.
              </div>
            ) : (
              <div className="space-y-4">
                {applicantsList.map((app) => (
                  <div key={app._id} className="p-4 rounded-2xl border border-slate-200 bg-slate-50/50 space-y-3 text-xs">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div>
                        <h4 className="font-bold text-slate-900 text-sm">{app.student?.name}</h4>
                        <p className="text-slate-500">{app.student?.email}</p>
                        {app.student?.profile?.headline && (
                          <p className="text-[11px] text-slate-600 mt-0.5">{app.student.profile.headline}</p>
                        )}
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-slate-600">Status:</span>
                        <select
                          value={app.status}
                          onChange={(e) => handleUpdateApplicantStatus(app._id, e.target.value)}
                          className="bg-white font-semibold text-slate-800 border border-slate-300 rounded-lg px-2.5 py-1 text-xs focus:outline-none focus:border-brand-500"
                        >
                          <option value="Applied">Applied</option>
                          <option value="Shortlisted">Shortlisted</option>
                          <option value="Selected">Selected</option>
                          <option value="Rejected">Rejected</option>
                        </select>
                      </div>
                    </div>

                    {app.coverLetter && (
                      <div className="bg-white p-3 rounded-xl border border-slate-200 text-slate-600 leading-relaxed">
                        &ldquo;{app.coverLetter}&rdquo;
                      </div>
                    )}

                    <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-100">
                      <div className="flex flex-wrap gap-1">
                        {app.student?.profile?.skills?.map((s, idx) => (
                          <span key={idx} className="bg-slate-200 text-slate-700 px-2 py-0.5 rounded text-[10px] font-medium">
                            {s}
                          </span>
                        ))}
                      </div>

                      {safeExternalUrl(app.resumeUrl || app.student?.profile?.resumeUrl) && (
                        <a
                          href={safeExternalUrl(app.resumeUrl || app.student?.profile?.resumeUrl)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="font-bold text-brand-700 hover:text-brand-800 inline-flex items-center gap-1 bg-brand-50 px-3 py-1 rounded-lg"
                        >
                          View Resume
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default RecruiterDashboard;
