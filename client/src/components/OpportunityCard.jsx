import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  MapPin,
  Building2,
  Bookmark,
  ArrowRight,
  Clock,
  CalendarDays
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const OpportunityCard = ({ opportunity, isBookmarked: propBookmarked, onBookmarkToggle }) => {
  const { isAuthenticated, isStudent, isJobSaved, toggleSaveJob } = useAuth();
  const navigate = useNavigate();
  const [loadingBookmark, setLoadingBookmark] = useState(false);

  const {
    _id,
    title,
    company,
    opportunityType,
    jobType,
    workplaceType,
    location,
    salaryMin,
    salaryMax,
    stipendAmount,
    requiredSkills,
    deadline,
    createdAt,
    isFresherEligible,
    status
  } = opportunity;

  const bookmarked = propBookmarked !== undefined ? propBookmarked : isJobSaved(_id);

  const handleBookmark = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    if (!isStudent || loadingBookmark) return;

    setLoadingBookmark(true);
    try {
      const nextState = await toggleSaveJob(_id);
      if (onBookmarkToggle) {
        onBookmarkToggle(_id, nextState);
      }
    } catch (err) {
      console.error('Bookmark error:', err.message);
    } finally {
      setLoadingBookmark(false);
    }
  };

  const formatCompensation = () => {
    if (opportunityType === 'Internship') {
      return stipendAmount ? `₹${Number(stipendAmount).toLocaleString()}/mo` : 'Stipend disclosed on interview';
    }
    if (salaryMin && salaryMax) {
      return `₹${salaryMin} – ${salaryMax} LPA`;
    }
    if (salaryMax) {
      return `Up to ₹${salaryMax} LPA`;
    }
    return 'Competitive salary';
  };

  const formatPostedDate = () => {
    if (!createdAt) return null;
    const diffDays = Math.floor((Date.now() - new Date(createdAt).getTime()) / (1000 * 60 * 60 * 24));
    if (diffDays <= 0) return 'Posted today';
    if (diffDays === 1) return 'Posted yesterday';
    if (diffDays < 30) return `Posted ${diffDays}d ago`;
    return `Posted ${new Date(createdAt).toLocaleDateString()}`;
  };

  const formatDeadline = () => {
    if (!deadline) return 'Rolling deadline';
    const d = new Date(deadline);
    const diffDays = Math.ceil((d - new Date()) / (1000 * 60 * 60 * 24));
    if (status === 'Closed' || diffDays <= 0) return 'Closed';
    if (diffDays === 1) return '1 day left';
    return `${diffDays} days left`;
  };

  const getCompanyColor = (name = 'Company') => {
    const colors = [
      'from-slate-800 to-slate-900',
      'from-brand-600 to-indigo-700',
      'from-indigo-600 to-blue-700',
      'from-emerald-600 to-teal-700',
      'from-violet-600 to-purple-700'
    ];
    let hash = 0;
    for (let i = 0; i < name.length; i++) hash += name.charCodeAt(i);
    return colors[hash % colors.length];
  };

  const companyName = company?.name || 'Hiring Partner';
  const companyInitial = companyName.charAt(0).toUpperCase();
  const isUnavailable = status === 'Closed' || (deadline && new Date(deadline) < new Date());

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-2xs card-hover flex flex-col justify-between group">
      <div>
        {/* Top bar */}
        <div className="flex items-start justify-between gap-3 mb-3.5">
          <div className="flex items-center gap-3 min-w-0">
            <div className={`w-11 h-11 rounded-xl bg-gradient-to-tr ${getCompanyColor(companyName)} flex items-center justify-center text-white font-bold text-base shadow-xs flex-shrink-0`}>
              {companyInitial}
            </div>
            <div className="min-w-0">
              <p className="text-xs font-semibold text-slate-500 flex items-center gap-1 truncate">
                <Building2 className="w-3.5 h-3.5 flex-shrink-0 text-slate-400" />
                <span className="truncate">{companyName}</span>
              </p>
              <Link to={`/opportunity/${_id}`}>
                <h3 className="font-bold text-slate-900 group-hover:text-brand-600 transition-colors text-base line-clamp-1">
                  {title}
                </h3>
              </Link>
            </div>
          </div>

          {/* Save button */}
          {(!isAuthenticated || isStudent) && (
            <button
              type="button"
              onClick={handleBookmark}
              disabled={loadingBookmark}
              aria-label={bookmarked ? 'Remove from saved jobs' : 'Save opportunity'}
              title={isStudent ? (bookmarked ? 'Saved' : 'Save opportunity') : 'Sign in as a student to save'}
              className={`p-2 rounded-lg transition-colors flex-shrink-0 ${
                bookmarked
                  ? 'text-brand-600 bg-brand-50 hover:bg-brand-100'
                  : 'text-slate-400 hover:text-slate-700 hover:bg-slate-100'
              }`}
            >
              <Bookmark className={`w-4 h-4 ${bookmarked ? 'fill-current' : ''}`} />
            </button>
          )}
        </div>

        {/* Badges */}
        <div className="flex flex-wrap items-center gap-1.5 mb-3.5 text-xs">
          <span className="inline-flex items-center gap-1 bg-slate-100 text-slate-700 px-2.5 py-1 rounded-md">
            <MapPin className="w-3.5 h-3.5 text-slate-400" />
            {location}
          </span>
          <span className={`px-2.5 py-1 rounded-md font-medium ${
            workplaceType === 'Remote'
              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200/80'
              : workplaceType === 'Hybrid'
              ? 'bg-sky-50 text-sky-700 border border-sky-200/80'
              : 'bg-slate-100 text-slate-700'
          }`}>
            {workplaceType}
          </span>
          <span className="bg-brand-50 text-brand-700 border border-brand-200/80 px-2.5 py-1 rounded-md font-medium">
            {jobType || opportunityType}
          </span>
          {isFresherEligible && (
            <span className="bg-amber-50 text-amber-800 border border-amber-200/80 px-2 py-1 rounded-md text-[11px] font-medium">
              Fresher Eligible
            </span>
          )}
        </div>

        {/* Skills */}
        {requiredSkills?.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-4">
            {requiredSkills.slice(0, 4).map((skill, index) => (
              <span
                key={index}
                className="text-[11px] font-medium bg-slate-50 border border-slate-200 text-slate-600 px-2 py-0.5 rounded-md"
              >
                {skill}
              </span>
            ))}
            {requiredSkills.length > 4 && (
              <span className="text-[11px] font-medium text-slate-400 px-1 py-0.5">
                +{requiredSkills.length - 4}
              </span>
            )}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="pt-3.5 border-t border-slate-100 flex items-center justify-between gap-2 text-xs">
        <div className="min-w-0">
          <p className="font-bold text-slate-900 text-sm truncate">{formatCompensation()}</p>
          <div className="flex items-center gap-2.5 text-[11px] text-slate-400 mt-0.5 flex-wrap">
            {formatPostedDate() && (
              <span className="inline-flex items-center gap-1">
                <CalendarDays className="w-3 h-3" /> {formatPostedDate()}
              </span>
            )}
            <span className={`inline-flex items-center gap-1 ${isUnavailable ? 'text-red-500 font-medium' : ''}`}>
              <Clock className="w-3 h-3" /> {formatDeadline()}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-shrink-0">
          <Link
            to={`/opportunity/${_id}`}
            className="inline-flex items-center gap-1 font-semibold text-brand-700 hover:text-brand-800 bg-brand-50 hover:bg-brand-100 px-3 py-1.5 rounded-lg transition-colors"
          >
            {isUnavailable ? 'View' : 'Apply'}
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default OpportunityCard;
