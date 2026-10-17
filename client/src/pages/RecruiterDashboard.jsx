import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { TableSkeleton } from '../components/SkeletonLoader';
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
  CheckCircle2,
  Clock,
  PlusCircle,
  Eye,
  Trash2,
  X,
  ExternalLink,
  Building2,
  AlertCircle,
  Check,
  ToggleLeft,
  ToggleRight
} from 'lucide-react';

const COLORS = ['#6366f1', '#3b82f6', '#10b981', '#ef4444'];

const RecruiterDashboard = () => {
  const { user } = useAuth();
  const [searchParams] = useSearchParams();

  const [stats, setStats] = useState(null);
  const [postings, setPostings] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal: Post New Job
  const [isPostModalOpen, setIsPostModalOpen] = useState(searchParams.get('action') === 'new-job');
  const [jobForm, setJobForm] = useState({
    title: '',
    opportunityType: 'Job',
    jobType: 'Full-time',
    workplaceType: 'Hybrid',
    location: 'Bangalore, India',
    category: 'Software Engineering',
    description: '',
    requiredSkills: '',
    experienceLevel: 'Fresher / Entry Level',
    isFresherEligible: true,
    salaryMin: 8,
    salaryMax: 14,
    stipendAmount: 30000,
    openings: 2,
    deadline: ''
  });
  const [postingSubmitting, setPostingSubmitting] = useState(false);
  const [postError, setPostError] = useState(null);

  // Modal: View Applicants for a Job
  const [selectedJobForApplicants, setSelectedJobForApplicants] = useState(null);
  const [applicantsList, setApplicantsList] = useState([]);
  const [loadingApplicants, setLoadingApplicants] = useState(false);

  const loadRecruiterData = async () => {
    setLoading(true);
    try {
      const [statsRes, postingsRes] = await Promise.all([
        api.get('/stats/recruiter'),
        api.get('/jobs/recruiter/my-postings')
      ]);

      if (statsRes.data.success) setStats(statsRes.data.stats);
      if (postingsRes.data.success) setPostings(postingsRes.data.jobs);
    } catch (err) {
      console.error('Failed to load recruiter data:', err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRecruiterData();
  }, []);

  const handlePostJob = async (e) => {
    e.preventDefault();
    setPostingSubmitting(true);
    setPostError(null);

    try {
      const payload = {
        ...jobForm,
        requiredSkills: jobForm.requiredSkills.split(',').map((s) => s.trim()).filter(Boolean)
      };

      const res = await api.post('/jobs', payload);
      if (res.data.success) {
        setIsPostModalOpen(false);
        setJobForm({
          title: '',
          opportunityType: 'Job',
          jobType: 'Full-time',
          workplaceType: 'Hybrid',
          location: 'Bangalore, India',
          category: 'Software Engineering',
          description: '',
          requiredSkills: '',
          experienceLevel: 'Fresher / Entry Level',
          isFresherEligible: true,
          salaryMin: 8,
          salaryMax: 14,
          stipendAmount: 30000,
          openings: 2,
          deadline: ''
        });
        loadRecruiterData();
      }
    } catch (err) {
      setPostError(err.response?.data?.message || 'Failed to post opportunity.');
    } finally {
      setPostingSubmitting(false);
    }
  };

  const handleToggleJobStatus = async (job) => {
    try {
      const newStatus = job.status === 'Active' ? 'Closed' : 'Active';
      await api.put(`/jobs/${job._id}`, { status: newStatus });
      loadRecruiterData();
    } catch (err) {
      console.error('Failed to update status:', err.message);
    }
  };

  const handleDeleteJob = async (jobId) => {
    if (!window.confirm('Are you sure you want to delete this posting and its applications?')) return;
    try {
      await api.delete(`/jobs/${jobId}`);
      loadRecruiterData();
    } catch (err) {
      console.error('Failed to delete posting:', err.message);
    }
  };

  const handleViewApplicants = async (job) => {
    setSelectedJobForApplicants(job);
    setLoadingApplicants(true);
    try {
      const res = await api.get(`/applications/job/${job._id}`);
      if (res.data.success) {
        setApplicantsList(res.data.applicants);
      }
    } catch (err) {
      console.error('Failed to load applicants:', err.message);
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
      loadRecruiterData();
    } catch (err) {
      console.error('Failed to update status:', err.message);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Top Banner */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-brand-600 to-indigo-600 flex items-center justify-center text-white font-extrabold text-2xl shadow-md">
            {user?.name?.charAt(0)}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold text-slate-900">{user?.name}</h1>
              <span className="text-xs font-semibold bg-brand-50 text-brand-700 border border-brand-200 px-2 py-0.5 rounded">
                Employer / Recruiter
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1 flex items-center gap-1.5">
              <Building2 className="w-3.5 h-3.5 text-slate-400" />
              {user?.company?.name || 'Recruiter Portal'}
            </p>
          </div>
        </div>

        <button
          onClick={() => setIsPostModalOpen(true)}
          className="px-5 py-3 bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs rounded-xl shadow-sm transition-all flex items-center gap-2"
        >
          <PlusCircle className="w-4 h-4" /> Post New Opportunity
        </button>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
          <p className="text-xs font-semibold text-slate-400">Total Postings</p>
          <p className="text-2xl font-extrabold text-slate-900 mt-1">{stats?.totalPostings || 0}</p>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
          <p className="text-xs font-semibold text-slate-400">Active Openings</p>
          <p className="text-2xl font-extrabold text-emerald-600 mt-1">{stats?.activePostings || 0}</p>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
          <p className="text-xs font-semibold text-slate-400">Applicants Received</p>
          <p className="text-2xl font-extrabold text-brand-600 mt-1">{stats?.totalApplicants || 0}</p>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
          <p className="text-xs font-semibold text-slate-400">Shortlisted Candidates</p>
          <p className="text-2xl font-extrabold text-blue-600 mt-1">{stats?.shortlistedCount || 0}</p>
        </div>
      </div>

      {/* Visual Analytics Charts (Recharts) */}
      {stats && (stats.jobApplicationsData?.length > 0 || stats.statusDistribution?.some((d) => d.value > 0)) && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Applications by Role Bar Chart */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs">
            <h3 className="font-bold text-slate-900 text-sm mb-4">Applications by Opportunity Role</h3>
            <div className="h-60 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={stats.jobApplicationsData}>
                  <XAxis dataKey="role" stroke="#94a3b8" fontSize={11} />
                  <YAxis stroke="#94a3b8" fontSize={11} allowDecimals={false} />
                  <Tooltip wrapperClassName="text-xs rounded-xl shadow-lg border border-slate-200" />
                  <Bar dataKey="applicants" fill="#6366f1" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Applicant Pipeline Status Donut */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs">
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
                  <Tooltip wrapperClassName="text-xs rounded-xl shadow-lg border border-slate-200" />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex justify-center gap-4 text-xs font-semibold text-slate-600 mt-2">
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-indigo-500" /> Applied</span>
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-blue-500" /> Shortlisted</span>
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-emerald-500" /> Selected</span>
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-red-500" /> Rejected</span>
            </div>
          </div>
        </div>
      )}

      {/* Postings Management Table */}
      <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <h3 className="font-bold text-slate-900 text-sm">Managed Opportunities ({postings.length})</h3>
          <span className="text-xs text-slate-400">Postings created by this recruiter account</span>
        </div>

        {loading ? (
          <div className="p-6">
            <TableSkeleton rows={4} />
          </div>
        ) : postings.length === 0 ? (
          <div className="p-12 text-center space-y-3">
            <Briefcase className="w-10 h-10 text-slate-300 mx-auto" />
            <p className="font-semibold text-slate-700 text-sm">No opportunities posted yet</p>
            <p className="text-xs text-slate-400">Click "Post New Opportunity" to create your first listing.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50/80 text-slate-500 border-b border-slate-100">
                  <th className="py-3.5 px-6 font-semibold">Title & Category</th>
                  <th className="py-3.5 px-6 font-semibold">Type</th>
                  <th className="py-3.5 px-6 font-semibold">Workplace</th>
                  <th className="py-3.5 px-6 font-semibold">Status</th>
                  <th className="py-3.5 px-6 font-semibold">Applicants</th>
                  <th className="py-3.5 px-6 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {postings.map((job) => (
                  <tr key={job._id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-4 px-6">
                      <p className="font-bold text-slate-900">{job.title}</p>
                      <p className="text-[11px] text-slate-500">{job.category}</p>
                    </td>
                    <td className="py-4 px-6">
                      <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-purple-50 text-purple-700">
                        {job.opportunityType}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-slate-600">{job.workplaceType}</td>
                    <td className="py-4 px-6">
                      <button
                        onClick={() => handleToggleJobStatus(job)}
                        className={`inline-flex items-center gap-1 font-semibold px-2.5 py-0.5 rounded-full text-xs ${
                          job.status === 'Active'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : 'bg-slate-100 text-slate-600'
                        }`}
                      >
                        {job.status === 'Active' ? 'Active' : 'Closed'}
                      </button>
                    </td>
                    <td className="py-4 px-6">
                      <button
                        onClick={() => handleViewApplicants(job)}
                        className="inline-flex items-center gap-1.5 font-bold text-brand-600 hover:text-brand-800 bg-brand-50 hover:bg-brand-100 px-3 py-1 rounded-lg transition-colors"
                      >
                        <Users className="w-3.5 h-3.5" />
                        {job.applicantCount || 0} Applicants
                      </button>
                    </td>
                    <td className="py-4 px-6 text-right space-x-2">
                      <button
                        onClick={() => handleDeleteJob(job._id)}
                        className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Delete Posting"
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

      {/* Modal: Post New Job */}
      {isPostModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto relative animate-in fade-in zoom-in-95">
            <button
              onClick={() => setIsPostModalOpen(false)}
              className="absolute right-5 top-5 p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-xl font-bold text-slate-900 mb-1">Post New Opportunity</h3>
            <p className="text-xs text-slate-500 mb-5">Create a student-facing job or internship vacancy.</p>

            {postError && (
              <div className="p-3.5 rounded-xl mb-4 text-xs font-semibold bg-red-50 text-red-700 border border-red-200">
                {postError}
              </div>
            )}

            <form onSubmit={handlePostJob} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Opportunity Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Junior MERN Stack Developer"
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
                    onChange={(e) => setJobForm({ ...jobForm, opportunityType: e.target.value })}
                    className="w-full text-xs text-slate-800 px-3 py-2.5 rounded-xl border border-slate-300"
                  >
                    <option value="Job">Job (Full-time)</option>
                    <option value="Internship">Internship</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Workplace Mode</label>
                  <select
                    value={jobForm.workplaceType}
                    onChange={(e) => setJobForm({ ...jobForm, workplaceType: e.target.value })}
                    className="w-full text-xs text-slate-800 px-3 py-2.5 rounded-xl border border-slate-300"
                  >
                    <option value="Remote">Remote</option>
                    <option value="Hybrid">Hybrid</option>
                    <option value="Onsite">Onsite</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Domain</label>
                  <select
                    value={jobForm.category}
                    onChange={(e) => setJobForm({ ...jobForm, category: e.target.value })}
                    className="w-full text-xs text-slate-800 px-3 py-2.5 rounded-xl border border-slate-300"
                  >
                    <option value="Software Engineering">Software Engineering</option>
                    <option value="Full-Stack Development">Full-Stack Development</option>
                    <option value="Frontend Development">Frontend Development</option>
                    <option value="Backend Development">Backend Development</option>
                    <option value="Cloud & DevOps">Cloud & DevOps</option>
                    <option value="Data & AI">Data & AI</option>
                    <option value="QA & Testing">QA & Testing</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Location</label>
                  <input
                    type="text"
                    required
                    value={jobForm.location}
                    onChange={(e) => setJobForm({ ...jobForm, location: e.target.value })}
                    className="w-full text-xs text-slate-800 px-3.5 py-2.5 rounded-xl border border-slate-300"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Deadline Date</label>
                  <input
                    type="date"
                    required
                    value={jobForm.deadline}
                    onChange={(e) => setJobForm({ ...jobForm, deadline: e.target.value })}
                    className="w-full text-xs text-slate-800 px-3.5 py-2.5 rounded-xl border border-slate-300"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Required Skills (Comma separated)</label>
                <input
                  type="text"
                  placeholder="React, Node.js, Express, MongoDB, Tailwind"
                  value={jobForm.requiredSkills}
                  onChange={(e) => setJobForm({ ...jobForm, requiredSkills: e.target.value })}
                  className="w-full text-xs text-slate-800 px-3.5 py-2.5 rounded-xl border border-slate-300"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Job Description & Responsibilities</label>
                <textarea
                  rows={4}
                  required
                  placeholder="Describe the opportunity, core responsibilities, and team expectations..."
                  value={jobForm.description}
                  onChange={(e) => setJobForm({ ...jobForm, description: e.target.value })}
                  className="w-full text-xs text-slate-800 p-3.5 rounded-xl border border-slate-300"
                />
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
                  className="px-5 py-2.5 bg-brand-600 hover:bg-brand-700 text-white font-bold rounded-xl shadow-sm transition-all disabled:opacity-50"
                >
                  {postingSubmitting ? 'Publishing...' : 'Publish Opportunity'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: View Applicants for a Job */}
      {selectedJobForApplicants && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl max-w-3xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 max-h-[85vh] overflow-y-auto relative animate-in fade-in zoom-in-95">
            <button
              onClick={() => setSelectedJobForApplicants(null)}
              className="absolute right-5 top-5 p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-xl font-bold text-slate-900 mb-1">
              Applicants for "{selectedJobForApplicants.title}"
            </h3>
            <p className="text-xs text-slate-500 mb-6">Review candidate qualifications and update application statuses.</p>

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
                      </div>

                      {/* Status Dropdown */}
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-slate-600">Status:</span>
                        <select
                          value={app.status}
                          onChange={(e) => handleUpdateApplicantStatus(app._id, e.target.value)}
                          className="bg-white font-semibold text-slate-800 border border-slate-300 rounded-lg px-2.5 py-1 text-xs focus:outline-none focus:border-brand-500"
                        >
                          <option value="Applied">Applied (In Review)</option>
                          <option value="Shortlisted">Shortlisted</option>
                          <option value="Selected">Selected</option>
                          <option value="Rejected">Rejected</option>
                        </select>
                      </div>
                    </div>

                    {/* Candidate Cover Letter */}
                    {app.coverLetter && (
                      <div className="bg-white p-3 rounded-xl border border-slate-200 text-slate-600 leading-relaxed italic">
                        "{app.coverLetter}"
                      </div>
                    )}

                    {/* Resume Link & Skills */}
                    <div className="flex flex-wrap items-center justify-between gap-2 pt-1 border-t border-slate-100">
                      <div className="flex flex-wrap gap-1">
                        {app.student?.profile?.skills?.map((s, idx) => (
                          <span key={idx} className="bg-slate-200 text-slate-700 px-2 py-0.5 rounded text-[10px] font-medium">
                            {s}
                          </span>
                        ))}
                      </div>

                      {app.resumeUrl && (
                        <a
                          href={app.resumeUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="font-bold text-brand-600 hover:text-brand-800 flex items-center gap-1 bg-brand-50 px-3 py-1 rounded-lg"
                        >
                          View Resume URL
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
