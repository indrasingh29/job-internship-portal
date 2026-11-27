import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../services/api';
import OpportunityCard from '../components/OpportunityCard';
import { CardSkeleton } from '../components/SkeletonLoader';
import { safeExternalUrl } from '../utils/safeUrl';
import {
  MapPin,
  Users,
  Globe,
  ExternalLink,
  ChevronLeft,
  Briefcase,
  Info
} from 'lucide-react';

const CompanyDetailPage = () => {
  const { identifier } = useParams();
  const [company, setCompany] = useState(null);
  const [opportunities, setOpportunities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCompanyDetails = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await api.get(`/companies/${identifier}`);
        if (res.data.success) {
          setCompany(res.data.company);
          setOpportunities(res.data.company.opportunities || []);
        }
      } catch (err) {
        console.error('Failed to load company:', err.message);
        setError('Company profile not found.');
      } finally {
        setLoading(false);
      }
    };

    fetchCompanyDetails();
  }, [identifier]);

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-12 space-y-6">
        <div className="h-40 bg-slate-200 rounded-3xl animate-pulse" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <CardSkeleton />
          <CardSkeleton />
        </div>
      </div>
    );
  }

  if (error || !company) {
    return (
      <div className="max-w-md mx-auto px-4 py-16 text-center space-y-4">
        <div className="w-12 h-12 bg-red-50 text-red-600 rounded-full flex items-center justify-center mx-auto">
          <Info className="w-6 h-6" />
        </div>
        <h2 className="text-xl font-bold text-slate-900">Company Not Found</h2>
        <p className="text-xs text-slate-500">{error || 'Could not find the requested company profile.'}</p>
        <Link
          to="/companies"
          className="inline-flex items-center gap-2 text-xs font-semibold text-brand-600 hover:text-brand-700"
        >
          <ChevronLeft className="w-4 h-4" /> Back to Companies
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      <Link
        to="/companies"
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-800 transition-colors"
      >
        <ChevronLeft className="w-4 h-4" /> Back to Companies
      </Link>

      {/* Company Header */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-2xs">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-brand-600 to-indigo-700 flex items-center justify-center text-white font-extrabold text-3xl shadow-sm flex-shrink-0">
              {company.name.charAt(0).toUpperCase()}
            </div>
            <div className="space-y-1.5">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">{company.name}</h1>
              <p className="text-xs font-semibold text-brand-700 bg-brand-50 inline-block px-2.5 py-0.5 rounded-md">
                {company.industry}
              </p>
            </div>
          </div>

          {safeExternalUrl(company.website) && (
            <a
              href={safeExternalUrl(company.website)}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 px-4 py-2.5 rounded-xl transition-colors"
            >
              <Globe className="w-4 h-4 text-slate-500" />
              Visit Website
              <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
            </a>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6 mt-6 border-t border-slate-100 text-xs text-slate-600">
          <div>
            <p className="text-slate-400 font-medium">Headquarters</p>
            <p className="font-semibold text-slate-800 flex items-center gap-1 mt-0.5">
              <MapPin className="w-3.5 h-3.5 text-slate-400" />
              {company.headquarters || 'India'}
            </p>
          </div>
          <div>
            <p className="text-slate-400 font-medium">Company Size</p>
            <p className="font-semibold text-slate-800 flex items-center gap-1 mt-0.5">
              <Users className="w-3.5 h-3.5 text-slate-400" />
              {company.employeeCount || '1,000+'} employees
            </p>
          </div>
          <div>
            <p className="text-slate-400 font-medium">Open Positions</p>
            <p className="font-semibold text-brand-600 flex items-center gap-1 mt-0.5">
              <Briefcase className="w-3.5 h-3.5" />
              {opportunities.length} active
            </p>
          </div>
        </div>

        <div className="pt-6 mt-6 border-t border-slate-100">
          <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2">About {company.name}</h2>
          <p className="text-sm text-slate-600 leading-relaxed max-w-4xl">
            {company.description}
          </p>
        </div>
      </div>

      {/* Active Listings */}
      <div className="space-y-6">
        <div>
          <h2 className="text-xl font-bold text-slate-900">
            Open Opportunities at {company.name}
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            {opportunities.length} active position{opportunities.length === 1 ? '' : 's'}
          </p>
        </div>

        {opportunities.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center text-xs text-slate-500">
            No active positions listed for this company right now.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {opportunities.map((opp) => (
              <OpportunityCard key={opp._id} opportunity={{ ...opp, company }} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CompanyDetailPage;
