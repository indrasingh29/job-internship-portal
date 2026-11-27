import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import api from '../services/api';
import OpportunityCard from './OpportunityCard';
import { CardSkeleton } from './SkeletonLoader';
import {
  Search,
  MapPin,
  SlidersHorizontal,
  RotateCcw,
  ChevronLeft,
  ChevronRight,
  Briefcase,
  GraduationCap,
  AlertCircle,
  RefreshCw
} from 'lucide-react';

import { OPPORTUNITY_CATEGORIES } from '../constants/categories';

const OpportunityDiscovery = ({
  opportunityType = 'Job',
  embedded = false,
  syncUrl = true
}) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const isInternship = opportunityType === 'Internship';

  const [items, setItems] = useState([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [searchInput, setSearchInput] = useState(() => (syncUrl ? searchParams.get('search') || '' : ''));
  const [locationInput, setLocationInput] = useState(() => (syncUrl ? searchParams.get('location') || '' : ''));
  const [debouncedSearch, setDebouncedSearch] = useState(searchInput);
  const [debouncedLocation, setDebouncedLocation] = useState(locationInput);

  const [workplaceType, setWorkplaceType] = useState(() => (syncUrl ? searchParams.get('workplaceType') || 'All' : 'All'));
  const [jobType, setJobType] = useState(() => (syncUrl ? searchParams.get('jobType') || 'All' : 'All'));
  const [category, setCategory] = useState(() => (syncUrl ? searchParams.get('category') || 'All' : 'All'));
  const [isFresherEligible, setIsFresherEligible] = useState(() =>
    syncUrl ? searchParams.get('isFresherEligible') === 'true' : false
  );
  const [minComp, setMinComp] = useState(() => (syncUrl ? searchParams.get('minComp') || '' : ''));
  const [sort, setSort] = useState(() => (syncUrl ? searchParams.get('sort') || 'latest' : 'latest'));
  const [page, setPage] = useState(() => (syncUrl ? parseInt(searchParams.get('page'), 10) || 1 : 1));

  // Sync when URL searchParams change externally (e.g. clicking footer/navbar links while mounted)
  useEffect(() => {
    if (!syncUrl) return;
    const urlSearch = searchParams.get('search') || '';
    const urlLocation = searchParams.get('location') || '';
    const urlWorkplace = searchParams.get('workplaceType') || 'All';
    const urlJobType = searchParams.get('jobType') || 'All';
    const urlCategory = searchParams.get('category') || 'All';
    const urlFresher = searchParams.get('isFresherEligible') === 'true';
    const urlMinComp = searchParams.get('minComp') || '';
    const urlSort = searchParams.get('sort') || 'latest';
    const urlPage = parseInt(searchParams.get('page'), 10) || 1;

    setSearchInput(urlSearch);
    setDebouncedSearch(urlSearch);
    setLocationInput(urlLocation);
    setDebouncedLocation(urlLocation);
    setWorkplaceType(urlWorkplace);
    setJobType(urlJobType);
    setCategory(urlCategory);
    setIsFresherEligible(urlFresher);
    setMinComp(urlMinComp);
    setSort(urlSort);
    setPage(urlPage);
  }, [searchParams, syncUrl]);

  // Debounce text inputs
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchInput);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchInput]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedLocation(locationInput);
    }, 300);
    return () => clearTimeout(timer);
  }, [locationInput]);

  const fetchOpportunities = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      params.append('opportunityType', opportunityType);
      if (debouncedSearch.trim()) params.append('search', debouncedSearch.trim());
      if (debouncedLocation.trim()) params.append('location', debouncedLocation.trim());
      if (workplaceType !== 'All') params.append('workplaceType', workplaceType);
      if (!isInternship && jobType !== 'All') params.append('jobType', jobType);
      if (category !== 'All') params.append('category', category);
      if (isFresherEligible) params.append('isFresherEligible', 'true');
      if (minComp && Number(minComp) > 0) {
        params.append(isInternship ? 'minStipend' : 'minSalary', minComp);
      }
      if (sort) params.append('sort', sort);
      params.append('page', String(page));
      params.append('limit', embedded ? '6' : '9');

      const res = await api.get(`/jobs?${params.toString()}`);
      if (res.data.success) {
        setItems(res.data.jobs || []);
        setTotal(res.data.total || 0);
        setTotalPages(res.data.pages || 1);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to load opportunities right now.');
    } finally {
      setLoading(false);
    }
  }, [
    opportunityType,
    isInternship,
    debouncedSearch,
    debouncedLocation,
    workplaceType,
    jobType,
    category,
    isFresherEligible,
    minComp,
    sort,
    page,
    embedded
  ]);

  useEffect(() => {
    fetchOpportunities();
  }, [fetchOpportunities]);

  const handleResetFilters = () => {
    setSearchInput('');
    setLocationInput('');
    setDebouncedSearch('');
    setDebouncedLocation('');
    setWorkplaceType('All');
    setJobType('All');
    setCategory('All');
    setIsFresherEligible(false);
    setMinComp('');
    setSort('latest');
    setPage(1);
    if (syncUrl) setSearchParams({});
  };

  const hasActiveFilters =
    Boolean(searchInput) ||
    Boolean(locationInput) ||
    workplaceType !== 'All' ||
    jobType !== 'All' ||
    category !== 'All' ||
    isFresherEligible ||
    Boolean(minComp);

  return (
    <div className={embedded ? 'space-y-6' : 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8'}>
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-xs font-semibold bg-brand-50 text-brand-700 border border-brand-200 px-2.5 py-0.5 rounded-full inline-flex items-center gap-1">
              {isInternship ? <GraduationCap className="w-3.5 h-3.5" /> : <Briefcase className="w-3.5 h-3.5" />}
              {isInternship ? 'Internships' : 'Jobs'}
            </span>
            <span className="text-xs font-medium text-slate-500">
              {total} Active {isInternship ? (total === 1 ? 'Internship' : 'Internships') : (total === 1 ? 'Job' : 'Jobs')}
            </span>
          </div>
          <h1 className={`${embedded ? 'text-xl' : 'text-3xl'} font-extrabold text-slate-900 tracking-tight`}>
            {isInternship ? 'Explore Tech Internships' : 'Browse Tech Jobs'}
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            {isInternship
              ? 'Paid internships and early-career programs across engineering, AI, cloud, and product teams.'
              : 'Full-time, part-time, contract, and entry-level roles from hiring teams.'}
          </p>
        </div>

        {/* Sort */}
        <div className="flex items-center gap-2.5">
          <label htmlFor={`sort-${opportunityType}`} className="text-xs font-semibold text-slate-600">
            Sort by:
          </label>
          <select
            id={`sort-${opportunityType}`}
            value={sort}
            onChange={(e) => { setSort(e.target.value); setPage(1); }}
            className="text-xs font-semibold text-slate-700 bg-white border border-slate-300 rounded-xl px-3 py-2 focus:outline-none focus:border-brand-500"
          >
            <option value="latest">Latest Postings</option>
            <option value="salary_high">{isInternship ? 'Highest Stipend' : 'Highest Salary'}</option>
            <option value="salary_low">{isInternship ? 'Lowest Stipend' : 'Lowest Salary'}</option>
            <option value="deadline">Application Deadline</option>
          </select>
        </div>
      </div>

      {/* Filters + Results */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-7">
        {/* Sidebar Filters */}
        <aside className="lg:col-span-1">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <span className="font-bold text-sm text-slate-900 flex items-center gap-2">
                <SlidersHorizontal className="w-4 h-4 text-brand-600" />
                Filters
              </span>
              {hasActiveFilters && (
                <button
                  type="button"
                  onClick={handleResetFilters}
                  className="text-xs text-brand-600 hover:text-brand-800 flex items-center gap-1 font-semibold"
                >
                  <RotateCcw className="w-3 h-3" /> Clear all
                </button>
              )}
            </div>

            {/* Keyword */}
            <div className="space-y-1.5">
              <label htmlFor={`search-${opportunityType}`} className="text-xs font-bold text-slate-700">
                Title, Company, or Skill
              </label>
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  id={`search-${opportunityType}`}
                  type="text"
                  placeholder="e.g. React, Python, Google"
                  value={searchInput}
                  onChange={(e) => { setSearchInput(e.target.value); setPage(1); }}
                  className="w-full text-xs text-slate-800 pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-brand-500"
                />
              </div>
            </div>

            {/* Location */}
            <div className="space-y-1.5">
              <label htmlFor={`loc-${opportunityType}`} className="text-xs font-bold text-slate-700">
                Location
              </label>
              <div className="relative">
                <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  id={`loc-${opportunityType}`}
                  type="text"
                  placeholder="e.g. Bangalore, Pune, Remote"
                  value={locationInput}
                  onChange={(e) => { setLocationInput(e.target.value); setPage(1); }}
                  className="w-full text-xs text-slate-800 pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-brand-500"
                />
              </div>
            </div>

            {/* Workplace Mode */}
            <div className="space-y-2">
              <p className="text-xs font-bold text-slate-700">Workplace Type</p>
              <div className="grid grid-cols-2 gap-2 text-xs">
                {['All', 'Remote', 'Hybrid', 'Onsite'].map((mode) => (
                  <button
                    key={mode}
                    type="button"
                    onClick={() => { setWorkplaceType(mode); setPage(1); }}
                    className={`py-1.5 px-3 rounded-lg font-medium border text-center transition-colors ${
                      workplaceType === mode
                        ? 'bg-brand-600 text-white border-brand-600 shadow-2xs'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {mode}
                  </button>
                ))}
              </div>
            </div>

            {/* Job Type (for Jobs) */}
            {!isInternship && (
              <div className="space-y-1.5">
                <label htmlFor="job-type-filter" className="text-xs font-bold text-slate-700">
                  Job Type
                </label>
                <select
                  id="job-type-filter"
                  value={jobType}
                  onChange={(e) => { setJobType(e.target.value); setPage(1); }}
                  className="w-full text-xs text-slate-700 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 focus:outline-none focus:border-brand-500"
                >
                  <option value="All">All Job Types</option>
                  <option value="Full-time">Full-time</option>
                  <option value="Part-time">Part-time</option>
                  <option value="Contract">Contract</option>
                </select>
              </div>
            )}

            {/* Category */}
            <div className="space-y-1.5">
              <label htmlFor={`cat-${opportunityType}`} className="text-xs font-bold text-slate-700">
                Category
              </label>
              <select
                id={`cat-${opportunityType}`}
                value={category}
                onChange={(e) => { setCategory(e.target.value); setPage(1); }}
                className="w-full text-xs text-slate-700 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 focus:outline-none focus:border-brand-500"
              >
                <option value="All">All Categories</option>
                {OPPORTUNITY_CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            {/* Minimum Compensation */}
            <div className="space-y-1.5">
              <label htmlFor={`comp-${opportunityType}`} className="text-xs font-bold text-slate-700">
                {isInternship ? 'Minimum Stipend (₹/month)' : 'Minimum Salary (LPA)'}
              </label>
              <select
                id={`comp-${opportunityType}`}
                value={minComp}
                onChange={(e) => { setMinComp(e.target.value); setPage(1); }}
                className="w-full text-xs text-slate-700 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 focus:outline-none focus:border-brand-500"
              >
                <option value="">Any Compensation</option>
                {isInternship ? (
                  <>
                    <option value="15000">₹15,000+ / mo</option>
                    <option value="25000">₹25,000+ / mo</option>
                    <option value="40000">₹40,000+ / mo</option>
                    <option value="60000">₹60,000+ / mo</option>
                  </>
                ) : (
                  <>
                    <option value="5">₹5+ LPA</option>
                    <option value="10">₹10+ LPA</option>
                    <option value="15">₹15+ LPA</option>
                    <option value="20">₹20+ LPA</option>
                  </>
                )}
              </select>
            </div>

            {/* Fresher Eligible */}
            <div className="pt-1">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={isFresherEligible}
                  onChange={(e) => { setIsFresherEligible(e.target.checked); setPage(1); }}
                  className="w-4 h-4 text-brand-600 rounded border-slate-300 focus:ring-brand-500"
                />
                <span className="text-xs font-bold text-slate-800">
                  Fresher Eligible Only
                </span>
              </label>
              <p className="text-[11px] text-slate-400 pl-6 mt-0.5">
                Show roles open to students &amp; recent graduates
              </p>
            </div>
          </div>
        </aside>

        {/* Results */}
        <div className="lg:col-span-3 space-y-6">
          {error ? (
            <div className="bg-white rounded-2xl border border-red-200 p-10 text-center space-y-3">
              <AlertCircle className="w-10 h-10 text-red-500 mx-auto" />
              <h3 className="font-bold text-slate-900 text-base">Failed to load opportunities</h3>
              <p className="text-xs text-slate-500">{error}</p>
              <button
                type="button"
                onClick={fetchOpportunities}
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-brand-600 text-white font-semibold text-xs rounded-xl hover:bg-brand-700 transition-colors"
              >
                <RefreshCw className="w-3.5 h-3.5" /> Retry
              </button>
            </div>
          ) : loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <CardSkeleton />
              <CardSkeleton />
              <CardSkeleton />
              <CardSkeleton />
            </div>
          ) : items.length === 0 ? (
            <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center space-y-4">
              <div className="w-12 h-12 bg-brand-50 rounded-full flex items-center justify-center mx-auto text-brand-600">
                {isInternship ? <GraduationCap className="w-6 h-6" /> : <Briefcase className="w-6 h-6" />}
              </div>
              <h3 className="font-bold text-slate-800 text-lg">
                No {isInternship ? 'internships' : 'jobs'} matched your filters
              </h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Try broadening your search terms, clearing location filters, or resetting your filter selections.
              </p>
              <button
                type="button"
                onClick={handleResetFilters}
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-brand-50 text-brand-700 font-semibold text-xs rounded-xl hover:bg-brand-100 transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" /> Reset Filters
              </button>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {items.map((item) => (
                  <OpportunityCard key={item._id} opportunity={item} />
                ))}
              </div>

              {totalPages > 1 && (
                <div className="flex items-center justify-between pt-6 border-t border-slate-200">
                  <button
                    type="button"
                    onClick={() => setPage((p) => Math.max(p - 1, 1))}
                    disabled={page === 1}
                    className="flex items-center gap-1 text-xs font-semibold px-4 py-2 rounded-xl border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <ChevronLeft className="w-4 h-4" /> Previous
                  </button>

                  <span className="text-xs font-medium text-slate-600">
                    Page <strong className="text-slate-900">{page}</strong> of <strong className="text-slate-900">{totalPages}</strong>
                  </span>

                  <button
                    type="button"
                    onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
                    disabled={page === totalPages}
                    className="flex items-center gap-1 text-xs font-semibold px-4 py-2 rounded-xl border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    Next <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default OpportunityDiscovery;
