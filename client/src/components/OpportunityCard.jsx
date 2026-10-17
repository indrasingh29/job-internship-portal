import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  MapPin,
  Building2,
  Calendar,
  Bookmark,
  Briefcase,
  Sparkles,
  ArrowRight,
  Clock
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

const OpportunityCard = ({ opportunity, isBookmarked: initialBookmarked = false, onBookmarkToggle }) => {
  const { isStudent } = useAuth();
  const [bookmarked, setBookmarked] = useState(initialBookmarked);
  const [loadingBookmark, setLoadingBookmark] = useState(false);

  const {
    _id,
    title,
    company,
    opportunityType,
    workplaceType,
    location,
    salaryMin,
    salaryMax,
    stipendAmount,
    requiredSkills,
    deadline,
    isFresherEligible,
    isDemo
  } = opportunity;

  const handleBookmark = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isStudent || loadingBookmark) return;

    setLoadingBookmark(true);
    try {
      if (bookmarked) {
        await api.delete(`/saved-jobs/${_id}`);
        setBookmarked(false);
      } else {
        await api.post(`/saved-jobs/${_id}`);
        setBookmarked(true);
      }
      if (onBookmarkToggle) onBookmarkToggle(_id, !bookmarked);
    } catch (err) {
      console.error('Bookmark error:', err.message);
    } finally {
      setLoadingBookmark(false);
    }
  };

  // Format compensation
  const formatCompensation = () => {
    if (opportunityType === 'Internship') {
      return stipendAmount ? `₹${stipendAmount.toLocaleString()}/mo` : 'Stipend Disclosed Upon Interview';
    }
    if (salaryMin || salaryMax) {
      return `₹${salaryMin || 0} - ${salaryMax || 0} LPA`;
    }
    return 'Competitive';
  };

  // Format deadline
  const formatDeadline = () => {
    if (!deadline) return 'Ongoing';
    const d = new Date(deadline);
    const now = new Date();
    const diffDays = Math.ceil((d - now) / (1000 * 60 * 60 * 24));
    if (diffDays <= 0) return 'Expired';
    if (diffDays === 1) return '1 day left';
    return `${diffDays} days left`;
  };

  // Color generator for company avatar placeholder
  const getCompanyColor = (name = 'Company') => {
    const colors = [
      'from-blue-600 to-indigo-600',
      'from-indigo-600 to-violet-600',
      'from-emerald-600 to-teal-600',
      'from-rose-600 to-pink-600',
      'from-amber-600 to-orange-600',
      'from-purple-600 to-indigo-700'
    ];
    let hash = 0;
    for (let i = 0; i < name.length; i++) hash += name.charCodeAt(i);
    return colors[hash % colors.length];
  };

  const companyName = company?.name || 'Partner Company';
  const companyInitial = companyName.charAt(0);

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm hover:shadow-md hover:border-brand-200 transition-all flex flex-col justify-between group">
      <div>
        {/* Top bar: Company Avatar + Name + Badges + Bookmark */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-center gap-3">
            <div className={`w-11 h-11 rounded-xl bg-gradient-to-tr ${getCompanyColor(companyName)} flex items-center justify-center text-white font-bold text-lg shadow-sm flex-shrink-0`}>
              {companyInitial}
            </div>
            <div>
              <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-1">
                <Building2 className="w-3.5 h-3.5" />
                {companyName}
              </h4>
              <Link to={`/opportunity/${_id}`}>
                <h3 className="font-bold text-slate-900 group-hover:text-brand-600 transition-colors text-base line-clamp-1">
                  {title}
                </h3>
              </Link>
            </div>
          </div>

          {/* Bookmark Button (For students) */}
          {isStudent && (
            <button
              onClick={handleBookmark}
              disabled={loadingBookmark}
              aria-label={bookmarked ? 'Remove Bookmark' : 'Bookmark Opportunity'}
              className={`p-2 rounded-lg transition-colors ${
                bookmarked
                  ? 'text-brand-600 bg-brand-50 hover:bg-brand-100'
                  : 'text-slate-400 hover:text-slate-600 hover:bg-slate-100'
              }`}
            >
              <Bookmark className={`w-4 h-4 ${bookmarked ? 'fill-current' : ''}`} />
            </button>
          )}
        </div>

        {/* Location & Workplace pill */}
        <div className="flex flex-wrap items-center gap-2 mb-3 text-xs text-slate-600">
          <span className="flex items-center gap-1 bg-slate-100 px-2.5 py-1 rounded-md">
            <MapPin className="w-3.5 h-3.5 text-slate-500" />
            {location}
          </span>
          <span className={`px-2.5 py-1 rounded-md font-medium ${
            workplaceType === 'Remote'
              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
              : workplaceType === 'Hybrid'
              ? 'bg-blue-50 text-blue-700 border border-blue-200'
              : 'bg-slate-100 text-slate-700'
          }`}>
            {workplaceType}
          </span>
          <span className="bg-purple-50 text-purple-700 border border-purple-200 px-2.5 py-1 rounded-md font-medium">
            {opportunityType}
          </span>
          {isFresherEligible && (
            <span className="bg-amber-50 text-amber-700 border border-amber-200 px-2 py-0.5 rounded text-[11px] font-semibold">
              Fresher Eligible
            </span>
          )}
        </div>

        {/* Skills Tags */}
        <div className="flex flex-wrap gap-1.5 mb-4">
          {requiredSkills?.slice(0, 4).map((skill, index) => (
            <span
              key={index}
              className="text-[11px] font-medium bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md"
            >
              {skill}
            </span>
          ))}
          {requiredSkills?.length > 4 && (
            <span className="text-[11px] font-medium text-slate-400 px-1 py-0.5">
              +{requiredSkills.length - 4} more
            </span>
          )}
        </div>
      </div>

      {/* Footer of Card: Compensation, Deadline, and Demo Badge */}
      <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
        <div>
          <p className="font-bold text-slate-900 text-sm">{formatCompensation()}</p>
          <p className="text-[11px] text-slate-400 flex items-center gap-1">
            <Clock className="w-3 h-3" /> {formatDeadline()}
          </p>
        </div>

        <div className="flex items-center gap-2">
          {isDemo && (
            <span className="text-[10px] font-semibold bg-amber-50 text-amber-700 border border-amber-200 px-2 py-0.5 rounded" title="Sample academic listing for demo">
              Demo Listing
            </span>
          )}
          <Link
            to={`/opportunity/${_id}`}
            className="flex items-center gap-1 font-semibold text-brand-600 hover:text-brand-700 bg-brand-50 hover:bg-brand-100 px-3 py-1.5 rounded-lg transition-colors"
          >
            Details
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default OpportunityCard;
