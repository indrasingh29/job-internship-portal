import React from 'react';
import { Link } from 'react-router-dom';
import { Building2, MapPin, Users, ArrowUpRight, Briefcase } from 'lucide-react';

const CompanyCard = ({ company }) => {
  const {
    _id,
    name,
    slug,
    industry,
    description,
    headquarters,
    employeeCount,
    activeJobsCount = 0,
    isDemo = true
  } = company;

  const getCompanyColor = (str = '') => {
    const gradients = [
      'from-blue-600 to-indigo-600',
      'from-indigo-600 to-violet-600',
      'from-emerald-600 to-teal-600',
      'from-rose-600 to-pink-600',
      'from-amber-600 to-orange-600',
      'from-purple-600 to-indigo-700'
    ];
    let hash = 0;
    for (let i = 0; i < str.length; i++) hash += str.charCodeAt(i);
    return gradients[hash % gradients.length];
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm hover:shadow-md hover:border-brand-200 transition-all flex flex-col justify-between group">
      <div>
        {/* Header: Avatar, Name, Industry, and Demo indicator */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-center gap-3">
            <div className={`w-12 h-12 rounded-xl bg-gradient-to-tr ${getCompanyColor(name)} flex items-center justify-center text-white font-bold text-xl shadow-sm flex-shrink-0`}>
              {name.charAt(0)}
            </div>
            <div>
              <Link to={`/company/${slug || _id}`}>
                <h3 className="font-bold text-slate-900 group-hover:text-brand-600 transition-colors text-base line-clamp-1">
                  {name}
                </h3>
              </Link>
              <span className="inline-block text-[11px] font-medium text-brand-700 bg-brand-50 border border-brand-200 px-2 py-0.5 rounded-full mt-0.5">
                {industry}
              </span>
            </div>
          </div>

          {isDemo && (
            <span className="text-[10px] font-semibold bg-amber-50 text-amber-700 border border-amber-200 px-1.5 py-0.5 rounded flex-shrink-0" title="Academic demo directory record">
              Demo Profile
            </span>
          )}
        </div>

        {/* Description snippet */}
        <p className="text-xs text-slate-600 leading-relaxed mb-4 line-clamp-2">
          {description}
        </p>

        {/* Headquarters & Size metadata */}
        <div className="space-y-1.5 text-xs text-slate-500 mb-4">
          <div className="flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-slate-400" />
            <span>{headquarters || 'India'}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Users className="w-3.5 h-3.5 text-slate-400" />
            <span>{employeeCount || '1000+'} employees</span>
          </div>
        </div>
      </div>

      {/* Footer: Openings count + View profile link */}
      <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
        <span className="inline-flex items-center gap-1 font-semibold text-slate-700 bg-slate-100 px-2.5 py-1 rounded-md">
          <Briefcase className="w-3.5 h-3.5 text-slate-500" />
          {activeJobsCount} {activeJobsCount === 1 ? 'Opening' : 'Openings'}
        </span>

        <Link
          to={`/company/${slug || _id}`}
          className="flex items-center gap-1 font-semibold text-brand-600 hover:text-brand-700 group-hover:translate-x-0.5 transition-all"
        >
          View Profile
          <ArrowUpRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
};

export default CompanyCard;
