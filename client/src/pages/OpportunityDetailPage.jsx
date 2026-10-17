import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import {
  Briefcase,
  Building2,
  MapPin,
  Calendar,
  Clock,
  DollarSign,
  Bookmark,
  Share2,
  ChevronLeft,
  CheckCircle2,
  AlertCircle,
  Users,
  Send,
  X,
  Sparkles,
  ExternalLink
} from 'lucide-react';

const OpportunityDetailPage = () => {
  const { id } = useParams();
  const { user, isAuthenticated, isStudent } = useAuth();
  const navigate = useNavigate();

  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Application Modal & State
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);
  const [coverLetter, setCoverLetter] = useState('');
  const [resumeUrl, setResumeUrl] = useState('');
  const [submittingApp, setSubmittingApp] = useState(false);
  const [appStatusMessage, setAppStatusMessage] = useState(null);

  // Bookmark State
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [bookmarkLoading, setBookmarkLoading] = useState(false);

  useEffect(() => {
    const fetchOpportunity = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await api.get(`/jobs/${id}`);
        if (res.data.success) {
          setJob(res.data.job);
        }
      } catch (err) {
        console.error('Failed to load opportunity:', err.message);
        setError('Opportunity not found or inactive.');
      } finally {
        setLoading(false);
      }
    };

    fetchOpportunity();
  }, [id]);

  // Check if job is bookmarked
  useEffect(() => {
    if (isStudent && job) {
      const checkBookmark = async () => {
        try {
          const res = await api.get(`/saved-jobs/check/${job._id}`);
          if (res.data.success) {
            setIsBookmarked(res.data.isSaved);
          }
        } catch {
          // ignore
        }
      };
      checkBookmark();
    }
  }, [isStudent, job]);

  // Pre-fill student resume URL
  useEffect(() => {
    if (user?.profile?.resumeUrl) {
      setResumeUrl(user.profile.resumeUrl);
    }
  }, [user]);

  const handleBookmarkToggle = async () => {
    if (!isStudent) {
      navigate('/login');
      return;
    }
    setBookmarkLoading(true);
    try {
      if (isBookmarked) {
        await api.delete(`/saved-jobs/${job._id}`);
        setIsBookmarked(false);
      } else {
        await api.post(`/saved-jobs/${job._id}`);
        setIsBookmarked(true);
      }
    } catch (err) {
      console.error('Bookmark error:', err.message);
    } finally {
      setBookmarkLoading(false);
    }
  };

  const handleApplySubmit = async (e) => {
    e.preventDefault();
    setSubmittingApp(true);
    setAppStatusMessage(null);

    try {
      const res = await api.post(`/applications/apply/${job._id}`, {
        coverLetter,
        resumeUrl
      });

      if (res.data.success) {
        setAppStatusMessage({
          type: 'success',
          text: 'Application submitted successfully! Track your status in your Student Dashboard.'
        });
        setTimeout(() => {
          setIsApplyModalOpen(false);
        }, 2000);
      }
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Failed to submit application. Please try again.';
      setAppStatusMessage({
        type: 'error',
        text: errorMsg
      });
    } finally {
      setSubmittingApp(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-16 text-center space-y-4">
        <div className="w-10 h-10 border-4 border-brand-600 border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-sm text-slate-500">Loading opportunity details...</p>
      </div>
    );
  }

  if (error || !job) {
    return (
      <div className="max-w-md mx-auto px-4 py-16 text-center space-y-4">
        <AlertCircle className="w-10 h-10 text-red-500 mx-auto" />
        <h2 className="text-xl font-bold text-slate-900">Opportunity Not Found</h2>
        <p className="text-xs text-slate-500">{error}</p>
        <Link
          to="/jobs"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-brand-600 hover:text-brand-800"
        >
          <ChevronLeft className="w-4 h-4" /> Back to All Jobs
        </Link>
      </div>
    );
  }

  const {
    title,
    company,
    opportunityType,
    jobType,
    workplaceType,
    location,
    category,
    description,
    responsibilities = [],
    requirements = [],
    requiredSkills = [],
    experienceLevel,
    isFresherEligible,
    salaryMin,
    salaryMax,
    stipendAmount,
    openings,
    deadline,
    isDemo,
    status
  } = job;

  const isClosed = status === 'Closed' || (deadline && new Date(deadline) < new Date());

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Back button */}
      <Link
        to={opportunityType === 'Internship' ? '/internships' : '/jobs'}
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-800 transition-colors"
      >
        <ChevronLeft className="w-4 h-4" /> Back to {opportunityType === 'Internship' ? 'Internships' : 'Jobs'}
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Opportunity Content (Left 2 Columns) */}
        <div className="lg:col-span-2 space-y-8">
          {/* Header Card */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
              <div className="space-y-2">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-xs font-semibold bg-brand-50 text-brand-700 border border-brand-200 px-2.5 py-0.5 rounded-md">
                    {category}
                  </span>
                  <span className="text-xs font-semibold bg-purple-50 text-purple-700 border border-purple-200 px-2.5 py-0.5 rounded-md">
                    {opportunityType}
                  </span>
                  {isFresherEligible && (
                    <span className="text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200 px-2.5 py-0.5 rounded-md">
                      Fresher Eligible
                    </span>
                  )}
                  {isDemo && (
                    <span className="text-xs font-semibold bg-slate-100 text-slate-600 px-2 py-0.5 rounded">
                      Demo Listing
                    </span>
                  )}
                </div>

                <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                  {title}
                </h1>

                <Link
                  to={`/company/${company?.slug || company?._id}`}
                  className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand-600 hover:text-brand-700"
                >
                  <Building2 className="w-4 h-4" />
                  {company?.name}
                </Link>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 flex-shrink-0">
                {isStudent && (
                  <button
                    onClick={handleBookmarkToggle}
                    disabled={bookmarkLoading}
                    className={`p-2.5 rounded-xl border transition-colors ${
                      isBookmarked
                        ? 'bg-brand-50 border-brand-300 text-brand-600'
                        : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-50'
                    }`}
                    title={isBookmarked ? 'Remove Bookmark' : 'Save Opportunity'}
                  >
                    <Bookmark className={`w-5 h-5 ${isBookmarked ? 'fill-current' : ''}`} />
                  </button>
                )}

                {isClosed ? (
                  <button
                    disabled
                    className="px-6 py-2.5 bg-slate-200 text-slate-500 font-bold text-sm rounded-xl cursor-not-allowed"
                  >
                    Listing Closed
                  </button>
                ) : isAuthenticated && isStudent ? (
                  <button
                    onClick={() => setIsApplyModalOpen(true)}
                    className="px-6 py-2.5 bg-brand-600 hover:bg-brand-700 text-white font-bold text-sm rounded-xl shadow-sm shadow-brand-500/20 transition-all flex items-center gap-2"
                  >
                    <Send className="w-4 h-4" /> Apply Now
                  </button>
                ) : !isAuthenticated ? (
                  <Link
                    to="/login"
                    state={{ from: { pathname: `/opportunity/${id}` } }}
                    className="px-6 py-2.5 bg-brand-600 hover:bg-brand-700 text-white font-bold text-sm rounded-xl shadow-sm transition-all"
                  >
                    Sign In to Apply
                  </Link>
                ) : null}
              </div>
            </div>

            {/* Quick Meta Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-6 border-t border-slate-100 text-xs">
              <div>
                <p className="text-slate-400 font-medium">Location</p>
                <p className="font-semibold text-slate-800 flex items-center gap-1 mt-0.5">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  {location} ({workplaceType})
                </p>
              </div>

              <div>
                <p className="text-slate-400 font-medium">Compensation</p>
                <p className="font-bold text-slate-900 mt-0.5">
                  {opportunityType === 'Internship'
                    ? stipendAmount ? `₹${stipendAmount.toLocaleString()}/mo` : 'Disclosed Upon Interview'
                    : salaryMin || salaryMax ? `₹${salaryMin} - ${salaryMax} LPA` : 'Competitive'}
                </p>
              </div>

              <div>
                <p className="text-slate-400 font-medium">Experience</p>
                <p className="font-semibold text-slate-800 mt-0.5">{experienceLevel}</p>
              </div>

              <div>
                <p className="text-slate-400 font-medium">Application Deadline</p>
                <p className="font-semibold text-slate-800 flex items-center gap-1 mt-0.5">
                  <Calendar className="w-3.5 h-3.5 text-slate-400" />
                  {deadline ? new Date(deadline).toLocaleDateString() : 'Rolling'}
                </p>
              </div>
            </div>
          </div>

          {/* Job Description */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
            <div>
              <h2 className="text-lg font-bold text-slate-900 mb-3">Role Overview</h2>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed whitespace-pre-line">
                {description}
              </p>
            </div>

            {/* Responsibilities */}
            {responsibilities.length > 0 && (
              <div>
                <h3 className="text-base font-bold text-slate-900 mb-3">Key Responsibilities</h3>
                <ul className="space-y-2">
                  {responsibilities.map((resp, idx) => (
                    <li key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-600">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                      <span>{resp}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Requirements */}
            {requirements.length > 0 && (
              <div>
                <h3 className="text-base font-bold text-slate-900 mb-3">Eligibility & Qualifications</h3>
                <ul className="space-y-2">
                  {requirements.map((req, idx) => (
                    <li key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-600">
                      <div className="w-1.5 h-1.5 rounded-full bg-brand-500 mt-2 flex-shrink-0" />
                      <span>{req}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Required Skills */}
            <div>
              <h3 className="text-base font-bold text-slate-900 mb-3">Required Technical Skills</h3>
              <div className="flex flex-wrap gap-2">
                {requiredSkills.map((skill, idx) => (
                  <span
                    key={idx}
                    className="text-xs font-semibold bg-slate-100 text-slate-800 px-3 py-1 rounded-lg"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar Card (Company Overview & Academic Notice) */}
        <div className="space-y-6">
          {/* Company Summary Card */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">About Employer</h3>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-brand-600 to-indigo-600 flex items-center justify-center text-white font-extrabold text-xl">
                {company?.name?.charAt(0)}
              </div>
              <div>
                <h4 className="font-bold text-slate-900 text-base">{company?.name}</h4>
                <p className="text-xs text-brand-600 font-medium">{company?.industry}</p>
              </div>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed line-clamp-3">
              {company?.description}
            </p>

            <div className="space-y-2 pt-3 border-t border-slate-100 text-xs text-slate-600">
              <div className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-slate-400" />
                <span>{company?.headquarters}</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="w-3.5 h-3.5 text-slate-400" />
                <span>{company?.employeeCount || '1000+'} team members</span>
              </div>
            </div>

            <Link
              to={`/company/${company?.slug || company?._id}`}
              className="block w-full text-center py-2 px-3 bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold text-xs rounded-xl transition-colors"
            >
              View Full Company Profile
            </Link>
          </div>

          {/* Academic Transparency Box */}
          <div className="bg-brand-50/70 border border-brand-200 rounded-2xl p-5 space-y-2 text-xs">
            <div className="flex items-center gap-2 text-brand-800 font-bold">
              <Sparkles className="w-4 h-4 text-brand-600" />
              <span>B.Tech Minor Project Record</span>
            </div>
            <p className="text-slate-600 leading-relaxed text-[11px]">
              This is a development demonstration opportunity engineered for Indra Singh Jeena's B.Tech CSE Minor Project. It validates real backend storage, compound duplicate prevention, and applicant status tracking.
            </p>
          </div>
        </div>
      </div>

      {/* Application Modal */}
      {isApplyModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-200 relative animate-in fade-in zoom-in-95">
            <button
              onClick={() => setIsApplyModalOpen(false)}
              className="absolute right-5 top-5 p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-xl font-bold text-slate-900 mb-1">Apply for {title}</h3>
            <p className="text-xs text-slate-500 mb-5">{company?.name} &bull; {location}</p>

            {appStatusMessage && (
              <div className={`p-3.5 rounded-xl mb-4 text-xs font-semibold flex items-center gap-2 ${
                appStatusMessage.type === 'success'
                  ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                  : 'bg-red-50 text-red-800 border border-red-200'
              }`}>
                {appStatusMessage.type === 'success' ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                ) : (
                  <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0" />
                )}
                <span>{appStatusMessage.text}</span>
              </div>
            )}

            <form onSubmit={handleApplySubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Resume Link / URL <span className="text-red-500">*</span>
                </label>
                <input
                  type="url"
                  required
                  placeholder="https://drive.google.com/... or GitHub Pages link"
                  value={resumeUrl}
                  onChange={(e) => setResumeUrl(e.target.value)}
                  className="w-full text-xs text-slate-800 px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:border-brand-500"
                />
                <p className="text-[10px] text-slate-400 mt-1">Make sure viewing permissions are set to public/viewable</p>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Cover Message / Introduction
                </label>
                <textarea
                  rows={4}
                  placeholder="Briefly state why you are interested in this position and what relevant skills or projects make you a strong candidate..."
                  value={coverLetter}
                  onChange={(e) => setCoverLetter(e.target.value)}
                  className="w-full text-xs text-slate-800 p-3.5 rounded-xl border border-slate-300 focus:outline-none focus:border-brand-500"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsApplyModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submittingApp}
                  className="px-5 py-2.5 bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs rounded-xl shadow-sm transition-all flex items-center gap-1.5 disabled:opacity-50"
                >
                  <Send className="w-3.5 h-3.5" />
                  {submittingApp ? 'Submitting...' : 'Submit Application'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default OpportunityDetailPage;
