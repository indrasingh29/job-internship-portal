import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import api from '../services/api';
import OpportunityCard from '../components/OpportunityCard';
import { CardSkeleton } from '../components/SkeletonLoader';
import {
  Search,
  MapPin,
  SlidersHorizontal,
  RotateCcw,
  ChevronLeft,
  ChevronRight,
  GraduationCap
} from 'lucide-react';

const BrowseInternshipsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const [internships, setInternships] = useState([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);

  // Filter States
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [location, setLocation] = useState(searchParams.get('location') || '');
  const [workplaceType, setWorkplaceType] = useState(searchParams.get('workplaceType') || 'All');
  const [category, setCategory] = useState(searchParams.get('category') || 'All');
  const [sort, setSort] = useState(searchParams.get('sort') || 'latest');
  const [page, setPage] = useState(parseInt(searchParams.get('page'), 10) || 1);

  useEffect(() => {
    const fetchInternships = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        params.append('opportunityType', 'Internship');
        if (search) params.append('search', search);
        if (location) params.append('location', location);
        if (workplaceType && workplaceType !== 'All') params.append('workplaceType', workplaceType);
        if (category && category !== 'All') params.append('category', category);
        if (sort) params.append('sort', sort);
        params.append('page', page);
        params.append('limit', '9');

        const res = await api.get(`/jobs?${params.toString()}`);
        if (res.data.success) {
          setInternships(res.data.jobs);
          setTotal(res.data.total);
          setTotalPages(res.data.pages);
        }
      } catch (err) {
        console.error('Failed to load internships:', err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchInternships();
  }, [search, location, workplaceType, category, sort, page]);

  const handleResetFilters = () => {
    setSearch('');
    setLocation('');
    setWorkplaceType('All');
    setCategory('All');
    setSort('latest');
    setPage(1);
    setSearchParams({});
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-semibold bg-purple-50 text-purple-700 border border-purple-200 px-2 py-0.5 rounded flex items-center gap-1">
              <GraduationCap className="w-3.5 h-3.5" />
              Student Program
            </span>
            <span className="text-xs font-medium text-slate-500">{total} Internships Available</span>
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Explore Tech Internships
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            High-stipend summer and semester internships across AI, software, cloud, and QA domains.
          </p>
        </div>

        {/* Sorting Dropdown */}
        <div className="flex items-center gap-3">
          <label className="text-xs font-semibold text-slate-600">Sort by:</label>
          <select
            value={sort}
            onChange={(e) => { setSort(e.target.value); setPage(1); }}
            className="text-xs font-semibold text-slate-700 bg-white border border-slate-300 rounded-xl px-3 py-2 focus:outline-none focus:border-brand-500"
          >
            <option value="latest">Latest Openings</option>
            <option value="salary_high">Highest Stipend</option>
            <option value="deadline">Application Deadline</option>
          </select>
        </div>
      </div>

      {/* Main Grid: Filters + Internships List */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <aside className="lg:col-span-1 space-y-6">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <span className="font-bold text-sm text-slate-900 flex items-center gap-2">
                <SlidersHorizontal className="w-4 h-4 text-purple-600" />
                Internship Filters
              </span>
              <button
                onClick={handleResetFilters}
                className="text-xs text-brand-600 hover:text-brand-800 flex items-center gap-1 font-medium"
              >
                <RotateCcw className="w-3 h-3" /> Reset
              </button>
            </div>

            {/* Keyword Search */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">Search Role or Tech</label>
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="text"
                  placeholder="e.g. Python, AI, QA, UI/UX"
                  value={search}
                  onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                  className="w-full text-xs text-slate-800 pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-brand-500"
                />
              </div>
            </div>

            {/* Location */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">Location</label>
              <div className="relative">
                <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="text"
                  placeholder="e.g. Bangalore, Hyderabad, Remote"
                  value={location}
                  onChange={(e) => { setLocation(e.target.value); setPage(1); }}
                  className="w-full text-xs text-slate-800 pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-brand-500"
                />
              </div>
            </div>

            {/* Workplace Type */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700">Workplace Mode</label>
              <div className="grid grid-cols-2 gap-2 text-xs">
                {['All', 'Remote', 'Hybrid', 'Onsite'].map((mode) => (
                  <button
                    key={mode}
                    type="button"
                    onClick={() => { setWorkplaceType(mode); setPage(1); }}
                    className={`py-1.5 px-3 rounded-lg font-medium border text-center transition-colors ${
                      workplaceType === mode
                        ? 'bg-purple-600 text-white border-purple-600 shadow-2xs'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {mode}
                  </button>
                ))}
              </div>
            </div>

            {/* Category Dropdown */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">Domain Specialization</label>
              <select
                value={category}
                onChange={(e) => { setCategory(e.target.value); setPage(1); }}
                className="w-full text-xs text-slate-700 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 focus:outline-none focus:border-brand-500"
              >
                <option value="All">All Specializations</option>
                <option value="Software Engineering">Software Engineering</option>
                <option value="Data & AI">Data & Artificial Intelligence</option>
                <option value="Cloud & DevOps">Cloud & DevOps</option>
                <option value="QA & Testing">QA & Test Automation</option>
                <option value="UI/UX Design">UI/UX Design</option>
                <option value="Cybersecurity">Cybersecurity</option>
                <option value="Business Analysis">Business Analysis</option>
              </select>
            </div>
          </div>
        </aside>

        {/* Results Area */}
        <main className="lg:col-span-3 space-y-6">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <CardSkeleton />
              <CardSkeleton />
              <CardSkeleton />
              <CardSkeleton />
            </div>
          ) : internships.length === 0 ? (
            <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center space-y-4">
              <div className="w-12 h-12 bg-purple-50 rounded-full flex items-center justify-center mx-auto text-purple-600">
                <GraduationCap className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-slate-800 text-lg">No internships found for these filters</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Try selecting "All Specializations" or clearing specific location constraints.
              </p>
              <button
                onClick={handleResetFilters}
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-purple-50 text-purple-700 font-semibold text-xs rounded-xl hover:bg-purple-100 transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" /> Reset Filters
              </button>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {internships.map((internship) => (
                  <OpportunityCard key={internship._id} opportunity={internship} />
                ))}
              </div>

              {totalPages > 1 && (
                <div className="flex items-center justify-between pt-6 border-t border-slate-200">
                  <button
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
        </main>
      </div>
    </div>
  );
};

export default BrowseInternshipsPage;
